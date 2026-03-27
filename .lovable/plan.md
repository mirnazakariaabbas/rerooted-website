

## Plan: Align /app Pages with Website Look and Feel

### Current Gap
The marketing site (/) uses: Warm White `bg-background` (#FAF9F6), DM Sans with bold serif-like headings (font-weight 900), no card shadows, clean flat sections, generous padding (px-6 lg:px-12, py-20+), `container mx-auto` layout, framer-motion animations, and the brand color palette (Deep Blue, Fresh Green, Lavender). 

The app (/app/*) uses: lavender card backgrounds (`bg-card` = purple-ish), visible shadows (`shadow-sm`, `shadow-md`), cramped `max-w-lg` mobile-only layout, no entrance animations, and a bottom nav that feels disconnected from the website's visual language.

### Design Principles to Apply
- Remove card shadows (brand avoids drop shadows)
- Use `bg-background` (Warm White) as page base, use subtle `bg-muted` or light tinted backgrounds for card sections instead of `bg-card` with shadows
- Increase spacing — more generous padding/margins matching the website
- Add subtle framer-motion entrance animations on page load
- Use `font-black` or `font-extrabold` for page headings like the website
- Widen layout from `max-w-lg` to `max-w-2xl` on larger screens
- Style the BottomNav to feel more integrated (Warm White background, cleaner borders)

### Files to Modify

1. **`src/components/layout/MemberLayout.tsx`** — Wrap Outlet in a container with proper spacing/max-width consistent with the website's `container mx-auto` approach.

2. **`src/components/layout/BottomNav.tsx`** — Change `bg-card` to `bg-background`, soften border color, increase height slightly, use brand typography weight for labels.

3. **`src/pages/member/MemberHome.tsx`** — 
   - Change `max-w-lg` to `max-w-2xl`
   - Remove `shadow-sm`/`shadow-md` from all Cards, use `border border-border` or `bg-muted` instead
   - Change heading to `font-extrabold` or `font-black`
   - Add framer-motion fade-in on page sections
   - Increase section spacing (mb-6 → mb-8/mb-10)
   - Replace `bg-primary/5` tinted card with `bg-muted` flat style

4. **`src/pages/member/CoachPage.tsx`** — Same pattern: widen, remove shadows, flat cards, motion entrance, bolder heading.

5. **`src/pages/member/CulturalCompanion.tsx`** — Same pattern.

6. **`src/pages/member/AssessmentPage.tsx`** — Same pattern.

7. **`src/pages/member/ProfilePage.tsx`** — Same pattern.

8. **`src/pages/admin/AdminDashboard.tsx`** — Widen layout, remove shadows, align heading weight.

9. **`src/components/home/DimensionDetail.tsx`** — Same pattern: remove shadows, flat cards, widen.

10. **`src/components/onboarding/OnboardingFlow.tsx`** + step components — Add motion animations, align spacing.

### Specific Style Changes (Applied Consistently)

```text
BEFORE                          AFTER
─────────────────────────────   ─────────────────────────────
max-w-lg                        max-w-2xl
shadow-sm / shadow-md           (removed, use border-border)
bg-card                         bg-muted or bg-background
bg-primary/5                    bg-muted
text-2xl font-serif             text-3xl font-black tracking-tight
px-5 pt-6                       px-6 pt-8 lg:px-12
mb-6                            mb-8 or mb-10
BottomNav bg-card               bg-background/95 backdrop-blur
```

### Motion Additions
Each page wraps its content in a `motion.div` with `initial={{ opacity: 0, y: 20 }}` `animate={{ opacity: 1, y: 0 }}` matching the website's entrance pattern.

### Result
The member app will feel like a natural extension of the marketing website — same typography weight, color usage, spacing rhythm, flat card style, and subtle animations.

