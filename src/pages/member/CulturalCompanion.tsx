import { useState } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '@/contexts/UserContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { COUNTRIES } from '@/data/countries';
import { getCountryFlag } from '@/data/countryFlags';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Search, ChevronDown, ChevronUp, ArrowRightLeft, Sparkles, Briefcase, Users as UsersIcon, Coffee, RefreshCw } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import logoR from '@/assets/logo-r-white.png';

const CountryPicker = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const filtered = COUNTRIES.filter(c => c.toLowerCase().includes(search.toLowerCase()));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="h-10 w-full min-w-[120px] justify-between rounded-xl border-border bg-background px-4 font-semibold text-foreground hover:bg-muted"
        >
          <span className="flex items-center gap-2 truncate">
            {value && getCountryFlag(value) && (
              <img src={getCountryFlag(value)} alt="" className="h-4 w-6 object-cover rounded-sm shrink-0" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            )}
            <span className="truncate">{value || 'Select'}</span>
          </span>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[260px] p-0 rounded-xl" align="center">
        <div className="flex items-center border-b px-3">
          <Search className="mr-2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="border-0 focus-visible:ring-0 h-9 text-sm" />
        </div>
        <div className="max-h-[220px] overflow-y-auto p-1">
          {filtered.map(c => {
            const flag = getCountryFlag(c);
            return (
              <button key={c} className="w-full text-left px-3 py-1.5 text-sm rounded-lg hover:bg-muted flex items-center gap-2" onClick={() => { onChange(c); setOpen(false); setSearch(''); }}>
                {flag && <img src={flag} alt="" className="h-4 w-6 object-cover rounded-sm shrink-0" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />}
                <span className="truncate">{c}</span>
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
};

const categoryIcons: Record<string, React.ElementType> = {
  daily_life: Coffee,
  social: UsersIcon,
  workplace: Briefcase,
};

const ComparisonSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-24 w-full rounded-lg" />
    {Array.from({ length: 5 }).map((_, i) => (
      <Skeleton key={i} className="h-14 w-full rounded-lg" />
    ))}
  </div>
);

const CulturalCompanion = () => {
  const { user } = useUser();
  const [homeCountry, setHomeCountry] = useState(user.countryFrom || 'Egypt');
  const [hostCountry, setHostCountry] = useState(user.countryTo || 'Switzerland');
  const [expandedDim, setExpandedDim] = useState<string | null>(null);
  const [tipsKey, setTipsKey] = useState(0);

  const { data: aiTips, isLoading: tipsLoading } = useQuery<any[]>({
    queryKey: ['cultural-tips', homeCountry, hostCountry, tipsKey],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('cultural-tips', {
        body: { countryFrom: homeCountry, countryTo: hostCountry },
      });
      if (error) throw error;
      return data?.tips || [];
    },
    staleTime: 0,
    gcTime: 0,
  });

  const { data: comparisonResult, isLoading: comparisonLoading, error: comparisonError } = useQuery({
    queryKey: ['cultural-comparison', homeCountry, hostCountry],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('cultural-comparison', {
        body: { countryA: homeCountry, countryB: hostCountry },
      });
      if (error) throw error;
      return data as { comparison: { summary: string; dimensions: any[] }; swapped: boolean };
    },
    enabled: homeCountry !== hostCountry,
    staleTime: Infinity,
  });

  const comparison = comparisonResult?.comparison;
  const swapped = comparisonResult?.swapped ?? false;

  const swap = () => { setHomeCountry(hostCountry); setHostCountry(homeCountry); };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="pb-24"
    >
      <PageHeader
        eyebrow={false}
        title={
          <span>
            Your&nbsp;&nbsp;
            <img
              src={logoR}
              alt="R"
              className="inline-block h-[0.72em] w-auto align-baseline"
            />
            e-Rooted<sup className="text-[0.45em] font-bold align-super ml-0.5">®</sup> Cultural Companion
          </span>
        }
        subtitle="Explore cultural differences between countries"
      />
      <div className="max-w-2xl mx-auto px-6 -mt-6 relative">
      <div className="mx-auto mb-6 flex w-full items-center justify-center gap-2 sm:gap-3 rounded-2xl border border-border bg-card p-3">
        <div className="flex-1 max-w-[200px]">
          <CountryPicker value={homeCountry} onChange={setHomeCountry} />
        </div>
        <button
          onClick={swap}
          aria-label="Swap countries"
          className="shrink-0 rounded-full border border-border bg-background p-2 hover:bg-muted transition-colors"
        >
          <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
        </button>
        <div className="flex-1 max-w-[200px]">
          <CountryPicker value={hostCountry} onChange={setHostCountry} />
        </div>
      </div>

      {/* Cultural Comparison */}
      {homeCountry === hostCountry ? (
        <Card className="border-dashed border border-border">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Select two different countries to see a cultural comparison.</p>
          </CardContent>
        </Card>
      ) : comparisonLoading ? (
        <ComparisonSkeleton />
      ) : comparisonError ? (
        <Card className="border border-destructive/30">
          <CardContent className="py-8 text-center">
            <p className="text-destructive text-sm">Failed to load comparison. Please try again.</p>
          </CardContent>
        </Card>
      ) : comparison ? (
        <>
          <Card className="mb-8 border border-border bg-muted">
            <CardHeader className="pb-2"><CardTitle className="text-base font-[900] tracking-tight">Overview</CardTitle></CardHeader>
            <CardContent><p className="text-sm leading-relaxed text-foreground/80">{comparison.summary}</p></CardContent>
          </Card>
          <div className="space-y-2">
            {comparison.dimensions.map((dim: any) => {
              const expanded = expandedDim === dim.id;
              // If swapped, score_a in DB is actually hostCountry and score_b is homeCountry
              const homeScore = swapped ? dim.score_b : dim.score_a;
              const hostScore = swapped ? dim.score_a : dim.score_b;
              return (
                <Card key={dim.id} className="border border-border overflow-hidden">
                  <button className="w-full text-left p-4 flex items-center justify-between" onClick={() => setExpandedDim(expanded ? null : dim.id)}>
                    <span className="font-medium text-sm">{dim.name}</span>
                    {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                  </button>
                  {expanded && (
                    <CardContent className="pt-0 pb-4 px-4">
                      <div className="space-y-3 mb-4">
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="font-medium">{homeCountry}</span>
                            <span className="text-muted-foreground">{homeScore}/10 · {dim.scale_low} → {dim.scale_high}</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${homeScore * 10}%` }} />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="font-medium">{hostCountry}</span>
                            <span className="text-muted-foreground">{hostScore}/10</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${hostScore * 10}%` }} />
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-foreground/80 mb-3">{dim.explanation}</p>
                      <div className="bg-muted rounded-lg p-3">
                        <p className="text-xs italic text-foreground/70">💡 {dim.tip}</p>
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground mt-6 text-center">
            Cultural profiles use the Culture Map framework (Erin Meyer) as a guide. Scores are AI-assisted and intended as a practical starting point.
          </p>
        </>
      ) : null}

      {/* AI-Powered Tips */}
      <Card className="mt-8 border border-border bg-primary/5">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <CardTitle className="text-base font-[900] tracking-tight">AI Cultural Tips</CardTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setTipsKey(k => k + 1)} disabled={tipsLoading}>
              <RefreshCw className={`h-3 w-3 mr-1 ${tipsLoading ? 'animate-spin' : ''}`} /> New Tips
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {tipsLoading ? (
            <p className="text-sm text-muted-foreground">Generating personalized tips...</p>
          ) : aiTips && aiTips.length > 0 ? (
            <div className="space-y-3">
              {aiTips.map((tip: any, i: number) => {
                const Icon = categoryIcons[tip.category] || Coffee;
                return (
                  <div key={i} className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">{tip.title}</p>
                      <p className="text-sm text-foreground/80">{tip.explanation}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Select countries to get personalized cultural tips.</p>
          )}
        </CardContent>
      </Card>
      </div>
    </motion.div>
  );
};

export default CulturalCompanion;
