import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Phone, ClipboardList, Sprout, Flag, CheckCircle, ChevronDown } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import logoBlue from "@/assets/logo-shorthand-blue.png";

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

/* ── Vine SVG path positions ── */
// Each node sits at a Y position along the vine; X alternates left/right of center
const NODE_SPACING = 220;
const VINE_TOP = 40;
const nodePositions = steps.map((_, i) => ({
  y: VINE_TOP + i * NODE_SPACING,
  side: i % 2 === 0 ? "left" : "right",
}));
const VINE_HEIGHT = VINE_TOP + (steps.length - 1) * NODE_SPACING + 80;

// Build a smooth S-curve path through the node positions
function buildVinePath(centerX: number, amplitude: number): string {
  const pts = nodePositions.map((n) => ({
    x: n.side === "left" ? centerX - amplitude : centerX + amplitude,
    y: n.y,
  }));

  let d = `M ${centerX} 0`;
  pts.forEach((pt, i) => {
    const prevY = i === 0 ? 0 : pts[i - 1].y;
    const cpY1 = prevY + (pt.y - prevY) * 0.5;
    const prevX = i === 0 ? centerX : pts[i - 1].x;
    d += ` C ${prevX} ${cpY1}, ${pt.x} ${pt.y - (pt.y - prevY) * 0.3}, ${pt.x} ${pt.y}`;
  });
  // extend to bottom
  const lastPt = pts[pts.length - 1];
  d += ` C ${lastPt.x} ${lastPt.y + 40}, ${centerX} ${VINE_HEIGHT - 20}, ${centerX} ${VINE_HEIGHT}`;
  return d;
}

/* ── Animated step node ── */
const StepNode = ({
  step,
  index,
  isMobile,
}: {
  step: (typeof steps)[number];
  index: number;
  isMobile: boolean;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const Icon = step.icon;
  const side = isMobile ? "right" : nodePositions[index].side;

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

  const yPos = nodePositions[index].y;

  return (
    <motion.div
      ref={ref}
      className="absolute flex items-start gap-4"
      style={{
        top: yPos - 30,
        ...(isMobile
          ? { left: 50, right: 16 }
          : side === "left"
          ? { right: "calc(50% + 40px)", textAlign: "right" as const }
          : { left: "calc(50% + 40px)" }),
      }}
      initial={{ opacity: 0, y: 30 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.1 }}
    >
      {side === "right" && (
        <div className="w-[52px] h-[52px] shrink-0 rounded-full flex items-center justify-center bg-secondary text-secondary-foreground shadow-md">
          <Icon size={22} />
        </div>
      )}
      <div className={`max-w-[260px] ${side === "left" ? "ml-auto" : ""}`}>
        <p className="text-xs font-semibold text-muted-foreground">{step.timing}</p>
        <p className="font-bold text-foreground text-sm mb-1">{step.name}</p>
        <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
      </div>
      {side === "left" && (
        <div className="w-[52px] h-[52px] shrink-0 rounded-full flex items-center justify-center bg-secondary text-secondary-foreground shadow-md">
          <Icon size={22} />
        </div>
      )}
    </motion.div>
  );
};

/* ── Main component ── */
const IntegrationProgram = () => {
  const isMobile = useIsMobile();
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end center"],
  });

  const centerX = isMobile ? 30 : 400;
  const amplitude = isMobile ? 0 : 120;
  const vinePath = buildVinePath(centerX, amplitude);
  const svgWidth = isMobile ? 60 : 800;

  const dashOffset = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <section
      ref={sectionRef}
      id="program"
      className="bg-background py-16 px-6 lg:px-12"
    >
      {/* Title with inline logo */}
      <h2 className="text-foreground font-extrabold text-3xl md:text-[40px] text-center flex items-center justify-center gap-3 flex-wrap">
        <span>The</span>
        <img src={logoBlue} alt="Re-Rooted" className="h-[36px] md:h-[44px] inline-block" />
        <span>Journey</span>
      </h2>

      {/* Keep scrolling */}
      <div className="flex items-center justify-center gap-1 mt-4 mb-12">
        <span className="text-primary text-sm font-semibold tracking-wide">Keep scrolling</span>
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-4 h-4 text-primary" />
        </motion.span>
      </div>

      {/* Vine timeline */}
      <div className="relative mx-auto" style={{ maxWidth: svgWidth, height: VINE_HEIGHT + 60 }}>
        {/* SVG vine path */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox={`0 0 ${svgWidth} ${VINE_HEIGHT + 20}`}
          fill="none"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Background path */}
          <path d={vinePath} stroke="hsl(var(--border))" strokeWidth="3" strokeLinecap="round" fill="none" />
          {/* Animated fill path */}
          <motion.path
            d={vinePath}
            stroke="hsl(153, 45%, 45%)"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            pathLength={1}
            style={{
              pathLength: scrollYProgress,
              strokeDasharray: 1,
              strokeDashoffset: dashOffset,
            }}
          />
        </svg>

        {/* Step nodes */}
        {steps.map((step, i) => (
          <StepNode key={i} step={step} index={i} isMobile={isMobile} />
        ))}
      </div>

      {/* Summary + CTAs */}
      <div className="mt-10 flex flex-col items-center gap-6">
        <p className="text-muted-foreground text-sm text-center">
          Total engagement: 90 days · 6–8 coaching sessions · 2 assessments · 1 HR report
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button size="lg">Get a program overview</Button>
          <a
            href="#contact"
            className="text-sm font-medium text-primary hover:underline underline-offset-4"
          >
            Or start with a conversation
          </a>
        </div>
      </div>
    </section>
  );
};

export default IntegrationProgram;
