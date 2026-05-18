import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useUser } from '@/contexts/UserContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, BookOpen, Calendar, Award } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ProgressPage = () => {
  const { user: authUser } = useAuth();
  const { user } = useUser();

  const { data: assessments = [] } = useQuery({
    queryKey: ['my-assessments', authUser?.id],
    queryFn: async () => {
      if (!authUser) return [];
      const { data } = await supabase.from('assessments').select('id, score, completed_at, created_at').eq('user_id', authUser.id).not('completed_at', 'is', null).order('completed_at', { ascending: true });
      return data || [];
    },
    enabled: !!authUser,
  });

  const { data: reflections = [] } = useQuery({
    queryKey: ['my-reflections', authUser?.id],
    queryFn: async () => {
      if (!authUser) return [];
      const { data } = await supabase.from('reflections').select('id, created_at, prompt').eq('user_id', authUser.id).order('created_at', { ascending: false });
      return data || [];
    },
    enabled: !!authUser,
  });

  const { data: bookings = [] } = useQuery({
    queryKey: ['my-bookings', authUser?.id],
    queryFn: async () => {
      if (!authUser) return [];
      const { data } = await supabase.from('meeting_bookings').select('id, scheduled_at, status, duration_minutes').eq('user_id', authUser.id).order('scheduled_at', { ascending: false });
      return data || [];
    },
    enabled: !!authUser,
  });

  const { data: notes = [] } = useQuery({
    queryKey: ['my-coaching-notes', authUser?.id],
    queryFn: async () => {
      if (!authUser) return [];
      const { data } = await (supabase as any).from('coaching_notes').select('id, session_date, notes, created_at').eq('coachee_id', authUser.id).order('session_date', { ascending: false }).limit(10);
      return data || [];
    },
    enabled: !!authUser,
  });

  const assessmentTrend = assessments.map((a: any) => ({
    date: new Date(a.completed_at).toLocaleDateString('en', { month: 'short', day: 'numeric' }),
    score: a.score,
  }));

  const latestScore = assessments.length > 0 ? assessments[assessments.length - 1].score : null;
  const previousScore = assessments.length > 1 ? assessments[assessments.length - 2].score : null;
  const scoreDiff = latestScore != null && previousScore != null ? latestScore - previousScore : null;
  const completedSessions = bookings.filter((b: any) => b.status === 'completed' || new Date(b.scheduled_at) < new Date()).length;
  const reflectionMilestones = [10, 25, 50, 100];
  const currentMilestone = reflectionMilestones.find(m => reflections.length < m) || 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="pb-24 px-6 pt-8 lg:px-12 max-w-2xl mx-auto"
    >
      <h1 className="text-3xl font-[900] tracking-tight mb-2">Your Progress</h1>
      <p className="text-sm text-muted-foreground mb-10">Track your integration journey</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <Card className="border border-border">
          <CardContent className="pt-6 pb-4 text-center">
            <BarChart3 className="h-5 w-5 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">{latestScore != null ? `${latestScore}%` : ', '}</div>
            <p className="text-xs text-muted-foreground">Latest Score</p>
            {scoreDiff != null && (
              <Badge className={`mt-1 text-[10px] ${scoreDiff >= 0 ? 'bg-secondary text-secondary-foreground' : 'bg-destructive text-destructive-foreground'}`}>
                {scoreDiff >= 0 ? '+' : ''}{scoreDiff}
              </Badge>
            )}
          </CardContent>
        </Card>
        <Card className="border border-border">
          <CardContent className="pt-6 pb-4 text-center">
            <BookOpen className="h-5 w-5 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">{reflections.length}</div>
            <p className="text-xs text-muted-foreground">Reflections</p>
          </CardContent>
        </Card>
        <Card className="border border-border">
          <CardContent className="pt-6 pb-4 text-center">
            <Calendar className="h-5 w-5 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">{completedSessions}</div>
            <p className="text-xs text-muted-foreground">Sessions</p>
          </CardContent>
        </Card>
        <Card className="border border-border">
          <CardContent className="pt-6 pb-4 text-center">
            <Award className="h-5 w-5 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">{assessments.length}</div>
            <p className="text-xs text-muted-foreground">Assessments</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6 border border-border">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Reflection Milestone</span>
            <span className="text-xs text-muted-foreground">{reflections.length} / {currentMilestone}</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${Math.min((reflections.length / currentMilestone) * 100, 100)}%` }} />
          </div>
          <p className="text-xs text-muted-foreground mt-1.5">
            {currentMilestone - reflections.length > 0
              ? `${currentMilestone - reflections.length} more to reach ${currentMilestone} reflections!`
              : 'Milestone reached! 🎉'}
          </p>
        </CardContent>
      </Card>

      {assessmentTrend.length > 0 && (
        <Card className="mb-6 border border-border">
          <CardHeader><CardTitle className="text-base font-[900] tracking-tight">Assessment Score Trend</CardTitle></CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={assessmentTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {notes.length > 0 && (
        <Card className="mb-6 border border-border">
          <CardHeader><CardTitle className="text-base font-[900] tracking-tight">Coach Session Notes</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {notes.map((n: any) => (
                <div key={n.id} className="p-3 rounded-lg bg-muted">
                  <Badge variant="outline" className="text-[10px] mb-1.5">{new Date(n.session_date).toLocaleDateString()}</Badge>
                  <p className="text-sm text-foreground">{n.notes}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border border-border">
        <CardHeader><CardTitle className="text-base font-[900] tracking-tight">Recent Reflections</CardTitle></CardHeader>
        <CardContent>
          {reflections.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">No reflections yet. Start journaling from the Home tab!</p>
          ) : (
            <div className="space-y-3">
              {reflections.slice(0, 8).map((r: any) => (
                <div key={r.id} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground truncate">{r.prompt}</p>
                    <p className="text-[10px] text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProgressPage;
