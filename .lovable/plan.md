

## Plan: Universal Cultural Comparisons with Caching

### Summary
Replace the hardcoded `CULTURAL_COMPARISONS` dataset with an AI-generated, database-cached comparison system. Any country pair worldwide will work. The existing `cultural-tips` edge function stays as-is (random tips). A new edge function handles the Culture Map comparison with DB caching.

### 1. Database Migration
Create `cultural_comparisons` table:
```sql
CREATE TABLE public.cultural_comparisons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  country_a text NOT NULL,
  country_b text NOT NULL,
  comparison_data jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (country_a, country_b)
);
ALTER TABLE public.cultural_comparisons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read comparisons" ON public.cultural_comparisons FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Service role can insert" ON public.cultural_comparisons FOR INSERT TO authenticated WITH CHECK (true);
```

### 2. New Edge Function: `cultural-comparison`
**File: `supabase/functions/cultural-comparison/index.ts`**

- Accepts `{ countryA, countryB }` — alphabetically sorts the pair for consistent caching
- Queries `cultural_comparisons` table using Supabase service role client
- If cached: returns `comparison_data` immediately
- If not cached: calls Lovable AI Gateway with the Culture Map prompt from the request, using tool calling for structured output
- Saves result to DB, returns to client
- Handles 429/402 errors

### 3. Update Country List
**File: `src/data/countries.ts`**

Expand to full 195 UN-recognized countries, sorted alphabetically.

### 4. Update Frontend
**File: `src/pages/member/CulturalCompanion.tsx`**

- Remove `CULTURAL_COMPARISONS` import and static lookup
- Add new `useQuery` for `cultural-comparison` edge function (keyed on country pair)
- Map the new JSON shape (`score_a`/`score_b`, `explanation`, `tip`, `scale_low`/`scale_high`) to the existing dimension card UI
- Add `Skeleton` loading state for the comparison section while waiting
- Add attribution text below the comparison cards
- Keep the AI Tips section unchanged

### Technical Details

**Edge function prompt** uses the exact Culture Map framework prompt from the request. Structured output via tool calling ensures valid JSON every time.

**Caching strategy**: Countries are alphabetically sorted as `(country_a, country_b)` key. The frontend sends them in display order but the edge function normalizes. The response includes a flag indicating which is `a` and which is `b` so scores map correctly.

**Files modified:**
- `src/data/countries.ts` — expand to 195 countries
- `src/pages/member/CulturalCompanion.tsx` — dynamic comparison via edge function
- `supabase/functions/cultural-comparison/index.ts` — new edge function
- 1 database migration — `cultural_comparisons` table

**No changes to:** `cultural-tips` edge function, UI layout/design, other pages.

