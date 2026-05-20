import { useRef } from "react";
import { useInView } from "framer-motion";

/**
 * Hand-sketched tree that draws itself once when scrolled into view.
 * Pure SVG + CSS keyframes (stroke-dashoffset for lines, opacity for leaves).
 */
const STROKE = "#1F299C";

type LinePath = { d: string; len: number; delay: number; dur: number };
type Leaf = { cx: number; cy: number; r: number; delay: number };

// Generous over-estimates of path length are fine for stroke-dasharray.
const ROOTS: LinePath[] = [
  { d: "M200 360 C 170 380, 130 400, 80 430", len: 200, delay: 0.4, dur: 2.2 },
  { d: "M200 360 C 180 385, 160 410, 130 460", len: 180, delay: 0.7, dur: 2.0 },
  { d: "M200 360 C 200 390, 200 420, 200 470", len: 160, delay: 1.0, dur: 1.8 },
  { d: "M200 360 C 220 385, 240 410, 270 460", len: 180, delay: 1.3, dur: 2.0 },
  { d: "M200 360 C 230 380, 270 400, 320 430", len: 200, delay: 1.6, dur: 2.2 },
  { d: "M200 360 C 160 370, 110 380, 60 395", len: 200, delay: 1.9, dur: 2.0 },
  { d: "M200 360 C 240 370, 290 380, 340 395", len: 200, delay: 2.2, dur: 2.0 },
];

const MAIN_BRANCHES: LinePath[] = [
  { d: "M198 260 C 170 240, 130 220, 90 180", len: 220, delay: 1.7, dur: 1.6 },
  { d: "M202 220 C 230 200, 270 180, 310 150", len: 220, delay: 2.1, dur: 1.6 },
  { d: "M199 180 C 175 160, 145 145, 115 130", len: 180, delay: 2.5, dur: 1.5 },
  { d: "M201 150 C 225 130, 255 115, 285 100", len: 180, delay: 2.9, dur: 1.5 },
  { d: "M200 120 C 210 95, 215 75, 220 50", len: 160, delay: 3.3, dur: 1.5 },
  { d: "M200 200 C 190 175, 185 150, 180 120", len: 170, delay: 3.7, dur: 1.5 },
];

const SMALL_BRANCHES: LinePath[] = [
  { d: "M120 195 C 100 180, 85 170, 70 165", len: 80, delay: 3.8, dur: 1.0 },
  { d: "M130 220 C 110 215, 95 215, 80 220", len: 70, delay: 4.1, dur: 1.0 },
  { d: "M280 160 C 300 145, 315 140, 330 138", len: 80, delay: 4.4, dur: 1.0 },
  { d: "M260 135 C 280 120, 295 112, 310 108", len: 80, delay: 4.7, dur: 1.0 },
  { d: "M165 145 C 150 130, 140 120, 130 110", len: 70, delay: 5.0, dur: 1.0 },
  { d: "M235 115 C 250 100, 260 90, 268 80", len: 70, delay: 5.3, dur: 1.0 },
  { d: "M210 80 C 220 65, 225 55, 230 45", len: 60, delay: 5.6, dur: 1.0 },
  { d: "M190 95 C 180 80, 175 70, 172 58", len: 60, delay: 5.9, dur: 1.0 },
];

const LEAVES: Leaf[] = [
  { cx: 70, cy: 160, r: 18, delay: 6.0 },
  { cx: 95, cy: 175, r: 14, delay: 6.2 },
  { cx: 115, cy: 125, r: 16, delay: 6.4 },
  { cx: 75, cy: 220, r: 15, delay: 6.6 },
  { cx: 130, cy: 105, r: 14, delay: 6.8 },
  { cx: 170, cy: 105, r: 16, delay: 7.0 },
  { cx: 195, cy: 55, r: 18, delay: 7.2 },
  { cx: 225, cy: 40, r: 16, delay: 7.4 },
  { cx: 260, cy: 75, r: 15, delay: 7.6 },
  { cx: 290, cy: 100, r: 17, delay: 7.8 },
  { cx: 315, cy: 130, r: 14, delay: 8.0 },
  { cx: 335, cy: 135, r: 16, delay: 8.2 },
  { cx: 175, cy: 145, r: 13, delay: 8.4 },
  { cx: 230, cy: 130, r: 13, delay: 8.6 },
  { cx: 155, cy: 175, r: 12, delay: 8.8 },
  { cx: 250, cy: 170, r: 14, delay: 9.0 },
];

const TRUNK = {
  d: "M200 470 C 195 400, 205 330, 198 260 C 192 220, 208 180, 200 120 C 196 90, 204 60, 200 30",
  len: 470,
  delay: 0,
  dur: 1.5,
};

interface AnimatedTreeProps {
  className?: string;
}

const AnimatedTree = ({ className = "" }: AnimatedTreeProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });

  const lineStyle = (len: number, delay: number, dur: number): React.CSSProperties => ({
    strokeDasharray: len,
    strokeDashoffset: inView ? 0 : len,
    transition: `stroke-dashoffset ${dur}s ease-in-out ${delay}s`,
  });

  const leafStyle = (delay: number): React.CSSProperties => ({
    opacity: inView ? 0.18 : 0,
    transition: `opacity 0.8s ease-out ${delay}s`,
  });

  return (
    <div
      ref={ref}
      className={`w-full flex items-center justify-center ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 400 500"
        className="h-auto w-[260px] md:w-[380px]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g
          stroke={STROKE}
          strokeWidth={3.2}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        >
          {/* Trunk */}
          <path d={TRUNK.d} style={lineStyle(TRUNK.len, TRUNK.delay, TRUNK.dur)} />

          {/* Roots */}
          {ROOTS.map((r, i) => (
            <path key={`root-${i}`} d={r.d} strokeWidth={2.6} style={lineStyle(r.len, r.delay, r.dur)} />
          ))}

          {/* Main branches */}
          {MAIN_BRANCHES.map((b, i) => (
            <path key={`mb-${i}`} d={b.d} strokeWidth={2.8} style={lineStyle(b.len, b.delay, b.dur)} />
          ))}

          {/* Smaller branches */}
          {SMALL_BRANCHES.map((b, i) => (
            <path key={`sb-${i}`} d={b.d} strokeWidth={1.8} style={lineStyle(b.len, b.delay, b.dur)} />
          ))}
        </g>

        {/* Leaf clusters */}
        <g fill={STROKE} stroke={STROKE} strokeWidth={1.2}>
          {LEAVES.map((l, i) => (
            <circle key={`leaf-${i}`} cx={l.cx} cy={l.cy} r={l.r} style={leafStyle(l.delay)} />
          ))}
        </g>
      </svg>
    </div>
  );
};

export default AnimatedTree;
