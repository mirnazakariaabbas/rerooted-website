import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { motion } from "framer-motion";
import logoWhite from "@/assets/logo-wordmark-white.png";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [ready, setReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for recovery token in URL hash
    const hash = window.location.hash;
    if (hash.includes("type=recovery")) {
      setReady(true);
    } else {
      // Also listen for auth state change with recovery event
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
        if (event === "PASSWORD_RECOVERY") {
          setReady(true);
        }
      });
      return () => subscription.unsubscribe();
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSubmitting(false);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password updated successfully!");
      navigate("/auth");
    }
  };

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full text-center space-y-6"
        >
          <img src={logoWhite} alt="Re-Rooted®" className="h-24 mx-auto object-contain" />
          <h1 className="text-2xl font-bold text-primary-foreground">Invalid or expired link</h1>
          <p className="text-primary-foreground/80">
            This password reset link is invalid or has expired. Please request a new one.
          </p>
          <Button
            variant="outline"
            onClick={() => navigate("/auth")}
            className="border-primary-foreground/60 text-primary-foreground hover:bg-primary-foreground hover:text-primary"
          >
            Back to Sign In
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
        className="max-w-md w-full -mt-16"
      >
        <div className="text-center">
          <button onClick={() => navigate("/")} className="cursor-pointer mx-auto block h-40 w-full max-w-lg overflow-hidden md:h-52">
            <img src={logoWhite} alt="Re-Rooted®" className="h-60 w-full object-center md:h-80 object-cover" />
          </button>
          <p className="-mt-4 text-lg font-light italic tracking-wide text-primary-foreground/80" style={{ fontWeight: 300 }}>
            The human side of relocation
          </p>
        </div>

        <div className="mt-10 text-center">
          <h1 className="text-2xl font-bold text-primary-foreground">Set new password</h1>
          <p className="mt-1 text-sm text-primary-foreground/70">
            Enter your new password below
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="password" className="text-primary-foreground/90">
              New Password
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

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-primary-foreground/90">
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="••••••••"
              minLength={6}
              className="border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/40 focus:border-primary-foreground/60"
            />
          </div>

          <Button
            type="submit"
            className="w-full rounded-lg border-2 border-primary-foreground bg-primary-foreground text-primary font-semibold hover:bg-transparent hover:text-primary-foreground transition-all duration-300"
            disabled={submitting}
          >
            {submitting ? "Please wait..." : "Update Password"}
          </Button>
        </form>

        <p className="text-center text-sm text-primary-foreground/70 mt-8">
          <button onClick={() => navigate("/auth")} className="text-primary-foreground font-medium hover:underline cursor-pointer">
            Back to sign in
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
