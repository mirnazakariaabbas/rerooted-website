import { motion } from 'framer-motion';
import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Mail, Download, UserX, Users } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { PageHeader } from '@/components/layout/PageHeader';

type Subscriber = {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  source: string | null;
  subscribed_at: string;
  unsubscribed_at: string | null;
  is_active: boolean;
  tags: any;
};

const SubscribersPage = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [open, setOpen] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newFirst, setNewFirst] = useState('');
  const [newLast, setNewLast] = useState('');
  const { toast } = useToast();

  const fetchSubscribers = async () => {
    setLoading(true);
    const { data } = await supabase.from('subscribers').select('*').order('subscribed_at', { ascending: false });
    if (data) setSubscribers(data as Subscriber[]);
    setLoading(false);
  };

  useEffect(() => { fetchSubscribers(); }, []);

  const handleAdd = async () => {
    if (!newEmail.trim()) return;
    const { error } = await supabase.from('subscribers').insert({
      email: newEmail.trim(),
      first_name: newFirst.trim() || null,
      last_name: newLast.trim() || null,
      source: 'manual',
    } as any);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Subscriber added' });
      setNewEmail(''); setNewFirst(''); setNewLast(''); setOpen(false);
      fetchSubscribers();
    }
  };

  const handleUnsubscribe = async (id: string) => {
    await supabase.from('subscribers').update({ is_active: false, unsubscribed_at: new Date().toISOString() } as any).eq('id', id);
    fetchSubscribers();
  };

  const filtered = useMemo(() => {
    let list = subscribers;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(s => s.email.toLowerCase().includes(q) || s.first_name?.toLowerCase().includes(q) || s.last_name?.toLowerCase().includes(q));
    }
    if (filterStatus === 'active') list = list.filter(s => s.is_active);
    if (filterStatus === 'unsubscribed') list = list.filter(s => !s.is_active);
    return list;
  }, [subscribers, search, filterStatus]);

  const handleExport = () => {
    const csv = [
      ['Email', 'First Name', 'Last Name', 'Source', 'Status', 'Subscribed'].join(','),
      ...filtered.map(s => [s.email, s.first_name || '', s.last_name || '', s.source || '', s.is_active ? 'Active' : 'Unsubscribed', format(new Date(s.subscribed_at), 'yyyy-MM-dd')].map(v => `"${v}"`).join(','))
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `subscribers-${format(new Date(), 'yyyy-MM-dd')}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="pb-24"
    >
      <PageHeader title="Subscribers" subtitle="Manage newsletter and email subscribers" />
      <div className="max-w-6xl mx-auto px-6 -mt-10 relative">
      <div className="flex justify-end mb-6"><div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExport}><Download className="h-4 w-4 mr-1" /> Export</Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-1" /> Add Subscriber</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add Subscriber</DialogTitle></DialogHeader>
              <div className="space-y-4 mt-2">
                <div><Label>Email *</Label><Input placeholder="email@example.com" value={newEmail} onChange={e => setNewEmail(e.target.value)} /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>First Name</Label><Input value={newFirst} onChange={e => setNewFirst(e.target.value)} /></div>
                  <div><Label>Last Name</Label><Input value={newLast} onChange={e => setNewLast(e.target.value)} /></div>
                </div>
                <Button onClick={handleAdd} className="w-full">Add Subscriber</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Total Subscribers</p>
                <p className="text-3xl font-display font-black text-foreground mt-1">{subscribers.length}</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center"><Users className="h-5 w-5 text-primary" /></div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Active</p>
                <p className="text-3xl font-display font-black text-foreground mt-1">{subscribers.filter(s => s.is_active).length}</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-success/10 flex items-center justify-center"><Mail className="h-5 w-5 text-success" /></div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Unsubscribed</p>
                <p className="text-3xl font-display font-black text-foreground mt-1">{subscribers.filter(s => !s.is_active).length}</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-destructive/10 flex items-center justify-center"><UserX className="h-5 w-5 text-destructive" /></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search subscribers..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="unsubscribed">Unsubscribed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border border-border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-semibold">Email</TableHead>
              <TableHead className="font-semibold">Name</TableHead>
              <TableHead className="font-semibold">Source</TableHead>
              <TableHead className="font-semibold">Subscribed</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-12">Loading...</TableCell></TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-16">
                  <Mail className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
                  <p className="text-muted-foreground">No subscribers yet</p>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map(s => (
                <TableRow key={s.id}>
                  <TableCell className="text-sm font-medium">{s.email}</TableCell>
                  <TableCell className="text-sm">{[s.first_name, s.last_name].filter(Boolean).join(' ') || ', '}</TableCell>
                  <TableCell><Badge variant="outline" className="text-xs capitalize">{s.source || 'website'}</Badge></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{format(new Date(s.subscribed_at), 'dd MMM yyyy')}</TableCell>
                  <TableCell>
                    <Badge className={s.is_active ? 'bg-success/15 text-success' : 'bg-muted text-muted-foreground'}>
                      {s.is_active ? 'Active' : 'Unsubscribed'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {s.is_active && (
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleUnsubscribe(s.id)}>
                        Unsubscribe
                      </Button>
                    )}
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

export default SubscribersPage;
