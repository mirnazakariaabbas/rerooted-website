import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";

function useCountUp(end: number, duration = 1500, start = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf: number;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / duration, 1);
      setValue(Math.round(p * end));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, end, duration]);
  return value;
}

const StatCard = ({
  value,
  label,
  index,
  inView,
}: {
  value: string;
  label: string;
  index: number;
  inView: boolean;
}) => (
  <motion.div
    className="rounded-2xl bg-card p-6"
    initial={{ opacity: 0, x: 60 }}
    animate={inView ? { opacity: 1, x: 0 } : {}}
    transition={{ duration: 0.6, delay: 0.3 + index * 0.3, ease: "easeOut" }}
  >
    <p className="text-secondary font-extrabold text-4xl leading-tight">{value}</p>
    <p className="text-foreground font-normal text-base mt-1">{label}</p>
  </motion.div>
);

interface ProblemStatsProps {
  label: string;
  headline: string;
  closingLine?: string | null;
}

const ProblemStats = ({ label, headline, closingLine }: ProblemStatsProps) => {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });

  const bigStat = useCountUp(98, 1500, inView);
  const smallStat1 = useCountUp(20, 1500, inView);

  return (
    <section ref={ref} className="relative w-full bg-primary py-20 md:py-28 overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12">
        <motion.p
          className="text-secondary text-xs font-semibold uppercase tracking-[3px] mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          {label}
        </motion.p>

        <motion.h2
          className="text-primary-foreground font-extrabold text-3xl md:text-[44px] leading-tight mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {headline}
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          <div>
            <motion.p
              className="text-secondary font-black text-[80px] md:text-[120px] leading-none"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {bigStat}%
            </motion.p>
            <motion.p
              className="text-primary-foreground font-normal text-lg mt-2"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              of expats report burnout symptoms
            </motion.p>
          </div>

          <div className="flex flex-col gap-4">
            <StatCard value={`10–${smallStat1}%`} label="come home early" index={0} inView={inView} />
            <StatCard value="1 in 3" label="never meet expectations" index={1} inView={inView} />
          </div>
        </div>

        {closingLine && (
          <motion.p
            className="text-primary-foreground/80 text-base mt-10 max-w-2xl"
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 1.0 }}
          >
            {closingLine}
          </motion.p>
        )}

        <motion.p
          className="text-primary-foreground/50 text-xs mt-12"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 1.2 }}
        >
          Source: Black &amp; Gregersen, HBR; Cigna Global (11,922 respondents)
        </motion.p>
      </div>
    </section>
  );
};

export default ProblemStats;
