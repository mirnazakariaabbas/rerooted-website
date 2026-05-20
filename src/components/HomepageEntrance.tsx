import { ReactNode, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Wraps the homepage so that the first reveal after the cinematic intro
 * runs a staggered settle-in. Subsequent re-renders (e.g. audience toggle)
 * skip the entrance.
 *
 * Children using `data-hero-stagger="headline|sub|cta|cards"` will be
 * animated in sequence via CSS variables on the wrapper.
 */

type Props = {
  /** Trigger the entrance. Flip from false -> true exactly once. */
  active: boolean;
  children: ReactNode;
};

const HomepageEntrance = ({ active, children }: Props) => {
  const prefersReduced = useReducedMotion();
  const [hasEntered, setHasEntered] = useState(false);
  const firedRef = useRef(false);

  useEffect(() => {
    if (active && !firedRef.current) {
      firedRef.current = true;
      setHasEntered(true);
    }
  }, [active]);

  if (!hasEntered || prefersReduced) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, y: 25 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      style={{ willChange: "transform, opacity" }}
    >
      {children}
    </motion.div>
  );
};

export default HomepageEntrance;
