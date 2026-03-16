import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const scribbles = [
  // Large swooping arrows and curves scattered across the viewport
  {
    d: "M 50 200 C 150 100, 300 150, 350 50",
    x: "5%",
    y: "10%",
    rotate: 15,
    scale: 1.2,
    parallaxRange: [-30, 30] as [number, number],
  },
  {
    d: "M 0 50 C 80 120, 200 0, 300 80 L 290 70 M 300 80 L 285 88",
    x: "70%",
    y: "8%",
    rotate: -10,
    scale: 1,
    parallaxRange: [-50, 50] as [number, number],
  },
  {
    d: "M 30 0 C 100 80, 20 160, 120 200",
    x: "85%",
    y: "25%",
    rotate: 25,
    scale: 0.8,
    parallaxRange: [-40, 40] as [number, number],
  },
  {
    d: "M 300 180 C 200 120, 100 200, 0 100 L 12 108 M 0 100 L 8 85",
    x: "8%",
    y: "45%",
    rotate: -5,
    scale: 1.1,
    parallaxRange: [-60, 60] as [number, number],
  },
  {
    d: "M 0 150 Q 150 0, 300 150 Q 150 300, 0 150",
    x: "75%",
    y: "55%",
    rotate: 30,
    scale: 0.7,
    parallaxRange: [-35, 35] as [number, number],
  },
  {
    d: "M 20 0 C 60 50, 10 100, 80 130 C 150 160, 50 200, 100 250 L 92 240 M 100 250 L 108 238",
    x: "3%",
    y: "72%",
    rotate: 8,
    scale: 0.9,
    parallaxRange: [-45, 45] as [number, number],
  },
  {
    d: "M 250 0 C 180 80, 280 120, 200 200",
    x: "80%",
    y: "78%",
    rotate: -20,
    scale: 1,
    parallaxRange: [-55, 55] as [number, number],
  },
];

const ScribblePath = ({
  scribble,
  index,
}: {
  scribble: (typeof scribbles)[number];
  index: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    scribble.parallaxRange
  );

  return (
    <motion.div
      ref={ref}
      className="absolute pointer-events-none"
      style={{
        left: scribble.x,
        top: scribble.y,
        y,
      }}
    >
      <svg
        width="320"
        height="260"
        viewBox="0 0 320 260"
        fill="none"
        className="text-foreground"
        style={{
          transform: `rotate(${scribble.rotate}deg) scale(${scribble.scale})`,
          opacity: 0.06 + (index % 3) * 0.02,
        }}
      >
        <defs>
          <filter id={`scribble-wobble-${index}`}>
            <feTurbulence
              type="turbulence"
              baseFrequency="0.015"
              numOctaves="2"
              result="turbulence"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="turbulence"
              scale="3"
            />
          </filter>
        </defs>
        <path
          d={scribble.d}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={`url(#scribble-wobble-${index})`}
        />
      </svg>
    </motion.div>
  );
};

const BackgroundScribbles = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {scribbles.map((scribble, i) => (
        <ScribblePath key={i} scribble={scribble} index={i} />
      ))}
    </div>
  );
};

export default BackgroundScribbles;
