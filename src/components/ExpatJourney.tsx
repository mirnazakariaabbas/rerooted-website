import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAudience } from "@/contexts/AudienceContext";

type Stage = {
  name: string;
  desc: string;
  side: "left" | "right";
};

const individualStages: Stage[] = [
  { name: "Pre-Rooted", desc: "The stage before your move — preparing, dreaming, and gathering roots to carry with you.", side: "left" },
  { name: "Re-Rooted", desc: "You've arrived. Learning to feel at home in your new place, street by street.", side: "right" },
  { name: "Thriving", desc: "Blooming where you've been planted — building community, routines, and belonging.", side: "left" },
  { name: "Rooting Back", desc: "Finding ways to give back, stay connected to your origins, and grow new roots for others.", side: "right" },
];

const corporateStages: Stage[] = [
  { name: "Pre-Rooted", desc: "Preparing to leave. Building readiness before the move begins. Mindset, expectations, cultural preparation.", side: "left" },
  { name: "Rooting In", desc: "Just arrived. Finding ground in an unfamiliar place. Values, culture, language, relationships, social life, family.", side: "right" },
  { name: "Thrive", desc: "Settled and growing. Moving beyond survival mode. Performing, connecting, contributing, building a meaningful life.", side: "left" },
  { name: "Rooting Back", desc: "Returning home. Re-integrating after life abroad. Managing reverse culture shock and a changed identity.", side: "right" },
];

/* Decorative root lines for right-side (white) cards */
const RootLines = () => (
  <svg className="absolute bottom-2 right-2 w-10 h-12 pointer-events-none" viewBox="0 0 40 48" fill="none">
    <path d="M32 4 C28 16, 20 24, 12 36" stroke="#3DA776" strokeWidth="1.2" strokeLinecap="round" opacity="0.4" />
    <path d="M36 8 C34 20, 28 30, 22 42" stroke="#3DA776" strokeWidth="1" strokeLinecap="round" opacity="0.35" />
    <path d="M28 10 C24 18, 16 28, 8 44" stroke="#3DA776" strokeWidth="0.8" strokeLinecap="round" opacity="0.3" />
  </svg>
);

/* Leaf pattern for Thriving card (index 2) */
const LeafPattern = () => (
  <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 270 120" fill="none" preserveAspectRatio="xMidYMid slice">
    <ellipse cx="60" cy="30" rx="18" ry="8" fill="#3DA776" opacity="0.05" transform="rotate(-30 60 30)" />
    <ellipse cx="200" cy="80" rx="14" ry="6" fill="#3DA776" opacity="0.04" transform="rotate(20 200 80)" />
    <ellipse cx="130" cy="55" rx="20" ry="7" fill="#3DA776" opacity="0.05" transform="rotate(-15 130 55)" />
    <ellipse cx="40" cy="90" rx="12" ry="5" fill="#3DA776" opacity="0.04" transform="rotate(35 40 90)" />
  </svg>
);

/* Photo circle placeholder */
const PhotoCircle = ({ label }: { label: string }) => (
  <div
    className="w-14 h-14 rounded-full flex items-center justify-center text-[8px] font-medium uppercase tracking-wider shrink-0"
    style={{ border: "3px solid #BCADD4", boxShadow: "0 0 0 4px #F3F0F7", background: "#e8e4ed", color: "#8a7fa0" }}
  >
    Photo
  </div>
);

/* Stage card */
const StageCard = ({ stage, index }: { stage: Stage; index: number }) => {
  const isLeft = stage.side === "left";
  const bg = isLeft ? "#F3F0F7" : "#FFFFFF";

  return (
    <div
      className="relative rounded-xl overflow-hidden"
      style={{ maxWidth: 270, padding: 20, background: bg, border: "1px solid #BCADD4" }}
    >
      {index === 2 && <LeafPattern />}
      {!isLeft && <RootLines />}
      <div className="relative z-10">
        <p className="font-medium uppercase tracking-[0.07em]" style={{ color: "#1F299C", fontSize: 13 }}>
          {stage.name}
        </p>
        <div className="mt-1.5 mb-2.5 rounded-sm" style={{ width: 28, height: 3, background: "#3DA776" }} />
        <p style={{ color: "#4a4a5a", fontSize: 12, lineHeight: 1.55 }}>{stage.desc}</p>
      </div>
    </div>
  );
};

/* Scroll-triggered fade-in */
const FadeInOnScroll = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
};

/* ─── Desktop row for one stage ─── */
const DesktopStageRow = ({ stage, index }: { stage: Stage; index: number }) => {
  const isLeft = stage.side === "left";

  return (
    <FadeInOnScroll delay={index * 0.15}>
      <div className="flex items-center" style={{ minHeight: 160 }}>
        {/* Left column */}
        <div className="flex-1 flex justify-end pr-6">
          {isLeft ? <StageCard stage={stage} index={index} /> : <div />}
        </div>

        {/* Center: photo circle */}
        <div className="relative z-10 shrink-0">
          {/* <!-- {stage.name} photo --> */}
          <PhotoCircle label={stage.name} />
        </div>

        {/* Right column */}
        <div className="flex-1 flex justify-start pl-6">
          {!isLeft ? <StageCard stage={stage} index={index} /> : <div />}
        </div>
      </div>
    </FadeInOnScroll>
  );
};

