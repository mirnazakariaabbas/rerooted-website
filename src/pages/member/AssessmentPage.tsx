import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@/contexts/UserContext';
import {
  ASSESSMENT_QUESTIONS,
  calculateDifficultyScore,
  getScoreInterpretation,
  getScoreBand,
  getPriorityDimensions,
  getVisibleQuestions,
} from '@/data/assessment-questions';
import { ROOTING_IN_DIMENSIONS } from '@/data/coaching-content';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Download, ArrowRight } from 'lucide-react';
import { generateAssessmentPdf } from '@/utils/assessmentPdf';
import { PageHeader } from '@/components/layout/PageHeader';
import { RerootedTitle } from '@/components/layout/RerootedTitle';

const SESSION_KEY = 'assessment-in-progress';

interface InProgressState {
  taking: boolean;
  currentIdx: number;
  answers: Record<string, number | number[]>;
}

function saveProgress(state: InProgressState) {
  try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(state)); } catch {}
}

function loadProgress(): InProgressState | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

function clearProgress() {
  try { sessionStorage.removeItem(SESSION_KEY); } catch {}
}

const bandColors: Record<string, string> = {
  'Standard Support': 'bg-primary text-primary-foreground',
  'Enhanced Support': 'bg-secondary text-secondary-foreground',
  'Intensive Support': 'bg-accent text-accent-foreground',
  'High-Touch Program': 'bg-destructive/80 text-destructive-foreground',
};

