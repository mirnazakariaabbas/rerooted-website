import { motion } from 'framer-motion';
import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Download, History, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { PageHeader } from '@/components/layout/PageHeader';

type RoleChange = {
  id: string;
  user_name: string | null;
  user_email: string | null;
  old_role: string | null;
  new_role: string;
  changed_by_name: string | null;
  reason: string | null;
  created_at: string;
};

const roleBadgeColor: Record<string, string> = {
  admin: 'bg-destructive/15 text-destructive',
  moderator: 'bg-warning/15 text-warning',
  coach: 'bg-primary/15 text-primary',
  user: 'bg-success/15 text-success',
};

const RoleHistoryPage = () => {
  const [entries, setEntries] = useState<RoleChange[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('role_version_history')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(200);
      if (data) setEntries(data as RoleChange[]);
      setLoading(false);
    };
    fetch();
  }, []);

  const filtered = useMemo(() => {
    if (!search) return entries;
    const q = search.toLowerCase();
    return entries.filter(e =>
      e.user_name?.toLowerCase().includes(q) ||
      e.user_email?.toLowerCase().includes(q) ||
      e.new_role.toLowerCase().includes(q)
    );
  }, [entries, search]);

  const handleExport = () => {
    const csv = [
      ['Timestamp', 'User', 'Email', 'Old Role', 'New Role', 'Changed By', 'Reason'].join(','),
      ...filtered.map(e => [
        format(new Date(e.created_at), 'yyyy-MM-dd HH:mm:ss'),
        e.user_name || '', e.user_email || '', e.old_role || 'none', e.new_role, e.changed_by_name || '', e.reason || ''
      ].map(v => `"${v}"`).join(','))
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `role-history-${format(new Date(), 'yyyy-MM-dd')}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="pb-24"
    >
      <PageHeader title="Role Version History" subtitle="Track all role changes across users" />
      <div className="max-w-6xl mx-auto px-6 -mt-10 relative">
      <div className="flex justify-end mb-6"><Button variant="outline" size="sm" onClick={handleExport}>
          <Download className="h-4 w-4 mr-1" /> Export CSV
        </Button></div>

      <div className="relative max-w-sm mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search by user or role..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="rounded-lg border border-border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-semibold">Timestamp</TableHead>
              <TableHead className="font-semibold">User</TableHead>
              <TableHead className="font-semibold">Role Change</TableHead>
              <TableHead className="font-semibold">Changed By</TableHead>
              <TableHead className="font-semibold">Reason</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-12">Loading...</TableCell></TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-16">
                  <History className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
                  <p className="text-muted-foreground">No role changes recorded</p>
                  <p className="text-xs text-muted-foreground mt-1">Role changes will be logged automatically</p>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map(e => (
                <TableRow key={e.id}>
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                    {format(new Date(e.created_at), 'dd MMM yyyy HH:mm')}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm font-medium">{e.user_name || '—'}</p>
                      <p className="text-xs text-muted-foreground">{e.user_email || ''}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {e.old_role ? (
                        <Badge className={`text-xs ${roleBadgeColor[e.old_role] || 'bg-muted text-muted-foreground'}`}>
                          {e.old_role}
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">none</span>
                      )}
                      <ArrowRight className="h-3 w-3 text-muted-foreground" />
                      <Badge className={`text-xs ${roleBadgeColor[e.new_role] || 'bg-muted text-muted-foreground'}`}>
                        {e.new_role}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{e.changed_by_name || '—'}</TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">{e.reason || '—'}</TableCell>
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

export default RoleHistoryPage;
