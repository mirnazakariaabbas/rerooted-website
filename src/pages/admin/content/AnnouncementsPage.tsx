import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, Megaphone, Users } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

interface Announcement {
  id: string; title: string; body: string; audience: string;
  is_active: boolean; published_at: string | null; created_at: string;
}

interface PeerGroup {
  id: string; name: string; description: string | null;
  group_type: string; created_at: string;
}

const AUDIENCES = ['all', 'members', 'coaches'];
const GROUP_TYPES = ['general', 'country', 'stage', 'family', 'interest'];

export default function AnnouncementsPage() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [annSheet, setAnnSheet] = useState(false);
  const [editingAnn, setEditingAnn] = useState<Announcement | null>(null);
  const [annForm, setAnnForm] = useState({ title: '', body: '', audience: 'all', is_active: true });
  const [grpSheet, setGrpSheet] = useState(false);
  const [editingGrp, setEditingGrp] = useState<PeerGroup | null>(null);
  const [grpForm, setGrpForm] = useState({ name: '', description: '', group_type: 'general' });

  const { data: announcements = [] } = useQuery({
    queryKey: ['announcements-admin'],
    queryFn: async () => {
      const { data, error } = await supabase.from('announcements').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []) as unknown as Announcement[];
    },
  });

  const { data: groups = [] } = useQuery({
    queryKey: ['peer-groups-admin'],
    queryFn: async () => {
      const { data, error } = await supabase.from('peer_groups').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []) as unknown as PeerGroup[];
    },
  });

  const saveAnnMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        title: annForm.title, body: annForm.body, audience: annForm.audience,
        is_active: annForm.is_active,
        published_at: annForm.is_active ? new Date().toISOString() : null,
        created_by: user?.id || null,
      };
      if (editingAnn) {
        const { error } = await supabase.from('announcements').update(payload).eq('id', editingAnn.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('announcements').insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements-admin'] });
      setAnnSheet(false);
      toast({ title: editingAnn ? 'Announcement updated' : 'Announcement created' });
    },
    onError: (e: Error) => toast({ title: 'Error', description: e.message, variant: 'destructive' }),
  });

  const deleteAnnMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('announcements').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['announcements-admin'] }); toast({ title: 'Deleted' }); },
  });

  const saveGrpMutation = useMutation({
    mutationFn: async () => {
      const payload = { name: grpForm.name, description: grpForm.description || null, group_type: grpForm.group_type };
      if (editingGrp) {
        const { error } = await supabase.from('peer_groups').update(payload).eq('id', editingGrp.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('peer_groups').insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['peer-groups-admin'] });
      setGrpSheet(false);
      toast({ title: editingGrp ? 'Group updated' : 'Group created' });
    },
    onError: (e: Error) => toast({ title: 'Error', description: e.message, variant: 'destructive' }),
  });

  const deleteGrpMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('peer_groups').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['peer-groups-admin'] }); toast({ title: 'Deleted' }); },
  });

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Announcements & Groups</h1>
        <p className="text-muted-foreground text-sm">Manage announcements and peer groups</p>
      </div>

      <Tabs defaultValue="announcements">
        <TabsList>
          <TabsTrigger value="announcements"><Megaphone className="h-4 w-4 mr-1" />Announcements</TabsTrigger>
          <TabsTrigger value="groups"><Users className="h-4 w-4 mr-1" />Peer Groups</TabsTrigger>
        </TabsList>

        <TabsContent value="announcements" className="space-y-4 mt-4">
          <div className="flex justify-end">
            <Button size="sm" onClick={() => { setEditingAnn(null); setAnnForm({ title: '', body: '', audience: 'all', is_active: true }); setAnnSheet(true); }}>
              <Plus className="h-4 w-4 mr-1" />New Announcement
            </Button>
          </div>
          <Card><CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Audience</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {announcements.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No announcements</TableCell></TableRow>
                ) : announcements.map(a => (
                  <TableRow key={a.id}>
                    <TableCell className="font-medium">{a.title}</TableCell>
                    <TableCell><Badge variant="outline" className="capitalize">{a.audience}</Badge></TableCell>
                    <TableCell><Badge variant={a.is_active ? 'default' : 'secondary'}>{a.is_active ? 'Active' : 'Inactive'}</Badge></TableCell>
                    <TableCell className="text-muted-foreground text-sm">{format(new Date(a.created_at), 'MMM d, yyyy')}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => { setEditingAnn(a); setAnnForm({ title: a.title, body: a.body, audience: a.audience, is_active: a.is_active }); setAnnSheet(true); }}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteAnnMutation.mutate(a.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="groups" className="space-y-4 mt-4">
          <div className="flex justify-end">
            <Button size="sm" onClick={() => { setEditingGrp(null); setGrpForm({ name: '', description: '', group_type: 'general' }); setGrpSheet(true); }}>
              <Plus className="h-4 w-4 mr-1" />New Group
            </Button>
          </div>
          <Card><CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {groups.length === 0 ? (
                  <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No groups</TableCell></TableRow>
                ) : groups.map(g => (
                  <TableRow key={g.id}>
                    <TableCell className="font-medium">{g.name}</TableCell>
                    <TableCell><Badge variant="outline" className="capitalize">{g.group_type}</Badge></TableCell>
                    <TableCell className="text-muted-foreground text-sm max-w-[200px] truncate">{g.description || '—'}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => { setEditingGrp(g); setGrpForm({ name: g.name, description: g.description || '', group_type: g.group_type }); setGrpSheet(true); }}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteGrpMutation.mutate(g.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent></Card>
        </TabsContent>
      </Tabs>

      {/* Announcement Sheet */}
      <Sheet open={annSheet} onOpenChange={setAnnSheet}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader><SheetTitle>{editingAnn ? 'Edit' : 'New'} Announcement</SheetTitle></SheetHeader>
          <div className="space-y-4 mt-4">
            <div><Label>Title</Label><Input value={annForm.title} onChange={e => setAnnForm(f => ({ ...f, title: e.target.value }))} /></div>
            <div><Label>Body</Label><Textarea value={annForm.body} onChange={e => setAnnForm(f => ({ ...f, body: e.target.value }))} rows={4} /></div>
            <div>
              <Label>Audience</Label>
              <Select value={annForm.audience} onValueChange={v => setAnnForm(f => ({ ...f, audience: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{AUDIENCES.map(a => <SelectItem key={a} value={a} className="capitalize">{a}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={annForm.is_active} onCheckedChange={v => setAnnForm(f => ({ ...f, is_active: v }))} />
              <Label>Active</Label>
            </div>
            <Button className="w-full" onClick={() => saveAnnMutation.mutate()} disabled={!annForm.title.trim() || saveAnnMutation.isPending}>
              {editingAnn ? 'Update' : 'Create'}
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Group Sheet */}
      <Sheet open={grpSheet} onOpenChange={setGrpSheet}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader><SheetTitle>{editingGrp ? 'Edit' : 'New'} Peer Group</SheetTitle></SheetHeader>
          <div className="space-y-4 mt-4">
            <div><Label>Name</Label><Input value={grpForm.name} onChange={e => setGrpForm(f => ({ ...f, name: e.target.value }))} /></div>
            <div><Label>Description</Label><Textarea value={grpForm.description} onChange={e => setGrpForm(f => ({ ...f, description: e.target.value }))} rows={3} /></div>
            <div>
              <Label>Group Type</Label>
              <Select value={grpForm.group_type} onValueChange={v => setGrpForm(f => ({ ...f, group_type: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{GROUP_TYPES.map(t => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <Button className="w-full" onClick={() => saveGrpMutation.mutate()} disabled={!grpForm.name.trim() || saveGrpMutation.isPending}>
              {editingGrp ? 'Update' : 'Create'}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </motion.div>
  );
}
