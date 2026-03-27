import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Check, X, Shield, Lock } from 'lucide-react';
import { format } from 'date-fns';

type AdminUser = {
  user_id: string;
  role: string;
  full_name: string | null;
  email?: string;
  created_at?: string;
};

type AccessRequest = {
  id: string;
  user_id: string;
  user_name: string | null;
  user_email: string | null;
  requested_role: string;
  status: string;
  reviewed_by: string | null;
  review_reason: string | null;
  reviewed_at: string | null;
  created_at: string;
};

const roleBadgeColor: Record<string, string> = {
  admin: 'bg-primary/15 text-primary',
  moderator: 'bg-warning/15 text-warning',
  coach: 'bg-success/15 text-success',
  user: 'bg-muted text-muted-foreground',
};

const AdminUsersPage = () => {
  const { user: authUser } = useAuth();
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [history, setHistory] = useState<AccessRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewDialog, setReviewDialog] = useState<{ request: AccessRequest; action: 'approve' | 'reject' } | null>(null);
  const [reviewRole, setReviewRole] = useState('admin');
  const [reviewReason, setReviewReason] = useState('');

  const fetchData = async () => {
    setLoading(true);
    // Get all users with admin/moderator roles
    const { data: roles } = await supabase
      .from('user_roles')
      .select('user_id, role')
      .in('role', ['admin', 'moderator']);

    if (roles) {
      // Get profile names for these users
      const userIds = roles.map(r => r.user_id);
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', userIds);

      const profileMap = new Map((profiles || []).map(p => [p.id, p.full_name]));
      setAdmins(roles.map(r => ({
        user_id: r.user_id,
        role: r.role,
        full_name: profileMap.get(r.user_id) || null,
      })));
    }

    // Get pending access requests
    const { data: pendingReqs } = await supabase
      .from('admin_access_requests')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });
    if (pendingReqs) setRequests(pendingReqs as any);

    // Get resolved access requests
    const { data: resolvedReqs } = await supabase
      .from('admin_access_requests')
      .select('*')
      .neq('status', 'pending')
      .order('reviewed_at', { ascending: false });
    if (resolvedReqs) setHistory(resolvedReqs as any);

    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleReview = async () => {
    if (!reviewDialog) return;
    const { request, action } = reviewDialog;

    if (action === 'approve') {
      // Add role to user_roles
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({ user_id: request.user_id, role: reviewRole as any });
      if (roleError && !roleError.message.includes('duplicate')) {
        toast.error('Failed to assign role');
        return;
      }
    }

    // Update the request
    const { error } = await supabase
      .from('admin_access_requests')
      .update({
        status: action === 'approve' ? 'approved' : 'rejected',
        reviewed_by: authUser?.id,
        reviewed_at: new Date().toISOString(),
        review_reason: reviewReason || null,
      })
      .eq('id', request.id);

    if (error) { toast.error('Failed to update request'); return; }
    toast.success(`Request ${action === 'approve' ? 'approved' : 'rejected'}`);
    setReviewDialog(null);
    setReviewReason('');
    fetchData();
  };

  const handleRevokeAccess = async (userId: string, role: string) => {
    if (!confirm('Revoke this user\'s admin access?')) return;
    const { error } = await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userId)
      .eq('role', role as any);
    if (error) { toast.error('Failed to revoke'); return; }
    toast.success('Access revoked');
    fetchData();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-8 lg:p-12 max-w-6xl mx-auto"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-foreground">Admin Users</h1>
        <p className="text-muted-foreground mt-1">Manage admin access levels and approvals</p>
      </div>

      <Tabs defaultValue="current">
        <TabsList className="mb-6">
          <TabsTrigger value="current">Current Admins</TabsTrigger>
          <TabsTrigger value="pending" className="relative">
            Pending Requests
            {requests.length > 0 && (
              <Badge className="ml-2 h-5 w-5 p-0 text-[10px] flex items-center justify-center bg-destructive text-destructive-foreground">
                {requests.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="history">Approval History</TabsTrigger>
        </TabsList>

        {/* Current Admins */}
        <TabsContent value="current">
          <div className="rounded-lg border border-border bg-card overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-semibold">Name</TableHead>
                  <TableHead className="font-semibold">Access Level</TableHead>
                  <TableHead className="font-semibold">2FA Status</TableHead>
                  <TableHead className="font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-12">Loading...</TableCell></TableRow>
                ) : admins.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-16">
                      <div className="flex flex-col items-center gap-3">
                        <Shield className="h-10 w-10 text-muted-foreground/40" />
                        <p className="text-muted-foreground">No admin users found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  admins.map(a => (
                    <TableRow key={`${a.user_id}-${a.role}`}>
                      <TableCell className="font-medium">{a.full_name || a.user_id.slice(0, 8)}</TableCell>
                      <TableCell>
                        <Badge className={`text-xs capitalize ${roleBadgeColor[a.role] || ''}`}>{a.role}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Lock className="h-3 w-3" />
                          <span className="text-xs">Coming Soon</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-destructive border-destructive/30 text-xs"
                          onClick={() => handleRevokeAccess(a.user_id, a.role)}
                        >
                          Revoke Access
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Pending Requests */}
        <TabsContent value="pending">
          <div className="rounded-lg border border-border bg-card overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-semibold">Name</TableHead>
                  <TableHead className="font-semibold">Email</TableHead>
                  <TableHead className="font-semibold">Requested Role</TableHead>
                  <TableHead className="font-semibold">Requested Date</TableHead>
                  <TableHead className="font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-12">
                      No pending requests
                    </TableCell>
                  </TableRow>
                ) : (
                  requests.map(r => (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium">{r.user_name || '—'}</TableCell>
                      <TableCell className="text-sm">{r.user_email || '—'}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs capitalize">{r.requested_role}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(r.created_at), 'dd MMM yyyy')}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-success"
                            onClick={() => { setReviewDialog({ request: r, action: 'approve' }); setReviewRole(r.requested_role); }}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-destructive"
                            onClick={() => setReviewDialog({ request: r, action: 'reject' })}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Approval History */}
        <TabsContent value="history">
          <div className="rounded-lg border border-border bg-card overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-semibold">Name</TableHead>
                  <TableHead className="font-semibold">Email</TableHead>
                  <TableHead className="font-semibold">Action</TableHead>
                  <TableHead className="font-semibold">Reason</TableHead>
                  <TableHead className="font-semibold">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-12">
                      No history yet
                    </TableCell>
                  </TableRow>
                ) : (
                  history.map(h => (
                    <TableRow key={h.id}>
                      <TableCell className="font-medium">{h.user_name || '—'}</TableCell>
                      <TableCell className="text-sm">{h.user_email || '—'}</TableCell>
                      <TableCell>
                        <Badge className={`text-xs ${h.status === 'approved' ? 'bg-success/15 text-success' : 'bg-destructive/15 text-destructive'}`}>
                          {h.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">{h.review_reason || '—'}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {h.reviewed_at ? format(new Date(h.reviewed_at), 'dd MMM yyyy') : '—'}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      {/* Review Dialog */}
      <Dialog open={!!reviewDialog} onOpenChange={open => { if (!open) setReviewDialog(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {reviewDialog?.action === 'approve' ? 'Approve Access Request' : 'Reject Access Request'}
            </DialogTitle>
            <DialogDescription>
              {reviewDialog?.action === 'approve'
                ? `Grant admin access to ${reviewDialog?.request.user_name || 'this user'}.`
                : `Reject the access request from ${reviewDialog?.request.user_name || 'this user'}.`
              }
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {reviewDialog?.action === 'approve' && (
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Access Level</label>
                <Select value={reviewRole} onValueChange={setReviewRole}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="moderator">Moderator (Read-Only)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                {reviewDialog?.action === 'reject' ? 'Reason for rejection' : 'Notes (optional)'}
              </label>
              <Textarea
                placeholder={reviewDialog?.action === 'reject' ? 'Explain why...' : 'Optional notes...'}
                value={reviewReason}
                onChange={e => setReviewReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReviewDialog(null)}>Cancel</Button>
            <Button
              onClick={handleReview}
              className={reviewDialog?.action === 'reject' ? 'bg-destructive text-destructive-foreground' : ''}
            >
              {reviewDialog?.action === 'approve' ? 'Approve' : 'Reject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default AdminUsersPage;
