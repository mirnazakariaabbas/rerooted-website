import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogIn, LayoutDashboard, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logoShorthand from "@/assets/logo-shorthand-blue.png";
import { useAudience } from "@/contexts/AudienceContext";
import { useAuth } from "@/contexts/AuthContext";

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
  const [scrolled, setScrolled] = useState(false);
  const { gateOpen, setGateOpen, audience } = useAudience();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const navLinks = audience === "individual" ? individualLinks : corporateLinks;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (gateOpen) return null;

  return (
    <motion.header
      className={`fixed inset-x-0 z-40 bg-background/95 backdrop-blur-sm transition-all duration-300 ${
        scrolled
          ? "top-3 mx-4 md:mx-8 rounded-2xl shadow-lg border border-border"
          : "top-0 border-b border-border"
      }`}
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <div className="container mx-auto flex h-24 items-center justify-between px-6 lg:px-12">
        <button
          onClick={() => { setGateOpen(true); window.scrollTo({ top: 0 }); }}
          className="shrink-0 cursor-pointer"
        >
          <img src={logoShorthand} alt="Re-Rooted®" className="h-20 w-auto" />
        </button>

        <nav className="hidden items-center gap-8 md:flex">
          <AnimatePresence mode="wait">
            <motion.div
              key={audience}
              className="flex items-center gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {navLinks.map((link) => (
                <a
                  key={link.href + link.label}
                  href={link.href}
                  className="text-sm font-medium text-foreground/70 transition-colors hover:text-foreground"
                >
                  {link.label}
                </a>
              ))}
            </motion.div>
          </AnimatePresence>
        </nav>

        <div className="flex items-center gap-3">
          <AudienceToggle className="hidden md:inline-flex" />

          {user ? (
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => navigate("/app/home")}
                className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90 cursor-pointer"
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                Go to Dashboard
              </button>
              <button
                onClick={() => signOut()}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <LogOut className="h-3 w-3" />
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate("/auth")}
              className="hidden md:inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90 cursor-pointer"
            >
              <LogIn className="h-3.5 w-3.5" />
              Login
            </button>
          )}

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
                  key={link.href + link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-base font-medium text-foreground/80 transition-colors hover:text-foreground"
                >
                  {link.label}
                </a>
              ))}
              <AudienceToggle className="mt-2 w-fit" />
              {user ? (
                <button
                  onClick={() => { signOut(); setMobileOpen(false); }}
                  className="mt-2 w-fit rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground cursor-pointer"
                >
                  Sign Out
                </button>
              ) : (
                <button
                  onClick={() => { navigate("/auth"); setMobileOpen(false); }}
                  className="mt-2 w-fit rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground cursor-pointer"
                >
                  Login
                </button>
              )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default StickyNav;
