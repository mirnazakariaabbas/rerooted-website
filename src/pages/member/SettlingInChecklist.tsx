import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { differenceInMonths } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { useUser } from '@/contexts/UserContext';
import { supabase } from '@/integrations/supabase/client';
import PageHeader from '@/components/layout/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Sprout, Leaf, Flower2, Calendar as CalendarIcon, Sparkles, Check, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';

type Phase = 'laying-the-ground' | 'tending-the-garden' | 'starting-to-bloom';

interface ChecklistItemRow {
  id: string;
  phase: Phase;
  category: string;
  title: string;
  description: string | null;
  is_completed: boolean;
  sort_order: number;
  is_family_only: boolean;
  is_partner_only: boolean;
  is_solo_only: boolean;
}

interface Preferences {
  priorities: string[];
  feeling: string;
  onboarding_complete: boolean;
}

type Tone = 'primary' | 'accent' | 'secondary' | 'cream';
const PHASES: { id: Phase; name: string; icon: typeof Sprout; description: string; tone: Tone }[] = [
  { id: 'laying-the-ground', name: 'Laying the Ground', icon: Sprout, description: 'The essentials. Get these sorted and everything else gets easier.', tone: 'primary' },
  { id: 'tending-the-garden', name: 'Tending the Garden', icon: Leaf, description: 'Daily life is taking shape. These are the things that make it feel like yours.', tone: 'accent' },
  { id: 'starting-to-bloom', name: 'Starting to Bloom', icon: Flower2, description: 'The part that makes it all worth it. Connection, discovery, belonging.', tone: 'secondary' },
];

const TONE_STYLES: Record<Tone, { header: string; subtitle: string; iconBg: string; chevron: string }> = {
  primary: { header: 'bg-primary text-primary-foreground', subtitle: 'text-primary-foreground/80', iconBg: 'text-primary-foreground', chevron: 'text-primary-foreground/80' },
  secondary: { header: 'bg-secondary text-secondary-foreground', subtitle: 'text-secondary-foreground/80', iconBg: 'text-secondary-foreground', chevron: 'text-secondary-foreground/80' },
  accent: { header: 'bg-accent text-accent-foreground', subtitle: 'text-accent-foreground/80', iconBg: 'text-accent-foreground', chevron: 'text-accent-foreground/80' },
  cream: { header: 'bg-card text-foreground border border-border', subtitle: 'text-muted-foreground', iconBg: 'text-foreground', chevron: 'text-foreground/60' },
};

const REWARD_MESSAGES = [
  'One more thing settled.',
  'Look at you, getting grounded.',
  "That's one less thing on your mind.",
  "You're doing this.",
  'Another root planted.',
  'Nicely done.',
  'Small steps, deep roots.',
  "Home isn't found. It's built.",
  'Every journey starts with a single step.',
  "You're planting seeds that will grow.",
  'Your future self will thank you for this one.',
  "That wasn't so bad, was it?",
  "One down. You've got this.",
];

const PRIORITY_OPTIONS = [
  { id: 'admin', label: 'Getting the essentials sorted' },
  { id: 'daily-life', label: 'Finding my rhythm' },
  { id: 'family', label: 'Helping my family settle', familyOnly: true },
  { id: 'social', label: 'Meeting people' },
  { id: 'emotional', label: 'Feeling at home' },
];

const FEELING_OPTIONS = [
  { id: 'excited', label: 'Excited and ready' },
  { id: 'overwhelmed', label: 'A bit overwhelmed' },
  { id: 'arrived', label: 'Already here and figuring it out' },
  { id: 'unsettled', label: 'Been here a while but still unsettled' },
];

