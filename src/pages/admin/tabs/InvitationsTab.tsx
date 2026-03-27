import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import { format } from 'date-fns';

type Invitation = { id: string; email: string; status: string; created_at: string };

const InvitationsTab = () => {
  const { user } = useAuth();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [email, setEmail] = useState('');

  const fetch = async () => {
    setLoading(true);
    const { data } = await supabase.from('invitations').select('*').order('created_at', { ascending: false });
    if (data) setInvitations(data);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const handleSend = async () => {
    if (!email.trim()) return;
    const { error } = await supabase.from('invitations').insert({ email: email.trim(), invited_by: user?.id });
    if (error) { toast.error('Failed to send invitation'); return; }
    toast.success('Invitation sent');
    setEmail('');
    setDialogOpen(false);
    fetch();
  };

  if (loading) return <p className="text-muted-foreground text-sm">Loading invitations...</p>;

  return (
    <>
      <div className="flex justify-end mb-3">
        <Button size="sm" onClick={() => setDialogOpen(true)}><Plus className="h-4 w-4 mr-1" />Invite</Button>
      </div>
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Sent</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invitations.map(inv => (
              <TableRow key={inv.id}>
                <TableCell className="font-medium">{inv.email}</TableCell>
                <TableCell><Badge variant={inv.status === 'accepted' ? 'default' : 'secondary'} className="text-xs">{inv.status}</Badge></TableCell>
                <TableCell className="text-sm text-muted-foreground">{format(new Date(inv.created_at), 'MMM d, yyyy')}</TableCell>
              </TableRow>
            ))}
            {invitations.length === 0 && <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground">No invitations yet</TableCell></TableRow>}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Invitation</DialogTitle>
            <DialogDescription>Enter the email address to invite.</DialogDescription>
          </DialogHeader>
          <Input placeholder="email@example.com" type="email" value={email} onChange={e => setEmail(e.target.value)} />
          <DialogFooter>
            <Button onClick={handleSend} disabled={!email.trim()}>Send</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InvitationsTab;
