import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useCoachRole = () => {
  const { user } = useAuth();
  const [isCoach, setIsCoach] = useState(false);
  const [coachId, setCoachId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsCoach(false);
      setCoachId(null);
      setLoading(false);
      return;
    }

    const check = async () => {
      const { data, error } = await supabase.rpc("has_role", {
        _user_id: user.id,
        _role: "coach",
      });
      const hasRole = !error && !!data;
      setIsCoach(hasRole);

      if (hasRole) {
        const { data: coach } = await supabase
          .from("coaches")
          .select("id")
          .eq("user_id", user.id)
          .maybeSingle();
        setCoachId(coach?.id ?? null);
      }
      setLoading(false);
    };

    check();
  }, [user]);

  return { isCoach, coachId, loading };
};