// ============= PAGE =============
const SettlingInChecklist = () => {
  const { user: authUser } = useAuth();
  const { user } = useUser();
  const qc = useQueryClient();

  const { data: prefs, isLoading: prefsLoading } = useQuery<Preferences | null>({
    queryKey: ['checklist-prefs', authUser?.id],
    queryFn: async () => {
      if (!authUser) return null;
      const { data } = await (supabase as any)
        .from('checklist_preferences')
        .select('priorities, feeling, onboarding_complete')
        .eq('user_id', authUser.id)
        .maybeSingle();
      return data as Preferences | null;
    },
    enabled: !!authUser,
  });

  const { data: items = [], isLoading: itemsLoading } = useQuery<ChecklistItemRow[]>({
    queryKey: ['checklist-items', authUser?.id],
    queryFn: async () => {
      if (!authUser) return [];
      const { data } = await (supabase as any)
        .from('checklist_items')
        .select('*')
        .eq('user_id', authUser.id)
        .order('sort_order', { ascending: true });
      return (data || []) as ChecklistItemRow[];
    },
    enabled: !!authUser,
  });

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ['checklist-prefs', authUser?.id] });
    qc.invalidateQueries({ queryKey: ['checklist-items', authUser?.id] });
    qc.invalidateQueries({ queryKey: ['mini-cal-events', authUser?.id] });
  };

  const showOnboarding = !prefsLoading && (!prefs || !prefs.onboarding_complete);

  return (
    <>
      <PageHeader title="Settling In" subtitle="Your personal guide to making this place home" />
      <div className="max-w-2xl mx-auto px-6 -mt-10 relative pb-24">
        {prefsLoading || itemsLoading ? (
          <Card className="border-0 bg-card rounded-3xl">
            <CardContent className="p-8 text-center text-muted-foreground text-sm">Loading…</CardContent>
          </Card>
        ) : showOnboarding ? (
          <ChecklistOnboarding onDone={refresh} />
        ) : (
          <ChecklistView items={items} onChange={refresh} />
        )}
      </div>
    </>
  );
};

