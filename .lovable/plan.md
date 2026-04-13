

## Plan: Rewrite Relocation Complexity Score Assessment (v2.1)

This is a complete rewrite of the assessment system — from 18 single-select questions to 28 questions (including 2 multi-select and 3 conditional), new scoring bands, and updated priority focus areas.

### Files to modify

**1. `src/data/assessment-questions.ts`** — Full rewrite
- New `AssessmentQuestion` interface adds: `type: 'single' | 'multi'`, `conditional?: { questionId: string; values: number[] }`, `multiSelectCap?: number`, `ignoreIfAlsoSelected?: string` (for Q2's "location change only" rule)
- All 28 questions defined exactly per spec across 8 categories
- Q2 and Q16 are `type: 'multi'` with `multiSelectCap: 10`
- Q16 conditional on Q15 values 7 or 9 (partner+children, single parent)
- Q17, Q18 conditional on Q15 values 3, 7, or 8 (has partner)
- `calculateDifficultyScore()` updated: handles multi-select answers (stored as arrays, summed and capped at 10), divides by fixed 280
- `getScoreInterpretation()` updated with new 4-band system (0–25 Standard, 26–45 Enhanced, 46–65 Intensive, 66–100 High-Touch) and new copy including coaching recommendations
- `getPriorityDimensions()` updated with new conditions from spec (Leadership in Transition if Q2 total ≥ 6, Language/Social if score > 45, Family if Q15 includes partner/children, Third Culture Kids if Q16 has selections)

**2. `src/types/user.ts`** — Minor update
- Change `AssessmentResult.answers` type from `Record<string, number>` to `Record<string, number | number[]>` to support multi-select answers

**3. `src/pages/member/AssessmentPage.tsx`** — Significant rewrite
- Add state for multi-select answers: `multiAnswers: Record<string, number[]>`
- Add conditional question filtering: compute visible questions based on current answers (skip Q16 if Q15 doesn't indicate children, skip Q17/Q18 if Q15 doesn't indicate partner)
- For single-select questions: keep current tap-to-advance behavior
- For multi-select questions: render checkboxes, show a "Next" button to confirm selection, apply cap-at-10 logic, implement Q2's "ignore location-change-only if others selected" rule
- Update score display bands: "Standard Support" (0–25), "Enhanced Support" (26–45), "Intensive Support" (46–65), "High-Touch Program" (66–100)
- Update progress bar to reflect visible question count (not total 28)
- Add "Next" and "Previous" navigation buttons for all questions (not just multi-select)
- Keep existing results UI (score card, priority focus areas, reflection log, retake button)

### Technical details

- **Answer storage for multi-select**: Q2 and Q16 answers stored as `number[]` in the answers record. The scoring function sums the array and caps at 10.
- **Conditional question flow**: Before advancing, filter `ASSESSMENT_QUESTIONS` to only include questions whose `conditional` field is satisfied by current answers. The progress indicator shows `currentIndex / visibleQuestions.length`.
- **Q2 special rule**: If "Location change only" (value 1) is selected alongside other options, remove it from the sum.
- **Database compatibility**: The `assessments` table stores answers as JSONB, so arrays work without schema changes. The `answers` column already accepts `Record<string, number>` — arrays are valid JSON values, so no migration needed.
- **No scoring formula change risk**: Fixed divisor of 280 (28 × 10) regardless of conditional questions being skipped — per spec, skipped questions contribute 0 to numerator while still counting in denominator.

### No database changes required.

