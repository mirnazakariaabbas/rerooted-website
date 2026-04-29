import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface ReadyProps {
  onComplete: () => void;
}

const Ready = ({ onComplete }: ReadyProps) => (
  <div className="flex-1 flex flex-col items-center justify-center px-6 lg:px-12 text-center">
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
      className="mb-8 text-7xl"
    >
      🌿
    </motion.div>
    <h1 className="text-3xl font-black tracking-tight leading-tight mb-4">
      You're not starting over.
      <br />
      <span className="text-primary">You're rooting in.</span>
    </h1>
    <p className="text-muted-foreground text-lg leading-relaxed max-w-md mb-12">
      Your journey is unique. Re-Rooted® will meet you where you are, with guidance,
      reflection, and the quiet reminder that you're not alone in this.
    </p>
    <Button onClick={onComplete} size="lg" className="rounded-full px-10 py-6 text-base font-medium">
      Open Re-Rooted®
    </Button>
  </div>
);

export default Ready;
