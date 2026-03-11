import { useRef, ReactNode } from "react";
import { motion, useInView } from "framer-motion";
import heroImage from "@/assets/hero-portrait.jpg";

interface HeroProps {
  headline1: string;
  headline2: string;
  body: ReactNode;
  cta1: { label: string; href: string };
  cta2: { label: string; href: string };
}

const Hero = ({ headline1, headline2, body, cta1, cta2 }: HeroProps) => {
  const textRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(textRef, { once: true, margin: "-100px" });

  return (
    <section className="relative flex min-h-screen items-center bg-background">
      <div className="container mx-auto flex flex-col items-center gap-12 px-6 py-20 md:flex-row md:gap-16 md:px-12">
        <div ref={textRef} className="flex-[3]">
          <h1
            className="text-4xl font-black leading-[1.1] tracking-tight text-foreground md:text-5xl lg:text-[56px]"
            style={{ fontWeight: 900 }}
          >
            <motion.span
              className="block"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {headline1}
            </motion.span>
            <motion.span
              className="block"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            >
              {headline2}
            </motion.span>
          </h1>

          <motion.div
            className="mt-8 max-w-xl space-y-4 text-lg text-foreground/90"
            style={{ fontWeight: 400 }}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {body}
          </motion.div>

          <motion.div
            className="mt-10 flex flex-wrap items-center gap-5"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <a
              href={cta1.href}
              className="inline-flex items-center rounded-lg bg-primary px-7 py-3.5 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {cta1.label}
            </a>
            <a
              href={cta2.href}
              className="text-base font-semibold text-primary underline-offset-4 transition-colors hover:underline"
            >
              {cta2.label}
            </a>
          </motion.div>
        </div>

        <motion.div
          className="flex-[2] flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        >
          <div className="w-[320px] h-[320px] md:w-[400px] md:h-[400px] overflow-hidden rounded-full">
            <img
              src={heroImage}
              alt="Professional in a modern workspace"
              className="h-full w-full object-cover"
              loading="eager"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
