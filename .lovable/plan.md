# Sync Substack articles into the Insights section

Pull articles (title, excerpt, cover image, link, date) directly from Yasser's Substack RSS feed (`https://yasserabbas.substack.com/feed`) and display them in the **Insights from the journey** section, plus the `/blog` page. No manual copy/paste needed; new Substack posts appear automatically.

## How it will work

```text
Substack RSS feed
        │
        ▼
 Edge function: sync-substack  ──► blog_posts table (Lovable Cloud)
        │                                │
   (runs on demand                       ▼
    + scheduled daily)         BlogPreview + /blog pages
```

- The edge function fetches the RSS XML, parses each item (title, link, pubDate, description/content, first image), and upserts into the existing `blog_posts` table using the Substack URL slug as the unique key.
- Cover image is extracted from the `<enclosure>` tag or the first `<img>` in the content.
- Existing `BlogPreview.tsx` already reads from `blog_posts` (or will be wired to), so cards refresh automatically.
- Clicking an article opens the original Substack post in a new tab (cleanest, preserves Yasser's analytics + comments). Optional alternative below.

## Changes

### 1. Database
- Add columns to `blog_posts` if missing: `source` (text, e.g. `'substack'`), `source_url` (text, unique), `external_url` (text — the public Substack link).
- Add unique index on `source_url` so re-syncing updates instead of duplicating.

### 2. Edge function: `sync-substack`
- Fetches `https://yasserabbas.substack.com/feed`.
- Parses XML (using `fast-xml-parser` via esm.sh).
- For each item: extract title, slug from URL, excerpt (first ~200 chars of description, stripped of HTML), cover image, published date, full HTML body.
- Upserts into `blog_posts` with `status = 'published'`, `source = 'substack'`.
- Returns count of new + updated posts.
- Public (no JWT required) so it can be triggered from the admin UI and from a scheduled cron.

### 3. Admin trigger
- In `BlogManagerPage.tsx`, add a **"Sync from Substack"** button next to "New Post" that calls the edge function and shows a toast with the result.

### 4. Scheduled sync (optional, recommended)
- Add a daily cron via `pg_cron` that calls the edge function automatically so new Substack posts appear without manual action.

### 5. Frontend
- `BlogPreview.tsx`: ensure it queries `blog_posts` (latest 3 published) and renders the cover image, category, title, excerpt.
- Card click → if `external_url` is set, open in new tab; otherwise route to `/blog/:slug`.
- `/blog` page: same behaviour.

## Decision needed

When a visitor clicks an article card, where should it go?

**Option A (recommended):** Open the original Substack article in a new tab. Keeps Yasser's subscriber funnel, comments, and analytics intact. Zero risk of broken formatting.

**Option B:** Render the article inside the site at `/blog/:slug` using the HTML pulled from the feed. Keeps users on-site but may have minor formatting/image-hosting quirks, and Substack-only features (subscribe box, comments) are lost.

I'll default to **Option A** unless you tell me otherwise.

## Out of scope
- Importing Substack subscribers / paid tiers.
- Two-way sync (writing from the site back to Substack).
