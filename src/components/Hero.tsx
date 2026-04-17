import { useRef, ReactNode } from "react";
import { motion, useInView } from "framer-motion";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-portrait.svg";

interface HeroProps {
  headline1: string;
  headline2: string;
  body: ReactNode;
  cta1: { label: string; href: string };
  cta2: { label: string; href: string };
  variant?: "corporate" | "individual";
}

const Hero = ({ headline1, headline2, body, cta1, cta2, variant = "corporate" }: HeroProps) => {
  const textRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(textRef, { once: true, margin: "-100px" });
  const isIndividual = variant === "individual";
  const navigate = useNavigate();

  const delayBase = isIndividual ? 0.15 : 0;

  const handleCtaClick = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    if (href.startsWith("#")) {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate(href);
    }
  };

  return (
    <section className="relative flex min-h-screen items-center bg-background">
      <div className="container mx-auto flex flex-col items-center gap-12 px-6 py-20 md:flex-row md:gap-16 md:px-12">
        <div ref={textRef} className="flex-1 min-w-0">
          <h1
            className="text-4xl font-black leading-[1.1] tracking-tight text-foreground md:text-5xl lg:text-[56px]"
            style={{ fontWeight: 900 }}
          >
            <motion.span
              className="block"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: isIndividual ? 0.9 : 0.8, ease: "easeOut" }}
            >
              {headline1}
            </motion.span>
            <motion.span
              className="block"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: isIndividual ? 0.9 : 0.8, delay: 0.6 + delayBase, ease: "easeOut" }}
            >
              {headline2}
            </motion.span>
          </h1>

          <motion.div
            className={`mt-8 max-w-xl text-foreground/90 ${
              isIndividual ? "space-y-5 text-lg md:text-xl" : "space-y-4 text-lg"
            }`}
            style={{ fontWeight: 400 }}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: isIndividual ? 0.7 : 0.6, delay: 0.4 + delayBase }}
          >
            {body}
          </motion.div>

          <motion.div
            className="mt-10 flex flex-wrap items-center gap-5"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: isIndividual ? 0.7 : 0.6, delay: 0.7 + delayBase }}
          >
            <a
              href={cta1.href}
              onClick={handleCtaClick(cta1.href)}
              className={`inline-flex items-center px-7 py-3.5 text-base font-semibold transition-colors ${
                isIndividual
                  ? "rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/90"
                  : "rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
              }`}
            >
              {cta1.label}
            </a>
            <a
              href={cta2.href}
              onClick={handleCtaClick(cta2.href)}
              className={`text-base font-semibold underline-offset-4 transition-colors hover:underline ${
                isIndividual ? "text-secondary" : "text-primary"
              }`}
            >
              {cta2.label}
            </a>
          </motion.div>
        </div>

        <motion.div
          className="flex-1 flex items-center justify-center md:justify-end"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: isIndividual ? 0.9 : 0.8, delay: 0.3 + delayBase, ease: "easeOut" }}
        >
          <img
            src={heroImage}
            alt="Professional in a modern workspace"
            className="h-auto w-full max-w-none object-contain md:scale-110 lg:scale-125 origin-center"
            loading="eager"
          />
        </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
