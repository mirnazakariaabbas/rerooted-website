import jsPDF from 'jspdf';
import {
  ASSESSMENT_QUESTIONS,
  getScoreBand,
  getScoreInterpretation,
  getPriorityDimensions,
} from '@/data/assessment-questions';
import { ROOTING_IN_DIMENSIONS } from '@/data/coaching-content';
import type { UserProfile, AssessmentResult } from '@/types/user';

/* ── Palette ── */
const DEEP_BLUE: [number, number, number] = [31, 41, 156];
const FRESH_GREEN: [number, number, number] = [61, 167, 118];
const WARM_WHITE: [number, number, number] = [250, 249, 246];
const TEXT_DARK: [number, number, number] = [30, 30, 40];
const TEXT_MID: [number, number, number] = [120, 120, 135];
const LIGHT_BG: [number, number, number] = [237, 237, 248]; // light lavender for pills/rows

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
const sanitize = (str: string) =>
  str
    .replace(/\u2013/g, '\u2013')   // keep en-dash
    .replace(/\u2014/g, '\u2014')   // keep em-dash
    .replace(/\u2019/g, '\u2019')   // keep right single quote
    .replace(/\u2018/g, '\u2018')   // keep left single quote
    .replace(/\u201C/g, '"')
    .replace(/\u201D/g, '"')
    .replace(/\u2022/g, '-')
    .replace(/\u2192/g, '>')
    .replace(/\u00B7/g, '\u00B7')
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

/* ── Draw helpers ── */
function drawRoundedRect(
  doc: jsPDF,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  style: 'F' | 'S' | 'FD' = 'F'
) {
  doc.roundedRect(x, y, w, h, r, r, style);
}

