import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Checkbox } from '@/components/ui/checkbox';
import { useUser } from '@/contexts/UserContext';
import { STAGE_LABELS } from '@/types/user';
import { STAGE_DESCRIPTIONS, ROOTING_IN_DIMENSIONS, WEEKLY_PROMPTS } from '@/data/coaching-content';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { differenceInMonths } from 'date-fns';
import { ArrowRight, Globe, BarChart3 } from 'lucide-react';
import DimensionDetail from '@/components/home/DimensionDetail';
import logoShorthand from '@/assets/logo-shorthand-blue.png';

const MemberHome = () => {
  const { user, reflections, addReflection, dimensionProgress } = useUser();
  const navigate = useNavigate();
  const [reflectionText, setReflectionText] = useState('');
  const [shareWithCoach, setShareWithCoach] = useState(false);
  const [selectedDimension, setSelectedDimension] = useState<string | null>(null);

  const stageInfo = STAGE_LABELS[user.stage];
  const monthsAgo = user.arrivalDate ? differenceInMonths(new Date(), new Date(user.arrivalDate)) : 0;
  const arrivalText = monthsAgo > 0 ? `Arrived ${monthsAgo} month${monthsAgo !== 1 ? 's' : ''} ago` : monthsAgo === 0 ? 'Just arrived' : 'Arriving soon';
  const greeting = user.name ? `Welcome, ${user.name}` : 'Welcome';
  const weekIndex = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000)) % WEEKLY_PROMPTS.length;
  const weeklyPrompt = WEEKLY_PROMPTS[weekIndex];

  const isRootingIn = user.stage === 'rooting-in';
  const isComingSoon = !isRootingIn;
  const dimensions = ROOTING_IN_DIMENSIONS.filter(d => !d.requiresChildren || user.hasChildren);
  const getProgress = (id: string) => dimensionProgress.find(d => d.dimension === id)?.status || 'not-started';

  const statusColors = {
    'not-started': 'bg-muted text-muted-foreground',
    'in-progress': 'bg-accent/20 text-accent-foreground',
    'explored': 'bg-primary/15 text-primary',
  };

  const handleReflection = () => {
    if (reflectionText.trim()) {
      addReflection({ prompt: weeklyPrompt, response: reflectionText.trim(), sharedWithCoach: shareWithCoach });
      setReflectionText('');
      setShareWithCoach(false);
    }
  };

  if (selectedDimension) {
    const dim = ROOTING_IN_DIMENSIONS.find(d => d.id === selectedDimension)!;
    return <DimensionDetail dimension={dim} onBack={() => setSelectedDimension(null)} />;
  }

  return (
    <div className="pb-20 px-5 pt-6 max-w-lg mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-serif mb-1">{greeting}</h1>
          <img src={logoShorthand} alt="Re-Rooted" className="h-20" />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="secondary" className="font-serif text-xs">
            Stage {stageInfo.number} — {stageInfo.name}
          </Badge>
          {user.countryFrom && user.countryTo && (
            <span className="text-sm text-muted-foreground">
              {user.countryFrom} → {user.countryTo} · {arrivalText}
            </span>
          )}
        </div>
      </div>

      <Card className="mb-6 border-0 shadow-md bg-primary/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-serif">Where You Are</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-foreground/80">{STAGE_DESCRIPTIONS[user.stage]}</p>
        </CardContent>
      </Card>

      <div className="mb-6">
        <h2 className="text-lg font-serif mb-4">Your Focus Areas</h2>
        {isComingSoon ? (
          <Card className="border-dashed">
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground font-serif text-lg mb-2">Coming Soon</p>
              <p className="text-sm text-muted-foreground">Full coaching content for the {stageInfo.name} stage is being developed.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {dimensions.map(dim => (
              <button key={dim.id} onClick={() => setSelectedDimension(dim.id)} className="w-full text-left">
                <Card className="hover:shadow-md transition-shadow border-0 shadow-sm">
                  <CardContent className="p-4 flex items-center gap-3">
                    <span className="text-2xl">{dim.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{dim.name}</div>
                      <div className="text-xs text-muted-foreground truncate">{dim.shortDescription}</div>
                    </div>
                    <Badge className={cn('text-xs shrink-0', statusColors[getProgress(dim.id)])}>{getProgress(dim.id).replace('-', ' ')}</Badge>
                  </CardContent>
                </Card>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <Card className="cursor-pointer hover:shadow-md transition-shadow border-0 shadow-sm" onClick={() => navigate('/app/cultural')}>
          <CardContent className="p-4 flex flex-col items-center text-center gap-2">
            <Globe className="h-6 w-6 text-primary" />
            <span className="text-xs font-medium">Cultural Companion</span>
            <ArrowRight className="h-3 w-3 text-muted-foreground" />
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow border-0 shadow-sm" onClick={() => navigate('/app/assessment')}>
          <CardContent className="p-4 flex flex-col items-center text-center gap-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            <span className="text-xs font-medium">Integration Score</span>
            <ArrowRight className="h-3 w-3 text-muted-foreground" />
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-serif text-muted-foreground">Weekly Reflection</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm italic mb-3 text-foreground/80">"{weeklyPrompt}"</p>
          <Textarea value={reflectionText} onChange={e => setReflectionText(e.target.value)} placeholder="Write your thoughts..." className="min-h-[60px] text-sm resize-none mb-2" />
          <div className="flex items-center gap-2 mb-2">
            <Checkbox id="share-coach" checked={shareWithCoach} onCheckedChange={(checked) => setShareWithCoach(checked === true)} />
            <label htmlFor="share-coach" className="text-xs text-muted-foreground cursor-pointer">Share this entry with my coach</label>
          </div>
          <Button onClick={handleReflection} disabled={!reflectionText.trim()} size="sm" variant="secondary" className="w-full">Save to journal</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default MemberHome;
