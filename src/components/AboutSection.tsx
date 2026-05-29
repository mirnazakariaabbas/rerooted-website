import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import { useAudience } from "@/contexts/AudienceContext";
import aboutPhoto from "@/assets/about-yasser-v2.jpeg";

const AboutSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const { audience } = useAudience();
  const isIndividual = audience === "individual";

  return (
    <section id="about" className={`px-6 lg:px-12 ${isIndividual ? "py-32" : "py-28"}`} style={{ background: "#1F299C" }}>
      <div className="max-w-6xl mx-auto">
        {/* Top-left section eyebrow header, aligned with previous section */}
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] mb-16 md:mb-20" style={{ color: "#3DA776" }}>
          ​
        </p>

        {/* Title at top of section, left-aligned, matches Journey section style */}
        <h2
          className="font-display"
          style={{
            fontSize: "clamp(28px, 3.6vw, 64px)",
            lineHeight: 1.05,
            color: "#FAF9F6",
            letterSpacing: "-0.02em",
            fontWeight: 700,
            margin: "0 0 64px",
            textAlign: "left",
          }}
        >
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

        <div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center"
        >
        {/* Left, Photo placeholder */}
        <motion.div
          className="aspect-[3/4] w-full max-w-md mx-auto md:mx-0 rounded-2xl overflow-hidden"
          initial={{ opacity: 0, x: -60 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: isIndividual ? 0.9 : 0.7, ease: "easeOut" }}
        >
          <img
            src={aboutPhoto}
            alt="Yasser Abbas, founder of Re-Rooted"
            className="w-full h-full object-cover"
            style={{ objectPosition: "center 30%" }}
            loading="lazy"
          />
        </motion.div>

        {/* Right, Text */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: isIndividual ? 0.9 : 0.7, ease: "easeOut", delay: 0.15 }}
        >
          <div className={`space-y-4 leading-relaxed ${isIndividual ? "text-base md:text-lg" : "text-base"}`} style={{ color: "rgba(250,249,246,0.88)" }}>
            {isIndividual ? (
              <>
                <p>
                  I'm Yasser Abbas, an Egyptian expat who has spent close to two decades living
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
                  path, people with local knowledge and lived experience, not just textbook answers.
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

          <Link
            to="/about"
            className="inline-block mt-6 font-semibold hover:underline underline-offset-4"
            style={{ color: "#3DA776" }}
          >
            {isIndividual ? "Hear my story →" : "Read the full story →"}
          </Link>
        </motion.div>
        </div>
      </div>
    </section>

  );
};

export default AboutSection;
