

## Plan: Make Priority Focus Areas Clickable Buttons

The Priority Focus Areas in the assessment results are currently static `div` elements. They need to become clickable buttons that navigate the user to the corresponding dimension detail view on the Member Home page.

### Current State
- MemberHome uses local state (`selectedDimension`) to show `DimensionDetail` when a dimension is clicked
- The assessment page renders focus areas as plain `div` elements with icon + name
- Both pages share `ROOTING_IN_DIMENSIONS` data with dimension IDs like `values-harmonization`, `cultural-adaptation`, etc.

### Change

**`src/pages/member/AssessmentPage.tsx`**

Replace the static `div` items in the Priority Focus Areas section with clickable buttons that use `useNavigate` to route to `/app/home?dimension={dimId}`.

- Import `useNavigate` from `react-router-dom`
- Change each focus area `div` to a `button` with an arrow icon, styled consistently with the app
- On click, navigate to `/app/home?dimension={dimId}`

**`src/pages/member/MemberHome.tsx`**

Read the `dimension` query parameter on mount. If present, auto-select that dimension to show the `DimensionDetail` view.

- Import `useSearchParams` from `react-router-dom`
- On mount, check for `?dimension=` param and set `selectedDimension` accordingly
- Clear the param from the URL after consuming it

### Result
Clicking a priority focus area from the assessment results navigates to the Member Home and opens the relevant dimension detail page.

