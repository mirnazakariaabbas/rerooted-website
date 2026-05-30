import { useEffect, useLayoutEffect, useRef, useState } from "react";

/**
 * Re-Rooted Journey — winding-path timeline.
 * Self-contained: inline colors, no external CSS, no icon libraries.
 * The path snakes left↔right; as you scroll, a navy line fills the road and a
 * green traveler walks it; the Day/Week pill at screen-center pops to navy.
 */

const C = {
  blue: "#1F299C",
  green: "#3DA776",
  warm: "#FAF9F6",
  ink: "#1A1A1A",
  mute: "#5a5a5a",
  line: "rgba(31,41,156,0.14)",
  track: "#ddd8cb",
};

type Step = { when: string; title: string; body: string };

const STEPS: Step[] = [
  { when: "Day 0", title: "Candidate shortlisted",
    body: "The move is approved. Before anyone packs a box, we start the conversation — aligning expectations, context and goals with the candidate and their sponsor." },
  { when: "Day 1", title: "Assignment complexity evaluation",
    body: "A structured baseline across 8 dimensions — family, culture, role, language, timeline — so both the individual and the employer know what they're underwriting." },
  { when: "Week 1", title: "Personal needs assessment",
    body: "A confidential deep-dive with the relocating professional. Surfaces hidden blockers and defines the success measures for the next 12 weeks." },
  { when: "Weeks 2–14", title: "Active coaching",
    body: "Six 1:1 sessions across three months. Real-time work on the things that actually determine whether the move takes root: identity, relationships, performance, belonging." },
  { when: "Week 15", title: "Final assessment",
    body: "A closing read against the Week-1 baseline. What shifted, what held, what's next. Delivered as a written report — yours to keep, yours to share." },
  { when: "Post-program", title: "Ongoing support",
    body: "Quarterly check-ins for the first year. Because the roots take longer than 90 days to deepen — and we stay with them." },
];

