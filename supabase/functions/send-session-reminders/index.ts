import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { buildReminderHtml, type BookingEmailData } from "../_shared/booking-utils.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const FROM_ADDRESS = Deno.env.get("BOOKING_EMAIL_FROM") ?? "Re-Rooted <onboarding@resend.dev>";

async function sendEmail(opts: { to: string; subject: string; html: string }) {
  const resendKey = Deno.env.get("RESEND_API_KEY");
  if (!resendKey) {
    console.warn("[send-session-reminders] RESEND_API_KEY not configured");
    return false;
  }
  const resp = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: FROM_ADDRESS, to: [opts.to], subject: opts.subject, html: opts.html }),
  });
  if (!resp.ok) {
    console.error("[send-session-reminders] Resend error", resp.status, await resp.text());
    return false;
  }
  return true;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    const now = new Date();
    const in24hStart = new Date(now.getTime() + (24 * 60 - 5) * 60_000);
    const in24hEnd = new Date(now.getTime() + (24 * 60 + 5) * 60_000);
    const in1hStart = new Date(now.getTime() + (60 - 5) * 60_000);
    const in1hEnd = new Date(now.getTime() + (60 + 5) * 60_000);

    type Window = { label: "in 24 hours" | "in 1 hour"; col: "reminder_24h_sent_at"; from: Date; to: Date };
    const windows: Window[] = [
      { label: "in 24 hours", col: "reminder_24h_sent_at", from: in24hStart, to: in24hEnd },
      { label: "in 1 hour", col: "reminder_1h_sent_at" as any, from: in1hStart, to: in1hEnd },
    ];

    const results: any[] = [];

    for (const w of windows) {
      const { data: bookings } = await supabase
        .from("meeting_bookings")
        .select("id, user_id, coach_id, scheduled_at, duration_minutes, status, reminder_24h_sent_at, reminder_1h_sent_at")
        .eq("status", "scheduled")
        .gte("scheduled_at", w.from.toISOString())
        .lte("scheduled_at", w.to.toISOString())
        .is(w.col as any, null);

      if (!bookings?.length) continue;

      for (const b of bookings) {
        const [{ data: profile }, { data: coach }, { data: authUser }] = await Promise.all([
          supabase.from("profiles").select("full_name").eq("id", b.user_id).single(),
          supabase.from("coaches").select("name, email, meeting_link").eq("id", b.coach_id).single(),
          supabase.auth.admin.getUserById(b.user_id),
        ]);

        const memberEmail = authUser.user?.email;
        if (!memberEmail) continue;

        const data: BookingEmailData = {
          bookingId: b.id,
          memberName: profile?.full_name ?? "",
          memberEmail,
          coachName: coach?.name ?? "your coach",
          coachEmail: coach?.email ?? null,
          meetingLink: (coach as any)?.meeting_link ?? null,
          scheduledAt: b.scheduled_at,
          durationMinutes: b.duration_minutes,
        };

        const sent = await sendEmail({
          to: memberEmail,
          subject: `Reminder: your coaching session ${w.label}`,
          html: buildReminderHtml(data, w.label),
        });

        if (sent) {
          await supabase
            .from("meeting_bookings")
            .update({ [w.col]: new Date().toISOString() } as any)
            .eq("id", b.id);
        }
        results.push({ bookingId: b.id, window: w.label, sent });
      }
    }

    return new Response(JSON.stringify({ success: true, processed: results.length, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("send-session-reminders error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
