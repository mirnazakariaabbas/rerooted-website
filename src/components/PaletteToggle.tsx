import { useEffect, useState } from "react";

type Palette = "alpine" | "original";
const STORAGE_KEY = "re-rooted-palette";

function applyPalette(p: Palette) {
  const root = document.documentElement;
  root.classList.toggle("theme-original", p === "original");
}

export function usePalette() {
  const [palette, setPalette] = useState<Palette>(() => {
    if (typeof window === "undefined") return "alpine";
    return (localStorage.getItem(STORAGE_KEY) as Palette) || "alpine";
  });

  useEffect(() => {
    applyPalette(palette);
    localStorage.setItem(STORAGE_KEY, palette);
  }, [palette]);

  return { palette, setPalette };
}

const PaletteToggle = () => {
  const { palette, setPalette } = usePalette();
  const isAlpine = palette === "alpine";

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex items-center gap-1 rounded-full border border-border bg-card/90 p-1 text-xs font-medium shadow-none backdrop-blur">
      <button
        type="button"
        onClick={() => setPalette("alpine")}
        className={`rounded-full px-3 py-1.5 transition-colors ${
          isAlpine ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
        }`}
        aria-pressed={isAlpine}
      >
        Alpine
      </button>
      <button
        type="button"
        onClick={() => setPalette("original")}
        className={`rounded-full px-3 py-1.5 transition-colors ${
          !isAlpine ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
        }`}
        aria-pressed={!isAlpine}
      >
        Original
      </button>
    </div>
  );
};

export default PaletteToggle;
