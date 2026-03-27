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
  const [language, setLanguage] = useState(user.primaryLanguage);

  const handleNext = () => {
    updateUser({ name, familySetup: family, hasChildren, primaryLanguage: language });
    onNext();
  };

  const familyOptions: { value: FamilySetup; label: string; icon: string }[] = [
    { value: 'alone', label: 'Alone', icon: '👤' },
    { value: 'with-partner', label: 'With a partner', icon: '👫' },
    { value: 'with-family', label: 'With family', icon: '👨‍👩‍👧‍👦' },
  ];

  return (
    <div className="flex-1 flex flex-col px-8 pt-10">
      <h2 className="text-2xl font-serif mb-2">A little about you</h2>
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
                  family === opt.value ? 'border-primary bg-primary/5' : 'border-border bg-card hover:border-primary/30'
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
                  hasChildren === opt.v ? 'border-primary bg-primary/5' : 'border-border bg-card hover:border-primary/30'
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
        <Button onClick={onNext} variant="ghost" className="w-full text-muted-foreground">Skip for now</Button>
      </div>
    </div>
  );
};

export default AboutYou;