export default function ReRootedJourney() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const pathGeoRef = useRef<SVGPathElement | null>(null);
  const progRef = useRef<SVGPathElement | null>(null);
  const markerRef = useRef<HTMLDivElement | null>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pillRefs = useRef<(HTMLDivElement | null)[]>([]);
  const titleRefs = useRef<(HTMLHeadingElement | null)[]>([]);
  const bodyRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const [W, setW] = useState(0);

  // measure available width (drives the winding geometry)
  useLayoutEffect(() => {
    const measure = () => { if (wrapRef.current) setW(wrapRef.current.clientWidth); };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const N = STEPS.length;
  const mobile = W > 0 && W < 760;
  const padTop = 110;
  const stepGap = mobile ? 200 : 248;
  const totalH = padTop * 2 + stepGap * (N - 1);
  const cx = W / 2;
  const ampX = Math.min(W * 0.2, 230);

  // node positions: winding left/right (desktop) or a left rail (mobile)
  const pos: { x: number; y: number }[] = [];
  for (let i = 0; i < N; i++) {
    const y = padTop + i * stepGap;
    const x = mobile ? 30 : cx + (i % 2 === 0 ? -ampX : ampX);
    pos.push({ x, y });
  }

  // smooth S-curve path through the nodes
  let d = "";
  if (W > 0) {
    d = `M ${pos[0].x} ${pos[0].y}`;
    for (let i = 1; i < N; i++) {
      const a = pos[i - 1], b = pos[i], midY = (a.y + b.y) / 2;
      d += ` C ${a.x} ${midY}, ${b.x} ${midY}, ${b.x} ${b.y}`;
    }
  }

  // scroll-driven traveler + progress fill + active pill (all imperative/inline)
  useEffect(() => {
    if (!W) return;
    const geo = pathGeoRef.current;
    const total = geo ? geo.getTotalLength() : 0;
    if (progRef.current) {
      progRef.current.style.strokeDasharray = String(total);
      progRef.current.style.strokeDashoffset = String(total);
    }
    const update = () => {
      const wrap = wrapRef.current;
      if (!wrap || !geo) return;
      const vh = window.innerHeight;
      const r = wrap.getBoundingClientRect();
      const center = vh * 0.5;
      // path point level with screen-center (y is monotonic → binary search)
      const desiredY = Math.max(0, Math.min(totalH, center - r.top));
      let lo = 0, hi = total, L = 0;
      for (let k = 0; k < 22; k++) {
        const mid = (lo + hi) / 2;
        const py = geo.getPointAtLength(mid).y;
        if (py < desiredY) lo = mid; else hi = mid;
        L = mid;
      }
      const pt = geo.getPointAtLength(L);
      if (progRef.current) progRef.current.style.strokeDashoffset = String(total - L);
      if (markerRef.current)
        markerRef.current.style.transform = `translate(${pt.x}px, ${pt.y}px) translate(-50%, -50%)`;
      // active = node nearest screen-center
      let best = 0, bestD = Infinity;
      nodeRefs.current.forEach((n, i) => {
        if (!n) return;
        const nr = n.getBoundingClientRect();
        const dd = Math.abs(nr.top + nr.height / 2 - center);
        if (dd < bestD) { bestD = dd; best = i; }
      });
      for (let i = 0; i < N; i++) {
        const on = i === best;
        const pill = pillRefs.current[i];
        if (pill) {
          pill.style.padding = on ? "12px 22px" : "8px 15px";
          pill.style.fontSize = on ? "14px" : "11.5px";
          pill.style.background = on ? C.blue : C.warm;
          pill.style.color = on ? "#fff" : C.mute;
          pill.style.borderColor = on ? C.blue : C.line;
          pill.style.boxShadow = on
            ? `0 12px 28px -10px rgba(31,41,156,.55), 0 0 0 8px ${C.warm}`
            : `0 0 0 7px ${C.warm}`;
          pill.style.transform = on ? "scale(1)" : "scale(0.9)";
        }
        const t = titleRefs.current[i];
        if (t) t.style.opacity = on ? "1" : "0.4";
        const b = bodyRefs.current[i];
        if (b) b.style.opacity = on ? "1" : "0.5";
      }
    };
    const onScroll = () => update();
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => window.removeEventListener("scroll", onScroll);
  }, [W, totalH]);

  return (
    <section
      id="journey"
      style={{
        padding: "160px 0 150px",
        background: C.warm,
        color: C.ink,
        position: "relative",
        overflow: "hidden",
        fontFamily: "'DM Sans', system-ui, sans-serif",
      }}
    >
      <style>{`
        .jpill {
          display:inline-flex; align-items:center; justify-content:center;
          padding:8px 15px; border-radius:999px; white-space:nowrap;
          font-family:'DM Sans',sans-serif;
          font-size:11.5px; font-weight:600; letter-spacing:0.16em; text-transform:uppercase;
          background:${C.warm}; color:${C.mute}; border:1px solid ${C.line};
          box-shadow:0 0 0 7px ${C.warm}; transform:scale(.9);
          transition:background .35s ease,color .35s ease,border-color .35s ease,box-shadow .4s ease,transform .4s cubic-bezier(.2,.8,.3,1.2),padding .35s ease,font-size .35s ease;
        }
        .jtext { position:absolute; z-index:2; transform:translateY(-50%); }
        .jtext h4 { font-family:'DM Sans',sans-serif; font-weight:600; font-size:25px; line-height:1.12;
          letter-spacing:-0.01em; color:${C.blue}; margin:0 0 8px; transition:opacity .45s ease; }
        .jtext p { font-size:14.5px; line-height:1.6; color:#3a3a3a; transition:opacity .45s ease; }
        .jh2 { font-family:'DM Sans',sans-serif; font-weight:700; }
      `}</style>

      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 48px" }}>
        {/* Heading — single navy color, DM Sans */}
        <div style={{ textAlign: "center", maxWidth: 820, margin: "0 auto 90px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 12, fontSize: 11,
            letterSpacing: "0.24em", textTransform: "uppercase", color: C.green, fontWeight: 600, marginBottom: 20 }}>
            <span style={{ width: 28, height: 1, background: "currentColor", display: "inline-block" }} />
            The Program
          </div>
          <h2 className="jh2" style={{ fontSize: "clamp(46px, 5.4vw, 84px)", lineHeight: 1.02,
            letterSpacing: "-0.025em", color: C.blue, margin: 0 }}>
            The Re-Rooted Journey
          </h2>
          <p style={{ marginTop: 20, fontSize: 17, lineHeight: 1.6, color: C.mute, maxWidth: "58ch", marginInline: "auto" }}>
            Ninety days, six sessions, two assessments, one clear report — built as a route, not a
            retainer. Follow the path, step by step.
          </p>
        </div>

        {/* Winding journey */}
        <div ref={wrapRef} style={{ position: "relative", maxWidth: 1080, margin: "0 auto", height: totalH }}>
          {W > 0 && (
            <>
              <svg width={W} height={totalH} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
                <path d={d} fill="none" stroke={C.track} strokeWidth="3" strokeLinecap="round" strokeDasharray="1 14" />
                <path d={d} fill="none" stroke="rgba(31,41,156,0.08)" strokeWidth="10" strokeLinecap="round" />
                <path ref={progRef} d={d} fill="none" stroke={C.blue} strokeWidth="3.5" strokeLinecap="round" />
                <path ref={pathGeoRef} d={d} fill="none" stroke="none" />
              </svg>

              {/* green traveler */}
              <div ref={markerRef} style={{ position: "absolute", top: 0, left: 0, zIndex: 2,
                width: 16, height: 16, borderRadius: "50%", background: C.green,
                boxShadow: `0 0 0 5px ${C.warm}, 0 0 0 7px rgba(61,167,118,.35), 0 4px 12px rgba(0,0,0,.18)`,
                willChange: "transform" }} />

              {STEPS.map((s, i) => {
                const p = pos[i];
                const rightSide = mobile ? true : i % 2 === 1;
                const textStyle: React.CSSProperties = mobile
                  ? { left: p.x + 48, right: 8, top: p.y, textAlign: "left" }
                  : rightSide
                  ? { left: p.x + 76, width: W - p.x - 86, top: p.y, textAlign: "left" }
                  : { left: 8, width: p.x - 76 - 8, top: p.y, textAlign: "right" };
                return (
                  <div key={i}>
                    <div className="jtext" style={textStyle}>
                      <h4 ref={(el) => (titleRefs.current[i] = el)} style={{ opacity: i === 0 ? 1 : 0.4 }}>{s.title}</h4>
                      <p ref={(el) => (bodyRefs.current[i] = el)}
                        style={{ maxWidth: "42ch", marginInline: textStyle.textAlign === "right" ? "0 0 0 auto" : "0", opacity: i === 0 ? 1 : 0.5 }}>
                        {s.body}
                      </p>
                    </div>
                    <div className="jnode" ref={(el) => (nodeRefs.current[i] = el)}
                      style={{ position: "absolute", zIndex: 3, transform: "translate(-50%,-50%)", left: p.x, top: p.y }}>
                      <div className="jpill" ref={(el) => (pillRefs.current[i] = el)}>{s.when}</div>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>

        {/* Footer totals */}
        <div style={{ marginTop: 80, display: "flex", gap: 48, justifyContent: "center", flexWrap: "wrap",
          paddingTop: 38, borderTop: `1px solid ${C.line}`, maxWidth: 1080, marginInline: "auto" }}>
          {[["90", "days total"], ["6", "coaching sessions"], ["2", "assessments"], ["1", "final report"]].map(([n, l]) => (
            <div key={l} style={{ display: "flex", alignItems: "baseline", gap: 10, fontSize: 13,
              letterSpacing: "0.12em", textTransform: "uppercase", color: C.mute }}>
              <b style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 30, color: C.blue, fontWeight: 700, letterSpacing: "-0.02em" }}>{n}</b>
              {l}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
