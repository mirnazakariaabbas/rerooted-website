import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUser } from '@/contexts/UserContext';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { STAGE_LABELS } from '@/types/user';
import { STAGE_DESCRIPTIONS, ROOTING_IN_DIMENSIONS, WEEKLY_PROMPTS, getDailyQuote } from '@/data/coaching-content';
import { getPriorityDimensions } from '@/data/assessment-questions';
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
import { BookMarked, Star, Pencil, Trash2, Share2, Check, X, MapPin, Quote } from 'lucide-react';

import { differenceInMonths } from 'date-fns';
import {
  ArrowRight, BarChart3, Calendar, BookOpen,
} from 'lucide-react';
import DimensionDetail from '@/components/home/DimensionDetail';
import MiniCalendar from '@/components/home/MiniCalendar';
import AnnouncementBanner from '@/components/AnnouncementBanner';

const MemberHome = () => {
  const { user, reflections, addReflection, updateReflection, deleteReflection, dimensionProgress, assessment } = useUser();
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
  const dailyQuote = getDailyQuote();

  const isRootingIn = user.stage === 'rooting-in';
  const dimensions = ROOTING_IN_DIMENSIONS.filter(d => !d.requiresChildren || user.hasChildren);
  const getProgress = (id: string) => dimensionProgress.find(d => d.dimension === id)?.status || 'not-started';

  const latestScore = assessments.length > 0 ? (assessments[assessments.length - 1] as any).score : null;
  const previousScore = assessments.length > 1 ? (assessments[assessments.length - 2] as any).score : null;
  const scoreDiff = latestScore != null && previousScore != null ? latestScore - previousScore : null;
  const completedSessions = (bookings as any[]).filter(
    b => b.status === 'completed' || new Date(b.scheduled_at) < new Date()
  ).length;

  // Priority focus areas from assessment, used to tag journal entries
  const priorityDimensionIds = useMemo(() => {
    if (!assessment) return [];
    return getPriorityDimensions(assessment.score, assessment.answers);
  }, [assessment]);

  const priorityDimensions = useMemo(
    () => priorityDimensionIds.map(id => ROOTING_IN_DIMENSIONS.find(d => d.id === id)).filter(Boolean) as typeof ROOTING_IN_DIMENSIONS,
    [priorityDimensionIds],
  );

  // Tag a reflection with the most relevant priority dimension (by keyword), fallback to first priority
  const tagFor = (text: string): { id: string; name: string } | null => {
    if (priorityDimensions.length === 0) return null;
    const lower = text.toLowerCase();
    const match = priorityDimensions.find(d =>
      lower.includes(d.name.toLowerCase().split(' ')[0]) ||
      lower.includes(d.id.split('-')[0]),
    );
    const chosen = match || priorityDimensions[0];
    return { id: chosen.id, name: chosen.name };
  };

  // Next upcoming coaching booking, for Daily Quote card footer
  const nextBooking = useMemo(() => {
    const future = (bookings as any[])
      .filter(b => b.status !== 'cancelled' && new Date(b.scheduled_at) >= new Date())
      .sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime());
    return future[0] || null;
  }, [bookings]);


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
      {/* ============ Warm hero greeting ============ */}
      <header className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 pt-6 lg:pt-8">
          <AnnouncementBanner />
        </div>
        <div className="max-w-6xl mx-auto px-6">
          <div
            className="relative overflow-hidden rounded-3xl px-8 py-12 lg:px-12 lg:py-16"
            style={{ backgroundColor: '#F4E9D2' }}
          >
            {/* Soft brand blobs, no gradients */}
            <div aria-hidden className="pointer-events-none absolute -top-10 right-10 h-40 w-40 rounded-full bg-primary/15 blur-3xl" />
            <div aria-hidden className="pointer-events-none absolute bottom-0 right-32 h-32 w-32 rounded-full bg-secondary/25 blur-3xl" />
            <h1 className="relative text-5xl md:text-6xl font-[900] tracking-tight leading-[1.05] text-primary">
              Hello, {greeting}!
            </h1>
            <p className="relative mt-3 text-base md:text-lg text-primary/70 max-w-xl">
              It's good to see you back. Take what you need from today.
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 pt-8">
        {/* ============ Where You Are + Daily Quote row ============ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          {/* Where You Are, 2/3 */}
          <Card
            className="lg:col-span-2 border-0 rounded-3xl"
            style={{ backgroundColor: '#E8E3F3' }}
          >
            <CardContent className="p-7">
              <div className="flex items-start gap-4">
                <div className="h-11 w-11 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs uppercase tracking-[0.18em] font-bold text-secondary mb-2">
                    Where You Are
                  </p>
                  <p className="text-xl md:text-2xl font-[900] tracking-tight text-primary leading-snug">
                    Stage {stageInfo.number}: <span className="text-primary">{stageInfo.name}</span>
                  </p>
                  <p className="mt-3 text-base leading-relaxed text-primary/75">
                    {STAGE_DESCRIPTIONS[user.stage]}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Daily Quote, 1/3 */}
          <Card className="border-0 bg-secondary text-secondary-foreground rounded-3xl relative overflow-hidden">
            <div aria-hidden className="pointer-events-none absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-secondary-foreground/10" />
            <div aria-hidden className="pointer-events-none absolute top-8 right-6 h-16 w-16 rounded-full bg-secondary-foreground/5" />
            <CardContent className="p-7 relative h-full flex flex-col">
              <p className="text-xs uppercase tracking-[0.18em] font-bold opacity-80 mb-3">
                Daily Quote
              </p>
              <Quote className="h-5 w-5 opacity-60 mb-2" />
              <p className="text-lg md:text-xl font-[900] tracking-tight leading-snug flex-1">
                "{dailyQuote}"
              </p>
              {nextBooking && (
                <div className="mt-5 flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-secondary-foreground/15 flex items-center justify-center text-sm font-bold shrink-0">
                    {(nextBooking.coaches?.name || 'YA').split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0 text-xs leading-tight opacity-90">
                    <div className="font-semibold truncate">
                      {nextBooking.coaches?.name || 'Your coach'}
                    </div>
                    <div className="opacity-80">
                      Next session: {new Date(nextBooking.scheduled_at).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                  <button
                    onClick={() => navigate('/app/coach')}
                    className="rounded-full bg-secondary-foreground/20 hover:bg-secondary-foreground/30 transition-colors text-xs font-semibold px-4 py-1.5"
                  >
                    Open
                  </button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* ============ Your Stats: 3 funky standalone cards ============ */}
        <section className="mb-10">
          <p className="text-xs uppercase tracking-[0.18em] font-bold text-secondary mb-4">
            Your Stats
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <FunkyStatCard
              bg="#E97A6F"
              textColor="#FAF9F6"
              icon={<BarChart3 className="h-6 w-6" />}
              value={latestScore != null ? `${latestScore}%` : '...'}
              label="Latest complexity score"
              trailing={
                scoreDiff != null ? (
                  <span className="inline-flex items-center rounded-full bg-white/25 px-2 py-0.5 text-[11px] font-bold">
                    {scoreDiff >= 0 ? '+' : ''}{scoreDiff}
                  </span>
                ) : null
              }
            />
            <FunkyStatCard
              bg="#F4E9D2"
              textColor="#1F299C"
              icon={<Calendar className="h-6 w-6" />}
              value={`${completedSessions}`}
              label="Coaching sessions"
            />
            <FunkyStatCard
              bg="#F7C84A"
              textColor="#1F299C"
              icon={<BookOpen className="h-6 w-6" />}
              value={`${reflections.length}`}
              label="Reflections journaled"
            />
          </div>
        </section>

        {/* ============ Your Month (Calendar) ============ */}
        <section className="mb-10">
          <p className="text-xs uppercase tracking-[0.18em] font-bold text-secondary mb-4">
            Your Month
          </p>
          <Card className="border-0 bg-card rounded-3xl">
            <CardContent className="p-6">
              <MiniCalendar />
            </CardContent>
          </Card>
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


        {/* ============ Weekly Reflection (Deep Blue split card) ============ */}
        <section id="weekly-reflection" className="mb-10">
          <Card className="border-0 bg-primary text-primary-foreground rounded-3xl relative overflow-hidden">
            <div aria-hidden className="pointer-events-none absolute -top-10 -left-10 h-48 w-48 rounded-full bg-primary-foreground/[0.04]" />
            <div aria-hidden className="pointer-events-none absolute bottom-0 right-10 h-32 w-32 rounded-full bg-secondary/15 blur-2xl" />
            <CardContent className="p-7 lg:p-9 relative">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                <div className="md:col-span-2">
                  <p className="text-xs uppercase tracking-[0.18em] font-bold opacity-80 mb-3">
                    This Week's Prompt
                  </p>
                  <p className="text-2xl md:text-3xl italic font-[900] leading-tight tracking-tight">
                    "{weeklyPrompt}"
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-xs opacity-75">
                    <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                    Refreshes Sunday
                    <span className="opacity-50">·</span>
                    Week {weekIndex + 1}
                  </div>
                </div>
                <div className="md:col-span-3 flex flex-col">
                  <Textarea
                    value={reflectionText}
                    onChange={e => setReflectionText(e.target.value)}
                    placeholder="Take your time. There's no right answer."
                    className="min-h-[160px] text-base resize-none bg-primary-foreground text-foreground placeholder:text-foreground/40 border-0 rounded-2xl"
                  />
                  <div className="mt-4 flex items-center justify-between gap-3 flex-wrap">
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <Checkbox
                        id="share-coach"
                        checked={shareWithCoach}
                        onCheckedChange={c => setShareWithCoach(c === true)}
                        className="border-primary-foreground/40 data-[state=checked]:bg-secondary data-[state=checked]:border-secondary"
                      />
                      <span>Share with my coach</span>
                    </label>
                    <Button
                      onClick={handleReflection}
                      disabled={!reflectionText.trim()}
                      className="rounded-full bg-primary-foreground/15 hover:bg-primary-foreground/25 text-primary-foreground border-0 px-7"
                    >
                      Save to journal
                    </Button>
                  </div>
                </div>
              </div>
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
                <div key={n.id} className="p-4 rounded-2xl bg-card">
                  <Badge variant="outline" className="text-[10px] mb-2">
                    {new Date(n.session_date).toLocaleDateString()}
                  </Badge>
                  <p className="text-sm text-foreground">{n.notes}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ============ My Journal grid ============ */}
        <section className="mb-10">
          <Card className="border-0 bg-card rounded-3xl">
            <CardContent className="p-7">
              <div className="flex items-end justify-between mb-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] font-bold text-secondary mb-2">
                    My Journal
                  </p>
                  <h3 className="text-2xl md:text-3xl font-[900] tracking-tight text-primary leading-tight">
                    Whenever you want to write.
                  </h3>
                </div>
                <button
                  onClick={() => setJournalOpen(true)}
                  className="text-sm font-semibold text-primary hover:opacity-80 flex items-center gap-1 shrink-0"
                >
                  See all <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              {reflections.length === 0 ? (
                <div className="rounded-2xl bg-background/50 border border-dashed border-border p-8 text-center">
                  <BookMarked className="h-6 w-6 mx-auto mb-2 text-secondary" />
                  <p className="text-sm text-foreground/70">
                    No entries yet. Start with this week's prompt above.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sortedReflections.slice(0, 4).map(r => {
                    const tag = tagFor(`${r.prompt} ${r.response}`);
                    const pillStyle = getDimensionPillStyle(tag?.id);
                    return (
                      <button
                        key={r.id}
                        onClick={() => setJournalOpen(true)}
                        className="text-left rounded-2xl bg-background hover:bg-accent/20 transition-colors p-5 border border-border/40"
                      >
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <p className="text-[10px] uppercase tracking-[0.18em] font-bold text-foreground/50">
                            {new Date(r.date).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                          </p>
                          <div className="flex items-center gap-1.5 shrink-0">
                            {r.sharedWithCoach && (
                              <Badge variant="outline" className="text-[10px]">Shared</Badge>
                            )}
                            {tag && (
                              <Badge className={`text-[10px] ${pillStyle}`}>{tag.name}</Badge>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-primary line-clamp-3 leading-relaxed">
                          {r.response}
                        </p>
                      </button>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
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
                  {hasMore && (
                    <p className="text-center text-xs text-muted-foreground py-3">
                      Loading more,
                    </p>
                  )}
                </div>
              )}
            </div>
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

// Map a dimension id to a soft pastel pill class set drawn from brand tokens.
function getDimensionPillStyle(dimensionId: string | undefined): string {
  if (!dimensionId) return 'bg-accent/40 text-primary';
  // Stable hash so the same dimension always gets the same color
  let h = 0;
  for (let i = 0; i < dimensionId.length; i++) h = (h * 31 + dimensionId.charCodeAt(i)) >>> 0;
  const palette = [
    'bg-secondary/20 text-secondary',
    'bg-primary/15 text-primary',
    'bg-accent/60 text-primary',
    'bg-warning/20 text-warning',
    'bg-destructive/15 text-destructive',
    'bg-secondary/30 text-secondary',
  ];
  return palette[h % palette.length];
}

export default MemberHome;
