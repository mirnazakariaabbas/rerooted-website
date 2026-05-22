import { useRef, useEffect, useState, ReactNode } from "react";
import { motion, useInView } from "framer-motion";
import mountainImg from "@/assets/problem-mountain.webp";
import cityImg from "@/assets/problem-city.webp";
import planeImg from "@/assets/problem-plane.jpg";
import logoWhite from "@/assets/logo-white.png";

// Cubic ease-out count-up
function useCountUp(end: number, duration = 1800, start = false, delay = 0, from = 0) {
  const [value, setValue] = useState(from);
  useEffect(() => {
    if (!start) return;
    let raf: number;
    let timeoutId: number;
    const begin = () => {
      const t0 = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - t0) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setValue(Math.round(from + eased * (end - from)));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };
    timeoutId = window.setTimeout(begin, delay);
    return () => {
      window.clearTimeout(timeoutId);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [start, end, duration, delay, from]);
  return value;
}


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

const serif = { fontFamily: '"DM Sans", system-ui, sans-serif', fontWeight: 400 } as const;

const ProblemStats = ({ label, headline }: ProblemStatsProps) => {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });

  const oneIn = useOneInCountdown(3, 1800, inView, 200);
  const stat42 = useCountUp(42, 1800, inView, 300);
  const stat98 = useCountUp(98, 2000, inView, 400, 90);
  const stat80 = useCountUp(80, 1800, inView, 500);

  // Tile types for the 3x2 grid
  type Tile =
    | { kind: "stat-blue"; number: ReactNode; caption: ReactNode }
    | { kind: "stat-cream"; number: ReactNode; caption: ReactNode }
    | { kind: "image"; src: string; eyebrow: string; tagline: string };


  const tiles: Tile[] = [
    {
      kind: "stat-blue",
      number: (
        <>
          <span>1</span>
          <span style={{ ...serif, fontStyle: "italic" }} className="text-[0.45em] mx-[0.08em] text-white/70">in</span>
          <span>{oneIn}</span>
        </>
      ),
      caption: "Don't meet performance expectations abroad.",
    },
    {
      kind: "image",
      src: mountainImg,
      eyebrow: "",
      tagline: "Relocated and Replanted ",
    },
    {
      kind: "stat-blue",
      number: (
        <>
          <span>{stat42}</span>
          <span className="text-white/70">%</span>
        </>
      ),
      caption: "Considered leaving their employer because of relocation stress.",
    },
    {
      kind: "stat-cream",
      number: (
        <>
          <span className="text-primary">{stat98}</span>
          <span className="text-secondary">%</span>
        </>
      ),
      caption: (
        <>
          OF <strong className="font-extrabold">EXPATS</strong> REPORT BURNOUT SYMPTOMS
        </>
      ),
    },


    {
      kind: "image",
      src: cityImg,
      eyebrow: " ",
      tagline: "Roots that travel with you",
    },
    {
      kind: "image",
      src: planeImg,
      eyebrow: "",
      tagline: "",
      // We'll show 80% over this image instead of Re-Rooted mark
    },
  ];

  return (
    <section
      ref={ref}
      id="problem"
      data-dark="1"
      className="relative w-full bg-[#0A0A0A] pt-10 pb-24 md:pt-14 md:pb-32 overflow-hidden"
    >
      <div className="max-w-[1320px] mx-auto px-6 md:px-12">
        {/* Header row: eyebrow left, headline right */}
        <motion.div
          className="mb-14 md:mb-20 mt-0"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >

          <h2 className="font-display m-0 text-white font-medium leading-[0.96] tracking-[-0.055em] text-[clamp(34px,4.4vw,64px)] text-left px-0">
            {headline}
          </h2>
        </motion.div>

        {/* 3x2 grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {tiles.map((tile, i) => {
            const common = "relative aspect-[3/4] overflow-hidden";
            if (tile.kind === "stat-blue") {
              return (
                <motion.div
                  key={i}
                  className={`${common} bg-primary flex flex-col justify-between p-6 md:p-8`}
                  initial={{ opacity: 0, y: 24 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.1 + i * 0.06 }}
                >
                  <div className="flex-1 flex items-center justify-center">
                    <div
                      className="text-white leading-none flex items-baseline"
                      style={{ ...serif, fontStyle: "italic", fontSize: "clamp(110px, 14vw, 200px)" }}
                    >
                      {tile.number}
                    </div>
                  </div>
                  <p className="text-white/85 text-sm md:text-base text-center max-w-[26ch] mx-auto leading-snug">
                    {tile.caption}
                  </p>
                </motion.div>
              );
            }
            if (tile.kind === "stat-cream") {
              return (
                <motion.div
                  key={i}
                  className={`${common} bg-[#FAF9F6] flex flex-col justify-center items-center gap-4 p-6 md:p-8`}
                  initial={{ opacity: 0, y: 24 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.1 + i * 0.06 }}
                >
                  <div className="flex-1 flex items-center justify-center w-full">
                    <div
                      className="leading-none flex items-baseline"
                      style={{ ...serif, fontStyle: "italic", fontSize: "clamp(110px, 14vw, 200px)" }}
                    >
                      {tile.number}
                    </div>
                  </div>
                  <p className="text-primary text-xs md:text-sm text-center max-w-[26ch] mx-auto leading-tight font-semibold uppercase tracking-[0.06em]">
                    {tile.caption}
                  </p>
                </motion.div>
              );
            }

            // image tile
            const isPlane = tile.src === planeImg;
            return (
              <motion.div
                key={i}
                className={common}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 + i * 0.06 }}
              >
                <img
                  src={tile.src}
                  alt=""
                  loading="lazy"
                  width={1024}
                  height={1024}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/50" />
                <div className="relative h-full flex flex-col justify-between p-6 md:p-7">
                  <p
                    className="text-white text-[11px] md:text-xs font-semibold uppercase tracking-[0.2em] whitespace-pre-line leading-snug max-w-[26ch]"
                  >
                    {tile.eyebrow}
                  </p>

                  {isPlane ? (
                    <div className="flex-1 flex items-center justify-center -mt-4">
                      <div
                        className="text-white leading-none flex items-baseline"
                        style={{ ...serif, fontStyle: "italic", fontSize: "clamp(110px, 14vw, 200px)" }}
                      >
                        <span>{stat80}</span>
                        <span className="text-white/80">%</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="flex justify-center">
                        <img
                          src={logoWhite}
                          alt="Re-Rooted"
                          className="w-3/4 max-w-[280px] h-auto"
                        />
                      </div>
                      {tile.tagline && (
                        <div className="mt-3 text-white text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.22em]">
                          {tile.tagline}
                        </div>
                      )}
                    </div>
                  )}

                  {isPlane && (
                    <p className="text-white/85 text-sm md:text-base text-center max-w-[26ch] mx-auto leading-snug">
                      Take over a year to recover productivity, or never fully do.
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default ProblemStats;
