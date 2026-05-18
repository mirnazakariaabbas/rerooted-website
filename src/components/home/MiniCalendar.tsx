import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { ChevronLeft, ChevronRight, Heart, ClipboardCheck } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type CoachingEvent = { id: string; date: Date; time: string; coachName: string };
type ChecklistEvent = { id: string; date: Date; time: string | null; title: string };

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// Re-Rooted brand tokens: Deep Blue = primary, Fresh Green = secondary
const COACHING_COLOR = 'hsl(var(--primary))';
const CHECKLIST_COLOR = 'hsl(var(--secondary))';

function startOfMonth(d: Date) { return new Date(d.getFullYear(), d.getMonth(), 1); }
function endOfMonth(d: Date) { return new Date(d.getFullYear(), d.getMonth() + 1, 0); }
function addMonths(d: Date, n: number) { return new Date(d.getFullYear(), d.getMonth() + n, 1); }
function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function fmtTime(time: string | null) {
  if (!time) return '';
  const [h, m] = time.split(':');
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const h12 = ((hour + 11) % 12) + 1;
  return `${h12}:${m} ${ampm}`;
}

export const MiniCalendar = () => {
  const { user: authUser } = useAuth();
  const [cursor, setCursor] = useState(() => startOfMonth(new Date()));
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  const monthStart = startOfMonth(cursor);
  const monthEnd = endOfMonth(cursor);

  const { data: coachingEvents = [] } = useQuery({
    queryKey: ['mini-cal-bookings', authUser?.id, cursor.getFullYear(), cursor.getMonth()],
    queryFn: async (): Promise<CoachingEvent[]> => {
      if (!authUser) return [];
      const { data } = await supabase
        .from('meeting_bookings')
        .select('id, scheduled_at, status, coach_id, coaches:coach_id(name)')
        .eq('user_id', authUser.id)
        .neq('status', 'cancelled')
        .gte('scheduled_at', monthStart.toISOString())
        .lte('scheduled_at', new Date(monthEnd.getFullYear(), monthEnd.getMonth(), monthEnd.getDate(), 23, 59, 59).toISOString());
      return (data || []).map((b: any) => {
        const d = new Date(b.scheduled_at);
        return {
          id: b.id,
          date: d,
          time: `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`,
          coachName: b.coaches?.name || 'your coach',
        };
      });
    },
    enabled: !!authUser,
  });

  const { data: checklistEvents = [] } = useQuery({
    queryKey: ['mini-cal-events', authUser?.id, cursor.getFullYear(), cursor.getMonth()],
    queryFn: async (): Promise<ChecklistEvent[]> => {
      if (!authUser) return [];
      const startStr = monthStart.toISOString().slice(0, 10);
      const endStr = monthEnd.toISOString().slice(0, 10);
      const { data } = await (supabase as any)
        .from('calendar_events')
        .select('id, title, event_date, event_time, event_type')
        .eq('user_id', authUser.id)
        .gte('event_date', startStr)
        .lte('event_date', endStr);
      return (data || [])
        .filter((e: any) => e.event_type !== 'coaching')
        .map((e: any) => ({
          id: e.id,
          date: new Date(e.event_date + 'T00:00:00'),
          time: e.event_time,
          title: e.title,
        }));
    },
    enabled: !!authUser,
  });

  const cells = useMemo(() => {
    const result: { date: Date; inMonth: boolean }[] = [];
    const first = monthStart;
    const leading = (first.getDay() + 6) % 7;
    for (let i = leading; i > 0; i--) {
      result.push({ date: new Date(first.getFullYear(), first.getMonth(), 1 - i), inMonth: false });
    }
    for (let d = 1; d <= monthEnd.getDate(); d++) {
      result.push({ date: new Date(first.getFullYear(), first.getMonth(), d), inMonth: true });
    }
    while (result.length % 7 !== 0) {
      const last = result[result.length - 1].date;
      result.push({ date: new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1), inMonth: false });
    }
    return result;
  }, [monthStart, monthEnd]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const monthLabel = cursor.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });

  const eventsOnDay = (d: Date) => ({
    coaching: coachingEvents.filter(e => isSameDay(e.date, d)),
    checklist: checklistEvents.filter(e => isSameDay(e.date, d)),
  });

  const selectedEvents = selectedDay ? eventsOnDay(selectedDay) : { coaching: [], checklist: [] };
  const hasSelectedEvents = selectedEvents.coaching.length + selectedEvents.checklist.length > 0;

  // Find index of selected day to anchor the popover under the correct row
  const selectedIndex = selectedDay ? cells.findIndex(c => isSameDay(c.date, selectedDay)) : -1;
  const selectedRow = selectedIndex >= 0 ? Math.floor(selectedIndex / 7) : -1;

  return (
    <TooltipProvider delayDuration={150}>
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          aria-label="Previous month"
          onClick={() => { setCursor(addMonths(cursor, -1)); setSelectedDay(null); }}
          className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
        >
          <ChevronLeft className="h-4 w-4 text-foreground/70" />
        </button>
        <p className="text-base font-[900] tracking-tight text-foreground">{monthLabel}</p>
        <button
          aria-label="Next month"
          onClick={() => { setCursor(addMonths(cursor, 1)); setSelectedDay(null); }}
          className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
        >
          <ChevronRight className="h-4 w-4 text-foreground/70" />
        </button>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 gap-1 mb-3">
        {DAY_LABELS.map(d => (
          <div key={d} className="text-xs text-foreground/50 uppercase tracking-wider font-bold text-center">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid, split into weeks so popover can slot between rows */}
      <div className="space-y-1">
        {Array.from({ length: cells.length / 7 }).map((_, rowIdx) => {
          const rowCells = cells.slice(rowIdx * 7, rowIdx * 7 + 7);
          const pastIdxs = rowCells
            .map((c, i) => (c.inMonth && c.date < today ? i : -1))
            .filter(i => i >= 0);
          const pastStart = pastIdxs.length ? pastIdxs[0] : -1;
          const pastEnd = pastIdxs.length ? pastIdxs[pastIdxs.length - 1] : -1;
          return (
            <div key={rowIdx}>
              <div className="relative grid grid-cols-7 gap-1">
                {pastStart >= 0 && (
                  <span
                    aria-hidden
                    className="absolute top-1 bottom-1 rounded-full bg-primary/10 pointer-events-none"
                    style={{
                      left: `calc(${(pastStart / 7) * 100}% + 4px)`,
                      width: `calc(${((pastEnd - pastStart + 1) / 7) * 100}% - 8px)`,
                    }}
                  />
                )}
                {rowCells.map((cell, i) => {
                  const { coaching, checklist } = eventsOnDay(cell.date);
                  const hasCoaching = coaching.length > 0;
                  const hasChecklist = checklist.length > 0;
                  const hasEvents = hasCoaching || hasChecklist;
                  const isToday = isSameDay(cell.date, today);
                  const isPast = cell.date < today;
                  const isSelected = selectedDay && isSameDay(cell.date, selectedDay);

                  // Build the ring background:
                  // - two events: split circle (half primary, half secondary)
                  // - one event: solid color
                  let ringStyle: React.CSSProperties = {};
                  if (hasCoaching && hasChecklist) {
                    ringStyle.background = `conic-gradient(${COACHING_COLOR} 0deg 180deg, ${CHECKLIST_COLOR} 180deg 360deg)`;
                  } else if (hasCoaching) {
                    ringStyle.background = COACHING_COLOR;
                  } else if (hasChecklist) {
                    ringStyle.background = CHECKLIST_COLOR;
                  }

                  const dayNumberClass = hasEvents
                    ? 'text-primary-foreground font-bold'
                    : isToday
                      ? 'text-primary font-bold'
                      : !cell.inMonth
                        ? 'text-muted-foreground/30'
                        : isPast
                          ? 'text-muted-foreground'
                          : 'text-foreground';

                  const dayButton = (
                    <button
                      key={i}
                      disabled={!hasEvents}
                      onClick={() => {
                        if (selectedDay && isSameDay(selectedDay, cell.date)) setSelectedDay(null);
                        else setSelectedDay(cell.date);
                      }}
                      className={`relative h-10 w-full flex items-center justify-center text-sm transition-transform ${
                        hasEvents ? 'hover:scale-110 cursor-pointer' : 'cursor-default'
                      }`}
                    >
                      {isToday && !hasEvents && (
                        <span className="absolute inset-1 rounded-full ring-2 ring-primary/40" aria-hidden />
                      )}
                      {hasEvents && (
                        <span
                          className={`absolute inset-1 rounded-full ${isSelected ? 'ring-2 ring-offset-2 ring-foreground/30 ring-offset-background' : ''}`}
                          style={ringStyle}
                          aria-hidden
                        />
                      )}
                      <span className={`relative leading-none ${dayNumberClass}`}>
                        {cell.date.getDate()}
                      </span>
                    </button>
                  );

                  if (!hasEvents) return <div key={i}>{dayButton}</div>;

                  return (
                    <Tooltip key={i} delayDuration={150}>
                      <TooltipTrigger asChild>{dayButton}</TooltipTrigger>
                      <TooltipContent side="top" className="bg-card text-foreground border border-border rounded-xl px-3 py-2 max-w-[220px]">
                        <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-1">
                          {cell.date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                        </p>
                        <div className="space-y-1">
                          {coaching.map(ev => (
                            <div key={ev.id} className="flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
                              <span className="text-xs text-foreground truncate">
                                Coaching with {ev.coachName}
                              </span>
                            </div>
                          ))}
                          {checklist.map(ev => (
                            <div key={ev.id} className="flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-secondary shrink-0" />
                              <span className="text-xs text-foreground truncate">{ev.title}</span>
                            </div>
                          ))}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>

              {/* Popover bubble under the row containing the selected day */}
              <AnimatePresence>
                {selectedDay && hasSelectedEvents && selectedRow === rowIdx && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                    className="relative mt-2"
                  >
                    {/* Bubble pointer */}
                    <div
                      className="absolute -top-1.5 h-3 w-3 rotate-45 bg-card border-l border-t border-border"
                      style={{
                        left: `calc(${((selectedIndex % 7) + 0.5) * (100 / 7)}% - 6px)`,
                      }}
                      aria-hidden
                    />
                    <div className="rounded-2xl bg-card border border-border p-4 space-y-2">
                      <p className="text-[10px] uppercase tracking-[0.18em] font-bold text-muted-foreground">
                        {selectedDay.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                      </p>
                      {selectedEvents.coaching.map(ev => (
                        <div key={ev.id} className="flex items-start gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                            <Heart className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-foreground leading-tight">
                              Coaching with {ev.coachName}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">{fmtTime(ev.time)}</p>
                          </div>
                        </div>
                      ))}
                      {selectedEvents.checklist.map(ev => (
                        <div key={ev.id} className="flex items-start gap-3">
                          <div className="h-8 w-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center shrink-0">
                            <ClipboardCheck className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-foreground leading-tight">{ev.title}</p>
                            {ev.time && <p className="text-xs text-muted-foreground mt-0.5">{fmtTime(ev.time)}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 pt-3 border-t border-border/50">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-primary" />
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Coaching</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-secondary" />
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Checklist</span>
        </div>
      </div>
    </div>
    </TooltipProvider>
  );
};

export default MiniCalendar;
