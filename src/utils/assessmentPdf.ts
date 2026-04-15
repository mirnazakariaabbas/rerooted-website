import jsPDF from 'jspdf';
import {
  ASSESSMENT_QUESTIONS,
  getScoreBand,
  getScoreInterpretation,
  getPriorityDimensions,
} from '@/data/assessment-questions';
import { ROOTING_IN_DIMENSIONS } from '@/data/coaching-content';
import type { UserProfile, AssessmentResult } from '@/types/user';

const DEEP_BLUE = [31, 41, 156] as const; // #1F299C
const FRESH_GREEN = [61, 167, 118] as const; // #3DA776
const WARM_WHITE = [250, 249, 246] as const; // #FAF9F6
const TEXT_DARK = [30, 30, 40] as const;
const TEXT_MID = [100, 100, 115] as const;

export function generateAssessmentPdf(
  user: UserProfile,
  assessment: AssessmentResult
) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = 0;

  const checkPageBreak = (needed: number) => {
    if (y + needed > pageHeight - 25) {
      doc.addPage();
      y = 20;
    }
  };

  // ── Header bar ──
  doc.setFillColor(...DEEP_BLUE);
  doc.rect(0, 0, pageWidth, 36, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text('Re-Rooted\u00AE', margin, 16);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Relocation Complexity Score Report', margin, 26);
  y = 46;

  // ── Meta info ──
  doc.setFontSize(9);
  doc.setTextColor(...TEXT_MID);
  const dateStr = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  doc.text(`Generated: ${dateStr}`, margin, y);
  y += 5;
  if (user.name) {
    doc.text(`Name: ${user.name}`, margin, y);
    y += 5;
  }
  if (user.countryFrom && user.countryTo) {
    doc.text(
      `Relocation: ${user.countryFrom} \u2192 ${user.countryTo}`,
      margin,
      y
    );
    y += 5;
  }
  y += 6;

  // ── Score block ──
  const band = getScoreBand(assessment.score);
  doc.setFillColor(...WARM_WHITE);
  doc.roundedRect(margin, y, contentWidth, 40, 3, 3, 'F');
  doc.setFontSize(36);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...DEEP_BLUE);
  doc.text(String(assessment.score), margin + 12, y + 22);
  doc.setFontSize(10);
  doc.setTextColor(...TEXT_MID);
  doc.text('out of 100', margin + 12, y + 30);

  // Band label
  const bandColor =
    assessment.score <= 25
      ? DEEP_BLUE
      : assessment.score <= 45
        ? FRESH_GREEN
        : assessment.score <= 65
          ? ([188, 173, 212] as const) // Lavender
          : ([232, 168, 56] as const); // Warning
  doc.setFillColor(bandColor[0], bandColor[1], bandColor[2]);
  doc.roundedRect(margin + 55, y + 8, 60, 8, 2, 2, 'F');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text(band.label, margin + 58, y + 14);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...TEXT_DARK);
  const recLines = doc.splitTextToSize(band.recommendation, contentWidth - 70);
  doc.text(recLines, margin + 55, y + 26);
  y += 48;

  // ── Interpretation ──
  const interp = getScoreInterpretation(
    assessment.score,
    user.countryFrom,
    user.countryTo
  );
  doc.setFontSize(9);
  doc.setTextColor(...TEXT_DARK);
  const interpLines = doc.splitTextToSize(interp, contentWidth);
  checkPageBreak(interpLines.length * 4 + 8);
  doc.text(interpLines, margin, y);
  y += interpLines.length * 4 + 10;

  // ── Priority Focus Areas ──
  const priorities = getPriorityDimensions(assessment.score, assessment.answers);
  checkPageBreak(priorities.length * 7 + 14);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...DEEP_BLUE);
  doc.text('Priority Focus Areas', margin, y);
  y += 7;

  priorities.forEach((dimId) => {
    const dim = ROOTING_IN_DIMENSIONS.find((d) => d.id === dimId);
    if (!dim) return;
    checkPageBreak(7);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...TEXT_DARK);
    doc.text(`${dim.icon}  ${dim.name}`, margin + 4, y);
    y += 6;
  });
  y += 6;

  // ── Answer Breakdown ──
  checkPageBreak(14);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...DEEP_BLUE);
  doc.text('Answer Breakdown', margin, y);
  y += 8;

  let lastCategory = '';
  ASSESSMENT_QUESTIONS.forEach((q) => {
    const answer = assessment.answers[q.id];
    if (answer === undefined) return;

    // Category header
    if (q.category !== lastCategory) {
      checkPageBreak(14);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...FRESH_GREEN);
      doc.text(q.category, margin, y);
      y += 6;
      lastCategory = q.category;
    }

    // Question text
    checkPageBreak(14);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...TEXT_DARK);
    const qLines = doc.splitTextToSize(q.text, contentWidth - 4);
    doc.text(qLines, margin + 2, y);
    y += qLines.length * 3.5 + 1;

    // Selected answer(s)
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...TEXT_MID);
    if (Array.isArray(answer)) {
      answer.forEach((val) => {
        const opt = q.options.find((o) => o.value === val);
        if (opt) {
          checkPageBreak(5);
          doc.text(`\u2022 ${opt.label}`, margin + 6, y);
          y += 4;
        }
      });
    } else {
      const opt = q.options.find((o) => o.value === answer);
      if (opt) {
        doc.text(`\u2192 ${opt.label}`, margin + 6, y);
        y += 4;
      }
    }
    y += 3;
  });

  // ── Footer ──
  const addFooter = (pageNum: number) => {
    doc.setPage(pageNum);
    doc.setFontSize(7);
    doc.setTextColor(...TEXT_MID);
    doc.text(
      `Generated by Re-Rooted\u00AE \u00B7 ${dateStr}`,
      margin,
      pageHeight - 10
    );
    doc.text(
      `Page ${pageNum} of ${doc.getNumberOfPages()}`,
      pageWidth - margin - 20,
      pageHeight - 10
    );
  };

  for (let i = 1; i <= doc.getNumberOfPages(); i++) {
    addFooter(i);
  }

  doc.save(
    `Re-Rooted-Complexity-Score-${user.name?.replace(/\s+/g, '-') || 'Report'}.pdf`
  );
}
