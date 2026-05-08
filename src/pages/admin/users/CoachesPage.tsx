import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Send, CheckCircle2, GraduationCap } from 'lucide-react';

type Coach = {
  id: string;
  name: string;
  bio: string | null;
  email: string | null;
  specialties: string[] | null;
  photo_url: string | null;
  certification_level: string;
  user_id: string | null;
};

const emptyForm = { name: '', bio: '', email: '', specialties: '', certification_level: 'non-certified', photo_url: '' };

const certBadgeColor: Record<string, string> = {
  ACC: 'bg-primary/15 text-primary',
  PCC: 'bg-success/15 text-success',
  MCC: 'bg-warning/15 text-warning',
  'non-certified': 'bg-muted text-muted-foreground',
};

const CoachesPage = () => {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [inviting, setInviting] = useState<string | null>(null);
  const [drawerCoach, setDrawerCoach] = useState<Coach | null>(null);

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
    setForm({
      name: c.name,
      bio: c.bio || '',
      email: c.email || '',
      specialties: Array.isArray(c.specialties) ? c.specialties.join(', ') : '',
      certification_level: c.certification_level || 'non-certified',
      photo_url: c.photo_url || '',
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    const payload: any = {
      name: form.name,
      bio: form.bio || null,
      email: form.email || null,
      specialties: form.specialties ? form.specialties.split(',').map(s => s.trim()) : [],
      certification_level: form.certification_level,
      photo_url: form.photo_url || null,
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
    if (drawerCoach?.id === id) setDrawerCoach(null);
  };

  const handleInvite = async (coach: Coach) => {
    if (!coach.email) { toast.error('Coach has no email'); return; }
    setInviting(coach.id);
    try {
      const { error } = await supabase.functions.invoke('invite-coach', {
        body: { coachName: coach.name, coachEmail: coach.email },
      });
      if (error) throw error;
      toast.success(`Invitation sent to ${coach.email}`);
    } catch {
      toast.error('Failed to send invitation');
    }
    setInviting(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-8 lg:p-12 max-w-6xl mx-auto"
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-black text-foreground">Coaches</h1>
          <p className="text-muted-foreground mt-1">Manage your global coaching network</p>
        </div>
        <Button size="sm" onClick={openAdd}><Plus className="h-4 w-4 mr-1" /> Add Coach</Button>
      </div>

      <div className="rounded-lg border border-border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-semibold">Name</TableHead>
              <TableHead className="font-semibold">Email</TableHead>
              <TableHead className="font-semibold">Certification</TableHead>
              <TableHead className="font-semibold">Specialties</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-12">Loading...</TableCell></TableRow>
            ) : coaches.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-16">
                  <div className="flex flex-col items-center gap-3">
                    <GraduationCap className="h-10 w-10 text-muted-foreground/40" />
                    <p className="text-muted-foreground">No coaches yet</p>
                    <Button size="sm" onClick={openAdd}><Plus className="h-4 w-4 mr-1" /> Add First Coach</Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              coaches.map(c => (
                <TableRow key={c.id} className="cursor-pointer" onClick={() => setDrawerCoach(c)}>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell className="text-sm">{c.email || '—'}</TableCell>
                  <TableCell>
                    <Badge className={`text-xs ${certBadgeColor[c.certification_level] || certBadgeColor['non-certified']}`}>
                      {c.certification_level === 'non-certified' ? 'Non-certified' : c.certification_level}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                    {Array.isArray(c.specialties) ? (c.specialties as string[]).join(', ') : '—'}
                  </TableCell>
                  <TableCell>
                    {c.user_id ? (
                      <Badge variant="secondary" className="text-xs gap-1"><CheckCircle2 className="h-3 w-3" />Linked</Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground">Not signed up</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                      <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => openEdit(c)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      {!c.user_id && c.email && (
                        <Button size="icon" variant="ghost" className="h-8 w-8" disabled={inviting === c.id} onClick={() => handleInvite(c)}>
                          <Send className="h-4 w-4" />
                        </Button>
                      )}
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => handleDelete(c.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editId ? 'Edit Coach' : 'Add Coach'}</DialogTitle>
            <DialogDescription>{editId ? 'Update coach details.' : 'Add a new coach to the platform.'}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            <Input placeholder="Email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Certification Level</label>
              <Select value={form.certification_level} onValueChange={v => setForm(f => ({ ...f, certification_level: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACC">ACC</SelectItem>
                  <SelectItem value="PCC">PCC</SelectItem>
                  <SelectItem value="MCC">MCC</SelectItem>
                  <SelectItem value="non-certified">Non-certified</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Input placeholder="Photo URL" value={form.photo_url} onChange={e => setForm(f => ({ ...f, photo_url: e.target.value }))} />
            <Input placeholder="Specialties (comma-separated)" value={form.specialties} onChange={e => setForm(f => ({ ...f, specialties: e.target.value }))} />
            <Textarea placeholder="Bio" value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} />
          </div>
          <DialogFooter>
            <Button onClick={handleSave} disabled={!form.name.trim()}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Coach Drawer */}
      <Sheet open={!!drawerCoach} onOpenChange={open => { if (!open) setDrawerCoach(null); }}>
        <SheetContent className="w-[480px] sm:max-w-[480px] overflow-y-auto">
          {drawerCoach && (
            <>
              <SheetHeader className="mb-6">
                <SheetTitle className="text-xl font-display font-black">{drawerCoach.name}</SheetTitle>
                <div className="flex gap-2 mt-2">
                  <Badge className={`text-xs ${certBadgeColor[drawerCoach.certification_level]}`}>
                    {drawerCoach.certification_level === 'non-certified' ? 'Non-certified' : drawerCoach.certification_level}
                  </Badge>
                  {drawerCoach.user_id ? (
                    <Badge variant="secondary" className="text-xs gap-1"><CheckCircle2 className="h-3 w-3" />Linked</Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs">Not signed up</Badge>
                  )}
                </div>
              </SheetHeader>
              <Tabs defaultValue="bio">
                <TabsList className="w-full grid grid-cols-2 mb-4">
                  <TabsTrigger value="bio">Bio & Details</TabsTrigger>
                  <TabsTrigger value="certifications">Certifications</TabsTrigger>
                </TabsList>
                <TabsContent value="bio" className="space-y-4">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div><span className="text-muted-foreground block">Email</span>{drawerCoach.email || '—'}</div>
                    <div><span className="text-muted-foreground block">Photo</span>{drawerCoach.photo_url ? 'Set' : '—'}</div>
                    <div className="col-span-2">
                      <span className="text-muted-foreground block">Specialties</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {Array.isArray(drawerCoach.specialties) && drawerCoach.specialties.length > 0
                          ? (drawerCoach.specialties as string[]).map((s, i) => <Badge key={i} variant="outline" className="text-xs">{s}</Badge>)
                          : '—'}
                      </div>
                    </div>
                    <div className="col-span-2">
                      <span className="text-muted-foreground block">Bio</span>
                      <p className="mt-1">{drawerCoach.bio || '—'}</p>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="certifications">
                  <div className="text-sm">
                    <p className="text-muted-foreground mb-2">Current certification level:</p>
                    <Badge className={`${certBadgeColor[drawerCoach.certification_level]}`}>
                      {drawerCoach.certification_level === 'non-certified' ? 'Non-certified' : drawerCoach.certification_level}
                    </Badge>
                    <p className="text-muted-foreground mt-4 text-xs">Detailed certification tracking coming in Phase 2.</p>
                  </div>
                </TabsContent>
              </Tabs>
              <div className="flex gap-2 mt-8 pt-4 border-t">
                <Button size="sm" variant="outline" onClick={() => { openEdit(drawerCoach); setDrawerCoach(null); }}>
                  <Pencil className="h-4 w-4 mr-1" /> Edit
                </Button>
                <Button size="sm" variant="outline" className="text-destructive border-destructive/30" onClick={() => handleDelete(drawerCoach.id)}>
                  Delete
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </motion.div>
  );
};

export default CoachesPage;
