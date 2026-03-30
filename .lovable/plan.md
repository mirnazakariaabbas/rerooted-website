

## Plan: Ensure Correct Logos Throughout the Website

The uploaded images are:
- **White logo** (`ReRooted_Final_PNG_Files-02_White.png`) — for dark backgrounds
- **Blue logo** (`ReRooted_Final_PNG_Files-03_blue-2.png`) — for light/white backgrounds

### Current Logo Usage Audit

| Location | Current | Background | Correct Logo |
|----------|---------|------------|-------------|
| **Sidebar (expanded)** | Text "Re-Rooted®" | Deep Blue (#1F299C) | White logo |
| **Sidebar (collapsed)** | Text "R" | Deep Blue | White shorthand (existing `logo-shorthand-blue.png` is blue — wrong for dark bg) |
| **StickyNav** | `logo-shorthand-blue.png` | Light | ✅ Correct |
| **Audience Gate** | `logo-white.png` | Dark overlay | ✅ Correct |
| **Footer** | `logo-white.png` | Dark (#1A1A1A) | ✅ Correct |
| **Auth page** | `logo-white.png` | Deep Blue | ✅ Correct |
| **Reset Password** | `logo-white.png` | Deep Blue | ✅ Correct |
| **Member Home** | `logo-shorthand-blue.png` | Light | ✅ Correct |

### Changes

**1. Copy uploaded logos to project assets**
- Copy `ReRooted_Final_PNG_Files-02_White.png` → `src/assets/logo-wordmark-white.png`
- Copy `ReRooted_Final_PNG_Files-03_blue-2.png` → `src/assets/logo-wordmark-blue.png`

**2. Fix Sidebar — `src/components/layout/AppSidebar.tsx`**
- **Expanded state**: Replace the text "Re-Rooted®" with the white wordmark logo image (`logo-wordmark-white.png`), sized appropriately (~h-8)
- **Collapsed state**: Replace the text "R" with the existing `logo-shorthand-blue.png` but since sidebar background is Deep Blue, we need a white shorthand. Use the white wordmark scaled down, or keep "R" as text in white (it's already `text-sidebar-foreground` which is white). Since we don't have a white shorthand icon, keep the collapsed "R" text as-is — it already renders white on the dark sidebar.

**3. Update existing full-logo references to use the new uploaded versions**
- Replace `logo-white.png` usage in Audience Gate, Auth, ResetPassword, and Footer with `logo-wordmark-white.png` (the newly uploaded higher-quality version)
- Replace `logo-blue.png` (if referenced anywhere) with `logo-wordmark-blue.png`

### Files Modified
- `src/assets/logo-wordmark-white.png` (new — copied from upload)
- `src/assets/logo-wordmark-blue.png` (new — copied from upload)
- `src/components/layout/AppSidebar.tsx` — use white wordmark in sidebar header
- `src/components/AudienceGate.tsx` — update to new white logo
- `src/components/Footer.tsx` — update to new white logo
- `src/pages/Auth.tsx` — update to new white logo
- `src/pages/ResetPassword.tsx` — update to new white logo

