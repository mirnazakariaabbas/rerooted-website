import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAudience } from "@/contexts/AudienceContext";
import logoWhite from "@/assets/logo-white.png";

const AudienceGate = () => {
  const { gateOpen, setGateOpen, setAudience } = useAudience();
  const [hoveredButton, setHoveredButton] = useState<"org" | "individual" | null>(null);

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

          {/* Buttons */}
          <motion.div
            className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6, ease: "easeOut" }}
          >
            <div className="flex flex-col items-center">
              <button
                onClick={() => handleSelect("organization")}
                onMouseEnter={() => setHoveredButton("org")}
                onMouseLeave={() => setHoveredButton(null)}
                className="rounded-lg border-2 border-primary-foreground px-8 py-4 text-base font-semibold tracking-wide text-primary-foreground transition-all duration-300 hover:bg-primary-foreground hover:text-primary md:px-10 md:text-lg"
              >
                I'm an organization
              </button>
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
              <button
                onClick={() => handleSelect("individual")}
                onMouseEnter={() => setHoveredButton("individual")}
                onMouseLeave={() => setHoveredButton(null)}
                className="rounded-lg border-2 border-primary-foreground px-8 py-4 text-base font-semibold tracking-wide text-primary-foreground transition-all duration-300 hover:bg-primary-foreground hover:text-primary md:px-10 md:text-lg"
              >
                I'm an individual
              </button>
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
