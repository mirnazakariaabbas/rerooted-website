import { motion } from 'framer-motion';
import { Construction } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';

interface PlaceholderPageProps {
  title: string;
  description: string;
}

const PlaceholderPage = ({ title, description }: PlaceholderPageProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="pb-24"
  >
    <PageHeader title={title} subtitle={description} />
    <div className="max-w-4xl mx-auto px-6 -mt-10 relative">
      <div className="rounded-3xl bg-card border border-border flex flex-col items-center justify-center py-20 text-center">
        <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mb-6">
          <Construction className="h-8 w-8 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-display font-black text-foreground mb-2">Coming soon</h2>
        <p className="text-muted-foreground max-w-md">
          This area is being built. Check back shortly.
        </p>
      </div>
    </div>
  </motion.div>
);

export default PlaceholderPage;
