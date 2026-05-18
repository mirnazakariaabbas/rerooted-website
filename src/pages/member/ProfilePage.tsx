import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUser } from '@/contexts/UserContext';
import { useAuth } from '@/contexts/AuthContext';
import { useAdmin } from '@/hooks/useAdmin';
import { COUNTRIES } from '@/data/countries';
import { STAGE_LABELS, JourneyStage, calculateStage } from '@/types/user';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Search, ChevronDown, Shield } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { RerootedTitle } from '@/components/layout/RerootedTitle';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const CountrySelect = ({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) => {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const filtered = COUNTRIES.filter(c => c.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-1.5">
      <Label className="text-sm">{label}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-between font-normal h-10 text-sm">
            {value || 'Select'} <ChevronDown className="h-3 w-3" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[280px] p-0" align="start">
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
    </div>
  );
};

const ProfilePage = () => {
  const { user, updateUser } = useUser();
  const { signOut } = useAuth();
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();
  const [isReturning, setIsReturning] = useState(user.stage === 'rooting-back');

  const handleArrivalDateChange = (d: Date) => {
    const stage = calculateStage(d.toISOString(), isReturning);
    updateUser({ arrivalDate: d.toISOString(), stage });
  };

  const handleReturningToggle = (returning: boolean) => {
    setIsReturning(returning);
    if (user.arrivalDate) {
      const stage = calculateStage(user.arrivalDate, returning);
      updateUser({ stage });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="pb-24"
    >
      <PageHeader
        eyebrow={false}
        title={<RerootedTitle prefix="My" suffix="Profile" />}
        subtitle="Manage your personal details and preferences"
      >
        {isAdmin && (
          <div className="mt-4">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs rounded-full bg-primary-foreground text-primary hover:bg-primary-foreground/90 border-0" onClick={() => navigate('/app/admin')}>
              <Shield className="h-3.5 w-3.5" /> Admin
            </Button>
          </div>
        )}
      </PageHeader>
      <div className="max-w-2xl mx-auto px-6 -mt-10 relative">

      <Card className="mb-6 border border-border">
        <CardHeader className="pb-2"><CardTitle className="text-base font-[900] tracking-tight">Personal Details</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-sm">Name</Label>
            <Input value={user.name} onChange={e => updateUser({ name: e.target.value })} className="h-10 text-sm" />
          </div>
          <CountrySelect label="Home country" value={user.countryFrom} onChange={v => updateUser({ countryFrom: v })} />
          <CountrySelect label="Host country" value={user.countryTo} onChange={v => updateUser({ countryTo: v })} />
          <div className="space-y-1.5">
            <Label className="text-sm">Arrival date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn('w-full justify-start font-normal h-10 text-sm', !user.arrivalDate && 'text-muted-foreground')}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {user.arrivalDate ? format(new Date(user.arrivalDate), 'PPP') : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={user.arrivalDate ? new Date(user.arrivalDate) : undefined} onSelect={d => d && handleArrivalDateChange(d)} className="p-3 pointer-events-auto" />
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6 border border-border">
        <CardHeader className="pb-2"><CardTitle className="text-base font-[900] tracking-tight">Journey Stage</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="p-3 rounded-lg border border-primary bg-muted">
            <p className="font-medium text-sm">{STAGE_LABELS[user.stage].name}</p>
            <p className="text-xs text-muted-foreground mt-1">{STAGE_LABELS[user.stage].tagline}</p>
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-sm">Planning to return home?</Label>
            <Switch checked={isReturning} onCheckedChange={handleReturningToggle} />
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6 border border-border">
        <CardHeader className="pb-2"><CardTitle className="text-base font-[900] tracking-tight">Family</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-sm">Relocating</Label>
            <div className="grid grid-cols-3 gap-2">
              {(['alone', 'with-partner', 'with-family'] as const).map(opt => (
                <button key={opt} onClick={() => updateUser({ familySetup: opt })} className={cn('p-2 rounded-lg border text-xs transition-all capitalize', user.familySetup === opt ? 'border-primary bg-muted' : 'border-border hover:border-primary/30')}>
                  {opt.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-sm">Children</Label>
            <Switch
              checked={user.hasChildren}
              onCheckedChange={v =>
                updateUser({
                  hasChildren: v,
                  childrenCount: v ? user.childrenCount : undefined,
                  childrenAges: v ? user.childrenAges : [],
                })
              }
            />
          </div>
          {user.hasChildren && (
            <>
              <div className="space-y-1.5">
                <Label className="text-sm">How many children?</Label>
                <Input
                  type="number"
                  min={1}
                  max={20}
                  value={user.childrenCount ?? ''}
                  onChange={e => {
                    const n = Math.max(0, Math.min(20, parseInt(e.target.value || '0', 10) || 0));
                    const ages = [...(user.childrenAges ?? [])];
                    if (n > ages.length) while (ages.length < n) ages.push(0);
                    else ages.length = n;
                    updateUser({ childrenCount: n, childrenAges: ages });
                  }}
                  className="h-10 text-sm"
                />
              </div>
              {!!user.childrenCount && user.childrenCount > 0 && (
                <div className="space-y-1.5">
                  <Label className="text-sm">Age of each child</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {Array.from({ length: user.childrenCount }).map((_, i) => (
                      <Input
                        key={i}
                        type="number"
                        min={0}
                        max={99}
                        value={user.childrenAges?.[i] ?? ''}
                        onChange={e => {
                          const n = Math.max(0, Math.min(99, parseInt(e.target.value || '0', 10) || 0));
                          const ages = [...(user.childrenAges ?? [])];
                          ages[i] = n;
                          updateUser({ childrenAges: ages });
                        }}
                        placeholder={`Child ${i + 1}`}
                        className="h-10 text-sm"
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
          <div className="space-y-1.5">
            <Label className="text-sm">Primary language</Label>
            <Input value={user.primaryLanguage} onChange={e => updateUser({ primaryLanguage: e.target.value })} className="h-10 text-sm" />
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6 border border-border">
        <CardHeader className="pb-2"><CardTitle className="text-base font-[900] tracking-tight">Notifications</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm">Weekly reflections</Label>
            <Switch checked={user.notifyReflections} onCheckedChange={v => updateUser({ notifyReflections: v })} />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-sm">Check-in reminders</Label>
            <Switch checked={user.notifyCheckins} onCheckedChange={v => updateUser({ notifyCheckins: v })} />
          </div>
        </CardContent>
      </Card>

      <Button variant="outline" className="w-full mt-4 rounded-full text-destructive border-destructive/30 hover:bg-destructive/5" onClick={signOut}>
        Sign Out
      </Button>
      </div>
    </motion.div>
  );
};

export default ProfilePage;
