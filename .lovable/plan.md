

## Plan: Fix Conditional Logic for Q17 and Q18

The issue is clear: Q17 and Q18 currently show when Q15 answer is value 8 ("Relocating alone — partner and/or family staying in home country"), but they should NOT appear in this scenario since the partner is staying behind.

### Change

**`src/data/assessment-questions.ts`** — Update conditional values for Q17 and Q18

- Q17: Change `conditional.values` from `[3, 7, 8]` to `[3, 7]` (remove 8)
- Q18: Change `conditional.values` from `[3, 7, 8]` to `[3, 7]` (remove 8)

Q16 is already correct (values `[7, 9]`) and doesn't need changes.

### Verification

After fix:
- "Solo — no partner or dependents" (value 4) → Q16: No, Q17: No, Q18: No
- "With partner, no children" (value 3) → Q16: No, Q17: Yes, Q18: Yes
- "With partner and children" (value 7) → Q16: Yes, Q17: Yes, Q18: Yes
- "Single parent with children" (value 9) → Q16: Yes, Q17: No, Q18: No
- "Relocating alone — partner/family staying in home country" (value 8) → Q16: No, Q17: No, Q18: No

No database changes required.

