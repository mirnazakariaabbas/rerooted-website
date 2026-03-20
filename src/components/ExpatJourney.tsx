import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAudience } from "@/contexts/AudienceContext";

type Stage = {
  name: string;
  desc: string;
  side: "left" | "right";
  cardBg: string;
  cardBorder: string;
};

const individualStages: Stage[] = [
  {
    name: "Pre-Rooted",
    desc: "The stage before your move — preparing, dreaming, and gathering roots to carry with you.",
    side: "left",
    cardBg: "#F3F0F7",
    cardBorder: "#BCADD4",
  },
  {
    name: "Re-Rooted",
    desc: "You've arrived. Learning to feel at home in your new place, street by street.",
    side: "right",
    cardBg: "#FFFFFF",
    cardBorder: "#BCADD4",
  },
  {
    name: "Thriving",
    desc: "Blooming where you've been planted — building community, routines, and belonging.",
    side: "left",
    cardBg: "#F3F0F7",
    cardBorder: "#BCADD4",
  },
  {
    name: "Rooting Back",
    desc: "Finding ways to give back, stay connected to your origins, and grow new roots for others.",
    side: "right",
    cardBg: "#FFFFFF",
    cardBorder: "#BCADD4",
  },
];

const corporateStages: Stage[] = [
  {
    name: "Pre-Rooted",
    desc: "Preparing to leave. Building readiness before the move begins. Mindset, expectations, cultural preparation.",
    side: "left",
    cardBg: "#F3F0F7",
    cardBorder: "#BCADD4",
  },
  {
    name: "Rooting In",
    desc: "Just arrived. Finding ground in an unfamiliar place. Values, culture, language, relationships, social life, family.",
    side: "right",
    cardBg: "#FFFFFF",
    cardBorder: "#BCADD4",
  },
  {
    name: "Thrive",
    desc: "Settled and growing. Moving beyond survival mode. Performing, connecting, contributing, building a meaningful life.",
    side: "left",
    cardBg: "#F3F0F7",
    cardBorder: "#BCADD4",
  },
  {
    name: "Rooting Back",
    desc: "Returning home. Re-integrating after life abroad. Managing reverse culture shock and a changed identity.",
    side: "right",
    cardBg: "#FFFFFF",
    cardBorder: "#BCADD4",
  },
];

/* Decorative root lines for right-side (white) cards */
const RootLines = () => (
  <svg
    className="absolute bottom-2 right-2 w-10 h-12 pointer-events-none"
    viewBox="0 0 40 48"
    fill="none"
  >
    <path
      d="M32 4 C28 16, 20 24, 12 36"
      stroke="#3DA776"
      strokeWidth="1.2"
      strokeLinecap="round"
      opacity="0.4"
    />
    <path
      d="M36 8 C34 20, 28 30, 22 42"
      stroke="#3DA776"
      strokeWidth="1"
      strokeLinecap="round"
      opacity="0.35"
    />
    <path
      d="M28 10 C24 18, 16 28, 8 44"
      stroke="#3DA776"
      strokeWidth="0.8"
      strokeLinecap="round"
      opacity="0.3"
    />
  </svg>
);

/* Leaf pattern for Thriving card */
const LeafPattern = () => (
  <svg
    className="absolute inset-0 w-full h-full pointer-events-none"
    viewBox="0 0 270 120"
    fill="none"
    preserveAspectRatio="xMidYMid slice"
  >
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
    style={{
      border: "3px solid #BCADD4",
      boxShadow: "0 0 0 4px #F3F0F7",
      background: "#e8e4ed",
      color: "#8a7fa0",
    }}
  >
    {/* {label} photo */}
    Photo
  </div>
);

/* Stage card */
const StageCard = ({
  stage,
  index,
  isIndividual,
}: {
  stage: Stage;
  index: number;
  isIndividual: boolean;
}) => {
  const isThrivingCard = index === 2;
  const isRightCard = stage.side === "right";

  return (
    <div
      className="relative rounded-xl overflow-hidden"
      style={{
        maxWidth: 270,
        padding: 20,
        background: stage.cardBg,
        border: `1px solid ${stage.cardBorder}`,
      }}
    >
      {isThrivingCard && <LeafPattern />}
      {isRightCard && <RootLines />}

      <div className="relative z-10">
        <p
          className="font-medium uppercase tracking-[0.07em]"
          style={{ color: "#1F299C", fontSize: 13 }}
        >
          {stage.name}
        </p>
        <div
          className="mt-1.5 mb-2.5 rounded-sm"
          style={{ width: 28, height: 3, background: "#3DA776" }}
        />
        <p
          className="leading-relaxed"
          style={{ color: "#4a4a5a", fontSize: 12, lineHeight: 1.55 }}
        >
          {stage.desc}
        </p>
      </div>
    </div>
  );
};

