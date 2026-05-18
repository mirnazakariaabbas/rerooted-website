# Member App Home Redesign

Refresh the look and feel of the in-app Home screen so it feels handcrafted, warm, and on-brand, while keeping every existing feature working.

## What changes

### 1. Hero / greeting block
- Replace the deep blue curved header with a soft warm cream block ("Hello, Mirna!" style from the screenshot).
- Headline goes very large, navy, bold DM Sans 900: `Hello, {name}!`
- Subhead becomes warmer: "It's good to see you back. Take what you need from today." (stage info moves into the "Where You Are" card).
- Add subtle blurred Deep Blue + Fresh Green blob decorations on the right for life, no gradients on the surface itself.

### 2. New two-column row directly under hero
A 2/3 + 1/3 layout that stacks to one column on mobile:

- Left, "Where You Are" card (warm cream, rounded 3xl, no shadow): small pin icon, navy headline with the action verb in bold, supporting line in muted navy. Pulls from current `STAGE_DESCRIPTIONS`.
- Right, new "Daily Quote" card (Fresh Green background, white text): eyebrow "DAILY QUOTE", a short italic quote, and a coach mini-row (avatar initials + next session time) with an "Open" pill button that routes to `/app/coach`. Quote rotates daily from a small new constant `DAILY_QUOTES` in `src/data/coaching-content.ts`.

### 3. Weekly Reflection block, redesigned
Match the screenshot: Deep Blue card, split 40/60:
- Left, eyebrow "THIS WEEK'S PROMPT", large italic prompt (kept in DM Sans italic, not a serif), small status row "Refreshes Sunday  Week N of Month".
- Right, large white textarea with light placeholder.
- Bottom: "Share with my coach" checkbox + "Save to journal" pill on the right.

### 4. My Journal section, redesigned
- Card title in DM Sans 900 navy: "Whenever you want to write." with eyebrow "MY JOURNAL" and a "See all ->" link on the right (opens existing dialog).
- Replace the single tile with a 2-column grid of the latest 4 entries.
- Each entry card: warm cream background, navy text, date eyebrow top-left, a colored category pill top-right.
- Category pills map to the user's **Priority Focus Areas from the assessment** (`getPriorityDimensions(score, answers)` against `ROOTING_IN_DIMENSIONS`). Each dimension gets a soft pastel pill color derived from existing tokens (primary/secondary/accent variants). Default to "Daily Life" when no dimension is tagged. Sharing/favorite stays; existing dialog stays for full list.

### 5. Calendar ("Your Month") refresh
Keep all behavior (past-day rounded pill highlight, ringed event days, popover details, two event types). Update only the surface:
- Card sits on a warm cream surface instead of muted purple.
- Past-day pill becomes a soft Deep Blue tint with rounded ends (already close, just lighten).
- Event rings keep the existing primary / secondary / split conic-gradient logic but get a slight halo to feel less flat.
- Today indicator becomes a small Fresh Green dot under the number instead of a thin ring, so empty days don't feel pixelated.
- Headers/labels gain a touch more size and weight for legibility (text-sm instead of text-[10px] for weekday labels, text-base 900 for month label).

### 6. Typography + legibility pass
- Confirm DM Sans everywhere (already set in `tailwind.config.ts`); remove any remaining `font-serif` usages on this page so prompts use DM Sans italic.
- Bump base text sizes on Home: small labels from text-xs to text-sm, body from text-sm to text-base.
- Strengthen muted-foreground contrast for this page by using `text-foreground/70` instead of `text-muted-foreground` on key copy.
- Action tiles keep their structure but lose the all-cap "MY APP" eyebrow being so faint; eyebrow goes Fresh Green (per existing eyebrow rule).

## What stays the same
- All data hooks (assessments, bookings, coaching notes, reflections, dimension progress).
- All routing destinations from the action tiles.
- The journal dialog, edit/delete/share/favorite flows.
- The calendar's event sources, popover, and legend semantics.
- Brand tokens: Deep Blue #1F299C, Fresh Green #3DA776, Warm White #FAF9F6. No gradients, no drop shadows. DM Sans only.

## Technical notes
- Files touched:
  - `src/pages/member/MemberHome.tsx` (hero, new two-column row, Daily Quote card, journal grid, typography pass).
  - `src/components/home/MiniCalendar.tsx` (surface, today dot, label sizing; logic untouched).
  - `src/data/coaching-content.ts` (add `DAILY_QUOTES` array + tiny helper to pick by day-of-year).
- New helper inside `MemberHome.tsx`: `getDimensionPillStyle(dimensionId)` returning a Tailwind class set per dimension id, sourced from existing semantic tokens (e.g. `bg-secondary/15 text-secondary-foreground`, `bg-primary/10 text-primary`, `bg-accent/40 text-accent-foreground`).
- For journal cards: use `reflections.slice(0, 4)`; tag each with the most relevant priority dimension by simple keyword match on prompt/response, falling back to the first priority dimension from `getPriorityDimensions`.
- No backend, no schema, no RLS changes.
