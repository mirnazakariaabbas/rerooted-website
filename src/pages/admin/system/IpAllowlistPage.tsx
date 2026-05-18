import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Shield, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { PageHeader } from '@/components/layout/PageHeader';

type IpEntry = {
  id: string;
  ip_address: string;
  label: string | null;
  is_active: boolean;
  created_at: string;
};

const IpAllowlistPage = () => {
  const [entries, setEntries] = useState<IpEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [newIp, setNewIp] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchEntries = async () => {
    setLoading(true);
    const { data } = await supabase.from('ip_allowlist').select('*').order('created_at', { ascending: false });
    if (data) setEntries(data as IpEntry[]);
    setLoading(false);
  };

  useEffect(() => { fetchEntries(); }, []);

  const handleAdd = async () => {
    if (!newIp.trim()) return;
    const { error } = await supabase.from('ip_allowlist').insert({
      ip_address: newIp.trim(),
      label: newLabel.trim() || null,
      created_by: user?.id,
    } as any);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'IP added to allowlist' });
      setNewIp(''); setNewLabel(''); setOpen(false);
      fetchEntries();
    }
  };

  const handleToggle = async (id: string, active: boolean) => {
    await supabase.from('ip_allowlist').update({ is_active: !active } as any).eq('id', id);
    fetchEntries();
  };

  const handleDelete = async (id: string) => {
    await supabase.from('ip_allowlist').delete().eq('id', id);
    fetchEntries();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-8 lg:p-12 max-w-4xl mx-auto"
    >
      <PageHeader title="IP Allowlist" subtitle="Restrict admin portal access to specific IPs" />
      <div className="max-w-6xl mx-auto px-6 -mt-10 relative">
      <div className="flex justify-end mb-6"><Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Add IP</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add IP Address</DialogTitle></DialogHeader>
            <div className="space-y-4 mt-2">
              <div>
                <Label>IP Address or CIDR</Label>
                <Input placeholder="192.168.1.0/24" value={newIp} onChange={e => setNewIp(e.target.value)} /></div>
              <div>
                <Label>Label (optional)</Label>
                <Input placeholder="Office network" value={newLabel} onChange={e => setNewLabel(e.target.value)} />
              </div>
              <Button onClick={handleAdd} className="w-full">Add to Allowlist</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-0 shadow-sm mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-medium">Allowlist Status</p>
              <p className="text-xs text-muted-foreground">
                {entries.filter(e => e.is_active).length > 0
                  ? `${entries.filter(e => e.is_active).length} active rule(s), only listed IPs can access the admin portal`
                  : 'No active rules, all IPs are allowed'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="rounded-lg border border-border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-semibold">IP / CIDR</TableHead>
              <TableHead className="font-semibold">Label</TableHead>
              <TableHead className="font-semibold">Added</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-12">Loading...</TableCell></TableRow>
            ) : entries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-16">
                  <div className="flex flex-col items-center gap-3">
                    <Shield className="h-10 w-10 text-muted-foreground/40" />
                    <p className="text-muted-foreground">No IP rules configured</p>
                    <p className="text-xs text-muted-foreground">Add an IP to restrict admin access</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              entries.map(e => (
                <TableRow key={e.id}>
                  <TableCell className="font-mono text-sm">{e.ip_address}</TableCell>
                  <TableCell className="text-sm">{e.label || ', '}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{format(new Date(e.created_at), 'dd MMM yyyy')}</TableCell>
                  <TableCell>
                    <Badge
                      className={`cursor-pointer ${e.is_active ? 'bg-success/15 text-success' : 'bg-muted text-muted-foreground'}`}
                      onClick={() => handleToggle(e.id, e.is_active)}
                    >
                      {e.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDelete(e.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
          </div>
    </motion.div>
  );
};

export default IpAllowlistPage;