/* ── Main export ── */
export function generateAssessmentPdf(
  user: UserProfile,
  assessment: AssessmentResult
) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pw = doc.internal.pageSize.getWidth(); // 210
  const ph = doc.internal.pageSize.getHeight(); // 297
  const mx = 20; // margin x
  const cw = pw - mx * 2; // content width
  let y = 0;

  const dateStr = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const band = getScoreBand(assessment.score);

  const checkPageBreak = (needed: number) => {
    if (y + needed > ph - 20) {
      doc.addPage();
      y = 20;
    }
  };

  // ═══════════════════════════════════════════════
  // PAGE 1 — Cover / Summary
  // ═══════════════════════════════════════════════

  // ── Blue header block (~40% of page) ──
  const headerH = 120;
  doc.setFillColor(...DEEP_BLUE);
  doc.rect(0, 0, pw, headerH, 'F');

  // Logo text
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('Re-Rooted\u00AE', mx, 22);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(200, 200, 230);
  doc.text('SWITZERLAND', mx + 60, 22);

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.text('Relocation Complexity Score', mx, 42);

  // Meta line
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(200, 200, 230);
  const metaParts: string[] = [];
  if (user.name) metaParts.push(user.name);
  if (user.countryFrom && user.countryTo) metaParts.push(`${user.countryFrom} \u2192 ${user.countryTo}`);
  metaParts.push(dateStr);
  doc.text(metaParts.join('  \u00B7  '), mx, 52);

  // ── Score circle ──
  const circleX = mx + 28;
  const circleY = 82;
  const circleR = 18;
  doc.setDrawColor(200, 200, 230);
  doc.setLineWidth(1);
  doc.circle(circleX, circleY, circleR, 'S');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(32);
  doc.text(String(assessment.score), circleX, circleY + 2, { align: 'center' });
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(200, 200, 230);
  doc.text('out of 100', circleX, circleY + 10, { align: 'center' });

  // ── Band label pill ──
  const bandLabelX = mx + 56;
  const bandLabelY = circleY - 12;
  doc.setFillColor(200, 200, 230);
  drawRoundedRect(doc, bandLabelX, bandLabelY, 50, 8, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...DEEP_BLUE);
  doc.text(band.label, bandLabelX + 25, bandLabelY + 5.5, { align: 'center' });

  // ── Recommendation text ──
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(220, 220, 240);
  const recLines = doc.splitTextToSize(sanitize(band.recommendation), cw - 60);
  doc.text(recLines, bandLabelX, bandLabelY + 16);

  // ── PRIORITY FOCUS AREAS ──
  y = headerH + 12;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...DEEP_BLUE);
  doc.text('PRIORITY FOCUS AREAS', mx, y);
  y += 7;

  const priorities = getPriorityDimensions(assessment.score, assessment.answers);
  const colW = (cw - 4) / 2;
  const pillH = 10;
  const pillGap = 3;

  priorities.forEach((dimId, i) => {
    const dim = ROOTING_IN_DIMENSIONS.find((d) => d.id === dimId);
    if (!dim) return;
    const col = i % 2;
    const row = Math.floor(i / 2);
    const px = mx + col * (colW + 4);
    const py = y + row * (pillH + pillGap);
    doc.setFillColor(...LIGHT_BG);
    drawRoundedRect(doc, px, py, colW, pillH, 3, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...DEEP_BLUE);
    doc.text(sanitize(dim.name), px + 6, py + 6.5);
  });

  const priorityRows = Math.ceil(priorities.length / 2);
  y += priorityRows * (pillH + pillGap) + 10;

  // ── COMPLEXITY BY CATEGORY (bar chart) ──
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...DEEP_BLUE);
  doc.text('COMPLEXITY BY CATEGORY', mx, y);
  y += 8;

  // Sort categories by percentage descending
  const categoryOrder = Object.keys(CATEGORY_MAXIMUMS);
  const catData = categoryOrder.map((cat) => ({
    name: cat,
    score: getCategoryScore(cat, assessment.answers),
    max: CATEGORY_MAXIMUMS[cat],
  }));
  catData.sort((a, b) => b.score / b.max - a.score / a.max);

  const barH = 5;
  const barMaxW = cw - 10;
  const barRowH = 18;

  catData.forEach((cat) => {
    checkPageBreak(barRowH);
    // Category name
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...TEXT_DARK);
    doc.text(cat.name, mx, y);
    // Score right-aligned
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...TEXT_MID);
    doc.text(`${cat.score} / ${cat.max}`, pw - mx, y, { align: 'right' });
    y += 3;

    // Background bar
    doc.setFillColor(...LIGHT_BG);
    drawRoundedRect(doc, mx, y, barMaxW, barH, 2, 'F');

    // Filled bar
    const pct = cat.max > 0 ? cat.score / cat.max : 0;
    const fillW = Math.max(barMaxW * pct, 2);
    const color = CATEGORY_BAR_COLORS[cat.name] || DEEP_BLUE;
    doc.setFillColor(...color);
    drawRoundedRect(doc, mx, y, fillW, barH, 2, 'F');

    y += barH + barRowH - barH - 3;
  });

  // ═══════════════════════════════════════════════
  // PAGE 2+ — Answer Breakdown
  // ═══════════════════════════════════════════════
  doc.addPage();

  const drawBreakdownHeader = (continued = false) => {
    doc.setFillColor(...DEEP_BLUE);
    doc.rect(0, 0, pw, 20, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Re-Rooted\u00AE', mx, 13);
    doc.setFontSize(6);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(200, 200, 230);
    doc.text('SWITZERLAND', mx + 38, 13);

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('Answer Breakdown', pw - mx, 13, { align: 'right' });

    y = 30;
    if (continued) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(...TEXT_MID);
      doc.text('Answer Breakdown (continued)', mx, y);
      y += 8;
    }
  };

  drawBreakdownHeader(false);

  let lastCategory = '';

  const checkBreakdownPageBreak = (needed: number) => {
    if (y + needed > ph - 20) {
      doc.addPage();
      drawBreakdownHeader(true);
    }
  };

  ASSESSMENT_QUESTIONS.forEach((q) => {
    const answer = assessment.answers[q.id];
    if (answer === undefined) return;

    // Category header
    if (q.category !== lastCategory) {
      checkBreakdownPageBreak(18);
      const catScore = getCategoryScore(q.category, assessment.answers);
      const catMax = CATEGORY_MAXIMUMS[q.category] ?? 0;

      // Category name in green/blue
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(...FRESH_GREEN);
      doc.text(sanitize(q.category), mx, y);

      // Score right-aligned
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(...TEXT_MID);
      doc.text(`${catScore} / ${catMax}`, pw - mx, y, { align: 'right' });

      // Underline
      y += 2;
      doc.setDrawColor(220, 220, 225);
      doc.setLineWidth(0.3);
      doc.line(mx, y, pw - mx, y);
      y += 6;
      lastCategory = q.category;
    }

    // Question text (grey)
    checkBreakdownPageBreak(14);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...TEXT_MID);
    const qLines = doc.splitTextToSize(sanitize(q.text), cw);
    doc.text(qLines, mx, y);
    y += qLines.length * 3.5 + 1.5;

    // Answer (bold black for single, pills for multi)
    if (Array.isArray(answer)) {
      const labels = resolveMultiLabels(q.id, answer);
      // Draw as inline pills
      let pillX = mx;
      const pillY = y;
      const pillPadX = 5;
      const pillPadY = 3;
      const pillFontSize = 8;
      doc.setFontSize(pillFontSize);
      doc.setFont('helvetica', 'bold');

      labels.forEach((label, li) => {
        const labelStr = sanitize(label);
        const tw = doc.getTextWidth(labelStr) + pillPadX * 2;
        const tpH = 7;
        // Wrap to next line if needed
        if (pillX + tw > pw - mx && li > 0) {
          pillX = mx;
          y += tpH + 3;
        }
        doc.setFillColor(...LIGHT_BG);
        drawRoundedRect(doc, pillX, y - 1, tw, tpH, 2, 'F');
        doc.setTextColor(...TEXT_DARK);
        doc.text(labelStr, pillX + pillPadX, y + 3.5);
        pillX += tw + 3;
      });
      y += 10;
    } else {
      const opt = q.options.find((o) => o.value === answer);
      if (opt) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(...TEXT_DARK);
        const aLines = doc.splitTextToSize(sanitize(opt.label), cw);
        doc.text(aLines, mx, y);
        y += aLines.length * 4 + 2;
      }
    }
    y += 3;
  });

  // ═══════════════════════════════════════════════
  // FOOTERS on all pages
  // ═══════════════════════════════════════════════
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    // Separator line
    doc.setDrawColor(200, 200, 205);
    doc.setLineWidth(0.3);
    doc.line(mx, ph - 14, pw - mx, ph - 14);

    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...TEXT_MID);

    if (i === totalPages) {
      doc.text('Re-Rooted\u00AE  \u00B7  The human side of relocation', mx, ph - 9);
    } else if (i === 1) {
      doc.text(`Generated by Re-Rooted\u00AE  \u00B7  ${dateStr}`, mx, ph - 9);
    } else {
      doc.text(`Generated by Re-Rooted\u00AE  \u00B7  ${dateStr}`, mx, ph - 9);
    }
    doc.text(`Page ${i} of ${totalPages}`, pw - mx, ph - 9, { align: 'right' });
  }

  doc.save(
    `Re-Rooted-Complexity-Score-${user.name?.replace(/\s+/g, '-') || 'Report'}.pdf`
  );
}
