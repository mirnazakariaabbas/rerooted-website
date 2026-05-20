import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import rootsIcon from "@/assets/roots-icon.png";
import offeringCoach from "@/assets/offering-coach.png";
import offeringApp from "@/assets/offering-app.png";
import offeringAssessments from "@/assets/offering-assessments.jpg";
import logoWordmarkBlue from "@/assets/logo-wordmark-blue.png";
import heroTreeCropped from "@/assets/hero-tree-cropped.png";

const TREE_DEFAULTS = { top: 200, rightPct: 0.63, widthPct: 44 };
const TREE_STORAGE_KEY = "rerooted:treePosition:v1";

function isLovablePreviewHost() {
  if (typeof window === "undefined") return false;
  const h = window.location.hostname;
  return h.endsWith(".lovable.app") || h.endsWith(".lovableproject.com") || h === "localhost";
}

export function WhyReRootedStatement() {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLElement>(null);
  const treeRef = useRef<HTMLDivElement>(null);

  const [editorAvailable, setEditorAvailable] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [tree, setTree] = useState(TREE_DEFAULTS);

  useEffect(() => {
    setEditorAvailable(isLovablePreviewHost());
    try {
      const raw = localStorage.getItem(TREE_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") {
          setTree({
            top: Number(parsed.top ?? TREE_DEFAULTS.top),
            rightPct: Number(parsed.rightPct ?? TREE_DEFAULTS.rightPct),
            widthPct: Number(parsed.widthPct ?? TREE_DEFAULTS.widthPct),
          });
        }
      }
    } catch {}
  }, []);

  const persist = (next: typeof tree) => {
    setTree(next);
    try { localStorage.setItem(TREE_STORAGE_KEY, JSON.stringify(next)); } catch {}
  };

  const handleCta = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    if (href.startsWith("#")) {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate(href);
    }
  };

  // Drag handler
  const onTreeMouseDown = (e: React.MouseEvent) => {
    if (!editMode) return;
    if ((e.target as HTMLElement).dataset.resizeHandle) return;
    e.preventDefault();
    const container = sectionRef.current?.querySelector("[data-tree-parent]") as HTMLElement | null;
    const treeEl = treeRef.current;
    if (!container || !treeEl) return;
    const parentRect = container.getBoundingClientRect();
    const treeRect = treeEl.getBoundingClientRect();
    const startX = e.clientX;
    const startY = e.clientY;
    const startTop = tree.top;
    const startRightPx = parentRect.right - treeRect.right;

    const onMove = (ev: MouseEvent) => {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      const newTop = startTop + dy;
      const newRightPx = startRightPx - dx;
      const newRightPct = (newRightPx / parentRect.width) * 100;
      persist({ ...tree, top: newTop, rightPct: newRightPct });
    };
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const onResizeMouseDown = (e: React.MouseEvent) => {
    if (!editMode) return;
    e.preventDefault();
    e.stopPropagation();
    const container = sectionRef.current?.querySelector("[data-tree-parent]") as HTMLElement | null;
    if (!container) return;
    const parentRect = container.getBoundingClientRect();
    const startX = e.clientX;
    const startWidthPct = tree.widthPct;

    const onMove = (ev: MouseEvent) => {
      const dx = ev.clientX - startX;
      const newWidthPct = startWidthPct + (dx / parentRect.width) * 100;
      persist({ ...tree, widthPct: Math.max(10, Math.min(100, newWidthPct)) });
    };
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const copySnippet = () => {
    const snippet = `top: "${Math.round(tree.top)}px",\nright: "${tree.rightPct.toFixed(2)}%",\nwidth: "${tree.widthPct.toFixed(2)}%",`;
    try { navigator.clipboard.writeText(snippet); } catch {}
    alert("Copied tree position values to clipboard:\n\n" + snippet);
  };

  const reset = () => {
    persist(TREE_DEFAULTS);
  };

  return (
    <section
      ref={sectionRef}
      id="why-rerooted"
      data-dark="1"
      className="relative overflow-hidden"
      style={{
        background: "#FAF9F6",
        minHeight: "calc(100vh - 84px)",
      }}
    >
      <motion.div
        data-tree-parent
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto flex w-full flex-col pb-[240px] md:pb-16 lg:pb-20"
        style={{
          maxWidth: 1600,
          paddingLeft: "clamp(28px, 4vw, 56px)",
          paddingRight: "clamp(28px, 4vw, 56px)",
          paddingTop: "clamp(110px, 13vh, 160px)",
          fontFamily: '"DM Sans", sans-serif',
        }}
      >
...
        {/* Tree hero image — draggable in edit mode */}
        <div
          ref={treeRef}
          aria-hidden="true"
          onMouseDown={onTreeMouseDown}
          className={`absolute aspect-[1438/1385] ${editMode ? "cursor-move" : "pointer-events-none"}`}
          style={{
            zIndex: editMode ? 5 : 0,
            top: `${tree.top}px`,
            right: `${tree.rightPct}%`,
            width: `${tree.widthPct}%`,
            outline: editMode ? "2px dashed #1F299C" : "none",
            outlineOffset: 4,
          }}
        >
          <img
            src={heroTreeCropped}
            alt=""
            draggable={false}
            className="block h-full w-full select-none"
            style={{
              objectFit: "contain",
              objectPosition: "center bottom",
            }}
          />
          {editMode && (
            <div
              data-resize-handle="1"
              onMouseDown={onResizeMouseDown}
              className="absolute bottom-0 right-0 h-5 w-5 cursor-nwse-resize rounded-sm"
              style={{ background: "#1F299C", border: "2px solid #FAF9F6" }}
            />
          )}
        </div>
      </motion.div>

      {editorAvailable && (
        <div
          className="fixed bottom-4 right-4 z-[100] flex flex-col items-end gap-2"
          style={{ fontFamily: '"DM Sans", sans-serif' }}
        >
          {editMode && (
            <div
              className="rounded-lg px-3 py-2 text-xs"
              style={{ background: "#1F299C", color: "#FAF9F6" }}
            >
              top: {Math.round(tree.top)}px · right: {tree.rightPct.toFixed(2)}% · width: {tree.widthPct.toFixed(2)}%
            </div>
          )}
          <div className="flex gap-2">
            {editMode && (
              <>
                <button
                  type="button"
                  onClick={reset}
                  className="rounded-full px-4 py-2 text-xs font-semibold"
                  style={{ background: "#FAF9F6", color: "#1F299C", border: "1px solid #1F299C" }}
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={copySnippet}
                  className="rounded-full px-4 py-2 text-xs font-semibold"
                  style={{ background: "#3DA776", color: "#FAF9F6" }}
                >
                  Save & lock in
                </button>
              </>
            )}
            <button
              type="button"
              onClick={() => setEditMode((v) => !v)}
              className="rounded-full px-4 py-2 text-xs font-semibold"
              style={{ background: "#1F299C", color: "#FAF9F6" }}
            >
              {editMode ? "Exit edit" : "Edit tree position"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}


const PILLARS = [
  {
    eyebrow: "Coaching",
    title: "A coach picked for you",
    body: "Every client is matched with a coach hand-picked for their move, holding at least a PCC accreditation and trained in the Re-Rooted® methodology and principles.",
    image: offeringCoach,
    bg: "hsl(var(--primary))",
    text: "hsl(var(--primary-foreground))",
    tile: "hsl(var(--primary-foreground) / 0.08)",
  },
  {
    eyebrow: "The App",
    title: "The Re-Rooted® app",
    body: "Everything an expat needs to know, a pocket local guide.\nCompare cultures and cost of living from home to destination, connect with other expats on the ground, work through total-move checklists, and much more, all in one place.",
    image: offeringApp,
    bg: "hsl(var(--secondary))",
    text: "hsl(var(--secondary-foreground))",
    tile: "hsl(var(--secondary-foreground) / 0.1)",
  },
  {
    eyebrow: "Assessments",
    title: "Psychometric assessment to measure program results",
    body: "Diagnostic and outcome assessments prove the program works in a language organizations understand. Clear data, clear ROI, clear impact on performance and retention.",
    image: offeringAssessments,
    bg: "hsl(var(--accent))",
    text: "hsl(var(--accent-foreground))",
    tile: "hsl(var(--accent-foreground) / 0.08)",
  },
];

export function WhyReRootedPillars() {
  const [active, setActive] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [hasEnteredView, setHasEnteredView] = useState(false);
  const [readyToAutoplay, setReadyToAutoplay] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const goTo = (i: number) => {
    const idx = (i + PILLARS.length) % PILLARS.length;
    setActive(idx);
    const track = trackRef.current;
    if (!track) return;
    const slide = track.children[idx] as HTMLElement | undefined;
    if (slide) {
      track.scrollTo({ left: slide.offsetLeft, behavior: "smooth" });
    }
  };

  const next = () => goTo(active + 1);
  const prev = () => goTo(active - 1);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const center = track.scrollLeft + track.clientWidth / 2;
        let bestIdx = 0;
        let bestDist = Infinity;
        Array.from(track.children).forEach((el, i) => {
          const node = el as HTMLElement;
          const c = node.offsetLeft + node.offsetWidth / 2;
          const d = Math.abs(c - center);
          if (d < bestDist) {
            bestDist = d;
            bestIdx = i;
          }
        });
        setActive(bestIdx);
      });
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      track.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Detect when the section enters the viewport
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.4) {
            setHasEnteredView(true);
          }
        });
      },
      { threshold: [0, 0.4, 0.6] }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // After entering view, give the user time to read the first slide before autoplay
  useEffect(() => {
    if (!hasEnteredView) return;
    const t = window.setTimeout(() => setReadyToAutoplay(true), 6000);
    return () => window.clearTimeout(t);
  }, [hasEnteredView]);

  // Autoplay every 7 seconds, pause on hover
  useEffect(() => {
    if (isHovering || !readyToAutoplay) return;
    const id = window.setInterval(() => {
      setActive((curr) => {
        const nextIdx = (curr + 1) % PILLARS.length;
        const track = trackRef.current;
        if (track) {
          const slide = track.children[nextIdx] as HTMLElement | undefined;
          if (slide) track.scrollTo({ left: slide.offsetLeft, behavior: "smooth" });
        }
        return nextIdx;
      });
    }, 7000);
    return () => window.clearInterval(id);
  }, [isHovering, readyToAutoplay]);

  return (
    <section
      ref={sectionRef}
      id="approach"
      className="relative overflow-hidden bg-background text-foreground"
    >
      <div className="mx-auto max-w-[1760px] px-6 pb-24 pt-20 sm:px-8 md:px-10 md:pb-28 md:pt-24 lg:px-14 lg:pb-32 lg:pt-36 xl:px-16 xl:pt-44">
        <div className="mb-12 flex flex-col gap-6 md:mb-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-primary md:text-xs">
            ​
          </p>
          <h2
            className="font-display text-primary"
            style={{
              fontWeight: 500,
              fontSize: "clamp(2rem, 4.5vw, 4.5rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.022em",
              maxWidth: "22ch",
            }}
          >
            What sets Re-Rooted® apart
          </h2>
        </div>

        {/* Topic pills */}
        <div className="mb-8 flex flex-wrap gap-3 md:mb-10">
          {PILLARS.map((p, i) => {
            const isActive = i === active;
            return (
              <button
                key={p.title}
                type="button"
                onClick={() => goTo(i)}
                className="rounded-full px-5 py-2.5 text-sm font-semibold transition-colors md:px-6 md:py-3 md:text-base"
                style={{
                  background: isActive ? "hsl(var(--primary))" : "hsl(var(--muted))",
                  color: isActive
                    ? "hsl(var(--primary-foreground))"
                    : "hsl(var(--foreground))",
                }}
                aria-pressed={isActive}
              >
                <span
                  className="mr-2 inline-block h-1.5 w-1.5 rounded-full align-middle"
                  style={{
                    background: isActive
                      ? "hsl(var(--primary-foreground))"
                      : "transparent",
                  }}
                />
                {p.eyebrow}
              </button>
            );
          })}
        </div>

        {/* Carousel wrapper with hover arrows */}
        <div
          className="group relative"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div
            ref={trackRef}
            className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-6 pb-4 sm:-mx-8 sm:gap-5 sm:px-8 md:-mx-10 md:px-10 lg:-mx-14 lg:gap-6 lg:px-14 xl:-mx-16 xl:px-16 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]"
          >
            {PILLARS.map((pillar) => (
              <article
                key={pillar.title}
                className="grid w-[70%] shrink-0 snap-start grid-cols-1 overflow-hidden rounded-[28px] md:grid-cols-2 md:rounded-[32px]"
                style={{ background: pillar.bg, color: pillar.text }}
              >
              <div
                className="flex items-center justify-center p-4 md:p-6 lg:p-8"
                style={{ minHeight: "clamp(320px, 36vw, 520px)" }}
              >
                <img
                  src={pillar.image}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  className="h-full max-h-[480px] w-auto max-w-full object-contain"
                />
              </div>

              <div className="flex flex-col justify-center gap-5 p-8 md:p-12 lg:p-16">
                <p className="text-[11px] font-semibold uppercase tracking-[0.26em] opacity-80 md:text-xs">
                  {pillar.eyebrow}
                </p>
                <h3
                  className="font-display font-medium leading-[1.05] tracking-[-0.02em]"
                  style={{ fontSize: "clamp(1.75rem, 3vw, 2.75rem)" }}
                >
                  {pillar.title}
                </h3>
                <p
                  className="max-w-[44ch] font-normal leading-[1.55] opacity-90"
                  style={{ fontSize: "clamp(1rem, 1.15vw, 1.125rem)" }}
                >
                  {pillar.body}
                </p>
              </div>
            </article>
          ))}
          </div>

          {/* Hover arrows */}
          <button
            type="button"
            onClick={prev}
            aria-label="Previous"
            className="absolute left-2 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full bg-background/90 p-3 text-foreground opacity-0 transition-opacity duration-200 hover:bg-background group-hover:opacity-100 md:flex"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next"
            className="absolute right-2 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full bg-background/90 p-3 text-foreground opacity-0 transition-opacity duration-200 hover:bg-background group-hover:opacity-100 md:flex"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
          </button>
        </div>

        {/* Dots */}
        <div className="mt-6 flex justify-center gap-2">
          {PILLARS.map((p, i) => (
            <button
              key={p.title}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to ${p.eyebrow}`}
              className="h-2 rounded-full transition-all"
              style={{
                width: i === active ? 24 : 8,
                background:
                  i === active
                    ? "hsl(var(--primary))"
                    : "hsl(var(--muted-foreground) / 0.3)",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
