"use client";

import Link from "next/link";
import { useState } from "react";
import { REVIEW_TURNAROUND } from "@/lib/site";

type View = "brokers" | "homeowners";
type Step = { title: string; text: string };

const BROKER_STEPS: Step[] = [
  { title: "Submit a scenario", text: "Share a credit summary, value estimate and income through the partner portal." },
  { title: "Get a readiness report", text: `Payoff plan, projected DTI and CLTV, and the best exit path in ${REVIEW_TURNAROUND}.` },
  { title: "Underwrite both loans", text: "Bridge and exit loan documented together, so the exit can close fast." },
  { title: "Close & pay off", text: "Funds go straight to the card issuers on day one." },
  { title: "Rescore & exit", text: "You close the exit loan, if you offer it, in about six weeks." },
];

const HOME_STEPS: Step[] = [
  { title: "Talk to your loan officer", text: "They review whether card balances are what’s holding your score down." },
  { title: "Share your documents", text: "Income, mortgage and card statements, uploaded securely." },
  { title: "Your cards are paid off", text: "We pay the card companies directly. You make one monthly payment." },
  { title: "Your credit updates", text: "The $0 balances report to the credit bureaus over the next few weeks." },
  { title: "Move to your new loan", text: "If it’s better for you, your pre-approved loan replaces the bridge." },
];

function Steps({ steps }: { steps: Step[] }) {
  return (
    <ol className="grid" style={{ listStyle: "none", margin: 0, padding: 0, gap: 20, gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))" }}>
      {steps.map((s, i) => {
        const last = i === steps.length - 1;
        return (
          <li key={s.title} className={last ? "card-dark stack" : "card stack"} style={{ gap: 10, padding: 26 }}>
            <span className="step-num" style={{ fontSize: 32 }}>{i + 1}</span>
            <h3 style={{ fontSize: 18, fontWeight: 700 }}>{s.title}</h3>
            <p style={{ fontSize: 15, color: last ? "var(--on-dark)" : "var(--body)" }}>{s.text}</p>
          </li>
        );
      })}
    </ol>
  );
}

export default function AudienceTabs({ initial }: { initial: View }) {
  const [view, setView] = useState<View>(initial);
  const tabs: { id: View; label: string }[] = [
    { id: "brokers", label: "Brokers & lenders" },
    { id: "homeowners", label: "Homeowners" },
  ];

  return (
    <>
      <div role="tablist" aria-label="Choose your view" className="tablist" style={{ alignSelf: "flex-start", marginTop: 12 }}>
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            id={`tab-${t.id}`}
            aria-controls={`panel-${t.id}`}
            aria-selected={view === t.id}
            className="tab"
            onClick={() => setView(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="card" style={{ marginTop: 40, padding: "28px 32px" }}>
        <div className="grid" style={{ gap: 20, gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
          {[
            ["WEEK 0", "Scenario & pre-approval", "var(--teal-deep)"],
            ["DAY 1 OF BRIDGE", "Close & pay off cards", "var(--teal)"],
            ["WEEKS 1–3", "Balances report, rescore", "var(--aqua)"],
            ["ABOUT WEEK 6", "Exit loan closes", "#9adbc9"],
          ].map(([when, what, color]) => (
            <div key={when} className="stack" style={{ gap: 6, borderTop: `4px solid ${color}`, paddingTop: 14 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: "var(--teal)" }}>{when}</p>
              <p style={{ fontFamily: "var(--font-heading)", fontSize: 17, fontWeight: 700 }}>{what}</p>
            </div>
          ))}
        </div>
      </div>

      {view === "brokers" ? (
        <div role="tabpanel" id="panel-brokers" aria-labelledby="tab-brokers" className="stack" style={{ gap: 40, paddingTop: 56 }}>
          <h2 style={{ fontSize: 36, fontWeight: 800 }}>For brokers &amp; lenders: five steps</h2>
          <Steps steps={BROKER_STEPS} />
          <div className="row" style={{ gap: 24 }}>
            <div className="card stack" style={{ flex: "1 1 460px", gap: 14 }}>
              <h3 style={{ fontSize: 21, fontWeight: 700, color: "var(--teal-deep)" }}>What to upload</h3>
              <ul className="checklist" style={{ fontSize: 15 }}>
                <li>Credit report or score summary, with borrower consent</li>
                <li>Current mortgage statement</li>
                <li>Credit card statements for balances to pay off</li>
                <li>Income: 30 days of pay stubs, 2 years of W-2s or returns</li>
                <li>Homeowners insurance declarations page</li>
                <li>Value estimate (AVM or recent appraisal)</li>
              </ul>
            </div>
            <div className="stack section-mint" style={{ flex: "1 1 460px", gap: 14, borderRadius: 20, padding: 32 }}>
              <h3 style={{ fontSize: 21, fontWeight: 700, color: "var(--teal-deep)" }}>What you gain</h3>
              <ul className="checklist" style={{ fontSize: 15 }}>
                <li>A plan today instead of “come back in a year”</li>
                <li>You stay the client’s lender of record</li>
                <li>Status updates at [2] and [6] weeks, with borrower consent</li>
                <li>Compensation within federal LO comp rules</li>
              </ul>
              <Link href="/portal" className="btn btn-primary" style={{ alignSelf: "flex-start" }}>
                Submit a Scenario
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div role="tabpanel" id="panel-homeowners" aria-labelledby="tab-homeowners" className="stack" style={{ gap: 40, paddingTop: 56 }}>
          <h2 style={{ fontSize: 36, fontWeight: 800 }}>For homeowners: what to expect</h2>
          <Steps steps={HOME_STEPS} />
          <div className="row" style={{ gap: 24 }}>
            <div className="card stack" style={{ flex: "1 1 460px", gap: 14 }}>
              <h3 style={{ fontSize: 21, fontWeight: 700, color: "var(--teal-deep)" }}>Know before you borrow</h3>
              <ul className="checklist" style={{ fontSize: 15 }}>
                <li>This loan is secured by your home</li>
                <li>Your rate, fees and APR appear on your Loan Estimate</li>
                <li>No lender can promise a specific credit score</li>
                <li>If you don’t move to a new loan, you can keep this one</li>
              </ul>
            </div>
            <div className="stack section-mint" style={{ flex: "1 1 460px", gap: 14, borderRadius: 20, padding: 32 }}>
              <h3 style={{ fontSize: 21, fontWeight: 700, color: "var(--teal-deep)" }}>Could this fit you?</h3>
              <p style={{ fontSize: 15, lineHeight: 1.7 }}>
                You own your home with good equity, pay on time, and your cards are near their limits. Ask your loan
                officer about EquiBridge, or contact us to find a partner near you.
              </p>
              <Link href="/about#contact" className="btn btn-primary" style={{ alignSelf: "flex-start" }}>
                Find a Loan Officer
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
