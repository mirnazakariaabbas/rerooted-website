import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAudience } from "@/contexts/AudienceContext";

type Stage = {
  name: string;
  desc: string;
  route: string;
};

const individualStages: Stage[] = [
  { name: "Pre-Rooted", desc: "The stage before your move: preparing, dreaming, and gathering roots to carry with you.", route: "/journey/pre-rooted" },
  { name: "Re-Rooted", desc: "You've arrived. Learning to feel at home in your new place, street by street.", route: "/journey/rooting-in" },
  { name: "Thriving", desc: "Blooming where you've been planted: building community, routines, and belonging.", route: "/journey/thrive" },
  { name: "Rooting Back", desc: "Finding ways to give back, stay connected to your origins, and grow new roots for others.", route: "/journey/rooting-back" },
];

const corporateStages: Stage[] = [
  { name: "Pre-departure\ncoaching", desc: "Preparing to leave. Building readiness before the move begins. Mindset, expectations, cultural preparation.", route: "/journey/pre-rooted" },
  { name: "On-assignment\nprogram", desc: "Just arrived. Finding ground in an unfamiliar place. Values, culture, language, relationships, social life, family.", route: "/journey/rooting-in" },
  { name: "Repatriation\nsupport", desc: "Settled and growing. Moving beyond survival mode. Performing, connecting, contributing, building a meaningful life.", route: "/journey/thrive" },
  { name: "Partner & family\ntrack", desc: "Returning home. Re-integrating after life abroad. Managing reverse culture shock and a changed identity.", route: "/journey/rooting-back" },
];

const FadeInOnScroll = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
};

const ExpatJourney = () => {
  const { audience } = useAudience();
  const isIndividual = audience === "individual";
  const stages = isIndividual ? individualStages : corporateStages;

  return (
    <section id="journey" className="px-6 lg:px-12" style={{ background: "#FAF9F6", paddingTop: 80, paddingBottom: 80 }}>
      <div className="container mx-auto max-w-[1760px]">
        {/* Header: two-column layout */}
        <FadeInOnScroll>
          <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-8 md:gap-16 md:items-end mb-16 md:mb-20">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="block w-8 h-[2px]" style={{ background: "#3DA776" }} />
                <span className="text-[11px] font-semibold uppercase tracking-[0.26em]" style={{ color: "#3DA776" }}>
                  {isIndividual ? "Your Journey" : "Services"}
                </span>
              </div>
              <h2
                className="font-display"
                style={{
                  fontSize: "clamp(36px, 4.5vw, 64px)",
                  lineHeight: 1.05,
                  color: "#1F299C",
                  letterSpacing: "-0.02em",
                  fontWeight: 700,
                }}
              >
                {isIndividual ? (
                  <>Where are you<br />right now.</>
                ) : (
                  <>Four ways to work<br />with us.</>
                )}
              </h2>
            </div>
            <div className="md:pb-1">
              <p className="leading-[1.65]" style={{ color: "#1A1A1A", fontSize: "clamp(15px, 1.2vw, 18px)" }}>
                {isIndividual ? (
                  <>The expat journey isn't a straight line. You move forward, loop back, and start again. Find the stage that feels like yours right now: that's where we begin.</>
                ) : (
                  <>Each engagement is a clean 90-day cycle, priced by complexity tier and available as an individual purchase or a corporate cohort. Mix and match across a family move.</>
                )}
              </p>
            </div>
          </div>
        </FadeInOnScroll>

        {/* Card grid */}
        <FadeInOnScroll delay={0.15}>
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 rounded-2xl overflow-hidden"
            style={{ border: "1px solid rgba(31,41,156,0.12)", background: "#F3F0F7" }}
          >
            {stages.map((stage, i) => (
              <div
                key={i}
                className="flex flex-col"
                style={{
                  borderRight: i < stages.length - 1 ? "1px solid rgba(31,41,156,0.10)" : "none",
                  background: i % 2 === 0 ? "#F3F0F7" : "#FFFFFF",
                }}
              >
                {/* Image placeholder */}
                <div
                  className="w-full"
                  style={{
                    aspectRatio: "16 / 9",
                    background: i % 2 === 0
                      ? "linear-gradient(135deg, #E8E4EF 0%, #D9D3E6 100%)"
                      : "linear-gradient(135deg, #F0EDF5 0%, #E8E4EF 100%)",
                  }}
                />

                <div className="flex flex-col flex-1 p-6 lg:p-7">
                  {/* Number */}
                  <span
                    className="font-display"
                    style={{
                      fontSize: 18,
                      color: "#3DA776",
                      fontWeight: 600,
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  {/* Title */}
                  <h3
                    className="mt-5 font-display"
                    style={{
                      fontSize: "clamp(24px, 2.2vw, 32px)",
                      lineHeight: 1.15,
                      color: "#1F299C",
                      fontWeight: 700,
                      whiteSpace: "pre-line",
                    }}
                  >
                    {stage.name}
                  </h3>

                  {/* Description */}
                  <p className="mt-4 flex-1" style={{ color: "#4a4a5a", fontSize: 14, lineHeight: 1.65 }}>
                    {stage.desc}
                  </p>

                  {/* Learn more */}
                  <Link
                    to={stage.route}
                    className="inline-flex items-center gap-1.5 mt-6 text-xs font-semibold uppercase tracking-[0.12em] hover:underline underline-offset-2"
                    style={{ color: "#1F299C" }}
                  >
                    Learn more <span className="text-sm">→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </FadeInOnScroll>
      </div>
    </section>
  );
};

export default ExpatJourney;
