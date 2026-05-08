import { motion } from 'framer-motion';
import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Search, Check, X, UserPlus } from 'lucide-react';
import { format } from 'date-fns';

type Profile = {
  id: string;
  full_name: string | null;
  user_type: string;
  approval_status: string;
  stage: string | null;
  country_from: string | null;
  country_to: string | null;
  created_at: string;
  family_setup: string | null;
};

type Coach = { id: string; name: string };
type Assignment = { coachId: string; coachName: string };

const statusColor: Record<string, string> = {
  approved: 'bg-success/15 text-success',
  pending: 'bg-warning/15 text-warning',
  rejected: 'bg-destructive/15 text-destructive',
};

const MembersPage = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [assignments, setAssignments] = useState<Record<string, Assignment>>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [drawerProfile, setDrawerProfile] = useState<Profile | null>(null);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedCoachId, setSelectedCoachId] = useState('');

  const fetchData = async () => {
    setLoading(true);
    const [profilesRes, coachesRes, assignmentsRes] = await Promise.all([
      supabase.from('profiles').select('*').order('created_at', { ascending: false }),
      supabase.from('coaches').select('id, name'),
      supabase.from('coach_assignments').select('user_id, coach_id, coaches(name)'),
    ]);
    if (profilesRes.data) setProfiles(profilesRes.data as any);
    if (coachesRes.data) setCoaches(coachesRes.data);
    if (assignmentsRes.data) {
      const map: Record<string, Assignment> = {};
      (assignmentsRes.data as any[]).forEach(a => {
        map[a.user_id] = { coachId: a.coach_id, coachName: a.coaches?.name || 'Unknown' };
      });
      setAssignments(map);
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const filtered = useMemo(() => {
    let list = profiles;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(p => p.full_name?.toLowerCase().includes(q));
    }
    if (filterStatus !== 'all') {
      list = list.filter(p => p.approval_status === filterStatus);
    }
    return list;
  }, [profiles, search, filterStatus]);

  const updateApproval = async (id: string, status: 'approved' | 'rejected') => {
    const { error } = await supabase.from('profiles').update({ approval_status: status }).eq('id', id);
    if (error) { toast.error('Failed to update'); return; }
    toast.success(`User ${status}`);
    setProfiles(prev => prev.map(p => p.id === id ? { ...p, approval_status: status } : p));
  };

  const handleAssignCoach = async () => {
    if (!selectedUserId || !selectedCoachId) return;
    await supabase.from('coach_assignments').delete().eq('user_id', selectedUserId);
    const { error } = await supabase.from('coach_assignments').insert({ user_id: selectedUserId, coach_id: selectedCoachId });
    if (error) { toast.error('Failed to assign'); return; }
    const coach = coaches.find(c => c.id === selectedCoachId);
    setAssignments(prev => ({ ...prev, [selectedUserId]: { coachId: selectedCoachId, coachName: coach?.name || '' } }));
    toast.success('Coach assigned');
    setAssignDialogOpen(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-8 lg:p-12 max-w-6xl mx-auto"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-display font-black text-foreground">Members</h1>
        <p className="text-muted-foreground mt-1">Signed-up users and their coaching status</p>
      </div>

      <div className="flex gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search members..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border border-border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-semibold">Name</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Coach</TableHead>
              <TableHead className="font-semibold">Stage</TableHead>
              <TableHead className="font-semibold">Member Since</TableHead>
              <TableHead className="font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-12">Loading...</TableCell></TableRow>
            ) : filtered.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-12">No members found</TableCell></TableRow>
            ) : (
              filtered.map(p => (
                <TableRow key={p.id} className="cursor-pointer" onClick={() => setDrawerProfile(p)}>
                  <TableCell className="font-medium">{p.full_name || '—'}</TableCell>
                  <TableCell>
                    <Badge className={`text-xs ${statusColor[p.approval_status] || ''}`}>{p.approval_status}</Badge>
                  </TableCell>
                  <TableCell className="text-sm">{assignments[p.id]?.coachName || '—'}</TableCell>
                  <TableCell className="text-sm capitalize">{p.stage?.replace(/-/g, ' ') || '—'}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{format(new Date(p.created_at), 'dd MMM yyyy')}</TableCell>
                  <TableCell>
                    <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                      {p.approval_status === 'pending' && (
                        <>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-success" onClick={() => updateApproval(p.id, 'approved')}>
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => updateApproval(p.id, 'rejected')}>
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => {
                        setSelectedUserId(p.id);
                        setSelectedCoachId(assignments[p.id]?.coachId || '');
                        setAssignDialogOpen(true);
                      }}>
                        <UserPlus className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Profile Drawer */}
      <Sheet open={!!drawerProfile} onOpenChange={open => { if (!open) setDrawerProfile(null); }}>
        <SheetContent className="w-[480px] sm:max-w-[480px] overflow-y-auto">
          {drawerProfile && (
            <>
              <SheetHeader className="mb-6">
                <SheetTitle className="text-xl font-display font-black">{drawerProfile.full_name || 'Unknown'}</SheetTitle>
                <div className="flex gap-2 mt-2">
                  <Badge className={`text-xs ${statusColor[drawerProfile.approval_status]}`}>{drawerProfile.approval_status}</Badge>
                  <Badge variant="outline" className="text-xs">{drawerProfile.user_type}</Badge>
                </div>
              </SheetHeader>
              <Tabs defaultValue="profile">
                <TabsList className="w-full grid grid-cols-2 mb-4">
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="coaching">Coaching</TabsTrigger>
                </TabsList>
                <TabsContent value="profile" className="space-y-4">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div><span className="text-muted-foreground block">Stage</span><span className="capitalize">{drawerProfile.stage?.replace(/-/g, ' ') || '—'}</span></div>
                    <div><span className="text-muted-foreground block">From</span>{drawerProfile.country_from || '—'}</div>
                    <div><span className="text-muted-foreground block">To</span>{drawerProfile.country_to || '—'}</div>
                    <div><span className="text-muted-foreground block">Family</span>{drawerProfile.family_setup || '—'}</div>
                    <div><span className="text-muted-foreground block">Joined</span>{format(new Date(drawerProfile.created_at), 'dd MMM yyyy')}</div>
                  </div>
                </TabsContent>
                <TabsContent value="coaching" className="space-y-4">
                  <div className="text-sm">
                    <span className="text-muted-foreground block mb-1">Assigned Coach</span>
                    <p className="font-medium">{assignments[drawerProfile.id]?.coachName || 'None'}</p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => {
                    setSelectedUserId(drawerProfile.id);
                    setSelectedCoachId(assignments[drawerProfile.id]?.coachId || '');
                    setAssignDialogOpen(true);
                  }}>
                    {assignments[drawerProfile.id] ? 'Reassign Coach' : 'Assign Coach'}
                  </Button>
                </TabsContent>
              </Tabs>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Assign Coach Dialog */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Coach</DialogTitle>
            <DialogDescription>Select a coach to assign.</DialogDescription>
          </DialogHeader>
          <Select value={selectedCoachId} onValueChange={setSelectedCoachId}>
            <SelectTrigger><SelectValue placeholder="Select a coach" /></SelectTrigger>
            <SelectContent>
              {coaches.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button onClick={handleAssignCoach} disabled={!selectedCoachId}>Assign</Button>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default MembersPage;
