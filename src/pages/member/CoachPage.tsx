import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Calendar, Check, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { addDays, format, startOfDay, getDay } from 'date-fns';

interface CoachData {
  id: string;
  name: string;
  bio: string | null;
  photo_url: string | null;
  specialties: string[];
  email: string | null;
  certification_level: string;
}

interface AvailabilitySlot {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const CoachPage = () => {
  const { user } = useAuth();
  const [coach, setCoach] = useState<CoachData | null>(null);
  const [coachId, setCoachId] = useState<string | null>(null);
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [existingBookings, setExistingBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetchCoach = async () => {
      const { data: assignment } = await supabase
        .from('coach_assignments')
        .select('coach_id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (assignment?.coach_id) {
        setCoachId(assignment.coach_id);
        const { data: coachData } = await supabase
          .from('coaches')
          .select('id, name, bio, photo_url, specialties, email, certification_level')
          .eq('id', assignment.coach_id)
          .single();

        if (coachData) {
          setCoach({ ...(coachData as any), specialties: (coachData.specialties as string[]) || [] });
        }

        const { data: slots } = await supabase
          .from('coach_availability')
          .select('*')
          .eq('coach_id', assignment.coach_id)
          .order('day_of_week')
          .order('start_time');
        setAvailability(slots || []);

        const now = new Date();
        const twoWeeks = addDays(now, 14);
        const { data: bookings } = await supabase
          .from('meeting_bookings')
          .select('*')
          .eq('coach_id', assignment.coach_id)
          .gte('scheduled_at', now.toISOString())
          .lte('scheduled_at', twoWeeks.toISOString());
        setExistingBookings(bookings || []);
      }
      setLoading(false);
    };
    fetchCoach();
  }, [user]);

  const getUpcomingSlots = () => {
    if (!availability.length) return [];
    const slots: { date: Date; slot: AvailabilitySlot }[] = [];
    const today = startOfDay(new Date());
    for (let i = 0; i < 14; i++) {
      const date = addDays(today, i);
      const dayOfWeek = getDay(date);
      const daySlots = availability.filter(s => s.day_of_week === dayOfWeek);
      daySlots.forEach(slot => {
        const [h, m] = slot.start_time.split(':').map(Number);
        const slotDateTime = new Date(date);
        slotDateTime.setHours(h, m, 0, 0);
        if (slotDateTime > new Date()) {
          const isBooked = existingBookings.some(b => {
            const bTime = new Date(b.scheduled_at);
            return Math.abs(bTime.getTime() - slotDateTime.getTime()) < 60000;
          });
          if (!isBooked) slots.push({ date: slotDateTime, slot });
        }
      });
    }
    return slots.slice(0, 20);
  };

  const bookSlot = async (slotDate: Date, slot: AvailabilitySlot) => {
    if (!user || !coachId) return;
    setBooking(true);
    const [, , endM] = slot.end_time.split(':').map(Number);
    const [startH, startM] = slot.start_time.split(':').map(Number);
    const [endH] = slot.end_time.split(':').map(Number);
    const duration = (endH * 60 + (endM || 0)) - (startH * 60 + startM);
    const { error } = await supabase.from('meeting_bookings').insert({
      user_id: user.id, coach_id: coachId, scheduled_at: slotDate.toISOString(),
      duration_minutes: duration > 0 ? duration : 30, status: 'scheduled',
    });
    setBooking(false);
    if (error) { toast.error('Failed to book session'); return; }
    toast.success('Session booked!');
    setExistingBookings(prev => [...prev, { scheduled_at: slotDate.toISOString() }]);
  };

