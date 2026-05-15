// Shared helpers for coach session booking emails

export interface BookingEmailData {
  bookingId: string;
  memberName: string;
  memberEmail: string;
  coachName: string;
  coachEmail: string | null;
  meetingLink: string | null;
  scheduledAt: string; // ISO
  durationMinutes: number;
}

const pad = (n: number) => String(n).padStart(2, "0");

const toIcsDate = (d: Date) =>
  `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(
    d.getUTCHours()
  )}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;

const escapeIcs = (s: string) =>
  s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");

export function buildIcs(data: BookingEmailData): string {
  const start = new Date(data.scheduledAt);
  const end = new Date(start.getTime() + data.durationMinutes * 60 * 1000);
  const dtstamp = toIcsDate(new Date());
  const summary = escapeIcs(`Coaching Session with ${data.coachName}`);
  const description = escapeIcs(
    `Your Re-Rooted coaching session with ${data.coachName}.${
      data.meetingLink ? `\n\nJoin here: ${data.meetingLink}` : "\n\nYour coach will share the meeting link shortly."
    }`
  );
  const location = data.meetingLink ? escapeIcs(data.meetingLink) : "";

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Re-Rooted//Coaching Session//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${data.bookingId}@rerooted.ch`,
    `DTSTAMP:${dtstamp}`,
    `DTSTART:${toIcsDate(start)}`,
    `DTEND:${toIcsDate(end)}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description}`,
    location ? `LOCATION:${location}` : "",
    location ? `URL:${location}` : "",
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR",
  ]
    .filter(Boolean)
    .join("\r\n");
}

const fmtForGoogle = (d: Date) =>
  `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(
    d.getUTCHours()
  )}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;

export function googleCalendarLink(data: BookingEmailData): string {
  const start = new Date(data.scheduledAt);
  const end = new Date(start.getTime() + data.durationMinutes * 60 * 1000);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `Coaching Session with ${data.coachName}`,
    dates: `${fmtForGoogle(start)}/${fmtForGoogle(end)}`,
    details: data.meetingLink
      ? `Your Re-Rooted coaching session.\n\nJoin: ${data.meetingLink}`
      : "Your Re-Rooted coaching session. Your coach will share the meeting link shortly.",
    location: data.meetingLink ?? "",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function outlookCalendarLink(data: BookingEmailData): string {
  const start = new Date(data.scheduledAt);
  const end = new Date(start.getTime() + data.durationMinutes * 60 * 1000);
  const params = new URLSearchParams({
    path: "/calendar/action/compose",
    rru: "addevent",
    startdt: start.toISOString(),
    enddt: end.toISOString(),
    subject: `Coaching Session with ${data.coachName}`,
    body: data.meetingLink
      ? `Your Re-Rooted coaching session.\n\nJoin: ${data.meetingLink}`
      : "Your Re-Rooted coaching session. Your coach will share the meeting link shortly.",
    location: data.meetingLink ?? "",
  });
  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}

export function formatSessionTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("en-GB", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });
}

export function buildConfirmationHtml(
  data: BookingEmailData,
  icsUrl: string,
  googleUrl: string,
  outlookUrl: string
): string {
  const when = formatSessionTime(data.scheduledAt);
  const meetingBlock = data.meetingLink
    ? `<p style="margin:0 0 8px;font-size:14px;color:#1F299C;font-weight:700">Meeting link</p>
       <p style="margin:0 0 24px"><a href="${data.meetingLink}" style="color:#1F299C;word-break:break-all">${data.meetingLink}</a></p>`
    : `<p style="margin:0 0 24px;font-size:14px;color:#55575d;font-style:italic">Your coach will share the meeting link shortly.</p>`;

  return `<!doctype html><html><body style="background:#FAF9F6;margin:0;padding:0;font-family:Helvetica,Arial,sans-serif;color:#1a1a1a">
  <div style="max-width:560px;margin:0 auto;padding:32px 24px;background:#ffffff">
    <h1 style="font-size:22px;font-weight:900;margin:0 0 16px;color:#1F299C">Your session is booked</h1>
    <p style="font-size:14px;line-height:1.6;color:#55575d;margin:0 0 24px">
      Hi ${data.memberName || "there"}, your coaching session with <strong>${data.coachName}</strong> is confirmed.
    </p>
    <div style="background:#FAF9F6;padding:16px 20px;border-radius:8px;margin:0 0 24px">
      <p style="margin:0 0 4px;font-size:12px;color:#55575d;text-transform:uppercase;letter-spacing:0.05em">When</p>
      <p style="margin:0;font-size:15px;font-weight:700">${when}</p>
      <p style="margin:8px 0 0;font-size:13px;color:#55575d">${data.durationMinutes} minutes</p>
    </div>
    ${meetingBlock}
    <p style="margin:0 0 12px;font-size:14px;color:#1F299C;font-weight:700">Add to calendar</p>
    <table cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px">
      <tr>
        <td style="padding-right:8px"><a href="${googleUrl}" style="display:inline-block;background:#1F299C;color:#ffffff;text-decoration:none;padding:10px 16px;border-radius:8px;font-size:13px;font-weight:700">Google Calendar</a></td>
        <td style="padding-right:8px"><a href="${outlookUrl}" style="display:inline-block;background:#1F299C;color:#ffffff;text-decoration:none;padding:10px 16px;border-radius:8px;font-size:13px;font-weight:700">Outlook</a></td>
        <td><a href="${icsUrl}" style="display:inline-block;background:#3DA776;color:#ffffff;text-decoration:none;padding:10px 16px;border-radius:8px;font-size:13px;font-weight:700">Apple / .ics</a></td>
      </tr>
    </table>
    <p style="font-size:12px;color:#999;margin:32px 0 0;border-top:1px solid #eee;padding-top:16px">
      Need to reschedule? Reply to this email or contact us at hello@rerooted.ch.
    </p>
  </div>
