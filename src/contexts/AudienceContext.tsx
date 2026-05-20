import { createContext, useContext, useState, ReactNode } from "react";

type Audience = "organization" | "individual" | null;

interface AudienceContextType {
  audience: Audience;
  setAudience: (audience: Audience) => void;
  gateOpen: boolean;
  setGateOpen: (open: boolean) => void;
}

const AudienceContext = createContext<AudienceContextType | undefined>(undefined);

export function AudienceProvider({ children }: { children: ReactNode }) {
  const [audience, setAudience] = useState<Audience>(null);
  const [gateOpen, setGateOpen] = useState(true);

  return (
    <AudienceContext.Provider value={{ audience, setAudience, gateOpen, setGateOpen }}>
      {children}
    </AudienceContext.Provider>
  );
}

export function useAudience() {
  const context = useContext(AudienceContext);
  if (!context) throw new Error("useAudience must be used within AudienceProvider");
  return context;
}
