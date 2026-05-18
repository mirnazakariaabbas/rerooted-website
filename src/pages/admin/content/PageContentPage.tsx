import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Save, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

interface PageContentRow {
  id: string;
  page_key: string;
  section_key: string;
  title: string | null;
  body: string | null;
  image_url: string | null;
  updated_at: string;
}

const SECTIONS = [
  { page_key: 'home', section_key: 'hero_corporate', label: 'Hero, Corporate', description: 'Headlines and body text for corporate visitors' },
  { page_key: 'home', section_key: 'hero_individual', label: 'Hero, Individual', description: 'Headlines and body text for individual visitors' },
  { page_key: 'home', section_key: 'about', label: 'About Section', description: 'About section heading and body copy' },
  { page_key: 'home', section_key: 'cta', label: 'Call to Action', description: 'Bottom CTA heading and button text' },
];

export default function PageContentPage() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: content = [], isLoading } = useQuery({
    queryKey: ['page-content-admin'],
    queryFn: async () => {
      const { data, error } = await supabase.from('page_content').select('*');
      if (error) throw error;
      return (data || []) as unknown as PageContentRow[];
    },
  });

  const getExisting = (pageKey: string, sectionKey: string) =>
    content.find(c => c.page_key === pageKey && c.section_key === sectionKey);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Page Content</h1>
        <p className="text-muted-foreground text-sm">Edit marketing site text. Changes appear on the public homepage.</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">{[1, 2, 3].map(i => <Card key={i} className="animate-pulse h-48" />)}</div>
      ) : (
        <div className="space-y-6">
          {SECTIONS.map(section => (
            <SectionEditor
              key={`${section.page_key}-${section.section_key}`}
              section={section}
              existing={getExisting(section.page_key, section.section_key)}
              userId={user?.id}
              onSaved={() => queryClient.invalidateQueries({ queryKey: ['page-content-admin'] })}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}

function SectionEditor({
  section,
  existing,
  userId,
  onSaved,
}: {
  section: { page_key: string; section_key: string; label: string; description: string };
  existing?: PageContentRow;
  userId?: string;
  onSaved: () => void;
}) {
  const [title, setTitle] = useState(existing?.title || '');
  const [body, setBody] = useState(existing?.body || '');
  const [imageUrl, setImageUrl] = useState(existing?.image_url || '');
  const [dirty, setDirty] = useState(false);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        page_key: section.page_key,
        section_key: section.section_key,
        title: title || null,
        body: body || null,
        image_url: imageUrl || null,
        updated_at: new Date().toISOString(),
        updated_by: userId || null,
      };
      if (existing) {
        const { error } = await supabase.from('page_content').update(payload).eq('id', existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('page_content').insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      setDirty(false);
      onSaved();
      toast({ title: 'Saved', description: `${section.label} updated` });
    },
    onError: (e: Error) => toast({ title: 'Error', description: e.message, variant: 'destructive' }),
  });

  const handleReset = () => {
    setTitle(existing?.title || '');
    setBody(existing?.body || '');
    setImageUrl(existing?.image_url || '');
    setDirty(false);
  };

  const updateField = (setter: (v: string) => void) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setter(e.target.value);
    setDirty(true);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">{section.label}</CardTitle>
            <CardDescription>{section.description}</CardDescription>
          </div>
          {dirty && <Badge variant="outline" className="text-amber-600 border-amber-300">Unsaved</Badge>}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div><Label>Title / Heading</Label><Input value={title} onChange={updateField(setTitle)} placeholder="Leave empty to use default" /></div>
        <div><Label>Body Text</Label><Textarea value={body} onChange={updateField(setBody)} rows={3} placeholder="Leave empty to use default" /></div>
        <div><Label>Image URL</Label><Input value={imageUrl} onChange={updateField(setImageUrl)} placeholder="https://..." /></div>
        <div className="flex gap-2 pt-2">
          <Button size="sm" onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending || !dirty}>
            <Save className="h-4 w-4 mr-1" />Save
          </Button>
          <Button size="sm" variant="outline" onClick={handleReset} disabled={!dirty}>
            <RotateCcw className="h-4 w-4 mr-1" />Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