</body></html>`;
}

export function buildReminderHtml(
  data: BookingEmailData,
  windowLabel: "in 24 hours" | "in 1 hour"
): string {
  const when = formatSessionTime(data.scheduledAt);
  const meetingBlock = data.meetingLink
    ? `<p style="margin:0 0 8px;font-size:14px;color:#1F299C;font-weight:700">Join your session</p>
       <p style="margin:0 0 24px"><a href="${data.meetingLink}" style="display:inline-block;background:#3DA776;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:8px;font-size:14px;font-weight:700">Open meeting link</a></p>
       <p style="margin:0 0 24px;font-size:12px;color:#55575d;word-break:break-all">${data.meetingLink}</p>`
    : `<p style="margin:0 0 24px;font-size:14px;color:#55575d;font-style:italic">Your coach has not shared a meeting link yet. Please reach out to them directly.</p>`;

  return `<!doctype html><html><body style="background:#FAF9F6;margin:0;padding:0;font-family:Helvetica,Arial,sans-serif;color:#1a1a1a">
  <div style="max-width:560px;margin:0 auto;padding:32px 24px;background:#ffffff">
    <h1 style="font-size:22px;font-weight:900;margin:0 0 16px;color:#1F299C">Reminder: your session ${windowLabel}</h1>
    <p style="font-size:14px;line-height:1.6;color:#55575d;margin:0 0 24px">
      Hi ${data.memberName || "there"}, this is a reminder of your coaching session with <strong>${data.coachName}</strong>.
    </p>
    <div style="background:#FAF9F6;padding:16px 20px;border-radius:8px;margin:0 0 24px">
      <p style="margin:0 0 4px;font-size:12px;color:#55575d;text-transform:uppercase;letter-spacing:0.05em">When</p>
      <p style="margin:0;font-size:15px;font-weight:700">${when}</p>
    </div>
    ${meetingBlock}
    <p style="font-size:12px;color:#999;margin:32px 0 0;border-top:1px solid #eee;padding-top:16px">
      Re-Rooted, hello@rerooted.ch
    </p>
  </div>
</body></html>`;
}

export function buildCoachNoticeHtml(data: BookingEmailData): string {
  const when = formatSessionTime(data.scheduledAt);
  return `<!doctype html><html><body style="background:#FAF9F6;margin:0;padding:0;font-family:Helvetica,Arial,sans-serif;color:#1a1a1a">
  <div style="max-width:560px;margin:0 auto;padding:32px 24px;background:#ffffff">
    <h1 style="font-size:22px;font-weight:900;margin:0 0 16px;color:#1F299C">New session booked</h1>
    <p style="font-size:14px;line-height:1.6;color:#55575d;margin:0 0 16px">
      Hi ${data.coachName}, <strong>${data.memberName || data.memberEmail}</strong> just booked a coaching session with you.
    </p>
    <div style="background:#FAF9F6;padding:16px 20px;border-radius:8px;margin:0 0 24px">
      <p style="margin:0 0 4px;font-size:12px;color:#55575d;text-transform:uppercase;letter-spacing:0.05em">When</p>
      <p style="margin:0;font-size:15px;font-weight:700">${when}</p>
      <p style="margin:8px 0 0;font-size:13px;color:#55575d">${data.durationMinutes} minutes</p>
    </div>
    ${
      data.meetingLink
        ? `<p style="margin:0;font-size:13px;color:#55575d">Your saved meeting link will be used.</p>`
        : `<p style="margin:0;font-size:13px;color:#c44;font-weight:700">⚠ You have not added a personal meeting link yet. Please add one in your coach profile so members receive it automatically.</p>`
    }
  </div>
</body></html>`;
}
