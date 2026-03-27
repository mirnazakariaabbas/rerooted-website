import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Users, UsersRound, GraduationCap, Building2, UserCheck, FileText, Rss } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';

type SearchResult = { id: string; label: string; type: string; path: string };

const RECENT_KEY = 'rr-recent-searches';

function getRecent(): string[] {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]'); } catch { return []; }
}
function addRecent(q: string) {
  const list = [q, ...getRecent().filter(r => r !== q)].slice(0, 5);
  localStorage.setItem(RECENT_KEY, JSON.stringify(list));
}

const typeConfig: Record<string, { icon: React.ElementType; color: string; path: string }> = {
  contact: { icon: Users, color: 'bg-primary/10 text-primary', path: '/app/admin/users/contacts' },
  member: { icon: UsersRound, color: 'bg-secondary/10 text-secondary', path: '/app/admin/users/members' },
  coach: { icon: GraduationCap, color: 'bg-warning/10 text-warning-foreground', path: '/app/admin/users/coaches' },
  organization: { icon: Building2, color: 'bg-accent/10 text-accent-foreground', path: '/app/admin/users/organizations' },
  subscriber: { icon: UserCheck, color: 'bg-success/10 text-success', path: '/app/admin/users/subscribers' },
  newsletter: { icon: FileText, color: 'bg-muted text-muted-foreground', path: '/app/admin/content/newsletter' },
  rss: { icon: Rss, color: 'bg-destructive/10 text-destructive', path: '/app/admin/content/rss' },
};

export function GlobalSearch({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const search = useCallback(async (q: string) => {
    if (q.length < 2) { setResults([]); return; }
    setLoading(true);
    const pattern = `%${q}%`;
    const all: SearchResult[] = [];

    const [contacts, members, coaches, orgs, subs, newsletters, rss] = await Promise.all([
      supabase.from('contacts').select('id, first_name, last_name').or(`first_name.ilike.${pattern},last_name.ilike.${pattern},email.ilike.${pattern}`).limit(5),
      supabase.from('profiles').select('id, full_name').ilike('full_name', pattern).limit(5),
      supabase.from('coaches').select('id, name').ilike('name', pattern).limit(5),
      supabase.from('organizations').select('id, name').ilike('name', pattern).limit(5),
      supabase.from('subscribers').select('id, email, first_name').or(`email.ilike.${pattern},first_name.ilike.${pattern}`).limit(5),
      supabase.from('newsletters').select('id, subject').ilike('subject', pattern).limit(5),
      supabase.from('rss_mentions').select('id, article_title').ilike('article_title', pattern).limit(5),
    ]);

    contacts.data?.forEach(r => all.push({ id: r.id, label: `${r.first_name} ${r.last_name}`, type: 'contact', path: '/app/admin/users/contacts' }));
    members.data?.forEach(r => all.push({ id: r.id, label: r.full_name || 'Unknown', type: 'member', path: '/app/admin/users/members' }));
    coaches.data?.forEach(r => all.push({ id: r.id, label: r.name, type: 'coach', path: '/app/admin/users/coaches' }));
    orgs.data?.forEach(r => all.push({ id: r.id, label: r.name, type: 'organization', path: '/app/admin/users/organizations' }));
    subs.data?.forEach(r => all.push({ id: r.id, label: r.first_name || r.email, type: 'subscriber', path: '/app/admin/users/subscribers' }));
    newsletters.data?.forEach(r => all.push({ id: r.id, label: r.subject, type: 'newsletter', path: '/app/admin/content/newsletter' }));
    rss.data?.forEach(r => all.push({ id: r.id, label: r.article_title, type: 'rss', path: '/app/admin/content/rss' }));

    setResults(all);
    setLoading(false);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => search(query), 300);
    return () => clearTimeout(timer);
  }, [query, search]);

  useEffect(() => {
    if (!open) { setQuery(''); setResults([]); }
  }, [open]);

  const grouped = results.reduce<Record<string, SearchResult[]>>((acc, r) => {
    (acc[r.type] = acc[r.type] || []).push(r);
    return acc;
  }, {});

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search contacts, members, coaches..." value={query} onValueChange={setQuery} />
      <CommandList>
        {loading && <div className="p-4 text-center text-sm text-muted-foreground">Searching...</div>}
        <CommandEmpty>{query.length < 2 ? 'Type to search...' : 'No results found.'}</CommandEmpty>
        {Object.entries(grouped).map(([type, items]) => {
          const cfg = typeConfig[type] || { icon: Users, color: '', path: '/' };
          const Icon = cfg.icon;
          return (
            <CommandGroup key={type} heading={type.charAt(0).toUpperCase() + type.slice(1) + 's'}>
              {items.map(item => (
                <CommandItem
                  key={item.id}
                  onSelect={() => {
                    addRecent(item.label);
                    navigate(item.path);
                    onOpenChange(false);
                  }}
                  className="flex items-center gap-3"
                >
                  <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <span className="truncate flex-1">{item.label}</span>
                  <Badge variant="outline" className="text-[10px] shrink-0">{type}</Badge>
                </CommandItem>
              ))}
            </CommandGroup>
          );
        })}
      </CommandList>
    </CommandDialog>
  );
}
