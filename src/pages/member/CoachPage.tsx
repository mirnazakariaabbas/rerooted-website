import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Heart } from 'lucide-react';

interface CoachData {
  name: string;
  bio: string;
  photo_url: string | null;
  specialties: string[];
  email: string | null;
}

const CoachPage = () => {
  const { user } = useAuth();
  const [coach, setCoach] = useState<CoachData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchCoach = async () => {
      const { data: assignment } = await supabase
        .from('coach_assignments')
        .select('coach_id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (assignment?.coach_id) {
        const { data: coachData } = await supabase
          .from('coaches')
          .select('name, bio, photo_url, specialties, email')
          .eq('id', assignment.coach_id)
          .single();

        if (coachData) {
          setCoach({
            ...coachData,
            specialties: (coachData.specialties as string[]) || [],
          });
        }
      }
      setLoading(false);
    };
    fetchCoach();
  }, [user]);

  if (loading) {
    return (
      <div className="pb-24 px-6 pt-8 lg:px-12 max-w-2xl mx-auto">
        <h1 className="text-3xl font-black tracking-tight mb-8">Your Coach</h1>
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="pb-24 px-6 pt-8 lg:px-12 max-w-2xl mx-auto"
    >
      <h1 className="text-3xl font-black tracking-tight mb-8">Your Coach</h1>
      {!coach ? (
        <Card className="border border-border">
          <CardContent className="py-12 text-center">
            <Heart className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
            <h2 className="text-lg font-black tracking-tight mb-2">Your coach will be assigned soon</h2>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
              We're matching you with a coach who understands your journey. You'll be notified once they're assigned.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="border border-border">
          <CardContent className="pt-8 pb-6 text-center">
            <Avatar className="h-24 w-24 mx-auto mb-4">
              {coach.photo_url && <AvatarImage src={coach.photo_url} alt={coach.name} />}
              <AvatarFallback className="text-2xl font-black bg-muted text-primary">
                {coach.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-black tracking-tight mb-1">{coach.name}</h2>
            {coach.email && <a href={`mailto:${coach.email}`} className="text-sm text-primary hover:underline">{coach.email}</a>}
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
      )}
    </motion.div>
  );
};

export default CoachPage;
