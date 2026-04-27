import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const pillars = [
  { name: "The North Star", subtitle: "Purpose" },
  { name: "The Garden", subtitle: "Others" },
  { name: "The Inner Circle", subtitle: "Others" },
  { name: "The Ground", subtitle: "Safety" },
  { name: "The Soil", subtitle: "Values" },
  { name: "The Flame", subtitle: "Energy" },
];

const GroundingPillars = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section data-dark="1" data-nav-theme="dark" className="bg-primary py-20 px-6 lg:px-12">
      <div ref={ref} className="max-w-5xl mx-auto">
        <h2 className="text-primary-foreground font-extrabold text-3xl md:text-[40px] text-center mb-12">
          What we pay attention to
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {pillars.map((pillar, i) => (
            <motion.div
              key={i}
              className="rounded-xl p-6 border"
              style={{
                background: "hsla(0, 0%, 100%, 0.08)",
                borderColor: "hsla(0, 0%, 100%, 0.15)",
              }}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.5,
                delay: i * 0.15,
                ease: "easeOut",
              }}
            >
              <h3 className="text-primary-foreground font-bold text-lg md:text-[22px] mb-1">
                {pillar.name}
              </h3>
              <p
                className="text-sm md:text-[15px] font-light leading-relaxed"
                style={{ color: "hsla(0, 0%, 100%, 0.8)" }}
              >
                {pillar.subtitle}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GroundingPillars;
