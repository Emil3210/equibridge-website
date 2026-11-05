"use client";

import { useActionState } from "react";
import { submitContact, type FormState } from "@/app/actions";

const initial: FormState = { status: "idle", message: "" };

export default function ContactForm() {
  const [state, action, pending] = useActionState(submitContact, initial);

  return (
    <form action={action} className="card form" style={{ flex: "1 1 520px", padding: 36 }} noValidate>
      <div className="row" style={{ gap: 16 }}>
        <div className="field">
          <label htmlFor="full_name">Full name</label>
          <input id="full_name" name="full_name" type="text" autoComplete="name" required maxLength={120} />
        </div>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" autoComplete="email" required maxLength={254} />
        </div>
      </div>
      <div className="field">
        <label htmlFor="role">I am a…</label>
        <select id="role" name="role" defaultValue="broker">
          <option value="broker">Mortgage broker or loan officer</option>
          <option value="lender">Lender or credit union</option>
          <option value="homeowner">Homeowner</option>
          <option value="investor">Investor</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="message">How can we help?</label>
        <textarea id="message" name="message" rows={5} required maxLength={4000} />
      </div>
      <div className="hp" aria-hidden="true">
        <label htmlFor="company_website">Leave this field empty</label>
        <input id="company_website" name="company_website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <p className="small">
        Please don’t include Social Security or account numbers here. Use the secure portal for documents once it opens.
      </p>
      <div role="status" aria-live="polite">
        {state.status !== "idle" && (
          <p className={`form-status ${state.status === "ok" ? "ok" : "err"}`}>{state.message}</p>
        )}
      </div>
      <button type="submit" className="btn btn-primary" style={{ alignSelf: "flex-start" }} disabled={pending}>
        {pending ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
