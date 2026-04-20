import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

/**
 * The ReRooted Journey — vertical tree-timeline.
 * Corporate-only signature 6-step program. Replaces the previous horizontal
 * sticky-scroll. Keeps id="program" for the Hero "See how it works" anchor.
 */

const COLORS = {
  blue: "#1F299C",
  green: "#3DA776",
  warmWhite: "#FAF9F6",
  mute: "#6B6B6B",
  ink: "#1A1A1A",
  line: "rgba(31,41,156,0.14)",
};

/* ── inline icons ── */
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
  {
    when: "Day 0",
    title: "Candidate shortlisted",
    body: "The move is approved. Before anyone packs a box, we start the conversation, aligning expectations, context and goals with the candidate and their sponsor.",
    icon: "star",
  },
  {
    when: "Day 1",
    title: "Assignment complexity evaluation",
    body: "A structured baseline across 8 dimensions: family, culture, role, language, timeline. Both the individual and the employer know what they're underwriting.",
    icon: "graph",
  },
  {
    when: "Week 1",
    title: "Personal needs assessment",
    body: "A confidential deep-dive with the relocating professional. Surfaces hidden blockers and defines the success measures for the next 12 weeks.",
    icon: "list",
  },
  {
    when: "Weeks 2–14",
    title: "Active coaching",
    body: "Six 1:1 sessions across three months. Real-time work on the things that actually determine whether the move takes root: identity, relationships, performance, belonging.",
    icon: "sprout",
  },
  {
    when: "Week 15",
    title: "Final assessment",
    body: "A closing read against the Week 1 baseline. What shifted, what held, what's next. Delivered as a written report, yours to keep, yours to share.",
    icon: "flag",
  },
  {
    when: "Post-program",
    title: "Ongoing support",
    body: "Quarterly check-ins for the first year. Because the roots take longer than 90 days to deepen, and we stay with them.",
    icon: "check",
  },
];

const ProgramCTAs = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 mt-12">
      <Button size="lg" onClick={() => navigate("/services")}>Get a program overview</Button>
      <a
        href="/contact"
        onClick={(e) => { e.preventDefault(); navigate("/contact"); }}
        className="text-sm font-medium text-primary hover:underline underline-offset-4"
      >
        Or start with a conversation
      </a>
    </div>
  );
};

