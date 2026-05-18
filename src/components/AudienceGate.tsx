import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { LogIn } from "lucide-react";
import { useAudience } from "@/contexts/AudienceContext";
import logoWhite from "@/assets/logo-wordmark-white.png";

const AudienceGate = () => {
  const { gateOpen, setGateOpen, setAudience, audience } = useAudience();
  const [hoveredButton, setHoveredButton] = useState<"org" | "individual" | null>(null);
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

  const handleSelect = (choice: "organization" | "individual") => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    setAudience(choice);
    setGateOpen(false);
  };

  return (
    <AnimatePresence>
      {gateOpen && (
        <motion.div
          className="fixed inset-0 z-50 overflow-hidden"
          initial={false}
          exit={{ transition: { duration: 0 } }}
        >
          {/* Left curtain panel */}
          <motion.div
            className="absolute inset-y-0 left-0 w-1/2 bg-primary"
            initial={{ x: 0 }}
            exit={{ x: "-101%" }}
            transition={{ duration: 1.1, ease: [0.83, 0, 0.17, 1], delay: 0.25 }}
          />
          {/* Right curtain panel */}
          <motion.div
            className="absolute inset-y-0 right-0 w-1/2 bg-primary"
            initial={{ x: 0 }}
            exit={{ x: "101%" }}
            transition={{ duration: 1.1, ease: [0.83, 0, 0.17, 1], delay: 0.25 }}
          />
          {/* Thin gold seam that flashes at the split */}
          <motion.div
            className="pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-primary-foreground"
            initial={{ opacity: 0, scaleY: 0 }}
            exit={{ opacity: [0, 1, 0], scaleY: [0, 1, 1] }}
            transition={{ duration: 0.6, ease: "easeOut", times: [0, 0.4, 1] }}
            style={{ transformOrigin: "center" }}
          />
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center px-6 pb-24"
          initial={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -24, filter: "blur(6px)", transition: { duration: 0.45, ease: "easeIn" } }}
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
                onClick={() => handleSelect("organization")}
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
                onClick={() => handleSelect("individual")}
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
            className="mt-10 cursor-pointer text-sm text-primary-foreground/60 transition-colors hover:text-primary-foreground/90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6, duration: 0.5 }}
            onClick={() => handleSelect("organization")}
          >
            Not sure? Start here →
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AudienceGate;
