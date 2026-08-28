# Re-frame the Relocation Complexity output for employers

The assessment questions, scoring logic and score bands stay exactly as they are. Only the wording of the results screen and the PDF report changes, so the report speaks to the company (HR, global mobility, hiring manager) about the employee, instead of speaking to the person relocating.

## Voice

- The reader is the employer: "you" = the company.
- The relocating person is "the employee" (or their name when available), never "you".
- Example shift: "Targeted coaching on 2 to 3 key focus areas will help you settle faster" becomes "Plan targeted coaching on 2 to 3 focus areas; without it, expect a slower ramp-up and higher early-attrition risk."

## Priority focus areas, the two options explained

Today this block reuses the member coaching descriptions, which talk to the employee ("Aligning your core values with a new cultural context"). The plan uses a single employer-facing version per area with three short parts:

- Risk: what can go wrong for the business, for example "Feedback is misread in both directions, slowing performance conversations."
- Watch for: the early signal a manager would actually notice.
- Recommended action: what the company should put in place.

The block is renamed "Key Risk Areas". The member coaching pages keep their existing employee-facing wording, untouched.

## Score interpretation and bands

Rewrite the four interpretation paragraphs and the four band recommendation lines in employer voice, keeping the same thresholds (0-25, 26-45, 46-65, 66+) and the same band labels (Standard Support, Enhanced Support, Intensive Support, High-Touch Program). Each interpretation names the business consequence (ramp-up time, retention risk, assignment failure risk) alongside the recommended support level.

## PDF report re-frame

- Title: "Relocation Risk Assessment".
- Sub-line: "Relocation Complexity Score" retained as the metric name under the title.
- Meta block: Employee / Candidate name, route (from -> to), assessment date, and "Prepared for" (organisation) when the profile has one; the line is omitted when it does not.
- Page 1 sections renamed: "Key Risk Areas" and "Complexity by Category" (unchanged chart logic).
- Answer breakdown pages keep their structure; header becomes "Relocation Risk Assessment - Answer Breakdown".
- Add a one-line footer note that the report is a planning aid based on inputs provided, not a performance evaluation of the individual.

## Results screen re-frame

- Page subtitle: "Relocation risk profile for this employee" instead of "Understand the full complexity of your relocation".
- Pre-assessment card copy re-framed as an employer running the assessment on a candidate.
- Risk-area cards show the new risk / watch-for / action copy. They stop linking into the member coaching dimension pages, since that content is written for the employee.

## Technical notes

- `src/data/assessment-questions.ts`: rewrite the strings returned by `getScoreInterpretation` and `getScoreBand`. `getPriorityDimensions`, scoring and question data unchanged.
- New `src/data/assessment-risk-areas.ts`: map each dimension id used by `getPriorityDimensions` to `{ title, risk, watchFor, action }` in employer voice. `src/data/coaching-content.ts` is not modified.
- `src/pages/member/AssessmentPage.tsx`: use the new map for the risk-area cards, update subtitle and intro copy, drop the navigate-to-dimension link.
- `src/utils/assessmentPdf.ts`: new title, meta line with prepared-for, renamed sections, risk-area block rendering title plus risk plus action, footer disclaimer.
- Organisation name is read from the existing user profile if a field exists; otherwise the prepared-for line is skipped rather than adding a new DB field.