const IntegrationProgram = () => {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const spineFillRef = useRef<HTMLDivElement | null>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Scroll-linked green spine growth
  useEffect(() => {
    const onScroll = () => {
      if (!wrapRef.current || !spineFillRef.current) return;
      const r = wrapRef.current.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = r.top - vh * 0.4;
      const end = r.top + r.height - vh * 0.5;
      const p = Math.max(0, Math.min(1, -start / (end - start)));
      spineFillRef.current.style.transform = `scaleY(${p})`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Reveal each step as it enters
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).style.opacity = "1";
            (e.target as HTMLElement).style.transform = "none";
            const dot = (e.target as HTMLElement).querySelector(
              "[data-dot]"
            ) as HTMLElement | null;
            if (dot) dot.style.animation = "rrPop .6s ease both";
          }
        });
      },
      { rootMargin: "-15% 0px -15% 0px" }
    );
    stepRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section
      id="program"
      style={{
        padding: "140px 0 120px",
        position: "relative",
        background: COLORS.warmWhite,
        color: COLORS.ink,
        overflow: "hidden",
      }}
    >
      <style>{`
        @keyframes rrPop { 0% { transform: scale(0.4);} 60% { transform: scale(1.08);} 100% { transform: scale(1);} }
        @media (max-width: 720px) {
          .rr-step { grid-template-columns: 32px 1fr !important; gap: 8px 20px !important; }
          .rr-spine { left: 16px !important; }
          .rr-dot { width: 32px !important; height: 32px !important; box-shadow: 0 0 0 4px ${COLORS.warmWhite} !important; }
          .rr-dot svg { width: 14px !important; height: 14px !important; }
          .rr-node { grid-column: 1 !important; grid-row: 1 / span 2 !important; align-self: start; margin-top: 4px; }
          .rr-meta { grid-column: 2 !important; grid-row: 1 !important; text-align: left !important; align-items: flex-start !important; justify-self: start !important; max-width: none !important; }
          .rr-content { grid-column: 2 !important; grid-row: 2 !important; max-width: none !important; }
          .rr-head h2 { font-size: 44px !important; }
        }
        @media (min-width: 721px) and (max-width: 1100px) {
          .rr-step { grid-template-columns: minmax(0, 1fr) 64px minmax(0, 1fr) !important; gap: 24px !important; }
          .rr-meta { max-width: 16ch !important; }
          .rr-meta h4 { font-size: 32px !important; }
          .rr-dot { width: 56px !important; height: 56px !important; box-shadow: 0 0 0 6px ${COLORS.warmWhite} !important; }
          .rr-dot svg { width: 22px !important; height: 22px !important; }
          .rr-content { font-size: 14px !important; max-width: 34ch !important; }
        }
      `}</style>

      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 24px" }}>
        {/* Heading */}
        <div
          className="rr-head"
          style={{ textAlign: "center", maxWidth: 780, margin: "0 auto 80px" }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              fontSize: 11,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: COLORS.green,
              fontWeight: 600,
              marginBottom: 18,
            }}
          >
            <span style={{ display: "inline-block", width: 28, height: 1, background: "currentColor" }} />
            The Program
          </div>
          <h2
            style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontSize: "clamp(52px, 6vw, 96px)",
              lineHeight: 1,
              color: COLORS.blue,
              letterSpacing: "-0.02em",
              fontWeight: 400,
              margin: 0,
            }}
          >
            The ReRooted{" "}
            <em style={{ fontStyle: "italic", color: COLORS.green }}>Journey</em>
          </h2>
          <p style={{ marginTop: 22, fontSize: 17, lineHeight: 1.6, color: COLORS.mute }}>
            Ninety days, six sessions, two assessments, one clear report. Built as a route, not a retainer. Here's what happens, step by step.
          </p>
        </div>

        {/* Timeline */}
        <div
          ref={wrapRef}
          style={{ position: "relative", maxWidth: 1080, margin: "0 auto", padding: "0 24px" }}
        >
          {/* Spine */}
          <div
            className="rr-spine"
            style={{
              position: "absolute",
              left: "50%",
              top: 0,
              bottom: 0,
              width: 3,
              transform: "translateX(-50%)",
              background: `linear-gradient(180deg, transparent 0%, ${COLORS.blue} 8%, ${COLORS.blue} 92%, transparent 100%)`,
              opacity: 0.12,
            }}
          >
            <div
              ref={spineFillRef}
              style={{
                position: "absolute",
                inset: 0,
                background: COLORS.green,
                transformOrigin: "top",
                transform: "scaleY(0)",
                transition: "transform 0.3s linear",
                opacity: 1,
              }}
            />
          </div>

          {/* Steps */}
          <div style={{ display: "flex", flexDirection: "column", gap: 90 }}>
            {STEPS.map((s, i) => {
              const IcComp = Ic[s.icon];
              return (
                <div
                  key={i}
                  className="rr-step"
                  ref={(el) => (stepRefs.current[i] = el)}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 88px 1fr",
                    gap: 40,
                    alignItems: "center",
                    opacity: 0,
                    transform: "translateY(40px)",
                    transition: "opacity .7s ease, transform .7s ease",
                  }}
                >
                  {/* Meta (always left) */}
                  <div
                    className="rr-meta"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                      gridColumn: 1,
                      textAlign: "right",
                      alignItems: "flex-end",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 12,
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        color: COLORS.green,
                        fontWeight: 600,
                      }}
                    >
                      {s.when}
                    </span>
                    <h4
                      style={{
                        fontFamily: "'Instrument Serif', Georgia, serif",
                        fontSize: 42,
                        lineHeight: 1.02,
                        color: COLORS.blue,
                        fontWeight: 400,
                        letterSpacing: "-0.015em",
                        margin: 0,
                      }}
                    >
                      {s.title}
                    </h4>
                  </div>

                  {/* Dot */}
                  <div
                    className="rr-node"
                    style={{
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      order: 2,
                    }}
                  >
                    <div
                      data-dot
                      className="rr-dot"
                      style={{
                        width: 72,
                        height: 72,
                        borderRadius: "50%",
                        background: i % 2 === 0 ? COLORS.blue : COLORS.green,
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                        zIndex: 2,
                        boxShadow: `0 0 0 8px ${COLORS.warmWhite}`,
                      }}
                    >
                      <IcComp style={{ width: 30, height: 30 }} />
                    </div>
                  </div>

                  {/* Body */}
                  <div
                    className="rr-content"
                    style={{
                      fontSize: 15,
                      lineHeight: 1.6,
                      color: "#3a3a3a",
                      maxWidth: "42ch",
                      gridColumn: 3,
                      textAlign: "left",
                    }}
                  >
                    {s.body}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer totals */}
        <div
          style={{
            marginTop: 90,
            display: "flex",
            gap: 48,
            justifyContent: "center",
            flexWrap: "wrap",
            paddingTop: 36,
            borderTop: `1px solid ${COLORS.line}`,
            maxWidth: 1080,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          {[
            ["90", "days total"],
            ["6", "coaching sessions"],
            ["2", "assessments"],
            ["1", "final report"],
          ].map(([n, l]) => (
            <div
              key={l}
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 10,
                fontSize: 13,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: COLORS.mute,
              }}
            >
              <b
                style={{
                  fontFamily: "'Instrument Serif', Georgia, serif",
                  fontSize: 32,
                  color: COLORS.green,
                  fontWeight: 400,
                  letterSpacing: "-0.02em",
                }}
              >
                {n}
              </b>
              {l}
            </div>
          ))}
        </div>

        <ProgramCTAs />
      </div>
    </section>
  );
};

export default IntegrationProgram;
