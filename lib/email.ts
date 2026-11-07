import "server-only";

/*
 * Outgoing email through Resend (https://resend.com).
 * Settings live in Vercel → Project → Settings → Environment Variables:
 *   RESEND_API_KEY  – send-only key, restricted to mail.equibridgecapital.com
 *   NOTIFY_EMAIL    – where new-submission alerts go
 *   REPLY_TO_EMAIL  – Reply-To on broker confirmations
 * If the key is missing, emails are skipped and forms still work.
 * Borrower details are kept out of emails on purpose: alerts link to Supabase instead.
 */

const FROM = "EquiBridge Capital <scenarios@mail.equibridgecapital.com>";
const SUPABASE_TABLES = "https://supabase.com/dashboard/project/jkmbjarjcsbsgltzzfjs/editor";

export const esc = (v: unknown) =>
  String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export const usd = (n: unknown) => (typeof n === "number" ? "$" + n.toLocaleString("en-US") : "—");

async function send(msg: { to: string; subject: string; html: string; text: string; replyTo?: string }) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.warn("RESEND_API_KEY not set; email skipped:", msg.subject);
    return;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: FROM,
        to: [msg.to],
        subject: msg.subject,
        html: msg.html,
        text: msg.text,
        ...(msg.replyTo ? { reply_to: msg.replyTo } : {}),
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) console.error("Resend send failed", res.status, await res.text());
  } catch (err) {
    console.error("Resend send error", err instanceof Error ? err.message : err);
  }
}

function layout(title: string, bodyHtml: string, footerHtml = "") {
  return `<!doctype html><html><body style="margin:0;background:#f2f8fb;font-family:Arial,Helvetica,sans-serif;color:#2b2d42">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f2f8fb;padding:24px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border:1px solid #d5e3ea;border-radius:16px;overflow:hidden">
<tr><td style="background:#0f4c5c;padding:20px 28px;color:#ffffff;font-size:20px;font-weight:bold">Equi<span style="color:#5bc0be">Bridge</span> <span style="font-size:12px;letter-spacing:3px;color:#5bc0be">CAPITAL</span></td></tr>
<tr><td style="padding:28px">
<h1 style="margin:0 0 16px;font-size:22px;color:#0f4c5c">${title}</h1>
${bodyHtml}
</td></tr>
<tr><td style="padding:18px 28px;background:#f2f8fb;font-size:12px;line-height:1.6;color:#56657a">${footerHtml}</td></tr>
</table></td></tr></table></body></html>`;
}

function rows(pairs: [string, string][]) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;font-size:14px;border-collapse:collapse">${pairs
    .map(
      ([k, v]) =>
        `<tr><td style="padding:7px 0;border-bottom:1px solid #e4f1f4;color:#56657a;width:45%">${esc(k)}</td><td style="padding:7px 0;border-bottom:1px solid #e4f1f4;font-weight:bold">${esc(v)}</td></tr>`,
    )
    .join("")}</table>`;
}

const LEGAL =
  "EquiBridge Capital · Irvine, California · This is not a commitment to lend. All loans are subject to credit approval and underwriting.";

/** Internal alert: a new submission arrived. */
export async function sendInternalAlert(subject: string, summary: [string, string][]) {
  const to = process.env.NOTIFY_EMAIL;
  if (!to) return;
  const html = layout(
    esc(subject),
    `${rows(summary)}<p style="margin:20px 0 0"><a href="${SUPABASE_TABLES}" style="display:inline-block;background:#0f4c5c;color:#ffffff;text-decoration:none;padding:12px 18px;border-radius:10px;font-weight:bold">Open in Supabase</a></p>
<p style="font-size:12px;color:#56657a;margin-top:16px">Borrower details and notes are only in Supabase, not in this email.</p>`,
    "Internal notification from equibridgecapital.com",
  );
  const text = `${subject}\n\n${summary.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\nOpen in Supabase: ${SUPABASE_TABLES}`;
  await send({ to, subject, html, text });
}

/** Confirmation to the person who submitted a form. Contains no borrower data. */
export async function sendConfirmation(opts: {
  to: string;
  firstName: string;
  subject: string;
  heading: string;
  paragraphs: string[];
  cta?: { label: string; href: string };
}) {
  const html = layout(
    esc(opts.heading),
    `<p style="font-size:15px;line-height:1.6;margin:0 0 14px">Hi ${esc(opts.firstName)},</p>
${opts.paragraphs.map((p) => `<p style="font-size:15px;line-height:1.6;margin:0 0 14px">${esc(p)}</p>`).join("")}
${
  opts.cta
    ? `<p style="margin:20px 0"><a href="${esc(opts.cta.href)}" style="display:inline-block;background:#0f4c5c;color:#ffffff;text-decoration:none;padding:12px 18px;border-radius:10px;font-weight:bold">${esc(opts.cta.label)}</a></p>`
    : ""
}
<p style="font-size:15px;line-height:1.6;margin:0">Emil Yussuf<br>Founder, EquiBridge Capital</p>`,
    `Please don’t reply with Social Security numbers, dates of birth or account numbers. ${LEGAL}`,
  );
  const text = `Hi ${opts.firstName},\n\n${opts.paragraphs.join("\n\n")}${opts.cta ? `\n\n${opts.cta.label}: ${opts.cta.href}` : ""}\n\nEmil Yussuf\nFounder, EquiBridge Capital\n\n${LEGAL}`;
  await send({ to: opts.to, subject: opts.subject, html, text, replyTo: process.env.REPLY_TO_EMAIL || undefined });
}
