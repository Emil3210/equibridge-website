import type { Metadata } from "next";
import Link from "next/link";
import ProcessVideo from "@/components/ProcessVideo";
import { CONTACT } from "@/lib/site";

export const metadata: Metadata = {
  title: "The EquiBridge Process",
  description:
    "For mortgage brokers and lenders: how EquiBridge goes from the takeout lender’s conditional approval to funding, rapid rescore and refinance — and what we need from you.",
};

const STEPS = [
  { title: "Screen the file", text: "Credit, utilization, equity, income and the takeout lender’s minimum score. Confirm the bridge and its costs fit the refinance." },
  { title: "Simulate & underwrite the exit", text: "The takeout lender models the designated payoffs and clears every condition it can before the score." },
  { title: "Written confirmation", text: "The underwriter confirms that only the minimum middle score and the designated payoffs remain." },
  { title: "Controlled funding", text: "After our own underwriting, proceeds go through settlement directly to the designated creditors." },
  { title: "Rescore, refinance, payoff", text: "New balances report, the lender rescores, the refinance closes and pays off the bridge." },
];

const CHECKLIST = [
  { title: "Income", text: "Pay stubs, W-2s, tax returns or transcripts as required; self-employment documentation; qualifying income and DTI, including any payoffs needed for DTI." },
  { title: "Employment", text: "Written or electronic VOE as required, with no known employment issue. Routine pre-closing reverification may still occur." },
  { title: "Appraisal", text: "Appraisal or approved alternative; value, condition and eligibility accepted; LTV confirmed; repair conditions identified." },
  { title: "Title", text: "Liens, judgments and vesting reviewed; the EquiBridge second can record; the refinance can pay off and release it; material defects resolved." },
  { title: "HOA (when applicable)", text: "Certifications or questionnaire, project eligibility, dues, delinquency, litigation and insurance. Depends on the property and program." },
  { title: "Assets & reserves", text: "Funds to close and the permanent lender’s own reserve requirements verified." },
  { title: "Insurance & property", text: "Hazard insurance, flood insurance where required, occupancy and property type." },
  { title: "Program eligibility", text: "Program, pricing assumptions, loan amount, LTV, DTI after payoffs, score requirement, and room to absorb the EquiBridge payoff and costs." },
];

const FAQ = [
  {
    q: "Which files fit?",
    a: "Borrowers who qualify on income, equity and payment history, where high card utilization is the main thing holding the middle score below the takeout lender’s minimum.",
  },
  { q: "What do I send?", a: "The 1003 and 1008, the credit report, and the takeout lender’s conditional approval." },
  { q: "Does the borrower get any cash?", a: "No. Proceeds go through settlement directly to the designated creditors, and the payoff documentation is kept with the file." },
  {
    q: "What if the rescore falls short or the refinance doesn’t close?",
    a: "The bridge remains an obligation under its terms. That’s why we evaluate repayment capacity and maturity risk before we fund, not after.",
  },
  { q: "How long does it take?", a: "Rapid rescore is estimated at about one to two weeks after the creditors report the new balances. Actual timing varies." },
  { q: "How am I compensated?", a: "[Answer pending counsel review of RESPA and loan-officer compensation rules.]" },
];

const amberBox: React.CSSProperties = { background: "#fdf1dc", border: "2px solid #e8a33d", borderRadius: 16, padding: "20px 24px", color: "#6b4100" };

