import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";
import { useAudience } from "@/contexts/AudienceContext";
import logoWhite from "@/assets/logo-wordmark-white.png";

const AudienceGate = () => {
  const { gateOpen, setGateOpen, setAudience } = useAudience();
  const [hoveredButton, setHoveredButton] = useState<"org" | "individual" | null>(null);
  const navigate = useNavigate();

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
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-primary px-6 pb-24"
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* Login button — top right */}
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
                className="rounded-lg border-2 border-primary-foreground bg-primary-foreground px-10 py-5 text-lg font-semibold tracking-wide text-primary shadow-[0_0_20px_rgba(255,255,255,0.25)] transition-all duration-300 hover:bg-transparent hover:text-primary-foreground md:text-xl"
                animate={{ scale: [1, 1.03, 1] }}
                transition={{ delay: 1.8, duration: 0.8, ease: "easeInOut" }}
              >
                I'm an organization
              </motion.button>
              <p className="mt-3 h-6 max-w-[280px] text-center text-sm text-primary-foreground/60">
                Maximize the return on your international relocation assignments
              </p>
            </div>

            <div className="flex flex-col items-center">
              <motion.button
                onClick={() => handleSelect("individual")}
                onMouseEnter={() => setHoveredButton("individual")}
                onMouseLeave={() => setHoveredButton(null)}
                className="rounded-lg border-2 border-primary-foreground bg-primary-foreground px-10 py-5 text-lg font-semibold tracking-wide text-primary shadow-[0_0_20px_rgba(255,255,255,0.25)] transition-all duration-300 hover:bg-transparent hover:text-primary-foreground md:text-xl"
                animate={{ scale: [1, 1.03, 1] }}
                transition={{ delay: 2.0, duration: 0.8, ease: "easeInOut" }}
              >
                I'm an individual
              </motion.button>
              <p className="mt-3 h-6 max-w-[280px] text-center text-sm text-primary-foreground/60">
                Take control of your relocation journey
              </p>
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
