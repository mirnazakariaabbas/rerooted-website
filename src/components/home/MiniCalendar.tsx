import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type CoachingEvent = { id: string; date: Date; time: string; coachName: string };
type ChecklistEvent = { id: string; date: Date; time: string | null; title: string };

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

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

  // Build calendar grid (Mon-Sun weeks)
  const cells = useMemo(() => {
    const result: { date: Date; inMonth: boolean }[] = [];
    const first = monthStart;
    // Mon=0 .. Sun=6
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
  const monthLabel = cursor.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });

  const eventsOnDay = (d: Date) => ({
    coaching: coachingEvents.filter(e => isSameDay(e.date, d)),
    checklist: checklistEvents.filter(e => isSameDay(e.date, d)),
  });

  const selectedEvents = selectedDay ? eventsOnDay(selectedDay) : { coaching: [], checklist: [] };
  const hasSelectedEvents = selectedEvents.coaching.length + selectedEvents.checklist.length > 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <button
          aria-label="Previous month"
          onClick={() => { setCursor(addMonths(cursor, -1)); setSelectedDay(null); }}
          className="h-7 w-7 rounded-full flex items-center justify-center hover:bg-background/60 transition-colors"
        >
          <ChevronLeft className="h-4 w-4 text-foreground/70" />
        </button>
        <p className="text-sm font-semibold text-foreground">{monthLabel}</p>
        <button
          aria-label="Next month"
          onClick={() => { setCursor(addMonths(cursor, 1)); setSelectedDay(null); }}
          className="h-7 w-7 rounded-full flex items-center justify-center hover:bg-background/60 transition-colors"
        >
          <ChevronRight className="h-4 w-4 text-foreground/70" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {DAY_LABELS.map(d => (
          <div key={d} className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold text-center">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((cell, i) => {
          const { coaching, checklist } = eventsOnDay(cell.date);
          const hasCoaching = coaching.length > 0;
          const hasChecklist = checklist.length > 0;
          const hasEvents = hasCoaching || hasChecklist;
          const isToday = isSameDay(cell.date, today);
          const isSelected = selectedDay && isSameDay(cell.date, selectedDay);
          return (
            <button
              key={i}
              disabled={!hasEvents}
              onClick={() => {
                if (selectedDay && isSameDay(selectedDay, cell.date)) setSelectedDay(null);
                else setSelectedDay(cell.date);
              }}
              className={`relative h-9 flex flex-col items-center justify-center rounded-full text-xs transition-colors ${
                cell.inMonth ? 'text-foreground' : 'text-muted-foreground/30'
              } ${isToday ? 'ring-1 ring-primary/30' : ''} ${
                isSelected ? 'bg-background/70' : hasEvents ? 'hover:bg-background/40 cursor-pointer' : 'cursor-default'
              }`}
            >
              <span className="leading-none">{cell.date.getDate()}</span>
              {hasEvents && (
                <span className="flex gap-0.5 mt-0.5">
                  {hasCoaching && <span className="h-1 w-1 rounded-full bg-primary" />}
                  {hasChecklist && <span className="h-1 w-1 rounded-full bg-secondary" />}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedDay && hasSelectedEvents && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="mt-3 space-y-2 pt-3 border-t border-border/50">
              <p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                {selectedDay.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
              {selectedEvents.coaching.map(ev => (
                <div key={ev.id} className="bg-background/60 rounded-xl pl-3 pr-3 py-2 border-l-2 border-primary">
                  <p className="text-xs font-semibold text-foreground">Coaching session with {ev.coachName}</p>
                  <p className="text-[10px] text-muted-foreground">{fmtTime(ev.time)}</p>
                </div>
              ))}
              {selectedEvents.checklist.map(ev => (
                <div key={ev.id} className="bg-background/60 rounded-xl pl-3 pr-3 py-2 border-l-2 border-secondary">
                  <p className="text-xs font-semibold text-foreground">{ev.title}</p>
                  {ev.time && <p className="text-[10px] text-muted-foreground">{fmtTime(ev.time)}</p>}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MiniCalendar;
