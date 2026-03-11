import AudienceGate from "@/components/AudienceGate";
import CorporateHero from "@/components/CorporateHero";
import StickyNav from "@/components/StickyNav";

const Index = () => {
  return (
    <>
      <AudienceGate />
      <StickyNav />

      <main id="top">
        <CorporateHero />

        {/* Placeholder sections for future phases */}
        <section id="program" className="min-h-[50vh] bg-card" />
        <section id="journey" className="min-h-[50vh] bg-background" />
        <section id="about" className="min-h-[50vh] bg-card" />
        <section id="insights" className="min-h-[50vh] bg-background" />
        <section id="contact" className="min-h-[50vh] bg-card" />
      </main>
    </>
  );
};

export default Index;
