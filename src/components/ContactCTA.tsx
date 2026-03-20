import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useAudience } from "@/contexts/AudienceContext";

const journeyStages = [
  "Pre-Rooted — preparing to move",
  "Re-Rooted — just arrived",
  "Thriving — settling in",
  "Rooting Back — giving back or returning",
];

const ContactCTA = () => {
  const { audience } = useAudience();
  const isIndividual = audience === "individual";
  const [submitted, setSubmitted] = useState(false);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const fieldClass =
    "w-full rounded-lg px-3 py-3 text-sm bg-white outline-none transition-colors duration-200 border focus:ring-0";

  return (
    <section
      id="contact"
      className="py-20 md:py-28"
      style={{ backgroundColor: "#FAF9F6" }}
    >
      <div ref={ref} className="container mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={visible ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-lg text-center"
        >
          <h2
            className="font-extrabold tracking-tight"
            style={{
              color: "#1A1A1A",
              fontSize: "clamp(30px, 4.5vw, 40px)",
            }}
          >
            {isIndividual ? "Take the first step" : "Start a conversation"}
          </h2>

          <div
            className="mx-auto mt-5 max-w-[600px] space-y-3 text-sm md:text-base"
            style={{ color: "#1A1A1A" }}
          >
            {isIndividual ? (
              <>
                <p>
                  Whether you're about to move, just arrived, or have been away
                  for years — it's never too late to feel at home.
                </p>
                <p>No judgement. No pressure. Just a conversation about you.</p>
              </>
            ) : (
              <>
                <p>
                  Whether you're exploring support for an upcoming assignment,
                  rethinking your mobility program, or just curious about what{" "}
                  <strong>Re-Rooted®</strong> does — we'd like to hear from you.
                </p>
                <p>
                  No pitch. No pressure. Just a conversation about what your
                  people need.
                </p>
              </>
            )}
          </div>

          {submitted ? (
            <motion.p
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-10 text-lg font-semibold"
              style={{ color: "#3DA776" }}
            >
              Thank you. We'll be in touch soon.
            </motion.p>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mx-auto mt-10 flex max-w-[500px] flex-col gap-4 text-left"
            >
              <input
                required
                type="text"
                placeholder="Name"
                className={fieldClass}
                style={{
                  borderColor: "#BCADD4",
                }}
                onFocus={(e) =>
                  (e.currentTarget.style.borderColor = "#3DA776")
                }
                onBlur={(e) =>
                  (e.currentTarget.style.borderColor = "#BCADD4")
                }
              />

              {isIndividual ? (
                <select
                  required
                  className={fieldClass}
                  defaultValue=""
                  style={{ borderColor: "#BCADD4" }}
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor = "#3DA776")
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor = "#BCADD4")
                  }
                >
                  <option value="" disabled>
                    Where are you right now?
                  </option>
                  {journeyStages.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  required
                  type="text"
                  placeholder="Company"
                  className={fieldClass}
                  style={{ borderColor: "#BCADD4" }}
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor = "#3DA776")
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor = "#BCADD4")
                  }
                />
              )}

              <input
                required
                type="email"
                placeholder="Email"
                className={fieldClass}
                style={{ borderColor: "#BCADD4" }}
                onFocus={(e) =>
                  (e.currentTarget.style.borderColor = "#3DA776")
                }
                onBlur={(e) =>
                  (e.currentTarget.style.borderColor = "#BCADD4")
                }
              />

              {!isIndividual && (
                <input
                  type="tel"
                  placeholder="Phone (optional)"
                  className={fieldClass}
                  style={{ borderColor: "#BCADD4" }}
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor = "#3DA776")
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor = "#BCADD4")
                  }
                />
              )}

              <textarea
                required
                rows={4}
                placeholder="Message"
                className={fieldClass + " resize-none"}
                style={{ borderColor: "#BCADD4" }}
                onFocus={(e) =>
                  (e.currentTarget.style.borderColor = "#3DA776")
                }
                onBlur={(e) =>
                  (e.currentTarget.style.borderColor = "#BCADD4")
                }
              />

              <button
                type="submit"
                className="mt-2 w-full py-3 text-sm font-semibold text-white transition-transform duration-150 active:scale-[0.98]"
                style={{
                  backgroundColor: isIndividual ? "#3DA776" : "#1F299C",
                  borderRadius: isIndividual ? "12px" : "8px",
                }}
              >
                {isIndividual ? "Reach out" : "Send"}
              </button>
            </form>
          )}

          <div className="mt-8 space-y-1 text-xs" style={{ color: "#6B6B6B" }}>
            <p>hello@re-rooted.com</p>
            <p>Based in Switzerland. Working with organizations globally.</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactCTA;
