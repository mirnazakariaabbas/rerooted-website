import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Plus, Building2, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

type Organization = {
  id: string;
  name: string;
  industry: string | null;
  country: string | null;
  website: string | null;
  status: string;
  notes: string | null;
  created_at: string;
};

const emptyForm = { name: '', industry: '', country: '', website: '', notes: '' };

const OrganizationsPage = () => {
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [drawerOrg, setDrawerOrg] = useState<Organization | null>(null);

  const fetch = async () => {
    setLoading(true);
    const { data } = await supabase.from('organizations').select('*').order('created_at', { ascending: false });
    if (data) setOrgs(data as any);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const handleAdd = async () => {
    const { error } = await supabase.from('organizations').insert({
      name: form.name,
      industry: form.industry || null,
      country: form.country || null,
      website: form.website || null,
      notes: form.notes || null,
    });
    if (error) { toast.error('Failed to add'); return; }
    toast.success('Organization added');
    setDialogOpen(false);
    setForm(emptyForm);
    fetch();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this organization?')) return;
    const { error } = await supabase.from('organizations').delete().eq('id', id);
    if (error) { toast.error('Failed to delete'); return; }
    toast.success('Organization deleted');
    setOrgs(prev => prev.filter(o => o.id !== id));
    if (drawerOrg?.id === id) setDrawerOrg(null);
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
          <h1 className="text-3xl font-display font-black text-foreground">Organizations</h1>
          <p className="text-muted-foreground mt-1">Corporate clients and partner organizations</p>
        </div>
        <Button size="sm" onClick={() => { setForm(emptyForm); setDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-1" /> Add Organization
        </Button>
      </div>

      <div className="rounded-lg border border-border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-semibold">Name</TableHead>
              <TableHead className="font-semibold">Industry</TableHead>
              <TableHead className="font-semibold">Country</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Added</TableHead>
              <TableHead className="font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-12">Loading...</TableCell></TableRow>
            ) : orgs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-16">
                  <div className="flex flex-col items-center gap-3">
                    <Building2 className="h-10 w-10 text-muted-foreground/40" />
                    <p className="text-muted-foreground">No organizations yet</p>
                    <Button size="sm" onClick={() => { setForm(emptyForm); setDialogOpen(true); }}>
                      <Plus className="h-4 w-4 mr-1" /> Add First Organization
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              orgs.map(o => (
                <TableRow key={o.id} className="cursor-pointer" onClick={() => setDrawerOrg(o)}>
                  <TableCell className="font-medium">{o.name}</TableCell>
                  <TableCell className="text-sm">{o.industry || '—'}</TableCell>
                  <TableCell className="text-sm">{o.country || '—'}</TableCell>
                  <TableCell><Badge className="text-xs bg-success/15 text-success">{o.status}</Badge></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{format(new Date(o.created_at), 'dd MMM yyyy')}</TableCell>
                  <TableCell>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={e => { e.stopPropagation(); handleDelete(o.id); }}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Organization</DialogTitle>
            <DialogDescription>Add a corporate client or partner.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Organization name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            <Input placeholder="Industry" value={form.industry} onChange={e => setForm(f => ({ ...f, industry: e.target.value }))} />
            <Input placeholder="Country" value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))} />
            <Input placeholder="Website" value={form.website} onChange={e => setForm(f => ({ ...f, website: e.target.value }))} />
            <Textarea placeholder="Notes" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
          </div>
          <DialogFooter>
            <Button onClick={handleAdd} disabled={!form.name.trim()}>Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Sheet open={!!drawerOrg} onOpenChange={open => { if (!open) setDrawerOrg(null); }}>
        <SheetContent className="w-[480px] sm:max-w-[480px] overflow-y-auto">
          {drawerOrg && (
            <>
              <SheetHeader className="mb-6">
                <SheetTitle className="text-xl font-display font-black">{drawerOrg.name}</SheetTitle>
              </SheetHeader>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground block">Industry</span>{drawerOrg.industry || '—'}</div>
                <div><span className="text-muted-foreground block">Country</span>{drawerOrg.country || '—'}</div>
                <div><span className="text-muted-foreground block">Website</span>{drawerOrg.website || '—'}</div>
                <div><span className="text-muted-foreground block">Status</span>{drawerOrg.status}</div>
                <div className="col-span-2"><span className="text-muted-foreground block">Notes</span>{drawerOrg.notes || '—'}</div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </motion.div>
  );
};

export default OrganizationsPage;
