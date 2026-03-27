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

const DEEP_BLUE = "#1F299C";

/* Leaf pattern for Thriving card (index 2) */
const LeafPattern = () => (
  <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 300 200" fill="none" preserveAspectRatio="xMidYMid slice">
    <ellipse cx="60" cy="30" rx="18" ry="8" fill={DEEP_BLUE} opacity="0.05" transform="rotate(-30 60 30)" />
    <ellipse cx="240" cy="140" rx="14" ry="6" fill={DEEP_BLUE} opacity="0.04" transform="rotate(20 240 140)" />
    <ellipse cx="150" cy="80" rx="20" ry="7" fill={DEEP_BLUE} opacity="0.05" transform="rotate(-15 150 80)" />
    <ellipse cx="40" cy="160" rx="12" ry="5" fill={DEEP_BLUE} opacity="0.04" transform="rotate(35 40 160)" />
  </svg>
);

/* Stage card with image on top */
const StageCard = ({ stage, index }: { stage: Stage; index: number }) => {
  const isLeft = stage.side === "left";
  const bg = isLeft ? "#F3F0F7" : "#FFFFFF";

  return (
    <div
      className="relative rounded-xl overflow-hidden transition-transform duration-200 hover:scale-105 cursor-pointer"
      style={{ maxWidth: 300, background: bg, border: `1px solid rgba(31, 41, 156, 0.3)` }}
    >
      <div
        className="w-full flex items-center justify-center"
        style={{ aspectRatio: "16 / 10", background: "#e8e4ed" }}
      >
        <span className="text-xs font-medium uppercase tracking-wider" style={{ color: "#8a7fa0" }}>
          Photo
        </span>
      </div>
      <div className="relative p-5">
        {index === 2 && <LeafPattern />}
        <div className="relative z-10">
          <p className="font-medium uppercase tracking-[0.07em]" style={{ color: DEEP_BLUE, fontSize: 13 }}>
            {stage.name}
          </p>
          <div className="mt-1.5 mb-2.5 rounded-sm" style={{ width: 28, height: 3, background: DEEP_BLUE }} />
          <p style={{ color: "#4a4a5a", fontSize: 12, lineHeight: 1.55 }}>{stage.desc}</p>
        </div>
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
      <div className="flex items-center" style={{ minHeight: 220 }}>
        <div className="flex-1 flex justify-end pr-10">
          {isLeft ? <StageCard stage={stage} index={index} /> : <div />}
        </div>
        <div className="flex-1 flex justify-start pl-10">
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
  const [containerH, setContainerH] = useState(900);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setContainerH(e.contentRect.height));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const rowH = 220;
  const gap = 24;
  const totalRows = stages.length;
  const totalH = containerH || (totalRows * rowH + (totalRows - 1) * gap);
  const vbW = 400;
  const cx = vbW / 2;
  const swing = 140; // wide sweeps

  // Each stop lands at the card's side position, not center
  const stopYs = stages.map((_, i) => {
    const rowTop = i * (rowH + gap);
    return rowTop + rowH / 2;
  });

  const stopXs = stages.map((s) => (s.side === "left" ? cx - swing : cx + swing));

  // Build a smooth S-curve path that goes from top-center through each stop
  let pathD = `M ${cx} 0`;

  for (let i = 0; i < stopYs.length; i++) {
    const targetX = stopXs[i];
    const targetY = stopYs[i];
    const prevX = i === 0 ? cx : stopXs[i - 1];
    const prevY = i === 0 ? 0 : stopYs[i - 1];

    // Control points: first CP keeps previous X direction, second CP aligns with target
    const midY = (prevY + targetY) / 2;
    const cp1x = prevX;
    const cp1y = midY;
    const cp2x = targetX;
    const cp2y = midY;

    pathD += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${targetX} ${targetY}`;
  }

  // Gentle fade-out curve from last stop toward center-bottom
  const lastX = stopXs[stopXs.length - 1];
  const lastY = stopYs[stopYs.length - 1];
  const endY = totalH;
  const midFadeY = (lastY + endY) / 2;
  pathD += ` C ${lastX} ${midFadeY}, ${cx} ${midFadeY}, ${cx} ${endY}`;

  return (
    <div ref={containerRef} className="relative max-w-3xl mx-auto mt-8">
      <svg
        className="absolute left-1/2 top-0 pointer-events-none"
        width={vbW}
        height={totalH}
        viewBox={`0 0 ${vbW} ${totalH}`}
        fill="none"
        style={{ zIndex: 0, marginLeft: -(vbW / 2) }}
      >
        <path
          d={pathD}
          stroke={DEEP_BLUE}
          strokeWidth="7"
          strokeDasharray="12 10"
          strokeLinecap="round"
          fill="none"
          opacity="0.6"
        />
      </svg>

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
          backgroundImage: `repeating-linear-gradient(to bottom, ${DEEP_BLUE} 0px, ${DEEP_BLUE} 12px, transparent 12px, transparent 22px)`,
          borderRadius: 4,
          opacity: 0.5,
        }}
      />
      <div className="flex flex-col gap-12">
        {stages.map((stage, i) => (
          <FadeInOnScroll key={i} delay={i * 0.12}>
            <div className="flex flex-col items-center relative z-10">
              <div className="w-full" style={{ maxWidth: "90vw" }}>
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
