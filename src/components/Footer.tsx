import { useAudience } from "@/contexts/AudienceContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logoWhite from "@/assets/logo-wordmark-white.png";
import { Linkedin } from "lucide-react";

type FooterLink = { label: string; href: string; type: "route" | "hash" };

const corporateLinks: FooterLink[] = [
  { label: "Program", href: "/services", type: "route" },
  { label: "The Journey", href: "#journey", type: "hash" },
  { label: "About", href: "/about", type: "route" },
  { label: "Insights", href: "/blog", type: "route" },
  { label: "Contact", href: "#contact", type: "hash" },
  { label: "FAQ", href: "/faq", type: "route" },
  { label: "Privacy Policy", href: "/privacy", type: "route" },
  { label: "Terms & Conditions", href: "/terms", type: "route" },
];

const individualLinks: FooterLink[] = [
  { label: "Your Journey", href: "#journey", type: "hash" },
  { label: "Support", href: "#support", type: "hash" },
  { label: "About", href: "/about", type: "route" },
  { label: "Insights", href: "/blog", type: "route" },
  { label: "Contact", href: "#contact", type: "hash" },
  { label: "FAQ", href: "/faq", type: "route" },
  { label: "Privacy Policy", href: "/privacy", type: "route" },
  { label: "Terms & Conditions", href: "/terms", type: "route" },
];

const Footer = () => {
  const { audience, setAudience } = useAudience();
  const isOrg = audience === "organization" || audience === null;
  const links = isOrg ? corporateLinks : individualLinks;
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === "/";

  const handleClick = (link: FooterLink) => {
    if (link.type === "route") {
      navigate(link.href);
    } else {
      if (isHomePage) {
        const el = document.querySelector(link.href);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      } else {
        navigate("/" + link.href);
      }
    }
  };

  return (
    <footer data-dark="1" data-nav-theme="dark" style={{ backgroundColor: "#1A1A1A" }} className="px-6 py-8 md:py-10 lg:px-12">
      <div className="container mx-auto">
        <div className="grid gap-6 text-center md:grid-cols-3 md:text-left">
          <div className="flex flex-col items-center md:items-start">
            <img src={logoWhite} alt="Re-Rooted®" className="h-10 w-auto" />
            <p className="mt-3 text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
              © 2026 Re-Rooted®. All rights reserved.
            </p>
            <p className="mt-1 text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
              <strong>Re-Rooted®</strong> is a registered trademark.
            </p>
            <p className="mt-1 text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
              Coaching is not therapy, counseling, or medical treatment.
            </p>
          </div>

          <nav className="grid grid-cols-2 gap-x-8 gap-y-2 items-start justify-items-start text-left">
            {links.map((l) => (
              <button
                key={l.href + l.label}
                onClick={() => handleClick(l)}
                className="text-sm transition-colors hover:text-white cursor-pointer bg-transparent border-none text-left w-full whitespace-nowrap"
                style={{ color: "rgba(255,255,255,0.7)" }}
              >
                {l.label}
              </button>
            ))}
          </nav>

          <div className="flex flex-col items-center gap-4 md:items-end">
            <Link
              to="/#contact"
              className="text-sm font-semibold transition-colors hover:opacity-80"
              style={{ color: "#3DA776" }}
            >
              {isOrg
                ? "Ready to talk? Get in touch →"
                : "Ready to talk? Reach out →"}
            </Link>
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

        <div className="mt-6 flex justify-center">
          <button
            onClick={() => setAudience(isOrg ? "individual" : "organization")}
            className="cursor-pointer text-xs transition-colors hover:text-white bg-transparent border-none"
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
