"use client";

import { useActionState } from "react";
import { joinWaitlist, type FormState } from "@/app/actions";

const initial: FormState = { status: "idle", message: "" };

export default function WaitlistForm({
  product,
  label = "Work email",
  button = "Notify me",
  dark = false,
}: {
  product: "partner_platform" | "partner_portal";
  label?: string;
  button?: string;
  dark?: boolean;
}) {
  const [state, action, pending] = useActionState(joinWaitlist, initial);
  const id = `wl-${product}`;

  return (
    <form action={action} className="form" style={{ gap: 10 }} noValidate>
      <input type="hidden" name="product" value={product} />
      <label htmlFor={id} style={{ fontSize: 14, fontWeight: 600, color: dark ? "#fff" : "var(--navy)" }}>
        {label}
      </label>
      <div className="row" style={{ gap: 10 }}>
        <input
          id={id}
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="name@company.com"
          style={{
            flex: "1 1 220px",
            font: "inherit",
            fontSize: 15,
            padding: "12px 14px",
            borderRadius: 10,
            border: "1px solid #b9cdd6",
          }}
        />
        <button
          type="submit"
          className={dark ? "btn btn-sm" : "btn btn-sm btn-primary"}
          disabled={pending}
          style={dark ? { background: "var(--aqua)", borderColor: "var(--aqua)", color: "var(--teal-deep)" } : undefined}
        >
          {pending ? "Saving…" : button}
        </button>
      </div>
      <div className="hp" aria-hidden="true">
        <label htmlFor={`${id}-hp`}>Leave this field empty</label>
        <input id={`${id}-hp`} name="company_website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <div role="status" aria-live="polite">
        {state.status !== "idle" && (
          <p className={`form-status ${state.status === "ok" ? "ok" : "err"}`}>{state.message}</p>
        )}
      </div>
    </form>
  );
}