  if (loading) {
    return (
      <div className="pb-24 px-6 pt-8 lg:px-12 max-w-2xl mx-auto">
        <h1 className="text-3xl font-[900] tracking-tight mb-10">Your Coach</h1>
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const upcomingSlots = getUpcomingSlots();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="pb-24 px-6 pt-8 lg:px-12 max-w-2xl mx-auto"
    >
      <h1 className="text-3xl font-[900] tracking-tight mb-2">Your Coach</h1>
      <p className="text-sm text-muted-foreground mb-10">Your personal relocation coach and session booking</p>

      {!coach ? (
        <Card className="border border-border">
          <CardContent className="py-12 text-center">
            <Heart className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
            <h2 className="text-lg font-[900] tracking-tight mb-2">Your coach will be assigned soon</h2>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
              We're matching you with a coach who understands your journey. You'll be notified once they're assigned.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card className="border border-border">
            <CardContent className="pt-8 pb-6 text-center">
              <Avatar className="h-24 w-24 mx-auto mb-4">
                {coach.photo_url && <AvatarImage src={coach.photo_url} alt={coach.name} />}
                <AvatarFallback className="text-2xl font-[900] bg-muted text-primary">
                  {coach.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-[900] tracking-tight mb-1">{coach.name}</h2>
              {coach.certification_level && coach.certification_level !== 'non-certified' && (
                <Badge variant="secondary" className="text-xs mb-2">
                  {coach.certification_level} Certified
                </Badge>
              )}
              {coach.email && <p><a href={`mailto:${coach.email}`} className="text-sm text-primary hover:underline">{coach.email}</a></p>}
            </CardContent>
            {coach.specialties.length > 0 && (
              <CardContent className="pt-0 pb-4">
                <CardTitle className="text-sm font-bold mb-2 text-muted-foreground">Specialties</CardTitle>
                <div className="flex flex-wrap gap-2">
                  {coach.specialties.map(s => <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>)}
                </div>
              </CardContent>
            )}
            {coach.bio && (
              <CardContent className="pt-0">
                <CardTitle className="text-sm font-bold mb-2 text-muted-foreground">About</CardTitle>
                <p className="text-sm leading-relaxed text-foreground/80">{coach.bio}</p>
              </CardContent>
            )}
          </Card>

          <Card className="border border-border">
            <CardContent className="py-6">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-[900] tracking-tight">Book a Session</h3>
              </div>
              {upcomingSlots.length === 0 ? (
                <p className="text-sm text-muted-foreground">No available slots in the next two weeks.</p>
              ) : (
                <div className="space-y-2">
                  {upcomingSlots.map((s, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted">
                      <div>
                        <p className="text-sm font-medium">{format(s.date, 'EEEE, MMM d')}</p>
                        <p className="text-xs text-muted-foreground">
                          {s.slot.start_time?.slice(0, 5)} – {s.slot.end_time?.slice(0, 5)}
                        </p>
                      </div>
                      <Button size="sm" className="rounded-full" disabled={booking} onClick={() => bookSlot(s.date, s.slot)}>
                        <Check className="h-4 w-4 mr-1" />Book
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          <CoachNotes userId={user?.id} />
        </div>
      )}
    </motion.div>
  );
};

const CoachNotes = ({ userId }: { userId?: string }) => {
  const { data: notes = [] } = useQuery({
    queryKey: ['my-coach-notes', userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data } = await (supabase as any)
        .from('coaching_notes')
        .select('id, session_date, notes, created_at')
        .eq('coachee_id', userId)
        .order('session_date', { ascending: false })
        .limit(10);
      return data || [];
    },
    enabled: !!userId,
  });

  if (notes.length === 0) return null;

  return (
    <Card className="border border-border">
      <CardContent className="py-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-[900] tracking-tight">Coach's Notes</h3>
        </div>
        <div className="space-y-3">
          {notes.map((n: any) => (
            <div key={n.id} className="p-3 rounded-lg bg-muted">
              <Badge variant="outline" className="text-[10px] mb-1.5">
                {new Date(n.session_date).toLocaleDateString()}
              </Badge>
              <p className="text-sm text-foreground">{n.notes}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CoachPage;
