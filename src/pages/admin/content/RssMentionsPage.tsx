import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Rss, ExternalLink, Check, Search, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';

type Mention = {
  id: string;
  source_name: string;
  source_url: string;
  article_title: string;
  article_url: string;
  snippet: string | null;
  published_at: string | null;
  discovered_at: string;
  is_read: boolean;
};

const RssMentionsPage = () => {
  const [mentions, setMentions] = useState<Mention[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchMentions = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('rss_mentions')
      .select('*')
      .order('discovered_at', { ascending: false })
      .limit(100);
    if (data) setMentions(data as Mention[]);
    setLoading(false);
  };

  useEffect(() => { fetchMentions(); }, []);

  const markRead = async (id: string) => {
    await supabase.from('rss_mentions').update({ is_read: true } as any).eq('id', id);
    setMentions(prev => prev.map(m => m.id === id ? { ...m, is_read: true } : m));
  };

  const filtered = search
    ? mentions.filter(m =>
        m.article_title.toLowerCase().includes(search.toLowerCase()) ||
        m.source_name.toLowerCase().includes(search.toLowerCase())
      )
    : mentions;

  const unreadCount = mentions.filter(m => !m.is_read).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-8 lg:p-12 max-w-5xl mx-auto"
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">RSS Mention Monitor</h1>
          <p className="text-muted-foreground mt-1">Track brand mentions across the web</p>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <Badge className="bg-primary/15 text-primary">{unreadCount} unread</Badge>
          )}
          <Button variant="outline" size="sm" onClick={fetchMentions}>
            <RefreshCw className="h-4 w-4 mr-1" /> Refresh
          </Button>
        </div>
      </div>

      <div className="relative max-w-sm mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search mentions..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <p className="text-muted-foreground text-center py-12">Loading...</p>
      ) : filtered.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="py-16 text-center">
            <Rss className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
            <p className="text-muted-foreground font-medium">No mentions found yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              RSS monitoring will track brand mentions when configured. This feature requires an RSS feed integration in a future update.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map(m => (
            <Card key={m.id} className={`border-0 shadow-sm transition-colors ${!m.is_read ? 'border-l-2 border-l-primary' : ''}`}>
              <CardContent className="py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-[10px]">{m.source_name}</Badge>
                      {!m.is_read && <Badge className="bg-primary/15 text-primary text-[10px]">New</Badge>}
                    </div>
                    <a href={m.article_url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-foreground hover:text-primary transition-colors flex items-center gap-1">
                      {m.article_title}
                      <ExternalLink className="h-3 w-3 shrink-0" />
                    </a>
                    {m.snippet && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{m.snippet}</p>}
                    <p className="text-xs text-muted-foreground mt-2">
                      {m.published_at ? format(new Date(m.published_at), 'dd MMM yyyy') : format(new Date(m.discovered_at), 'dd MMM yyyy')}
                    </p>
                  </div>
                  {!m.is_read && (
                    <Button variant="ghost" size="sm" onClick={() => markRead(m.id)}>
                      <Check className="h-4 w-4 mr-1" /> Mark read
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default RssMentionsPage;
