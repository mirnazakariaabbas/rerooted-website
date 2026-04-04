import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import { useAudience } from "@/contexts/AudienceContext";

const AboutSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const { audience } = useAudience();
  const isIndividual = audience === "individual";

  return (
    <section id="about" className={`bg-background px-6 lg:px-12 ${isIndividual ? "py-24" : "py-20"}`}>
      <div
        ref={ref}
        className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center"
      >
        {/* Left — Photo placeholder */}
        <motion.div
          className="aspect-[3/4] w-full max-w-md mx-auto md:mx-0 rounded-2xl bg-muted flex items-center justify-center"
          initial={{ opacity: 0, x: -60 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: isIndividual ? 0.9 : 0.7, ease: "easeOut" }}
        >
          <span className="text-muted-foreground text-lg font-semibold">Photo</span>
        </motion.div>

        {/* Right — Text */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: isIndividual ? 0.9 : 0.7, ease: "easeOut", delay: 0.15 }}
        >
          <h2 className="text-foreground font-extrabold text-3xl md:text-[40px] leading-tight mb-6">
            {isIndividual ? (
              <>
                I've been where
                <br />
                you are.
              </>
            ) : (
              <>
                Built from experience.
                <br />
                Designed for yours.
              </>
            )}
          </h2>

          <div className={`space-y-4 text-foreground leading-relaxed ${isIndividual ? "text-base md:text-lg" : "text-base"}`}>
            {isIndividual ? (
              <>
                <p>
                  I'm Yasser Abbas — an Egyptian expat who has spent close to two decades living
                  across Saudi Arabia, Dubai, and Switzerland. I know the loneliness, the identity
                  questions, the invisible weight of starting over in a place that doesn't know your name.
                </p>
                <p>
                  I built <strong>Re-Rooted®</strong> because I lived the gap between being moved
                  and being supported. With 17+ years in global business, an ICF coaching
                  certification, and a family built across three cultures, I wanted to create what
                  I wish I'd had.
                </p>
                <p>
                  Today, <strong>Re-Rooted®</strong> connects you with coaches who've walked this
                  path — people with local knowledge and lived experience, not just textbook answers.
                </p>
              </>
            ) : (
              <>
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
              </>
            )}
          </div>

          <a
            href="#"
            className="inline-block mt-6 text-secondary font-semibold hover:underline underline-offset-4"
          >
            {isIndividual ? "Hear my story →" : "Read the full story →"}
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
