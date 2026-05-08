import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { TrendingUp, Globe, Search, Link2, Zap, AlertTriangle, CheckCircle, XCircle, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const healthScore = 72;
const breakdowns = [
  { label: 'Technical', score: 85, color: 'bg-secondary text-secondary-foreground' },
  { label: 'Content', score: 68, color: 'bg-warning text-warning-foreground' },
  { label: 'On-Page', score: 74, color: 'bg-primary text-primary-foreground' },
  { label: 'Backlinks', score: 55, color: 'bg-destructive text-destructive-foreground' },
  { label: 'Performance', score: 78, color: 'bg-accent text-accent-foreground' },
];

const trafficData = [
  { month: 'Oct', sessions: 1200, impressions: 8400, ctr: 3.2 },
  { month: 'Nov', sessions: 1450, impressions: 9800, ctr: 3.5 },
  { month: 'Dec', sessions: 1380, impressions: 9200, ctr: 3.4 },
  { month: 'Jan', sessions: 1620, impressions: 11200, ctr: 3.8 },
  { month: 'Feb', sessions: 1780, impressions: 12600, ctr: 4.1 },
  { month: 'Mar', sessions: 1950, impressions: 14200, ctr: 4.3 },
];

const keywords = [
  { keyword: 'expat coaching switzerland', position: 3, volume: 880, change: +2 },
  { keyword: 'relocation coaching zurich', position: 5, volume: 590, change: +1 },
  { keyword: 'cultural integration program', position: 8, volume: 720, change: -1 },
  { keyword: 'expat support services', position: 12, volume: 1100, change: +3 },
  { keyword: 'international relocation coach', position: 15, volume: 460, change: +5 },
  { keyword: 'swiss expat community', position: 18, volume: 340, change: 0 },
  { keyword: 'cross cultural coaching', position: 22, volume: 520, change: -2 },
  { keyword: 'expat mental health support', position: 7, volume: 680, change: +4 },
];

const quickWins = [
  { keyword: 'expat burnout coaching', position: 14, potential: 'High', volume: 390 },
  { keyword: 'trailing spouse support', position: 16, potential: 'High', volume: 280 },
  { keyword: 'expat family counseling', position: 19, potential: 'Medium', volume: 450 },
];

const vitals = [
  { label: 'LCP', value: '2.1s', pass: true },
  { label: 'INP', value: '120ms', pass: true },
  { label: 'CLS', value: '0.08', pass: true },
];

const technicalChecks = [
  { label: 'Mobile-Friendly', pass: true },
  { label: 'HTTPS', pass: true },
  { label: 'Sitemap', pass: true },
  { label: 'Robots.txt', pass: true },
];

const contentIssues = [
  { label: 'Missing Meta Descriptions', count: 4 },
  { label: 'Missing H1 Tags', count: 1 },
  { label: 'Duplicate Titles', count: 2 },
  { label: 'Images Without Alt Text', count: 7 },
];

const recommendations = [
  { id: '1', text: 'Add meta descriptions to 4 pages missing them', impact: 'High', effort: 'Low', done: false },
  { id: '2', text: 'Build backlinks from Swiss expat directories', impact: 'High', effort: 'High', done: false },
  { id: '3', text: 'Create content targeting "trailing spouse support"', impact: 'High', effort: 'Medium', done: false },
  { id: '4', text: 'Add alt text to 7 images', impact: 'Medium', effort: 'Low', done: false },
  { id: '5', text: 'Fix 2 duplicate title tags', impact: 'Medium', effort: 'Low', done: false },
  { id: '6', text: 'Optimize internal linking structure', impact: 'Medium', effort: 'Medium', done: false },
];

const benchmarks = [
  { metric: 'Domain Authority', yours: 28, industry: 35 },
  { metric: 'Referring Domains', yours: 42, industry: 85 },
  { metric: 'Indexed Pages', yours: 34, industry: 60 },
  { metric: 'Avg. Load Time', yours: '2.1s', industry: '2.5s' },
  { metric: 'Mobile Score', yours: 92, industry: 78 },
];

function ScoreGauge({ score }: { score: number }) {
  const color = score >= 80 ? 'text-secondary' : score >= 60 ? 'text-warning' : 'text-destructive';
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (score / 100) * circumference;
  return (
    <div className="relative w-32 h-32">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" fill="none" stroke="hsl(var(--border))" strokeWidth="8" />
        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset} className={color} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-3xl font-bold ${color}`}>{score}</span>
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Health</span>
      </div>
    </div>
  );
}

export default function SeoAnalyticsPage() {
  const [recs, setRecs] = useState(recommendations);

  const toggleRec = (id: string) => {
    setRecs(prev => prev.map(r => r.id === id ? { ...r, done: !r.done } : r));
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="p-6 lg:p-8 space-y-8">
      {/* Sample Data Banner */}
      <div className="bg-warning/10 border border-warning/30 rounded-lg px-4 py-3 flex items-center gap-3">
        <AlertTriangle className="h-4 w-4 text-warning shrink-0" />
        <p className="text-sm text-foreground">
          <strong>Sample Data</strong> — Connect Google Search Console for live metrics.
        </p>
        <Button size="sm" variant="outline" className="ml-auto shrink-0">
          <ExternalLink className="h-3 w-3 mr-1.5" /> Connect GSC
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-black text-foreground">SEO Analytics</h1>
          <p className="text-sm text-muted-foreground mt-1">re-rooted.com — Performance overview</p>
        </div>
      </div>

      {/* Health Score + Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-6">
        <Card>
          <CardContent className="pt-6 flex flex-col items-center">
            <ScoreGauge score={healthScore} />
            <p className="text-sm text-muted-foreground mt-3">Overall SEO Health</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Category Scores</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {breakdowns.map(b => (
                <div key={b.label} className="text-center space-y-2">
                  <div className="text-2xl font-bold text-foreground">{b.score}</div>
                  <Badge className={b.color}>{b.label}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Traffic & Visibility */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Organic Sessions', value: '1,950', icon: TrendingUp, change: '+9.6%' },
          { label: 'Impressions', value: '14,200', icon: Globe, change: '+12.7%' },
          { label: 'CTR', value: '4.3%', icon: Search, change: '+0.5%' },
          { label: 'Avg. Position', value: '12.4', icon: Zap, change: '+1.8' },
        ].map(m => (
          <Card key={m.label}>
            <CardContent className="pt-5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">{m.label}</span>
                <m.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold text-foreground">{m.value}</div>
              <span className="text-xs text-secondary font-medium">{m.change} vs last month</span>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Traffic Chart */}
      <Card>
        <CardHeader><CardTitle className="text-base">Traffic Trend (6 months)</CardTitle></CardHeader>
        <CardContent>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trafficData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip />
                <Area type="monotone" dataKey="sessions" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.1)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Keywords */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Top Keywords</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {keywords.map(k => (
                <div key={k.keyword} className="flex items-center justify-between text-sm py-1.5 border-b border-border last:border-0">
                  <span className="text-foreground truncate flex-1">{k.keyword}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-muted-foreground text-xs w-12 text-right">{k.volume}/mo</span>
                    <Badge variant="outline" className="w-10 justify-center">#{k.position}</Badge>
                    <span className={`text-xs w-8 text-right ${k.change > 0 ? 'text-secondary' : k.change < 0 ? 'text-destructive' : 'text-muted-foreground'}`}>
                      {k.change > 0 ? `+${k.change}` : k.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Quick-Win Opportunities</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {quickWins.map(q => (
                <div key={q.keyword} className="p-3 rounded-lg bg-muted/50 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">{q.keyword}</p>
                    <p className="text-xs text-muted-foreground">Position #{q.position} · {q.volume}/mo</p>
                  </div>
                  <Badge className={q.potential === 'High' ? 'bg-secondary text-secondary-foreground' : 'bg-warning text-warning-foreground'}>
                    {q.potential}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Technical SEO */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Core Web Vitals</CardTitle></CardHeader>
          <CardContent>
            <div className="flex gap-4">
              {vitals.map(v => (
                <div key={v.label} className="flex-1 text-center p-3 rounded-lg bg-muted/50">
                  <div className="text-lg font-bold text-foreground">{v.value}</div>
                  <div className="text-xs text-muted-foreground">{v.label}</div>
                  <Badge className={`mt-1 ${v.pass ? 'bg-secondary text-secondary-foreground' : 'bg-destructive text-destructive-foreground'}`}>
                    {v.pass ? 'Pass' : 'Fail'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Technical Checks</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {technicalChecks.map(c => (
                <div key={c.label} className="flex items-center gap-2">
                  {c.pass ? <CheckCircle className="h-4 w-4 text-secondary" /> : <XCircle className="h-4 w-4 text-destructive" />}
                  <span className="text-sm text-foreground">{c.label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Issues */}
      <Card>
        <CardHeader><CardTitle className="text-base">Content & On-Page Issues</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {contentIssues.map(c => (
              <div key={c.label} className="text-center p-4 rounded-lg bg-muted/50">
                <div className="text-2xl font-bold text-warning">{c.count}</div>
                <p className="text-xs text-muted-foreground mt-1">{c.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Backlinks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card><CardContent className="pt-5 text-center"><div className="text-2xl font-bold text-foreground">42</div><p className="text-xs text-muted-foreground">Referring Domains</p></CardContent></Card>
        <Card><CardContent className="pt-5 text-center"><div className="text-2xl font-bold text-secondary">+5</div><p className="text-xs text-muted-foreground">New This Month</p><div className="text-xs text-destructive mt-1">-2 Lost</div></CardContent></Card>
        <Card><CardContent className="pt-5 text-center"><div className="text-2xl font-bold text-foreground">28</div><p className="text-xs text-muted-foreground">Domain Authority</p></CardContent></Card>
      </div>

      {/* Recommendations */}
      <Card>
        <CardHeader><CardTitle className="text-base">Recommendations</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recs.map(r => (
              <div key={r.id} className={`flex items-start gap-3 p-3 rounded-lg border border-border ${r.done ? 'opacity-50' : ''}`}>
                <Checkbox checked={r.done} onCheckedChange={() => toggleRec(r.id)} className="mt-0.5" />
                <div className="flex-1">
                  <p className={`text-sm ${r.done ? 'line-through text-muted-foreground' : 'text-foreground'}`}>{r.text}</p>
                </div>
                <div className="flex gap-1.5">
                  <Badge className={r.impact === 'High' ? 'bg-secondary text-secondary-foreground' : 'bg-warning text-warning-foreground'}>
                    {r.impact}
                  </Badge>
                  <Badge variant="outline">{r.effort}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Benchmark */}
      <Card>
        <CardHeader><CardTitle className="text-base">Industry Benchmark Comparison</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 text-muted-foreground font-medium">Metric</th>
                  <th className="text-right py-2 text-muted-foreground font-medium">Re-Rooted®</th>
                  <th className="text-right py-2 text-muted-foreground font-medium">Industry Avg</th>
                </tr>
              </thead>
              <tbody>
                {benchmarks.map(b => (
                  <tr key={b.metric} className="border-b border-border last:border-0">
                    <td className="py-2.5 text-foreground">{b.metric}</td>
                    <td className="py-2.5 text-right font-medium text-foreground">{b.yours}</td>
                    <td className="py-2.5 text-right text-muted-foreground">{b.industry}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
