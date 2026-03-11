

## Re-Rooted® Website — Phase 1: Foundation

### 1. Brand System Setup
- Add **DM Sans** from Google Fonts (weights 300, 400, 600, 700, 800, 900) in `index.html`
- Update Tailwind config and CSS variables with Re-Rooted® brand colors: Deep Blue `#1F299C`, Fresh Green `#3DA776`, Lavender `#BCADD4`, Warm White `#FAF9F6`, Light Lavender `#F3F0F7`, Near Black `#1A1A1A`, Medium Grey `#6B6B6B`
- Set DM Sans as the default font family
- Install **framer-motion** for animations

### 2. Logo Assets
- Copy the uploaded white logo and blue logo into `src/assets/` for use in components

### 3. Audience Gate (Section 1)
- Full-viewport overlay with Deep Blue background, scroll locked (`overflow: hidden` on body)
- Large white logo centered, tagline "The human side of relocation" in italic DM Sans 300
- Two side-by-side outline buttons: "I'm an organization" / "I'm an individual"
- Hover effect: buttons fill white, text turns blue, preview text appears below each
- "Not sure? Start here →" link below in white at 60% opacity
- **Load animation**: logo fades in → tagline fades in → buttons rise up (staggered with Framer Motion)
- On click: store audience choice in state, gate slides up and off-screen, body scroll unlocked
- Mobile: buttons stack vertically

### 4. Corporate Hero (Section 2)
- Full-viewport section, Warm White background
- 60/40 split: text left, stock photo placeholder right
- Headline in DM Sans 900 (~56px): two lines that fade in sequentially
- Supporting copy in DM Sans 400 (~18px)
- Two CTAs: primary filled button + secondary text link
- **Scroll parallax**: hero image shifts upward slightly on scroll using Framer Motion's `useScroll`/`useTransform`
- Mobile: stacks vertically (text above image)

### 5. Sticky Navigation
- Hidden initially, appears after scrolling past the hero section
- Slim bar with Warm White background + subtle shadow
- Left: blue Re-Rooted® logo (small)
- Center/right: nav links — "The Program" | "The Journey" | "About" | "Insights" | "Contact" (anchor links, sections not yet built)
- Far right: "For Organizations" toggle pill (visual only for now)
- Mobile: hamburger menu with slide-out drawer
- Uses Framer Motion for smooth appear/disappear

### 6. Page Structure
- Single `Index.tsx` page with the gate as a conditional overlay and all sections below
- Gate state management via React state
- Audience choice stored in React context (for future individual vs. corporate content switching)

