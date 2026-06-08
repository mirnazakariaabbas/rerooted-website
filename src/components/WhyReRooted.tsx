import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useTransform, type MotionValue } from "framer-motion";
import { useNavigate } from "react-router-dom";
import rootsIcon from "@/assets/roots-icon.png";
import offeringCoachAsset from "@/assets/idea-tank.svg.asset.json";
const offeringCoach = offeringCoachAsset.url;
import offeringApp from "@/assets/offering-app.png";
import offeringAssessments from "@/assets/offering-assessments.jpg";
import logoWordmarkBlue from "@/assets/logo-wordmark-blue.png";
import heroTreeCropped from "@/assets/hero-tree-cropped.png";
export function WhyReRootedStatement() {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLElement>(null);

  const handleCta = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    if (href.startsWith("#")) {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate(href);
    }
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
      <style>{`
        @keyframes rr-arrow-bounce {
          0%, 100% { transform: translateY(0); opacity: 0.7; }
          50%      { transform: translateY(10px); opacity: 1; }
        }
      `}</style>

      <motion.div
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
        {/* 1. Masthead lockup */}
        <img
          src={logoWordmarkBlue}
          alt="Re-Rooted® Switzerland"
          className="block h-auto w-full select-none"
          style={{ maxWidth: 1400, position: "relative", zIndex: 1 }}
          draggable={false}
        />

        {/* 2. Centered tagline */}
        <p
          className="text-center"
          style={{
            color: "#1F299C",
            fontFamily: '"DM Sans", sans-serif',
            fontWeight: 800,
            fontSize: "clamp(17px, 1.6vw, 24px)",
            letterSpacing: "0.28em",
            marginTop: 56,
            marginBottom: 36,
            textTransform: "uppercase",
            position: "relative",
            zIndex: 1,
          }}
        >
          The Human Side of Relocation
        </p>

        {/* 3. Left-aligned editorial paragraph */}
        <p
          style={{
            color: "#1F299C",
            fontFamily: '"DM Sans", sans-serif',
            fontWeight: 400,
            fontSize: "clamp(24px, 2.7vw, 39px)",
            lineHeight: 1.16,
            letterSpacing: "-0.018em",
            maxWidth: "22ch",
            marginBottom: 40,
            textAlign: "left",
            position: "relative",
            zIndex: 1,
          }}
        >
          Global mobility is usually treated as logistics: visa, shipping, tax. But the hardest parts of moving are personal. Identity, belonging, family, balance, confidence in a new work assignment.
        </p>

        {/* 4. CTAs */}
        <div className="flex flex-wrap items-center" style={{ gap: 12, position: "relative", zIndex: 1 }}>
          <a
            href="#contact"
            onClick={handleCta("#contact")}
            className="inline-flex items-center gap-2 transition-all"
            style={{
              background: "#1F299C",
              color: "#FFFFFF",
              padding: "14px 22px",
              borderRadius: 999,
              fontFamily: '"DM Sans", sans-serif',
              fontWeight: 500,
              fontSize: 14,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#141A6B";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#1F299C";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Contact us
          </a>
        </div>

        {/* Tree hero image — locked-in position */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute aspect-[1438/1385]"
          style={{
            zIndex: 0,
            top: "271px",
            right: "2.51%",
            width: "44%",
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
        </div>
      </motion.div>

      {/* Animated scroll-down cue */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 z-[2] flex -translate-x-1/2 flex-col items-center gap-2"
        style={{
          bottom: 28,
          color: "#1F299C",
          fontFamily: '"DM Sans", sans-serif',
          opacity: 1,
          transition: "opacity 250ms ease-out",
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.24em",
            textTransform: "uppercase",
          }}
        >
          Scroll
        </span>
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ animation: "rr-arrow-bounce 1.6s ease-in-out infinite" }}
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <polyline points="6 13 12 19 18 13" />
        </svg>
      </div>
    </section>
  );
}



const PILLARS = [
  {
    eyebrow: "Coach",
    title: "A coach picked for you",
    body: "Every client is matched with a coach hand-picked for their move, holding at least a PCC accreditation and trained in the Re-Rooted® methodology and principles.",
    image: offeringCoach,
    bg: "hsl(var(--primary))",
    text: "hsl(var(--primary-foreground))",
  },
  {
    eyebrow: "App",
    title: "The Re-Rooted® app",
    body: "Everything an expat needs to know, a pocket local guide.\nCompare cultures and cost of living from home to destination, connect with other expats on the ground, work through total-move checklists, and much more, all in one place.",
    image: offeringApp,
    bg: "hsl(152 60% 55%)",
    text: "#FFFFFF",
  },
  {
    eyebrow: "Assessment",
    title: "Psychometric assessment to measure program results",
    body: "Diagnostic and outcome assessments prove the program works in a language organizations understand. Clear data, clear ROI, clear impact on performance and retention.",
    image: offeringAssessments,
    bg: "hsl(var(--accent))",
    text: "hsl(var(--accent-foreground))",
  },
];

function PillarCard({
  pillar,
  index,
  total,
  progress,
}: {
  pillar: (typeof PILLARS)[number];
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  // Each card occupies a slice of the scroll. The first card is visible from the
  // start. Subsequent cards slide up from below their slice's start point.
  const slice = 1 / total;
  const enterStart = Math.max(0, index * slice - slice * 0.6);
  const enterEnd = index * slice;

  const y = useTransform(
    progress,
    [enterStart, enterEnd],
    [index === 0 ? "0%" : "100%", "0%"]
  );

  // Cards below the active one shrink/recede slightly to expose the stack edge.
  const remaining = total - 1 - index;
  const scale = useTransform(progress, [enterEnd, 1], [1, 1 - remaining * 0.04]);
  const translateY = useTransform(progress, [enterEnd, 1], ["0px", `-${remaining * 16}px`]);

  return (
    <motion.div
      style={{
        y,
        scale,
        translateY,
        zIndex: 10 + index,
        background: pillar.bg,
        color: pillar.text,
        transformOrigin: "top center",
      }}
      className="absolute inset-0 rounded-[24px] shadow-xl overflow-hidden flex flex-col"
    >
      <div className="px-6 pt-6 lg:px-8 lg:pt-8">
        <span className="text-[11px] font-bold uppercase tracking-[0.22em] opacity-50">
          {pillar.eyebrow}
        </span>
      </div>
      <div className="px-6 pt-3 pb-2 lg:px-8">
        <h3
          className="font-display font-semibold leading-[1.08] tracking-[-0.02em]"
          style={{ fontSize: "clamp(1.5rem, 2.5vw, 2.25rem)" }}
        >
          {pillar.title}
        </h3>
      </div>
      <div className="px-6 pb-4 lg:px-8">
        <p
          className="max-w-[44ch] font-normal leading-[1.6] opacity-80"
          style={{ fontSize: "clamp(0.875rem, 1.1vw, 1rem)" }}
        >
          {pillar.body}
        </p>
      </div>
      <div className="flex flex-1 items-center justify-center p-4 lg:p-6 min-h-0">
        <img
          src={pillar.image}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="max-h-full w-auto max-w-full object-contain rounded-[16px]"
        />
      </div>
    </motion.div>
  );
}

export function WhyReRootedPillars() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // `progress` is the smoothed value used to drive the cards. We lerp it
  // toward `targetRef` inside a rAF loop so wheel / touch input never
  // produces stepped, jittery transforms.
  const progress = useMotionValue(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(max-width: 767px)").matches) return;

    const total = PILLARS.length;
    const STEP_PIXELS = 700;          // wheel pixels to advance one card
    const MAX_DELTA = STEP_PIXELS * (total - 1);
    const MAX_STEP_PER_EVENT = 0.18;  // clamp per-event jump (~18% of full range)
    const LERP = 0.18;                // smoothing factor toward target per frame
    const SETTLE_EPS = 0.0005;

    const targetRef = { current: 0 };
    const currentRef = { current: 0 };
    const lockedRef = { current: false };
    const lastDirRef = { current: 0 as 0 | 1 | -1 };
    let lockY = 0;
    let rafId = 0;

    const getNavH = () => {
      const nav = document.querySelector("header.adaptive-nav") as HTMLElement | null;
      return nav?.getBoundingClientRect().height ?? 96;
    };

    const setActiveFromProgress = (p: number) => {
      const idx = Math.min(total - 1, Math.max(0, Math.round(p * (total - 1))));
      setActiveIndex((prev) => (prev === idx ? prev : idx));
    };

    const tick = () => {
      const t = targetRef.current;
      const c = currentRef.current;
      const diff = t - c;
      if (Math.abs(diff) > SETTLE_EPS) {
        const next = c + diff * LERP;
        currentRef.current = next;
        progress.set(next);
        setActiveFromProgress(next);
      } else if (c !== t) {
        currentRef.current = t;
        progress.set(t);
        setActiveFromProgress(t);
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    const tryEnterLock = (direction: 1 | -1) => {
      const section = sectionRef.current;
      if (!section || lockedRef.current) return;
      const rect = section.getBoundingClientRect();
      const navH = getNavH();
      const covering = rect.top <= navH + 1 && rect.bottom >= window.innerHeight - 1;
      if (!covering) return;
      // Don't re-enter if we're already saturated in the requested direction.
      if (direction > 0 && targetRef.current >= 1) return;
      if (direction < 0 && targetRef.current <= 0) return;
      lockedRef.current = true;
      lockY = window.scrollY;
    };

    const releaseLock = (atEnd: 0 | 1) => {
      lockedRef.current = false;
      targetRef.current = atEnd;
      // Snap current to target so we don't keep animating after release.
      currentRef.current = atEnd;
      progress.set(atEnd);
      setActiveFromProgress(atEnd);
    };

    const consume = (rawDelta: number, e: Event) => {
      if (rawDelta === 0) return;
      const direction: 1 | -1 = rawDelta > 0 ? 1 : -1;
      lastDirRef.current = direction;

      if (!lockedRef.current) {
        tryEnterLock(direction);
        if (!lockedRef.current) return;
      }

      // Normalize delta into progress space, then clamp so a single big
      // wheel notch or fast touch flick can't skip multiple cards at once.
      let dp = rawDelta / MAX_DELTA;
      if (dp > MAX_STEP_PER_EVENT) dp = MAX_STEP_PER_EVENT;
      if (dp < -MAX_STEP_PER_EVENT) dp = -MAX_STEP_PER_EVENT;

      const nextTarget = targetRef.current + dp;

      // Hand control back to the page once we've fully saturated.
      if (nextTarget >= 1 && direction > 0) {
        releaseLock(1);
        return;
      }
      if (nextTarget <= 0 && direction < 0) {
        releaseLock(0);
        return;
      }

      e.preventDefault();
      targetRef.current = Math.max(0, Math.min(1, nextTarget));
      // Hold the page exactly at the lock anchor.
      if (window.scrollY !== lockY) window.scrollTo(0, lockY);
    };

    const onScroll = () => {
      if (lockedRef.current && window.scrollY !== lockY) {
        window.scrollTo(0, lockY);
      }
    };

    const onWheel = (e: WheelEvent) => {
      // Normalize across delta modes (line / page).
      let dy = e.deltaY;
      if (e.deltaMode === 1) dy *= 16;
      else if (e.deltaMode === 2) dy *= window.innerHeight;
      consume(dy, e);
    };

    let touchY = 0;
    let touchActive = false;
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      touchY = e.touches[0].clientY;
      touchActive = true;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!touchActive || e.touches.length !== 1) return;
      const y = e.touches[0].clientY;
      const dy = touchY - y;
      touchY = y;
      // Touch deltas are small per-event, amplify slightly for parity with wheel.
      consume(dy * 2.2, e);
    };
    const onTouchEnd = () => {
      touchActive = false;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("touchcancel", onTouchEnd, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [progress]);


  return (
    <section
      ref={sectionRef}
      id="approach"
      className="relative bg-background text-foreground"
      // Single viewport tall. Scroll-hijack pins it in place while progress
      // animates the cards; once progress saturates the page scroll releases.
      style={{ minHeight: "100vh" }}
    >
      {/* ── Desktop: pinned stage ── */}
      <div className="hidden md:block h-screen overflow-hidden">

        <div className="mx-auto grid h-full max-w-[1600px] grid-cols-[1fr_60px_1fr] lg:grid-cols-[1.1fr_60px_1fr]">

          {/* ── LEFT COLUMN: Title ── */}
          <div className="flex h-full flex-col justify-center px-6 lg:px-14 xl:px-16">
            <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-primary md:text-xs mb-6">
              What makes Re-Rooted® Unique
            </p>
            <h2
              className="font-display text-primary font-bold leading-[1.02] tracking-[-0.025em] mb-6"
              style={{ fontSize: "clamp(36px, 4.5vw, 72px)" }}
            >
              A COMPLETE
              <br />
              INTEGRATION
              <br />
              SYSTEM
            </h2>
            <p className="text-primary/75 max-w-[36ch] text-sm lg:text-base leading-relaxed">
              Allowing the expat to adapt faster, perform better, and stay longer in the company
            </p>
          </div>

          {/* ── CENTER: Vertical scroll indicator ── */}
          <div className="flex h-full flex-col items-center justify-center">
            <div className="relative flex flex-col items-center gap-0">
              {PILLARS.map((pillar, index) => (
                <div key={pillar.eyebrow} className="flex flex-col items-center">
                  {index > 0 && (
                    <div
                      className="w-[2px] h-12 transition-colors duration-500"
                      style={{
                        backgroundColor:
                          activeIndex >= index
                            ? "hsl(var(--primary))"
                            : "hsl(var(--primary) / 0.15)",
                      }}
                    />
                  )}
                  <div
                    className="relative flex items-center justify-center transition-all duration-500"
                    aria-label={`${pillar.eyebrow}`}
                    style={{
                      width: activeIndex === index ? 14 : 10,
                      height: activeIndex === index ? 14 : 10,
                      borderRadius: "50%",
                      backgroundColor:
                        activeIndex === index
                          ? "hsl(var(--primary))"
                          : "hsl(var(--primary) / 0.2)",
                    }}
                  />
                  {index < PILLARS.length - 1 && (
                    <div
                      className="w-[2px] h-12 transition-colors duration-500"
                      style={{
                        backgroundColor:
                          activeIndex > index
                            ? "hsl(var(--primary))"
                            : "hsl(var(--primary) / 0.15)",
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT COLUMN: Animated stacking cards ── */}
          <div className="relative h-full py-16 pr-6 lg:pr-14 xl:pr-16">
            <div className="relative h-full w-full">
              {PILLARS.map((pillar, index) => (
                <PillarCard
                  key={pillar.title}
                  pillar={pillar}
                  index={index}
                  total={PILLARS.length}
                  progress={progress}
                />
              ))}
            </div>
          </div>
        </div>
      </div>


      {/* ── Mobile: Simple vertical stack ── */}
      <div className="md:hidden px-6 py-16">
        <div className="mb-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-primary mb-4">
            What makes Re-Rooted® Unique
          </p>
          <h2
            className="font-display text-primary font-bold leading-[1.05] tracking-[-0.025em] mb-4"
            style={{ fontSize: 'clamp(32px, 8vw, 48px)' }}
          >
            A COMPLETE INTEGRATION SYSTEM
          </h2>
          <p className="text-primary/75 text-sm leading-relaxed">
            Allowing the expat to adapt faster, perform better, and stay longer in the company
          </p>
        </div>

        <div className="flex flex-col gap-6">
          {PILLARS.map((pillar) => (
            <article
              key={pillar.title}
              className="rounded-[20px] overflow-hidden shadow-lg"
              style={{ background: pillar.bg, color: pillar.text }}
            >
              <div className="p-5">
                <span className="text-[10px] font-bold uppercase tracking-[0.22em] opacity-50">
                  {pillar.eyebrow}
                </span>
                <h3 className="font-display font-semibold text-xl leading-[1.1] tracking-[-0.02em] mt-2 mb-2">
                  {pillar.title}
                </h3>
                <p className="text-sm leading-[1.6] opacity-80">
                  {pillar.body}
                </p>
              </div>
              <div className="flex items-center justify-center p-4">
                <img
                  src={pillar.image}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  className="max-h-[260px] w-auto max-w-full object-contain rounded-[12px]"
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}



