import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import logoWhite from "@/assets/logo-white.png";

type Mode = "signin" | "signup";
type UserType = "individual" | "organization";

const STORAGE_KEY = "rerooted_remember";

const Auth = () => {
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [userType, setUserType] = useState<UserType>("individual");
  const [rememberMe, setRememberMe] = useState(false);
  const [pending, setPending] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { signUp, signIn } = useAuth();
  const navigate = useNavigate();

  // Load remembered credentials
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const { email: savedEmail, password: savedPassword } = JSON.parse(saved);
        setEmail(savedEmail || "");
        setPassword(savedPassword || "");
        setRememberMe(true);
      }
    } catch {}
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Handle remember me
    if (rememberMe) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ email, password }));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }

    if (mode === "signup") {
      const { error } = await signUp(email, password, {
        full_name: fullName,
        user_type: userType,
      });
      setSubmitting(false);
      if (error) {
        toast.error(error.message);
      } else {
        setPending(true);
      }
    } else {
      const { error } = await signIn(email, password);
      setSubmitting(false);
      if (error) {
        toast.error(error.message);
      } else {
        navigate("/app/home");
      }
    }
  };

  if (pending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full text-center space-y-6"
        >
          <img src={logoWhite} alt="Re-Rooted®" className="h-24 mx-auto object-contain" />
          <h1 className="text-2xl font-bold text-primary-foreground">Check your email</h1>
          <p className="text-primary-foreground/80">
            We've sent you a verification link. After verifying your email, an admin will review and approve your account.
          </p>
          <p className="text-sm text-primary-foreground/60">
            You'll receive a notification once your account is approved.
          </p>
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="border-primary-foreground/60 text-primary-foreground hover:bg-primary-foreground hover:text-primary"
          >
            Back to Home
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8"
      >
        {/* Logo */}
        <div className="text-center">
          <button onClick={() => navigate("/")} className="cursor-pointer">
            <img src={logoWhite} alt="Re-Rooted®" className="h-28 mx-auto object-contain" />
          </button>
          <p
            className="mt-1 text-lg font-light italic tracking-wide text-primary-foreground/80"
            style={{ fontWeight: 300 }}
          >
            The human side of relocation
          </p>
          <h1 className="mt-6 text-2xl font-bold text-primary-foreground">
            {mode === "signin" ? "Welcome back" : "Request access"}
          </h1>
          <p className="mt-1 text-sm text-primary-foreground/70">
            {mode === "signin"
              ? "Sign in to access your dashboard"
              : "Sign up and an admin will approve your account"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <AnimatePresence mode="wait">
            {mode === "signup" && (
              <motion.div
                key="signup-fields"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-primary-foreground/90">
                    Full Name
                  </Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    placeholder="Your full name"
                    className="border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/40 focus:border-primary-foreground/60"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-primary-foreground/90">I am</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {(["individual", "organization"] as UserType[]).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setUserType(t)}
                        className={`rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all cursor-pointer ${
                          userType === t
                            ? "border-primary-foreground bg-primary-foreground/20 text-primary-foreground"
                            : "border-primary-foreground/30 text-primary-foreground/60 hover:border-primary-foreground/60"
                        }`}
                      >
                        {t === "individual" ? "An Individual" : "With an Organization"}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-primary-foreground/90">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/40 focus:border-primary-foreground/60"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-primary-foreground/90">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              minLength={6}
              className="border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/40 focus:border-primary-foreground/60"
            />
          </div>

          {mode === "signin" && (
            <div className="flex items-center gap-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked === true)}
                className="border-primary-foreground/40 data-[state=checked]:bg-primary-foreground data-[state=checked]:text-primary"
              />
              <Label htmlFor="remember" className="text-sm text-primary-foreground/70 cursor-pointer">
                Remember me
              </Label>
            </div>
          )}

          <Button
            type="submit"
            className="w-full rounded-lg border-2 border-primary-foreground bg-primary-foreground text-primary font-semibold hover:bg-transparent hover:text-primary-foreground transition-all duration-300"
            disabled={submitting}
          >
            {submitting
              ? "Please wait..."
              : mode === "signin"
              ? "Sign In"
              : "Request Access"}
          </Button>
        </form>

        <p className="text-center text-sm text-primary-foreground/70">
          {mode === "signin" ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="text-primary-foreground font-medium hover:underline cursor-pointer"
          >
            {mode === "signin" ? "Request access here" : "Sign in"}
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default Auth;
