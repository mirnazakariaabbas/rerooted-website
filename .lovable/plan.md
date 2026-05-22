# Fix logo → audience gate, verify nav labels

## Why the logo doesn't reopen the gate

The logo handler in `StickyNav` calls `setGateOpen(true)` and navigates to `/`. But `AudienceGate` has an effect that auto-dismisses the gate whenever the URL contains a hash:

```ts
if (gateOpen && location.hash) {
  if (!audience) setAudience("organization");
  setGateOpen(false);
}
```

When the user clicks the logo from `/#journey`, the gate momentarily opens then immediately closes because `#journey` is still in the URL.

## Fix

In the logo click handler, also clear the URL hash (and the stored audience) before reopening the gate:

- Replace the current URL with `/` (no hash) using `navigate("/", { replace: true })`.
- Reset `audience` to `null` so the gate's auto-dismiss "if no audience, set organization" branch can't sneak it closed and so the next selection registers cleanly.
- Then `setGateOpen(true)` and scroll to top.

## Audience tab labels — verified

In `StickyNav` the `AudienceToggle`:

- Renders options in order `["individual", "organization"]` with labels `"INDIVIDUAL"` and `"CORPORATE"`.
- Active selection uses `(opt === "individual") === isIndividual`.
- Click handlers call `setAudience(opt)` with the matching audience value.

Mapping is correct: the **INDIVIDUAL** tab sets audience to `individual` (Individual flow), and the **CORPORATE** tab sets audience to `organization` (Corporate flow). No label change needed.

## Verification after fix

1. From `/#journey` (any audience), click the Re-Rooted logo → audience gate slides back in over a clean `/` URL.
2. From `/about` or `/services`, click the logo → routes to `/` and gate is shown.
3. From `/` with the gate already dismissed, click the logo → gate reopens and page scrolls to top.
4. Click INDIVIDUAL / CORPORATE tabs → confirm the correct homepage variant renders.

## Technical details

File: `src/components/StickyNav.tsx`, logo `<button onClick>` (around line 152).

```ts
onClick={() => {
  setAudience(null);
  if (location.pathname !== "/" || location.hash) {
    navigate("/", { replace: true });
  } else {
    window.scrollTo({ top: 0 });
  }
  setGateOpen(true);
}}
```

Pull `setAudience` from the existing `useAudience()` destructure on line 80.
