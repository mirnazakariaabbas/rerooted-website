import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Check, X, UserPlus } from 'lucide-react';

type Profile = {
  id: string;
  full_name: string | null;
  user_type: string;
  approval_status: string;
  stage: string | null;
  created_at: string;
};

type Coach = { id: string; name: string };
type Assignment = { user_id: string; coach_id: string; coaches: { name: string } | null };

const UsersTab = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [assignments, setAssignments] = useState<Record<string, { coachId: string; coachName: string }>>({});
  const [loading, setLoading] = useState(true);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedCoachId, setSelectedCoachId] = useState('');

  const fetchData = async () => {
    setLoading(true);
    const [profilesRes, coachesRes, assignmentsRes] = await Promise.all([
      supabase.from('profiles').select('id, full_name, user_type, approval_status, stage, created_at').order('created_at', { ascending: false }),
      supabase.from('coaches').select('id, name'),
      supabase.from('coach_assignments').select('user_id, coach_id, coaches(name)'),
    ]);

    if (profilesRes.data) setProfiles(profilesRes.data);
    if (coachesRes.data) setCoaches(coachesRes.data);
    if (assignmentsRes.data) {
      const map: Record<string, { coachId: string; coachName: string }> = {};
      (assignmentsRes.data as any[]).forEach((a) => {
        map[a.user_id] = { coachId: a.coach_id, coachName: a.coaches?.name || 'Unknown' };
      });
      setAssignments(map);
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const updateApproval = async (id: string, status: 'approved' | 'rejected') => {
    const { error } = await supabase.from('profiles').update({ approval_status: status }).eq('id', id);
    if (error) { toast.error('Failed to update status'); return; }
    toast.success(`User ${status}`);
    setProfiles(prev => prev.map(p => p.id === id ? { ...p, approval_status: status } : p));
  };

  const handleAssignCoach = async () => {
    if (!selectedUserId || !selectedCoachId) return;
    // Delete existing then insert (simple upsert)
    await supabase.from('coach_assignments').delete().eq('user_id', selectedUserId);
    const { error } = await supabase.from('coach_assignments').insert({ user_id: selectedUserId, coach_id: selectedCoachId });
    if (error) { toast.error('Failed to assign coach'); return; }
    const coach = coaches.find(c => c.id === selectedCoachId);
    setAssignments(prev => ({ ...prev, [selectedUserId]: { coachId: selectedCoachId, coachName: coach?.name || '' } }));
    toast.success('Coach assigned');
    setAssignDialogOpen(false);
    setSelectedCoachId('');
  };

  const statusColor = (s: string) => {
    if (s === 'approved') return 'default';
    if (s === 'rejected') return 'destructive';
    return 'secondary';
  };

  if (loading) return <p className="text-muted-foreground text-sm">Loading users...</p>;

  return (
    <>
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Coach</TableHead>
              <TableHead>Stage</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {profiles.map(p => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.full_name || '—'}</TableCell>
                <TableCell><Badge variant="outline" className="text-xs">{p.user_type}</Badge></TableCell>
                <TableCell><Badge variant={statusColor(p.approval_status)} className="text-xs">{p.approval_status}</Badge></TableCell>
                <TableCell className="text-sm">{assignments[p.id]?.coachName || '—'}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{p.stage || '—'}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {p.approval_status === 'pending' && (
                      <>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-green-600" onClick={() => updateApproval(p.id, 'approved')}><Check className="h-4 w-4" /></Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => updateApproval(p.id, 'rejected')}><X className="h-4 w-4" /></Button>
                      </>
                    )}
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => { setSelectedUserId(p.id); setSelectedCoachId(assignments[p.id]?.coachId || ''); setAssignDialogOpen(true); }}>
                      <UserPlus className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Coach</DialogTitle>
            <DialogDescription>Select a coach to assign to this user.</DialogDescription>
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
    </>
  );
};

export default UsersTab;
