import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import logoShorthand from "@/assets/logo-shorthand-blue.png";
import { useAudience } from "@/contexts/AudienceContext";

const navLinks = [
  { label: "The Program", href: "#program" },
  { label: "The Journey", href: "#journey" },
  { label: "About", href: "#about" },
  { label: "Insights", href: "#insights" },
  { label: "Contact", href: "#contact" },
];

const AudienceToggle = ({ className = "" }: { className?: string }) => {
  const { audience, setAudience } = useAudience();
  const isOrg = audience === "organization" || audience === null;
  const label = isOrg ? "For Organizations" : "For Individuals";

  const toggle = () => setAudience(isOrg ? "individual" : "organization");

  return (
    <button
      onClick={toggle}
      className={`inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-semibold text-foreground/80 transition-colors hover:bg-muted cursor-pointer ${className}`}
    >
      <span className={`h-2 w-2 rounded-full transition-colors ${isOrg ? "bg-secondary" : "bg-accent"}`} />
      <AnimatePresence mode="wait">
        <motion.span
          key={label}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
        >
          {label}
        </motion.span>
      </AnimatePresence>
    </button>
  );
};

const StickyNav = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { gateOpen } = useAudience();

  if (gateOpen) return null;

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm"
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <div className="container mx-auto flex h-24 items-center justify-between px-6 lg:px-12">
        <a href="#top" className="shrink-0">
          <img src={logoShorthand} alt="Re-Rooted®" className="h-20 w-auto" />
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground/70 transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <AudienceToggle className="hidden md:inline-flex" />

          <button
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="h-6 w-6 text-foreground" />
            ) : (
              <Menu className="h-6 w-6 text-foreground" />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            className="border-t border-border bg-background px-6 py-6 md:hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-base font-medium text-foreground/80 transition-colors hover:text-foreground"
                >
                  {link.label}
                </a>
              ))}
              <AudienceToggle className="mt-2 w-fit" />
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default StickyNav;
