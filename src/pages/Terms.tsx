import StickyNav from "@/components/StickyNav";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

const sections = [
  {
    title: "1. Introduction",
    content: (
      <>
        <p>These Terms &amp; Conditions govern your use of the <strong>Re-Rooted®</strong> website (re-rooted.com) and any services offered through it. By accessing or using our website, you agree to be bound by these terms. If you do not agree, please do not use our website.</p>
        <p className="mt-3"><strong>Re-Rooted®</strong> is operated by Yasser Abbas, based in Zug, Switzerland.</p>
      </>
    ),
  },
  {
    title: "2. Services",
    content: (
      <>
        <p><strong>Re-Rooted®</strong> provides expat mobility coaching services for organizations and individuals. Our website provides information about our services, allows visitors to contact us, and hosts articles and resources related to the expat experience.</p>
        <p className="mt-3">Our coaching services are not a substitute for therapy, counseling, psychological treatment, or medical care. If you are experiencing a mental health crisis, please contact a qualified healthcare professional.</p>
      </>
    ),
  },
  {
    title: "3. Intellectual Property",
    content: (
      <>
        <p>All content on this website, including text, images, graphics, logos, and design elements, is the property of <strong>Re-Rooted®</strong> or its licensors and is protected by copyright and trademark law.</p>
        <p className="mt-3"><strong>Re-Rooted®</strong> is a registered trademark. You may not use the <strong>Re-Rooted®</strong> name, logo, or any other proprietary materials without prior written permission.</p>
        <p className="mt-3">You may view, download, and print content from our website for personal, non-commercial use only.</p>
      </>
    ),
  },
  {
    title: "4. User Conduct",
    content: (
      <>
        <p>When using our website and contact forms, you agree to:</p>
        <ul className="mt-3 list-disc pl-6 space-y-2">
          <li>Provide accurate and truthful information.</li>
          <li>Not submit any content that is unlawful, harmful, threatening, abusive, defamatory, or otherwise objectionable.</li>
          <li>Not attempt to gain unauthorized access to any part of the website or its systems.</li>
          <li>Not use the website for any commercial purpose without our prior written consent.</li>
        </ul>
      </>
    ),
  },
  {
    title: "5. Contact Form Submissions",
    content: (
      <p>Information submitted through our contact forms is used solely to respond to your inquiry and provide information about our services. By submitting a form, you consent to us processing your data in accordance with our Privacy Policy.</p>
    ),
  },
  {
    title: "6. Third-Party Links",
    content: (
      <p>Our website may contain links to third-party websites. We are not responsible for the content, privacy practices, or availability of these external sites. Accessing them is at your own risk.</p>
    ),
  },
  {
    title: "7. Disclaimers",
    content: (
      <>
        <p>The information on this website is provided for general informational purposes only. While we strive to keep it accurate and up to date, we make no warranties or representations about the completeness, accuracy, reliability, or suitability of the information.</p>
        <p className="mt-3">Statistics and data cited on our website are sourced from published research and may reflect varied methodologies and sample sizes. They are presented for illustrative purposes and should not be taken as guarantees of outcomes.</p>
        <p className="mt-3">Coaching outcomes vary by individual and depend on many factors. <strong>Re-Rooted®</strong> does not guarantee specific results from its coaching programs.</p>
      </>
    ),
  },
  {
    title: "8. Limitation of Liability",
    content: (
      <p>To the fullest extent permitted by law, <strong>Re-Rooted®</strong> and its founder, employees, coaches, and affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of the website or our services.</p>
    ),
  },
  {
    title: "9. Governing Law",
    content: (
      <p>These Terms &amp; Conditions are governed by and construed in accordance with the laws of Switzerland. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts of the Canton of Zug, Switzerland.</p>
    ),
  },
  {
    title: "10. Changes to These Terms",
    content: (
      <p>We reserve the right to modify these terms at any time. Changes will be posted on this page with a revised "last updated" date. Continued use of the website after changes constitutes acceptance of the revised terms.</p>
    ),
  },
  {
    title: "11. Contact",
    content: (
      <p>For questions about these terms, please contact:<br /><br />
      <strong>Re-Rooted®</strong><br />
      Zug, Switzerland<br />
      Email: hello@rerooted.ch</p>
    ),
  },
];

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <StickyNav />
      <motion.main
        className="mx-auto max-w-[720px] px-6 py-20 md:py-28"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-foreground font-extrabold text-3xl md:text-4xl mb-2">Terms &amp; Conditions</h1>
        <p className="text-muted-foreground text-sm mb-12">Last updated: April 2026</p>

        <div className="space-y-10">
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="text-foreground font-bold text-xl mb-3">{section.title}</h2>
              <div className="text-foreground/80 text-base leading-relaxed">{section.content}</div>
            </div>
          ))}
        </div>
      </motion.main>
      <Footer />
    </div>
  );
};

export default Terms;
