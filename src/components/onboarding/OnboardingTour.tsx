import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useAdmin } from '@/hooks/useAdmin';

const TOUR_KEY = 'onboarding-tour-complete';

const steps = [
  { title: 'Welcome to Re-Rooted®', description: 'Your admin dashboard for managing expat coaching programs, contacts, and content.' },
  { title: 'Your Dashboard', description: 'Get an overview of key metrics, recent contacts, and member activity at a glance.' },
  { title: 'User Management', description: 'Manage contacts, members, organizations, coaches, and admin users from one place.' },
  { title: 'Content Manager', description: 'Compose newsletters, manage automated emails, and monitor brand mentions.' },
  { title: 'System Admin', description: 'Track security metrics, audit logs, active sessions, and IP allowlists.' },
];

export function OnboardingTour() {
  const { isAdmin } = useAdmin();
  const [active, setActive] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (isAdmin && localStorage.getItem(TOUR_KEY) !== 'true') {
      const timer = setTimeout(() => setActive(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [isAdmin]);

  const finish = () => {
    setActive(false);
    localStorage.setItem(TOUR_KEY, 'true');
  };

  const next = () => {
    if (step < steps.length - 1) setStep(s => s + 1);
    else finish();
  };

  if (!active) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] bg-black/40 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-background border border-border rounded-xl shadow-2xl max-w-md w-full p-6"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    i === step ? 'w-6 bg-primary' : i < step ? 'w-3 bg-primary/40' : 'w-3 bg-border'
                  }`}
                />
              ))}
            </div>
            <Button variant="ghost" size="icon" className="h-7 w-7 -mt-1 -mr-1" onClick={finish}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <h3 className="text-lg font-display font-black text-foreground mb-2">{steps[step].title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-6">{steps[step].description}</p>

          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={finish} className="text-muted-foreground">
              Skip tour
            </Button>
            <Button size="sm" onClick={next} className="bg-primary text-primary-foreground">
              {step < steps.length - 1 ? 'Next' : 'Get Started'}
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export function resetTour() {
  localStorage.removeItem(TOUR_KEY);
}
