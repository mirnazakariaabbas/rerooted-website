import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Search } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { COUNTRIES } from '@/data/countries';
import { useUser } from '@/contexts/UserContext';
import { calculateStage } from '@/types/user';
import { Switch } from '@/components/ui/switch';

interface YourMoveProps {
  onNext: () => void;
}

const CountrySearch = ({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) => {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const filtered = COUNTRIES.filter(c => c.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-start font-normal h-12">
            {value || <span className="text-muted-foreground">Select a country</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0" align="start">
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
            <Input placeholder="Search countries..." value={search} onChange={e => setSearch(e.target.value)} className="border-0 focus-visible:ring-0 h-10" />
          </div>
          <div className="max-h-[200px] overflow-y-auto p-1">
            {filtered.map(country => (
              <button
                key={country}
                className={cn(
                  'w-full text-left px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors',
                  value === country && 'bg-primary/10 text-primary font-medium'
                )}
                onClick={() => { onChange(country); setOpen(false); setSearch(''); }}
              >
                {country}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

const YourMove = ({ onNext }: YourMoveProps) => {
  const { user, updateUser } = useUser();
  const [from, setFrom] = useState(user.countryFrom);
  const [to, setTo] = useState(user.countryTo);
  const [date, setDate] = useState<Date | undefined>(user.arrivalDate ? new Date(user.arrivalDate) : undefined);
  const [isReturning, setIsReturning] = useState(false);

  const canContinue = from && to && date;

  const handleNext = () => {
    const stage = calculateStage(date!.toISOString(), isReturning);
    updateUser({ countryFrom: from, countryTo: to, arrivalDate: date!.toISOString(), stage });
    onNext();
  };

  return (
    <div className="flex-1 flex flex-col px-8 pt-10">
      <h2 className="text-2xl font-serif mb-2 text-foreground">Your Move</h2>
      <p className="text-muted-foreground mb-8">Tell us about your relocation journey.</p>
      <div className="space-y-6 flex-1">
        <CountrySearch label="Where are you moving from?" value={from} onChange={setFrom} />
        <CountrySearch label="Where are you moving to?" value={to} onChange={setTo} />
        <div className="space-y-2">
          <Label className="text-sm font-medium">When did / will you arrive?</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className={cn('w-full justify-start font-normal h-12', !date && 'text-muted-foreground')}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, 'PPP') : 'Pick a date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={date} onSelect={setDate} className="p-3 pointer-events-auto" />
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-card">
          <div>
            <p className="text-sm font-medium">Are you planning to return to your home country?</p>
            <p className="text-xs text-muted-foreground">Or to a previous home</p>
          </div>
          <Switch checked={isReturning} onCheckedChange={setIsReturning} />
        </div>
      </div>
      <div className="py-6">
        <Button onClick={handleNext} disabled={!canContinue} size="lg" className="w-full rounded-full py-6">
          Continue
        </Button>
      </div>
    </div>
  );
};

export default YourMove;
