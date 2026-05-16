# Settling-In Checklist + Homepage Calendar

Two new features for the member app: a personalized, phased Settling-In Checklist with its own onboarding flow, and a compact monthly calendar embedded in the homepage "Where You Are" card.

## Feature 1: Settling-In Checklist

### Navigation & entry points
- Add `/app/settling-in` route in `src/App.tsx`.
- Add `Settling-In Checklist` item to sidebar (`AppSidebar.tsx`), directly below Cultural Companion, using `ClipboardCheck` icon.
- Add an `ActionTile` on `MemberHome.tsx` in the "My App" section, after Cultural Companion, tone `accent`.

### Database (new migration)
Three tables, all with RLS so users only see their own rows:
- `checklist_preferences` — one row per user: priorities (text[]), feeling, onboarding_complete.
- `checklist_items` — generated items per user: phase, category, title, description, completion state, sort order, audience flags (family/partner/solo/country-specific).
- `calendar_events` — user-scheduled events linked optionally to a checklist item: title, date, time, type (checklist/coaching/custom).

### Onboarding flow (shown first visit when `onboarding_complete = false`)
4 gentle screens with framer-motion fade + slide-up:
1. Welcome — "Let's build your settling-in guide".
2. Priorities — 5 pill options (multi-select 2–3). "Helping my family settle" only shows when user has children or non-solo family setup.
3. Feeling — 4 full-width card options.
4. Confirmation — "Your guide is ready". On click: save preferences, generate items via edge function, mark onboarding complete.

### Generating items
- Call new edge function `settling-checklist` with `{ countryTo, familySetup, hasChildren, priorities }`.
- Function uses Lovable AI (same pattern as `cultural-tips`) to produce country-specific items, returns JSON array.
- Insert returned items into `checklist_items`; filter audience flags against user profile; lower sort_order for items matching selected priorities.
- Fallback to a hardcoded generic set if AI call fails.

### Checklist page (`SettlingInChecklist.tsx`)
- Uses existing `<PageHeader>` ("Settling In" / "Your personal guide to making this place home") and the standard `max-w-2xl` overlap container.
- Three phases with icons: Laying the Ground (Sprout), Tending the Garden (Leaf), Starting to Bloom (Flower2).
- One phase expanded at a time; others collapsed as `bg-muted rounded-3xl` summaries. Default expanded phase chosen by months since arrival (<1 mo → P1, 1–3 mo → P2, >3 mo → P3).
- Each item row: circular checkbox, title, optional description, calendar icon button to schedule (opens date picker → inserts into `calendar_events`).
- Completed items: line-through, 60% opacity, stay visible (no disappearance).

### Reward + transitions (no progress bars, no due dates, no warnings)
- On check-off: inline encouraging message fades in (300ms) and auto-fades after 3s. Random pick from rotating pool, avoiding last 5 (tracked in local state).
- When all items in a phase complete: inline celebration card (not a modal) with phase-specific copy and a button to continue to the next phase. Phase 3 completion offers a "Share with my coach" button that creates a shared reflection summary.

### Edge function `supabase/functions/settling-checklist/index.ts`
- Same structure as `cultural-tips`: CORS, Lovable AI call (`google/gemini-2.5-flash`), JSON parse, error handling, hardcoded fallback.

### Tone & style rules
- No due dates, no overdue states, no red/orange/warning colors, no push notifications, no percentage counters.
- Conversational copy, Manrope, semantic tokens only, `rounded-3xl border-0` cards, `text-xs uppercase tracking-[0.18em] font-bold` section labels.

## Feature 2: Homepage MiniCalendar

### Placement
- Inside the existing "Where You Are" card on `MemberHome.tsx`, BELOW the stage description. Do not change existing content.
- Add section label "Your Month" above the calendar.

### `MiniCalendar` component (`src/components/home/MiniCalendar.tsx`)
- Built with plain Tailwind grid; no external calendar library.
- Header: ChevronLeft / Month Year / ChevronRight.
- 7-column day-name row (Mon–Sun).
- Day grid with ~36×36 cells. Today gets `ring-1 ring-primary/30 rounded-full`. Out-of-month days dimmed.
- Event dots below day numbers: primary blue for coaching, secondary green for checklist events. Two dots if both exist on a day.

### Data
- React Query for the visible month:
  - `meeting_bookings` rows in month, `status != 'cancelled'`.
  - `calendar_events` rows in month.
- For tapped day with events: framer-motion slide-down detail panel listing each event as a small card (deep-blue left border for coaching with coach name + time from joined `coaches`, green left border for checklist with title + time). Tapping same day or another day collapses/switches. Days without events are not tappable.

### Restrictions
- No "Add event" button, no times in the grid view, no external library, no modification of the stage description text or card chrome.

## Technical notes

- Frontend: React + TS + Vite, Tailwind semantic tokens, shadcn/ui, framer-motion, lucide-react, React Query.
- Backend: Supabase migration with RLS; new edge function deployed automatically.
- New files:
  - `src/pages/member/SettlingInChecklist.tsx`
  - `src/components/settling/` (onboarding screens, phase card, item row, celebration card, reward toast)
  - `src/components/home/MiniCalendar.tsx`
  - `supabase/functions/settling-checklist/index.ts`
- Edited files: `App.tsx`, `AppSidebar.tsx`, `MemberHome.tsx`.
- Migration created via supabase migration tool (separate approval step before code changes).
