"use client";

import Link from "next/link";
import { startTransition, useActionState, useState } from "react";
import type { FormState } from "@/app/actions";
import { submitScenario } from "@/app/scenario-actions";
import { SECURE_UPLOAD_URL } from "@/lib/site";

const initial: FormState = { status: "idle", message: "" };

const STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","DC","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN",
  "MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA",
  "WV","WI","WY",
];

const money = (n: number | null) => (n === null ? "" : "$" + n.toLocaleString("en-US"));
const digits = (s: string) => {
  const d = s.replace(/[^0-9]/g, "");
  return d ? Number(d) : null;
};

type Opt = { value: string; label: string };

function Choices({
  name,
  legend,
  options,
  value,
  onChange,
  hint,
}: {
  name: string;
  legend: string;
  options: Opt[];
  value: string;
  onChange: (v: string) => void;
  hint?: string;
}) {
  return (
    <fieldset className="choices">
      <legend>{legend}</legend>
      {hint ? <p className="small" style={{ marginBottom: 8 }}>{hint}</p> : null}
      <div className="choice-row">
        {options.map((o) => (
          <label key={o.value} className="choice">
            <input type="radio" name={name} value={o.value} checked={value === o.value} onChange={() => onChange(o.value)} />
            <span>{o.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/** Slider plus an editable amount box. The hidden input carries the real value to the server. */
function MoneySlider({
  id,
  name,
  label,
  min,
  max,
  step,
  value,
  onChange,
  absMax,
  hint,
}: {
  id: string;
  name: string;
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (n: number) => void;
  absMax: number;
  hint?: string;
}) {
  return (
    <div className="field">
      <div className="slider-head">
        <label htmlFor={id}>{label}</label>
        <input
          className="slider-amount"
          type="text"
          inputMode="numeric"
          aria-label={`${label}, exact amount`}
          value={money(value)}
          onChange={(e) => onChange(Math.min(absMax, digits(e.target.value) ?? 0))}
        />
      </div>
      <input
        id={id}
        className="slider"
        type="range"
        min={min}
        max={max}
        step={step}
        value={Math.min(max, Math.max(min, value))}
        aria-valuetext={money(value)}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <div className="slider-scale small">
        <span>{money(min)}</span>
        <span>{hint ?? `${money(step)} steps`}</span>
        <span>{money(max)}+</span>
      </div>
      <input type="hidden" name={name} value={value} />
    </div>
  );
}

function Notice({ tone = "info", children }: { tone?: "info" | "warn"; children: React.ReactNode }) {
  return (
    <p className={`notice ${tone === "warn" ? "notice-warn" : ""}`} role="note">
      {children}
    </p>
  );
}

export default function ScenarioForm() {
  const [state, action, pending] = useActionState(submitScenario, initial);

  const [path, setPath] = useState("quick");
  const [firstLien, setFirstLien] = useState(400000);
  const [housing, setHousing] = useState("");
  const [occupancy, setOccupancy] = useState("");
  const [payoff, setPayoff] = useState(30000);
  const [simRun, setSimRun] = useState("");
  const [payoffForProjected, setPayoffForProjected] = useState(30000);
  const [value, setValue] = useState<number | null>(null);
  const [incomeUw, setIncomeUw] = useState("");
  const [ratios, setRatios] = useState("");
  const [incomeType, setIncomeType] = useState("");

  const cltv = value ? (firstLien + payoff) / value : null;

  if (state.status === "ok") {
    return (
      <div className="card stack" style={{ gap: 16, padding: 40 }} role="status">
        <h2 style={{ fontSize: 28, fontWeight: 800, color: "var(--teal-deep)" }}>Scenario received</h2>
        <p className="body" style={{ fontSize: 17 }}>{state.message}</p>
        {path === "documents" && SECURE_UPLOAD_URL ? (
          <div className="notice stack" style={{ gap: 10 }}>
            <span>
              Ready now? Upload the 1003/1008 through our secure, encrypted upload page. You won’t see anyone else’s files.
            </span>
            <a href={SECURE_UPLOAD_URL} className="btn btn-primary btn-sm" style={{ alignSelf: "flex-start" }} target="_blank" rel="noopener noreferrer">
              Upload Securely
            </a>
          </div>
        ) : null}
        <div className="row" style={{ gap: 12 }}>
          <Link href="/how-it-works" className="btn btn-outline btn-sm">
            Review how it works
          </Link>
          <a href="/submit-scenario" className="btn btn-primary btn-sm">
            Submit another scenario
          </a>
        </div>
      </div>
    );
  }

  return (
    <form
      className="card form"
      style={{ padding: 36, gap: 28 }}
      noValidate
      onSubmit={(e) => {
        // Submit without React's automatic form reset, so typed answers stay if something needs fixing.
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        startTransition(() => action(fd));
      }}
    >
      {/* 1. About you */}
      <section className="form-section" aria-labelledby="sec-you">
        <h2 id="sec-you" className="form-h">1. About you</h2>
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
        <div className="row" style={{ gap: 16 }}>
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
            <label htmlFor="phone">
              Phone <span className="optional">(optional)</span>
            </label>
            <input id="phone" name="phone" type="tel" autoComplete="tel" maxLength={30} />
          </div>
          <div className="field">
            <label htmlFor="company">
              Company <span className="optional">(optional)</span>
            </label>
            <input id="company" name="company" type="text" autoComplete="organization" maxLength={160} />
          </div>
        </div>
      </section>

      {/* 2. How to start */}
      <section className="form-section" aria-labelledby="sec-path">
        <h2 id="sec-path" className="form-h">2. How would you like to start?</h2>
        <div className="path-row">
          <label className="path-card">
            <input type="radio" name="path" value="documents" checked={path === "documents"} onChange={() => setPath("documents")} />
            <span className="path-title">I have a 1003/1008</span>
            <span className="small">We’ll email you a secure upload link. Don’t attach files here.</span>
          </label>
          <label className="path-card">
            <input type="radio" name="path" value="quick" checked={path === "quick"} onChange={() => setPath("quick")} />
            <span className="path-title">Quick scenario</span>
            <span className="small">Answer a few questions. About two minutes.</span>
          </label>
        </div>
      </section>

      {/* 3. Client & property */}
      <section className="form-section" aria-labelledby="sec-client">
        <h2 id="sec-client" className="form-h">3. Client &amp; property</h2>
        <div className="field">
          <label htmlFor="client_ref">Primary borrower: last name or initials</label>
          <input id="client_ref" name="client_ref" type="text" maxLength={60} placeholder="e.g., Smith or J.S." />
        </div>
        <div className="row" style={{ gap: 16 }}>
          <div className="field" style={{ flex: "2 1 220px" }}>
            <label htmlFor="property_city">Subject property city</label>
            <input id="property_city" name="property_city" type="text" maxLength={80} autoComplete="off" />
          </div>
          <div className="field" style={{ flex: "1 1 120px" }}>
            <label htmlFor="property_state">State</label>
            <select id="property_state" name="property_state" defaultValue="">
              <option value="" disabled>
                Select
              </option>
              {STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="field" style={{ flex: "1 1 120px" }}>
            <label htmlFor="property_zip">ZIP</label>
            <input id="property_zip" name="property_zip" type="text" inputMode="numeric" pattern="[0-9]{5}" maxLength={5} autoComplete="off" />
          </div>
        </div>
        <p className="small">
          Full borrower name and street address are collected later through the secure portal, with your client’s consent.
        </p>
      </section>

      {path === "quick" ? (
        <>
          {/* 4. Loan & property */}
          <section className="form-section" aria-labelledby="sec-loan">
            <h2 id="sec-loan" className="form-h">4. Current loan &amp; property</h2>
            <MoneySlider
              id="first_lien_slider"
              name="first_lien_amount"
              label="Current 1st loan amount"
              min={0}
              max={2000000}
              step={5000}
              absMax={5000000}
              value={firstLien}
              onChange={setFirstLien}
            />
            <Choices
              name="housing_type"
              legend="Housing type"
              value={housing}
              onChange={setHousing}
              options={[
                { value: "sfr", label: "SFR" },
                { value: "condo_townhome", label: "Condo / Townhome" },
                { value: "multi_unit", label: "Multi-unit" },
                { value: "other", label: "Other" },
              ]}
            />
            {housing === "condo_townhome" ? (
              <Notice tone="warn">
                <b>Condo or townhome:</b> an HOA certification (condo questionnaire) must be completed before the bridge can
                close.
              </Notice>
            ) : null}
            <Choices
              name="occupancy"
              legend="Occupancy"
              value={occupancy}
              onChange={setOccupancy}
              options={[
                { value: "primary", label: "Primary residence" },
                { value: "investment", label: "Non-owner / Investment" },
                { value: "second_home", label: "2nd home" },
                { value: "other", label: "Other" },
              ]}
            />
            <div className="field" style={{ maxWidth: 360 }}>
              <label htmlFor="appraised_value">Projected appraised value</label>
              <input
                id="appraised_value"
                type="text"
                inputMode="numeric"
                placeholder="$"
                value={money(value)}
                onChange={(e) => setValue(digits(e.target.value))}
              />
              <input type="hidden" name="appraised_value" value={value ?? ""} />
            </div>
          </section>

          {/* 5. Credit */}
          <section className="form-section" aria-labelledby="sec-credit">
            <h2 id="sec-credit" className="form-h">5. Credit &amp; payoff</h2>
            <MoneySlider
              id="payoff_slider"
              name="payoff_amount"
              label="Approximate debt to be paid off"
              min={5000}
              max={150000}
              step={1000}
              absMax={1000000}
              value={payoff}
              onChange={setPayoff}
            />
            <div className="field" style={{ maxWidth: 260 }}>
              <label htmlFor="middle_fico">Current middle credit score</label>
              <input id="middle_fico" name="middle_fico" type="number" inputMode="numeric" min={300} max={850} placeholder="e.g., 592" />
            </div>
            <Choices
              name="sim_run"
              legend="Has a score simulation been run yet?"
              value={simRun}
              onChange={setSimRun}
              options={[
                { value: "yes", label: "Yes" },
                { value: "no", label: "No" },
              ]}
            />
            {simRun === "yes" ? (
              <div className="subfields">
                <div className="field" style={{ maxWidth: 360 }}>
                  <label htmlFor="projected_fico">Projected middle score after payoff &amp; rapid rescore</label>
                  <input id="projected_fico" name="projected_fico" type="number" inputMode="numeric" min={300} max={850} placeholder="e.g., 648" />
                </div>
                <MoneySlider
                  id="payoff_projected_slider"
                  name="payoff_for_projected"
                  label="Debt that must be paid off to reach that score"
                  min={0}
                  max={150000}
                  step={1000}
                  absMax={1000000}
                  value={payoffForProjected}
                  onChange={setPayoffForProjected}
                />
                <p className="small">Simulated scores are estimates, not guaranteed results.</p>
              </div>
            ) : null}
            {simRun === "no" ? (
              <Notice>
                No problem. We can help identify which balances to pay down. A score simulation from the takeout lender is
                required before a bridge can fund.
              </Notice>
            ) : null}
          </section>

          {/* 6. Income */}
          <section className="form-section" aria-labelledby="sec-income">
            <h2 id="sec-income" className="form-h">6. Income</h2>
            <Choices
              name="income_underwritten"
              legend="Has income been underwritten and VOEs completed?"
              value={incomeUw}
              onChange={setIncomeUw}
              options={[
                { value: "yes", label: "Yes" },
                { value: "no", label: "No" },
              ]}
            />
            {incomeUw === "no" ? <Notice tone="warn">Income and VOEs must be validated before a bridge can fund.</Notice> : null}
            {incomeUw === "yes" ? (
              <div className="subfields">
                <Choices
                  name="ratios_work"
                  legend="Will income ratios work with the selected debt paid off?"
                  hint="Include the new bridge payment in the ratios."
                  value={ratios}
                  onChange={setRatios}
                  options={[
                    { value: "yes", label: "Yes" },
                    { value: "no", label: "No" },
                    { value: "unsure", label: "Not sure" },
                  ]}
                />
                {ratios === "no" ? (
                  <Notice tone="warn">
                    Ratios must work with the bridge payment included. Add details in the notes and we’ll look for options.
                  </Notice>
                ) : null}
              </div>
            ) : null}
            <Choices
              name="income_type"
              legend="Income type"
              value={incomeType}
              onChange={setIncomeType}
              options={[
                { value: "w2", label: "W-2" },
                { value: "self_employed", label: "Self-employed" },
                { value: "bank_statement", label: "Bank statement (non-QM)" },
                { value: "other", label: "Other" },
              ]}
            />
          </section>

          {cltv !== null ? (
            <div className="cltv" aria-live="polite">
              <span>Estimated combined LTV after the bridge</span>
              <b>{(cltv * 100).toFixed(1)}%</b>
              <span className="small">
                ({money(firstLien)} + {money(payoff)}) ÷ {money(value)}. For discussion only.
              </span>
            </div>
          ) : null}
        </>
      ) : null}

      {/* Notes & consent */}
      <section className="form-section" aria-labelledby="sec-notes">
        <h2 id="sec-notes" className="form-h">{path === "quick" ? "7." : "4."} Anything else?</h2>
        <div className="field">
          <label htmlFor="notes">
            Notes <span className="optional">(optional)</span>
          </label>
          <textarea id="notes" name="notes" rows={4} maxLength={2000} placeholder="Purchase or refinance, timeline, loan program, anything unusual…" />
        </div>
        <label className="consent">
          <input type="checkbox" name="consent" required />
          <span>I have my client’s permission to share this information with EquiBridge Capital for a scenario review.</span>
        </label>
        <p className="small">
          Please don’t enter Social Security numbers, dates of birth or account numbers. Submitting a scenario is not a loan
          application or a commitment to lend.
        </p>
      </section>

      <div className="hp" aria-hidden="true">
        <label htmlFor="company_website">Leave this field empty</label>
        <input id="company_website" name="company_website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <div role="status" aria-live="polite">
        {state.status === "error" ? <p className="form-status err">{state.message}</p> : null}
      </div>
      <button type="submit" className="btn btn-primary" style={{ alignSelf: "flex-start" }} disabled={pending}>
        {pending ? "Submitting…" : path === "documents" ? "Request Secure Upload" : "Submit Scenario"}
      </button>
    </form>
  );
}
