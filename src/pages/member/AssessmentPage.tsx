import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
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
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const AssessmentPage = () => {
  const { user, assessment, setAssessment, reflections } = useUser();
  const [taking, setTaking] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number | number[]>>({});

  const visibleQuestions = useMemo(() => getVisibleQuestions(answers), [answers]);

  const handleSingleAnswer = (questionId: string, value: number) => {
    const newAnswers = { ...answers, [questionId]: value };
    // Clear dependent answers when the dependency changes
    for (const q of ASSESSMENT_QUESTIONS) {
      if (q.conditional?.questionId === questionId && newAnswers[q.id] !== undefined) {
        const visible = getVisibleQuestions(newAnswers);
        if (!visible.find(vq => vq.id === q.id)) {
          delete newAnswers[q.id];
        }
      }
    }
    setAnswers(newAnswers);
    const newVisible = getVisibleQuestions(newAnswers);
    if (currentIdx < newVisible.length - 1) {
      setTimeout(() => setCurrentIdx(i => i + 1), 300);
    } else {
      finishAssessment(newAnswers);
    }
  };

  const handleMultiToggle = (questionId: string, value: number) => {
    const current = (answers[questionId] as number[] | undefined) ?? [];
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    setAnswers({ ...answers, [questionId]: updated });
  };

  const handleMultiNext = () => {
    if (currentIdx < visibleQuestions.length - 1) {
      setCurrentIdx(i => i + 1);
    } else {
      finishAssessment(answers);
    }
  };

  const finishAssessment = (finalAnswers: Record<string, number | number[]>) => {
    const score = calculateDifficultyScore(finalAnswers);
    setAssessment({ completedAt: new Date().toISOString(), score, answers: finalAnswers });
    setTaking(false);
  };

  const goBack = () => {
    if (currentIdx > 0) setCurrentIdx(i => i - 1);
  };

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
        <Badge variant="secondary" className="mb-3 text-xs">{q.category}</Badge>
        <h2 className="text-xl font-black tracking-tight mb-2">{q.text}</h2>
        {isMulti && (
          <p className="text-xs text-muted-foreground mb-6">Select all that apply</p>
        )}
        <div className="space-y-3">
          {q.options.map(opt => (
            isMulti ? (
              <button
                key={opt.label}
                onClick={() => handleMultiToggle(q.id, opt.value)}
                className={cn(
                  'w-full text-left p-4 rounded-xl border-2 transition-all text-sm flex items-center gap-3',
                  multiSelected.includes(opt.value) ? 'border-primary bg-muted' : 'border-border hover:border-primary/30'
                )}
              >
                <Checkbox checked={multiSelected.includes(opt.value)} className="pointer-events-none" />
                {opt.label}
              </button>
            ) : (
              <button
                key={opt.label}
                onClick={() => handleSingleAnswer(q.id, opt.value)}
                className={cn(
                  'w-full text-left p-4 rounded-xl border-2 transition-all text-sm',
                  answers[q.id] === opt.value ? 'border-primary bg-muted' : 'border-border hover:border-primary/30'
                )}
              >
                {opt.label}
              </button>
            )
          ))}
        </div>
        <div className="flex items-center justify-between mt-8">
          <Button variant="ghost" size="sm" onClick={goBack} disabled={currentIdx === 0}>
            <ChevronLeft className="h-4 w-4 mr-1" /> Previous
          </Button>
          {isMulti && (
            <Button onClick={handleMultiNext} disabled={multiSelected.length === 0} className="rounded-full px-6">
              {currentIdx === visibleQuestions.length - 1 ? 'Finish' : 'Next'} <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="pb-24 px-6 pt-8 lg:px-12 max-w-2xl mx-auto"
    >
      <h1 className="text-3xl font-black tracking-tight mb-8">Relocation Complexity Score</h1>
      {!assessment ? (
        <Card className="border border-border">
          <CardContent className="py-10 text-center">
            <div className="text-4xl mb-4">📊</div>
            <h2 className="text-xl font-black tracking-tight mb-2">Relocation Complexity Assessment</h2>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
              Answer {ASSESSMENT_QUESTIONS.length} questions across 8 categories to understand the full complexity of this relocation.
            </p>
            <Button onClick={() => { setTaking(true); setCurrentIdx(0); setAnswers({}); }} className="rounded-full px-8">Start Assessment</Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="mb-8 border border-border bg-muted">
            <CardContent className="py-8 text-center">
              <div className="text-5xl font-black text-primary mb-2">{assessment.score}</div>
              <div className="text-sm text-muted-foreground mb-1">out of 100</div>
              <Badge variant="secondary" className="mb-4">
                {getScoreBand(assessment.score).label}
              </Badge>
              <p className="text-xs text-muted-foreground mb-3 font-medium">
                {getScoreBand(assessment.score).recommendation}
              </p>
              <p className="text-sm leading-relaxed text-foreground/80 max-w-sm mx-auto">
                {getScoreInterpretation(assessment.score, user.countryFrom, user.countryTo)}
              </p>
            </CardContent>
          </Card>
          <Card className="mb-8 border border-border">
            <CardHeader className="pb-2"><CardTitle className="text-base font-black tracking-tight">Priority Focus Areas</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2">
                {getPriorityDimensions(assessment.score, assessment.answers).map(dimId => {
                  const dim = ROOTING_IN_DIMENSIONS.find(d => d.id === dimId);
                  if (!dim) return null;
                  return (
                    <div key={dimId} className="flex items-center gap-2 text-sm p-2 rounded-lg bg-muted">
                      <span>{dim.icon}</span><span>{dim.name}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
          <Button onClick={() => { setTaking(true); setCurrentIdx(0); setAnswers({}); }} variant="outline" className="w-full rounded-full mb-8">Retake Assessment</Button>
          <Card className="border border-border">
            <CardHeader className="pb-2"><CardTitle className="text-base font-black tracking-tight">Reflection Log</CardTitle></CardHeader>
            <CardContent>
              {reflections.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">Your reflections from the Home tab will appear here.</p>
              ) : (
                <div className="space-y-3">
                  {reflections.slice(-5).reverse().map(r => (
                    <div key={r.id} className="border-l-2 border-accent pl-3">
                      <p className="text-xs text-muted-foreground">{new Date(r.date).toLocaleDateString()}</p>
                      <p className="text-xs italic text-muted-foreground mb-1">"{r.prompt}"</p>
                      <p className="text-sm">{r.response}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </motion.div>
  );
};

export default AssessmentPage;