// ============= ONBOARDING =============
const ChecklistOnboarding = ({ onDone }: { onDone: () => void }) => {
  const { user: authUser } = useAuth();
  const { user } = useUser();
  const [step, setStep] = useState(0);
  const [priorities, setPriorities] = useState<string[]>([]);
  const [feeling, setFeeling] = useState('excited');
  const [saving, setSaving] = useState(false);

  const familyVisible = user.hasChildren || user.familySetup === 'with-partner' || user.familySetup === 'with-family';
  const options = PRIORITY_OPTIONS.filter(o => !o.familyOnly || familyVisible);

  const togglePriority = (id: string) => {
    setPriorities(p => {
      if (p.includes(id)) return p.filter(x => x !== id);
      if (p.length >= 3) return p;
      return [...p, id];
    });
  };

  const finish = async () => {
    if (!authUser) return;
    setSaving(true);
    try {
      // Call edge function for items
      const { data: aiData, error: fnErr } = await supabase.functions.invoke('settling-checklist', {
        body: {
          countryTo: user.countryTo,
          familySetup: user.familySetup,
          hasChildren: user.hasChildren,
          priorities,
        },
      });
      if (fnErr) console.warn('settling-checklist function error', fnErr);

      const items = (aiData?.items || []) as any[];

      // Filter by audience
      const filtered = items.filter(it => {
        if (it.is_family_only && !user.hasChildren) return false;
        if (it.is_partner_only && user.familySetup === 'alone') return false;
        return true;
      });

      // Re-rank: priority categories get lower sort_order within phase
      const phaseCounters: Record<string, number> = {};
      const rows = filtered.map(it => {
        const isPriority = priorities.includes(it.category);
        const baseOrder = it.sort_order ?? 0;
        const adjusted = isPriority ? baseOrder : baseOrder + 1000;
        phaseCounters[it.phase] = (phaseCounters[it.phase] || 0) + 1;
        return {
          user_id: authUser.id,
          phase: it.phase,
          category: it.category,
          title: it.title,
          description: it.description || null,
          is_family_only: !!it.is_family_only,
          is_partner_only: !!it.is_partner_only,
          is_solo_only: false,
          country_specific: true,
          sort_order: adjusted,
        };
      });

      // Wipe any existing items and insert new
      await (supabase as any).from('checklist_items').delete().eq('user_id', authUser.id);
      if (rows.length) {
        const { error: insErr } = await (supabase as any).from('checklist_items').insert(rows);
        if (insErr) throw insErr;
      }

      // Save preferences
      const { error: prefErr } = await (supabase as any)
        .from('checklist_preferences')
        .upsert({
          user_id: authUser.id,
          priorities,
          feeling,
          onboarding_complete: true,
        }, { onConflict: 'user_id' });
      if (prefErr) throw prefErr;

      onDone();
    } catch (e: any) {
      console.error(e);
      toast.error('Could not set up your checklist. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={step}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="border-0 bg-card rounded-3xl">
          <CardContent className="p-8 space-y-6">
            {step === 0 && (
              <>
                <h2 className="text-3xl font-[900] tracking-tight text-foreground">Let's build your settling-in guide</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  A few quick questions so we can focus on what matters most to you right now.
                </p>
                <Button onClick={() => setStep(1)} className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                  Let's go
                </Button>
              </>
            )}

            {step === 1 && (
              <>
                <h2 className="text-2xl font-[900] tracking-tight text-foreground">What matters most to you right now?</h2>
                <p className="text-xs text-muted-foreground">Pick 2 or 3.</p>
                <div className="flex flex-wrap gap-2">
                  {options.map(opt => {
                    const selected = priorities.includes(opt.id);
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => togglePriority(opt.id)}
                        className={`px-4 py-2 rounded-full text-sm transition-colors ${
                          selected
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-foreground border border-border hover:bg-muted/70'
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
                <Button
                  onClick={() => setStep(2)}
                  disabled={priorities.length < 2}
                  className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Continue
                </Button>
              </>
            )}

            {step === 2 && (
              <>
                <h2 className="text-2xl font-[900] tracking-tight text-foreground">How are you feeling about the move?</h2>
                <div className="space-y-2">
                  {FEELING_OPTIONS.map(opt => {
                    const selected = feeling === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setFeeling(opt.id)}
                        className={`w-full text-left rounded-2xl px-5 py-4 transition-colors ${
                          selected ? 'bg-primary text-primary-foreground' : 'bg-card border border-border hover:bg-muted/40'
                        }`}
                      >
                        <span className="text-sm font-semibold">{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
                <Button onClick={() => setStep(3)} className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                  Continue
                </Button>
              </>
            )}

            {step === 3 && (
              <>
                <h2 className="text-3xl font-[900] tracking-tight text-foreground">Your guide is ready</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We've personalised your checklist based on where you're heading, your family setup, and what matters most to you.
                </p>
                <Button
                  onClick={finish}
                  disabled={saving}
                  className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {saving ? 'Setting up…' : 'See my checklist'}
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

// ============= CHECKLIST VIEW =============
const ChecklistView = ({ items, onChange }: { items: ChecklistItemRow[]; onChange: () => void }) => {
  const { user } = useUser();
  const { user: authUser } = useAuth();
  const qc = useQueryClient();
  const [resetting, setResetting] = useState(false);

  const monthsSinceArrival = user.arrivalDate ? differenceInMonths(new Date(), new Date(user.arrivalDate)) : 0;
  const defaultPhase: Phase = monthsSinceArrival > 3 ? 'starting-to-bloom' : monthsSinceArrival >= 1 ? 'tending-the-garden' : 'laying-the-ground';

  const [expanded, setExpanded] = useState<Phase | 'accomplishments' | null>(defaultPhase);
  const [lingering, setLingering] = useState<Set<string>>(new Set());

  const markLingering = (id: string) => {
    setLingering(prev => new Set(prev).add(id));
    window.setTimeout(() => {
      setLingering(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 3000);
  };

  const grouped = useMemo(() => {
    const map: Record<Phase, ChecklistItemRow[]> = {
      'laying-the-ground': [],
      'tending-the-garden': [],
      'starting-to-bloom': [],
    };
    items.forEach(i => {
      // Hide completed items unless they're still showing their reward message
      if (i.is_completed && !lingering.has(i.id)) return;
      map[i.phase]?.push(i);
    });
    return map;
  }, [items, lingering]);

  const accomplishments = useMemo(
    () => items.filter(i => i.is_completed && !lingering.has(i.id)),
    [items, lingering]
  );

  const handleReset = async () => {
    if (!authUser) return;
    setResetting(true);
    try {
      await (supabase as any)
        .from('checklist_preferences')
        .update({ onboarding_complete: false })
        .eq('user_id', authUser.id);
      onChange();
      toast.success('You can now reselect your priorities');
    } catch (e) {
      toast.error('Could not reset preferences. Please try again.');
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="space-y-4">
      {PHASES.map(phase => (
        <PhaseSection
          key={phase.id}
          phase={phase}
          items={grouped[phase.id]}
          expanded={expanded === phase.id}
          onExpand={() => setExpanded(expanded === phase.id ? null : phase.id)}
          onChange={onChange}
          onCompleted={markLingering}
          onAdvance={() => {
            const idx = PHASES.findIndex(p => p.id === phase.id);
            if (idx < PHASES.length - 1) setExpanded(PHASES[idx + 1].id);
          }}
        />
      ))}

      <AccomplishmentsSection
        items={accomplishments}
        expanded={expanded === 'accomplishments'}
        onExpand={() => setExpanded(expanded === 'accomplishments' ? null : 'accomplishments')}
        onChange={onChange}
      />

      <div className="pt-6 flex justify-center">
        <Button
          variant="ghost"
          onClick={handleReset}
          disabled={resetting}
          className="text-muted-foreground hover:text-foreground text-sm"
        >
          {resetting ? 'Resetting…' : 'My priorities changed, reselect options for checklist'}
        </Button>
      </div>
    </div>
  );
};

const PhaseSection = ({
  phase, items, expanded, onExpand, onChange, onAdvance, onCompleted,
}: {
  phase: typeof PHASES[number];
  items: ChecklistItemRow[];
  expanded: boolean;
  onExpand: () => void;
  onChange: () => void;
  onAdvance: () => void;
  onCompleted: (id: string) => void;
}) => {
  const Icon = phase.icon;
  const allComplete = items.length === 0 || items.every(i => i.is_completed);
  const tone = TONE_STYLES[phase.tone];

  return (
    <div className="rounded-2xl overflow-hidden">
      <button
        onClick={onExpand}
        className={`w-full text-left p-5 flex items-center gap-4 transition-colors ${tone.header}`}
        aria-expanded={expanded}
      >
        <div className="flex-1 min-w-0">
          <div className="text-lg font-[900] tracking-tight leading-tight">{phase.name}</div>
          <div className={`text-xs opacity-80 mt-1 ${tone.subtitle}`}>{phase.description}</div>
        </div>
        {allComplete && (
          <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold opacity-90 shrink-0">
            <Check className="h-3 w-3" /> Done
          </span>
        )}
        <div className={`shrink-0 ${tone.iconBg} opacity-90`}>
          <Icon className="h-7 w-7" />
        </div>
        <ChevronDown
          className={`h-5 w-5 shrink-0 transition-transform duration-300 ${tone.chevron} ${
            expanded ? 'rotate-180' : 'rotate-0'
          }`}
        />
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden bg-card"
          >
            <div className="p-5 border-x border-b border-border rounded-b-2xl">
              <AnimatePresence>
                {items.length > 0 && items.every(i => i.is_completed) && (
                  <PhaseCelebration phase={phase.id} itemCount={items.length} onAdvance={onAdvance} />
                )}
              </AnimatePresence>

              <div className="space-y-1">
                {items.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-4">All done here. See your accomplishments below.</p>
                )}
                <AnimatePresence initial={false}>
                  {items.map(item => (
                    <ItemRow key={item.id} item={item} onChange={onChange} onCompleted={onCompleted} />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ItemRow = ({ item, onChange, onCompleted }: { item: ChecklistItemRow; onChange: () => void; onCompleted?: (id: string) => void }) => {
  const { user: authUser } = useAuth();
  const qc = useQueryClient();
  const [reward, setReward] = useState<string | null>(null);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const recentRef = useRef<string[]>([]);
  const timeoutRef = useRef<number | null>(null);

  const { data: scheduled = false } = useQuery({
    queryKey: ['checklist-item-scheduled', item.id],
    queryFn: async () => {
      const { count } = await (supabase as any)
        .from('calendar_events')
        .select('id', { count: 'exact', head: true })
        .eq('checklist_item_id', item.id);
      return (count ?? 0) > 0;
    },
    enabled: !!authUser,
  });

  const toggle = async (checked: boolean) => {
    await (supabase as any)
      .from('checklist_items')
      .update({ is_completed: checked, completed_at: checked ? new Date().toISOString() : null })
      .eq('id', item.id);
    qc.invalidateQueries({ queryKey: ['checklist-items', authUser?.id] });

    if (checked) {
      // Pick a reward not shown recently
      const pool = REWARD_MESSAGES.filter(m => !recentRef.current.includes(m));
      const choices = pool.length ? pool : REWARD_MESSAGES;
      const msg = choices[Math.floor(Math.random() * choices.length)];
      recentRef.current = [msg, ...recentRef.current].slice(0, 5);
      setReward(msg);
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => setReward(null), 3000);
      onCompleted?.(item.id);
    }
    onChange();
  };

  const schedule = async (date: Date) => {
    if (!authUser) return;
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    await (supabase as any).from('calendar_events').insert({
      user_id: authUser.id,
      checklist_item_id: item.id,
      title: item.title,
      event_date: dateStr,
      event_type: 'checklist',
    });
    setDatePickerOpen(false);
    qc.invalidateQueries({ queryKey: ['mini-cal-events', authUser?.id] });
    qc.invalidateQueries({ queryKey: ['checklist-item-scheduled', item.id] });
    toast.success('Added to your calendar');
  };

  return (
    <motion.div
      layout
      initial={false}
      exit={{ opacity: 0, height: 0, marginTop: 0, marginBottom: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      style={{ overflow: 'hidden' }}
    >
      <div
        className={`flex items-start gap-3 p-3 rounded-2xl transition-all duration-300 ${
          item.is_completed ? 'opacity-60' : ''
        }`}
      >
        <Checkbox
          checked={item.is_completed}
          onCheckedChange={(c) => toggle(c === true)}
          className="rounded-full h-5 w-5 mt-0.5"
        />
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-semibold text-foreground ${item.is_completed ? 'line-through' : ''}`}>
            {item.title}
          </p>
          {item.description && (
            <p className={`text-xs text-muted-foreground mt-0.5 ${item.is_completed ? 'line-through' : ''}`}>
              {item.description}
            </p>
          )}
        </div>
        <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
          <PopoverTrigger asChild>
            <button
              className={`h-8 w-8 rounded-full flex items-center justify-center transition-colors shrink-0 ${
                scheduled
                  ? 'bg-primary/10 text-primary hover:bg-primary/20'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
              aria-label={scheduled ? 'Scheduled' : 'Schedule'}
            >
              <CalendarIcon className="h-4 w-4" />
            </button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-auto p-0">
            <Calendar mode="single" onSelect={(d) => d && schedule(d)} initialFocus />
          </PopoverContent>
        </Popover>
      </div>
      <AnimatePresence>
        {reward && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="text-xs text-secondary italic pl-11 pb-2"
          >
            {reward}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const PhaseCelebration = ({ phase, itemCount, onAdvance }: { phase: Phase; itemCount: number; onAdvance: () => void }) => {
  const { user: authUser } = useAuth();
  const { user } = useUser();
  const [sharing, setSharing] = useState(false);

  const copy = phase === 'laying-the-ground'
    ? { icon: Leaf, message: 'The ground is set. You have what you need. Now let\'s make it feel like yours.', button: 'Continue to Tending the Garden' }
    : phase === 'tending-the-garden'
    ? { icon: Flower2, message: 'Your daily life is taking shape. The hardest part, you\'ve already done it. Now comes the part that makes it all worth it.', button: 'Continue to Starting to Bloom' }
    : { icon: Flower2, message: 'You came here as a newcomer. Look at you now.', button: 'Share with my coach' };

  const Icon = copy.icon;

  const shareWithCoach = async () => {
    if (!authUser) return;
    setSharing(true);
    try {
      await (supabase as any).from('reflections').insert({
        user_id: authUser.id,
        prompt: 'Settling-in journey complete',
        response: `I've completed ${itemCount} steps across my settling-in journey in ${user.countryTo || 'my new home'}. I registered, I explored, I connected. I'm rooting in.`,
        shared_with_coach: true,
      });
      toast.success('Shared with your coach');
    } catch (e) {
      toast.error('Could not share');
    } finally {
      setSharing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="bg-secondary/10 rounded-2xl p-5 mb-4"
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="h-10 w-10 rounded-2xl bg-secondary/20 text-secondary flex items-center justify-center shrink-0">
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-secondary leading-relaxed">{copy.message}</p>
          {phase === 'starting-to-bloom' && (
            <p className="text-xs text-muted-foreground mt-2">
              You've completed {itemCount} steps across your settling-in journey. You registered, you explored, you connected. You're rooting in.
            </p>
          )}
        </div>
      </div>
      {phase === 'starting-to-bloom' ? (
        <Button
          onClick={shareWithCoach}
          disabled={sharing}
          className="rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          {sharing ? 'Sharing…' : copy.button}
        </Button>
      ) : (
        <Button onClick={onAdvance} className="rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/90">
          {copy.button}
        </Button>
      )}
    </motion.div>
  );
};

export default SettlingInChecklist;
