import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAudience } from "@/contexts/AudienceContext";

type Stage = { name: string; desc: string; quote?: string };

const corporateStages: Stage[] = [
  {
    name: "Pre-Rooted",
    desc: "Preparing to leave. Building readiness before the move begins. Mindset, expectations, cultural preparation.",
  },
  {
    name: "Rooting In",
    desc: "Just arrived. Finding ground in an unfamiliar place. Values, culture, language, relationships, social life, family.",
  },
  {
    name: "Thrive",
    desc: "Settled and growing. Moving beyond survival mode. Performing, connecting, contributing, building a meaningful life.",
  },
  {
    name: "Rooting Back",
    desc: "Returning home. Re-integrating after life abroad. Managing reverse culture shock and a changed identity.",
  },
];

const individualStages: Stage[] = [
  {
    name: "Pre-Rooted",
    quote: "\u201CI haven\u2019t left yet, but I already feel the distance.\u201D",
    desc: "You\u2019re preparing to leave. The excitement is real \u2014 but so is the anxiety. We help you build readiness before the move begins.",
  },
  {
    name: "Rooting In",
    quote: "\u201CEverything is new. Nothing feels natural.\u201D",
    desc: "You just arrived. The culture, the language, the loneliness \u2014 it\u2019s a lot. We help you find ground in an unfamiliar place.",
  },
  {
    name: "Thrive",
    quote: "\u201CI\u2019m settled, but am I really living?\u201D",
    desc: "You\u2019ve survived the hardest part. Now it\u2019s time to grow \u2014 to perform, connect, contribute, and build a life that\u2019s truly yours.",
  },
  {
    name: "Rooting Back",
    quote: "\u201CI came home, but home doesn\u2019t feel like home anymore.\u201D",
    desc: "You\u2019re returning. But you\u2019ve changed \u2014 and so has everything you left behind. We help you re-integrate with grace.",
  },
];

