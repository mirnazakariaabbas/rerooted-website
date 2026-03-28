import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Testimonial {
  id: string;
  client_name: string;
  company: string | null;
  role: string | null;
  quote: string;
  photo_url: string | null;
  rating: number;
}

export default function TestimonialsCarousel() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const { data: testimonials = [] } = useQuery({
    queryKey: ['testimonials-public'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('id, client_name, company, role, quote, photo_url, rating')
        .eq('is_featured', true)
        .order('display_order', { ascending: true })
        .limit(6);
      if (error) throw error;
      return (data || []) as unknown as Testimonial[];
    },
  });

  if (testimonials.length === 0) return null;

  return (
    <section ref={ref} className="bg-muted/30 py-20 px-6 lg:px-12">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">
            What Our Clients Say
          </h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
            Real stories from people who've walked the relocation path
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Card className="h-full border-border/50 hover:shadow-md transition-shadow">
                <CardContent className="p-6 flex flex-col gap-4">
                  <Quote className="h-6 w-6 text-primary/30" />
                  <p className="text-sm text-foreground/80 leading-relaxed flex-1 italic">
                    "{t.quote}"
                  </p>
                  <div className="flex gap-0.5 mb-2">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <div className="flex items-center gap-3 pt-2 border-t border-border/50">
                    <Avatar className="h-9 w-9">
                      {t.photo_url && <AvatarImage src={t.photo_url} alt={t.client_name} />}
                      <AvatarFallback className="text-xs bg-primary/10 text-primary">
                        {t.client_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{t.client_name}</p>
                      {(t.role || t.company) && (
                        <p className="text-xs text-muted-foreground">
                          {[t.role, t.company].filter(Boolean).join(' · ')}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
