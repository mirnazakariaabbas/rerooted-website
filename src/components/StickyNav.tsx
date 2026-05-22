import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { Menu, X, LogIn, UserRound } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import logoShorthand from "@/assets/logo-blue.png";
import { useAudience } from "@/contexts/AudienceContext";
import { useAuth } from "@/contexts/AuthContext";
import { computeNavState } from "@/lib/navAdaptive";

type NavLink = { label: string; href: string; type: "route" | "hash" };

const corporateLinks: NavLink[] = [
  { label: "PROGRAM", href: "/services", type: "route" },
  { label: "STAGES", href: "#journey", type: "hash" },
  { label: "ABOUT", href: "/about", type: "route" },
  { label: "CONTACT US", href: "/blog", type: "route" },
  { label: "Contact Us", href: "#contact", type: "hash" },
];

const individualLinks: NavLink[] = [
  { label: "STAGES", href: "#journey", type: "hash" },
  { label: "Support", href: "#support", type: "hash" },
  { label: "ABOUT", href: "/about", type: "route" },
  { label: "CONTACT US", href: "/blog", type: "route" },
  { label: "Contact Us", href: "#contact", type: "hash" },
];

interface AudienceToggleProps {
  className?: string;
}

const AudienceToggle = ({ className = "" }: AudienceToggleProps) => {
  const { audience, setAudience } = useAudience();
  const isIndividual = audience === "individual";

  return (
    <LayoutGroup id="audience-toggle">
      <div
        className={`adaptive-nav__toggle relative inline-flex items-center rounded-full p-1 ${className}`}
        role="tablist"
        aria-label="Choose audience"
      >
        {(["individual", "organization"] as const).map((opt) => {
          const active = (opt === "individual") === isIndividual;
          const label = opt === "individual" ? "INDIVIDUAL" : "CORPORATE";
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
                  className="adaptive-nav__toggle-pill absolute inset-0 rounded-full"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <span
                className={`adaptive-nav__toggle-label relative ${
                  active ? "is-active" : ""
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
  const [navState, setNavState] = useState({ solid: false, onDark: false });
  const headerRef = useRef<HTMLElement>(null);
  const { gateOpen, setGateOpen, audience, setAudience } = useAudience();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = audience === "individual" ? individualLinks : corporateLinks;
  const isHomePage = location.pathname === "/";

  const handleNavClick = (link: NavLink) => {
    setMobileOpen(false);
    if (link.type === "route") {
      navigate(link.href);
      return;
    }
    // hash link: ensure gate is dismissed, then scroll
    if (gateOpen) setGateOpen(false);
    const scrollToHash = () => {
      const el = document.querySelector(link.href);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    if (isHomePage) {
      // small delay in case gate is closing
      requestAnimationFrame(() => setTimeout(scrollToHash, gateOpen ? 100 : 0));
    } else {
      navigate("/" + link.href);
    }
  };


  // Single scroll listener: drives .solid and .on-blue via React state.
  useEffect(() => {
    const update = () => {
      const darkEls = document.querySelectorAll<HTMLElement>('[data-dark="1"]');
      const rects = Array.from(darkEls).map((el) => {
        const r = el.getBoundingClientRect();
        return { top: r.top, bottom: r.bottom };
      });
      const next = computeNavState(window.scrollY, rects);
      setNavState((prev) =>
        prev.solid === next.solid && prev.onDark === next.onDark ? prev : next
      );
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [location.pathname]);

  if (gateOpen && isHomePage) return null;

  const navClass = [
    "adaptive-nav fixed inset-x-0 top-0 z-50",
    navState.solid ? "solid" : "",
    navState.onDark ? "on-blue" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <motion.header
      ref={headerRef}
      className={navClass}
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <div className="container mx-auto flex h-24 items-center justify-between px-6 lg:px-12">
        <button
          onClick={() => {
            setAudience(null);
            if (location.pathname !== "/" || location.hash) {
              navigate("/", { replace: true });
            } else {
              window.scrollTo({ top: 0 });
            }
            setGateOpen(true);
          }}
          className="shrink-0 cursor-pointer"
          aria-label="Re-Rooted home"
        >
          <img
            src={logoShorthand}
            alt="Re-Rooted®"
            className="adaptive-nav__logo h-48 w-auto"
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
                  className="adaptive-nav__link text-sm font-medium cursor-pointer bg-transparent border-none font-sans"
                >
                  {link.label}
                </button>
              ))}
            </motion.div>
          </AnimatePresence>
        </nav>

        <div className="flex items-center gap-3">
          <AudienceToggle className="hidden md:inline-flex" />

          {user ? (
            <button
              onClick={() => navigate("/app/home")}
              className="adaptive-nav__icon-btn hidden md:inline-flex items-center justify-center h-9 w-9 rounded-full border cursor-pointer"
              aria-label="Go to Dashboard"
            >
              <UserRound className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={() => navigate("/auth")}
              className="adaptive-nav__cta hidden md:inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold cursor-pointer"
            >
              <LogIn className="h-3.5 w-3.5" />
              Login
            </button>
          )}

          <button
            className="adaptive-nav__link md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            className="adaptive-nav__mobile border-t px-6 py-6 md:hidden"
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
                  className="adaptive-nav__link text-left text-base font-medium cursor-pointer bg-transparent border-none"
                >
                  {link.label}
                </button>
              ))}
              <AudienceToggle className="mt-2 w-fit" />
              {user ? (
                <button
                  onClick={() => {
                    navigate("/app/home");
                    setMobileOpen(false);
                  }}
                  className="adaptive-nav__icon-btn mt-2 w-fit inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium cursor-pointer"
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
                  className="adaptive-nav__cta mt-2 w-fit rounded-full px-4 py-2 text-sm font-semibold cursor-pointer"
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
