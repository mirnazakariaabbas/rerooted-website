import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { LogIn } from "lucide-react";
import { useAudience } from "@/contexts/AudienceContext";
import logoWhite from "@/assets/logo-wordmark-white.png";

const AudienceGate = () => {
  const { gateOpen, setGateOpen, setAudience, audience } = useAudience();
  const [hoveredButton, setHoveredButton] = useState<"org" | "individual" | null>(null);
  const [zoomRect, setZoomRect] = useState<Rect | null>(null);
  const orgBtnRef = useRef<HTMLButtonElement>(null);
  const indBtnRef = useRef<HTMLButtonElement>(null);
  const notSureRef = useRef<HTMLParagraphElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Auto-dismiss the gate when user arrives via a hash anchor (e.g. /#journey)
  useEffect(() => {
    if (gateOpen && location.hash) {
      if (!audience) setAudience("organization");
      setGateOpen(false);
    }
  }, [location.hash, gateOpen, audience, setAudience, setGateOpen]);

  useEffect(() => {
    if (gateOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [gateOpen]);

  const handleSelect = (
    choice: "organization" | "individual",
    origin: HTMLElement | null,
  ) => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    if (origin) {
      const r = origin.getBoundingClientRect();
      setZoomRect({ x: r.left, y: r.top, width: r.width, height: r.height });
    } else {
      setZoomRect({
        x: window.innerWidth / 2 - 40,
        y: window.innerHeight / 2 - 20,
        width: 80,
        height: 40,
      });
    }
    setAudience(choice);
    // Let exit animation play before unmount
    setTimeout(() => setGateOpen(false), 50);
  };

  // Compute scale needed to cover viewport from the rect
  const scaleFactor = zoomRect
    ? Math.max(
        (window.innerWidth * 2.2) / zoomRect.width,
        (window.innerHeight * 2.2) / zoomRect.height,
      )
    : 25;

  return (
    <AnimatePresence onExitComplete={() => setZoomRect(null)}>
      {gateOpen && (
        <motion.div
          className="fixed inset-0 z-50 overflow-hidden bg-primary"
          initial={false}
          exit={{ transition: { duration: 0 } }}
        >
          {/* Gate chrome: pulls focus back as camera flies in */}
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center px-6 pb-24"
            initial={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{
              opacity: 0,
              scale: 0.92,
              filter: "blur(8px)",
              transition: { duration: 0.55, ease: [0.7, 0, 0.2, 1] },
            }}
          >
            {/* Login button, top right */}
            <motion.button
              onClick={() => navigate("/auth")}
              className="absolute right-6 top-6 flex items-center gap-2 rounded-full border-2 border-primary-foreground/60 px-5 py-2 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:border-primary-foreground hover:bg-primary-foreground hover:text-primary cursor-pointer md:right-10 md:top-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4, duration: 0.5 }}
            >
              <LogIn className="h-4 w-4" />
              Login
            </motion.button>

            {/* Logo */}
            <motion.div
              className="mb-2 h-52 w-[28rem] overflow-hidden md:h-72 md:w-[38rem]"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
            >
              <img
                src={logoWhite}
                alt="Re-Rooted® logo"
                className="h-80 w-full object-contain object-center md:h-[27.5rem]"
              />
            </motion.div>

            {/* Tagline */}
            <motion.p
              className="mb-6 text-lg font-light italic tracking-wide text-primary-foreground md:text-xl"
              style={{ fontWeight: 300 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              The human side of relocation
            </motion.p>

            {/* Prompt */}
            <motion.p
              className="mb-6 text-lg font-semibold tracking-wide text-primary-foreground md:text-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0, duration: 0.5 }}
            >
              Choose your path
            </motion.p>

            {/* Buttons */}
            <motion.div
              className="flex flex-col items-center gap-6 sm:flex-row sm:gap-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6, ease: "easeOut" }}
            >
              <div className="flex flex-col items-center">
                <motion.button
                  ref={orgBtnRef}
                  onClick={() => handleSelect("organization", orgBtnRef.current)}
                  onMouseEnter={() => setHoveredButton("org")}
                  onMouseLeave={() => setHoveredButton(null)}
                  className="rounded-lg border-2 border-primary-foreground bg-transparent px-10 py-5 text-lg font-semibold tracking-wide text-primary-foreground transition-all duration-300 hover:bg-primary-foreground hover:text-primary md:text-xl"
                  animate={{ scale: [1, 1.03, 1] }}
                  transition={{ delay: 1.8, duration: 0.8, ease: "easeInOut" }}
                >
                  I'm an organization
                </motion.button>
                <motion.p
                  className="mt-3 h-6 max-w-[280px] text-center text-sm text-primary-foreground/80"
                  initial={false}
                  animate={{ opacity: hoveredButton === "org" ? 1 : 0, y: hoveredButton === "org" ? 0 : 4 }}
                  transition={{ duration: 0.25 }}
                >
                  Maximize the return on your international relocation assignments
                </motion.p>
              </div>

              <div className="flex flex-col items-center">
                <motion.button
                  ref={indBtnRef}
                  onClick={() => handleSelect("individual", indBtnRef.current)}
                  onMouseEnter={() => setHoveredButton("individual")}
                  onMouseLeave={() => setHoveredButton(null)}
                  className="rounded-lg border-2 border-primary-foreground bg-transparent px-10 py-5 text-lg font-semibold tracking-wide text-primary-foreground transition-all duration-300 hover:bg-primary-foreground hover:text-primary md:text-xl"
                  animate={{ scale: [1, 1.03, 1] }}
                  transition={{ delay: 2.0, duration: 0.8, ease: "easeInOut" }}
                >
                  I'm an individual
                </motion.button>
                <motion.p
                  className="mt-3 h-6 max-w-[280px] text-center text-sm text-primary-foreground/80"
                  initial={false}
                  animate={{ opacity: hoveredButton === "individual" ? 1 : 0, y: hoveredButton === "individual" ? 0 : 4 }}
                  transition={{ duration: 0.25 }}
                >
                  Take control of your relocation journey
                </motion.p>
              </div>
            </motion.div>

            {/* Not sure link */}
            <motion.p
              ref={notSureRef}
              className="mt-10 cursor-pointer text-sm text-primary-foreground/60 transition-colors hover:text-primary-foreground/90"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6, duration: 0.5 }}
              onClick={() => handleSelect("organization", notSureRef.current)}
            >
              Not sure? Start here →
            </motion.p>
          </motion.div>

          {/* Zoom-into-button portal overlay */}
          {zoomRect && (
            <motion.div
              className="pointer-events-none absolute rounded-lg border-2 border-primary-foreground bg-primary-foreground"
              style={{
                left: zoomRect.x,
                top: zoomRect.y,
                width: zoomRect.width,
                height: zoomRect.height,
                transformOrigin: "center center",
              }}
              initial={{ scale: 1, opacity: 0, borderRadius: 8 }}
              exit={{
                scale: [1, 1.06, scaleFactor],
                opacity: [0.0, 1, 0],
                borderRadius: [8, 8, 0],
                transition: {
                  duration: 1.1,
                  ease: [0.7, 0, 0.2, 1],
                  times: [0, 0.12, 1],
                },
              }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AudienceGate;
