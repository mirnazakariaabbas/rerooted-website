import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Mail, FileText, TrendingUp, Eye, MousePointer, UserPlus, Megaphone } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--warning))', 'hsl(var(--accent))'];

export default function MarketingAnalyticsPage() {
  const { data: subscribers = [] } = useQuery({
    queryKey: ['marketing-subscribers'],
    queryFn: async () => {
      const { data } = await supabase.from('subscribers').select('subscribed_at, is_active, source');
      return data || [];
    },
  });

  const { data: newsletters = [] } = useQuery({
    queryKey: ['marketing-newsletters'],
    queryFn: async () => {
      const { data } = await supabase.from('newsletters').select('status, sent_at, open_count, click_count, recipient_count, unsubscribe_count');
      return data || [];
    },
  });

  const { data: blogPosts = [] } = useQuery({
    queryKey: ['marketing-blogs'],
    queryFn: async () => {
      const { data } = await supabase.from('blog_posts').select('status, published_at, category');
      return data || [];
    },
  });

  const { data: contactSubs = [] } = useQuery({
    queryKey: ['marketing-contacts'],
    queryFn: async () => {
      const { data } = await supabase.from('contact_submissions').select('created_at, status');
      return data || [];
    },
  });

  // Computed metrics
  const activeSubscribers = subscribers.filter(s => s.is_active).length;
  const totalSubscribers = subscribers.length;
  const sentNewsletters = newsletters.filter(n => n.status === 'sent');
  const totalOpens = sentNewsletters.reduce((sum, n) => sum + (n.open_count || 0), 0);
  const totalClicks = sentNewsletters.reduce((sum, n) => sum + (n.click_count || 0), 0);
  const totalRecipients = sentNewsletters.reduce((sum, n) => sum + (n.recipient_count || 0), 0);
  const avgOpenRate = totalRecipients > 0 ? ((totalOpens / totalRecipients) * 100).toFixed(1) : '0';
  const avgClickRate = totalRecipients > 0 ? ((totalClicks / totalRecipients) * 100).toFixed(1) : '0';
  const publishedPosts = blogPosts.filter(p => p.status === 'published').length;

  // Subscriber source breakdown
  const sourceCounts: Record<string, number> = {};
  subscribers.forEach(s => {
    const src = s.source || 'unknown';
    sourceCounts[src] = (sourceCounts[src] || 0) + 1;
  });
  const sourceData = Object.entries(sourceCounts).map(([name, value]) => ({ name, value }));

  // Monthly subscriber growth (last 6 months)
  const monthlyGrowth = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    const monthStr = d.toISOString().slice(0, 7);
    const label = d.toLocaleString('en', { month: 'short' });
    const count = subscribers.filter(s => s.subscribed_at?.startsWith(monthStr)).length;
    return { month: label, subscribers: count };
  });

  // Contact form submissions trend
  const monthlyContacts = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    const monthStr = d.toISOString().slice(0, 7);
    const label = d.toLocaleString('en', { month: 'short' });
    const count = contactSubs.filter(c => c.created_at?.startsWith(monthStr)).length;
    return { month: label, inquiries: count };
  });

  // Blog category breakdown
  const categoryCounts: Record<string, number> = {};
  blogPosts.filter(p => p.status === 'published').forEach(p => {
    const cat = p.category || 'Uncategorized';
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });
  const categoryData = Object.entries(categoryCounts).map(([name, value]) => ({ name, value }));

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-display font-black text-foreground">Marketing Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">Subscriber growth, email performance, and content metrics</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Subscribers', value: activeSubscribers, icon: Users, sub: `${totalSubscribers} total` },
          { label: 'Avg Open Rate', value: `${avgOpenRate}%`, icon: Eye, sub: `${sentNewsletters.length} sent` },
          { label: 'Avg Click Rate', value: `${avgClickRate}%`, icon: MousePointer, sub: `${totalClicks} clicks` },
          { label: 'Published Articles', value: publishedPosts, icon: FileText, sub: `${blogPosts.length} total` },
        ].map(kpi => (
          <Card key={kpi.label}>
            <CardContent className="pt-5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">{kpi.label}</span>
                <kpi.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold text-foreground">{kpi.value}</div>
              <span className="text-xs text-muted-foreground">{kpi.sub}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Subscriber Growth (6 months)</CardTitle></CardHeader>
          <CardContent>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyGrowth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="subscribers" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.1)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Contact Inquiries (6 months)</CardTitle></CardHeader>
          <CardContent>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyContacts}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip />
                  <Bar dataKey="inquiries" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pie Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Subscriber Sources</CardTitle></CardHeader>
          <CardContent>
            {sourceData.length > 0 ? (
              <div className="flex items-center gap-6">
                <div className="h-40 w-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={sourceData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} strokeWidth={2}>
                        {sourceData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2">
                  {sourceData.map((s, i) => (
                    <div key={s.name} className="flex items-center gap-2 text-sm">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                      <span className="text-foreground capitalize">{s.name}</span>
                      <span className="text-muted-foreground">({s.value})</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No subscriber data yet</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Blog Categories</CardTitle></CardHeader>
          <CardContent>
            {categoryData.length > 0 ? (
              <div className="flex items-center gap-6">
                <div className="h-40 w-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} strokeWidth={2}>
                        {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2">
                  {categoryData.map((c, i) => (
                    <div key={c.name} className="flex items-center gap-2 text-sm">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                      <span className="text-foreground">{c.name}</span>
                      <span className="text-muted-foreground">({c.value})</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No published articles yet</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Newsletter Performance Table */}
      {sentNewsletters.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-base">Newsletter Performance</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 text-muted-foreground font-medium">Sent</th>
                    <th className="text-right py-2 text-muted-foreground font-medium">Recipients</th>
                    <th className="text-right py-2 text-muted-foreground font-medium">Opens</th>
                    <th className="text-right py-2 text-muted-foreground font-medium">Clicks</th>
                    <th className="text-right py-2 text-muted-foreground font-medium">Unsubs</th>
                  </tr>
                </thead>
                <tbody>
                  {sentNewsletters.slice(0, 10).map((n, i) => (
                    <tr key={i} className="border-b border-border last:border-0">
                      <td className="py-2 text-foreground">{n.sent_at ? new Date(n.sent_at).toLocaleDateString() : '—'}</td>
                      <td className="py-2 text-right text-foreground">{n.recipient_count || 0}</td>
                      <td className="py-2 text-right text-foreground">{n.open_count || 0}</td>
                      <td className="py-2 text-right text-foreground">{n.click_count || 0}</td>
                      <td className="py-2 text-right text-foreground">{n.unsubscribe_count || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}
