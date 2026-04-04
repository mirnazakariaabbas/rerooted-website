import Hero from "@/components/Hero";
import ProblemStats from "@/components/ProblemStats";
import IntegrationProgram from "@/components/IntegrationProgram";
import ExpatJourney from "@/components/ExpatJourney";
import AboutSection from "@/components/AboutSection";
import GroundingPillars from "@/components/GroundingPillars";
import BlogPreview from "@/components/BlogPreview";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import ContactCTA from "@/components/ContactCTA";
import Footer from "@/components/Footer";

const CorporateHome = () => (
  <main id="top">
    <Hero
      variant="corporate"
      headline1="Relocation is not a moment."
      headline2="It's a journey."
      body={
        <>
          <p>
            Your organization moves people across borders.
            <br />
            <strong>Re-Rooted®</strong> makes sure they arrive and are equipped to perform.
          </p>
          <p>
            We help expatriates and their families settle, adapt, and thrive
            through every stage of transition. So they can do the work they
            were sent to do.
          </p>
        </>
      }
      cta1={{ label: "See how it works", href: "#program" }}
      cta2={{ label: "Start a conversation", href: "/contact" }}
    />
    <ProblemStats
      label="Why I Built Re-Rooted®"
      headline="The Problem Companies Avoid"
    />
    <IntegrationProgram />
    <ExpatJourney />
    <AboutSection />
    <GroundingPillars />
    <BlogPreview />
    <TestimonialsCarousel />
    <ContactCTA />
    <Footer />
  </main>
);

export default CorporateHome;
