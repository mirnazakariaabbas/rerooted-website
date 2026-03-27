import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import type { CoachingDimension } from '@/data/coaching-content';

interface DimensionDetailProps {
  dimension: CoachingDimension;
  onBack: () => void;
}

const DimensionDetail = ({ dimension, onBack }: DimensionDetailProps) => {
  const { dimensionProgress, updateDimensionProgress } = useUser();
  const status = dimensionProgress.find(d => d.dimension === dimension.id)?.status || 'not-started';

  const markProgress = () => {
    const next = status === 'not-started' ? 'in-progress' : 'explored';
    updateDimensionProgress(dimension.id, next);
  };

  return (
    <div className="pb-20 px-5 pt-6 max-w-lg mx-auto">
      <button onClick={onBack} className="flex items-center gap-1 text-sm text-muted-foreground mb-6 hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>
      <div className="flex items-center gap-3 mb-4">
        <span className="text-4xl">{dimension.icon}</span>
        <div>
          <h1 className="text-2xl font-serif">{dimension.name}</h1>
          <p className="text-sm text-muted-foreground">{dimension.shortDescription}</p>
        </div>
      </div>
      <Card className="mb-6 border-0 shadow-sm">
        <CardContent className="p-5">
          {dimension.fullContent.split('\n\n').map((p, i) => (
            <p key={i} className="text-sm leading-relaxed text-foreground/80 mb-3 last:mb-0">{p}</p>
          ))}
        </CardContent>
      </Card>
      <Card className="mb-6 border-0 shadow-sm bg-primary/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-serif">Reflection Prompts</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {dimension.reflectionPrompts.map((prompt, i) => (
              <li key={i} className="text-sm italic text-foreground/70 pl-3 border-l-2 border-accent">{prompt}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <Card className="mb-6 border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-serif">Practical Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {dimension.practicalTips.map((tip, i) => (
              <li key={i} className="text-sm text-foreground/80 flex gap-2">
                <span className="text-accent shrink-0">✦</span>
                {tip}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <Button onClick={markProgress} className="w-full rounded-full" variant={status === 'explored' ? 'secondary' : 'default'}>
        {status === 'not-started' ? 'Mark as In Progress' : status === 'in-progress' ? 'Mark as Explored' : '✓ Explored'}
      </Button>
    </div>
  );
};

export default DimensionDetail;
