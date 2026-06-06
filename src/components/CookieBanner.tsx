import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import { X } from "lucide-react";

const STORAGE_KEY = "rr_cookie_consent";

interface CookiePrefs {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
}

const CookieBanner = () => {
  const [visible, setVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [prefs, setPrefs] = useState<CookiePrefs>({
    essential: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) setVisible(true);
  }, []);

  const acceptAll = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ essential: true, analytics: true, marketing: true }));
    setVisible(false);
  };

  const rejectAll = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ essential: true, analytics: false, marketing: false }));
    setVisible(false);
  };

  const savePrefs = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    setShowModal(false);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <>
      {/* Banner */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 px-4 py-3 md:px-8 md:py-4 flex flex-col md:flex-row items-center justify-between gap-3"
        style={{ backgroundColor: "#1A1A1A" }}
      >
        <p className="text-sm text-white/80 max-w-2xl text-center md:text-left">
          We use cookies to improve your experience on our website. By continuing to browse, you consent to our use of cookies.{" "}
          <Link to="/privacy" className="text-secondary underline hover:opacity-80">
            Learn more
          </Link>
        </p>
        <div className="flex flex-wrap items-center gap-3 shrink-0 justify-center">
          <button
            onClick={() => setShowModal(true)}
            className="text-sm text-white/60 hover:text-white transition-colors bg-transparent border-none cursor-pointer underline"
          >
            Customize cookie settings
          </button>
          <button
            onClick={rejectAll}
            className="rounded-lg px-5 py-2 text-sm font-semibold text-white bg-white/10 hover:bg-white/20 transition-colors cursor-pointer border-none"
          >
            Reject all
          </button>
          <button
            onClick={acceptAll}
            className="rounded-lg px-5 py-2 text-sm font-semibold text-white bg-secondary hover:bg-secondary/90 transition-colors cursor-pointer border-none"
          >
            Accept all
          </button>
        </div>
      </div>

      {/* Preferences Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4">
          <div className="bg-card rounded-2xl w-full max-w-md p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground bg-transparent border-none cursor-pointer"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-foreground font-bold text-lg mb-4">Cookie Preferences</h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-foreground font-medium text-sm">Essential cookies</p>
                  <p className="text-muted-foreground text-xs">Required for the website to function</p>
                </div>
                <Switch checked disabled />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-foreground font-medium text-sm">Analytics cookies</p>
                  <p className="text-muted-foreground text-xs">Help us understand how visitors use our site</p>
                </div>
                <Switch checked={prefs.analytics} onCheckedChange={(v) => setPrefs((p) => ({ ...p, analytics: v }))} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-foreground font-medium text-sm">Marketing cookies</p>
                  <p className="text-muted-foreground text-xs">Used to deliver relevant content</p>
                </div>
                <Switch checked={prefs.marketing} onCheckedChange={(v) => setPrefs((p) => ({ ...p, marketing: v }))} />
              </div>
            </div>

            <button
              onClick={savePrefs}
              className="mt-6 w-full rounded-lg py-2.5 text-sm font-semibold text-white bg-secondary hover:bg-secondary/90 transition-colors cursor-pointer border-none"
            >
              Save preferences
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default CookieBanner;
