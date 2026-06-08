import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform, useMotionValueEvent, type MotionValue } from "framer-motion";
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
  // Each card occupies a slice of the scroll. The first card is visible from
  // the start; subsequent cards slide up from below their slice's start point
  // and rest a bit below the card above so its eyebrow (COACH / APP /
  // ASSESSMENT) stays visible.
  // Peek leaves enough room for the eyebrow + the full title of the card
  // beneath, so every card title stays readable while stacked.
  const PEEK = 168;
  const slice = 1 / total;
  const enterStart = Math.max(0, index * slice - slice * 0.6);
  const enterEnd = index * slice;

  // All cards share the full stage height (top:0 / bottom:0) so the topmost
  // card always has room for eyebrow + title + description + image. Resting
  // stack offset is applied via translateY in px (index * PEEK) so lower
  // cards' eyebrow + title peek out above each newer card.
  const restY = index * PEEK;
  const y = useTransform(progress, [enterStart, enterEnd], (p) => {
    if (index === 0) return restY;
    const t = Math.min(1, Math.max(0, (p - enterStart) / (enterEnd - enterStart || 1)));
    // start fully below the stage, land at restY
    return `calc(100% + ${restY - 100}px * 0 + ${restY}px - (1 - ${t}) * 100%)`;
  });
  // Simpler: numeric interpolation between "below stage" and restY.
  const yNum = useTransform(
    progress,
    [enterStart, enterEnd],
    [index === 0 ? restY : 1000, restY]
  );

  return (
    <motion.div
      style={{
        y: index === 0 ? restY : yNum,
        zIndex: 10 + index,
        background: pillar.bg,
        color: pillar.text,
      }}
      className="absolute left-0 right-0 top-0 bottom-0 rounded-[24px] shadow-xl overflow-hidden flex flex-col"
    >

      <div className="px-6 pt-6 lg:px-8 lg:pt-7">
        <span className="text-[11px] font-bold uppercase tracking-[0.22em] opacity-60">
          {pillar.eyebrow}
        </span>
      </div>
      <div className="px-6 pt-2 pb-3 lg:px-8">
        <h3
          className="font-display font-bold leading-[1.05] tracking-[-0.025em]"
          style={{ fontSize: "clamp(1.75rem, 2.8vw, 2.5rem)" }}
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
  const [navH, setNavH] = useState(96);

  // Measure the sticky nav so the pinned stage parks flush against its bottom.
  useEffect(() => {
    const measure = () => {
      const nav = document.querySelector("header.adaptive-nav") as HTMLElement | null;
      setNavH(nav?.getBoundingClientRect().height ?? 96);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Native scroll drives progress through the section. The outer wrapper is
  // tall (one viewport per card) and the inner stage is `position: sticky`
  // pinned just below the nav: the browser handles the lock, so the user
  // never feels scroll fighting and there is no jitter from JS scrollTo.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Smooth the raw scroll progress with a spring so any micro-deltas from
  // trackpad inertia translate into a silky card transition.
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    mass: 0.4,
  });

  useMotionValueEvent(progress, "change", (v) => {
    const idx = Math.min(
      PILLARS.length - 1,
      Math.max(0, Math.round(v * (PILLARS.length - 1)))
    );
    setActiveIndex((prev) => (prev === idx ? prev : idx));
  });

  return (
    <section
      ref={sectionRef}
      id="approach"
      className="relative bg-background text-foreground"
      // Tall wrapper: scrolling through it pins the inner stage. Length tuned
      // so each card transition takes roughly one viewport of scroll, which
      // matches the user's natural scroll rhythm.
      style={{ height: `${PILLARS.length * 100}vh` }}
    >
      {/* ── Desktop: pinned stage ── */}
      <div
        className="hidden md:block sticky overflow-hidden"
        style={{ top: navH, height: `calc(100vh - ${navH}px)` }}
      >

        <div className="mx-auto grid h-full max-w-[1600px] grid-cols-[1fr_60px_1fr] lg:grid-cols-[1.1fr_60px_1fr]">


          {/* ── LEFT COLUMN: Title ── */}
          <div className="flex h-full flex-col justify-center px-6 lg:px-14 xl:px-16">
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



