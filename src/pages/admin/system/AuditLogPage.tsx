import { motion } from 'framer-motion';
import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Download, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { PageHeader } from '@/components/layout/PageHeader';

type AuditEntry = {
  id: string;
  user_name: string | null;
  user_role: string | null;
  action_type: string;
  section: string | null;
  record_type: string | null;
  record_name: string | null;
  old_value: any;
  new_value: any;
  ip_address: string | null;
  created_at: string;
};

const actionBadgeColor: Record<string, string> = {
  Created: 'bg-success/15 text-success',
  Updated: 'bg-primary/15 text-primary',
  Deleted: 'bg-destructive/15 text-destructive',
  Login: 'bg-success/15 text-success',
  Logout: 'bg-muted text-muted-foreground',
  'Failed Login': 'bg-destructive/15 text-destructive',
  Exported: 'bg-accent/30 text-accent-foreground',
  'Permission Changed': 'bg-warning/15 text-warning',
};

const AuditLogPage = () => {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterAction, setFilterAction] = useState('all');
  const [filterSection, setFilterSection] = useState('all');

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('audit_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(200);
      if (data) setEntries(data as any);
      setLoading(false);
    };
    fetch();
  }, []);

  const filtered = useMemo(() => {
    let list = entries;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(e =>
        e.user_name?.toLowerCase().includes(q) ||
        e.record_name?.toLowerCase().includes(q) ||
        e.action_type.toLowerCase().includes(q)
      );
    }
    if (filterAction !== 'all') list = list.filter(e => e.action_type === filterAction);
    if (filterSection !== 'all') list = list.filter(e => e.section === filterSection);
    return list;
  }, [entries, search, filterAction, filterSection]);

  const uniqueActions = useMemo(() => [...new Set(entries.map(e => e.action_type))], [entries]);
  const uniqueSections = useMemo(() => [...new Set(entries.map(e => e.section).filter(Boolean))], [entries]);

  const handleExport = () => {
    const csv = [
      ['Timestamp', 'User', 'Role', 'Action', 'Section', 'Record', 'IP'].join(','),
      ...filtered.map(e => [
        format(new Date(e.created_at), 'yyyy-MM-dd HH:mm:ss'),
        e.user_name || '',
        e.user_role || '',
        e.action_type,
        e.section || '',
        e.record_name || '',
        e.ip_address || '',
      ].map(v => `"${v}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-log-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="pb-24"
    >
      <PageHeader title="Audit Log" subtitle="Complete, immutable log of all admin actions" />
      <div className="max-w-6xl mx-auto px-6 -mt-10 relative">
      <div className="flex justify-end mb-6"><Button variant="outline" size="sm" onClick={handleExport}>
          <Download className="h-4 w-4 mr-1" /> Export CSV
        </Button></div>

      {/* Filters */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={filterAction} onValueChange={setFilterAction}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder="Action Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Actions</SelectItem>
            {uniqueActions.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterSection} onValueChange={setFilterSection}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder="Section" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sections</SelectItem>
            {uniqueSections.map(s => <SelectItem key={s!} value={s!}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border border-border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-semibold">Timestamp</TableHead>
              <TableHead className="font-semibold">User</TableHead>
              <TableHead className="font-semibold">Action</TableHead>
              <TableHead className="font-semibold">Section</TableHead>
              <TableHead className="font-semibold">Record</TableHead>
              <TableHead className="font-semibold">IP</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-12">Loading...</TableCell></TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-16">
                  <div className="flex flex-col items-center gap-3">
                    <FileText className="h-10 w-10 text-muted-foreground/40" />
                    <p className="text-muted-foreground">No audit entries yet</p>
                    <p className="text-xs text-muted-foreground">Actions will be logged as they occur</p>
                  </div>
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
                      <p className="text-sm font-medium">{e.user_name || ', '}</p>
                      {e.user_role && <p className="text-xs text-muted-foreground capitalize">{e.user_role}</p>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`text-xs ${actionBadgeColor[e.action_type] || 'bg-muted text-muted-foreground'}`}>
                      {e.action_type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{e.section || ', '}</TableCell>
                  <TableCell className="text-sm max-w-[200px] truncate">{e.record_name || ', '}</TableCell>
                  <TableCell className="text-xs text-muted-foreground font-mono">{e.ip_address || ', '}</TableCell>
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

export default AuditLogPage;
