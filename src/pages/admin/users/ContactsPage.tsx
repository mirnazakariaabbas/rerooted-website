import { motion } from 'framer-motion';
import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Plus, Search, Trash2, Upload, UserPlus } from 'lucide-react';
import { format } from 'date-fns';
import { PageHeader } from '@/components/layout/PageHeader';

type Contact = {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  source: string;
  journey_stage: string | null;
  gdpr_consent: boolean;
  tags: string[];
  notes: Array<{ text: string; author: string; date: string }>;
  job_title: string | null;
  country: string | null;
  created_at: string;
};

const sourceColors: Record<string, string> = {
  contact_form: 'bg-primary/10 text-primary',
  csv_import: 'bg-accent/30 text-accent-foreground',
  linkedin_import: 'bg-blue-100 text-blue-800',
  manual_entry: 'bg-muted text-muted-foreground',
  referral: 'bg-secondary/20 text-secondary',
  event: 'bg-warning/20 text-warning',
};

const stageOptions = ['pre-rooted', 'rooting-in', 'thrive', 'rooting-back'];
const sourceOptions = ['contact_form', 'csv_import', 'linkedin_import', 'manual_entry', 'referral', 'event'];

const emptyForm = {
  first_name: '', last_name: '', email: '', phone: '', source: 'manual_entry',
  journey_stage: 'pre-rooted', job_title: '', country: '', gdpr_consent: false,
};

