import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Phone, ClipboardList, Sprout, Flag, CheckCircle, ChevronDown } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";

const steps = [
  {
    icon: Phone,
    timing: "Day 0",
    name: "Discovery Call",
    desc: "HR or employee reaches out. We understand the assignment, the person, the family situation, and the specific integration challenges.",
  },
  {
    icon: ClipboardList,
    timing: "Week 1",
    name: "Integration Assessment",
    desc: "Structured assessment across all six dimensions. Identifies gaps, strengths, and priorities. Shared with HR and hiring manager as a baseline.",
  },
  {
    icon: Sprout,
    timing: "Weeks 2–10",
    name: "Active Coaching",
    desc: "Bi-weekly one-on-one sessions with a matched coach. Practical, action-oriented work on the dimensions that matter most.",
  },
  {
    icon: Flag,
    timing: "Week 11–12",
    name: "Final Assessment",
    desc: "Post-program assessment measuring progress across all six roots. Integration report delivered to HR and hiring manager with outcomes.",
  },
  {
    icon: CheckCircle,
    timing: "Post-program",
    name: "Ongoing Support",
    desc: "Optional follow-up sessions. Employee has tools and habits for continued integration. HR has data for the next assignment.",
  },
];

const NODE_SPACING = 260;
const VINE_TOP = 60;
const VINE_HEIGHT = VINE_TOP + (steps.length - 1) * NODE_SPACING + 100;

function getNodePos(index: number, centerX: number, amplitude: number) {
  const y = VINE_TOP + index * NODE_SPACING;
  const side = index % 2 === 0 ? "left" : "right";
  const x = side === "left" ? centerX - amplitude : centerX + amplitude;
  return { x, y, side };
}

function buildVinePath(centerX: number, amplitude: number): string {
  const pts = steps.map((_, i) => getNodePos(i, centerX, amplitude));

  let d = `M ${centerX} 0`;
  pts.forEach((pt, i) => {
    const prevY = i === 0 ? 0 : pts[i - 1].y;
    const prevX = i === 0 ? centerX : pts[i - 1].x;
    const cpY1 = prevY + (pt.y - prevY) * 0.5;
    d += ` C ${prevX} ${cpY1}, ${pt.x} ${pt.y - (pt.y - prevY) * 0.3}, ${pt.x} ${pt.y}`;
  });
  const lastPt = pts[pts.length - 1];
  d += ` C ${lastPt.x} ${lastPt.y + 40}, ${centerX} ${VINE_HEIGHT - 20}, ${centerX} ${VINE_HEIGHT}`;
  return d;
}

/* ── Step Node ── */
const StepNode = ({
  step,
  index,
  isMobile,
  centerX,
  amplitude,
}: {
  step: (typeof steps)[number];
  index: number;
  isMobile: boolean;
  centerX: number;
  amplitude: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const Icon = step.icon;
  const { x: nodeX, y: nodeY, side } = getNodePos(index, centerX, amplitude);
  const displaySide = isMobile ? "right" : side;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Icon positioned on the vine
  const iconSize = 48;

  return (
    <div ref={ref} className="absolute" style={{ top: nodeY - iconSize / 2, left: 0, right: 0, height: iconSize + 120 }}>
      {/* Icon on the vine */}
      <motion.div
        className="absolute z-10 rounded-full flex items-center justify-center shadow-lg transition-colors duration-500"
        style={{
          width: iconSize,
          height: iconSize,
          left: nodeX - iconSize / 2,
          top: 0,
        }}
        initial={false}
        animate={{
          backgroundColor: visible ? "hsl(var(--secondary))" : "hsl(var(--muted))",
          color: visible ? "hsl(var(--secondary-foreground))" : "hsl(var(--muted-foreground))",
        }}
        transition={{ duration: 0.5 }}
      >
        <Icon size={20} />
      </motion.div>

      {/* Text card */}
      <motion.div
        className="absolute"
        style={{
          top: -4,
          ...(isMobile
            ? { left: nodeX + iconSize / 2 + 16, right: 8 }
            : displaySide === "left"
            ? { right: `calc(100% - ${nodeX - iconSize / 2 - 16}px)`, textAlign: "right" as const }
            : { left: nodeX + iconSize / 2 + 16 }),
          maxWidth: 240,
        }}
        initial={{ opacity: 0, x: displaySide === "left" ? 20 : -20 }}
        animate={visible ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <p className="text-xs font-semibold text-muted-foreground">{step.timing}</p>
        <p className="font-bold text-foreground text-sm">{step.name}</p>
        <AnimatePresence>
          {visible && (
            <motion.p
              className="text-muted-foreground text-sm leading-relaxed mt-1"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              {step.desc}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

/* ── Main ── */
const IntegrationProgram = () => {
  const isMobile = useIsMobile();
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end center"],
  });

  const centerX = isMobile ? 30 : 400;
  const amplitude = isMobile ? 0 : 80;
  const vinePath = buildVinePath(centerX, amplitude);
  const svgWidth = isMobile ? 60 : 800;
  const dashOffset = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <section ref={sectionRef} id="program" className="bg-background py-16 px-6 lg:px-12">
      <h2 className="text-foreground font-extrabold text-3xl md:text-[40px] text-center">
        The Re-Rooted® Journey
      </h2>

      <div className="flex items-center justify-center gap-1 mt-4 mb-12">
        <span className="text-primary text-sm font-semibold tracking-wide">Keep scrolling</span>
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-4 h-4 text-primary" />
        </motion.span>
      </div>

      <div className="relative mx-auto" style={{ maxWidth: svgWidth, height: VINE_HEIGHT + 60 }}>
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox={`0 0 ${svgWidth} ${VINE_HEIGHT + 20}`}
          fill="none"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <filter id="hand-drawn" x="-5%" y="-5%" width="110%" height="110%">
              <feTurbulence type="turbulence" baseFrequency="0.03" numOctaves="3" result="turbulence" seed="2" />
              <feDisplacementMap in="SourceGraphic" in2="turbulence" scale="3" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </defs>
          {/* Background dashed path */}
          <path
            d={vinePath}
            stroke="hsl(var(--border))"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="14 8"
            fill="none"
            filter="url(#hand-drawn)"
          />
          {/* Animated fill path */}
          <motion.path
            d={vinePath}
            stroke="hsl(var(--secondary))"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            filter="url(#hand-drawn)"
            pathLength={1}
            style={{
              pathLength: scrollYProgress,
              strokeDasharray: 1,
              strokeDashoffset: dashOffset,
            }}
          />
        </svg>

        {steps.map((step, i) => (
          <StepNode key={i} step={step} index={i} isMobile={isMobile} centerX={centerX} amplitude={amplitude} />
        ))}
      </div>

      <div className="mt-10 flex flex-col items-center gap-6">
        <p className="text-muted-foreground text-sm text-center">
          Total engagement: 90 days · 6–8 coaching sessions · 2 assessments · 1 HR report
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button size="lg">Get a program overview</Button>
          <a href="#contact" className="text-sm font-medium text-primary hover:underline underline-offset-4">
            Or start with a conversation
          </a>
        </div>
      </div>
    </section>
  );
};

export default IntegrationProgram;
