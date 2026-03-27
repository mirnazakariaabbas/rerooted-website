

## Plan: Generate and Add Journey Stage Images

Generate 4 AI images using the Nano banana model, one for each journey stage, then save them to the `public/` directory and reference them in the `StageCard` component.

### Image Concepts (portrait, desaturated blue soft light, professional but human)

1. **Pre-Rooted** — A person looking out a window with a suitcase nearby, soft blue-toned light filtering through. Contemplative, preparing for a journey.
2. **Re-Rooted / Rooting In** — A person walking through a new city street, discovering their surroundings. Warm but desaturated blue tones, sense of arrival.
3. **Thriving / Thrive** — A person laughing with others at a café or community gathering. Connection and belonging, soft blue ambient light.
4. **Rooting Back** — A person standing at a crossroads or bridge, looking back with purpose. Reflective mood, desaturated blue palette.

All images: portrait-oriented feel within 16:10 crop, desaturated blue soft light, modern and clean, professional but approachable.

### Implementation

1. **Generate 4 images** via `ai.gateway.lovable.dev` using `google/gemini-2.5-flash-image` with detailed prompts specifying the desaturated blue soft light aesthetic
2. **Save to** `public/journey-1.png` through `public/journey-4.png`
3. **Update `StageCard`** in `src/components/ExpatJourney.tsx`: replace the grey placeholder div with an `<img>` tag referencing the corresponding image, keeping the same `aspectRatio: "16 / 10"` container with `object-cover`

### Files Changed

| File | Change |
|------|--------|
| `public/journey-1.png` | Create — Pre-Rooted stage image |
| `public/journey-2.png` | Create — Re-Rooted stage image |
| `public/journey-3.png` | Create — Thriving stage image |
| `public/journey-4.png` | Create — Rooting Back stage image |
| `src/components/ExpatJourney.tsx` | Add image paths array, replace placeholder with `<img>` in StageCard |

