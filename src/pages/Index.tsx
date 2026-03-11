import AudienceGate from "@/components/AudienceGate";
import CorporateHero from "@/components/CorporateHero";
import ProblemStats from "@/components/ProblemStats";
import IntegrationProgram from "@/components/IntegrationProgram";
import StickyNav from "@/components/StickyNav";

const Index = () => {
  return (
    <>
      <AudienceGate />
      <StickyNav />

      <main id="top">
        <CorporateHero />
        <ProblemStats />
        <IntegrationProgram />

        {/* Placeholder sections for future phases */}
        <section id="about" className="min-h-[50vh] bg-card" />
        <section id="insights" className="min-h-[50vh] bg-background" />
        <section id="contact" className="min-h-[50vh] bg-card" />
      </main>
    </>
  );
};

export default Index;
