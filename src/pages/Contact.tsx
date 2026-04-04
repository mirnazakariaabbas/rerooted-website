import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { MapPin, Mail, Phone } from "lucide-react";
import StickyNav from "@/components/StickyNav";
import Footer from "@/components/Footer";

const fieldClass =
  "w-full rounded-lg px-3 py-3 text-sm bg-white outline-none transition-colors duration-200 border focus:ring-0";

const helpOptions = [
  "Supporting an upcoming assignment",
  "Improving our mobility program",
  "Individual coaching inquiry",
  "Partnership or collaboration",
  "Just curious",
];

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const focusStyle = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    (e.currentTarget.style.borderColor = "#3DA776");
  const blurStyle = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    (e.currentTarget.style.borderColor = "#BCADD4");

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <StickyNav />

      {/* Hero */}
      <section className="pt-32 pb-10 px-6 lg:px-12" style={{ backgroundColor: "#FAF9F6" }}>
        <div className="container mx-auto max-w-lg text-center">
          <h1 className="font-black text-4xl md:text-5xl leading-tight mb-6" style={{ color: "#1A1A1A", fontWeight: 900 }}>
            Start a conversation
          </h1>
          <div className="space-y-3 text-base" style={{ color: "#1A1A1A" }}>
            <p>
              Whether you're exploring support for an upcoming assignment, rethinking your mobility program, or simply curious about what <strong>Re-Rooted®</strong> does, we'd like to hear from you.
            </p>
            <p>No pitch. No pressure. Just a conversation about what your people need.</p>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="pb-20 px-6 lg:px-12" style={{ backgroundColor: "#FAF9F6" }}>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="container mx-auto max-w-[560px]"
        >
          {submitted ? (
            <motion.p
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center text-lg font-semibold py-16"
              style={{ color: "#3DA776" }}
            >
              Thank you. We'll be in touch soon.
            </motion.p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input required type="text" placeholder="Name" className={fieldClass} style={{ borderColor: "#BCADD4" }} onFocus={focusStyle} onBlur={blurStyle} />
              <input required type="text" placeholder="Company" className={fieldClass} style={{ borderColor: "#BCADD4" }} onFocus={focusStyle} onBlur={blurStyle} />
              <input required type="email" placeholder="Email" className={fieldClass} style={{ borderColor: "#BCADD4" }} onFocus={focusStyle} onBlur={blurStyle} />
              <input type="tel" placeholder="Phone (optional)" className={fieldClass} style={{ borderColor: "#BCADD4" }} onFocus={focusStyle} onBlur={blurStyle} />
              <select
                required
                defaultValue=""
                className={fieldClass}
                style={{ borderColor: "#BCADD4" }}
                onFocus={focusStyle as any}
                onBlur={blurStyle as any}
              >
                <option value="" disabled>How can we help?</option>
                {helpOptions.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
              <textarea
                required
                rows={5}
                placeholder="Message"
                className={fieldClass + " resize-none"}
                style={{ borderColor: "#BCADD4" }}
                onFocus={focusStyle as any}
                onBlur={blurStyle as any}
              />
              <button
                type="submit"
                className="mt-2 w-full py-3 text-sm font-semibold text-white transition-transform duration-150 active:scale-[0.98] rounded-lg"
                style={{ backgroundColor: "#1F299C" }}
              >
                Send
              </button>
            </form>
          )}

          {/* Contact info */}
          <div className="mt-10 flex flex-col items-center gap-3 text-center">
            <div className="flex items-center gap-2 text-sm" style={{ color: "#6B6B6B" }}>
              <Mail size={14} />
              <span>hello@re-rooted.com</span>
            </div>
            <div className="flex items-center gap-2 text-sm" style={{ color: "#6B6B6B" }}>
              <MapPin size={14} />
              <span>Based in Zug, Switzerland</span>
            </div>
          </div>

          <p className="mt-10 text-center text-sm" style={{ color: "#6B6B6B" }}>
            Not ready for a form? Email us directly at{" "}
            <a href="mailto:hello@re-rooted.com" className="font-semibold hover:underline" style={{ color: "#3DA776" }}>
              hello@re-rooted.com
            </a>
          </p>
        </motion.div>
      </section>

      <Footer />
    </motion.main>
  );
};

export default Contact;
