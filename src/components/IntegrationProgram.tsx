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
  const side = isMobile ? "right" : index % 2 === 0 ? "left" : "right";

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

  return (
    <div
      ref={ref}
      className={`relative flex items-start gap-4 ${
        side === "left" ? "flex-row-reverse text-right" : "flex-row"
      }`}
    >
      {/* Icon on the line */}
      <motion.div
        className="relative z-10 shrink-0 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-colors duration-500"
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
        className="flex-1 max-w-xs pb-12"
        initial={{ opacity: 0, x: side === "left" ? 20 : -20 }}
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

const IntegrationProgram = () => {
  const isMobile = useIsMobile();
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end center"],
  });

  const lineScaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

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

      <div className="relative max-w-lg mx-auto">
        {/* Straight vertical line - background */}
        <div
          className="absolute bg-border"
          style={{
            width: 4,
            top: 0,
            bottom: 0,
            left: isMobile ? 23 : "50%",
            transform: isMobile ? "none" : "translateX(-50%)",
            borderRadius: 2,
          }}
        />
        {/* Animated fill line */}
        <motion.div
          className="absolute bg-secondary origin-top"
          style={{
            width: 4,
            top: 0,
            bottom: 0,
            left: isMobile ? 23 : "50%",
            transform: isMobile ? "none" : "translateX(-50%)",
            borderRadius: 2,
            scaleY: lineScaleY,
          }}
        />

        {/* Steps */}
        <div className={`relative ${isMobile ? "pl-0" : ""}`}>
          {steps.map((step, i) => (
            <div
              key={i}
              className={`flex ${
                isMobile
                  ? ""
                  : i % 2 === 0
                  ? "justify-end pr-[calc(50%+8px)]"
                  : "justify-start pl-[calc(50%+8px)]"
              }`}
              style={isMobile ? { paddingLeft: 0 } : {}}
            >
              <StepNode step={step} index={i} isMobile={isMobile} />
            </div>
          ))}
        </div>
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
