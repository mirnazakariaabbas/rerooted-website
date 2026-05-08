import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Monitor, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

type Session = {
  id: string;
  user_name: string | null;
  user_email: string | null;
  user_role: string | null;
  ip_address: string | null;
  user_agent: string | null;
  started_at: string;
  last_active_at: string;
  is_active: boolean;
};

const ActiveSessionsPage = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSessions = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('active_sessions')
      .select('*')
      .order('last_active_at', { ascending: false })
      .limit(100);
    if (data) setSessions(data as Session[]);
    setLoading(false);
  };

  useEffect(() => { fetchSessions(); }, []);

  const handleTerminate = async (id: string) => {
    await supabase.from('active_sessions').update({ is_active: false } as any).eq('id', id);
    fetchSessions();
  };

  const activeSessions = sessions.filter(s => s.is_active);

  const parseBrowser = (ua: string | null) => {
    if (!ua) return 'Unknown';
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Safari')) return 'Safari';
    if (ua.includes('Edge')) return 'Edge';
    return 'Other';
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
          <h1 className="text-3xl font-display font-black text-foreground">Active Sessions</h1>
          <p className="text-muted-foreground mt-1">Monitor and manage active user sessions</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchSessions}>
          <RefreshCw className="h-4 w-4 mr-1" /> Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Active Now</p>
                <p className="text-3xl font-display font-black text-foreground mt-1">{activeSessions.length}</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-success/10 flex items-center justify-center">
                <Wifi className="h-5 w-5 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Total Tracked</p>
                <p className="text-3xl font-display font-black text-foreground mt-1">{sessions.length}</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Monitor className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Terminated</p>
                <p className="text-3xl font-display font-black text-foreground mt-1">{sessions.filter(s => !s.is_active).length}</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                <WifiOff className="h-5 w-5 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-lg border border-border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-semibold">User</TableHead>
              <TableHead className="font-semibold">Role</TableHead>
              <TableHead className="font-semibold">IP Address</TableHead>
              <TableHead className="font-semibold">Browser</TableHead>
              <TableHead className="font-semibold">Started</TableHead>
              <TableHead className="font-semibold">Last Active</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground py-12">Loading...</TableCell></TableRow>
            ) : sessions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-16">
                  <div className="flex flex-col items-center gap-3">
                    <Monitor className="h-10 w-10 text-muted-foreground/40" />
                    <p className="text-muted-foreground">No sessions tracked yet</p>
                    <p className="text-xs text-muted-foreground">Sessions will appear as users log in</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              sessions.map(s => (
                <TableRow key={s.id}>
                  <TableCell>
                    <div>
                      <p className="text-sm font-medium">{s.user_name || '—'}</p>
                      <p className="text-xs text-muted-foreground">{s.user_email || ''}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs capitalize">{s.user_role || 'user'}</Badge>
                  </TableCell>
                  <TableCell className="text-sm font-mono text-muted-foreground">{s.ip_address || '—'}</TableCell>
                  <TableCell className="text-sm">{parseBrowser(s.user_agent)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                    {format(new Date(s.started_at), 'dd MMM HH:mm')}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(s.last_active_at), { addSuffix: true })}
                  </TableCell>
                  <TableCell>
                    <Badge className={s.is_active ? 'bg-success/15 text-success' : 'bg-muted text-muted-foreground'}>
                      {s.is_active ? 'Active' : 'Ended'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {s.is_active && (
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleTerminate(s.id)}>
                        Terminate
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  );
};

export default ActiveSessionsPage;
