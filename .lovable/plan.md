

## Plan: Phase 4 — Intelligence, Notifications, Global Search, Dark Mode, Onboarding Tooltips

This is the final phase. Six features, built as independent modules.

---

### 1. SEO Analytics Page

**File: `src/pages/admin/intelligence/SeoAnalyticsPage.tsx`** — Replace placeholder route.

- Overall SEO Health Score gauge (0-100, color-coded circular indicator) with mock data
- Breakdown badges: Technical, Content, On-Page, Backlinks, Performance
- Traffic & Visibility row: Organic Sessions, Impressions, CTR, Average Position (sparkline charts via Recharts)
- Keyword Intelligence: Top 10 ranking keywords table + quick-win opportunities table
- Technical SEO: Core Web Vitals (LCP, INP, CLS) as pass/fail badges, mobile-friendliness, HTTPS, sitemap, robots.txt
- Content & On-Page: missing meta descriptions, H1 tags, duplicate titles, alt text counts
- Backlinks: referring domains, new/lost this month, Domain Authority
- Recommendations panel: prioritized list with Impact/Effort badges, "Mark Done" checkbox
- Benchmark comparison table vs industry averages
- Google Search Console connect button (UI scaffold only — shows "Sample Data" banner when not connected)
- All data is realistic mock data labeled as demo

### 2. Competitive Analysis Page

**File: `src/pages/admin/intelligence/CompetitiveAnalysisPage.tsx`** — Replace placeholder route.

**Edge function: `supabase/functions/analyze-competitor/index.ts`** — Calls Lovable AI Gateway to generate SWOT, threats, and recommendations from a competitor's website URL.

- Left panel (~30%): tracked competitors list with name, website, last analysis date. "+ Add Competitor" button
- Right panel (~70%): selected competitor's analysis with 4 tabs:
  - **SWOT**: 2x2 grid (Strengths/green, Weaknesses/red, Opportunities/blue, Threats/orange) — bullet lists
  - **Threat Analysis**: threat level indicator (High/Medium/Low), breakdown categories, AI narrative
  - **Recommendations**: numbered strategic recommendations with Priority badges
  - **Raw Intelligence**: source URLs, key facts (founding year, team size, pricing, services)
- "Run New Analysis" button triggers edge function, shows progress spinner
- Competitor Comparison Table below: side-by-side across all tracked competitors
- **Database migration**: Create `competitors` table (id, name, website, logo_url, analysis jsonb, last_analyzed_at, created_at) with admin RLS
- Store analysis results in the `analysis` jsonb column

### 3. Notifications System

**Database migration**: Create `notifications` table (id, user_id, type, title, message, link, is_read, created_at) with RLS (users read own, admins manage all).

**File: `src/components/layout/NotificationsDrawer.tsx`** — Sheet component sliding from right when bell is clicked.
- Lists notifications newest-first with icon, message, timestamp, "Mark as read" action
- "Mark all as read" button at top
- Notification types: contact_form, admin_approval, coach_response, failed_login, rss_mention, member_signup, email_sent

**Update: `src/components/layout/TopBar.tsx`** — Wire bell icon to open NotificationsDrawer, show real unread count from DB via useQuery.

### 4. Global Search (Cmd+K)

**File: `src/components/layout/GlobalSearch.tsx`** — Uses shadcn CommandDialog (already imported in project).
- Searches across: contacts, members, coaches, organizations, subscribers, newsletters, rss_mentions
- Results grouped by type with type label badges
- Click result navigates to the relevant page
- Recent searches stored in localStorage

**Update: `src/components/layout/TopBar.tsx`** — Add search input trigger + Cmd+K keyboard shortcut that opens GlobalSearch dialog.

### 5. Dark Mode

**Update: `src/index.css`** — Dark theme variables already exist in `.dark` class.

**File: `src/hooks/useDarkMode.ts`** — Hook that reads/writes `dark` class on `<html>` element, persists preference in localStorage.

**Update: `src/components/layout/TopBar.tsx`** — Add Moon/Sun toggle icon in the top bar user area.

### 6. Onboarding Tooltips

**File: `src/components/onboarding/OnboardingTour.tsx`** — Lightweight guided tour component.
- Shows sequential tooltip popovers anchored to sidebar items
- Steps: "Welcome to Re-Rooted", "Your Dashboard", "User Management", "Content Manager", "System Admin"
- Next/Skip buttons, progress dots
- Triggered on first admin login (tracked via localStorage flag `onboarding-tour-complete`)
- Re-triggerable from a "?" Help button in the sidebar footer

**Update: `src/components/layout/AppSidebar.tsx`** — Add Help icon button in footer that resets tour.

**Update: `src/components/layout/MemberLayout.tsx`** — Render `<OnboardingTour />` inside the layout.

---

### Routing Updates

**Update: `src/App.tsx`** — Replace the two PlaceholderPage routes with:
- `intelligence/seo` → `<SeoAnalyticsPage />`
- `intelligence/competitors` → `<CompetitiveAnalysisPage />`

### Files Summary

| Action | File |
|--------|------|
| Create | `src/pages/admin/intelligence/SeoAnalyticsPage.tsx` |
| Create | `src/pages/admin/intelligence/CompetitiveAnalysisPage.tsx` |
| Create | `supabase/functions/analyze-competitor/index.ts` |
| Create | `src/components/layout/NotificationsDrawer.tsx` |
| Create | `src/components/layout/GlobalSearch.tsx` |
| Create | `src/hooks/useDarkMode.ts` |
| Create | `src/components/onboarding/OnboardingTour.tsx` |
| Update | `src/components/layout/TopBar.tsx` |
| Update | `src/components/layout/AppSidebar.tsx` |
| Update | `src/components/layout/MemberLayout.tsx` |
| Update | `src/App.tsx` |
| Migration | `competitors` table, `notifications` table |

