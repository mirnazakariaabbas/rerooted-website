import Hero from "@/components/Hero";
import ProblemStats from "@/components/ProblemStats";
import IntegrationProgram from "@/components/IntegrationProgram";
import ExpatJourney from "@/components/ExpatJourney";
import AboutSection from "@/components/AboutSection";
import GroundingPillars from "@/components/GroundingPillars";

const IndividualHome = () => (
  <main id="top">
    <Hero
      headline1="You are moving countries,"
      headline2="Now what?"
      body={
        <>
          <p>
            You've handled the logistics — the visa, the flight, the apartment.
            <br />
            But nobody told you about the <strong>emotional side</strong>.
          </p>
          <p>
            <strong>Re-Rooted®</strong> helps you navigate the human challenges
            of relocation — so you can feel at home, not just live somewhere new.
          </p>
        </>
      }
      cta1={{ label: "Explore your journey", href: "#journey" }}
      cta2={{ label: "Reach out", href: "#contact" }}
    />
    <ProblemStats
      label="You're Not Alone"
      headline="What nobody told you before you moved"
      closingLine="These aren't just numbers — they're people like you, navigating the same challenges you face right now."
    />
    <IntegrationProgram />
    <ExpatJourney />
    <AboutSection />
    <GroundingPillars />

    {/* Placeholder sections for future phases */}
    <section id="insights" className="min-h-[50vh] bg-background" />
    <section id="contact" className="min-h-[50vh] bg-card" />
  </main>
);

export default IndividualHome;