export default function ProcessPage() {
  return (
    <>
      <section className="section" style={{ paddingTop: 0 }}>
        <div style={{ background: "var(--surface)", borderBottom: "1px solid var(--line)" }}>
          <div className="container stack" style={{ gap: 18, paddingTop: 72, paddingBottom: 40 }}>
            <p className="eyebrow">For brokers &amp; lenders</p>
            <h1 className="h1-page">The EquiBridge Process: From Conditional Approval to Funding</h1>
            <p className="lead">
              We advance the bridge only after the permanent exit loan is substantially underwritten. Here is every step, and what we need from
              you.
            </p>
            <div className="row" style={{ gap: 12, marginTop: 6 }}>
              <Link href="/submit-scenario" className="btn btn-primary">
                Submit a Scenario
              </Link>
              <Link href="/how-it-works" className="btn btn-outline">
                Watch the overview
              </Link>
            </div>
          </div>
        </div>
        <div className="container stack" style={{ gap: 18, paddingTop: 56 }}>
          <div className="stack" style={{ gap: 8 }}>
            <p className="eyebrow">Watch · about 3½ minutes, with sound</p>
            <h2 className="h2">Establish the exit first, then advance the bridge</h2>
          </div>
          <ProcessVideo />
        </div>
      </section>

      <section className="section section-white">
        <div className="container stack" style={{ gap: 28 }}>
          <div className="stack" style={{ gap: 8 }}>
            <p className="eyebrow">At a glance</p>
            <h2 className="h2">Five steps, in order</h2>
          </div>
          <ol className="grid" style={{ listStyle: "none", margin: 0, padding: 0, gap: 20, gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
            {STEPS.map((s, i) => {
              const last = i === STEPS.length - 1;
              return (
                <li key={s.title} className={last ? "card-dark stack" : "card stack"} style={{ gap: 10, padding: 24 }}>
                  <span className="step-num" style={{ fontSize: 32 }}>
                    {i + 1}
                  </span>
                  <h3 style={{ fontSize: 18, fontWeight: 700 }}>{s.title}</h3>
                  <p style={{ fontSize: 15, color: last ? "var(--on-dark)" : "var(--body)" }}>{s.text}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <section className="section">
        <div className="container stack" style={{ gap: 28 }}>
          <div className="stack" style={{ gap: 8 }}>
            <p className="eyebrow">Before we fund</p>
            <h2 className="h2">What the takeout lender clears first</h2>
            <p className="lead">Everything that can be cleared before the score condition is reviewed and accepted before EquiBridge funds.</p>
          </div>
          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 18 }}>
            {CHECKLIST.map((c) => (
              <div key={c.title} className="card stack" style={{ gap: 8, padding: 24, borderTop: "5px solid #17714a" }}>
                <h3 className="h3">✓ {c.title}</h3>
                <p className="body" style={{ fontSize: 15 }}>
                  {c.text}
                </p>
              </div>
            ))}
          </div>
          <div style={amberBox}>
            <p style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 19 }}>The only conditions left open</p>
            <p style={{ marginTop: 4 }}>The minimum middle FICO score and verification of the designated payoffs, which the bridge and the rescore are built to clear.</p>
          </div>
        </div>
      </section>

      <section className="section section-white">
        <div className="container grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 28, alignItems: "start" }}>
          <div className="stack" style={{ gap: 14 }}>
            <p className="eyebrow">Our key safeguard</p>
            <h2 className="h2">Written underwriter confirmation</h2>
            <p className="body">
              We ask the takeout lender’s underwriter to confirm in writing what has been satisfied and what remains. We review the actual conditional
              approval and every outstanding condition, not a generic approval letter. If material conditions remain, we don’t fund.
            </p>
          </div>
          <figure className="card stack" style={{ gap: 12, margin: 0 }}>
            <span className="pill" style={{ alignSelf: "flex-start", background: "#fdf1dc", color: "#6b4100" }}>
              Illustrative wording · not a lender commitment
            </span>
            <blockquote style={{ margin: 0, color: "var(--navy)", fontSize: 16, lineHeight: 1.7 }}>
              <p>
                “Based on the documentation reviewed, the borrower satisfies the applicable income, asset, property valuation, title, and other
                material underwriting requirements for the proposed refinance, subject to the remaining conditions identified below.
              </p>
              <p style={{ marginTop: 10 }}>
                The remaining qualification conditions are the required minimum middle mortgage FICO score and completion and verification of the
                designated debt payoffs.
              </p>
              <p style={{ marginTop: 10 }}>
                Final approval remains subject to updated credit information, customary closing requirements, continued eligibility, and no material
                adverse changes.”
              </p>
            </blockquote>
          </figure>
        </div>
      </section>

      <section className="section">
        <div className="container grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24, alignItems: "stretch" }}>
          <div className="card-dark stack" style={{ gap: 12 }}>
            <h3 className="h3">How the bridge is structured</h3>
            <ul className="checklist">
              <li>Closed-end second mortgage</li>
              <li>Interest-only payments</li>
              <li>Term of 12 months or less, principal due as a balloon at maturity</li>
              <li>Proceeds restricted to approved creditor payoffs and authorized transaction costs</li>
            </ul>
          </div>
          <div className="card stack" style={{ gap: 12 }}>
            <h3 className="h3">If the exit doesn’t close</h3>
            <p className="body">
              Even a well-underwritten refinance can fail: a job or income change, new debt, a guideline change, a late title or property issue, or a
              score that falls short. The bridge remains an enforceable obligation under its terms, so EquiBridge evaluates repayment capacity, maturity
              risk and contingencies before it funds. There is no automatic extension or conversion.
            </p>
          </div>
        </div>
      </section>

      <section className="section section-white">
        <div className="container stack" style={{ gap: 20, maxWidth: 900 }}>
          <div className="stack" style={{ gap: 8 }}>
            <p className="eyebrow">Broker FAQ</p>
            <h2 className="h2">Common questions</h2>
          </div>
          {FAQ.map((f) => (
            <details key={f.q} className="faq">
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="section section-mint">
        <div className="container stack" style={{ gap: 16, alignItems: "flex-start" }}>
          <h2 className="h2">Send us two “almost” files.</h2>
          <p className="lead">Include the 1003 and 1008, the credit report, and the takeout lender’s conditional approval.</p>
          <Link href="/submit-scenario" className="btn btn-primary">
            Submit a Scenario
          </Link>
          <p className="small" style={{ marginTop: 12, maxWidth: 900 }}>
            Hypothetical examples and illustrations only. Not a commitment to lend. Score changes, conditional approvals and refinance closings are not
            guaranteed. All loans are subject to credit approval, underwriting and applicable law. The bridge loan is secured by the home. NMLS #{" "}
            {CONTACT.nmls} · Licensed in {CONTACT.states}.
          </p>
        </div>
      </section>
    </>
  );
}
