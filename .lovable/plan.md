

## Plan: Wire Frontend to Cultural Comparison Edge Function

The `cultural-comparison` edge function already exists with the exact prompt and caching logic requested. The problem is the frontend (`CulturalCompanion.tsx`) still uses the static `CULTURAL_COMPARISONS` dataset instead of calling it.

### Changes — Single File: `src/pages/member/CulturalCompanion.tsx`

1. **Remove** the `CULTURAL_COMPARISONS` import (line 6)
2. **Add a `useQuery`** that calls the `cultural-comparison` edge function with `{ countryA: homeCountry, countryB: hostCountry }`, keyed on the country pair
3. **Map the AI response shape** to the existing UI:
   - `comparison.summary` → Overview card
   - `dimension.score_a` / `score_b` → bar widths (handle the `swapped` flag from the edge function to map scores correctly)
   - `dimension.explanation` → explanation text
   - `dimension.tip` → practical tip
   - `dimension.scale_low` / `scale_high` → score labels
4. **Add Skeleton loading state** while the edge function runs (first-time generation takes 3-5s)
5. **Add attribution line** below comparison: "Cultural profiles use the Culture Map framework (Erin Meyer) as a guide. Scores are AI-assisted and intended as a practical starting point."
6. **Remove** the "No comparison data" fallback with suggested pairs — it's no longer needed since any pair works

No edge function changes needed — the existing `cultural-comparison/index.ts` already implements the exact prompt, caching, and error handling described.

