import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
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
import AnnouncementBanner from '@/components/AnnouncementBanner';
import logoShorthand from '@/assets/logo-shorthand-blue.png';

const MemberHome = () => {
  const { user, reflections, addReflection, dimensionProgress } = useUser();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [reflectionText, setReflectionText] = useState('');
  const [shareWithCoach, setShareWithCoach] = useState(false);
  const [selectedDimension, setSelectedDimension] = useState<string | null>(null);

  useEffect(() => {
    const dim = searchParams.get('dimension');
    if (dim) {
      setSelectedDimension(dim);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="pb-24 px-6 pt-8 lg:px-12 max-w-2xl mx-auto"
    >
      <AnnouncementBanner />
      <div className="mb-10">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-[900] tracking-tight mb-1">{greeting}</h1>
          <img src={logoShorthand} alt="Re-Rooted" className="h-20" />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="secondary" className="text-xs font-medium">
            Stage {stageInfo.number}: {stageInfo.name}
          </Badge>
          {user.countryFrom && user.countryTo && (
            <span className="text-sm text-muted-foreground">
              {user.countryFrom} → {user.countryTo} · {arrivalText}
            </span>
          )}
        </div>
      </div>

      <Card className="mb-10 border border-border bg-muted">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-[900] tracking-tight">Where You Are</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-foreground/80">{STAGE_DESCRIPTIONS[user.stage]}</p>
        </CardContent>
      </Card>

      <div className="mb-10">
        <h2 className="text-lg font-[900] tracking-tight mb-4">Your Focus Areas</h2>
        {isComingSoon ? (
          <Card className="border-dashed border border-border">
            <CardContent className="py-10 text-center">
              <p className="text-muted-foreground font-bold text-lg mb-2">Coming Soon</p>
              <p className="text-sm text-muted-foreground">Full coaching content for the {stageInfo.name} stage is being developed.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {dimensions.map(dim => (
              <button key={dim.id} onClick={() => setSelectedDimension(dim.id)} className="w-full text-left">
                <Card className="hover:bg-muted/50 transition-colors border border-border">
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

      <div className="grid grid-cols-2 gap-3 mb-10">
        <Card className="cursor-pointer hover:bg-muted/50 transition-colors border border-border" onClick={() => navigate('/app/cultural')}>
          <CardContent className="p-6 flex flex-col items-center text-center gap-2">
            <Globe className="h-6 w-6 text-primary" />
            <span className="text-xs font-medium">Cultural Companion</span>
            <ArrowRight className="h-3 w-3 text-muted-foreground" />
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:bg-muted/50 transition-colors border border-border" onClick={() => navigate('/app/assessment')}>
          <CardContent className="p-6 flex flex-col items-center text-center gap-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            <span className="text-xs font-medium">Complexity Score</span>
            <ArrowRight className="h-3 w-3 text-muted-foreground" />
          </CardContent>
        </Card>
      </div>

      <Card className="border border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-bold text-muted-foreground">Weekly Reflection</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm italic mb-3 text-foreground/80">"{weeklyPrompt}"</p>
          <Textarea value={reflectionText} onChange={e => setReflectionText(e.target.value)} placeholder="Write your thoughts..." className="min-h-[60px] text-sm resize-none mb-2" />
          <div className="flex items-center gap-2 mb-2">
            <Checkbox id="share-coach" checked={shareWithCoach} onCheckedChange={(checked) => setShareWithCoach(checked === true)} />
            <label htmlFor="share-coach" className="text-xs text-muted-foreground cursor-pointer">Share this entry with my coach</label>
          </div>
          <Button onClick={handleReflection} disabled={!reflectionText.trim()} size="sm" variant="secondary" className="w-full rounded-full">Save to journal</Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MemberHome;
