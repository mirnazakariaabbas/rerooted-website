import { useEffect, useMemo, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import logoWhite from "@/assets/logo-wordmark-white.png";

/**
 * Cinematic portal transition.
 *
 * Total runtime ~1.9s. Sequence:
 *   0.00s  Chrome fades + blurs out, logo stays put
 *   0.35s  Logo scales 1 -> 1.15, radial glow pulses
 *   0.70s  Ambient particles drift inward
 *   1.10s  Aperture (white circle at the R counter) scales out, logo scales/rotates
 *   ~1.70s onMidpoint fires (gate closes, homepage entrance begins)
 *   1.90s  onComplete fires (overlay unmounts)
 *
 * Honors prefers-reduced-motion by collapsing to a 300ms fade.
 */

type Props = {
  onMidpoint: () => void;
  onComplete: () => void;
};

const PORTAL_DURATION_MS = 1900;
const MIDPOINT_MS = 1700;

const PortalTransition = ({ onMidpoint, onComplete }: Props) => {
  const prefersReduced = useReducedMotion();
  const midpointFired = useRef(false);
  const completeFired = useRef(false);

  useEffect(() => {
    const total = prefersReduced ? 300 : PORTAL_DURATION_MS;
    const mid = prefersReduced ? 200 : MIDPOINT_MS;

    const t1 = window.setTimeout(() => {
      if (midpointFired.current) return;
      midpointFired.current = true;
      onMidpoint();
    }, mid);

    const t2 = window.setTimeout(() => {
      if (completeFired.current) return;
      completeFired.current = true;
      onComplete();
    }, total);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [onMidpoint, onComplete, prefersReduced]);

  // 10 particles in a soft cloud around the logo, drifting inward
  const particles = useMemo(() => {
    const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
    const count = isMobile ? 6 : 10;
    return Array.from({ length: count }).map((_, i) => {
      // deterministic-ish jitter
      const angle = (i / count) * Math.PI * 2 + (i * 0.37);
      const radius = 180 + ((i * 53) % 120);
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      const size = 6 + ((i * 7) % 8);
      const delay = 0.7 + (i % 5) * 0.06;
      return { id: i, x, y, size, delay };
    });
  }, []);

  if (prefersReduced) {
    return (
      <motion.div
        className="fixed inset-0 z-[60] bg-primary"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        style={{ pointerEvents: "none" }}
      />
    );
  }

  return (
    <motion.div
      className="fixed inset-0 z-[60] overflow-hidden bg-primary"
      style={{ pointerEvents: "none", willChange: "opacity" }}
      initial={{ opacity: 1 }}
      animate={{ opacity: [1, 1, 0] }}
      transition={{
        duration: PORTAL_DURATION_MS / 1000,
        times: [0, MIDPOINT_MS / PORTAL_DURATION_MS, 1],
        ease: "easeOut",
      }}
    >
      {/* Stage: centered logo + glow + aperture + particles */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="relative"
          style={{ willChange: "transform" }}
          initial={{ scale: 1, rotate: 0 }}
          animate={{
            scale: [1, 1.15, 1.15, 12],
            rotate: [0, 0, 0, 2],
            filter: ["blur(0px)", "blur(0px)", "blur(0px)", "blur(6px)"],
          }}
          transition={{
            duration: 1.9,
            times: [0, 0.18, 0.55, 1],
            ease: [0.76, 0, 0.24, 1],
          }}
        >
          {/* Soft radial glow behind the logo */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
              width: 640,
              height: 640,
              background:
                "radial-gradient(circle, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.10) 35%, rgba(255,255,255,0) 70%)",
              willChange: "transform, opacity",
            }}
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: [0, 0.5, 0.2, 0.5], scale: [1, 1.15, 1, 1.2] }}
            transition={{
              duration: 1.6,
              delay: 0.1,
              times: [0, 0.35, 0.65, 1],
              ease: "easeInOut",
            }}
          />

          {/* Ambient particles drifting toward the logo */}
          {particles.map((p) => (
            <motion.span
              key={p.id}
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 rounded-full bg-white"
              style={{
                width: p.size,
                height: p.size,
                marginLeft: -p.size / 2,
                marginTop: -p.size / 2,
                willChange: "transform, opacity",
              }}
              initial={{ x: p.x, y: p.y, opacity: 0, scale: 0.8 }}
              animate={{
                x: [p.x, p.x * 0.2],
                y: [p.y, p.y * 0.2],
                opacity: [0, 0.4, 0],
                scale: [0.8, 1.2, 0.9],
              }}
              transition={{
                duration: 1.1,
                delay: p.delay,
                ease: "easeInOut",
              }}
            />
          ))}

          {/* The wordmark logo */}
          <div className="relative h-52 w-[28rem] overflow-visible md:h-72 md:w-[38rem]">
            <img
              src={logoWhite}
              alt=""
              aria-hidden
              className="h-full w-full object-contain object-center"
              draggable={false}
            />

            {/* Aperture — the white "portal" emerging from the R counter.
                Positioned over the R's hollow (left third of the wordmark). */}
            <motion.div
              aria-hidden
              className="pointer-events-none absolute rounded-full bg-[#FAF9F6]"
              style={{
                width: 36,
                height: 36,
                left: "18%",
                top: "44%",
                transform: "translate(-50%, -50%)",
                willChange: "transform, opacity",
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 0.4, 40], opacity: [0, 0.6, 1] }}
              transition={{
                duration: 1.2,
                delay: 0.75,
                times: [0, 0.25, 1],
                ease: [0.76, 0, 0.24, 1],
              }}
            />
          </div>
        </motion.div>
      </div>

      {/* Subtle depth tint that warms the background through the zoom */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(250,249,246,0.0) 30%, rgba(250,249,246,0.18) 100%)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.5, 1] }}
        transition={{ duration: 1.6, times: [0, 0.5, 1], ease: "easeOut" }}
      />
    </motion.div>
  );
};

export default PortalTransition;
