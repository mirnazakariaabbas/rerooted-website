import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import heroImage from "@/assets/hero-portrait.jpg";
import qFrame from "@/assets/q-frame.png";

const CorporateHero = () => {
  const textRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(textRef, { once: true, margin: "-100px" });

  return (
    <section className="relative flex min-h-screen items-center bg-background">
      <div className="container mx-auto flex flex-col items-center gap-12 px-6 py-20 md:flex-row md:gap-16 md:px-12">
        {/* Text — left side */}
        <div ref={textRef} className="flex-[3]">
          <motion.h1
            className="text-4xl font-black leading-[1.1] tracking-tight text-foreground md:text-5xl lg:text-[56px]"
            style={{ fontWeight: 900 }}
          >
            <motion.span
              className="block"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              Relocation is not a moment.
            </motion.span>
            <motion.span
              className="block"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
            >
              It's a journey.
            </motion.span>
          </motion.h1>

          <motion.div
            className="mt-8 max-w-xl space-y-4 text-lg text-foreground/90"
            style={{ fontWeight: 400 }}
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 1.1, ease: "easeOut" }}
          >
            <p>
              Your organization moves people across borders.
              <br />
              Re-Rooted® makes sure they arrive and are equipped to perform.
            </p>
            <p>
              We help expatriates and their families settle, adapt, and thrive
              through every stage of transition. So they can do the work they
              were sent to do.
            </p>
          </motion.div>

          <motion.div
            className="mt-10 flex flex-wrap items-center gap-5"
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 1.4, ease: "easeOut" }}
          >
            <a
              href="#program"
              className="inline-flex items-center rounded-lg bg-primary px-7 py-3.5 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              See how it works
            </a>
            <a
              href="#contact"
              className="text-base font-semibold text-primary underline-offset-4 transition-colors hover:underline"
            >
              Start a conversation
            </a>
          </motion.div>
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
