/**
 * Pure helpers for the adaptive sticky navigation.
 *
 * - `solid` turns on once the page has scrolled more than 40px.
 * - `onDark` turns on while any element with [data-dark="1"] is crossing
 *   the viewport top threshold (default 70px).
 *
 * Kept pure so the behavior is unit-testable without mounting the nav.
 */

export const SOLID_SCROLL_THRESHOLD = 40;
export const DARK_TOP_THRESHOLD = 70;

export function isSolid(scrollY: number): boolean {
  return scrollY > SOLID_SCROLL_THRESHOLD;
}

export function isOnDark(
  rects: Array<{ top: number; bottom: number }>,
  threshold: number = DARK_TOP_THRESHOLD,
): boolean {
  for (const r of rects) {
    if (r.top <= threshold && r.bottom > threshold) return true;
  }
  return false;
}

export function computeNavState(
  scrollY: number,
  darkRects: Array<{ top: number; bottom: number }>,
): { solid: boolean; onDark: boolean } {
  return { solid: isSolid(scrollY), onDark: isOnDark(darkRects) };
}