const AssessmentPage = () => {
  const { user, assessment, setAssessment, reflections, profileLoading } = useUser();
  const navigate = useNavigate();

  const saved = useMemo(() => loadProgress(), []);
  const [taking, setTaking] = useState(false);
  const [showResume, setShowResume] = useState(saved?.taking ?? false);
  const [currentIdx, setCurrentIdx] = useState(saved?.currentIdx ?? 0);
  const [answers, setAnswers] = useState<Record<string, number | number[]>>(saved?.answers ?? {});

  const visibleQuestions = useMemo(() => getVisibleQuestions(answers), [answers]);

  useEffect(() => {
    if (taking) {
      saveProgress({ taking, currentIdx, answers });
    } else if (!showResume) {
      clearProgress();
    }
  }, [taking, currentIdx, answers, showResume]);

  const handleResume = () => { setShowResume(false); setTaking(true); };
  const handleStartFresh = () => { setShowResume(false); setAnswers({}); setCurrentIdx(0); clearProgress(); setTaking(true); };

  const handleSingleAnswer = (questionId: string, value: number) => {
    const newAnswers = { ...answers, [questionId]: value };
    for (const q of ASSESSMENT_QUESTIONS) {
      if (q.conditional?.questionId === questionId && newAnswers[q.id] !== undefined) {
        const visible = getVisibleQuestions(newAnswers);
        if (!visible.find(vq => vq.id === q.id)) delete newAnswers[q.id];
      }
    }
    setAnswers(newAnswers);
    const newVisible = getVisibleQuestions(newAnswers);
    if (currentIdx < newVisible.length - 1) {
      setTimeout(() => setCurrentIdx(i => i + 1), 300);
    }
    // On last question, don't auto-submit — wait for explicit Submit click
  };

  const handleMultiToggle = (questionId: string, optionIndex: number) => {
    const current = (answers[questionId] as number[] | undefined) ?? [];
    const updated = current.includes(optionIndex) ? current.filter(i => i !== optionIndex) : [...current, optionIndex];
    setAnswers({ ...answers, [questionId]: updated });
  };

  const handleMultiNext = () => {
    if (currentIdx < visibleQuestions.length - 1) setCurrentIdx(i => i + 1);
    else finishAssessment(answers);
  };

  const finishAssessment = (finalAnswers: Record<string, number | number[]>) => {
    // finalAnswers has indices for multi-select, values for single-select
    // calculateDifficultyScore now resolves indices internally
    const score = calculateDifficultyScore(finalAnswers);
    setAssessment({ completedAt: new Date().toISOString(), score, answers: finalAnswers });
    setTaking(false);
  };

  const goBack = () => { if (currentIdx > 0) setCurrentIdx(i => i - 1); };

  // ── Resume prompt ──
  if (showResume && !taking) {
    const savedQuestion = visibleQuestions[Math.min(currentIdx, visibleQuestions.length - 1)];
    const answeredCount = Object.keys(answers).length;
    return (
      <div className="pb-24">
        <PageHeader eyebrow={false} title={<RerootedTitle suffix="Relocation Complexity Score" showBreak />} subtitle="Resume your assessment" />
        <div className="max-w-2xl mx-auto px-6 -mt-10 relative">
        <Card className="border-0 bg-card rounded-3xl">
          <CardContent className="py-10 text-center">
            <div className="text-4xl mb-4">📝</div>
            <h2 className="text-xl font-[900] tracking-tight mb-2">Resume Assessment?</h2>
            <p className="text-sm text-muted-foreground mb-2 max-w-sm mx-auto">
              You have an assessment in progress: {answeredCount} of {visibleQuestions.length} questions answered.
            </p>
            {savedQuestion && (
              <p className="text-xs text-muted-foreground mb-6">
                Next up: <span className="font-medium text-foreground">{savedQuestion.category}</span>
              </p>
            )}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={handleResume} className="rounded-full px-8">Continue Where I Left Off</Button>
              <Button onClick={handleStartFresh} variant="outline" className="rounded-full px-8">Start Over</Button>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    );
  }

  // ── Question flow ──
  if (taking && visibleQuestions.length > 0) {
    const q = visibleQuestions[Math.min(currentIdx, visibleQuestions.length - 1)];
    const progress = ((currentIdx + 1) / visibleQuestions.length) * 100;
    const isMulti = q.type === 'multi';
    const multiSelected = (answers[q.id] as number[] | undefined) ?? [];

    return (
      <div className="pb-24 px-6 pt-8 lg:px-12 max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="sm" onClick={() => setTaking(false)}>← Exit</Button>
          <span className="text-xs text-muted-foreground">{currentIdx + 1} of {visibleQuestions.length}</span>
        </div>
        <Progress value={progress} className="mb-8 h-1.5" />
        <AnimatePresence mode="wait">
          <motion.div
            key={q.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            <Badge variant="secondary" className="mb-3 text-xs bg-accent/20 text-accent-foreground">{q.category}</Badge>
            <h2 className="text-xl font-[900] tracking-tight mb-2">{q.text}</h2>
            {isMulti && <p className="text-xs text-muted-foreground mb-6">Select all that apply</p>}
            <div className="space-y-3">
              {q.options.map((opt, idx) =>
                isMulti ? (
                  <button
                    key={idx}
                    onClick={() => handleMultiToggle(q.id, idx)}
                    className={cn(
                      'w-full text-left p-4 rounded-xl border-2 transition-all text-sm flex items-center gap-3',
                      multiSelected.includes(idx) ? 'border-primary bg-muted' : 'border-border hover:border-primary/30'
                    )}
                  >
                    <Checkbox checked={multiSelected.includes(idx)} className="pointer-events-none" />
                    {opt.label}
                  </button>
                ) : (
                  <button
                    key={idx}
                    onClick={() => handleSingleAnswer(q.id, opt.value)}
                    className={cn(
                      'w-full text-left p-4 rounded-xl border-2 transition-all text-sm',
                      answers[q.id] === opt.value ? 'border-primary bg-muted' : 'border-border hover:border-primary/30'
                    )}
                  >
                    {opt.label}
                  </button>
                )
              )}
            </div>
          </motion.div>
        </AnimatePresence>
        <div className="flex items-center justify-between mt-8">
          <Button variant="ghost" size="sm" onClick={goBack} disabled={currentIdx === 0}>
            <ChevronLeft className="h-4 w-4 mr-1" /> Previous
          </Button>
          {isMulti ? (
            <Button onClick={handleMultiNext} disabled={multiSelected.length === 0} className="rounded-full px-6">
              {currentIdx === visibleQuestions.length - 1 ? 'Submit' : 'Next'} <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : currentIdx === visibleQuestions.length - 1 && answers[q.id] !== undefined ? (
            <Button onClick={() => finishAssessment(answers)} className="rounded-full px-6">
              Submit <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : null}
        </div>
      </div>
    );
  }

  // ── Loading ──
  if (profileLoading) {
    return (
      <div className="pb-24 px-6 pt-8 lg:px-12 max-w-2xl mx-auto flex items-center justify-center min-h-[40vh]">
        <div className="animate-pulse text-muted-foreground text-sm">Loading your assessment…</div>
      </div>
    );
  }

  // ── Results / Start ──
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="pb-24"
    >
      <PageHeader
        eyebrow={false}
        title={<RerootedTitle prefix="My" suffix="Relocation Complexity Score" />}
        subtitle="Understand the full complexity of your relocation"
      />
      <div className="max-w-2xl mx-auto px-6 -mt-10 relative">

      {!assessment ? (
        <Card className="border border-border">
          <CardContent className="py-12 text-center">
            <div className="text-4xl mb-4">📊</div>
            <h2 className="text-xl font-[900] tracking-tight mb-2">Relocation Complexity Assessment</h2>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
              Answer {ASSESSMENT_QUESTIONS.length} questions across 8 categories to understand the full complexity of this relocation.
            </p>
            <Button onClick={() => { setTaking(true); setCurrentIdx(0); setAnswers({}); }} className="rounded-full px-8">Start Assessment</Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="mb-10 border border-border bg-muted">
            <CardContent className="py-10 text-center">
              <div className="text-6xl font-[900] text-primary mb-2">{assessment.score}</div>
              <div className="text-sm text-muted-foreground mb-3">out of 100</div>
              <Badge className={cn('mb-4 text-xs', bandColors[getScoreBand(assessment.score).label] || 'bg-primary text-primary-foreground')}>
                {getScoreBand(assessment.score).label}
              </Badge>
              <p className="text-xs text-muted-foreground mb-4 font-medium">
                {getScoreBand(assessment.score).recommendation}
              </p>
              <Separator className="my-4 max-w-xs mx-auto" />
              <p className="text-sm leading-relaxed text-foreground/80 max-w-md mx-auto">
                {getScoreInterpretation(assessment.score, user.countryFrom, user.countryTo)}
              </p>
            </CardContent>
          </Card>

          <div className="mb-10">
            <h3 className="text-base font-[900] tracking-tight mb-3">Priority Focus Areas</h3>
            <div className="space-y-3">
              {getPriorityDimensions(assessment.score, assessment.answers).map(dimId => {
                const dim = ROOTING_IN_DIMENSIONS.find(d => d.id === dimId);
                if (!dim) return null;
                return (
                  <Card key={dimId} className="border border-border hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => navigate('/app/home?dimension=' + dimId)}>
                    <CardContent className="p-4 flex items-center gap-3">
                      <span className="text-2xl">{dim.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{dim.name}</div>
                        <div className="text-xs text-muted-foreground truncate">{dim.shortDescription}</div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          <div className="space-y-3 mb-10">
            <Button onClick={() => { setTaking(true); setCurrentIdx(0); setAnswers({}); }} variant="outline" className="w-full rounded-full">Retake Assessment</Button>
            <Button
              variant="outline"
              className="w-full rounded-full gap-2"
              onClick={() => generateAssessmentPdf(user, assessment)}
            >
              <Download className="h-4 w-4" /> Download PDF Report
            </Button>
          </div>
        </>
      )}
      </div>
    </motion.div>
  );
};

export default AssessmentPage;
