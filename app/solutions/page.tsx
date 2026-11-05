import type { Metadata } from "next";
import Link from "next/link";
import WaitlistForm from "@/components/WaitlistForm";

export const metadata: Metadata = {
  title: "Solutions",
  description:
    "The Combination Bridge Loan, Scenario Review for brokers, and the Partner Platform for credit unions and servicers.",
};

const GLANCE: [string, string][] = [
  ["Lien", "Closed-end second"],
  ["Use of funds", "Revolving debt payoff"],
  ["Typical time to exit", "About 6 weeks"],
  ["Term", "[15-year amortizing]"],
  ["Max combined LTV", "[75%]"],
  ["Property", "1-unit, owner-occupied"],
  ["Rate & fees", "[Shown with APR after compliance review]"],
];

const REPORT = [
  { title: "Payoff plan", text: "Which balances to pay, and the new monthly payment." },
  { title: "Projected DTI & CLTV", text: "Before and after the bridge, and on the exit loan." },
  { title: "Score sensitivity", text: "An estimated range after payoff, clearly labeled as an estimate." },
  { title: "Best exit path", text: "Refinance the second, a new first, or keep the bridge." },
];

const FAQ = [
  {
    q: "Will this raise my credit score?",
    a: "Paying down card balances often helps, but no lender can promise a specific score. We share an estimated range, clearly labeled.",
  },
  {
    q: "What happens if the exit loan doesn’t close?",
    a: "The bridge is a fully amortizing loan underwritten to be affordable on its own, so the borrower can simply keep it.",
  },
  { q: "Is this a cash-out loan?", a: "No. Loan proceeds go directly to the creditors being paid off." },
  {
    q: "How are brokers compensated?",
    a: "Within federal loan originator compensation rules. [Partner terms available on request.]",
  },
];

