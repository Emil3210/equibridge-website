"use server";

import { after } from "next/server";
import { supabaseServer } from "@/lib/supabase";
import { sendConfirmation, sendInternalAlert } from "@/lib/email";

export type FormState = { status: "idle" | "ok" | "error"; message: string };

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const ROLES = ["broker", "lender", "homeowner", "investor", "other"] as const;

function clean(value: FormDataEntryValue | null, max: number) {
  return String(value ?? "").trim().slice(0, max);
}

export async function submitContact(_prev: FormState, formData: FormData): Promise<FormState> {
  // Honeypot: real people never fill this hidden field; bots usually do.
  if (clean(formData.get("company_website"), 200)) {
    return { status: "ok", message: "Thanks — we’ll be in touch shortly." };
  }

  const full_name = clean(formData.get("full_name"), 120);
  const email = clean(formData.get("email"), 254);
  const role = clean(formData.get("role"), 20);
  const message = clean(formData.get("message"), 4000);

  if (!full_name || !EMAIL_RE.test(email) || !message) {
    return { status: "error", message: "Please add your name, a valid email and a short message." };
  }
  if (!ROLES.includes(role as (typeof ROLES)[number])) {
    return { status: "error", message: "Please choose who you are from the list." };
  }

  const { error } = await supabaseServer()
    .from("contact_messages")
    .insert({ full_name, email, role, message, source_page: "about" });

  if (error) {
    console.error("contact insert failed", error.code);
    return { status: "error", message: "Something went wrong. Please email us directly." };
  }
  after(async () => {
    await Promise.all([
      sendInternalAlert(`New contact message from ${full_name}`, [
        ["From", `${full_name} (${role})`],
        ["Email", email],
        ["Message", message.length > 300 ? message.slice(0, 300) + "…" : message],
      ]),
      sendConfirmation({
        to: email,
        firstName: full_name.split(" ")[0],
        subject: "Thanks for contacting EquiBridge Capital",
        heading: "We got your message",
        paragraphs: ["Thanks for reaching out to EquiBridge Capital. We’ll get back to you within one business day."],
        cta: { label: "Submit a scenario", href: "https://equibridgecapital.com/submit-scenario" },
      }),
    ]);
  });
  return { status: "ok", message: "Thanks — we’ll be in touch within one business day." };
}

export async function joinWaitlist(_prev: FormState, formData: FormData): Promise<FormState> {
  if (clean(formData.get("company_website"), 200)) {
    return { status: "ok", message: "You’re on the list." };
  }

  const email = clean(formData.get("email"), 254);
  const product = clean(formData.get("product"), 40) === "partner_portal" ? "partner_portal" : "partner_platform";

  if (!EMAIL_RE.test(email)) {
    return { status: "error", message: "Please enter a valid email address." };
  }

  const { error } = await supabaseServer().from("waitlist_signups").insert({ email, product });

  // 23505 = already signed up; treat as success so we don't reveal who is on the list.
  if (error && error.code !== "23505") {
    console.error("waitlist insert failed", error.code);
    return { status: "error", message: "Something went wrong. Please try again." };
  }
  return { status: "ok", message: "You’re on the list. We’ll email you when it opens." };
}
