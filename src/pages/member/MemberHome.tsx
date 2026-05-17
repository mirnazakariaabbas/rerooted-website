import { useState, useEffect, useMemo, useRef } from 'react';
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { BookMarked, Star, Pencil, Trash2, Share2, Check, X } from 'lucide-react';

import { differenceInMonths } from 'date-fns';
import {
  ArrowRight, Globe, BarChart3, Heart, BookOpen, Calendar,
  MessageCircle, ClipboardCheck,
} from 'lucide-react';
import DimensionDetail from '@/components/home/DimensionDetail';
import MiniCalendar from '@/components/home/MiniCalendar';
import AnnouncementBanner from '@/components/AnnouncementBanner';

const MemberHome = () => {
  const { user, reflections, addReflection, updateReflection, deleteReflection, dimensionProgress } = useUser();
  const { user: authUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [reflectionText, setReflectionText] = useState('');
  const [shareWithCoach, setShareWithCoach] = useState(false);
  const [selectedDimension, setSelectedDimension] = useState<string | null>(null);
  const [journalOpen, setJournalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrompt, setEditPrompt] = useState('');
  const [editResponse, setEditResponse] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const PAGE_SIZE = 15;
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const scrollViewportRef = useRef<HTMLDivElement | null>(null);

  const sortedReflections = useMemo(
    () => [...reflections].sort((a, b) => Number(!!b.isFavorite) - Number(!!a.isFavorite)),
    [reflections]
  );
  const visibleReflections = useMemo(
    () => sortedReflections.slice(0, visibleCount),
    [sortedReflections, visibleCount]
  );
  const hasMore = visibleCount < sortedReflections.length;

  useEffect(() => {
    if (journalOpen) setVisibleCount(PAGE_SIZE);
  }, [journalOpen]);

  const handleJournalScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 200 && hasMore) {
      setVisibleCount(c => Math.min(c + PAGE_SIZE, sortedReflections.length));
    }
  };

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
          <h1 className="text-4xl md:text-5xl font-[900] tracking-tight leading-tight">
            Hello, {greeting}!
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
                icon={<Calendar className="h-5 w-5" />}
                iconBg="bg-accent text-accent-foreground"
                value={`${completedSessions}`}
                label="Coaching sessions"
              />
              <StatRow
                icon={<BookOpen className="h-5 w-5" />}
                iconBg="bg-secondary text-secondary-foreground"
                value={`${reflections.length}`}
                label="Reflections journaled"
              />
            </div>
          </CardContent>
        </Card>

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

        {/* ============ Your Month (Calendar) ============ */}
        <section className="mb-10">
          <p className="text-xs uppercase tracking-[0.18em] font-bold text-secondary mb-4">
            Your Month
          </p>
          <Card className="border-0 bg-muted rounded-3xl">
            <CardContent className="p-6">
              <MiniCalendar />
            </CardContent>
          </Card>
        </section>

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
              title="Settling-In Checklist"
              subtitle="Your personal settling-in guide"
              icon={<ClipboardCheck className="h-7 w-7" />}
              tone="accent"
              onClick={() => navigate('/app/settling-in')}
            />
            <ActionTile
              title="My Coach"
              subtitle="Sessions and notes"
              icon={<Heart className="h-7 w-7" />}
              tone="accent"
              onClick={() => navigate('/app/coach')}
            />
            <ActionTile
              title="Assessment"
              subtitle="28-question diagnostic"
              icon={<BarChart3 className="h-7 w-7" />}
              tone="secondary"
              onClick={() => navigate('/app/assessment')}
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

        {/* ============ My Journal ============ */}
        <section>
          <p className="text-xs uppercase tracking-[0.18em] font-bold text-secondary mb-3">
            My Journal
          </p>
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => setJournalOpen(true)}
            className="w-full text-left rounded-2xl p-5 flex items-center gap-4 bg-card border border-border transition-colors hover:bg-muted/40"
          >
            <div className="h-11 w-11 rounded-2xl flex items-center justify-center shrink-0 bg-secondary text-secondary-foreground">
              <BookMarked className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-lg font-[900] tracking-tight leading-tight text-foreground">My Journal</div>
              <div className="text-xs text-muted-foreground mt-1">
                {reflections.length === 0
                  ? 'No entries yet. Start with this week\'s prompt above.'
                  : `${reflections.length} ${reflections.length === 1 ? 'entry' : 'entries'}, tap to read`}
              </div>
            </div>
            <ArrowRight className="h-4 w-4 opacity-60 shrink-0 text-foreground" />
          </motion.button>
        </section>

        <Dialog open={journalOpen} onOpenChange={setJournalOpen}>
          <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
            <DialogHeader>
              <DialogTitle className="text-2xl font-[900] tracking-tight">My Journal</DialogTitle>
            </DialogHeader>
            <div
              ref={scrollViewportRef}
              onScroll={handleJournalScroll}
              className="flex-1 overflow-y-auto -mx-6 px-6"
            >
              {reflections.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-12">
                  No journal entries yet. Answer this week's reflection prompt to get started.
                </p>
              ) : (
                <div className="space-y-4 pb-2">
                  {visibleReflections.map(r => {
                    const isEditing = editingId === r.id;
                    return (
                      <div key={r.id} className="p-4 rounded-2xl bg-muted">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
                            {new Date(r.date).toLocaleDateString('en', { month: 'long', day: 'numeric', year: 'numeric' })}
                          </p>
                          {!isEditing && (
                            <div className="flex items-center gap-1 -mt-1 -mr-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => updateReflection(r.id, { isFavorite: !r.isFavorite })}
                                title={r.isFavorite ? 'Unfavorite' : 'Favorite'}
                              >
                                <Star className={`h-3.5 w-3.5 ${r.isFavorite ? 'fill-secondary text-secondary' : ''}`} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => {
                                  if (r.sharedWithCoach) {
                                    updateReflection(r.id, { sharedWithCoach: false });
                                    toast('Removed from coach');
                                  } else {
                                    updateReflection(r.id, { sharedWithCoach: true });
                                    toast.success('Shared with your coach');
                                  }
                                }}
                                title={r.sharedWithCoach ? 'Unshare with coach' : 'Send to coach'}
                              >
                                <Share2 className={`h-3.5 w-3.5 ${r.sharedWithCoach ? 'text-primary' : ''}`} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => {
                                  setEditingId(r.id);
                                  setEditPrompt(r.prompt);
                                  setEditResponse(r.response);
                                }}
                                title="Edit"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-destructive hover:text-destructive"
                                onClick={() => setDeletingId(r.id)}
                                title="Delete"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          )}
                        </div>

                        {isEditing ? (
                          <div className="space-y-2">
                            <Input
                              value={editPrompt}
                              onChange={e => setEditPrompt(e.target.value)}
                              placeholder="Prompt"
                              className="text-sm italic font-serif bg-background"
                            />
                            <Textarea
                              value={editResponse}
                              onChange={e => setEditResponse(e.target.value)}
                              placeholder="Your response"
                              className="min-h-[100px] text-sm bg-background"
                            />
                            <div className="flex justify-end gap-2 pt-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditingId(null)}
                                className="rounded-full"
                              >
                                <X className="h-3.5 w-3.5 mr-1" /> Cancel
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => {
                                  updateReflection(r.id, {
                                    prompt: editPrompt.trim() || r.prompt,
                                    response: editResponse.trim(),
                                  });
                                  setEditingId(null);
                                  toast.success('Entry updated');
                                }}
                                className="rounded-full"
                              >
                                <Check className="h-3.5 w-3.5 mr-1" /> Save
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <p className="text-sm italic text-foreground/80 font-serif mb-3">"{r.prompt}"</p>
                            <p className="text-sm text-foreground whitespace-pre-wrap">{r.response}</p>
                            <div className="flex flex-wrap gap-1.5 mt-3">
                              {r.isFavorite && (
                                <Badge className="text-[10px] bg-secondary text-secondary-foreground">
                                  <Star className="h-2.5 w-2.5 mr-1 fill-current" /> Favorite
                                </Badge>
                              )}
                              {r.sharedWithCoach && (
                                <Badge variant="outline" className="text-[10px]">Shared with coach</Badge>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          </DialogContent>
        </Dialog>

        <AlertDialog open={!!deletingId} onOpenChange={(o) => !o && setDeletingId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this journal entry?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently remove the prompt and your response. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  if (deletingId) {
                    deleteReflection(deletingId);
                    toast('Entry deleted');
                  }
                  setDeletingId(null);
                }}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
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

function ActionTile({
  title, subtitle, icon, tone, onClick,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  tone: 'primary' | 'secondary' | 'accent' | 'cream';
  onClick: () => void;
}) {
  const styles: Record<string, string> = {
    primary: 'bg-primary text-primary-foreground',
    secondary: 'bg-secondary text-secondary-foreground',
    accent: 'bg-accent text-accent-foreground',
    cream: 'bg-card text-foreground border border-border',
  };
  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className={`w-full text-left rounded-2xl p-5 flex items-center gap-4 transition-colors ${styles[tone]}`}
    >
      <div className="flex-1 min-w-0">
        <div className="text-lg font-[900] tracking-tight leading-tight">{title}</div>
        <div className="text-xs opacity-80 mt-1">{subtitle}</div>
      </div>
      <div className="shrink-0 opacity-90">{icon}</div>
      <ArrowRight className="h-4 w-4 opacity-60 shrink-0" />
    </motion.button>
  );
}

export default MemberHome;
