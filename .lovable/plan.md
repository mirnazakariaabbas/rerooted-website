

## Phase 4: Blog Preview + Contact CTA + Footer

### New Components

#### 1. `src/components/BlogPreview.tsx` — Section 8
- `id="insights"`, warm white bg (`#FAF9F6`)
- Headline + subline with specified typography
- 3 cards in a row (grid), each: white bg, rounded-xl, hover shadow
  - Grey placeholder image (16:9), pillar tag pill, title, excerpt, "Read more →" in Fresh Green
- "See all insights →" centered below
- Cards stagger fade-in on scroll via IntersectionObserver
- Mobile: single column stack
- **Individual version**: Same content (blog is shared), no audience branching needed here

#### 2. `src/components/ContactCTA.tsx` — Section 9
- `id="contact"`, warm white bg
- **Corporate**: headline "Start a conversation", form fields: Name, Company, Email, Phone (optional), Message. Button: "Send" in Deep Blue
- **Individual**: headline "Take the first step", form fields: Name, Email, "Where are you right now?" (dropdown with 4 journey stages), Message. Button: "Reach out" in Fresh Green, rounded-xl
- Form styling: lavender border (`#BCADD4`), green focus border (`#3DA776`)
- On submit: replace form with "Thank you. We'll be in touch soon." confirmation
- Below form: email + location line
- Reads audience from context for variant switching

#### 3. `src/components/Footer.tsx`
- Near-black bg (`#1A1A1A`), 3-column layout
- Left: white logo (`logo-white.png`) + copyright
- Center: quick nav links (audience-aware labels)
- Right: CTA text in Fresh Green + LinkedIn icon
- Below columns: audience toggle pill
- **Corporate**: "Ready to talk? Get in touch →"
- **Individual**: "Ready to talk? Reach out →"
- Mobile: stack vertically, centered

### Modified Files

#### `src/pages/CorporateHome.tsx`
- Replace placeholder `#insights` and `#contact` sections with `<BlogPreview />` and `<ContactCTA />`
- Add `<Footer />` at the end

#### `src/pages/IndividualHome.tsx`
- Same: replace placeholders with `<BlogPreview />`, `<ContactCTA />`, add `<Footer />`

### Nav anchors
- Already correct: "Insights" → `#insights`, "Contact" → `#contact` in both corporate and individual link arrays

### Files Changed

| File | Action |
|------|--------|
| `src/components/BlogPreview.tsx` | Create — 3 blog cards with stagger reveal |
| `src/components/ContactCTA.tsx` | Create — audience-aware contact form with confirmation |
| `src/components/Footer.tsx` | Create — 3-column footer with audience toggle |
| `src/pages/CorporateHome.tsx` | Replace placeholders, add Footer |
| `src/pages/IndividualHome.tsx` | Replace placeholders, add Footer |

