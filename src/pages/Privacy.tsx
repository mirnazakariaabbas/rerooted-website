import StickyNav from "@/components/StickyNav";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

const sections = [
  {
    title: "1. Who We Are",
    content: (
      <>
        <p><strong>Re-Rooted®</strong> is an expat mobility coaching company founded by Yasser Abbas, based in Switzerland.</p>
        <p className="mt-3">Data Controller:<br />
        <strong>Re-Rooted®</strong><br />
        Zug, Switzerland<br />
        Email: hello@rerooted.ch</p>
        <p className="mt-3">This privacy policy explains how we collect, use, store, and protect your personal data when you visit our website, use our services, or interact with us. This policy is designed to comply with the Swiss Federal Act on Data Protection (FADP) and, where applicable, the EU General Data Protection Regulation (GDPR).</p>
      </>
    ),
  },
  {
    title: "2. What Data We Collect",
    content: (
      <>
        <p>We collect the following categories of personal data:</p>
        <ul className="mt-3 list-disc pl-6 space-y-2">
          <li><strong>Contact information:</strong> name, email address, phone number, company name, submitted through our contact forms.</li>
          <li><strong>Usage data:</strong> information about how you interact with our website, including pages visited, time spent, browser type, device type, and IP address. This data is collected through cookies and similar technologies.</li>
          <li><strong>Communication data:</strong> the content of messages you send us through contact forms or email.</li>
          <li><strong>Journey stage data:</strong> if you indicate which stage of the expat journey you are in (Pre-Rooted, Rooting In, Thrive, Rooting Back) through our forms, we collect this to better understand your needs.</li>
        </ul>
        <p className="mt-3">We do not collect sensitive personal data (health data, biometric data, religious beliefs, etc.) through our website.</p>
      </>
    ),
  },
  {
    title: "3. Why We Collect Your Data",
    content: (
      <ul className="list-disc pl-6 space-y-2">
        <li>To respond to your inquiries and provide information about our services.</li>
        <li>To improve our website and user experience.</li>
        <li>To analyze website traffic and usage patterns.</li>
        <li>To send you relevant information about <strong>Re-Rooted®</strong> services, only if you have opted in.</li>
        <li>To comply with legal obligations.</li>
      </ul>
    ),
  },
  {
    title: "4. Legal Basis for Processing",
    content: (
      <>
        <p>Under the Swiss FADP, we process your data based on:</p>
        <ul className="mt-3 list-disc pl-6 space-y-2">
          <li>Your consent, where explicitly provided (e.g., contact form submissions, newsletter sign-up).</li>
          <li>Our legitimate interests in operating and improving our business, where this does not override your rights.</li>
          <li>Compliance with legal obligations.</li>
        </ul>
        <p className="mt-3">For visitors from the EU/EEA, we additionally rely on the legal bases set out in Article 6 of the GDPR.</p>
      </>
    ),
  },
  {
    title: "5. Cookies and Tracking Technologies",
    content: (
      <>
        <p>Our website uses cookies and similar technologies to:</p>
        <ul className="mt-3 list-disc pl-6 space-y-2">
          <li>Ensure the website functions properly (essential cookies).</li>
          <li>Analyze how visitors use our site (analytics cookies).</li>
          <li>Remember your preferences (functional cookies).</li>
        </ul>
        <p className="mt-3">You can manage your cookie preferences at any time through the cookie banner on our website. You can also disable cookies through your browser settings, though this may affect your experience on our site.</p>
        <p className="mt-3">For more details, see our Cookie Settings accessible via the cookie banner.</p>
      </>
    ),
  },
  {
    title: "6. Who We Share Your Data With",
    content: (
      <>
        <p>We may share your personal data with:</p>
        <ul className="mt-3 list-disc pl-6 space-y-2">
          <li>Website hosting and technology providers (e.g., Lovable, email service providers) who process data on our behalf.</li>
          <li>Analytics providers (e.g., Google Analytics, if implemented) for website usage analysis.</li>
          <li>Professional advisors (legal, accounting) where necessary.</li>
        </ul>
        <p className="mt-3">We do not sell your personal data to third parties.</p>
      </>
    ),
  },
  {
    title: "7. International Data Transfers",
    content: (
      <p>As a Swiss-based company, your data may be transferred to and processed in Switzerland. Where data is transferred outside of Switzerland or the EU/EEA, we ensure appropriate safeguards are in place, such as standard contractual clauses or adequacy decisions, in accordance with the FADP and GDPR.</p>
    ),
  },
  {
    title: "8. How Long We Keep Your Data",
    content: (
      <>
        <p>We retain your personal data only as long as necessary to fulfill the purposes for which it was collected, or as required by law. Specifically:</p>
        <ul className="mt-3 list-disc pl-6 space-y-2">
          <li><strong>Contact form submissions:</strong> retained for up to 2 years after our last interaction.</li>
          <li><strong>Website analytics data:</strong> retained in anonymized form.</li>
          <li><strong>Communication records:</strong> retained for as long as a business relationship exists, plus any legally required retention period.</li>
        </ul>
      </>
    ),
  },
  {
    title: "9. Your Rights",
    content: (
      <>
        <p>Under the FADP and, where applicable, the GDPR, you have the following rights:</p>
        <ul className="mt-3 list-disc pl-6 space-y-2">
          <li><strong>Right of access:</strong> You can request information about the personal data we hold about you.</li>
          <li><strong>Right to rectification:</strong> You can request that we correct inaccurate or incomplete data.</li>
          <li><strong>Right to deletion:</strong> You can request that we delete your personal data, subject to legal retention requirements.</li>
          <li><strong>Right to restrict processing:</strong> You can request that we limit how we use your data.</li>
          <li><strong>Right to data portability:</strong> You can request a copy of your data in a structured, commonly used format.</li>
          <li><strong>Right to object:</strong> You can object to processing based on our legitimate interests.</li>
          <li><strong>Right to withdraw consent:</strong> Where processing is based on your consent, you can withdraw it at any time.</li>
        </ul>
        <p className="mt-3">To exercise any of these rights, please contact us at: hello@rerooted.ch</p>
      </>
    ),
  },
  {
    title: "10. Data Security",
    content: (
      <p>We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, loss, misuse, or alteration. These measures include encrypted data transmission (SSL/TLS), secure hosting, and access controls.</p>
    ),
  },
  {
    title: "11. Children's and Family Data",
    content: (
      <>
        <p><strong>Re-Rooted®</strong> provides family integration support as part of its coaching programs. This may involve collecting and processing limited personal data relating to children (under 18). Specifically:</p>
        <h4 className="mt-4 font-bold text-foreground">Data we may collect about children:</h4>
        <ul className="mt-2 list-disc pl-6 space-y-2">
          <li>Names of children, provided by a parent or guardian through the <strong>Re-Rooted®</strong> app, for the purpose of booking and managing family coaching sessions.</li>
          <li>Ages or age ranges, to tailor coaching support appropriately.</li>
          <li>General information about a child's adjustment experience, as shared by the parent or guardian during coaching sessions.</li>
        </ul>
        <h4 className="mt-4 font-bold text-foreground">How we handle children's data:</h4>
        <ul className="mt-2 list-disc pl-6 space-y-2">
          <li>We collect children's data ONLY from their parent or legal guardian, never directly from the child.</li>
          <li>Children do not have direct access to the <strong>Re-Rooted®</strong> app or website accounts. All data is entered and managed by the parent or guardian.</li>
          <li>We process children's data solely for the purpose of delivering family coaching services. We do not use it for marketing, profiling, or any other purpose.</li>
          <li>We obtain explicit consent from the parent or legal guardian before collecting or processing any data relating to their children.</li>
          <li>Children's data is subject to the same security measures, retention policies, and rights described in this policy.</li>
        </ul>
        <h4 className="mt-4 font-bold text-foreground">Parental rights:</h4>
        <ul className="mt-2 list-disc pl-6 space-y-2">
          <li>Parents or legal guardians may request access to, correction of, or deletion of their children's data at any time by contacting us at hello@rerooted.ch.</li>
          <li>If a parent or guardian withdraws consent for the processing of their child's data, we will promptly delete all related information, except where retention is required by law.</li>
        </ul>
        <p className="mt-3">If you believe that data about a child has been collected without proper parental consent, please contact us immediately at hello@rerooted.ch and we will take prompt action to investigate and delete the data if appropriate.</p>
      </>
    ),
  },
  {
    title: "12. Changes to This Policy",
    content: (
      <p>We may update this privacy policy from time to time to reflect changes in our practices or legal requirements. The updated version will be posted on this page with a revised "last updated" date. We encourage you to review this policy periodically.</p>
    ),
  },
  {
    title: "13. Contact",
    content: (
      <p>If you have any questions about this privacy policy or our data practices, please contact:<br /><br />
      <strong>Re-Rooted®</strong><br />
      Zug, Switzerland<br />
      Email: hello@rerooted.ch</p>
    ),
  },
];

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <StickyNav />
      <motion.main
        className="mx-auto max-w-[720px] px-6 py-20 md:py-28"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-foreground font-extrabold text-3xl md:text-4xl mb-2">Privacy Policy</h1>
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

export default Privacy;
