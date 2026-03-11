import { useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import heroImage from "@/assets/hero-portrait.jpg";
import { useAudience } from "@/contexts/AudienceContext";

const content = {
  corporate: {
    headline1: "Relocation is not a moment.",
    headline2: "It's a journey.",
    body: (
      <>
        <p>
          Your organization moves people across borders.
          <br />
          <strong>Re-Rooted®</strong> makes sure they arrive and are equipped to perform.
        </p>
        <p>
          We help expatriates and their families settle, adapt, and thrive
          through every stage of transition. So they can do the work they
          were sent to do.
        </p>
      </>
    ),
    cta1: { label: "See how it works", href: "#program" },
    cta2: { label: "Start a conversation", href: "#contact" },
  },
  individual: {
    headline1: "You are moving countries,",
    headline2: "Now what?",
    body: (
      <>
        <p>
          You've handled the logistics — the visa, the flight, the apartment.
          <br />
          But nobody told you about the <strong>emotional side</strong>.
        </p>
        <p>
          <strong>Re-Rooted®</strong> helps you navigate the human challenges
          of relocation — so you can feel at home, not just live somewhere new.
        </p>
      </>
    ),
    cta1: { label: "Explore your journey", href: "#journey" },
    cta2: { label: "Reach out", href: "#contact" },
  },
};

const CorporateHero = () => {
  const textRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(textRef, { once: true, margin: "-100px" });
  const { audience } = useAudience();
  const key = audience === "individual" ? "individual" : "corporate";
  const c = content[key];

  return (
    <section className="relative flex min-h-screen items-center bg-background">
      <div className="container mx-auto flex flex-col items-center gap-12 px-6 py-20 md:flex-row md:gap-16 md:px-12">
        {/* Text — left side */}
        <div ref={textRef} className="flex-[3]">
          <AnimatePresence mode="wait">
            <motion.h1
              key={key}
              className="text-4xl font-black leading-[1.1] tracking-tight text-foreground md:text-5xl lg:text-[56px]"
              style={{ fontWeight: 900 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <motion.span
                className="block"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                {c.headline1}
              </motion.span>
              <motion.span
                className="block"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
              >
                {c.headline2}
              </motion.span>
            </motion.h1>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              key={key + "-body"}
              className="mt-8 max-w-xl space-y-4 text-lg text-foreground/90"
              style={{ fontWeight: 400 }}
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              {c.body}
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              key={key + "-cta"}
              className="mt-10 flex flex-wrap items-center gap-5"
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <a
                href={c.cta1.href}
                className="inline-flex items-center rounded-lg bg-primary px-7 py-3.5 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                {c.cta1.label}
              </a>
              <a
                href={c.cta2.href}
                className="text-base font-semibold text-primary underline-offset-4 transition-colors hover:underline"
              >
                {c.cta2.label}
              </a>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Image — right side */}
        <div className="flex-[2] flex items-center justify-center">
          <div className="w-[320px] h-[320px] md:w-[400px] md:h-[400px] overflow-hidden rounded-full">
            <img
              src={heroImage}
              alt="Professional in a modern workspace"
              className="h-full w-full object-cover"
              loading="eager"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CorporateHero;
