import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useState } from 'react';
import { Megaphone, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

export default function AnnouncementBanner() {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const { data: announcements = [] } = useQuery({
    queryKey: ['active-announcements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('announcements')
        .select('id, title, body')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(3);
      if (error) throw error;
      return (data || []) as { id: string; title: string; body: string }[];
    },
  });

  const visible = announcements.filter(a => !dismissed.has(a.id));
  if (visible.length === 0) return null;

  return (
    <AnimatePresence>
      {visible.map(ann => (
        <motion.div
          key={ann.id}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-4"
        >
          <div className="bg-primary/10 border border-primary/20 rounded-lg px-4 py-3 flex items-start gap-3">
            <Megaphone className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">{ann.title}</p>
              {ann.body && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{ann.body}</p>}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 shrink-0 text-muted-foreground hover:text-foreground"
              onClick={() => setDismissed(prev => new Set(prev).add(ann.id))}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        </motion.div>
      ))}
    </AnimatePresence>
  );
}
