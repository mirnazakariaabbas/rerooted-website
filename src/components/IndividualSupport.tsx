import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Heart, Smartphone } from "lucide-react";

const cards = [
  {
    icon: Heart,
    eyebrow: "Personal Coaching",
    title: "A coach who gets it",
    description:
      "Someone who's lived the expat experience — not just studied it. Your coach helps you navigate the emotional side of relocation: identity, belonging, loneliness, and building a life that feels like yours.",
    cta: { label: "Find your coach →", href: "#contact" },
  },
  {
    icon: Smartphone,
    eyebrow: "Companion App",
    title: "Your new country, side by side with home",
    description:
      "A companion app that helps you settle in — from cultural tips and local know-how to daily check-ins and guided reflections. Think of it as a friend who already lives where you're going.",
    cta: { label: "Explore the app →", href: "#contact" },
  },
];

const IndividualSupport = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="support" className="bg-background py-24 px-6 lg:px-12">
      <div ref={ref} className="max-w-5xl mx-auto">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <h2 className="text-foreground font-extrabold text-3xl md:text-[40px] leading-tight mb-4">
            Two ways we walk with you
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            No assessments. No HR reports. Just real support designed around{" "}
            <strong className="text-foreground">you</strong>.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              className="rounded-xl border border-border bg-card p-8 md:p-10 shadow-sm hover:shadow-md transition-shadow duration-300 group"
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: 0.2 + i * 0.15,
                ease: "easeOut",
              }}
            >
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-6 group-hover:bg-secondary/20 transition-colors">
                <card.icon className="w-6 h-6 text-secondary" />
              </div>
              <div className="text-secondary font-semibold uppercase tracking-[0.2em] text-xs mb-3">
                {card.eyebrow}
              </div>
              <h3 className="font-display text-primary font-black text-3xl md:text-[40px] leading-[1.05] tracking-tight mb-4">
                {card.title}
              </h3>
              <p className="text-muted-foreground text-base leading-relaxed mb-6">
                {card.description}
              </p>
              <a
                href={card.cta.href}
                className="inline-flex items-center text-secondary font-semibold hover:underline underline-offset-4 transition-colors"
              >
                {card.cta.label}
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IndividualSupport;
