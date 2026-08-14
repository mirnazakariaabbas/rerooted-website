# Plan: Connect Project to GitHub for Code Extraction & Hosting

## Goal
Extract the full project codebase and make it available on GitHub, so you can host it anywhere (Vercel, Netlify, your own infrastructure) and optionally keep it in sync with Lovable.

## Approach: Lovable's Two-Way GitHub Sync
This is the recommended path. It creates a GitHub repository with your full project code and keeps it in sync automatically going forward.

### Steps

1. **Connect to GitHub**
   - In the Lovable editor, open the Plus (+) menu in the chat input (bottom left)
   - Select **GitHub → Connect project**
   - Authorize the Lovable GitHub App on GitHub
   - Choose the GitHub account/organization where the repo will live
   - Click **Create Repository** to generate the repo with your code

2. **Verify the sync**
   - Confirm the repo now contains the full codebase (frontend + any Supabase Edge Functions)
   - All future edits in Lovable auto-push to GitHub; edits pushed to GitHub auto-sync back

3. **Hosting (optional, your choice)**
   - The repo uses standard open-source tech (React, Vite, Tailwind, TypeScript) and can be deployed anywhere
   - Common options: Vercel, Netlify, Cloudflare Pages, or your own server
   - Environment variables (Supabase URL/keys, etc.) must be configured in your hosting environment separately
   - Database data is **not** in the repo — export it separately via Cloud → Advanced settings → Export data if needed

### Notes
- Only one GitHub account can be connected to a Lovable account at a time
- Lovable cannot import an existing repo directly — it creates a new one
- The code is standard open-source and portable; you can stop using Lovable and continue development purely from GitHub
