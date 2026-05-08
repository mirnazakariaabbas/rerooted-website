import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, BarChart3, BookOpen, Calendar, TrendingUp, Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { exportToCSV } from '@/utils/csvExport';

export default function EngagementAnalyticsPage() {
  // Member engagement
  const { data: profiles = [] } = useQuery({
    queryKey: ['analytics-profiles'],
    queryFn: async () => {
      const { data } = await supabase.from('profiles').select('id, full_name, created_at, stage, approval_status');
      return data || [];
    },
  });

  const { data: assessments = [] } = useQuery({
    queryKey: ['analytics-assessments'],
    queryFn: async () => {
      const { data } = await supabase.from('assessments').select('id, user_id, score, completed_at, created_at');
      return data || [];
    },
  });

  const { data: reflections = [] } = useQuery({
    queryKey: ['analytics-reflections'],
    queryFn: async () => {
      const { data } = await supabase.from('reflections').select('id, user_id, created_at');
      return data || [];
    },
  });

  const { data: bookings = [] } = useQuery({
    queryKey: ['analytics-bookings'],
    queryFn: async () => {
      const { data } = await supabase.from('meeting_bookings').select('id, coach_id, user_id, scheduled_at, status, duration_minutes');
      return data || [];
    },
  });

  const { data: assignments = [] } = useQuery({
    queryKey: ['analytics-assignments'],
    queryFn: async () => {
      const { data } = await supabase.from('coach_assignments').select('id, coach_id, user_id');
      return data || [];
    },
  });

  const { data: coaches = [] } = useQuery({
    queryKey: ['analytics-coaches'],
    queryFn: async () => {
      const { data } = await supabase.from('coaches').select('id, name, certification_level');
      return data || [];
    },
  });

  const { data: availability = [] } = useQuery({
    queryKey: ['analytics-availability'],
    queryFn: async () => {
      const { data } = await supabase.from('coach_availability').select('id, coach_id');
      return data || [];
    },
  });

  // Computed metrics
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const approvedMembers = profiles.filter(p => p.approval_status === 'approved');
  const completedAssessments = assessments.filter(a => a.completed_at);
  const assessmentRate = approvedMembers.length > 0 ? Math.round((completedAssessments.length / approvedMembers.length) * 100) : 0;
  
  const recentReflections = reflections.filter(r => new Date(r.created_at) > sevenDaysAgo);
  const avgReflectionsPerUser = approvedMembers.length > 0
    ? (reflections.length / approvedMembers.length).toFixed(1)
    : '0';

  // Coach performance
  const coachPerformance = coaches.map(c => {
    const coachAssignments = assignments.filter(a => a.coach_id === c.id);
    const coachBookings = bookings.filter(b => b.coach_id === c.id);
    const coachSlots = availability.filter(a => a.coach_id === c.id);
    const utilization = coachSlots.length > 0
      ? Math.round((coachBookings.length / (coachSlots.length * 4)) * 100) // rough 4-week estimate
      : 0;

    return {
      name: c.name,
      certification: c.certification_level,
      coachees: coachAssignments.length,
      sessions: coachBookings.length,
      utilization: Math.min(utilization, 100),
    };
  }).sort((a, b) => b.sessions - a.sessions);

  // Engagement over time (last 6 months)
  const engagementTrend = Array.from({ length: 6 }, (_, i) => {
    const month = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() - (4 - i), 0);
    const monthLabel = month.toLocaleDateString('en', { month: 'short' });

    return {
      month: monthLabel,
      reflections: reflections.filter(r => {
        const d = new Date(r.created_at);
        return d >= month && d <= monthEnd;
      }).length,
      assessments: assessments.filter(a => {
        const d = new Date(a.created_at);
        return d >= month && d <= monthEnd;
      }).length,
      sessions: bookings.filter(b => {
        const d = new Date(b.scheduled_at);
        return d >= month && d <= monthEnd;
      }).length,
    };
  });

  const exportEngagement = () => {
    exportToCSV(engagementTrend, 'engagement_analytics');
  };

  const exportCoachPerformance = () => {
    exportToCSV(coachPerformance, 'coach_performance');
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="p-6 lg:p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-black text-foreground">Engagement Analytics</h1>
          <p className="text-sm text-muted-foreground mt-1">Member activity and coach performance overview</p>
        </div>
      </div>

      {/* Member Engagement Stats */}
      <div>
        <h2 className="text-lg font-display font-black text-foreground mb-4">Member Engagement</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Approved Members</span>
                <Users className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold text-foreground">{approvedMembers.length}</div>
              <p className="text-xs text-muted-foreground">{profiles.length} total profiles</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Assessment Rate</span>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold text-foreground">{assessmentRate}%</div>
              <p className="text-xs text-muted-foreground">{completedAssessments.length} completed</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Reflections (7d)</span>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold text-foreground">{recentReflections.length}</div>
              <p className="text-xs text-muted-foreground">{avgReflectionsPerUser} avg per member</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Total Sessions</span>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold text-foreground">{bookings.length}</div>
              <p className="text-xs text-muted-foreground">{bookings.filter(b => b.status === 'scheduled').length} upcoming</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Engagement Trend */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Engagement Trend (6 months)</CardTitle>
            <Button variant="outline" size="sm" onClick={exportEngagement}>
              <Download className="h-3 w-3 mr-1.5" /> Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={engagementTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip />
                <Line type="monotone" dataKey="reflections" stroke="hsl(var(--primary))" strokeWidth={2} name="Reflections" />
                <Line type="monotone" dataKey="assessments" stroke="hsl(var(--secondary))" strokeWidth={2} name="Assessments" />
                <Line type="monotone" dataKey="sessions" stroke="hsl(var(--warning))" strokeWidth={2} name="Sessions" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Coach Performance */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-display font-black text-foreground">Coach Performance</h2>
          <Button variant="outline" size="sm" onClick={exportCoachPerformance}>
            <Download className="h-3 w-3 mr-1.5" /> Export CSV
          </Button>
        </div>
        {coachPerformance.length === 0 ? (
          <Card><CardContent className="py-8 text-center text-muted-foreground">No coaches in the system yet</CardContent></Card>
        ) : (
          <>
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={coachPerformance}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                      <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                      <Tooltip />
                      <Bar dataKey="sessions" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Sessions" />
                      <Bar dataKey="coachees" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} name="Coachees" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="rounded-md border overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2.5 px-4 text-muted-foreground font-medium">Coach</th>
                    <th className="text-center py-2.5 px-4 text-muted-foreground font-medium">Certification</th>
                    <th className="text-center py-2.5 px-4 text-muted-foreground font-medium">Coachees</th>
                    <th className="text-center py-2.5 px-4 text-muted-foreground font-medium">Sessions</th>
                    <th className="text-center py-2.5 px-4 text-muted-foreground font-medium">Utilization</th>
                  </tr>
                </thead>
                <tbody>
                  {coachPerformance.map(c => (
                    <tr key={c.name} className="border-b border-border last:border-0">
                      <td className="py-2.5 px-4 font-medium text-foreground">{c.name}</td>
                      <td className="py-2.5 px-4 text-center">
                        <Badge variant="outline" className="text-xs">{c.certification}</Badge>
                      </td>
                      <td className="py-2.5 px-4 text-center text-foreground">{c.coachees}</td>
                      <td className="py-2.5 px-4 text-center text-foreground">{c.sessions}</td>
                      <td className="py-2.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${c.utilization}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">{c.utilization}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
