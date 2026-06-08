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
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={sectionRef}
      id="approach"
      className="relative bg-background text-foreground"
    >
      <div className="mx-auto max-w-[1760px] px-6 pt-20 sm:px-8 md:px-10 md:pt-24 lg:px-14 lg:pt-36 xl:px-16 xl:pt-44">
        <div className="relative mb-8 grid grid-cols-1 gap-8 md:mb-10 md:grid-cols-2 md:gap-12 md:items-end">
          <h2
            className="font-display m-0 text-primary font-bold leading-[1.02] tracking-[-0.025em] text-[clamp(46px,5.4vw,84px)] text-left px-0"
          >
            A COMPLETE<br />INTEGRATION<br />SYSTEM
          </h2>
          <div className="flex flex-col gap-4 md:pb-4">
            <p className="text-primary/85 max-w-[44ch] text-sm md:text-base leading-relaxed">
              Allowing the expat to adapt faster, perform better, and stay longer in the company
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-6 pb-24 sm:px-8 md:px-10 lg:px-14 xl:px-16">
        {PILLARS.map((pillar, index) => (
          <div
            key={pillar.title}
            className="sticky mb-8 md:mb-10"
            style={{
              top: `${80 + index * 24}px`,
              zIndex: index + 1,
            }}
          >
            <article
              className="relative grid grid-cols-1 overflow-visible rounded-[28px] shadow-lg md:grid-cols-2 md:rounded-[32px]"
              style={{
                background: pillar.bg,
                color: pillar.text,
              }}
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-20 select-none"
              >
                <img
                  src="/hand-drawn-border.png"
                  alt=""
                  draggable={false}
                  className="absolute max-w-none"
                  style={{
                    left: "-26.81%",
                    top: "-48.2%",
                    width: "149.94%",
                    height: "188.11%",
                    borderRadius: "inherit",
                    mixBlendMode: "multiply",
                    opacity: 0.72,
                  }}
                />
              </span>

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
          </div>
        ))}
      </div>
    </section>
  );
}


