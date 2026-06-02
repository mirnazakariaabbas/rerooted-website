import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

/**
 * Corporate-only signature program.
 * Horizontal sticky-scroll: section pins to viewport, cards translate
 * horizontally as the user scrolls vertically. Re-pin behavior matches
 * GSAP-style pin without the dependency.
 */

const COLORS = {
  blue: "#1F299C",
  green: "#3DA776",
  warmWhite: "#FAF9F6",
  mute: "#6B6B6B",
  ink: "#1A1A1A",
};

const Ic = {
  star: (p: any) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M12 2l3 7 7 .6-5.3 4.7 1.6 7-6.3-3.8L5.7 21l1.6-7L2 9.6 9 9z" />
    </svg>
  ),
  graph: (p: any) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="6" cy="7" r="2" /><circle cx="18" cy="7" r="2" />
      <circle cx="6" cy="17" r="2" /><circle cx="18" cy="17" r="2" />
      <path d="M8 7h8M8 17h8M6 9v6M18 9v6" />
    </svg>
  ),
  list: (p: any) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M8 8h8M8 12h8M8 16h5" />
    </svg>
  ),
  sprout: (p: any) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M12 21V11" />
      <path d="M12 11c0-3 2-5 5-5-.5 3-2 5-5 5z" />
      <path d="M12 13c0-3-2-5-5-5 .5 3 2 5 5 5z" />
    </svg>
  ),
  flag: (p: any) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M5 21V4h12l-2 4 2 4H5" />
    </svg>
  ),
  check: (p: any) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M5 12l5 5L20 7" />
    </svg>
  ),
};

type Step = {
  when: string;
  title: string;
  body: string;
  icon: keyof typeof Ic;
};

const STEPS: Step[] = [
  { when: "Day 0", title: "Candidate shortlisted", body: "A closing read against the initial baseline. What shifted, what held, what's next. Delivered as a written report with measurements and focus areas.", icon: "star" },
  { when: "Day 1", title: "Assignment complexity evaluation", body: "A structured baseline across 8 dimensions: family, culture, role, language, timeline. Both the individual and the employer know what they're underwriting.", icon: "graph" },
  { when: "Week 1", title: "Personal needs assessment", body: "A confidential deep-dive with the relocating professional. Surfaces hidden blockers and defines the success measures for the next 12 weeks.", icon: "list" },
  { when: "Weeks 2-14", title: "Active coaching", body: "Six 1:1 sessions across three months. Real-time work on the things that actually determine whether the move takes root: identity, relationships, performance, belonging.", icon: "sprout" },
  { when: "Week 15", title: "Final assessment", body: "A closing read against the Week 1 baseline. What shifted, what held, what's next. Delivered as a written report, yours to keep, yours to share.", icon: "flag" },
  { when: "Post-program", title: "Ongoing support", body: "Quarterly check-ins for the first year. Because the roots take longer than 90 days to deepen, and we stay with them.", icon: "check" },
];

const IntegrationProgram = () => {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const section = sectionRef.current;
      const track = trackRef.current;
      if (!section || !track) return;
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const scrollable = section.offsetHeight - vh;
      const scrolled = Math.min(Math.max(-rect.top, 0), scrollable);
      const p = scrollable > 0 ? scrolled / scrollable : 0;
      const maxX = track.scrollWidth - window.innerWidth;
      track.style.transform = `translate3d(${-p * Math.max(maxX, 0)}px,0,0)`;
      setProgress(p);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section
      id="program"
      ref={sectionRef}
      style={{
        position: "relative",
        height: `${STEPS.length * 90}vh`,
        background: COLORS.warmWhite,
        color: COLORS.ink,
      }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Heading */}
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "80px 24px 0", width: "100%" }}>
          <div
            style={{
              fontSize: 11,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: COLORS.green,
              fontWeight: 600,
              marginBottom: 14,
            }}
          >
            The complete integration system
          </div>
          <h2
            className="font-display"
            style={{
              fontSize: "clamp(28px, 3.2vw, 56px)",
              lineHeight: 1.05,
              color: COLORS.blue,
              letterSpacing: "-0.02em",
              fontWeight: 700,
              margin: 0,
            }}
          >
            The Re-Rooted® <span style={{ color: COLORS.green }}>Journey</span>
          </h2>
          <p style={{ marginTop: 16, fontSize: 16, lineHeight: 1.6, color: COLORS.mute, maxWidth: 780 }}>
            Ninety days, six sessions, two assessments, one clear report. Scroll to walk through it.
          </p>
        </div>

        {/* Horizontal track */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", overflow: "hidden" }}>
          <div
            ref={trackRef}
            style={{
              display: "flex",
              gap: 28,
              padding: "0 10vw",
              willChange: "transform",
              transition: "transform 0.05s linear",
            }}
          >
            {STEPS.map((s, i) => {
              const IcComp = Ic[s.icon];
              return (
                <div
                  key={i}
                  style={{
                    flex: "0 0 380px",
                    background: "#fff",
                    border: `1px solid rgba(31,41,156,0.10)`,
                    borderRadius: 8,
                    padding: 32,
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                    minHeight: 420,
                  }}
                >
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: "50%",
                      background: i % 2 === 0 ? COLORS.blue : COLORS.green,
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <IcComp style={{ width: 24, height: 24 }} />
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: COLORS.green,
                      fontWeight: 700,
                    }}
                  >
                    {s.when}
                  </span>
                  <h3
                    className="font-display"
                    style={{
                      fontSize: 26,
                      lineHeight: 1.1,
                      color: COLORS.blue,
                      fontWeight: 700,
                      letterSpacing: "-0.015em",
                      margin: 0,
                    }}
                  >
                    {s.title}
                  </h3>
                  <p style={{ fontSize: 14.5, lineHeight: 1.6, color: "#3a3a3a", margin: 0 }}>
                    {s.body}
                  </p>
                  <div style={{ marginTop: "auto", fontSize: 12, color: COLORS.mute, fontWeight: 600 }}>
                    Step {String(i + 1).padStart(2, "0")} / {String(STEPS.length).padStart(2, "0")}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Progress bar + CTAs */}
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 24px 48px", width: "100%" }}>
          <div style={{ height: 3, background: "rgba(31,41,156,0.12)", borderRadius: 2, overflow: "hidden", marginBottom: 24 }}>
            <div
              style={{
                height: "100%",
                width: `${progress * 100}%`,
                background: COLORS.green,
                transition: "width 0.05s linear",
              }}
            />
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" onClick={() => navigate("/services")}>Get a program overview</Button>
            <a
              href="/#contact"
              onClick={(e) => { e.preventDefault(); navigate("/#contact"); }}
              className="text-sm font-medium text-primary hover:underline underline-offset-4"
            >
              Or start with a conversation
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntegrationProgram;