/* ─── Desktop: looping SVG path with click-to-select ─── */
const DesktopJourney = ({ isIndividual }: { isIndividual: boolean }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const pathLength = useTransform(scrollYProgress, [0.1, 0.7], [0, 1]);
  const stages = isIndividual ? individualStages : corporateStages;
  const [activeStage, setActiveStage] = useState<number | null>(null);

  const nodePositions = [
    { x: 120, y: 180 },
    { x: 420, y: 100 },
    { x: 680, y: 220 },
    { x: 920, y: 120 },
  ];

  return (
    <div ref={sectionRef} className="relative max-w-5xl mx-auto mt-4">
      {/* SVG + nodes inside a card */}
      <div className="bg-card rounded-xl border border-border shadow-sm p-6">
        <div className="relative">
          <svg
            viewBox="0 0 1040 320"
            fill="none"
            className="w-full h-auto"
            preserveAspectRatio="xMidYMid meet"
          >
            <motion.path
              d="M 120 180 C 180 80, 280 40, 420 100 C 500 130, 480 220, 520 240 C 560 260, 600 180, 680 220 C 740 250, 780 160, 820 130 C 860 100, 880 110, 920 120"
              stroke="hsl(var(--primary))"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
              style={{ pathLength, strokeDasharray: 1, strokeDashoffset: 0 }}
            />
            <motion.path
              d="M 420 100 C 460 60, 500 50, 510 90 C 520 130, 480 140, 470 110"
              stroke="hsl(var(--primary))"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
              opacity="0.5"
              style={{ pathLength, strokeDasharray: 1, strokeDashoffset: 0 }}
            />
          </svg>

          {/* Node circles only (no description overlays) */}
          {stages.map((stage, i) => {
            const pos = nodePositions[i];
            const left = `${(pos.x / 1040) * 100}%`;
            const top = `${(pos.y / 320) * 100}%`;
            const isActive = activeStage === i;

            return (
              <motion.button
                key={i}
                className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer group z-10`}
                style={{ left, top }}
                onClick={() => setActiveStage(i)}
                whileHover={{ scale: 1.1 }}
              >
                <motion.div
                  animate={{ scale: isActive ? 1.25 : 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={`w-14 h-14 rounded-full flex items-center justify-center shadow-md transition-colors duration-300 ${
                    isActive
                      ? "bg-secondary text-secondary-foreground ring-2 ring-secondary/30 shadow-lg"
                      : "bg-primary text-primary-foreground group-hover:shadow-lg"
                  }`}
                >
                  <span className="text-xs font-bold text-center leading-tight px-1">
                    {stage.name.split(" ").length > 1
                      ? stage.name.split(" ").map((w, j) => <span key={j} className="block">{w}</span>)
                      : stage.name}
                  </span>
                </motion.div>
              </motion.button>
            );
          })}
        </div>

        {/* Description area inside the card */}
        <div className="mt-6 min-h-[100px]">
          <AnimatePresence mode="wait">
            {activeStage !== null ? (
              <motion.div
                key={activeStage}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
              >
                <h3 className="text-foreground font-bold text-lg mb-1">{stages[activeStage].name}</h3>
                {stages[activeStage].quote && (
                  <p className="text-accent italic text-sm mb-2">{stages[activeStage].quote}</p>
                )}
                <p className="text-muted-foreground text-base leading-relaxed max-w-xl mx-auto mb-2">
                  {stages[activeStage].desc}
                </p>
                <a
                  href="#"
                  className="text-sm font-semibold text-secondary hover:underline underline-offset-2"
                >
                  {isIndividual ? "This is me →" : "Learn more →"}
                </a>
              </motion.div>
            ) : (
              <motion.p
                key="hint"
                className="text-muted-foreground text-sm text-center italic"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Click a stage to learn more
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

/* ─── Mobile: vertical path with click-to-select ─── */
const MobileJourney = ({ isIndividual }: { isIndividual: boolean }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const pathLength = useTransform(scrollYProgress, [0.05, 0.8], [0, 1]);
  const stages = isIndividual ? individualStages : corporateStages;
  const [activeStage, setActiveStage] = useState<number | null>(null);

  return (
    <div ref={sectionRef} className="relative max-w-sm mx-auto mt-6">
      <svg
        className="absolute left-[28px] top-0 h-full w-[4px]"
        preserveAspectRatio="none"
      >
        <motion.line
          x1="2" y1="0" x2="2" y2="100%"
          stroke="hsl(var(--primary))"
          strokeWidth="3"
          strokeLinecap="round"
          style={{ pathLength, strokeDasharray: 1, strokeDashoffset: 0 }}
        />
      </svg>

      <div className="flex flex-col gap-10">
        {stages.map((stage, i) => (
          <MobileNode
            key={i}
            stage={stage}
            index={i}
            isIndividual={isIndividual}
            isActive={activeStage === i}
            onSelect={() => setActiveStage(i)}
          />
        ))}
      </div>
    </div>
  );
};

const MobileNode = ({
  stage,
  index,
  isIndividual,
  isActive,
  onSelect,
}: {
  stage: Stage;
  index: number;
  isIndividual: boolean;
  isActive: boolean;
  onSelect: () => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <motion.div
      ref={ref}
      className="flex gap-4 items-start cursor-pointer group"
      initial={{ opacity: 0, x: 30 }}
      animate={visible ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.1 }}
      onClick={onSelect}
    >
      <motion.div
        animate={{ scale: isActive ? 1.15 : 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={`w-14 h-14 shrink-0 rounded-full flex items-center justify-center z-10 transition-colors duration-300 ${
          isActive
            ? "bg-secondary text-secondary-foreground ring-2 ring-secondary/30 shadow-lg"
            : "bg-primary text-primary-foreground group-hover:shadow-lg"
        }`}
      >
        <span className="text-[10px] font-bold text-center leading-tight px-1">
          {stage.name.split(" ").length > 1
            ? stage.name.split(" ").map((w, i) => <span key={i} className="block">{w}</span>)
            : stage.name}
        </span>
      </motion.div>
      <motion.div
        className="pt-1"
        initial={{ opacity: 0 }}
        animate={visible ? { opacity: 1 } : {}}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        {stage.quote && (
          <p className={`italic text-sm mb-1 ${isActive ? "text-secondary" : "text-accent"}`}>{stage.quote}</p>
        )}
        <p className={`font-bold text-sm mb-1 ${isActive ? "text-secondary" : "text-foreground"}`}>{stage.name}</p>
        <p className="text-muted-foreground text-sm leading-relaxed mb-1.5">
          {stage.desc}
        </p>
        <a
          href="#"
          className="text-secondary text-xs font-semibold hover:underline underline-offset-2"
        >
          {isIndividual ? "This is me →" : "Learn more →"}
        </a>
      </motion.div>
    </motion.div>
  );
};

/* ─── Export ─── */
const ExpatJourney = () => {
  const mobile = useIsMobile();
  const { audience } = useAudience();
  const isIndividual = audience === "individual";

  return (
    <section id="journey" className={`bg-background px-6 lg:px-12 ${isIndividual ? "py-24" : "py-20"}`}>
      <div className="max-w-5xl mx-auto text-center mb-2">
        <h2 className="text-foreground font-extrabold text-4xl md:text-5xl leading-tight mb-3">
          {isIndividual ? "Where are you right now?" : "We meet your people wherever they are"}
        </h2>
        <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-2">
          {isIndividual ? (
            <>
              The expat journey isn't a straight line. You move forward, loop back, and start again.
              Find the stage that feels like yours right now — that's where we begin.
            </>
          ) : (
            <>
              The expat journey isn't linear. People move forward, loop back, and start again.{" "}
              <strong className="text-foreground">Re-Rooted®</strong> supports the full cycle — not just the move, the person.
            </>
          )}
        </p>
        <p className="text-primary text-sm font-semibold animate-bounce">Keep Scrolling ↓</p>
      </div>

      {mobile ? <MobileJourney isIndividual={isIndividual} /> : <DesktopJourney isIndividual={isIndividual} />}
    </section>
  );
};

export default ExpatJourney;
