import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Eye } from 'lucide-react';
import { format } from 'date-fns';

type Contact = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  status: string;
  audience_type: string | null;
  created_at: string;
  replied_at: string | null;
};

const ContactsTab = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Contact | null>(null);

  const fetchContacts = async () => {
    setLoading(true);
    const { data } = await supabase.from('contact_submissions').select('*').order('created_at', { ascending: false });
    if (data) setContacts(data);
    setLoading(false);
  };

  useEffect(() => { fetchContacts(); }, []);

  const markRead = async (c: Contact) => {
    setSelected(c);
    if (c.status === 'unread') {
      const { error } = await supabase.from('contact_submissions').update({ status: 'read' }).eq('id', c.id);
      if (!error) setContacts(prev => prev.map(x => x.id === c.id ? { ...x, status: 'read' } : x));
    }
  };

  const markReplied = async (id: string) => {
    const { error } = await supabase.from('contact_submissions').update({ status: 'replied', replied_at: new Date().toISOString() }).eq('id', id);
    if (error) { toast.error('Failed to update'); return; }
    toast.success('Marked as replied');
    setContacts(prev => prev.map(x => x.id === id ? { ...x, status: 'replied', replied_at: new Date().toISOString() } : x));
    setSelected(null);
  };

  if (loading) return <p className="text-muted-foreground text-sm">Loading contacts...</p>;

  return (
    <>
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>View</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contacts.map(c => (
              <TableRow key={c.id} className={c.status === 'unread' ? 'font-semibold' : ''}>
                <TableCell>{c.name}</TableCell>
                <TableCell className="text-sm">{c.email}</TableCell>
                <TableCell className="text-sm">{c.subject || ', '}</TableCell>
                <TableCell>
                  <Badge variant={c.status === 'unread' ? 'destructive' : c.status === 'replied' ? 'default' : 'secondary'} className="text-xs">
                    {c.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{format(new Date(c.created_at), 'MMM d, yyyy')}</TableCell>
                <TableCell>
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => markRead(c)}><Eye className="h-4 w-4" /></Button>
                </TableCell>
              </TableRow>
            ))}
            {contacts.length === 0 && <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground">No submissions yet</TableCell></TableRow>}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selected?.subject || 'No subject'}</DialogTitle>
            <DialogDescription>From {selected?.name} ({selected?.email})</DialogDescription>
          </DialogHeader>
          <p className="text-sm text-foreground whitespace-pre-wrap">{selected?.message}</p>
          {selected && selected.status !== 'replied' && (
            <Button onClick={() => markReplied(selected.id)}>Mark as Replied</Button>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ContactsTab;
