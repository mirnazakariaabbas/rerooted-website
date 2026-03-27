import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2 } from 'lucide-react';

type Coach = {
  id: string;
  name: string;
  bio: string | null;
  email: string | null;
  specialties: string[] | null;
  photo_url: string | null;
};

const emptyForm = { name: '', bio: '', email: '', specialties: '' };

const CoachesTab = () => {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const fetchCoaches = async () => {
    setLoading(true);
    const { data } = await supabase.from('coaches').select('*').order('created_at', { ascending: false });
    if (data) setCoaches(data as any);
    setLoading(false);
  };

  useEffect(() => { fetchCoaches(); }, []);

  const openAdd = () => { setEditId(null); setForm(emptyForm); setDialogOpen(true); };
  const openEdit = (c: Coach) => {
    setEditId(c.id);
    setForm({ name: c.name, bio: c.bio || '', email: c.email || '', specialties: Array.isArray(c.specialties) ? c.specialties.join(', ') : '' });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    const payload = {
      name: form.name,
      bio: form.bio || null,
      email: form.email || null,
      specialties: form.specialties ? form.specialties.split(',').map(s => s.trim()) : [],
    };

    if (editId) {
      const { error } = await supabase.from('coaches').update(payload).eq('id', editId);
      if (error) { toast.error('Failed to update'); return; }
      toast.success('Coach updated');
    } else {
      const { error } = await supabase.from('coaches').insert(payload);
      if (error) { toast.error('Failed to add coach'); return; }
      toast.success('Coach added');
    }
    setDialogOpen(false);
    fetchCoaches();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this coach?')) return;
    const { error } = await supabase.from('coaches').delete().eq('id', id);
    if (error) { toast.error('Failed to delete'); return; }
    toast.success('Coach deleted');
    setCoaches(prev => prev.filter(c => c.id !== id));
  };

  if (loading) return <p className="text-muted-foreground text-sm">Loading coaches...</p>;

  return (
    <>
      <div className="flex justify-end mb-3">
        <Button size="sm" onClick={openAdd}><Plus className="h-4 w-4 mr-1" />Add Coach</Button>
      </div>
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Specialties</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {coaches.map(c => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.name}</TableCell>
                <TableCell className="text-sm">{c.email || '—'}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{Array.isArray(c.specialties) ? (c.specialties as string[]).join(', ') : '—'}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => openEdit(c)}><Pencil className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => handleDelete(c.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {coaches.length === 0 && <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground">No coaches yet</TableCell></TableRow>}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editId ? 'Edit Coach' : 'Add Coach'}</DialogTitle>
            <DialogDescription>{editId ? 'Update coach details.' : 'Add a new coach to the platform.'}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            <Input placeholder="Email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            <Input placeholder="Specialties (comma-separated)" value={form.specialties} onChange={e => setForm(f => ({ ...f, specialties: e.target.value }))} />
            <Textarea placeholder="Bio" value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} />
          </div>
          <DialogFooter>
            <Button onClick={handleSave} disabled={!form.name.trim()}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CoachesTab;
