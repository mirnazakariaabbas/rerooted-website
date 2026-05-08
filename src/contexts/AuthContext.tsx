import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, meta?: Record<string, string>) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string, keepSignedIn?: boolean) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const KEEP_KEY = "rerooted_keep_signed_in";
const TAB_KEY = "rerooted_tab_active";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // If user opted out of "keep signed in", clear session on new browser session
    const init = async () => {
      const keep = localStorage.getItem(KEEP_KEY);
      const tabActive = sessionStorage.getItem(TAB_KEY);
      if (keep === "false" && !tabActive) {
        await supabase.auth.signOut();
      }
      sessionStorage.setItem(TAB_KEY, "1");
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    };
    init();

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, meta?: Record<string, string>) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: meta,
        emailRedirectTo: window.location.origin,
      },
    });
    return { error: error as Error | null };
  };

  const signIn = async (email: string, password: string, keepSignedIn = true) => {
    localStorage.setItem(KEEP_KEY, keepSignedIn ? "true" : "false");
    sessionStorage.setItem(TAB_KEY, "1");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error as Error | null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { error: error as Error | null };
  };

  return (
    <AuthContext.Provider value={{ session, user, loading, signUp, signIn, signOut, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