export default function SolutionsPage() {
  return (
    <>
      <section className="section-white" style={{ borderTop: "none" }}>
        <div className="container stack" style={{ gap: 18, paddingTop: 72, paddingBottom: 72 }}>
          <p className="eyebrow">Solutions</p>
          <h1 className="h1-page">Three ways we help homeowners reach a better loan</h1>
          <p className="lead">
            A bridge loan for the borrower, a readiness report for the broker, and a screening platform for institutions
            that already hold the relationship.
          </p>
          <nav aria-label="On this page" className="row" style={{ gap: 12, paddingTop: 10 }}>
            {[
              ["#bridge", "Combination Bridge Loan"],
              ["#review", "Scenario Review"],
              ["#platform", "Partner Platform"],
              ["#faq", "FAQ"],
            ].map(([href, label]) => (
              <a
                key={href}
                href={href}
                style={{
                  padding: "10px 16px",
                  borderRadius: 999,
                  background: "var(--tint)",
                  fontSize: 15,
                  fontWeight: 600,
                  color: "var(--teal-deep)",
                  textDecoration: "none",
                }}
              >
                {label}
              </a>
            ))}
          </nav>
        </div>
      </section>

      <section id="bridge" className="section">
        <div className="container row" style={{ gap: 48, alignItems: "flex-start" }}>
          <div className="stack" style={{ flex: "1 1 520px", gap: 18 }}>
            <p className="eyebrow" style={{ fontSize: 13 }}>01 · For homeowners, through brokers</p>
            <h2 style={{ fontSize: 36, fontWeight: 800 }}>Combination Bridge Loan</h2>
            <p className="body" style={{ fontSize: 17 }}>
              A closed-end second mortgage that pays off high-utilization credit cards directly. Once the card balances
              report, the borrower moves to a pre-approved exit loan, such as a lower-rate second, when it truly improves
              their position.
            </p>
            <ul className="checklist">
              <li>Funds paid straight to card issuers; no cash to the borrower</li>
              <li>Exit loan conditionally approved before the bridge closes</li>
              <li>Fully amortizing, so it stays affordable if no exit happens</li>
              <li>Full income documentation and ability-to-repay review</li>
            </ul>
          </div>
          <div className="card stack" style={{ flex: "1 1 380px", gap: 16, boxShadow: "0 12px 32px rgba(15,76,92,0.10)" }}>
            <h3 className="h3" style={{ color: "var(--teal-deep)" }}>
              At a glance
            </h3>
            <table className="glance">
              <tbody>
                {GLANCE.map(([k, v]) => (
                  <tr key={k}>
                    <td style={{ color: "var(--muted)" }}>{k}</td>
                    <td>{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Link href="/portal" className="btn btn-primary" style={{ alignSelf: "flex-start" }}>
              Submit a Scenario
            </Link>
          </div>
        </div>
      </section>

      <section id="review" className="section section-white">
        <div className="container row" style={{ gap: 48, alignItems: "flex-start" }}>
          <div className="stack" style={{ flex: "1 1 440px", gap: 18 }}>
            <p className="eyebrow" style={{ fontSize: 13 }}>02 · For brokers &amp; lenders</p>
            <h2 style={{ fontSize: 36, fontWeight: 800 }}>Scenario Review &amp; Readiness Report</h2>
            <p className="body" style={{ fontSize: 17 }}>
              Send a client file and get a clear answer on whether a bridge fits, before anyone pulls a new credit report.
            </p>
            <Link href="/portal" className="link-arrow">
              Start a scenario review →
            </Link>
          </div>
          <div className="grid" style={{ flex: "1 1 560px", gap: 20, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
            {REPORT.map((r) => (
              <div key={r.title} className="card-tint stack" style={{ gap: 8, padding: 24 }}>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: "var(--teal-deep)" }}>{r.title}</h3>
                <p className="body" style={{ fontSize: 15 }}>
                  {r.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="platform" className="section">
        <div className="container row" style={{ gap: 48, alignItems: "center" }}>
          <div className="stack" style={{ flex: "1 1 520px", gap: 18 }}>
            <div className="row" style={{ gap: 12, alignItems: "center" }}>
              <p className="eyebrow" style={{ fontSize: 13 }}>03 · For credit unions &amp; servicers</p>
              <span className="pill">Coming soon</span>
            </div>
            <h2 style={{ fontSize: 36, fontWeight: 800 }}>Partner Platform</h2>
            <p className="body" style={{ fontSize: 17 }}>
              Screen your existing portfolio for members who could qualify for better financing after a defined payoff,
              with borrower-level scenarios and an auditable file trail.
            </p>
          </div>
          <div className="stack" style={{ flex: "1 1 380px", gap: 14, background: "var(--teal-deep)", borderRadius: 20, padding: 36 }}>
            <h3 style={{ fontSize: 22, fontWeight: 700, color: "#fff" }}>Join the early partner list</h3>
            <p style={{ fontSize: 15, color: "var(--on-dark)" }}>Data use follows your agreements and member permissions.</p>
            <WaitlistForm product="partner_platform" dark />
          </div>
        </div>
      </section>

      <section className="section section-white">
        <div className="container stack" style={{ gap: 36 }}>
          <h2 style={{ fontSize: 36, fontWeight: 800 }}>Who it’s for</h2>
          <div className="row" style={{ gap: 24 }}>
            <div className="stack" style={{ flex: "1 1 420px", gap: 14, border: "2px solid var(--teal)", borderRadius: 20, padding: 32 }}>
              <h3 style={{ fontSize: 21, fontWeight: 700, color: "var(--teal-deep)" }}>A good fit</h3>
              <ul className="checklist">
                <li>Owns the home with solid equity</li>
                <li>Credit cards near their limits</li>
                <li>On-time payments, no recent lates</li>
                <li>Steady, documentable income</li>
              </ul>
            </div>
            <div className="stack card-tint" style={{ flex: "1 1 420px", gap: 14, border: "1px solid var(--line)", borderRadius: 20, padding: 32 }}>
              <h3 style={{ fontSize: 21, fontWeight: 700 }}>Not a fit</h3>
              <ul className="checklist body">
                <li>Recent late payments or collections</li>
                <li>Bankruptcy or foreclosure history</li>
                <li>Thin equity or high combined LTV</li>
                <li>Looking for cash out for other uses</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="section">
        <div className="container stack" style={{ gap: 20, maxWidth: 900 }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, marginBottom: 8 }}>Frequently asked questions</h2>
          {FAQ.map((f) => (
            <details key={f.q} className="faq">
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
