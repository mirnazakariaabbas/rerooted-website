import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import logoShorthand from "@/assets/logo-shorthand-blue.png";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6" style={{ backgroundColor: "#FAF9F6" }}>
      <img src={logoShorthand} alt="Re-Rooted®" className="mb-8 h-16 w-auto" />
      <h1 className="mb-3 font-heading text-3xl font-bold text-foreground">This page doesn't exist</h1>
      <p className="mb-6 text-base text-muted-foreground">
        The link you followed may be broken or the page may have been removed.
      </p>
      <Link
        to="/"
        className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Back to Homepage
      </Link>
    </div>
  );
};

export default NotFound;
