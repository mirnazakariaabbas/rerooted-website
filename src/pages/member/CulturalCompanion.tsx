import { useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { CULTURAL_COMPARISONS } from '@/data/cultural-comparisons';
import { COUNTRIES } from '@/data/countries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Search, ChevronDown, ChevronUp, ArrowRightLeft } from 'lucide-react';

const CountryPicker = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const filtered = COUNTRIES.filter(c => c.toLowerCase().includes(search.toLowerCase()));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="font-medium">
          {value || 'Select'} <ChevronDown className="ml-1 h-3 w-3" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0" align="start">
        <div className="flex items-center border-b px-3">
          <Search className="mr-2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="border-0 focus-visible:ring-0 h-9 text-sm" />
        </div>
        <div className="max-h-[200px] overflow-y-auto p-1">
          {filtered.map(c => (
            <button key={c} className="w-full text-left px-3 py-1.5 text-sm rounded hover:bg-muted" onClick={() => { onChange(c); setOpen(false); setSearch(''); }}>
              {c}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

const CulturalCompanion = () => {
  const { user } = useUser();
  const [homeCountry, setHomeCountry] = useState(user.countryFrom || 'Egypt');
  const [hostCountry, setHostCountry] = useState(user.countryTo || 'Switzerland');
  const [expandedDim, setExpandedDim] = useState<string | null>(null);

  const comparison = CULTURAL_COMPARISONS.find(c => c.homeCountry === homeCountry && c.hostCountry === hostCountry);
  const swap = () => { setHomeCountry(hostCountry); setHostCountry(homeCountry); };

  return (
    <div className="pb-20 px-5 pt-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-serif mb-4">Your Cultural Companion</h1>
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <CountryPicker value={homeCountry} onChange={setHomeCountry} />
        <button onClick={swap} className="p-1.5 rounded-full hover:bg-muted transition-colors">
          <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
        </button>
        <CountryPicker value={hostCountry} onChange={setHostCountry} />
      </div>

      {comparison ? (
        <>
          <Card className="mb-6 border-0 shadow-md bg-primary/5">
            <CardHeader className="pb-2"><CardTitle className="text-base font-serif">Overview</CardTitle></CardHeader>
            <CardContent><p className="text-sm leading-relaxed text-foreground/80">{comparison.overview}</p></CardContent>
          </Card>
          <div className="space-y-2">
            {comparison.dimensions.map(dim => {
              const expanded = expandedDim === dim.name;
              return (
                <Card key={dim.name} className="border-0 shadow-sm overflow-hidden">
                  <button className="w-full text-left p-4 flex items-center justify-between" onClick={() => setExpandedDim(expanded ? null : dim.name)}>
                    <span className="font-medium text-sm">{dim.name}</span>
                    {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                  </button>
                  {expanded && (
                    <CardContent className="pt-0 pb-4 px-4">
                      <div className="space-y-3 mb-4">
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="font-medium">{homeCountry}</span>
                            <span className="text-muted-foreground">{dim.homeDescription}</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${dim.homeScore * 10}%` }} />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="font-medium">{hostCountry}</span>
                            <span className="text-muted-foreground">{dim.hostDescription}</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${dim.hostScore * 10}%` }} />
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-foreground/80 mb-3">{dim.explanation}</p>
                      <div className="bg-muted/50 rounded-lg p-3">
                        <p className="text-xs italic text-foreground/70">💡 {dim.practicalTip}</p>
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        </>
      ) : (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-2">No comparison data available yet</p>
            <p className="text-sm text-muted-foreground">
              Try: Egypt → Switzerland, India → UK, USA → Japan, Brazil → Germany
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CulturalCompanion;
