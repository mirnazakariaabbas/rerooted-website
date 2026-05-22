import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import rootsIcon from "@/assets/roots-icon.png";
import offeringCoach from "@/assets/offering-coach.png";
import offeringApp from "@/assets/offering-app.png";
import offeringAssessments from "@/assets/offering-assessments.jpg";
import logoWordmarkBlue from "@/assets/logo-wordmark-blue.png";
import heroTreeCropped from "@/assets/hero-tree-cropped.png";
import swigglyArrowSection3 from "@/assets/swiggly-arrow-section-3.png";

export function WhyReRootedStatement() {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLElement>(null);
  const [transitionPhase, setTransitionPhase] = useState<"idle" | "bounce" | "slide">("idle");
  const triggeredRef = useRef(false);
  const lockedRef = useRef(false);

  const handleCta = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    if (href.startsWith("#")) {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate(href);
    }
  };

  // Trap the first downward scroll: bounce twice, then horizontally slide to #problem
  useEffect(() => {
    const runTransition = () => {
      if (triggeredRef.current || lockedRef.current) return;
      triggeredRef.current = true;
      lockedRef.current = true;

      // Lock page scroll during the choreography
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      setTransitionPhase("slide");
      window.setTimeout(() => {
        const target = document.getElementById("problem");
        if (target) {
          target.scrollIntoView({ behavior: "auto", block: "start" });
        }
        setTransitionPhase("idle");
        document.body.style.overflow = prevOverflow;
        lockedRef.current = false;
      }, 780);
    };


    const onWheel = (e: WheelEvent) => {
      if (triggeredRef.current) return;
      if (window.scrollY > 10) return;
      if (e.deltaY <= 0) return;
      e.preventDefault();
      runTransition();
    };

    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0]?.clientY ?? 0;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (triggeredRef.current) return;
      if (window.scrollY > 10) return;
      const y = e.touches[0]?.clientY ?? 0;
      if (touchStartY - y > 12) {
        e.preventDefault();
        runTransition();
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, []);

  const slideStyle: React.CSSProperties =
    transitionPhase === "slide"
      ? {
          transform: "translateX(-100vw)",
          transition: "transform 750ms cubic-bezier(0.7, 0, 0.2, 1)",
        }
      : transitionPhase === "bounce"
      ? {
          animation: "rr-bounce-stuck 1.1s cubic-bezier(0.4, 0, 0.2, 1) both",
        }
      : {};

  return (
    <section
      ref={sectionRef}
      id="why-rerooted"
      data-dark="1"
      className="relative overflow-hidden"
      style={{
        background: "#FAF9F6",
        minHeight: "calc(100vh - 84px)",
        ...slideStyle,
      }}
    >
      <style>{`
        @keyframes rr-bounce-stuck {
          0%   { transform: translateY(0); }
          25%  { transform: translateY(-18px); }
          50%  { transform: translateY(0); }
          75%  { transform: translateY(-12px); }
          100% { transform: translateY(0); }
        }
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
          opacity: transitionPhase === "idle" ? 1 : 0,
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
  },
  {
    eyebrow: "App",
    title: "The Re-Rooted® app",
    body: "Everything an expat needs to know, a pocket local guide.\nCompare cultures and cost of living from home to destination, connect with other expats on the ground, work through total-move checklists, and much more, all in one place.",
    image: offeringApp,
    bg: "hsl(var(--secondary))",
    text: "hsl(var(--secondary-foreground))",
    tile: "hsl(var(--secondary-foreground) / 0.1)",
  },
  {
    eyebrow: "Assessment",
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
      <div className="relative mx-auto max-w-[1760px] px-6 pb-16 pt-4 sm:px-8 md:px-10 md:pb-20 md:pt-6 lg:px-14 lg:pb-24 lg:pt-8 xl:px-16 xl:pt-10">




        <div className="mb-8 flex flex-col gap-4 md:mb-10">

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
            A COMPLETE INTEGRATION{" "}
            <span style={{ position: "relative", display: "inline-block" }}>
              <img
                src={swigglyArrowSection3}
                alt=""
                aria-hidden="true"
                draggable={false}
                className="hidden md:block select-none pointer-events-none"
                style={{
                  position: "absolute",
                  top: "-0.9em",
                  right: "100%",
                  marginRight: "0.2em",
                  width: "5.5em",
                  height: "auto",
                  zIndex: 5,
                }}
              />
              SYSTEM
            </span>
          </h2>
          <p className="text-primary/85 max-w-[44ch] text-base md:text-lg leading-relaxed">
            Allowing the expat to adapt faster, perform better, and stay longer in the company
          </p>
        </div>

        {/* Topic pills */}
        <div className="mb-6 flex flex-wrap gap-3 md:mb-8">
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
            className="-mx-6 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth px-6 pb-4 sm:-mx-8 sm:gap-4 sm:px-8 md:-mx-10 md:px-10 lg:-mx-14 lg:gap-5 lg:px-14 xl:-mx-16 xl:px-16 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]"
          >
            {PILLARS.map((pillar) => (
              <article
                key={pillar.title}
                className="grid w-[70%] shrink-0 snap-start grid-cols-1 overflow-hidden rounded-[28px] md:grid-cols-2 md:rounded-[32px]"
                style={{ background: pillar.bg, color: pillar.text }}
              >
              <div
                className="flex items-center justify-center p-3 md:p-5 lg:p-6"
                style={{ minHeight: "clamp(280px, 32vw, 460px)" }}
              >
                <img
                  src={pillar.image}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  className="h-full max-h-[480px] w-auto max-w-full object-contain"
                />
              </div>

              <div className="flex flex-col justify-center gap-4 p-6 md:p-8 lg:p-10">
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

