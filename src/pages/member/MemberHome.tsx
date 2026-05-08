import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUser } from '@/contexts/UserContext';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { STAGE_LABELS } from '@/types/user';
import { STAGE_DESCRIPTIONS, ROOTING_IN_DIMENSIONS, WEEKLY_PROMPTS } from '@/data/coaching-content';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import logoWordmarkWhite from '@/assets/logo-wordmark-white.png';
import { differenceInMonths } from 'date-fns';
import {
  ArrowRight, Globe, BarChart3, Heart, BookOpen, Calendar, Award,
  MessageCircle, Sparkles,
} from 'lucide-react';
import DimensionDetail from '@/components/home/DimensionDetail';
import AnnouncementBanner from '@/components/AnnouncementBanner';

const MemberHome = () => {
  const { user, reflections, addReflection, dimensionProgress } = useUser();
  const { user: authUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [reflectionText, setReflectionText] = useState('');
  const [shareWithCoach, setShareWithCoach] = useState(false);
  const [selectedDimension, setSelectedDimension] = useState<string | null>(null);

  useEffect(() => {
    const dim = searchParams.get('dimension');
    if (dim) {
      setSelectedDimension(dim);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  // ===== Progress data (merged from ProgressPage) =====
  const { data: assessments = [] } = useQuery({
    queryKey: ['my-assessments', authUser?.id],
    queryFn: async () => {
      if (!authUser) return [];
      const { data } = await supabase
        .from('assessments')
        .select('id, score, completed_at, created_at')
        .eq('user_id', authUser.id)
        .not('completed_at', 'is', null)
        .order('completed_at', { ascending: true });
      return data || [];
    },
    enabled: !!authUser,
  });

  const { data: bookings = [] } = useQuery({
    queryKey: ['my-bookings', authUser?.id],
    queryFn: async () => {
      if (!authUser) return [];
      const { data } = await supabase
        .from('meeting_bookings')
        .select('id, scheduled_at, status, duration_minutes')
        .eq('user_id', authUser.id)
        .order('scheduled_at', { ascending: false });
      return data || [];
    },
    enabled: !!authUser,
  });

  const { data: notes = [] } = useQuery({
    queryKey: ['my-coaching-notes', authUser?.id],
    queryFn: async () => {
      if (!authUser) return [];
      const { data } = await (supabase as any)
        .from('coaching_notes')
        .select('id, session_date, notes, created_at')
        .eq('coachee_id', authUser.id)
        .order('session_date', { ascending: false })
        .limit(5);
      return data || [];
    },
    enabled: !!authUser,
  });

  const stageInfo = STAGE_LABELS[user.stage];
  const monthsAgo = user.arrivalDate ? differenceInMonths(new Date(), new Date(user.arrivalDate)) : 0;
  const arrivalText =
    monthsAgo > 0 ? `Arrived ${monthsAgo} month${monthsAgo !== 1 ? 's' : ''} ago` :
    monthsAgo === 0 ? 'Just arrived' : 'Arriving soon';
  const greeting = user.name ? user.name.split(' ')[0] : 'Welcome';
  const weekIndex = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000)) % WEEKLY_PROMPTS.length;
  const weeklyPrompt = WEEKLY_PROMPTS[weekIndex];

  const isRootingIn = user.stage === 'rooting-in';
  const dimensions = ROOTING_IN_DIMENSIONS.filter(d => !d.requiresChildren || user.hasChildren);
  const getProgress = (id: string) => dimensionProgress.find(d => d.dimension === id)?.status || 'not-started';

  const latestScore = assessments.length > 0 ? (assessments[assessments.length - 1] as any).score : null;
  const previousScore = assessments.length > 1 ? (assessments[assessments.length - 2] as any).score : null;
  const scoreDiff = latestScore != null && previousScore != null ? latestScore - previousScore : null;
  const completedSessions = (bookings as any[]).filter(
    b => b.status === 'completed' || new Date(b.scheduled_at) < new Date()
  ).length;
  const reflectionMilestones = [10, 25, 50, 100];
  const currentMilestone = reflectionMilestones.find(m => reflections.length < m) || 100;
  const milestonePct = Math.min((reflections.length / currentMilestone) * 100, 100);


  const handleReflection = () => {
    if (reflectionText.trim()) {
      addReflection({ prompt: weeklyPrompt, response: reflectionText.trim(), sharedWithCoach: shareWithCoach });
      setReflectionText('');
      setShareWithCoach(false);
    }
  };

  if (selectedDimension) {
    const dim = ROOTING_IN_DIMENSIONS.find(d => d.id === selectedDimension)!;
    return <DimensionDetail dimension={dim} onBack={() => setSelectedDimension(null)} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="pb-24"
    >
      {/* ============ Curved Deep Blue Header ============ */}
      <header className="relative bg-primary text-primary-foreground overflow-hidden rounded-b-[3rem] px-6 pt-10 pb-16 lg:pt-14 lg:pb-20">
        {/* Concentric arched accents */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[180%] h-72 rounded-[50%] bg-primary-foreground/[0.04]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-[140%] h-72 rounded-[50%] bg-primary-foreground/[0.06]"
        />

        <div className="relative max-w-2xl mx-auto">
          <AnnouncementBanner />
          <img
            src={logoWordmarkWhite}
            alt="Re-Rooted®"
            className="h-6 w-auto object-contain opacity-80 mb-3"
          />
          <h1 className="text-4xl md:text-5xl font-[900] tracking-tight leading-tight">
            Hello, {greeting}.
          </h1>
          <p className="mt-2 text-base text-primary-foreground/80">
            Stage {stageInfo.number}: {stageInfo.name}
            {user.countryFrom && user.countryTo && (
              <span className="block text-sm text-primary-foreground/60 mt-0.5">
                {user.countryFrom} to {user.countryTo}, {arrivalText}
              </span>
            )}
          </p>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6 -mt-10 relative">
        {/* ============ Stats Card (Headspace style) ============ */}
        <Card className="border-0 bg-muted rounded-3xl mb-10">
          <CardContent className="p-6">
            <p className="text-xs uppercase tracking-[0.18em] font-bold text-muted-foreground mb-4">
              Your Stats
            </p>
            <div className="space-y-5">
              <StatRow
                icon={<BarChart3 className="h-5 w-5" />}
                iconBg="bg-primary text-primary-foreground"
                value={latestScore != null ? `${latestScore}%` : '—'}
                label="Latest complexity score"
                trailing={
                  scoreDiff != null ? (
                    <Badge
                      className={`text-[10px] ${
                        scoreDiff >= 0
                          ? 'bg-secondary text-secondary-foreground'
                          : 'bg-destructive text-destructive-foreground'
                      }`}
                    >
                      {scoreDiff >= 0 ? '+' : ''}{scoreDiff}
                    </Badge>
                  ) : null
                }
              />
              <StatRow
                icon={<BookOpen className="h-5 w-5" />}
                iconBg="bg-secondary text-secondary-foreground"
                value={`${reflections.length}`}
                label="Reflections journaled"
              />
              <StatRow
                icon={<Calendar className="h-5 w-5" />}
                iconBg="bg-accent text-accent-foreground"
                value={`${completedSessions}`}
                label="Coaching sessions"
              />
              <StatRow
                icon={<Award className="h-5 w-5" />}
                iconBg="bg-primary text-primary-foreground"
                value={`${assessments.length}`}
                label="Assessments completed"
              />
            </div>
          </CardContent>
        </Card>

        {/* ============ Reflection Streak / Milestone ============ */}
        <section className="mb-10">
          <p className="text-xs uppercase tracking-[0.18em] font-bold text-secondary mb-3">
            Reflection Streak
          </p>
          <div className="flex items-end gap-4 mb-3">
            <div className="text-5xl font-[900] tracking-tight text-foreground leading-none">
              {reflections.length}
            </div>
            <div className="pb-1">
              <p className="text-sm font-semibold text-foreground">
                of {currentMilestone} reflections
              </p>
              <p className="text-xs text-muted-foreground">
                {currentMilestone - reflections.length > 0
                  ? `${currentMilestone - reflections.length} more to your next milestone`
                  : 'Milestone reached.'}
              </p>
            </div>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${milestonePct}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full bg-secondary rounded-full"
            />
          </div>
        </section>

        {/* ============ Where You Are ============ */}
        <Card className="mb-10 border-0 bg-accent/40 rounded-3xl">
          <CardContent className="p-6">
            <p className="text-xs uppercase tracking-[0.18em] font-bold text-primary mb-2">
              Where You Are
            </p>
            <p className="text-sm leading-relaxed text-foreground/80">
              {STAGE_DESCRIPTIONS[user.stage]}
            </p>
          </CardContent>
        </Card>

        {/* ============ Action Tiles (phone screenshot style) ============ */}
        <section className="mb-10">
          <p className="text-xs uppercase tracking-[0.18em] font-bold text-secondary mb-4">
            My App
          </p>
          <div className="space-y-3">
            <ActionTile
              title="Cultural Companion"
              subtitle="Compare 195 cultures"
              icon={<Globe className="h-7 w-7" />}
              tone="primary"
              onClick={() => navigate('/app/cultural')}
            />
            <ActionTile
              title="Daily Reflection"
              subtitle="Journal this week's prompt"
              icon={<Sparkles className="h-7 w-7" />}
              tone="cream"
              onClick={() => {
                document.getElementById('weekly-reflection')?.scrollIntoView({ behavior: 'smooth' });
              }}
            />
            <ActionTile
              title="Complexity Assessment"
              subtitle="28-question diagnostic"
              icon={<BarChart3 className="h-7 w-7" />}
              tone="secondary"
              onClick={() => navigate('/app/assessment')}
            />
            <ActionTile
              title="My Coach"
              subtitle="Sessions and notes"
              icon={<Heart className="h-7 w-7" />}
              tone="accent"
              onClick={() => navigate('/app/coach')}
            />
            <ActionTile
              title="Messages"
              subtitle="Talk with your coach"
              icon={<MessageCircle className="h-7 w-7" />}
              tone="cream"
              onClick={() => navigate('/app/messages')}
            />
          </div>
        </section>

        {/* ============ Focus Areas (Rooting In dimensions) ============ */}
        {isRootingIn && (
          <section className="mb-10">
            <p className="text-xs uppercase tracking-[0.18em] font-bold text-secondary mb-4">
              Your Focus Areas
            </p>
            <div className="space-y-3">
              {dimensions.map(dim => {
                const status = getProgress(dim.id);
                const statusStyle =
                  status === 'explored' ? 'bg-primary/15 text-primary' :
                  status === 'in-progress' ? 'bg-accent/30 text-accent-foreground' :
                  'bg-muted text-muted-foreground';
                return (
                  <button
                    key={dim.id}
                    onClick={() => setSelectedDimension(dim.id)}
                    className="w-full text-left rounded-2xl border border-border bg-background hover:bg-muted/40 transition-colors p-4 flex items-center gap-3"
                  >
                    <span className="text-2xl">{dim.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm text-foreground">{dim.name}</div>
                      <div className="text-xs text-muted-foreground truncate">{dim.shortDescription}</div>
                    </div>
                    <Badge className={`text-[10px] shrink-0 ${statusStyle}`}>
                      {status.replace('-', ' ')}
                    </Badge>
                  </button>
                );
              })}
            </div>
          </section>
        )}


        {/* ============ Weekly Reflection ============ */}
        <section id="weekly-reflection" className="mb-10">
          <p className="text-xs uppercase tracking-[0.18em] font-bold text-secondary mb-3">
            Weekly Reflection
          </p>
          <Card className="border-0 bg-card rounded-3xl">
            <CardContent className="p-6">
              <p className="text-base italic mb-4 text-foreground/80 font-serif">"{weeklyPrompt}"</p>
              <Textarea
                value={reflectionText}
                onChange={e => setReflectionText(e.target.value)}
                placeholder="Write your thoughts..."
                className="min-h-[80px] text-sm resize-none mb-3 bg-background border-border rounded-2xl"
              />
              <div className="flex items-center gap-2 mb-3">
                <Checkbox
                  id="share-coach"
                  checked={shareWithCoach}
                  onCheckedChange={c => setShareWithCoach(c === true)}
                />
                <label htmlFor="share-coach" className="text-xs text-muted-foreground cursor-pointer">
                  Share this entry with my coach
                </label>
              </div>
              <Button
                onClick={handleReflection}
                disabled={!reflectionText.trim()}
                className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Save to journal
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* ============ Coach Notes ============ */}
        {notes.length > 0 && (
          <section className="mb-10">
            <p className="text-xs uppercase tracking-[0.18em] font-bold text-secondary mb-3">
              Coach Session Notes
            </p>
            <div className="space-y-3">
              {(notes as any[]).map(n => (
                <div key={n.id} className="p-4 rounded-2xl bg-muted">
                  <Badge variant="outline" className="text-[10px] mb-2">
                    {new Date(n.session_date).toLocaleDateString()}
                  </Badge>
                  <p className="text-sm text-foreground">{n.notes}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ============ Recent Reflections ============ */}
        {reflections.length > 0 && (
          <section>
            <p className="text-xs uppercase tracking-[0.18em] font-bold text-secondary mb-3">
              Recent Reflections
            </p>
            <div className="space-y-3">
              {reflections.slice(0, 8).map(r => (
                <div key={r.id} className="flex items-start gap-3 p-3 rounded-2xl bg-background border border-border">
                  <div className="w-2 h-2 rounded-full bg-secondary mt-2 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground truncate">{r.prompt}</p>
                    <p className="text-[10px] text-muted-foreground">{new Date(r.date).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </motion.div>
  );
};

// ===== Helpers =====

function StatRow({
  icon, iconBg, value, label, trailing,
}: {
  icon: React.ReactNode;
  iconBg: string;
  value: string;
  label: string;
  trailing?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-4">
      <div className={`h-11 w-11 rounded-2xl flex items-center justify-center shrink-0 ${iconBg}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xl font-[900] tracking-tight text-foreground leading-tight">{value}</div>
        <div className="text-xs text-muted-foreground">{label}</div>
      </div>
      {trailing}
    </div>
  );
}

import { ActionTile } from '@/components/layout/ActionTile';

export default MemberHome;
