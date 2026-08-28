# Tiered recommendations for the Relocation Risk Assessment

Today the output recommends a "Re-Rooted® coaching program" in the two highest bands, and the two lower bands recommend nothing branded at all. The ask: rename the program, always recommend the Companion App, and only escalate to a support program as complexity rises.

## New recommendation ladder

| Band | Score | Always | Escalation |
|---|---|---|---|
| Standard Support | 0-25 | Re-Rooted® Companion App | None. Standard package plus light-touch check-ins. |
| Enhanced Support | 26-45 | Companion App | Re-Rooted® Support Program targeted at the 2-3 risk areas below. |
| Intensive Support | 46-65 | Companion App | Re-Rooted® Support Program across the flagged dimensions. |
| High-Touch Program | 66+ | Companion App | Re-Rooted® Expanded Support Program, plus a timeline and expectations review before the start date. |

Family add-on: when the answers show a partner and/or children relocating (the same signal that already triggers the Family Support risk area), append a Family Support Program line to bands 2-4. In band 1 it stays a mention only, not a recommendation, so the low-complexity result still reads as "you probably don't need us beyond the app".

Naming: every "coaching program" reference in the assessment output becomes "integration program" / "Support Program". The member coaching content elsewhere in the app is untouched.

## Where it shows up

- Results screen: the band pill keeps its label; the recommendation line below it becomes the tiered text, with the family line rendered underneath when it applies.
- Score interpretation paragraph: reworded so bands 3 and 4 name the Support / Expanded Support Program instead of the coaching program, and every band mentions the Companion App as the baseline.
- PDF report: the recommendation block under the score circle renders the same tiered text plus the family line, wrapping across lines as needed.

## Technical notes

- `src/data/assessment-questions.ts`: rewrite the four `getScoreInterpretation` strings and `getScoreBand` recommendations. Add a `getRecommendation(score, answers)` helper returning `{ baseline, program?, family? }` so the UI and PDF share one source of truth. The family flag reuses the existing q15/q16 checks from `getPriorityDimensions`.
- `src/pages/member/AssessmentPage.tsx`: replace the single `band.recommendation` paragraph with the structured lines from the new helper.
- `src/utils/assessmentPdf.ts`: feed the same helper output into the recommendation text under the score circle, keeping the existing line-splitting and page-break handling.
- No changes to questions, scoring, bands or the risk-area content.
