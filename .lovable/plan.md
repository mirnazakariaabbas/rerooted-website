

## Plan: Fix Priority Focus Areas to Match Spec

The 28 questions, scoring formula, bands, and conditional logic are already correctly implemented. The only issue is that the **Priority Focus Areas** use dimension IDs that either don't exist or have wrong display names compared to the spec.

### What's wrong

The spec requires these exact focus area names:
- Values Harmonization ✓ (exists)
- Cultural Adaptation ✓ (exists)
- Emotional Wellbeing ✗ (code uses `emotional-cup` → displays "Filling the Emotional Cup")
- Leadership in Transition ✗ (code references `leadership-transition` which doesn't exist in dimensions array, so it renders nothing)
- Language Confidence ✗ (code uses `language-learning` → displays "Language Learning")
- Social Integration ✗ (code uses `social-life` → displays "Building a Social Life")
- Family Support ✗ (code references `family-support` which doesn't exist, renders nothing)
- Third Culture Kids ✓ (exists)

### Changes

**1. `src/data/coaching-content.ts`** — Add missing dimensions, update names
- Add `leadership-transition` dimension: "Leadership in Transition" with icon, description, prompts, tips
- Add `family-support` dimension: "Family Support" with icon, description, prompts, tips
- Rename `emotional-cup` → keep ID but change `name` to "Emotional Wellbeing"
- Rename `language-learning` → keep ID but change `name` to "Language Confidence"
- Rename `social-life` → keep ID but change `name` to "Social Integration"

**2. No other files need changes** — the assessment questions, scoring, and UI are already correct.

### Technical details
- The `getPriorityDimensions()` function returns IDs that get looked up in `ROOTING_IN_DIMENSIONS` for display. Missing IDs silently render nothing. Adding the missing entries and fixing names resolves all gaps.
- No database changes needed.

