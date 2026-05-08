import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Sparkles, Copy, RefreshCw, Linkedin, Twitter, Instagram, Facebook } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';

const platforms = [
  { value: 'linkedin', label: 'LinkedIn', icon: Linkedin, maxChars: 3000 },
  { value: 'twitter', label: 'X / Twitter', icon: Twitter, maxChars: 280 },
  { value: 'instagram', label: 'Instagram', icon: Instagram, maxChars: 2200 },
  { value: 'facebook', label: 'Facebook', icon: Facebook, maxChars: 5000 },
];

const tones = [
  { value: 'professional', label: 'Professional' },
  { value: 'warm', label: 'Warm & Personal' },
  { value: 'inspiring', label: 'Inspiring' },
  { value: 'educational', label: 'Educational' },
  { value: 'casual', label: 'Casual' },
];

type DraftResult = {
  draft: string;
  hook?: string;
  cta?: string;
  hashtags?: string[];
};

export default function SocialDraftsPage() {
  const { toast } = useToast();
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState('linkedin');
  const [tone, setTone] = useState('professional');
  const [context, setContext] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DraftResult | null>(null);
  const [history, setHistory] = useState<Array<DraftResult & { platform: string; topic: string }>>([]);

  const generate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('generate-social-draft', {
        body: { topic, platform, tone, context },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      const draft: DraftResult = {
        draft: data.draft || '',
        hook: data.hook,
        cta: data.cta,
        hashtags: data.hashtags,
      };
      setResult(draft);
      setHistory(prev => [{ ...draft, platform, topic }, ...prev].slice(0, 10));
    } catch (e: any) {
      toast({ title: 'Generation failed', description: e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied to clipboard' });
  };

  const PlatformIcon = platforms.find(p => p.value === platform)?.icon || Linkedin;
  const maxChars = platforms.find(p => p.value === platform)?.maxChars || 3000;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="pb-24">
      <PageHeader title="AI Social Drafts" subtitle="Generate social media content with AI, tailored for Re-Rooted®'s brand" />
      <div className="max-w-7xl mx-auto px-6 -mt-10 relative space-y-6">

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <Card>
          <CardHeader><CardTitle className="text-base">Generate Draft</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="What's the topic? e.g. 'Tips for cultural adjustment in Switzerland'"
              value={topic}
              onChange={e => setTopic(e.target.value)}
            />
            <div className="grid grid-cols-2 gap-3">
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {platforms.map(p => (
                    <SelectItem key={p.value} value={p.value}>
                      <span className="flex items-center gap-2"><p.icon className="h-3.5 w-3.5" />{p.label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {tones.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <Textarea
              placeholder="Additional context or key points (optional)"
              value={context}
              onChange={e => setContext(e.target.value)}
              rows={3}
            />
            <Button className="w-full" onClick={generate} disabled={loading || !topic.trim()}>
              {loading ? <><RefreshCw className="h-4 w-4 mr-1.5 animate-spin" /> Generating...</> : <><Sparkles className="h-4 w-4 mr-1.5" /> Generate Draft</>}
            </Button>
          </CardContent>
        </Card>

        {/* Result Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <PlatformIcon className="h-4 w-4" /> Generated Draft
              {result && <Badge variant="outline" className="ml-auto text-xs">{result.draft.length}/{maxChars}</Badge>}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="space-y-4">
                <div className="relative">
                  <div className="p-4 rounded-lg bg-muted/50 border border-border whitespace-pre-wrap text-sm text-foreground">
                    {result.draft}
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute top-2 right-2 h-7 w-7"
                    onClick={() => copyToClipboard(result.draft)}
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                </div>

                {result.hook && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Alternative Hook</p>
                    <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 text-sm text-foreground flex items-start justify-between gap-2">
                      <span>{result.hook}</span>
                      <button onClick={() => copyToClipboard(result.hook!)} className="text-muted-foreground hover:text-foreground shrink-0">
                        <Copy className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                )}

                {result.cta && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Suggested CTA</p>
                    <p className="text-sm text-foreground">{result.cta}</p>
                  </div>
                )}

                {result.hashtags && result.hashtags.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1.5">Hashtags</p>
                    <div className="flex flex-wrap gap-1.5">
                      {result.hashtags.map((tag, i) => (
                        <Badge key={i} variant="secondary" className="cursor-pointer text-xs" onClick={() => copyToClipboard(tag)}>
                          {tag.startsWith('#') ? tag : `#${tag}`}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <Button variant="outline" className="w-full" onClick={generate} disabled={loading}>
                  <RefreshCw className="h-4 w-4 mr-1.5" /> Regenerate
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Sparkles className="h-10 w-10 text-muted-foreground/30 mb-3" />
                <p className="text-sm text-muted-foreground">Enter a topic and click Generate to create a social media draft</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* History */}
      {history.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-base">Recent Drafts</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {history.map((h, i) => {
                const PIcon = platforms.find(p => p.value === h.platform)?.icon || Linkedin;
                return (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg border border-border">
                    <PIcon className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-muted-foreground mb-1">{h.topic}</p>
                      <p className="text-sm text-foreground line-clamp-2">{h.draft}</p>
                    </div>
                    <Button size="icon" variant="ghost" className="h-7 w-7 shrink-0" onClick={() => copyToClipboard(h.draft)}>
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
          </div>
    </motion.div>
  );
}
