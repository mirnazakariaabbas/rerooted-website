import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  buildIcs,
  buildConfirmationHtml,
  buildCoachNoticeHtml,
  googleCalendarLink,
  outlookCalendarLink,
  type BookingEmailData,
} from "../_shared/booking-utils.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const FROM_ADDRESS = Deno.env.get("BOOKING_EMAIL_FROM") ?? "Re-Rooted <onboarding@resend.dev>";

async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
}): Promise<{ ok: boolean; reason?: string }> {
  const resendKey = Deno.env.get("RESEND_API_KEY");
  if (!resendKey) {
    console.warn("[send-booking-confirmation] RESEND_API_KEY not configured, skipping email send");
    return { ok: false, reason: "no_email_provider" };
  }
  try {
    const resp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_ADDRESS,
        to: [opts.to],
        subject: opts.subject,
        html: opts.html,
      }),
    });
    if (!resp.ok) {
      const text = await resp.text();
      console.error("[send-booking-confirmation] Resend error", resp.status, text);
      return { ok: false, reason: text };
    }
    return { ok: true };
  } catch (e) {
    console.error("[send-booking-confirmation] send error", e);
    return { ok: false, reason: String(e) };
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    const { bookingId } = await req.json();
    if (!bookingId || typeof bookingId !== "string") {
      return new Response(JSON.stringify({ error: "bookingId required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: booking, error: bErr } = await supabase
      .from("meeting_bookings")
      .select("id, user_id, coach_id, scheduled_at, duration_minutes, status")
      .eq("id", bookingId)
      .single();
    if (bErr || !booking) throw new Error(bErr?.message ?? "Booking not found");

    const [{ data: profile }, { data: coach }, { data: authUser }] = await Promise.all([
      supabase.from("profiles").select("full_name").eq("id", booking.user_id).single(),
      supabase
        .from("coaches")
        .select("name, email, meeting_link")
        .eq("id", booking.coach_id)
        .single(),
      supabase.auth.admin.getUserById(booking.user_id),
    ]);

    const memberEmail = authUser.user?.email;
    if (!memberEmail) throw new Error("Member email not found");

    const data: BookingEmailData = {
      bookingId: booking.id,
      memberName: profile?.full_name ?? "",
      memberEmail,
      coachName: coach?.name ?? "your coach",
      coachEmail: coach?.email ?? null,
      meetingLink: (coach as any)?.meeting_link ?? null,
      scheduledAt: booking.scheduled_at,
      durationMinutes: booking.duration_minutes,
    };

    // Generate and upload .ics
    const ics = buildIcs(data);
    const icsPath = `${booking.id}.ics`;
    const { error: upErr } = await supabase.storage
      .from("calendar-invites")
      .upload(icsPath, new Blob([ics], { type: "text/calendar" }), {
        upsert: true,
        contentType: "text/calendar",
      });
    if (upErr) console.error("[send-booking-confirmation] .ics upload failed", upErr);

    const { data: pub } = supabase.storage.from("calendar-invites").getPublicUrl(icsPath);
    const icsUrl = pub.publicUrl;
    const googleUrl = googleCalendarLink(data);
    const outlookUrl = outlookCalendarLink(data);

    const memberHtml = buildConfirmationHtml(data, icsUrl, googleUrl, outlookUrl);
    const memberResult = await sendEmail({
      to: memberEmail,
      subject: `Your coaching session with ${data.coachName} is confirmed`,
      html: memberHtml,
    });

    let coachResult: { ok: boolean; reason?: string } = { ok: true };
    if (data.coachEmail) {
      coachResult = await sendEmail({
        to: data.coachEmail,
        subject: `New session booked by ${data.memberName || data.memberEmail}`,
        html: buildCoachNoticeHtml(data),
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        icsUrl,
        memberEmailSent: memberResult.ok,
        coachEmailSent: coachResult.ok,
        emailProviderConfigured: memberResult.reason !== "no_email_provider",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("send-booking-confirmation error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
