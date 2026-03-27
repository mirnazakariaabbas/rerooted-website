import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Verify the caller is an admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");
    
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await createClient(
      supabaseUrl,
      Deno.env.get("SUPABASE_ANON_KEY")!
    ).auth.getUser(token);
    
    if (authError || !user) throw new Error("Unauthorized");

    const { data: isAdmin } = await supabase.rpc("has_role", {
      _user_id: user.id,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Admin access required");

    const { coachName, coachEmail } = await req.json();
    if (!coachEmail || !coachName) throw new Error("Missing coachName or coachEmail");

    // Record invitation
    await supabase.from("invitations").insert({
      email: coachEmail,
      invited_by: user.id,
      status: "pending",
    });

    // Send invitation email using Lovable AI to generate content
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: "You are a professional email writer. Write a brief, warm invitation email body (HTML) inviting a coach to join a cultural coaching platform. Include their name. Keep it under 150 words. Only output the HTML body content, no subject line.",
          },
          {
            role: "user",
            content: `Write an invitation email for ${coachName} (${coachEmail}) to join our coaching platform. They should sign up at the platform to access their coach dashboard.`,
          },
        ],
      }),
    });

    let emailBody = `<p>Dear ${coachName},</p><p>You have been added as a coach on our platform. Please sign up to access your coach dashboard and manage your coachees.</p><p>Best regards,<br/>The Coaching Team</p>`;
    
    if (aiResponse.ok) {
      const aiData = await aiResponse.json();
      const content = aiData.choices?.[0]?.message?.content;
      if (content) emailBody = content;
    }

    // Use Supabase Auth admin to send the invite (magic link)
    const { error: inviteError } = await supabase.auth.admin.inviteUserByEmail(coachEmail, {
      data: { full_name: coachName, user_type: 'individual' },
    });

    if (inviteError) {
      console.error("Invite error:", inviteError);
      // Even if magic link fails, we've recorded the invitation
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("invite-coach error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
