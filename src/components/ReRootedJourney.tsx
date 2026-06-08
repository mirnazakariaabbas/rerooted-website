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
        if (t) {
          t.style.opacity = on ? "1" : "0.35";
          t.style.transform = on ? "translateY(0)" : "translateY(8px)";
          t.style.filter = on ? "blur(0)" : "blur(0.4px)";
        }
        const b = bodyRefs.current[i];
        if (b) {
          b.style.opacity = on ? "1" : "0.4";
          b.style.transform = on ? "translateY(0)" : "translateY(10px)";
          b.style.filter = on ? "blur(0)" : "blur(0.5px)";
        }
      }
    };
    const onScroll = () => update();
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => window.removeEventListener("scroll", onScroll);
  }, [W, totalH]);

  // Snap scroll: one wheel/touch gesture advances to the next stage
  useEffect(() => {
    if (!W) return;
    const wrap = wrapRef.current;
    if (!wrap) return;

    let animating = false;
    let lockUntil = 0;

    const stepTargets = () => {
      const wrapTop = wrap.getBoundingClientRect().top + window.scrollY;
      const vh = window.innerHeight;
      return pos.map((p) => wrapTop + p.y - vh / 2);
    };

    const smoothScrollTo = (y: number, duration = 600) =>
      new Promise<void>((resolve) => {
        const startY = window.scrollY;
        const dy = y - startY;
        const t0 = performance.now();
        const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
        const tick = (now: number) => {
          const p = Math.min(1, (now - t0) / duration);
          window.scrollTo(0, startY + dy * ease(p));
          if (p < 1) requestAnimationFrame(tick);
          else resolve();
        };
        requestAnimationFrame(tick);
      });

    const nearestIndex = (targets: number[]) => {
      const y = window.scrollY;
      let best = 0, bd = Infinity;
      targets.forEach((t, i) => {
        const d = Math.abs(t - y);
        if (d < bd) { bd = d; best = i; }
      });
      return best;
    };

    const sectionInView = () => {
      const r = wrap.getBoundingClientRect();
      const vh = window.innerHeight;
      return r.top < vh * 0.5 && r.bottom > vh * 0.5;
    };

    const handleWheel = (e: WheelEvent) => {
      if (!sectionInView()) return;
      if (animating || performance.now() < lockUntil) {
        e.preventDefault();
        return;
      }
      const dir = e.deltaY > 0 ? 1 : e.deltaY < 0 ? -1 : 0;
      if (!dir) return;
      const targets = stepTargets();
      const idx = nearestIndex(targets);
      const next = idx + dir;
      if (next < 0 || next >= targets.length) return; // let page scroll past
      e.preventDefault();
      animating = true;
      smoothScrollTo(targets[next]).then(() => {
        animating = false;
        lockUntil = performance.now() + 250;
      });
    };

    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => { touchStartY = e.touches[0].clientY; };
    const onTouchMove = (e: TouchEvent) => {
      if (!sectionInView()) return;
      if (animating || performance.now() < lockUntil) { e.preventDefault(); return; }
      const dy = touchStartY - e.touches[0].clientY;
      if (Math.abs(dy) < 25) return;
      const dir = dy > 0 ? 1 : -1;
      const targets = stepTargets();
      const idx = nearestIndex(targets);
      const next = idx + dir;
      if (next < 0 || next >= targets.length) return;
      e.preventDefault();
      animating = true;
      smoothScrollTo(targets[next]).then(() => {
        animating = false;
        lockUntil = performance.now() + 250;
      });
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
    };
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
          letter-spacing:-0.01em; color:${C.blue}; margin:0 0 8px;
          transition:opacity .6s ease, transform .6s cubic-bezier(.22,1,.36,1), filter .6s ease;
          will-change:opacity, transform; }
        .jtext p { font-size:14.5px; line-height:1.6; color:#3a3a3a;
          transition:opacity .65s ease, transform .65s cubic-bezier(.22,1,.36,1), filter .65s ease;
          will-change:opacity, transform; }
        .jh2 { font-family:'DM Sans',sans-serif; font-weight:700; }
      `}</style>

      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 48px" }}>
        {/* Heading — single navy color, DM Sans */}
        <div style={{ textAlign: "left", maxWidth: 820, margin: "0 0 90px" }}>
          <h2 className="jh2" style={{ fontSize: "clamp(46px, 5.4vw, 84px)", lineHeight: 1.02,
            letterSpacing: "-0.025em", color: C.blue, margin: 0 }}>
            The Re-Rooted® Journey
          </h2>
          <p style={{ marginTop: 20, fontSize: 17, lineHeight: 1.6, color: C.mute, maxWidth: "58ch" }}>
            We combine diagnostic tools, personalized coaching, and measurable outcomes. We integrate expats and provide organizations with the measurable difference.
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

      </div>
    </section>
  );
}
