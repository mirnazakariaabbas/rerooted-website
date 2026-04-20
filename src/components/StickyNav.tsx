import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { Menu, X, LogIn, UserRound } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import logoShorthand from "@/assets/logo-shorthand-blue.png";
import { useAudience } from "@/contexts/AudienceContext";
import { useAuth } from "@/contexts/AuthContext";

type NavLink = { label: string; href: string; type: "route" | "hash" };

const corporateLinks: NavLink[] = [
  { label: "The Program", href: "/services", type: "route" },
  { label: "The Journey", href: "#journey", type: "hash" },
  { label: "About", href: "/about", type: "route" },
  { label: "Insights", href: "/blog", type: "route" },
  { label: "Contact", href: "/contact", type: "route" },
];

const individualLinks: NavLink[] = [
  { label: "Your Journey", href: "#journey", type: "hash" },
  { label: "Support", href: "#support", type: "hash" },
  { label: "About", href: "/about", type: "route" },
  { label: "Insights", href: "/blog", type: "route" },
  { label: "Contact", href: "/contact", type: "route" },
];

type Theme = "light" | "dark";

interface AudienceToggleProps {
  theme: Theme;
  className?: string;
}

const AudienceToggle = ({ theme, className = "" }: AudienceToggleProps) => {
  const { audience, setAudience } = useAudience();
  const isIndividual = audience === "individual";

  const trackBg =
    theme === "dark"
      ? "bg-white/10 border border-white/20"
      : "bg-[#1F299C]/10 border border-[#1F299C]/15";

  const inactiveText = theme === "dark" ? "text-white/80" : "text-[#1F299C]/70";

  return (
    <LayoutGroup id="audience-toggle">
      <div
        className={`relative inline-flex items-center rounded-full p-1 ${trackBg} ${className}`}
        role="tablist"
        aria-label="Choose audience"
      >
        {(["individual", "organization"] as const).map((opt) => {
          const active = (opt === "individual") === isIndividual;
          const label = opt === "individual" ? "Individual" : "Corporate";
          return (
            <button
              key={opt}
              role="tab"
              aria-selected={active}
              onClick={() => setAudience(opt)}
              className="relative z-10 cursor-pointer rounded-full px-4 py-1.5 text-xs font-semibold transition-colors"
            >
              {active && (
                <motion.span
                  layoutId="audience-toggle-pill"
                  className="absolute inset-0 rounded-full bg-white"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <span
                className={`relative ${
                  active ? "text-[#1F299C]" : inactiveText
                }`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </LayoutGroup>
  );
};

const StickyNav = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState<Theme>("light");
  const headerRef = useRef<HTMLElement>(null);
  const { gateOpen, setGateOpen, audience } = useAudience();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = audience === "individual" ? individualLinks : corporateLinks;
  const isHomePage = location.pathname === "/";

  const handleNavClick = (link: NavLink) => {
    setMobileOpen(false);
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

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Detect background theme by sampling sections marked data-nav-theme
  useEffect(() => {
    const sample = () => {
      if (!headerRef.current) return;
      const rect = headerRef.current.getBoundingClientRect();
      const sampleY = rect.top + rect.height / 2;
      const els = document.querySelectorAll<HTMLElement>("[data-nav-theme]");
      let next: Theme = "light";
      for (const el of Array.from(els)) {
        const r = el.getBoundingClientRect();
        if (r.top <= sampleY && r.bottom >= sampleY) {
          const t = el.getAttribute("data-nav-theme");
          if (t === "dark" || t === "light") next = t;
          break;
        }
      }
      setTheme(next);
    };
    sample();
    window.addEventListener("scroll", sample, { passive: true });
    window.addEventListener("resize", sample);
    return () => {
      window.removeEventListener("scroll", sample);
      window.removeEventListener("resize", sample);
    };
  }, [location.pathname]);

  if (gateOpen && isHomePage) return null;

  const isDark = theme === "dark";

  const headerBg = scrolled
    ? isDark
      ? "bg-[#1A1A1A]/85 border border-white/10"
      : "bg-background/95 border border-border"
    : isDark
      ? "bg-[#1A1A1A]/70 border-b border-white/10"
      : "bg-background/95 border-b border-border";

  const linkText = isDark
    ? "text-white/75 hover:text-white"
    : "text-foreground/70 hover:text-foreground";

  const iconBtn = isDark
    ? "border-white/20 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white"
    : "border-border bg-card text-foreground/70 hover:bg-muted hover:text-foreground";

  return (
    <motion.header
      ref={headerRef}
      className={`fixed inset-x-0 z-40 backdrop-blur-md transition-[background-color,border-color,top,margin,border-radius,box-shadow] duration-500 ${
        scrolled
          ? `top-3 mx-4 md:mx-8 rounded-2xl ${headerBg}`
          : `top-0 ${headerBg}`
      }`}
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <div className="container mx-auto flex h-24 items-center justify-between px-6 lg:px-12">
        <button
          onClick={() => {
            setGateOpen(true);
            window.scrollTo({ top: 0 });
          }}
          className="shrink-0 cursor-pointer"
          aria-label="Re-Rooted home"
        >
          <img
            src={logoShorthand}
            alt="Re-Rooted®"
            className={`h-20 w-auto transition-[filter] duration-500 ${
              isDark ? "brightness-0 invert" : ""
            }`}
          />
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
                <button
                  key={link.href + link.label}
                  onClick={() => handleNavClick(link)}
                  className={`text-sm font-medium transition-colors cursor-pointer bg-transparent border-none ${linkText}`}
                >
                  {link.label}
                </button>
              ))}
            </motion.div>
          </AnimatePresence>
        </nav>

        <div className="flex items-center gap-3">
          <AudienceToggle theme={theme} className="hidden md:inline-flex" />

          {user ? (
            <button
              onClick={() => navigate("/app/home")}
              className={`hidden md:inline-flex items-center justify-center h-9 w-9 rounded-full border transition-colors cursor-pointer ${iconBtn}`}
              aria-label="Go to Dashboard"
            >
              <UserRound className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={() => navigate("/auth")}
              className={`hidden md:inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                isDark
                  ? "bg-white text-[#1F299C] hover:bg-white/90"
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
              }`}
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
              <X className={`h-6 w-6 ${isDark ? "text-white" : "text-foreground"}`} />
            ) : (
              <Menu className={`h-6 w-6 ${isDark ? "text-white" : "text-foreground"}`} />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            className={`border-t px-6 py-6 md:hidden ${
              isDark ? "border-white/10 bg-[#1A1A1A]" : "border-border bg-background"
            }`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <button
                  key={link.href + link.label}
                  onClick={() => handleNavClick(link)}
                  className={`text-left text-base font-medium transition-colors cursor-pointer bg-transparent border-none ${linkText}`}
                >
                  {link.label}
                </button>
              ))}
              <AudienceToggle theme={theme} className="mt-2 w-fit" />
              {user ? (
                <button
                  onClick={() => {
                    navigate("/app/home");
                    setMobileOpen(false);
                  }}
                  className={`mt-2 w-fit inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${iconBtn}`}
                >
                  <UserRound className="h-4 w-4" />
                  My Account
                </button>
              ) : (
                <button
                  onClick={() => {
                    navigate("/auth");
                    setMobileOpen(false);
                  }}
                  className={`mt-2 w-fit rounded-full px-4 py-2 text-sm font-semibold cursor-pointer ${
                    isDark
                      ? "bg-white text-[#1F299C]"
                      : "bg-primary text-primary-foreground"
                  }`}
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
