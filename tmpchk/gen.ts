import { writeFileSync } from 'fs';
import { generateAssessmentPdf } from '../src/utils/assessmentPdf';
import { ASSESSMENT_QUESTIONS } from '../src/data/assessment-questions';
const answers: Record<string, number|number[]> = {};
for (const q of ASSESSMENT_QUESTIONS) {
  answers[q.id] = q.type === 'multi' ? [0,1] : q.options[q.options.length-1].value;
}
const user: any = { name: 'Jane Doe', countryFrom: 'Egypt', countryTo: 'Switzerland' };
// patch save
const jsPDF = (await import('jspdf')).default;
(jsPDF as any).prototype.save = function(name: string) { writeFileSync('/tmp/pdfchk/out.pdf', Buffer.from(this.output('arraybuffer'))); };
generateAssessmentPdf(user, { completedAt: new Date().toISOString(), score: 78, answers });
