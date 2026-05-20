# Drag the tree to position it

Right now positioning the tree requires opening the preview with `?tree=1` in the URL and using sliders, which is confusing. Let me replace that with a direct drag interaction so you can just grab the tree and move it where you want.

## How it will work

1. Open the homepage like normal (no special URL needed).
2. A small **"Edit tree position"** button appears in the bottom-right corner of the screen (only visible to you in the Lovable preview, never to real visitors).
3. Click it. The tree gets a dashed outline and becomes draggable.
4. **Drag** the tree to move it.
5. **Resize** it using a handle in the bottom-right corner of the tree.
6. A small readout shows the current position and size live.
7. Click **"Save & lock in"** when you're happy. The values are written into the code so the tree stays exactly there for every visitor on every screen size.
8. Click **"Reset"** to go back to the current position if you want to start over.

## What you'll do

- Tell me "ready" and I'll build it.
- Open the preview, click **Edit tree position**, drag/resize until it looks right.
- Click **Save & lock in**, then tell me "done" — I'll bake those exact values into the hero so they're permanent.

## Technical notes

- Edit mode is gated on the Lovable preview origin (`*.lovable.app` / `*.lovableproject.com`) so it never shows on the published site.
- Position and size persist in `localStorage` while you experiment, so refreshes don't lose your work.
- On "Save & lock in", the chosen `top` / `right` / `width` values get printed in a copy-ready block; I then hardcode them into `WhyReRootedStatement` and remove the editor entirely.
- Responsive behavior: you position it once at desktop size, and I'll derive proportional values for tablet/mobile from that baseline.
