

## Plan: Enhance Timeline Step Visibility

### 1. Active circle scales up

Turn each circle into a `motion.div`. When `i === active`, animate to `scale: 1.3` with a spring transition. Non-active reached circles stay at `scale: 1`. The icon inside also grows from `size={24}` to `size={28}` for the active step. Add a subtle ring/glow shadow on the active circle (`shadow-lg ring-2 ring-[hsl(153,45%,45%)]/30`).

### 2. Description in a card

Replace the bare `<motion.p>` in the content area with a `<motion.div>` styled as a card:
- `bg-white rounded-xl border border-border shadow-sm px-8 py-6`
- Step name as a bold heading above the description text
- Step timing shown as a small badge/chip
- Entry animation: `y: 30, opacity: 0` → `y: 0, opacity: 1` with spring physics for a slight bounce

### Files changed

| File | Change |
|------|--------|
| `src/components/IntegrationProgram.tsx` | Scale active circle, card-style description block |

