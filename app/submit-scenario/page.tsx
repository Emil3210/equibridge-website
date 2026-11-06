import type { Metadata } from "next";
import ScenarioForm from "@/components/ScenarioForm";
import { REVIEW_TURNAROUND } from "@/lib/site";

export const metadata: Metadata = {
  title: "Submit a Scenario",
  description: "Send a quick scenario or request a secure upload for a 1003/1008. Get a bridge readiness review from EquiBridge Capital.",
};

export default function SubmitScenarioPage() {
  return (
    <section className="section" style={{ paddingTop: 0 }}>
      <div style={{ background: "var(--surface)", borderBottom: "1px solid var(--line)" }}>
        <div className="container stack" style={{ gap: 16, paddingTop: 64, paddingBottom: 40 }}>
          <p className="eyebrow">Submit a scenario</p>
          <h1 className="h1-page">Have an “almost” file? Let’s see if a bridge fits.</h1>
          <p className="lead">
            Send a two-minute quick scenario, or tell us you have a 1003/1008 and we’ll send a secure upload link.
          </p>
        </div>
      </div>
      <div className="container row" style={{ gap: 32, paddingTop: 40, alignItems: "flex-start" }}>
        <div style={{ flex: "2 1 600px", minWidth: 0 }}>
          <ScenarioForm />
        </div>
        <aside className="stack" style={{ flex: "1 1 280px", gap: 20 }}>
          <div className="card stack" style={{ gap: 12, padding: 28 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "var(--teal-deep)" }}>What happens next</h2>
            <ol className="checklist" style={{ fontSize: 15 }}>
              <li>We review the scenario within {REVIEW_TURNAROUND}.</li>
              <li>You get a readiness report: payoff plan, projected CLTV and DTI, open conditions.</li>
              <li>If it fits, the takeout lender’s conditional approval comes first, then the bridge.</li>
            </ol>
          </div>
          <div className="section-mint stack" style={{ gap: 10, padding: 28, borderRadius: 20 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: "var(--teal-deep)" }}>Good fit</h2>
            <ul className="checklist" style={{ fontSize: 15 }}>
              <li>Clean payment history, no recent lates</li>
              <li>Score held down mainly by card utilization</li>
              <li>Enough equity for the payoff</li>
              <li>Income that supports the bridge payment</li>
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}
