import Hero from "@/components/Hero";
import { WhyReRootedStatement, WhyReRootedPillars } from "@/components/WhyReRooted";
import ProblemStats from "@/components/ProblemStats";
import ReRootedJourney from "@/components/ReRootedJourney";
import ExpatJourney from "@/components/ExpatJourney";
import IndividualSupport from "@/components/IndividualSupport";
import AboutSection from "@/components/AboutSection";

import BlogPreview from "@/components/BlogPreview";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import ContactCTA from "@/components/ContactCTA";
import Footer from "@/components/Footer";

const IndividualHome = () => (
  <main id="top">
    <WhyReRootedStatement />
    <ProblemStats
      label="You're Not Alone"
      headline="Relocations can be unpredictable, but here are some problems companies often face "
      closingLine="These aren't just numbers, they're people like you, navigating the same challenges you face right now."
    />
    <WhyReRootedPillars />
    <ReRootedJourney />
    <IndividualSupport />
    <AboutSection />
    
    <BlogPreview />
    <TestimonialsCarousel />
    <ContactCTA />
    <Hero
      variant="individual"
      headline1="You are moving countries,"
      headline2="Now what?"
      body={
        <>
          <p>
            You've handled the logistics, the visa, the flight, the apartment.
            <br />
            But nobody told you about the <strong>emotional side</strong>.
          </p>
          <p>
            <strong>Re-Rooted®</strong> helps you navigate the human challenges
            of relocation, so you can feel at home, not just live somewhere new.
          </p>
        </>
      }
      cta1={{ label: "Contact us", href: "#contact" }}
    />
    <Footer />
  </main>
);

export default IndividualHome;