/* ─── Desktop: S-curve winding path ─── */
const DesktopJourney = ({ isIndividual }: { isIndividual: boolean }) => {
  const stages = isIndividual ? individualStages : corporateStages;

  // Vertical positions for each stop (in SVG viewBox coords, viewBox height = 900)
  const stopY = [120, 320, 520, 720];
  const centerX = 300; // center of 600-wide viewBox

  // S-curve path through all 4 stops
  const pathD = `
    M ${centerX} 40
    C ${centerX} 80, ${centerX - 80} ${stopY[0] - 30}, ${centerX} ${stopY[0]}
    C ${centerX + 80} ${stopY[0] + 30}, ${centerX + 80} ${stopY[1] - 30}, ${centerX} ${stopY[1]}
    C ${centerX - 80} ${stopY[1] + 30}, ${centerX - 80} ${stopY[2] - 30}, ${centerX} ${stopY[2]}
    C ${centerX + 80} ${stopY[2] + 30}, ${centerX + 80} ${stopY[3] - 30}, ${centerX} ${stopY[3]}
    C ${centerX - 40} ${stopY[3] + 30}, ${centerX} ${stopY[3] + 60}, ${centerX} ${stopY[3] + 80}
  `;

  return (
    <div className="relative max-w-3xl mx-auto mt-8" style={{ minHeight: 800 }}>
      {/* SVG path behind everything */}
      <svg
        className="absolute left-1/2 -translate-x-1/2 top-0 w-full h-full pointer-events-none"
        viewBox="0 0 600 900"
        preserveAspectRatio="xMidYMid meet"
        fill="none"
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

      {/* Stages */}
      <div className="relative flex flex-col" style={{ gap: 0 }}>
        {stages.map((stage, i) => {
          const isLeft = stage.side === "left";
          // Map SVG stopY to percentage of container
          const topPercent = (stopY[i] / 900) * 100;

          return (
            <FadeInOnScroll key={i} delay={i * 0.15}>
              <div
                className="absolute flex items-center"
                style={{
                  top: `${topPercent}%`,
                  left: isLeft ? 0 : undefined,
                  right: isLeft ? undefined : 0,
                  transform: "translateY(-50%)",
                  width: "100%",
                }}
              >
                {isLeft ? (
                  <div className="flex items-center w-full">
                    <div className="flex-1 flex justify-end pr-4">
                      <StageCard stage={stage} index={i} isIndividual={isIndividual} />
                    </div>
                    <div className="flex-shrink-0 relative z-10" style={{ width: 56 }}>
                      {/* PRE-ROOTED / THRIVING photo */}
                      <PhotoCircle label={stage.name} />
                    </div>
                    <div className="flex-1" />
                  </div>
                ) : (
                  <div className="flex items-center w-full">
                    <div className="flex-1" />
                    <div className="flex-shrink-0 relative z-10" style={{ width: 56 }}>
                      {/* RE-ROOTED / ROOTING BACK photo */}
                      <PhotoCircle label={stage.name} />
                    </div>
                    <div className="flex-1 flex justify-start pl-4">
                      <StageCard stage={stage} index={i} isIndividual={isIndividual} />
                    </div>
                  </div>
                )}
              </div>
            </FadeInOnScroll>
          );
        })}
      </div>
    </div>
  );
};

/* ─── Mobile: straight vertical dotted line ─── */
const MobileJourney = ({ isIndividual }: { isIndividual: boolean }) => {
  const stages = isIndividual ? individualStages : corporateStages;

  return (
    <div className="relative max-w-sm mx-auto mt-6 pb-8">
      {/* Vertical dotted line */}
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
              {/* Photo circle */}
              <PhotoCircle label={stage.name} />
              {/* Card below */}
              <div className="mt-3 w-full" style={{ maxWidth: "90vw" }}>
                <StageCard stage={stage} index={i} isIndividual={isIndividual} />
              </div>
            </div>
          </FadeInOnScroll>
        ))}
      </div>
    </div>
  );
};

/* ─── Scroll-triggered fade-in wrapper ─── */
const FadeInOnScroll = ({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setVisible(true);
      },
      { threshold: 0.2 }
    );
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

/* ─── Export ─── */
const ExpatJourney = () => {
  const mobile = useIsMobile();
  const { audience } = useAudience();
  const isIndividual = audience === "individual";

  return (
    <section
      id="journey"
      className="px-6 lg:px-12"
      style={{ background: "#FAF9F6", paddingTop: 60, paddingBottom: 60 }}
    >
      <div className="max-w-3xl mx-auto text-center mb-4">
        <h2
          className="font-extrabold leading-tight mb-3"
          style={{ color: "#1A1A1A", fontSize: "clamp(32px, 5vw, 40px)" }}
        >
          {isIndividual
            ? "Where are you right now?"
            : "We meet your people wherever they are"}
        </h2>
        <p
          className="max-w-2xl mx-auto leading-relaxed"
          style={{ color: "#6B6B6B", fontSize: "clamp(14px, 2vw, 16px)" }}
        >
          {isIndividual ? (
            <>
              The expat journey isn't a straight line. You move forward, loop back,
              and start again. Find the stage that feels like yours right now — that's
              where we begin.
            </>
          ) : (
            <>
              The expat journey isn't linear. People move forward, loop back, and
              start again.{" "}
              <strong style={{ color: "#1A1A1A" }}>Re-Rooted®</strong> supports the
              full cycle — not just the move, the person.
            </>
          )}
        </p>
      </div>

      {mobile ? (
        <MobileJourney isIndividual={isIndividual} />
      ) : (
        <DesktopJourney isIndividual={isIndividual} />
      )}
    </section>
  );
};

export default ExpatJourney;
