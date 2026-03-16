import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const AboutSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="bg-background py-20 px-6 lg:px-12">
      <div
        ref={ref}
        className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center"
      >
        {/* Left — Photo placeholder */}
        <motion.div
          className="aspect-[3/4] w-full max-w-md mx-auto md:mx-0 rounded-2xl bg-muted flex items-center justify-center"
          initial={{ opacity: 0, x: -60 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <span className="text-muted-foreground text-lg font-semibold">Photo</span>
        </motion.div>

        {/* Right — Text */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
        >
          <h2 className="text-foreground font-extrabold text-3xl md:text-[40px] leading-tight mb-6">
            Built from experience.
            <br />
            Designed for yours.
          </h2>

          <div className="space-y-4 text-foreground text-base leading-relaxed">
            <p>
              <strong>Re-Rooted®</strong> was founded by Yasser Abbas, an Egyptian expat who has
              spent close to two decades living and leading across Saudi Arabia, Dubai, and
              Switzerland.
            </p>
            <p>
              With 17+ years leading businesses for global multinationals, an ICF coaching
              certification (ACC), and a family built across three cultures, Yasser created{" "}
              <strong>Re-Rooted®</strong> to close the gap between moving someone and actually
              supporting them.
            </p>
            <p>
              <strong>Re-Rooted®</strong> operates through a global network of coaches, each
              bringing local knowledge and lived experience.
            </p>
          </div>

          <a
            href="#"
            className="inline-block mt-6 text-secondary font-semibold hover:underline underline-offset-4"
          >
            Read the full story →
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
