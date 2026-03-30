

## Plan: Remove Community, Peer Groups, and Search Bar

### Changes

**1. Remove Community & Peer Groups from sidebar navigation**
- **File: `src/components/layout/AppSidebar.tsx`**
  - Remove `{ path: '/app/community', ... }` and `{ path: '/app/groups', ... }` from `memberNav` array
  - Remove `{ path: '/app/admin/content/forum', ... }` from `contentNav` array (Forum Moderation is the admin side of Community)
  - Clean up unused icon imports (`MessagesSquare`, `GroupIcon`)

**2. Remove Community & Peer Groups routes**
- **File: `src/App.tsx`**
  - Remove routes: `/app/community`, `/app/groups`, `/app/admin/content/forum`
  - Remove imports: `CommunityPage`, `PeerGroupsPage`, `ForumModerationPage`

**3. Remove search bar from TopBar**
- **File: `src/components/layout/TopBar.tsx`**
  - Remove the Search button, Cmd+K shortcut listener, `searchOpen` state, and `<GlobalSearch>` component
  - Remove imports: `Search`, `GlobalSearch`

**4. No database changes** — the tables (`forum_categories`, `forum_posts`, `forum_replies`, `peer_groups`, `peer_group_members`) stay in the database but become unused. No migrations needed.

### Files Modified
- `src/components/layout/AppSidebar.tsx`
- `src/App.tsx`
- `src/components/layout/TopBar.tsx`

