"use server";

import { supabaseServer } from "@/lib/supabase";
import type { FormState } from "@/app/actions";
import { REVIEW_TURNAROUND } from "@/lib/site";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const ROLES = ["broker", "lender", "homeowner", "investor", "other"];
const STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","DC","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN",
  "MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA",
  "WV","WI","WY",
];

const text = (fd: FormData, k: string, max: number) => String(fd.get(k) ?? "").trim().slice(0, max);
const oneOf = (fd: FormData, k: string, allowed: string[]) => {
  const v = text(fd, k, 40);
  return allowed.includes(v) ? v : null;
};
const int = (fd: FormData, k: string, min: number, max: number) => {
  const raw = String(fd.get(k) ?? "").replace(/[^0-9]/g, "");
  if (!raw) return null;
  const n = Number(raw);
  return Number.isFinite(n) && n >= min && n <= max ? n : null;
};
const yesNo = (fd: FormData, k: string) => {
  const v = text(fd, k, 5);
  return v === "yes" ? true : v === "no" ? false : null;
};

export async function submitScenario(_prev: FormState, fd: FormData): Promise<FormState> {
  if (text(fd, "company_website", 200)) return { status: "ok", message: "Thanks — your scenario was received." };

  const full_name = text(fd, "full_name", 120);
  const email = text(fd, "email", 254);
  const role = oneOf(fd, "role", ROLES);
  const path = oneOf(fd, "path", ["documents", "quick"]);
  const consent = fd.get("consent") === "on";

  if (!full_name || !EMAIL_RE.test(email) || !role || !path) {
    return { status: "error", message: "Please add your name, a valid email, who you are, and how you’d like to start." };
  }
  if (!consent) {
    return { status: "error", message: "Please confirm you have your client’s permission to share this information." };
  }

  const zipRaw = text(fd, "property_zip", 10);
  const property_zip = /^\d{5}$/.test(zipRaw) ? zipRaw : null;
  const stateRaw = text(fd, "property_state", 2).toUpperCase();
  const property_state = STATES.includes(stateRaw) ? stateRaw : null;
  if (zipRaw && !property_zip) return { status: "error", message: "Please enter a 5-digit ZIP code." };

  const row: Record<string, unknown> = {
    full_name,
    email,
    role,
    path,
    consent,
    phone: text(fd, "phone", 30) || null,
    company: text(fd, "company", 160) || null,
    client_ref: text(fd, "client_ref", 60) || null,
    property_city: text(fd, "property_city", 80) || null,
    property_state,
    property_zip,
    notes: text(fd, "notes", 2000) || null,
  };

  if (path === "quick") {
    const sim_run = yesNo(fd, "sim_run");
    const income_underwritten = yesNo(fd, "income_underwritten");
    Object.assign(row, {
      first_lien_amount: int(fd, "first_lien_amount", 0, 5_000_000),
      housing_type: oneOf(fd, "housing_type", ["sfr", "condo_townhome", "multi_unit", "other"]),
      occupancy: oneOf(fd, "occupancy", ["primary", "investment", "second_home", "other"]),
      payoff_amount: int(fd, "payoff_amount", 0, 1_000_000),
      middle_fico: int(fd, "middle_fico", 300, 850),
      sim_run,
      projected_fico: sim_run ? int(fd, "projected_fico", 300, 850) : null,
      payoff_for_projected: sim_run ? int(fd, "payoff_for_projected", 0, 1_000_000) : null,
      appraised_value: int(fd, "appraised_value", 0, 20_000_000),
      income_underwritten,
      ratios_work: income_underwritten ? oneOf(fd, "ratios_work", ["yes", "no", "unsure"]) : null,
      income_type: oneOf(fd, "income_type", ["w2", "self_employed", "bank_statement", "other"]),
    });

    const missing: string[] = [];
    if (!row.client_ref) missing.push("client last name or initials");
    if (!property_state || !property_zip) missing.push("property state and ZIP");
    if (row.housing_type === null) missing.push("housing type");
    if (row.occupancy === null) missing.push("occupancy");
    if (row.middle_fico === null) missing.push("current middle score (300–850)");
    if (sim_run === null) missing.push("whether a score simulation was run");
    if (sim_run && row.projected_fico === null) missing.push("projected middle score");
    if (row.appraised_value === null) missing.push("projected appraised value");
    if (income_underwritten === null) missing.push("whether income has been underwritten");
    if (missing.length) return { status: "error", message: `Please add: ${missing.join(", ")}.` };
  }

  const { error } = await supabaseServer().from("scenario_submissions").insert(row);
  if (error) {
    console.error("scenario insert failed", error.code);
    return { status: "error", message: "Something went wrong saving your scenario. Please email us directly." };
  }

  return path === "documents"
    ? { status: "ok", message: "Thanks — we’ll email you a secure upload link for the 1003/1008 within one business day." }
    : { status: "ok", message: `Thanks — your scenario was received. Expect a readiness review within ${REVIEW_TURNAROUND}.` };
}
