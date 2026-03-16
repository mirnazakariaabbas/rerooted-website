import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

/* ---- Curvy arrow SVG between two steps ---- */
const CurvyArrow = ({
  direction,
  visible,
  isMobile,
}: {
  direction: "left-to-right" | "right-to-left";
  visible: boolean;
  isMobile: boolean;
}) => {
  const pathRef = useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = useState(0);

  useEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength());
    }
  }, []);

  // Arrow curves down from one side to the other
  const w = isMobile ? 60 : 200;
  const h = 80;

  let d: string;
  if (isMobile) {
    // Simple S-curve on the left side
    d = `M ${w / 2} 0 C ${w / 2 + 25} ${h * 0.3}, ${w / 2 - 25} ${h * 0.7}, ${w / 2} ${h}`;
  } else if (direction === "left-to-right") {
    d = `M ${w * 0.15} 0 C ${w * 0.15} ${h * 0.5}, ${w * 0.85} ${h * 0.5}, ${w * 0.85} ${h}`;
  } else {
    d = `M ${w * 0.85} 0 C ${w * 0.85} ${h * 0.5}, ${w * 0.15} ${h * 0.5}, ${w * 0.15} ${h}`;
  }

  return (
    <div className={`flex ${isMobile ? "justify-start pl-[22px]" : "justify-center"}`}>
      <svg
        width={w}
        height={h}
        viewBox={`0 0 ${w} ${h}`}
        fill="none"
        className="overflow-visible"
      >
        {/* Hand-drawn filter */}
        <defs>
          <filter id="wobbly">
            <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="3" result="turbulence" />
            <feDisplacementMap in="SourceGraphic" in2="turbulence" scale="2" />
          </filter>
          <marker
            id="arrowhead"
            markerWidth="8"
            markerHeight="6"
            refX="7"
            refY="3"
            orient="auto"
          >
            <polygon
              points="0 0, 8 3, 0 6"
              fill="hsl(var(--secondary))"
            />
          </marker>
        </defs>
        {/* Background dashed trail */}
        <path
          d={d}
          stroke="hsl(var(--border))"
          strokeWidth="2"
          strokeDasharray="6 4"
          strokeLinecap="round"
          filter="url(#wobbly)"
        />
        {/* Animated fill path */}
        <motion.path
          ref={pathRef}
          d={d}
          stroke="hsl(var(--secondary))"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          filter="url(#wobbly)"
          markerEnd="url(#arrowhead)"
          initial={{ strokeDashoffset: pathLength, strokeDasharray: `${pathLength} ${pathLength}` }}
          animate={
            visible && pathLength > 0
              ? { strokeDashoffset: 0, strokeDasharray: `${pathLength} ${pathLength}` }
              : { strokeDashoffset: pathLength, strokeDasharray: `${pathLength} ${pathLength}` }
          }
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
      </svg>
    </div>
  );
};

/* ---- Step Node ---- */
const StepNode = ({
  step,
  index,
  isMobile,
  onVisible,
}: {
  step: (typeof steps)[number];
  index: number;
  isMobile: boolean;
  onVisible: (index: number) => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const Icon = step.icon;
  const side = isMobile ? "right" : index % 2 === 0 ? "left" : "right";

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          onVisible(index);
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [index, onVisible]);

  return (
    <motion.div
      ref={ref}
      className={`flex items-start gap-4 ${
        isMobile
          ? "flex-row"
          : side === "left"
          ? "flex-row-reverse text-right"
          : "flex-row"
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
    >
      {/* Icon circle */}
      <motion.div
        className="relative z-10 shrink-0 w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
        initial={false}
        animate={{
          backgroundColor: visible ? "hsl(var(--secondary))" : "hsl(var(--muted))",
          color: visible ? "hsl(var(--secondary-foreground))" : "hsl(var(--muted-foreground))",
        }}
        transition={{ duration: 0.5 }}
      >
        <Icon size={20} />
      </motion.div>

      {/* Text */}
      <div className="flex-1 max-w-xs">
        <p className="text-xs font-semibold text-muted-foreground">{step.timing}</p>
        <p className="font-bold text-foreground text-sm">{step.name}</p>
        <AnimatePresence>
          {visible && (
            <motion.p
              className="text-muted-foreground text-sm leading-relaxed mt-1"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              {step.desc}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

/* ---- Main Component ---- */
const IntegrationProgram = () => {
  const isMobile = useIsMobile();
  const [visibleSteps, setVisibleSteps] = useState<Set<number>>(new Set());

  const handleVisible = (index: number) => {
    setVisibleSteps((prev) => {
      const next = new Set(prev);
      next.add(index);
      return next;
    });
  };

  return (
    <section id="program" className="bg-background py-16 px-6 lg:px-12">
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

      <div className="max-w-2xl mx-auto">
        {steps.map((step, i) => (
          <div key={i}>
            {/* Step node */}
            <div
              className={
                isMobile
                  ? ""
                  : i % 2 === 0
                  ? "flex justify-end pr-[calc(50%+16px)]"
                  : "flex justify-start pl-[calc(50%+16px)]"
              }
            >
              <StepNode
                step={step}
                index={i}
                isMobile={isMobile}
                onVisible={handleVisible}
              />
            </div>

            {/* Curvy arrow connector between steps */}
            {i < steps.length - 1 && (
              <CurvyArrow
                direction={
                  isMobile
                    ? "left-to-right"
                    : i % 2 === 0
                    ? "left-to-right"
                    : "right-to-left"
                }
                visible={visibleSteps.has(i)}
                isMobile={isMobile}
              />
            )}
          </div>
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
