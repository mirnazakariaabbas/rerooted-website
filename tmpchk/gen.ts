import { writeFileSync } from 'fs';
const jsPDF = (await import('jspdf')).default;
(jsPDF as any).API.save = function (name: string) {
  writeFileSync('/tmp/pdfchk/out.pdf', Buffer.from(this.output('arraybuffer')));
  return this;
};
const { generateAssessmentPdf } = await import('../src/utils/assessmentPdf');
const { ASSESSMENT_QUESTIONS } = await import('../src/data/assessment-questions');
const answers: Record<string, number | number[]> = {};
for (const q of ASSESSMENT_QUESTIONS) {
  answers[q.id] = q.type === 'multi' ? [0, 1] : q.options[q.options.length - 1].value;
}
generateAssessmentPdf({ name: 'Jane Doe', countryFrom: 'Egypt', countryTo: 'Switzerland' } as any, {
  completedAt: new Date().toISOString(), score: 78, answers,
});
