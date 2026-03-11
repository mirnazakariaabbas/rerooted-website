import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import heroImage from "@/assets/hero-portrait.jpg";

const CorporateHero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(textRef, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen items-center overflow-hidden bg-background"
    >
      <div className="container mx-auto grid grid-cols-1 items-center gap-12 px-6 py-20 lg:grid-cols-5 lg:gap-16 lg:px-12">
        {/* Text — 60% */}
        <div ref={textRef} className="lg:col-span-3">
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

        {/* Image — 40% */}
        <div className="relative lg:col-span-2">
          <motion.div
            className="overflow-hidden rounded-2xl"
            style={{ y: imageY }}
          >
            <img
              src={heroImage}
              alt="Professional in a modern workspace"
              className="h-auto w-full object-cover lg:h-[560px]"
              loading="eager"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CorporateHero;
