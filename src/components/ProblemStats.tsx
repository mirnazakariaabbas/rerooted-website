import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";

// Cubic ease-out count-up
function useCountUp(end: number, duration = 1800, start = false, delay = 0) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf: number;
    let timeoutId: number;
    const begin = () => {
      const t0 = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - t0) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setValue(Math.round(eased * end));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };
    timeoutId = window.setTimeout(begin, delay);
    return () => {
      window.clearTimeout(timeoutId);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [start, end, duration, delay]);
  return value;
}

// "1 in N" counter that animates from 10 down to target
function useOneInCountdown(target: number, duration = 1800, start = false, delay = 0) {
  const [value, setValue] = useState(10);
  useEffect(() => {
    if (!start) return;
    let raf: number;
    let timeoutId: number;
    const begin = () => {
      const from = 10;
      const t0 = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - t0) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        const v = Math.round(from - eased * (from - target));
        setValue(v);
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };
    timeoutId = window.setTimeout(begin, delay);
    return () => {
      window.clearTimeout(timeoutId);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [start, target, duration, delay]);
  return value;
}

interface ProblemStatsProps {
  label: string;
  headline: string;
  closingLine?: string | null;
}

const ProblemStats = ({ label, headline, closingLine }: ProblemStatsProps) => {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  const hero98 = useCountUp(98, 1800, inView, 100);
  const oneIn = useOneInCountdown(3, 1800, inView, 400);
  const stat42 = useCountUp(42, 1800, inView, 600);
  const stat80 = useCountUp(80, 1800, inView, 800);

  const stats = [
    {
      num: <>1</>,
      suffix: <span className="italic"> in {oneIn}</span>,
      italicSuffix: true,
      text: "don't meet performance expectations abroad.",
    },
    {
      num: <>{stat42}</>,
      suffix: <>%</>,
      italicSuffix: false,
      text: "have considered leaving their employer due to relocation stress.",
    },
    {
      num: <>{stat80}</>,
      suffix: <>%</>,
      italicSuffix: false,
      text: "take over a year to recover productivity, or never fully do.",
    },
  ];

  return (
    <section
      ref={ref}
      id="problem"
      className="relative w-full bg-[#FAF9F6] py-24 md:py-40 overflow-hidden"
    >
      <div className="max-w-[1320px] mx-auto px-6 md:px-12 relative">
        {/* Header */}
        <div className="max-w-[780px] mb-20 md:mb-24">
          <motion.div
            className="inline-flex items-center gap-3 mb-6"
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block w-7 h-px bg-secondary" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-secondary">
              {label}
            </span>
          </motion.div>

          <motion.h2
            className="font-black text-primary leading-[1] tracking-tight m-0"
            style={{ fontSize: "clamp(40px, 5.5vw, 84px)" }}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            The problem most companies{" "}
            <em className="italic font-black text-secondary">quietly avoid.</em>
          </motion.h2>

          <motion.p
            className="mt-6 text-base md:text-lg leading-relaxed text-foreground/60 max-w-[58ch]"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Relocation policies handle the logistics. They rarely handle the human cost,
            and the numbers on that cost are remarkably consistent.
          </motion.p>
        </div>

        {/* Layout: anchor stat + stacked beats */}
        <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-16 lg:gap-[120px] items-start">
          {/* Anchor 98% */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary mb-4">
              The headline finding
            </div>
            <div
              className="flex items-start font-black text-primary leading-[0.85] tracking-tight"
            >
              <span style={{ fontSize: "clamp(140px, 20vw, 280px)" }}>
                {hero98}
              </span>
              <span
                className="text-secondary"
                style={{
                  fontSize: "clamp(60px, 8vw, 112px)",
                  marginTop: "0.25em",
                  marginLeft: "0.05em",
                }}
              >
                %
              </span>
            </div>
            <p className="mt-6 text-base md:text-lg leading-snug text-foreground italic font-medium max-w-[30ch]">
              of expats report burnout symptoms during international assignments.
            </p>
          </motion.div>

          {/* Three inline stats */}
          <div className="flex flex-col gap-12 md:gap-14 pt-2 md:pt-8">
            {stats.map((s, i) => (
              <motion.div
                key={i}
                className={`grid grid-cols-1 md:grid-cols-[minmax(180px,260px)_1fr] gap-6 md:gap-10 items-baseline pb-12 md:pb-14 ${
                  i < stats.length - 1 ? "border-b border-primary/15" : ""
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 + i * 0.1 }}
              >
                <div className="flex items-baseline leading-[0.9] text-primary tracking-tight font-black">
                  <span
                    style={{ fontSize: "clamp(60px, 7vw, 112px)" }}
                  >
                    {s.num}
                  </span>
                  <span
                    className="text-secondary font-black whitespace-nowrap"
                    style={{
                      fontSize: "clamp(28px, 3vw, 48px)",
                      marginLeft: s.italicSuffix ? "0.15em" : "0.02em",
                    }}
                  >
                    {s.suffix}
                  </span>
                </div>
                <p className="text-base md:text-lg leading-snug text-foreground italic font-medium max-w-[42ch] m-0">
                  {s.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Closing line */}
        {closingLine !== null && (
          <motion.div
            className="mt-20 md:mt-28 pt-12 border-t border-primary/15 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 md:gap-10 items-end"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <p
              className="font-bold text-primary leading-[1.25] tracking-tight max-w-[32ch] m-0"
              style={{ fontSize: "clamp(22px, 2.4vw, 36px)" }}
            >
              {closingLine ?? (
                <>
                  These aren't edge cases. They're the{" "}
                  <em className="italic text-secondary">default outcome</em>{" "}
                  of treating a human move as a shipping problem.
                </>
              )}
            </p>
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground/60 md:text-right">
              ReRooted exists to change that
            </div>
          </motion.div>
        )}

        {/* Sources at the bottom of the section */}
        <motion.div
          className="mt-16 md:mt-20 pt-6 border-t border-primary/10"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          <p className="text-foreground/70 text-sm">
            Source: Black &amp; Gregersen, HBR; Cigna Global (11,922 respondents)
          </p>
          <p className="text-foreground/40 text-xs font-light mt-1">
            Statistics are drawn from published research and may reflect varied methodologies.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ProblemStats;
