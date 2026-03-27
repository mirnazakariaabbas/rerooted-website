import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@/contexts/UserContext';
import Welcome from './Welcome';
import YourMove from './YourMove';
import AboutYou from './AboutYou';
import Ready from './Ready';

const OnboardingFlow = () => {
  const [step, setStep] = useState(0);
  const { updateUser } = useUser();

  const next = () => setStep(s => s + 1);
  const complete = () => updateUser({ onboardingComplete: true });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {step > 0 && step < 3 && (
        <div className="flex justify-center gap-2 pt-6">
          {[1, 2].map(i => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i <= step ? 'w-8 bg-primary' : 'w-4 bg-border'
              }`}
            />
          ))}
        </div>
      )}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="flex-1 flex flex-col"
        >
          {step === 0 && <Welcome onNext={next} />}
          {step === 1 && <YourMove onNext={next} />}
          {step === 2 && <AboutYou onNext={next} />}
          {step === 3 && <Ready onComplete={complete} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default OnboardingFlow;