/* ─── Desktop: S-curve winding path ─── */
const DesktopJourney = ({ isIndividual }: { isIndividual: boolean }) => {
  const stages = isIndividual ? individualStages : corporateStages;
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerH, setContainerH] = useState(700);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setContainerH(e.contentRect.height));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Generate SVG path that curves through the center, synced to the row layout
  // Each row is ~160px min-height with gap-6 (24px), so stops are evenly distributed
  const rowH = 160;
  const gap = 24;
  const totalRows = stages.length;
  const totalH = containerH || (totalRows * rowH + (totalRows - 1) * gap);
  const cx = 28; // center x in 56-wide viewBox (matching the photo circle column)
  const vbW = 56;

  const stopYs = stages.map((_, i) => {
    const rowTop = i * (rowH + gap);
    return rowTop + rowH / 2;
  });

  let pathD = `M ${cx} 0`;
  for (let i = 0; i < stopYs.length; i++) {
    const y = stopYs[i];
    const prevY = i === 0 ? 0 : stopYs[i - 1];
    const midY = (prevY + y) / 2;
    const curveX = stages[i].side === "left" ? cx - 20 : cx + 20;
    pathD += ` C ${curveX} ${midY}, ${curveX} ${midY}, ${cx} ${y}`;
  }
  // Tail
  pathD += ` L ${cx} ${totalH}`;

  return (
    <div ref={containerRef} className="relative max-w-3xl mx-auto mt-8">
      {/* SVG path behind */}
      <svg
        className="absolute left-1/2 -translate-x-[28px] top-0 pointer-events-none"
        width={vbW}
        height={totalH}
        viewBox={`0 0 ${vbW} ${totalH}`}
        fill="none"
        style={{ zIndex: 0 }}
      >
        <path
          d={pathD}
          stroke="#BCADD4"
          strokeWidth="7"
          strokeDasharray="12 10"
          strokeLinecap="round"
          fill="none"
        />
      </svg>

      {/* Stage rows */}
      <div className="relative flex flex-col gap-6" style={{ zIndex: 1 }}>
        {stages.map((stage, i) => (
          <DesktopStageRow key={i} stage={stage} index={i} />
        ))}
      </div>
    </div>
  );
};

/* ─── Mobile: straight vertical dotted line ─── */
const MobileJourney = ({ isIndividual }: { isIndividual: boolean }) => {
  const stages = isIndividual ? individualStages : corporateStages;

  return (
    <div className="relative max-w-sm mx-auto mt-6 pb-8">
      <div
        className="absolute left-1/2 -translate-x-1/2 top-0 h-full"
        style={{
          width: 7,
          backgroundImage: "repeating-linear-gradient(to bottom, #BCADD4 0px, #BCADD4 12px, transparent 12px, transparent 22px)",
          borderRadius: 4,
        }}
      />
      <div className="flex flex-col gap-12">
        {stages.map((stage, i) => (
          <FadeInOnScroll key={i} delay={i * 0.12}>
            <div className="flex flex-col items-center relative z-10">
              <PhotoCircle label={stage.name} />
              <div className="mt-3 w-full" style={{ maxWidth: "90vw" }}>
                <StageCard stage={stage} index={i} />
              </div>
            </div>
          </FadeInOnScroll>
        ))}
      </div>
    </div>
  );
};

/* ─── Export ─── */
const ExpatJourney = () => {
  const mobile = useIsMobile();
  const { audience } = useAudience();
  const isIndividual = audience === "individual";

  return (
    <section id="journey" className="px-6 lg:px-12" style={{ background: "#FAF9F6", paddingTop: 60, paddingBottom: 60 }}>
      <div className="max-w-3xl mx-auto text-center mb-4">
        <h2 className="font-extrabold leading-tight mb-3" style={{ color: "#1A1A1A", fontSize: "clamp(32px, 5vw, 40px)" }}>
          {isIndividual ? "Where are you right now?" : "We meet your people wherever they are"}
        </h2>
        <p className="max-w-2xl mx-auto leading-relaxed" style={{ color: "#6B6B6B", fontSize: "clamp(14px, 2vw, 16px)" }}>
          {isIndividual ? (
            <>The expat journey isn't a straight line. You move forward, loop back, and start again. Find the stage that feels like yours right now — that's where we begin.</>
          ) : (
            <>The expat journey isn't linear. People move forward, loop back, and start again.{" "}<strong style={{ color: "#1A1A1A" }}>Re-Rooted®</strong> supports the full cycle — not just the move, the person.</>
          )}
        </p>
      </div>
      {mobile ? <MobileJourney isIndividual={isIndividual} /> : <DesktopJourney isIndividual={isIndividual} />}
    </section>
  );
};

export default ExpatJourney;