const ContactsPage = () => {
  const { user: authUser } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterSource, setFilterSource] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [drawerContact, setDrawerContact] = useState<Contact | null>(null);
  const [newNote, setNewNote] = useState('');

  const fetchContacts = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setContacts(data as any);
    setLoading(false);
  };

  useEffect(() => { fetchContacts(); }, []);

  const filtered = useMemo(() => {
    let list = contacts;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(c =>
        `${c.first_name} ${c.last_name}`.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q)
      );
    }
    if (filterSource !== 'all') {
      list = list.filter(c => c.source === filterSource);
    }
    return list;
  }, [contacts, search, filterSource]);

  const handleAdd = async () => {
    const payload = {
      first_name: form.first_name,
      last_name: form.last_name,
      email: form.email || null,
      phone: form.phone || null,
      source: form.source as any,
      journey_stage: form.journey_stage,
      job_title: form.job_title || null,
      country: form.country || null,
      gdpr_consent: form.gdpr_consent,
      created_by: authUser?.id || null,
    };
    const { error } = await supabase.from('contacts').insert(payload);
    if (error) { toast.error('Failed to add contact'); return; }
    toast.success('Contact added');
    setDialogOpen(false);
    setForm(emptyForm);
    fetchContacts();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this contact permanently?')) return;
    const { error } = await supabase.from('contacts').delete().eq('id', id);
    if (error) { toast.error('Failed to delete'); return; }
    toast.success('Contact deleted');
    setContacts(prev => prev.filter(c => c.id !== id));
    if (drawerContact?.id === id) setDrawerContact(null);
  };

  const handleAddNote = async () => {
    if (!drawerContact || !newNote.trim()) return;
    const updatedNotes = [
      ...(drawerContact.notes || []),
      { text: newNote, author: authUser?.user_metadata?.full_name || 'Admin', date: new Date().toISOString() },
    ];
    const { error } = await supabase.from('contacts').update({ notes: updatedNotes as any }).eq('id', drawerContact.id);
    if (error) { toast.error('Failed to save note'); return; }
    setDrawerContact({ ...drawerContact, notes: updatedNotes });
    setContacts(prev => prev.map(c => c.id === drawerContact.id ? { ...c, notes: updatedNotes } : c));
    setNewNote('');
    toast.success('Note added');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="pb-24"
    >
      <PageHeader title="Contacts" subtitle="People in your database who haven't signed up yet" />
      <div className="max-w-6xl mx-auto px-6 -mt-10 relative">
      <div className="flex justify-end mb-6"><div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>
            <Upload className="h-4 w-4 mr-1" /> CSV Import
          </Button>
          <Button size="sm" onClick={() => { setForm(emptyForm); setDialogOpen(true); }}>
            <Plus className="h-4 w-4 mr-1" /> Add Contact
          </Button></div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search contacts..."
            className="pl-10"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <Select value={filterSource} onValueChange={setFilterSource}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sources</SelectItem>
            {sourceOptions.map(s => (
              <SelectItem key={s} value={s}>{s.replace(/_/g, ' ')}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-semibold">Name</TableHead>
              <TableHead className="font-semibold">Email</TableHead>
              <TableHead className="font-semibold">Source</TableHead>
              <TableHead className="font-semibold">Stage</TableHead>
              <TableHead className="font-semibold">Date Added</TableHead>
              <TableHead className="font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-12">Loading...</TableCell></TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-16">
                  <div className="flex flex-col items-center gap-3">
                    <UserPlus className="h-10 w-10 text-muted-foreground/40" />
                    <p className="text-muted-foreground">No contacts yet</p>
                    <Button size="sm" onClick={() => { setForm(emptyForm); setDialogOpen(true); }}>
                      <Plus className="h-4 w-4 mr-1" /> Add First Contact
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map(c => (
                <TableRow key={c.id} className="cursor-pointer" onClick={() => setDrawerContact(c)}>
                  <TableCell className="font-medium">{c.first_name} {c.last_name}</TableCell>
                  <TableCell className="text-sm">{c.email || '—'}</TableCell>
                  <TableCell>
                    <Badge className={`text-xs ${sourceColors[c.source] || 'bg-muted text-muted-foreground'}`}>
                      {c.source.replace(/_/g, ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm capitalize">{c.journey_stage?.replace(/-/g, ' ') || '—'}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{format(new Date(c.created_at), 'dd MMM yyyy')}</TableCell>
                  <TableCell>
                    <Button
                      size="icon" variant="ghost" className="h-8 w-8 text-destructive"
                      onClick={e => { e.stopPropagation(); handleDelete(c.id); }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add Contact Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Contact</DialogTitle>
            <DialogDescription>Add a new person to your contacts database.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <Input placeholder="First name" value={form.first_name} onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))} />
            <Input placeholder="Last name" value={form.last_name} onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))} />
            <Input placeholder="Email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="col-span-2" />
            <Input placeholder="Phone" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
            <Input placeholder="Job title" value={form.job_title} onChange={e => setForm(f => ({ ...f, job_title: e.target.value }))} />
            <Input placeholder="Country" value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))} />
            <Select value={form.source} onValueChange={v => setForm(f => ({ ...f, source: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {sourceOptions.map(s => <SelectItem key={s} value={s}>{s.replace(/_/g, ' ')}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={form.journey_stage} onValueChange={v => setForm(f => ({ ...f, journey_stage: v }))}>
              <SelectTrigger><SelectValue placeholder="Journey stage" /></SelectTrigger>
              <SelectContent>
                {stageOptions.map(s => <SelectItem key={s} value={s}>{s.replace(/-/g, ' ')}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button onClick={handleAdd} disabled={!form.first_name.trim()}>Add Contact</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Contact Drawer */}
      <Sheet open={!!drawerContact} onOpenChange={open => { if (!open) setDrawerContact(null); }}>
        <SheetContent className="w-[480px] sm:max-w-[480px] overflow-y-auto">
          {drawerContact && (
            <>
              <SheetHeader className="mb-6">
                <SheetTitle className="text-xl font-display font-black">
                  {drawerContact.first_name} {drawerContact.last_name}
                </SheetTitle>
                <div className="flex gap-2 mt-2">
                  <Badge className={`text-xs ${sourceColors[drawerContact.source] || ''}`}>
                    {drawerContact.source.replace(/_/g, ' ')}
                  </Badge>
                  <Badge variant="outline" className="text-xs capitalize">
                    {drawerContact.journey_stage?.replace(/-/g, ' ')}
                  </Badge>
                </div>
              </SheetHeader>

              <Tabs defaultValue="details">
                <TabsList className="w-full grid grid-cols-3 mb-4">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="notes">Notes & Activity</TabsTrigger>
                  <TabsTrigger value="tags">Tags</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div><span className="text-muted-foreground block">Email</span>{drawerContact.email || '—'}</div>
                    <div><span className="text-muted-foreground block">Phone</span>{drawerContact.phone || '—'}</div>
                    <div><span className="text-muted-foreground block">Job Title</span>{drawerContact.job_title || '—'}</div>
                    <div><span className="text-muted-foreground block">Country</span>{drawerContact.country || '—'}</div>
                    <div><span className="text-muted-foreground block">GDPR Consent</span>{drawerContact.gdpr_consent ? 'Yes' : 'No'}</div>
                    <div><span className="text-muted-foreground block">Added</span>{format(new Date(drawerContact.created_at), 'dd MMM yyyy')}</div>
                  </div>
                </TabsContent>

                <TabsContent value="notes" className="space-y-4">
                  <div className="flex gap-2">
                    <Textarea placeholder="Add a note..." value={newNote} onChange={e => setNewNote(e.target.value)} className="min-h-[60px]" />
                    <Button size="sm" onClick={handleAddNote} disabled={!newNote.trim()}>Add</Button>
                  </div>
                  <div className="space-y-3">
                    {(drawerContact.notes || []).slice().reverse().map((note, i) => (
                      <div key={i} className="border border-border rounded-lg p-3">
                        <p className="text-sm">{note.text}</p>
                        <p className="text-xs text-muted-foreground mt-1">{note.author} · {format(new Date(note.date), 'dd MMM yyyy HH:mm')}</p>
                      </div>
                    ))}
                    {(!drawerContact.notes || drawerContact.notes.length === 0) && (
                      <p className="text-sm text-muted-foreground text-center py-4">No notes yet</p>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="tags">
                  <div className="flex flex-wrap gap-2">
                    {(drawerContact.tags || []).map((tag, i) => (
                      <Badge key={i} variant="outline">{tag}</Badge>
                    ))}
                    {(!drawerContact.tags || drawerContact.tags.length === 0) && (
                      <p className="text-sm text-muted-foreground">No tags assigned</p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex gap-2 mt-8 pt-4 border-t">
                <Button variant="outline" className="text-destructive border-destructive/30" onClick={() => { handleDelete(drawerContact.id); }}>
                  Delete Contact
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
          </div>
    </motion.div>
  );
};

export default ContactsPage;
