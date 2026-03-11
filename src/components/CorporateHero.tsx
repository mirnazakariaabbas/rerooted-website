import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import heroImage from "@/assets/hero-portrait.jpg";

const CorporateHero = () => {
  const textRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(textRef, { once: true, margin: "-100px" });

  return (
    <section className="relative flex min-h-screen items-center bg-background">
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

        {/* Image — 40% with decorative Q border */}
        <div className="relative lg:col-span-2">
          <div className="relative mx-auto w-full max-w-md">
            {/* Decorative Q-shaped SVG border */}
            <svg
              viewBox="0 0 400 440"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="absolute -inset-4 z-10 h-[calc(100%+2rem)] w-[calc(100%+2rem)]"
              preserveAspectRatio="none"
            >
              {/* Main circular stroke */}
              <ellipse
                cx="190"
                cy="190"
                rx="175"
                ry="180"
                stroke="hsl(233 67% 37%)"
                strokeWidth="12"
                fill="none"
              />
              {/* Q tail - the organic swirl */}
              <path
                d="M 300 310 Q 340 360, 310 410 Q 280 450, 240 430 Q 200 410, 220 370 Q 240 330, 280 310"
                stroke="hsl(233 67% 37%)"
                strokeWidth="12"
                fill="none"
                strokeLinecap="round"
              />
            </svg>

            {/* Image with lavender tint */}
            <div className="relative overflow-hidden rounded-full">
              <img
                src={heroImage}
                alt="Professional in a modern workspace"
                className="h-auto w-full object-cover aspect-square"
                loading="eager"
              />
              {/* Lavender overlay tint */}
              <div
                className="absolute inset-0 rounded-full bg-accent/40 mix-blend-multiply"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CorporateHero;
