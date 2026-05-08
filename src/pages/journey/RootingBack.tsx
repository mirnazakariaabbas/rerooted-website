import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import StickyNav from "@/components/StickyNav";
import Footer from "@/components/Footer";

const RootingBack = () => (
  <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
    <StickyNav />
    <section className="pt-32 pb-16 px-6 lg:px-12" style={{ backgroundColor: "var(--brand-surface)" }}>
      <div className="container mx-auto max-w-4xl text-center">
        <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "var(--brand-accent)" }}>Stage 4 of 4</p>
        <h1 className="font-black text-4xl md:text-5xl leading-tight" style={{ color: "var(--brand-ink)", fontWeight: 900 }}>
          I'm going back. But I'm not the same person who left.
        </h1>
      </div>
    </section>
    <section className="py-20 px-6 lg:px-12" style={{ backgroundColor: "var(--brand-surface)" }}>
      <div className="container mx-auto max-w-3xl text-center space-y-6">
        <p className="text-base leading-relaxed" style={{ color: "var(--brand-mute)" }}>
          This journey page is coming soon. In the meantime, reach out to talk about where you are.
        </p>
        <Link to="/contact" className="inline-flex items-center px-7 py-3.5 text-base font-semibold rounded-lg text-white transition-colors hover:opacity-90" style={{ backgroundColor: "var(--brand-deep)" }}>
          Start a conversation →
        </Link>
      </div>
    </section>
    <section className="py-10 px-6 lg:px-12" style={{ backgroundColor: "var(--brand-surface)" }}>
      <div className="container mx-auto max-w-3xl flex justify-start">
        <Link to="/journey/thrive" className="inline-flex items-center gap-2 text-sm font-semibold hover:underline underline-offset-4" style={{ color: "var(--brand-deep)" }}>
          <ArrowLeft size={16} /> Thrive
        </Link>
      </div>
    </section>
    <Footer />
  </motion.main>
);

export default RootingBack;
