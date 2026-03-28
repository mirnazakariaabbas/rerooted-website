

## Plan: Phases 6–11 — Content & Marketing + Community & Messaging

Six phases, each self-contained and incrementally buildable.

---

### Phase 6: Blog / Articles System

**Goal**: Admin can create, edit, and publish blog posts. Public visitors can browse articles.

- **Migration**: Create `blog_posts` table (id, title, slug, excerpt, body_html, cover_image_url, category, tags jsonb, author_id, status [draft/published], published_at, created_at, updated_at) with admin RLS for management, public SELECT for published posts
- **Admin page**: `src/pages/admin/content/BlogManagerPage.tsx` — list all posts, create/edit in a Sheet with rich text (textarea + HTML preview), publish/unpublish toggle, category/tag management
- **Public page**: `src/pages/Blog.tsx` — grid of published articles with cover image, category badge, excerpt
- **Public page**: `src/pages/BlogPost.tsx` — single article view with formatted HTML body, author, date
- **Sidebar**: Add "Blog" under Content Manager nav group
- **Routing**: `/blog`, `/blog/:slug` (public), `/app/admin/content/blog` (admin)

### Phase 7: Landing Pages & Testimonials

**Goal**: Admin can manage testimonials and a simple page content system.

- **Migration**: Create `testimonials` table (id, client_name, company, role, quote, photo_url, rating, is_featured, display_order, created_at) with admin RLS + public SELECT for featured
- **Migration**: Create `page_content` table (id, page_key, section_key, title, body, image_url, updated_at, updated_by) with admin RLS + public SELECT — key-value CMS for editable page sections
- **Admin page**: `src/pages/admin/content/TestimonialsPage.tsx` — CRUD testimonials, drag-to-reorder, toggle featured
- **Admin page**: `src/pages/admin/content/PageContentPage.tsx` — edit homepage sections (Hero headline, About text, CTA text) stored in page_content table
- **Public**: Update `src/components/Hero.tsx`, `src/components/AboutSection.tsx` etc. to optionally pull from page_content table (fallback to hardcoded)
- **Public**: Add testimonials carousel to marketing site
- **Sidebar**: Add "Testimonials" and "Page Content" under Content Manager

### Phase 8: In-App Messaging (Member ↔ Coach)

**Goal**: Direct messaging between members and their assigned coaches, visible to admins.

- **Migration**: Create `messages` table (id, sender_id, recipient_id, content, is_read, created_at) with RLS (users read/write own messages, coaches read messages from assigned coachees, admins read all). Enable realtime.
- **Component**: `src/components/messaging/ChatWindow.tsx` — message list + input, auto-scroll, read receipts
- **Member page**: `src/pages/member/MessagesPage.tsx` — shows conversation with assigned coach
- **Coach dashboard**: Add "Messages" tab to CoachDashboard showing conversations with each coachee
- **Admin**: `src/pages/admin/content/MessagesOverviewPage.tsx` — read-only view of all conversations for compliance
- **Routing**: `/app/messages` (member), messages tab in coach dashboard, `/app/admin/content/messages` (admin)
- **Sidebar**: Add "Messages" to My App nav group; add "Messages" under Content Manager for admin

### Phase 9: Community Forum

**Goal**: Members can post discussions, reply, and connect with peers in topic-based channels.

- **Migration**: Create `forum_categories` table (id, name, slug, description, icon, display_order, created_at) — admin managed
- **Migration**: Create `forum_posts` table (id, category_id, author_id, title, body, is_pinned, created_at, updated_at) with RLS (authenticated can read all, authors can create/edit own, admins can manage all)
- **Migration**: Create `forum_replies` table (id, post_id, author_id, body, created_at) with similar RLS
- **Member page**: `src/pages/member/CommunityPage.tsx` — category list → post list → post detail with replies
- **Admin page**: `src/pages/admin/content/ForumModerationPage.tsx` — pin/delete posts, manage categories
- **Routing**: `/app/community`, `/app/community/:categorySlug`, `/app/community/post/:postId`
- **Sidebar**: Add "Community" to My App nav; "Forum Moderation" under Content Manager

### Phase 10: Announcements & Peer Groups

**Goal**: Admin broadcasts announcements; members join peer groups based on shared attributes.

- **Migration**: Create `announcements` table (id, title, body, audience [all/members/coaches], is_active, published_at, created_at, created_by) with admin RLS for management, authenticated SELECT for active
- **Migration**: Create `peer_groups` table (id, name, description, group_type [country/stage/family], auto_match_criteria jsonb, created_at) — admin managed
- **Migration**: Create `peer_group_members` table (id, group_id, user_id, joined_at) with RLS (users read own groups, admins manage all)
- **Component**: Announcements banner on MemberHome — shows latest active announcement with dismiss
- **Admin page**: `src/pages/admin/content/AnnouncementsPage.tsx` — create/edit/schedule announcements
- **Member page**: `src/pages/member/PeerGroupsPage.tsx` — browse available groups, join/leave, see members
- **Routing**: `/app/groups`, `/app/admin/content/announcements`
- **Sidebar**: Add "Groups" to My App; "Announcements" under Content Manager

### Phase 11: SEO Content Tools & Marketing Dashboard

**Goal**: Content calendar, social media post drafts, and a marketing performance overview.

- **Migration**: Create `content_calendar` table (id, title, content_type [blog/social/email/event], scheduled_date, status [planned/in-progress/published], assigned_to, notes, created_at) with admin RLS
- **Admin page**: `src/pages/admin/content/ContentCalendarPage.tsx` — calendar/kanban view of upcoming content, drag between status columns
- **Admin page**: `src/pages/admin/content/SocialDraftsPage.tsx` — AI-powered draft generator (edge function using Lovable AI) for LinkedIn/Twitter posts based on blog content
- **Edge function**: `supabase/functions/generate-social-post/index.ts` — takes blog post content, generates platform-specific social media drafts
- **Admin page**: Update EngagementAnalyticsPage to add a "Marketing" tab with content output metrics (posts published, newsletter open rates, social engagement placeholders)
- **Sidebar**: Add "Content Calendar" and "Social Drafts" under Content Manager

---

### Database Tables Summary

| Phase | Tables |
|-------|--------|
| 6 | `blog_posts` |
| 7 | `testimonials`, `page_content` |
| 8 | `messages` (realtime) |
| 9 | `forum_categories`, `forum_posts`, `forum_replies` |
| 10 | `announcements`, `peer_groups`, `peer_group_members` |
| 11 | `content_calendar` |

### Build Order

Each phase is independent. I recommend building them sequentially (6 → 7 → 8 → etc.) so we can test each before moving on. Shall I start with Phase 6?

