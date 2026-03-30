import { useAudience } from "@/contexts/AudienceContext";
import logoWhite from "@/assets/logo-wordmark-white.png";
import { Linkedin } from "lucide-react";

const corporateLinks = [
  { label: "The Program", href: "#program" },
  { label: "The Journey", href: "#journey" },
  { label: "About", href: "#about" },
  { label: "Insights", href: "#insights" },
  { label: "Contact", href: "#contact" },
];

const individualLinks = [
  { label: "Your Journey", href: "#journey" },
  { label: "Support", href: "#support" },
  { label: "About", href: "#about" },
  { label: "Insights", href: "#insights" },
  { label: "Contact", href: "#contact" },
];

const Footer = () => {
  const { audience, setAudience } = useAudience();
  const isOrg = audience === "organization" || audience === null;
  const links = isOrg ? corporateLinks : individualLinks;

  return (
    <footer style={{ backgroundColor: "#1A1A1A" }} className="px-6 py-12 md:py-16 lg:px-12">
      <div className="container mx-auto">
        {/* 3-column grid */}
        <div className="grid gap-10 text-center md:grid-cols-3 md:text-left">
          {/* Left: logo + copyright */}
          <div className="flex flex-col items-center md:items-start">
            <img src={logoWhite} alt="Re-Rooted®" className="h-10 w-auto" />
            <p className="mt-4 text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
              © 2026 Re-Rooted®. All rights reserved.
            </p>
          </div>

          {/* Center: nav links */}
          <nav className="flex flex-col items-center gap-3 md:items-start">
            {links.map((l) => (
              <a
                key={l.href + l.label}
                href={l.href}
                className="text-sm transition-colors hover:text-white"
                style={{ color: "rgba(255,255,255,0.7)" }}
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* Right: CTA + LinkedIn */}
          <div className="flex flex-col items-center gap-4 md:items-end">
            <a
              href="#contact"
              className="text-sm font-semibold transition-colors hover:opacity-80"
              style={{ color: "#3DA776" }}
            >
              {isOrg
                ? "Ready to talk? Get in touch →"
                : "Ready to talk? Reach out →"}
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:opacity-80"
              style={{ color: "rgba(255,255,255,0.7)" }}
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>

        {/* Audience toggle pill */}
        <div className="mt-10 flex justify-center">
          <button
            onClick={() => setAudience(isOrg ? "individual" : "organization")}
            className="cursor-pointer text-xs transition-colors hover:text-white"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            Viewing: {isOrg ? "For Organizations" : "For Individuals"} |{" "}
            Switch to {isOrg ? "Individual" : "Organization"} →
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
