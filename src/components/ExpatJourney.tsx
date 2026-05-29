import { useRef, useState, useEffect } from "react";

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAudience } from "@/contexts/AudienceContext";
import preRootedImg from "@/assets/journey-pre-rooted.webp";
import rootingInImg from "@/assets/journey-rooting-in.webp";
import rootingBackImg from "@/assets/journey-rooting-back.webp";
import familySupportImg from "@/assets/journey-family-support.webp";
import heartDrawn from "@/assets/heart-drawn.png";

type Stage = {
  name: string;
  desc: string;
  route: string;
  label: string;
  image?: string;
};

const individualStages: Stage[] = [
  { name: "Pre-departure", label: "PRE-ROOTED", desc: "The stage before your move: preparing, dreaming, and gathering roots to carry with you.", route: "/journey/pre-rooted", image: preRootedImg },
  { name: "On-assignment", label: "ROOTING IN ", desc: "You've arrived. Learning to feel at home in your new place, street by street.", route: "/journey/rooting-in", image: rootingInImg },
  { name: "Repatriation", label: "ROOTING BACK", desc: "Blooming where you've been planted: building community, routines, and belonging.", route: "/journey/thrive", image: rootingBackImg },
  { name: "Partner & family", label: "FAMILY SUPPORT ", desc: "Finding ways to give back, stay connected to your origins, and grow new roots for others.", route: "/journey/rooting-back", image: familySupportImg },
];

const corporateStages: Stage[] = [
  { name: "Pre-departure", label: "PRE-ROOTED", desc: "Preparing to leave. Building readiness before the move begins. Mindset, expectations, cultural preparation.", route: "/journey/pre-rooted", image: preRootedImg },
  { name: "On-assignment", label: "ROOTING IN ", desc: "Just arrived. Finding ground in an unfamiliar place. Values, culture, language, relationships, social life, family.", route: "/journey/rooting-in", image: rootingInImg },
  { name: "Repatriation", label: "ROOTING BACK", desc: "Returning home. Re-integrating after life abroad. Managing reverse culture shock and a changed identity.", route: "/journey/thrive", image: rootingBackImg },
  { name: "Partner & family", label: "FAMILY SUPPORT ", desc: "The biggest reason for assignment failure is family unhappiness. When a family moves they all need to be supported according to each individual's own unique needs", route: "/journey/rooting-back", image: familySupportImg },
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
    <section id="journey" className="px-6 lg:px-12" style={{ background: "#0A0A0A", paddingTop: 80, paddingBottom: 80 }}>
      <div className="container mx-auto max-w-[1760px]">
        {/* Header: two-column layout */}
        <FadeInOnScroll>
          <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-8 md:gap-16 md:items-end mb-16 md:mb-20">
            <div>
              <div className="mb-6">
                <span className="text-[11px] font-semibold uppercase tracking-[0.26em]" style={{ color: "#3DA776" }}>
                  ​
                </span>


              </div>
              <h2
                className="font-display"
                style={{
                  fontSize: "clamp(28px, 3.6vw, 64px)",
                  lineHeight: 1.05,
                  color: "#FAF9F6",
                  letterSpacing: "-0.02em",
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                }}
              >
                {isIndividual ? (
                  <>Where are you<br />right now.</>
                ) : (
                  <>
                    SUPPORTING YOU{" "}
                    <span style={{ position: "relative", display: "inline-block" }}>
                      T
                      <img
                        src={heartDrawn}
                        alt=""
                        aria-hidden="true"
                        draggable={false}
                        style={{
                          position: "absolute",
                          top: "1.05em",
                          left: "50%",
                          transform: "translateX(-25%)",
                          height: "1.8em",
                          width: "2.4em",
                          pointerEvents: "none",
                          userSelect: "none",
                          zIndex: 1,
                        }}
                        className="select-none"
                      />
                    </span>
                    HROUGH<br />
                    EVERY STAGE
                  </>
                )}
              </h2>
            </div>
            <div className="md:pb-1">
              <p className="leading-[1.65]" style={{ color: "rgba(250,249,246,0.85)", fontSize: "clamp(15px, 1.2vw, 18px)" }}>
                {isIndividual ? (
                  <>The expat stages aren't a straight line. You move forward, loop back, and start again. Find the stage that feels like yours right now: that's where we begin.</>
                ) : (
                  <>Four different packages meeting the person where they are, supporting them with what they need to thrive in their new transition.</>
                )}
              </p>
            </div>
          </div>
        </FadeInOnScroll>

        {/* Card grid */}
        <FadeInOnScroll delay={0.15}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
            {stages.map((stage, i) => (
              <Link
                key={i}
                to={stage.route}
                className="group relative flex flex-col overflow-hidden cursor-pointer rounded-2xl"
                style={{
                  border: "1px solid rgba(31,41,156,0.12)",
                  background: i % 2 === 0 ? "#F3F0F7" : "#FFFFFF",
                }}
              >
                {/* Image with desaturated blue soft-light treatment */}
                <div className="relative w-full overflow-hidden" style={{ aspectRatio: "3 / 4" }}>
                  {stage.image ? (
                    <>
                      <img
                        src={stage.image}
                        alt={stage.name}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover"
                        style={{
                          objectPosition:
                            stage.image === rootingBackImg
                              ? "center 75%"
                              : stage.image === familySupportImg
                              ? "50% center"
                              : "center",
                        }}
                      />
                      <div
                        aria-hidden
                        className="absolute inset-0"
                        style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, transparent 40%, rgba(0,0,0,0.35) 100%)" }}
                      />
                    </>
                  ) : (
                    <div
                      className="w-full h-full"
                      style={{
                        background: i % 2 === 0
                          ? "linear-gradient(135deg, #E8E4EF 0%, #D9D3E6 100%)"
                          : "linear-gradient(135deg, #F0EDF5 0%, #E8E4EF 100%)",
                      }}
                    />
                  )}
                </div>

                <div className="flex flex-col flex-1 p-6 lg:p-7">
                  {/* Label */}
                  <span
                    className="font-display"
                    style={{
                      fontSize: 14,
                      color: "#3DA776",
                      fontWeight: 600,
                      letterSpacing: "0.1em",
                    }}
                  >
                    {stage.label}
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
                </div>

                {/* Hover description overlay */}
                <div
                  className="absolute inset-0 flex flex-col justify-end p-6 lg:p-7 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: "rgba(31,41,156,0.94)" }}
                >
                  <span
                    className="font-display"
                    style={{
                      fontSize: 14,
                      color: "#3DA776",
                      fontWeight: 600,
                      letterSpacing: "0.1em",
                    }}
                  >
                    {stage.label}
                  </span>
                  <h3
                    className="mt-3 font-display"
                    style={{
                      fontSize: "clamp(20px, 1.8vw, 26px)",
                      lineHeight: 1.15,
                      color: "#FFFFFF",
                      fontWeight: 700,
                      whiteSpace: "pre-line",
                    }}
                  >
                    {stage.name}
                  </h3>
                  <p className="mt-3" style={{ color: "rgba(255,255,255,0.88)", fontSize: 14, lineHeight: 1.65 }}>
                    {stage.desc}
                  </p>
                  <span
                    className="inline-flex items-center gap-1.5 mt-5 text-xs font-semibold uppercase tracking-[0.12em]"
                    style={{ color: "#FFFFFF" }}
                  >
                    Learn more <span className="text-sm">→</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </FadeInOnScroll>
      </div>
    </section>
  );
};

export default ExpatJourney;
