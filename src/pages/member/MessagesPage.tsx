import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import ChatWindow from '@/components/messaging/ChatWindow';
import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MessagesPage() {
  const { user } = useAuth();

  const { data: assignment, isLoading } = useQuery({
    queryKey: ['my-coach-assignment', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('coach_assignments')
        .select('coach_id, coaches(id, name, user_id)')
        .eq('user_id', user.id)
        .maybeSingle();
      if (error) throw error;
      return data as { coach_id: string; coaches: { id: string; name: string; user_id: string | null } } | null;
    },
    enabled: !!user?.id,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p className="text-muted-foreground">Loading…</p>
      </div>
    );
  }

  if (!assignment?.coaches?.user_id) {
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="pb-24 px-6 pt-8 lg:px-12 max-w-2xl mx-auto">
        <h1 className="text-3xl font-[900] tracking-tight mb-2">Messages</h1>
        <p className="text-sm text-muted-foreground mb-10">Chat with your coach</p>
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <MessageCircle className="h-12 w-12 text-muted-foreground/30" />
          <p className="text-muted-foreground text-center">
            No coach assigned yet. Once you're matched with a coach, you'll be able to message them here.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="pb-24 px-6 pt-8 lg:px-12 max-w-2xl mx-auto">
      <h1 className="text-3xl font-[900] tracking-tight mb-2">Messages</h1>
      <p className="text-sm text-muted-foreground mb-6">Chat with your coach</p>
      <Card className="overflow-hidden border border-border" style={{ height: 'calc(100vh - 14rem)' }}>
        <CardContent className="p-0 h-full">
          <ChatWindow
            recipientId={assignment.coaches.user_id}
            recipientName={assignment.coaches.name}
            className="h-full"
          />
        </CardContent>
      </Card>
    </motion.div>
  );
}
