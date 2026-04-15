import jsPDF from 'jspdf';
import {
  ASSESSMENT_QUESTIONS,
  getScoreBand,
  getPriorityDimensions,
} from '@/data/assessment-questions';
import { ROOTING_IN_DIMENSIONS } from '@/data/coaching-content';
import type { UserProfile, AssessmentResult } from '@/types/user';

/* ── Palette ── */
const DEEP_BLUE: [number, number, number] = [31, 41, 156];
const FRESH_GREEN: [number, number, number] = [61, 167, 118];
const TEXT_DARK: [number, number, number] = [30, 30, 40];
const TEXT_MID: [number, number, number] = [120, 120, 135];
const LIGHT_BG: [number, number, number] = [237, 237, 248];

const CATEGORY_BAR_COLORS: Record<string, [number, number, number]> = {
  'Assignment Context': [31, 41, 156],
  'Cultural Distance': [37, 99, 235],
  'Professional Environment': [61, 167, 118],
  'Language': [67, 56, 202],
  'Family & Accompanying': [236, 72, 153],
  'Geographic Factors': [217, 119, 6],
  'Social Readiness': [159, 18, 57],
  'Resilience & Adaptability': [120, 113, 108],
};

const CATEGORY_MAXIMUMS: Record<string, number> = {
  'Assignment Context': 60,
  'Cultural Distance': 30,
  'Professional Environment': 30,
  'Language': 20,
  'Family & Accompanying': 50,
  'Geographic Factors': 30,
  'Social Readiness': 20,
  'Resilience & Adaptability': 40,
};

/* ── Helpers ── */
// jsPDF built-in fonts only support Latin-1 (cp1252). Replace all
// characters outside that range with safe ASCII equivalents.
const sanitize = (str: string) =>
  str
    .replace(/\u2013/g, '-')   // en-dash -> hyphen
    .replace(/\u2014/g, ' - ') // em-dash -> spaced hyphen
    .replace(/\u2019/g, "'")   // right single quote
    .replace(/\u2018/g, "'")   // left single quote
    .replace(/\u201C/g, '"')
    .replace(/\u201D/g, '"')
    .replace(/\u2022/g, '-')   // bullet
    .replace(/\u2192/g, '->')  // arrow
    .replace(/\u00B7/g, '-')   // middle dot
    .replace(/[^\x20-\x7E\u00A0-\u00FF]/g, '') // strip remaining non-Latin-1
    .trim();

function getCategoryScore(
  category: string,
  answers: Record<string, number | number[]>
): number {
  let total = 0;
  for (const q of ASSESSMENT_QUESTIONS) {
    if (q.category !== category) continue;
    const answer = answers[q.id];
    if (answer === undefined) continue;
    if (Array.isArray(answer)) {
      let values = answer.map(idx =>
        idx >= 0 && idx < q.options.length ? q.options[idx].value : idx
      );
      if (q.ignoreIfAlsoSelected !== undefined && values.length > 1) {
        values = values.filter(v => v !== q.ignoreIfAlsoSelected);
      }
      const sum = values.reduce((a, b) => a + b, 0);
      total += q.multiSelectCap ? Math.min(sum, q.multiSelectCap) : sum;
    } else {
      total += answer;
    }
  }
  return total;
}

function resolveMultiLabels(questionId: string, indices: number[]): string[] {
  const q = ASSESSMENT_QUESTIONS.find((q) => q.id === questionId);
  if (!q) return indices.map(String);
  return indices.map((idx) => {
    if (idx >= 0 && idx < q.options.length) return q.options[idx].label;
    const opt = q.options.find((o) => o.value === idx);
    return opt ? opt.label : String(idx);
  });
}

