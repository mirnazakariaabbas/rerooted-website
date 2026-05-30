# Why nothing changed

`src/components/ReRootedJourney.tsx` was created, but neither home page imports it. Both `src/pages/CorporateHome.tsx` and `src/pages/IndividualHome.tsx` still render the old `<ExpatJourney />`, so the preview shows the previous timeline.

# Change

Replace the `ExpatJourney` usage with the new `ReRootedJourney` in both home pages.

### `src/pages/CorporateHome.tsx`
- Remove `import ExpatJourney from "@/components/ExpatJourney";`
- Add `import ReRootedJourney from "@/components/ReRootedJourney";`
- Replace `<ExpatJourney />` with `<ReRootedJourney />`

### `src/pages/IndividualHome.tsx`
- Same swap (import + JSX).

### Out of scope
- Not deleting `src/components/ExpatJourney.tsx` (in case you want to compare or revert). Say the word and I'll remove it.
- No edits to `ReRootedJourney.tsx` itself — kept verbatim as you pasted it.
