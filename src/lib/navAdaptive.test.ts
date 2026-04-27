import { describe, it, expect } from "vitest";
import { computeNavState, DARK_TOP_THRESHOLD } from "./navAdaptive";

describe("adaptive nav state", () => {
  it("is transparent at the top of the page", () => {
    expect(computeNavState(0, [])).toEqual({ solid: false, onDark: false });
  });

  it("stays transparent at exactly 40px", () => {
    expect(computeNavState(40, []).solid).toBe(false);
  });

  it("turns solid once scrolled past 40px", () => {
    expect(computeNavState(41, []).solid).toBe(true);
  });

  it("activates on-blue while a dark section crosses the 70px threshold", () => {
    const crossing = [{ top: DARK_TOP_THRESHOLD - 10, bottom: DARK_TOP_THRESHOLD + 200 }];
    expect(computeNavState(500, crossing)).toEqual({ solid: true, onDark: true });
  });

  it("deactivates on-blue when the dark section is fully above the threshold", () => {
    const above = [{ top: -500, bottom: -10 }];
    expect(computeNavState(500, above).onDark).toBe(false);
  });

  it("deactivates on-blue when the dark section is fully below the threshold", () => {
    const below = [{ top: 200, bottom: 800 }];
    expect(computeNavState(500, below).onDark).toBe(false);
  });

  it("supports multiple dark sections, any crossing activates on-blue", () => {
    const rects = [
      { top: -100, bottom: -10 },
      { top: 50, bottom: 400 },
    ];
    expect(computeNavState(100, rects).onDark).toBe(true);
  });
});
