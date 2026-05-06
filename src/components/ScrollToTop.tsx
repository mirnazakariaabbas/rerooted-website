import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // Wait a tick for the page to render then scroll to the section
      const id = hash.replace("#", "");
      const tryScroll = (attempt = 0) => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        } else if (attempt < 10) {
          setTimeout(() => tryScroll(attempt + 1), 80);
        }
      };
      tryScroll();
      return;
    }
    window.scrollTo({ top: 0, left: 0 });
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
