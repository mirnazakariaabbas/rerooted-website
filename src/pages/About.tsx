import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import StickyNav from "@/components/StickyNav";
import Footer from "@/components/Footer";

const Section = ({ children, className = "", bg = "#FAF9F6" }: { children: React.ReactNode; className?: string; bg?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.section
      ref={ref}
      className={`px-6 lg:px-12 ${className}`}
      style={{ backgroundColor: bg }}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.section>
  );
};

const About = () => (
  <motion.main
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
  >
    <StickyNav />

    {/* Hero */}
    <section className="pt-32 pb-16 px-6 lg:px-12" style={{ backgroundColor: "#1F299C" }}>
      <div className="container mx-auto max-w-4xl text-center">
        <h1 className="text-white font-black text-4xl md:text-5xl leading-tight" style={{ fontWeight: 900 }}>
          Built from experience. Designed for yours.
        </h1>
        <p className="mt-4 text-lg italic" style={{ color: "#3DA776" }}>
          The human side of relocation
        </p>
      </div>
    </section>

    {/* The Story */}
    <Section className="py-20" bg="#FAF9F6">
      <div className="container mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-5 gap-12 items-start">
        <div className="md:col-span-2 aspect-[3/4] w-full max-w-md mx-auto rounded-2xl bg-muted flex items-center justify-center">
          <span className="text-muted-foreground text-lg font-semibold">Photo</span>
        </div>
        <div className="md:col-span-3 space-y-5 text-base leading-[1.7]" style={{ color: "#1A1A1A" }}>
          <p>
            Yasser Abbas has been an expat for close to two decades.
          </p>
          <p>
            Born in Egypt, he built a career in global consumer health that took him from Cairo to Saudi Arabia, then to Dubai for nearly a decade, and finally to Switzerland in 2020. Along the way, he met his Lebanese wife, started a family, and navigated everything <strong>Re-Rooted®</strong> now helps others with: culture shock, identity shifts, building a life from scratch in unfamiliar soil, raising children between cultures, and learning what it actually takes to belong somewhere new.
          </p>
          <p>
            He also watched colleagues and their families go through the same thing, often with far less support than the move demanded. The relocation packages covered flights and paperwork. They rarely covered the person.
          </p>
          <p className="font-semibold">
            That gap is where <strong>Re-Rooted®</strong> began.
          </p>
        </div>
      </div>
    </Section>

    {/* Professional */}
    <Section className="py-20" bg="#F3F0F7">
      <div className="container mx-auto max-w-3xl space-y-5 text-base leading-[1.7]" style={{ color: "#1A1A1A" }}>
        <p>
          Yasser brings 17+ years of leadership experience leading businesses for global multinationals, most recently as General Manager for a leading global consumer health company in Switzerland and Austria. His career has spanned markets across the Middle East, North Africa, and Europe, always at the intersection of people, performance, and culture.
        </p>
        <p>
          He is an ICF-certified coach (ACC) with a background in leadership and organizational development. He knows what companies invest in relocation, and what they leave out.
        </p>
        <div className="pt-4 flex items-center gap-3">
          <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center text-xs text-muted-foreground font-semibold">ICF</div>
          <span className="text-sm text-muted-foreground">ICF Associate Certified Coach</span>
        </div>
      </div>
    </Section>

    {/* Mission */}
    <Section className="py-20" bg="#FAF9F6">
      <div className="container mx-auto max-w-3xl">
        <h2 className="font-extrabold text-3xl md:text-[36px] leading-tight mb-6" style={{ color: "#1A1A1A", fontWeight: 800 }}>
          We don't replace your mobility program. We complete it.
        </h2>
        <div className="space-y-5 text-base leading-[1.7]" style={{ color: "#1A1A1A" }}>
          <p>
            <strong>Re-Rooted®</strong> exists to close the gap between moving someone and supporting them.
          </p>
          <p>
            We work with organizations to help expatriates and their families navigate the full journey, from the decision to leave, through the difficult early months, into real belonging, and when the time comes, back home again.
          </p>
        </div>
      </div>
    </Section>

    {/* How We Work */}
    <Section className="py-20" bg="#F3F0F7">
      <div className="container mx-auto max-w-3xl">
        <div className="space-y-5 text-base leading-[1.7]" style={{ color: "#1A1A1A" }}>
          <p>
            <strong>Re-Rooted®</strong> operates through a global network of coaches, each bringing local knowledge and lived experience. Whether your people are landing in Zurich, Dubai, São Paulo, or Singapore, they're supported by someone who understands the ground they're standing on.
          </p>
        </div>
        <div className="mt-10 text-center">
          <Link
            to="/#contact"
            className="inline-flex items-center px-7 py-3.5 text-base font-semibold rounded-lg text-white transition-colors hover:opacity-90"
            style={{ backgroundColor: "#1F299C" }}
          >
            Start a conversation →
          </Link>
        </div>
      </div>
    </Section>

    <Footer />
  </motion.main>
);

export default About;
