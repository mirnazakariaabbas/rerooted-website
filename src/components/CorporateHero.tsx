import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import heroImage from "@/assets/hero-portrait.jpg";

const CorporateHero = () => {
  const textRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(textRef, { once: true, margin: "-100px" });

  return (
    <section className="relative flex min-h-screen items-center bg-background">
      <div className="container mx-auto flex flex-col items-center gap-12 px-6 py-20 lg:flex-row lg:gap-16 lg:px-12">
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

        {/* Image — right side with hand-drawn Q frame */}
        <div className="relative flex-[2] flex items-center justify-center">
          <div className="relative w-[320px] h-[320px] md:w-[400px] md:h-[400px]">
            {/* Hand-drawn Q-shaped frame */}
            <svg
              viewBox="0 0 420 480"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="absolute -top-6 -left-6 z-10 w-[calc(100%+48px)] h-[calc(100%+80px)] pointer-events-none"
            >
              {/* Organic hand-drawn circle — slightly wobbly */}
              <path
                d="M 210 18
                   C 120 14, 52 58, 34 120
                   C 14 190, 18 260, 50 310
                   C 80 358, 140 390, 210 392
                   C 280 394, 340 368, 370 318
                   C 398 268, 404 198, 388 138
                   C 370 72, 308 22, 210 18 Z"
                stroke="hsl(233 67% 37%)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                style={{
                  filter: "url(#hand-drawn)",
                }}
              />
              {/* Q tail — organic loop swirl */}
              <path
                d="M 320 340
                   C 345 370, 365 400, 348 435
                   C 332 462, 295 468, 270 448
                   C 248 430, 245 400, 262 378
                   C 280 356, 310 348, 320 340"
                stroke="hsl(233 67% 37%)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                style={{
                  filter: "url(#hand-drawn)",
                }}
              />
              {/* SVG filter for hand-drawn wobble effect */}
              <defs>
                <filter id="hand-drawn">
                  <feTurbulence
                    type="turbulence"
                    baseFrequency="0.03"
                    numOctaves="3"
                    result="turbulence"
                    seed="2"
                  />
                  <feDisplacementMap
                    in="SourceGraphic"
                    in2="turbulence"
                    scale="3"
                    xChannelSelector="R"
                    yChannelSelector="G"
                  />
                </filter>
              </defs>
            </svg>

            {/* Circular image with lavender tint */}
            <div className="relative w-full h-full overflow-hidden rounded-full">
              <img
                src={heroImage}
                alt="Professional in a modern workspace"
                className="h-full w-full object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 rounded-full bg-accent/30 mix-blend-multiply" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CorporateHero;
