import Link from "next/link";
import { ChartIcon, HomeIcon, UsersIcon } from "@/components/Icons";
import { REVIEW_TURNAROUND } from "@/lib/site";

const STEPS = [
  { n: "01", title: "Screen & pre-approve", text: "Full documentation, plus a conditional exit-loan approval pending the target score." },
  { n: "02", title: "Bridge closes", text: "A closed-end second mortgage pays the chosen cards directly. No cash to the borrower." },
  { n: "03", title: "Credit updates", text: "Card issuers report $0 balances. A lender rapid rescore can speed reporting." },
  { n: "04", title: "Exit to a better loan", text: "The pre-approved loan pays off the bridge, when it truly helps the borrower." },
];

const WHY = [
  { title: "Exit lined up first", text: "Every bridge starts with a conditional exit-loan approval in the file." },
  { title: "Paid directly to creditors", text: "Funds go straight to the card issuers, so the debt is actually retired." },
  { title: "Affordable on its own", text: "Full documentation and ability-to-repay, even if no exit happens." },
  { title: "Fast scenario review", text: `Readiness report back to brokers in ${REVIEW_TURNAROUND}.` },
];

export default function HomePage() {
  return (
    <>
      <section style={{ background: "linear-gradient(180deg, #ffffff 0%, var(--bg) 100%)" }}>
        <div className="container row" style={{ gap: 56, alignItems: "center", paddingTop: 88, paddingBottom: 96 }}>
          <div className="stack" style={{ flex: "1 1 520px", gap: 24 }}>
            <p className="eyebrow">Specialty bridge lending</p>
            <h1 className="h1">
              Intelligent Lending.
              <br />
              <span className="accent">Greater Possibilities.</span>
            </h1>
            <p className="lead" style={{ maxWidth: 560 }}>
              A short-term second mortgage that pays off high card balances directly, so equity-rich homeowners with
              strong payment history can move to a better permanent loan.
            </p>
            <div className="row" style={{ gap: 14, paddingTop: 8 }}>
              <Link href="/portal" className="btn btn-primary">
                Submit a Scenario
              </Link>
              <Link href="/how-it-works" className="btn btn-outline">
                See How It Works
              </Link>
            </div>
            <p className="small">For mortgage brokers, lenders and their clients. Not a commitment to lend.</p>
          </div>

          <div style={{ flex: "1 1 420px", display: "flex", justifyContent: "center" }}>
            <div
              className="card stack"
              style={{ width: "100%", maxWidth: 460, gap: 22, boxShadow: "0 20px 48px rgba(15,76,92,0.14)" }}
            >
              <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
                <h2 className="h3" style={{ color: "var(--teal-deep)" }}>
                  Scenario snapshot
                </h2>
                <span className="pill">Illustrative</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 16 }}>
                <div className="card-tint" style={{ padding: 18 }}>
                  <p className="small">Card utilization</p>
                  <p style={{ fontFamily: "var(--font-heading)", fontSize: 22, fontWeight: 800, whiteSpace: "nowrap" }}>87% → 0%</p>
                </div>
                <div className="card-tint" style={{ padding: 18 }}>
                  <p className="small">Monthly debt payments</p>
                  <p style={{ fontFamily: "var(--font-heading)", fontSize: 22, fontWeight: 800, whiteSpace: "nowrap" }}>$2,153 → $949</p>
                </div>
              </div>
              <div className="stack" style={{ gap: 10 }}>
                <div className="row small" style={{ justifyContent: "space-between" }}>
                  <span>Bridge closes</span>
                  <span>Exit loan · ~6 weeks</span>
                </div>
                <div style={{ height: 10, borderRadius: 999, background: "var(--tint)", overflow: "hidden" }}>
                  <div
                    style={{
                      width: "72%",
                      height: 10,
                      borderRadius: 999,
                      background: "linear-gradient(90deg, var(--teal) 0%, var(--aqua) 100%)",
                    }}
                  />
                </div>
              </div>
              <ul className="checklist" style={{ fontSize: 15, lineHeight: 1.8 }}>
                <li>Cards paid directly by EquiBridge</li>
                <li>Exit loan pre-approved, pending score</li>
                <li>Fully amortizing fallback if no exit</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="container row" style={{ gap: 28, paddingBottom: 88, paddingTop: 24 }}>
          <div className="card stack" style={{ flex: "1 1 460px", gap: 16, padding: 40 }}>
            <p className="eyebrow" style={{ fontSize: 13 }}>For brokers &amp; lenders</p>
            <h2 style={{ fontSize: 30, fontWeight: 700 }}>Turn your “almost” files into closed loans</h2>
            <p className="body" style={{ fontSize: 17 }}>
              Clients with strong equity and on-time payments, held back by card balances. We bridge them; you keep the
              relationship and the exit loan.
            </p>
            <Link href="/how-it-works" className="link-arrow">
              How it works for partners →
            </Link>
          </div>
          <div className="card stack" style={{ flex: "1 1 460px", gap: 16, padding: 40 }}>
            <p className="eyebrow" style={{ fontSize: 13 }}>For homeowners</p>
            <h2 style={{ fontSize: 30, fontWeight: 700 }}>Use your equity to clear the cards holding your score down</h2>
            <p className="body" style={{ fontSize: 17 }}>
              One affordable payment instead of several high-rate cards, and a clear path toward a better long-term loan.
            </p>
            <Link href="/how-it-works?view=homeowners" className="link-arrow">
              How it works for homeowners →
            </Link>
          </div>
        </div>
      </section>

      <section className="section section-white">
        <div className="container stack" style={{ gap: 48 }}>
          <div className="stack" style={{ gap: 12, maxWidth: 720 }}>
            <p className="eyebrow">How it works</p>
            <h2 className="h2">Two stages in about six weeks</h2>
          </div>
          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
            {STEPS.map((s, i) => (
              <div key={s.n} className={`stack ${i === STEPS.length - 1 ? "card-dark" : "card-tint"}`} style={{ gap: 12 }}>
                <p className="step-num">{s.n}</p>
                <h3 style={{ fontSize: 19, fontWeight: 700 }}>{s.title}</h3>
                <p style={{ fontSize: 15, color: i === STEPS.length - 1 ? "var(--on-dark)" : "var(--body)" }}>{s.text}</p>
              </div>
            ))}
          </div>
          <Link href="/how-it-works" className="btn btn-outline" style={{ alignSelf: "flex-start" }}>
            See the full process
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="container stack" style={{ gap: 48 }}>
          <div className="stack" style={{ gap: 12, maxWidth: 720 }}>
            <p className="eyebrow">Solutions</p>
            <h2 className="h2">Built for the files traditional lending misses</h2>
          </div>
          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
            <div className="card stack" style={{ gap: 14 }}>
              <HomeIcon />
              <h3 className="h3">Combination Bridge Loan</h3>
              <p className="body" style={{ fontSize: 15 }}>
                A closed-end second that pays off revolving debt directly, with the exit loan lined up before closing.
              </p>
            </div>
            <div className="card stack" style={{ gap: 14 }}>
              <ChartIcon />
              <h3 className="h3">Scenario Review</h3>
              <p className="body" style={{ fontSize: 15 }}>
                Send a file and get a readiness report: payoff plan, projected DTI and CLTV, and the best exit path.
              </p>
            </div>
            <div className="card stack" style={{ gap: 14 }}>
              <UsersIcon />
              <h3 className="h3">Partner Platform</h3>
              <p className="body" style={{ fontSize: 15 }}>
                For credit unions and servicers: find existing members who could qualify after a defined payoff. Coming
                soon.
              </p>
            </div>
          </div>
          <Link href="/solutions" className="link-arrow" style={{ alignSelf: "flex-start" }}>
            Explore all solutions →
          </Link>
        </div>
      </section>

      <section className="section section-white">
        <div className="container row" style={{ gap: 48 }}>
          <div className="stack" style={{ flex: "1 1 360px", gap: 14 }}>
            <p className="eyebrow">Why EquiBridge</p>
            <h2 className="h2">Lending designed around a clear exit</h2>
          </div>
          <div className="grid" style={{ flex: "2 1 560px", gap: 28, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
            {WHY.map((w) => (
              <div key={w.title} className="stack" style={{ gap: 8, borderTop: "3px solid var(--aqua)", paddingTop: 18 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700 }}>{w.title}</h3>
                <p className="body" style={{ fontSize: 15 }}>
                  {w.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-mint">
        <div
          className="container row"
          style={{ gap: 32, alignItems: "center", justifyContent: "space-between", paddingTop: 72, paddingBottom: 72 }}
        >
          <div className="stack" style={{ flex: "1 1 520px", gap: 10 }}>
            <h2 style={{ fontSize: 34, fontWeight: 800, color: "var(--teal-deep)", lineHeight: 1.2 }}>
              Have an “almost” file? Send us two scenarios.
            </h2>
            <p style={{ fontSize: 17 }}>
              Strong equity, on-time payments, scores held down by card balances. We’ll tell you within{" "}
              {REVIEW_TURNAROUND} whether a bridge fits.
            </p>
          </div>
          <div className="row" style={{ gap: 14 }}>
            <Link href="/portal" className="btn btn-primary">
              Submit a Scenario
            </Link>
            <Link href="/about#contact" className="btn btn-outline">
              Talk to Our Team
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
