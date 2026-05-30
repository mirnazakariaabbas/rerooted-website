import Hero from "@/components/Hero";
import { WhyReRootedStatement, WhyReRootedPillars } from "@/components/WhyReRooted";
import ProblemStats from "@/components/ProblemStats";
import IntegrationProgram from "@/components/IntegrationProgram";
import ReRootedJourney from "@/components/ReRootedJourney";
import AboutSection from "@/components/AboutSection";

import BlogPreview from "@/components/BlogPreview";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import ContactCTA from "@/components/ContactCTA";
import Footer from "@/components/Footer";

const CorporateHome = () => (
  <main id="top">
    <WhyReRootedStatement />
    <ProblemStats
      label="WHY RE-ROOTED® EXISTS"
      headline="Relocations can be unpredictable, but here are some problems companies often face "
    />
    <WhyReRootedPillars />
    <ExpatJourney />
    <IntegrationProgram />
    <AboutSection />
    
    <BlogPreview />
    <TestimonialsCarousel />
    <ContactCTA />
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
      cta1={{ label: "Contact us", href: "#contact" }}
    />
    <Footer />
  </main>
);

export default CorporateHome;
