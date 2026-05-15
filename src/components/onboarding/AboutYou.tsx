import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUser } from '@/contexts/UserContext';
import { FamilySetup } from '@/types/user';
import { cn } from '@/lib/utils';

interface AboutYouProps {
  onNext: () => void;
}

const AboutYou = ({ onNext }: AboutYouProps) => {
  const { user, updateUser } = useUser();
  const [name, setName] = useState(user.name);
  const [family, setFamily] = useState<FamilySetup>(user.familySetup);
  const [hasChildren, setHasChildren] = useState(user.hasChildren);
  const [childrenCount, setChildrenCount] = useState<number | undefined>(user.childrenCount);
  const [childrenAges, setChildrenAges] = useState<number[]>(user.childrenAges ?? []);
  const [language, setLanguage] = useState(user.primaryLanguage);

  const handleCountChange = (raw: string) => {
    const n = Math.max(0, Math.min(20, parseInt(raw || '0', 10) || 0));
    setChildrenCount(n);
    setChildrenAges(prev => {
      const next = [...prev];
      if (n > next.length) while (next.length < n) next.push(0);
      else next.length = n;
      return next;
    });
  };

  const handleAgeChange = (idx: number, raw: string) => {
    const n = Math.max(0, Math.min(99, parseInt(raw || '0', 10) || 0));
    setChildrenAges(prev => prev.map((v, i) => (i === idx ? n : v)));
  };

  const handleNext = () => {
    updateUser({
      name,
      familySetup: family,
      hasChildren,
      childrenCount: hasChildren ? childrenCount : undefined,
      childrenAges: hasChildren ? childrenAges : [],
      primaryLanguage: language,
    });
    onNext();
  };

  const familyOptions: { value: FamilySetup; label: string; icon: string }[] = [
    { value: 'alone', label: 'Alone', icon: '👤' },
    { value: 'with-partner', label: 'With a partner', icon: '👫' },
    { value: 'with-family', label: 'With family', icon: '👨‍👩‍👧‍👦' },
  ];

  return (
    <div className="flex-1 flex flex-col px-6 lg:px-12 pt-10">
      <h2 className="text-3xl font-black tracking-tight mb-2">A little about you</h2>
      <p className="text-muted-foreground mb-8">Optional — you can always update this later.</p>
      <div className="space-y-6 flex-1">
        <div className="space-y-2">
          <Label>What should we call you?</Label>
          <Input value={name} onChange={e => setName(e.target.value)} placeholder="Your first name" className="h-12" />
        </div>
        <div className="space-y-2">
          <Label>Are you relocating...</Label>
          <div className="grid grid-cols-3 gap-2">
            {familyOptions.map(opt => (
              <button
                key={opt.value}
                onClick={() => setFamily(opt.value)}
                className={cn(
                  'flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all text-sm',
                  family === opt.value ? 'border-primary bg-muted' : 'border-border hover:border-primary/30'
                )}
              >
                <span className="text-xl">{opt.icon}</span>
                <span>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <Label>Do you have children?</Label>
          <div className="grid grid-cols-2 gap-2">
            {[{ v: true, l: 'Yes' }, { v: false, l: 'No' }].map(opt => (
              <button
                key={String(opt.v)}
                onClick={() => setHasChildren(opt.v)}
                className={cn(
                  'p-3 rounded-xl border-2 transition-all text-sm font-medium',
                  hasChildren === opt.v ? 'border-primary bg-muted' : 'border-border hover:border-primary/30'
                )}
              >
                {opt.l}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <Label>Primary language</Label>
          <Input value={language} onChange={e => setLanguage(e.target.value)} placeholder="e.g., English" className="h-12" />
        </div>
      </div>
      <div className="py-6 space-y-3">
        <Button onClick={handleNext} size="lg" className="w-full rounded-full py-6">Continue</Button>
      </div>
    </div>
  );
};

export default AboutYou;
