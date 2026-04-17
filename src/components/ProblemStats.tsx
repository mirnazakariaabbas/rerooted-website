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

interface OutlineStatProps {
  number: React.ReactNode;
  label: string;
  inView: boolean;
  delay: number;
}

const OutlineStat = ({ number, label, inView, delay }: OutlineStatProps) => (
  <motion.div
    className="relative flex flex-col items-center justify-center text-center rounded-xl border border-[#CDCCCD] bg-white p-6 md:p-8 min-h-[200px] md:min-h-0 overflow-hidden"
    initial={{ opacity: 0, y: 30 }}
    animate={inView ? { opacity: 1, y: 0 } : {}}
    transition={{ duration: 0.6, delay: delay / 1000, ease: "easeOut" }}
  >
    <p
      className="font-black text-primary leading-[0.9] tracking-tight"
      style={{ fontSize: "clamp(48px, 7vw, 84px)" }}
    >
      {number}
    </p>
    <p className="text-foreground/80 font-medium text-sm md:text-base mt-4 leading-snug uppercase tracking-wide">
      {label}
    </p>
  </motion.div>
);

interface ProblemStatsProps {
  label: string;
  headline: string;
  closingLine?: string | null;
}

const ProblemStats = ({ label, headline, closingLine }: ProblemStatsProps) => {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  const hero98 = useCountUp(98, 1800, inView, 100);
  const stat43 = useCountUp(43, 1800, inView, 400);
  const oneIn = useOneInCountdown(3, 1800, inView, 600);
  const stat42 = useCountUp(42, 1800, inView, 800);
  const stat80 = useCountUp(80, 1800, inView, 1000);

  return (
    <section
      ref={ref}
      className="relative w-full bg-[#FAF9F6] py-20 md:py-28 overflow-hidden"
    >
      {/* Subtle grid pattern background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right, hsl(var(--primary)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--primary)) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
        aria-hidden
      />

      <div className="container relative mx-auto px-6 lg:px-12">
        <motion.p
          className="text-secondary text-xs font-semibold uppercase tracking-[3px] mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          {label}
        </motion.p>

        <motion.h2
          className="text-primary font-black text-3xl md:text-[44px] leading-tight mb-12 max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {headline}
        </motion.h2>

        {/* Asymmetric grid */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.6fr_1fr] grid-rows-[auto] md:grid-rows-2 gap-4 md:gap-5">
          {/* HERO — center, spans 2 rows on md+ */}
          <motion.div
            className="relative flex flex-col justify-between rounded-xl bg-primary p-8 md:p-10 md:row-span-2 order-first md:order-none min-h-[280px] md:min-h-[420px] overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          >
            {/* Faded watermark */}
            <span
              className="pointer-events-none absolute -right-6 -bottom-10 font-black text-white/[0.06] leading-none select-none"
              style={{ fontSize: "clamp(180px, 28vw, 360px)" }}
              aria-hidden
            >
              98
            </span>

            <div className="relative">
              <span className="text-white/70 text-xs font-semibold uppercase tracking-[3px]">
                The headline figure
              </span>
            </div>

            <div className="relative flex items-end">
              <p
                className="font-black text-white leading-[0.85] tracking-tight"
                style={{ fontSize: "clamp(96px, 14vw, 200px)" }}
              >
                {hero98}
              </p>
              <span
                className="font-black text-secondary leading-[0.85] ml-2"
                style={{ fontSize: "clamp(48px, 7vw, 96px)" }}
              >
                %
              </span>
            </div>

            <p className="relative text-white text-base md:text-lg font-medium max-w-xs">
              of expats report burnout symptoms during international assignments
            </p>
          </motion.div>

          {/* Top-left */}
          <OutlineStat
            number={<>{stat43}<span className="text-secondary">%</span></>}
            label="report a negative impact on their work performance"
            inView={inView}
            delay={400}
          />

          {/* Top-right */}
          <OutlineStat
            number={
              <span className="whitespace-nowrap">
                1 <span className="text-foreground/50 font-bold text-[0.55em] align-middle">in</span>{" "}
                {oneIn}
              </span>
            }
            label="don't meet performance expectations abroad"
            inView={inView}
            delay={600}
          />

          {/* Bottom-left */}
          <OutlineStat
            number={<>{stat42}<span className="text-secondary">%</span></>}
            label="have considered leaving their employer due to relocation stress"
            inView={inView}
            delay={800}
          />

          {/* Bottom-right */}
          <OutlineStat
            number={<>{stat80}<span className="text-secondary">%</span></>}
            label="take over a year to recover productivity, or never fully do"
            inView={inView}
            delay={1000}
          />
        </div>

        {closingLine && (
          <motion.p
            className="text-foreground/70 text-base mt-10 max-w-2xl"
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 1.2 }}
          >
            {closingLine}
          </motion.p>
        )}

        <motion.p
          className="text-foreground/50 text-xs mt-12"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 1.4 }}
        >
          Source: Black &amp; Gregersen, HBR; Cigna Global (11,922 respondents)
        </motion.p>
        <motion.p
          className="text-foreground/40 font-light mt-1"
          style={{ fontSize: "11px" }}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 1.5 }}
        >
          Statistics are drawn from published research and may reflect varied methodologies.
        </motion.p>
      </div>
    </section>
  );
};

export default ProblemStats;
