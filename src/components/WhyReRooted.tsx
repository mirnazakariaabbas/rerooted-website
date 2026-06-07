import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
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
    tile: "hsl(var(--primary-foreground) / 0.08)",
    borderFilter: "brightness(3) saturate(0.3)",
  },
  {
    eyebrow: "App",
    title: "The Re-Rooted® app",
    body: "Everything an expat needs to know, a pocket local guide.\nCompare cultures and cost of living from home to destination, connect with other expats on the ground, work through total-move checklists, and much more, all in one place.",
    image: offeringApp,
    bg: "hsl(152 60% 55%)",
    text: "#FFFFFF",
    tile: "rgba(255, 255, 255, 0.1)",
    borderFilter: "brightness(2.5) saturate(0.2)",
  },
  {
    eyebrow: "Assessment",
    title: "Psychometric assessment to measure program results",
    body: "Diagnostic and outcome assessments prove the program works in a language organizations understand. Clear data, clear ROI, clear impact on performance and retention.",
    image: offeringAssessments,
    bg: "hsl(var(--accent))",
    text: "hsl(var(--accent-foreground))",
    tile: "hsl(var(--accent-foreground) / 0.08)",
    borderFilter: "brightness(1.2)",
  },
];

export function WhyReRootedPillars() {
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Button/dot-driven carousel (also driven by scroll position below).
  useEffect(() => {
    const track = trackRef.current;
    if (!track || !track.parentElement) return;
    const update = () => {
      const maxX = track.scrollWidth - track.parentElement!.clientWidth;
      const p = PILLARS.length > 1 ? active / (PILLARS.length - 1) : 0;
      track.style.transform = `translate3d(${-p * Math.max(maxX, 0)}px,0,0)`;
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [active]);

  // Drive `active` from scroll position while the sticky inner is pinned.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height - vh; // scrollable distance within pin
      if (total <= 0) return;
      const progressed = Math.min(Math.max(-rect.top, 0), total);
      const p = progressed / total; // 0..1
      const idx = Math.round(p * (PILLARS.length - 1));
      setActive((prev) => (prev === idx ? prev : idx));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const goTo = (i: number) => {
    const clamped = Math.max(0, Math.min(PILLARS.length - 1, i));
    const section = sectionRef.current;
    if (section) {
      const vh = window.innerHeight;
      const total = section.offsetHeight - vh;
      const p = PILLARS.length > 1 ? clamped / (PILLARS.length - 1) : 0;
      const targetY = section.offsetTop + p * total;
      window.scrollTo({ top: targetY, behavior: "smooth" });
    } else {
      setActive(clamped);
    }
  };

  const next = () => goTo(active + 1);
  const prev = () => goTo(active - 1);

  return (
    <section
      id="approach"
      className="relative bg-background text-foreground"
    >
      <div
        ref={sectionRef}
        style={{ height: `${PILLARS.length * 100}vh` }}
        className="relative w-full"
      >
      <div
        className="sticky top-0 flex h-screen w-full flex-col overflow-hidden"
      >
        <div className="relative mx-auto w-full max-w-[1760px] flex-1 flex flex-col px-6 pb-4 pt-4 sm:px-8 md:px-10 md:pt-5 lg:px-14 xl:px-16">

        <div className="relative mb-4 flex flex-col gap-2 md:mb-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-primary md:text-xs">
            ​
          </p>
          <h2
            className="font-display m-0 text-primary font-bold leading-[1.02] tracking-[-0.025em] text-[clamp(46px,5.4vw,84px)] text-left px-0"
            style={{
              maxWidth: "22ch",
            }}
          >
            A COMPLETE INTEGRATION SYSTEM
          </h2>
          {/* Swiggly arrow pointing to topic pills */}
          <img
            src="/__l5e/assets-v1/ae3b7c9c-4521-40de-8eb9-f2885bacd7e4/swiggly-arrow-v2-cropped.png"
            alt=""
            aria-hidden="true"
            draggable={false}
            className="pointer-events-none absolute hidden select-none md:block"
            style={{
              right: "clamp(180px, 22vw, 360px)",
              top: "clamp(40px, 5vw, 80px)",
              height: "clamp(150px, 18vw, 240px)",
              width: "auto",
              zIndex: 5,
              mixBlendMode: "multiply",
            }}
          />
          <p className="text-primary/85 max-w-[44ch] text-sm md:text-base leading-relaxed">
            Allowing the expat to adapt faster, perform better, and stay longer in the company
          </p>
        </div>

        {/* Topic pills as journey line */}
        <div className="mb-2 md:mb-3" role="tablist" aria-label="Integration topics">
          <div className="relative flex items-center justify-between">
            {/* Wavy line */}
            <svg
              className="absolute left-0 right-0 top-1/2 -translate-y-1/2 w-full"
              style={{ height: "28px" }}
              viewBox="0 0 300 28"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                d="M0,14 Q37.5,2 75,14 T150,14 T225,14 T300,14"
                fill="none"
                stroke="hsl(var(--muted))"
                strokeWidth="5"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
              <path
                d="M0,14 Q37.5,2 75,14 T150,14 T225,14 T300,14"
                fill="none"
                stroke={PILLARS[active]?.bg}
                strokeWidth="5"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                style={{
                  clipPath: `inset(0 ${PILLARS.length > 1 ? (1 - active / (PILLARS.length - 1)) * 100 : 100}% 0 0)`,
                  transition: "clip-path 0.5s cubic-bezier(0.22, 1, 0.36, 1), stroke 0.4s ease",
                }}
              />
            </svg>
            {PILLARS.map((p, i) => {
              const isActive = i === active;
              const isPassed = i <= active;
              return (
                <button
                  key={p.title}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-pressed={isActive}
                  className="relative z-[1] rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-all md:px-5 md:py-2.5 md:text-sm"
                  style={{
                    background: isPassed ? p.bg : "hsl(var(--muted))",
                    color: isPassed ? p.text : "hsl(var(--foreground))",
                    transform: isActive ? "scale(1.05)" : "scale(1)",
                  }}
                >
                  {p.eyebrow}
                </button>
              );
            })}
          </div>
        </div>

        {/* Pinned horizontal track */}
        <div className="group relative flex-1 min-h-0 overflow-hidden">
            <div
              ref={trackRef}
              className="flex h-full items-stretch gap-4 lg:gap-5 will-change-transform"
              style={{ transition: "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)" }}
            >
            {PILLARS.map((pillar) => (
              <article
                key={pillar.title}
                className="relative grid h-full w-[78%] max-h-[58vh] shrink-0 grid-cols-1 overflow-visible rounded-[28px] md:grid-cols-2 md:rounded-[32px]"
                style={{ background: pillar.bg, color: pillar.text }}
              >
              <div
                className="flex items-center justify-center p-3 md:p-5 lg:p-6"
              >
                <img
                  src={pillar.image}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  className="h-full max-h-[31.5vh] w-auto max-w-[75%] object-contain rounded-2xl"
                />

              </div>

              <div className="flex flex-col justify-center gap-3 p-5 md:p-6 lg:p-8">
                <h3
                  className="font-display font-medium leading-[1.05] tracking-[-0.02em]"
                  style={{ fontSize: "clamp(1.25rem, 2vw, 2rem)" }}
                >
                  {pillar.title}
                </h3>
                <p
                  className="max-w-[44ch] font-normal leading-[1.5] opacity-90"
                  style={{ fontSize: "clamp(0.9rem, 0.95vw, 1rem)" }}
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
            className="absolute left-3 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border-2 border-primary bg-background text-primary transition-colors hover:bg-primary hover:text-primary-foreground md:flex"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next"
            className="absolute right-3 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border-2 border-primary bg-background text-primary transition-colors hover:bg-primary hover:text-primary-foreground md:flex"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
          </button>
        </div>

        {/* Dots */}
        <div className="mt-4 flex justify-center gap-2">
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
      </div>
    </section>

  );
}


