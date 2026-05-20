import { createContext, useContext, useState, useCallback, ReactNode } from "react";

type Audience = "organization" | "individual" | null;

interface AudienceContextType {
  audience: Audience;
  setAudience: (audience: Audience) => void;
  gateOpen: boolean;
  setGateOpen: (open: boolean) => void;
  hasSeenIntro: boolean;
  markIntroSeen: () => void;
}

const AudienceContext = createContext<AudienceContextType | undefined>(undefined);

const STORAGE_AUDIENCE = "rr-audience";
const STORAGE_INTRO = "rr-intro-seen";

const readAudience = (): Audience => {
  if (typeof window === "undefined") return null;
  const v = window.localStorage.getItem(STORAGE_AUDIENCE);
  return v === "organization" || v === "individual" ? v : null;
};

const readIntroSeen = (): boolean => {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(STORAGE_INTRO) === "1";
};

export function AudienceProvider({ children }: { children: ReactNode }) {
  const [audience, setAudienceState] = useState<Audience>(readAudience);
  const [gateOpen, setGateOpen] = useState(true);
  const [hasSeenIntro, setHasSeenIntro] = useState<boolean>(readIntroSeen);

  const setAudience = useCallback((next: Audience) => {
    setAudienceState(next);
    if (typeof window !== "undefined") {
      if (next) window.localStorage.setItem(STORAGE_AUDIENCE, next);
      else window.localStorage.removeItem(STORAGE_AUDIENCE);
    }
  }, []);

  const markIntroSeen = useCallback(() => {
    setHasSeenIntro(true);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_INTRO, "1");
    }
  }, []);

  return (
    <AudienceContext.Provider
      value={{ audience, setAudience, gateOpen, setGateOpen, hasSeenIntro, markIntroSeen }}
    >
      {children}
    </AudienceContext.Provider>
  );
}

export function useAudience() {
  const context = useContext(AudienceContext);
  if (!context) throw new Error("useAudience must be used within AudienceProvider");
  return context;
}
