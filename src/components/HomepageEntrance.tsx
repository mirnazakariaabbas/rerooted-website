import { ReactNode, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Wraps the homepage so that the first reveal after the cinematic intro
 * runs a staggered settle-in. Subsequent re-renders skip the entrance.
 *
 * Usage: pass `active=true` while the portal overlay is on screen. When
 * it flips back to false, the entrance plays exactly once.
 */

type Props = {
  active: boolean;
  children: ReactNode;
};

const HomepageEntrance = ({ active, children }: Props) => {
  const prefersReduced = useReducedMotion();
  const [playing, setPlaying] = useState(false);
  const armedRef = useRef(false);
  const playedRef = useRef(false);

  useEffect(() => {
    if (active && !playedRef.current) {
      armedRef.current = true;
      return;
    }
    if (!active && armedRef.current && !playedRef.current) {
      playedRef.current = true;
      setPlaying(true);
    }
  }, [active]);

  if (!playing || prefersReduced) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, y: 25 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      style={{ willChange: "transform, opacity" }}
      onAnimationComplete={() => setPlaying(false)}
    >
      {children}
    </motion.div>
  );
};

export default HomepageEntrance;
