import Hero from "@/components/Hero";
import WhyReRooted from "@/components/WhyReRooted";
import ProblemStats from "@/components/ProblemStats";
import IntegrationProgram from "@/components/IntegrationProgram";
import ExpatJourney from "@/components/ExpatJourney";
import AboutSection from "@/components/AboutSection";

import BlogPreview from "@/components/BlogPreview";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import ContactCTA from "@/components/ContactCTA";
import Footer from "@/components/Footer";

const CorporateHome = () => (
  <main id="top">
    <WhyReRooted />
    <ProblemStats
      label="WHY RE-ROOTED® EXISTS"
      headline="The Problem Companies Avoid"
    />
    <IntegrationProgram />
    <ExpatJourney />
    <AboutSection />
    
    <BlogPreview />
    <TestimonialsCarousel />
    <ContactCTA />
    <Footer />
  </main>
);

export default CorporateHome;
