import { useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { ASSESSMENT_QUESTIONS, calculateDifficultyScore, getScoreInterpretation, getPriorityDimensions } from '@/data/assessment-questions';
import { ROOTING_IN_DIMENSIONS } from '@/data/coaching-content';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const AssessmentPage = () => {
  const { user, assessment, setAssessment, reflections } = useUser();
  const [taking, setTaking] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const handleAnswer = (questionId: string, value: number) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);
    if (currentQ < ASSESSMENT_QUESTIONS.length - 1) {
      setTimeout(() => setCurrentQ(c => c + 1), 300);
    } else {
      const score = calculateDifficultyScore(newAnswers);
      setAssessment({ completedAt: new Date().toISOString(), score, answers: newAnswers });
      setTaking(false);
    }
  };

  if (taking) {
    const q = ASSESSMENT_QUESTIONS[currentQ];
    const progress = ((currentQ + 1) / ASSESSMENT_QUESTIONS.length) * 100;
    return (
      <div className="pb-20 px-5 pt-6 max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="sm" onClick={() => setTaking(false)}>← Back</Button>
          <span className="text-xs text-muted-foreground">{currentQ + 1} of {ASSESSMENT_QUESTIONS.length}</span>
        </div>
        <Progress value={progress} className="mb-8 h-1.5" />
        <Badge variant="secondary" className="mb-3 text-xs">{q.category}</Badge>
        <h2 className="text-xl font-serif mb-8">{q.text}</h2>
        <div className="space-y-3">
          {q.options.map(opt => (
            <button
              key={opt.label}
              onClick={() => handleAnswer(q.id, opt.value)}
              className={cn(
                'w-full text-left p-4 rounded-xl border-2 transition-all text-sm',
                answers[q.id] === opt.value ? 'border-primary bg-primary/5' : 'border-border bg-card hover:border-primary/30'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20 px-5 pt-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-serif mb-6">My Assessment</h1>
      {!assessment ? (
        <Card className="border-0 shadow-md">
          <CardContent className="py-10 text-center">
            <div className="text-4xl mb-4">📊</div>
            <h2 className="text-xl font-serif mb-2">Move Difficulty Assessment</h2>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
              Answer {ASSESSMENT_QUESTIONS.length} questions to understand the complexity of your specific move.
            </p>
            <Button onClick={() => { setTaking(true); setCurrentQ(0); setAnswers({}); }} className="rounded-full px-8">Start Assessment</Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="mb-6 border-0 shadow-md bg-primary/5">
            <CardContent className="py-8 text-center">
              <div className="text-5xl font-serif font-bold text-primary mb-2">{assessment.score}</div>
              <div className="text-sm text-muted-foreground mb-1">out of 100</div>
              <Badge variant="secondary" className="mb-4">
                {assessment.score <= 30 ? 'Low' : assessment.score <= 50 ? 'Moderate' : assessment.score <= 70 ? 'High' : 'Very High'} Complexity
              </Badge>
              <p className="text-sm leading-relaxed text-foreground/80 max-w-sm mx-auto">
                {getScoreInterpretation(assessment.score, user.countryFrom, user.countryTo)}
              </p>
            </CardContent>
          </Card>
          <Card className="mb-6 border-0 shadow-sm">
            <CardHeader className="pb-2"><CardTitle className="text-base font-serif">Priority Focus Areas</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2">
                {getPriorityDimensions(assessment.score, user.hasChildren).map(dimId => {
                  const dim = ROOTING_IN_DIMENSIONS.find(d => d.id === dimId);
                  if (!dim) return null;
                  return (
                    <div key={dimId} className="flex items-center gap-2 text-sm p-2 rounded-lg bg-muted/50">
                      <span>{dim.icon}</span><span>{dim.name}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
          <Button onClick={() => { setTaking(true); setCurrentQ(0); setAnswers({}); }} variant="outline" className="w-full rounded-full mb-6">Retake Assessment</Button>
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2"><CardTitle className="text-base font-serif">Reflection Log</CardTitle></CardHeader>
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
    </div>
  );
};

export default AssessmentPage;
