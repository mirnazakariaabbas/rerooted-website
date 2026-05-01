import Hero from "@/components/Hero";
import WhyReRooted from "@/components/WhyReRooted";
import ProblemStats from "@/components/ProblemStats";
import ExpatJourney from "@/components/ExpatJourney";
import IndividualSupport from "@/components/IndividualSupport";
import AboutSection from "@/components/AboutSection";

import BlogPreview from "@/components/BlogPreview";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import ContactCTA from "@/components/ContactCTA";
import Footer from "@/components/Footer";

const IndividualHome = () => (
  <main id="top">
    <WhyReRooted />
    <ProblemStats
      label="You're Not Alone"
      headline="What nobody told you before you moved"
      closingLine="These aren't just numbers — they're people like you, navigating the same challenges you face right now."
    />
    <ExpatJourney />
    <IndividualSupport />
    <AboutSection />
    
    <BlogPreview />
    <TestimonialsCarousel />
    <ContactCTA />
    <Footer />
  </main>
);

export default IndividualHome;
