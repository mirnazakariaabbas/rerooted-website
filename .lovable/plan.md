

## Plan: Reorder Cultural Companion Sections

**File: `src/pages/member/CulturalCompanion.tsx`**

Move the "AI Cultural Tips" card (currently lines 113–150) to after the Cultural Comparison section (after the dimensions list and attribution line). The new order will be:

1. Country picker bar (unchanged)
2. Overview card + dimension buckets + attribution (the comparison section, unchanged)
3. AI Cultural Tips card (moved to bottom)

Single file, no logic changes — just cut/paste the JSX block.