/* ── Main export ── */
export function generateAssessmentPdf(
  user: UserProfile,
  assessment: AssessmentResult
) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pw = doc.internal.pageSize.getWidth();  // 210
  const ph = doc.internal.pageSize.getHeight(); // 297
  const mx = 20;
  const cw = pw - mx * 2;
  let y = 0;

  const dateStr = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const band = getScoreBand(assessment.score);

  // ═══════════════════════════════════════════════
  // PAGE 1 — Cover / Summary
  // ═══════════════════════════════════════════════

  // ── Blue header block ──
  const headerH = 110;
  doc.setFillColor(...DEEP_BLUE);
  doc.rect(0, 0, pw, headerH, 'F');

  // Logo
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('Re-Rooted\u00AE', mx, 20);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(200, 200, 230);
  doc.text('SWITZERLAND', mx + 55, 20);

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('Relocation Complexity Score', mx, 38);

  // Meta line
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(200, 200, 230);
  const metaParts: string[] = [];
  if (user.name) metaParts.push(sanitize(user.name));
  if (user.countryFrom && user.countryTo) {
    metaParts.push(sanitize(`${user.countryFrom} -> ${user.countryTo}`));
  }
  metaParts.push(dateStr);
  doc.text(metaParts.join('  |  '), mx, 47);

  // ── Score circle ──
  const circleX = mx + 25;
  const circleY = 74;
  const circleR = 16;
  doc.setDrawColor(180, 180, 210);
  doc.setLineWidth(0.8);
  doc.circle(circleX, circleY, circleR, 'S');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.text(String(assessment.score), circleX, circleY + 1, { align: 'center' });
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(200, 200, 230);
  doc.text('out of 100', circleX, circleY + 8, { align: 'center' });

  // ── Band label pill ──
  const bandX = mx + 50;
  const bandY = circleY - 10;
  doc.setFillColor(200, 200, 230);
  doc.roundedRect(bandX, bandY, 48, 7, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...DEEP_BLUE);
  doc.text(sanitize(band.label), bandX + 24, bandY + 4.8, { align: 'center' });

  // Recommendation
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(210, 210, 230);
  const recLines = doc.splitTextToSize(sanitize(band.recommendation), cw - 55);
  doc.text(recLines, bandX, bandY + 14);

  // ── PRIORITY FOCUS AREAS ──
  y = headerH + 10;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...DEEP_BLUE);
  doc.text('PRIORITY FOCUS AREAS', mx, y);
  y += 6;

  const priorities = getPriorityDimensions(assessment.score, assessment.answers);
  const colW = (cw - 4) / 2;
  const pillH = 9;
  const pillGap = 2;

  priorities.forEach((dimId, i) => {
    const dim = ROOTING_IN_DIMENSIONS.find((d) => d.id === dimId);
    if (!dim) return;
    const col = i % 2;
    const row = Math.floor(i / 2);
    const px = mx + col * (colW + 4);
    const py = y + row * (pillH + pillGap);
    doc.setFillColor(...LIGHT_BG);
    doc.roundedRect(px, py, colW, pillH, 3, 3, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...DEEP_BLUE);
    doc.text(sanitize(dim.name), px + 5, py + 5.8);
  });

  const priorityRows = Math.ceil(priorities.length / 2);
  y += priorityRows * (pillH + pillGap) + 8;

  // ── COMPLEXITY BY CATEGORY ──
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...DEEP_BLUE);
  doc.text('COMPLEXITY BY CATEGORY', mx, y);
  y += 6;

  const categoryOrder = Object.keys(CATEGORY_MAXIMUMS);
  const catData = categoryOrder.map((cat) => ({
    name: cat,
    score: getCategoryScore(cat, assessment.answers),
    max: CATEGORY_MAXIMUMS[cat],
  }));
  catData.sort((a, b) => b.score / b.max - a.score / a.max);

  const barH = 4;
  const barMaxW = cw;
  const barRowH = 14;

  catData.forEach((cat) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(...TEXT_DARK);
    doc.text(sanitize(cat.name), mx, y);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...TEXT_MID);
    doc.text(`${cat.score} / ${cat.max}`, pw - mx, y, { align: 'right' });
    y += 2.5;

    // Background bar
    doc.setFillColor(...LIGHT_BG);
    doc.roundedRect(mx, y, barMaxW, barH, 1.5, 1.5, 'F');

    // Filled bar
    const pct = cat.max > 0 ? cat.score / cat.max : 0;
    const fillW = Math.max(barMaxW * pct, 2);
    const color = CATEGORY_BAR_COLORS[cat.name] || DEEP_BLUE;
    doc.setFillColor(...color);
    doc.roundedRect(mx, y, fillW, barH, 1.5, 1.5, 'F');

    y += barRowH - 2.5;
  });

  // ═══════════════════════════════════════════════
  // PAGE 2+ — Answer Breakdown
  // ═══════════════════════════════════════════════
  doc.addPage();

  const drawBreakdownHeader = (continued = false) => {
    doc.setFillColor(...DEEP_BLUE);
    doc.rect(0, 0, pw, 18, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Re-Rooted\u00AE', mx, 12);
    doc.setFontSize(5.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(200, 200, 230);
    doc.text('SWITZERLAND', mx + 35, 12);

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('Answer Breakdown', pw - mx, 12, { align: 'right' });

    y = 26;
    if (continued) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(...TEXT_MID);
      doc.text('Answer Breakdown (continued)', mx, y);
      y += 6;
    }
  };

  drawBreakdownHeader(false);

  let lastCategory = '';

  const checkBreakdownPageBreak = (needed: number) => {
    if (y + needed > ph - 18) {
      doc.addPage();
      drawBreakdownHeader(true);
    }
  };

  ASSESSMENT_QUESTIONS.forEach((q) => {
    const answer = assessment.answers[q.id];
    if (answer === undefined) return;

    // Category header
    if (q.category !== lastCategory) {
      checkBreakdownPageBreak(16);
      const catScore = getCategoryScore(q.category, assessment.answers);
      const catMax = CATEGORY_MAXIMUMS[q.category] ?? 0;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(...FRESH_GREEN);
      doc.text(sanitize(q.category), mx, y);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(...TEXT_MID);
      doc.text(`${catScore} / ${catMax}`, pw - mx, y, { align: 'right' });

      y += 1.5;
      doc.setDrawColor(210, 210, 215);
      doc.setLineWidth(0.3);
      doc.line(mx, y, pw - mx, y);
      y += 5;
      lastCategory = q.category;
    }

    // Question text (grey)
    checkBreakdownPageBreak(12);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...TEXT_MID);
    const qLines = doc.splitTextToSize(sanitize(q.text), cw);
    doc.text(qLines, mx, y);
    y += qLines.length * 3.5 + 1;

    // Answer
    if (Array.isArray(answer)) {
      const labels = resolveMultiLabels(q.id, answer);
      let pillX = mx;
      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'bold');

      labels.forEach((label, li) => {
        const labelStr = sanitize(label);
        const tw = doc.getTextWidth(labelStr) + 8;
        const tpH = 6;
        if (pillX + tw > pw - mx && li > 0) {
          pillX = mx;
          y += tpH + 2;
        }
        doc.setFillColor(...LIGHT_BG);
        doc.roundedRect(pillX, y - 1, tw, tpH, 2, 2, 'F');
        doc.setTextColor(...TEXT_DARK);
        doc.text(labelStr, pillX + 4, y + 3);
        pillX += tw + 3;
      });
      y += 9;
    } else {
      const opt = q.options.find((o) => o.value === answer);
      if (opt) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(...TEXT_DARK);
        const aLines = doc.splitTextToSize(sanitize(opt.label), cw);
        doc.text(aLines, mx, y);
        y += aLines.length * 3.8 + 1;
      }
    }
    y += 3;
  });

  // ═══════════════════════════════════════════════
  // FOOTERS
  // ═══════════════════════════════════════════════
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setDrawColor(200, 200, 205);
    doc.setLineWidth(0.3);
    doc.line(mx, ph - 13, pw - mx, ph - 13);

    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...TEXT_MID);

    if (i === totalPages) {
      doc.text('Re-Rooted\u00AE  |  The human side of relocation', mx, ph - 8);
    } else {
      doc.text('Generated by Re-Rooted\u00AE  |  ' + dateStr, mx, ph - 8);
    }
    doc.text('Page ' + i + ' of ' + totalPages, pw - mx, ph - 8, { align: 'right' });
  }

  doc.save(
    'Re-Rooted-Complexity-Score-' + (user.name?.replace(/\s+/g, '-') || 'Report') + '.pdf'
  );
}
