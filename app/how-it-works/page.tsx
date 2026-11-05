import type { Metadata } from "next";
import AudienceTabs from "@/components/AudienceTabs";

export const metadata: Metadata = {
  title: "How It Works",
  description: "How the Combination Bridge Loan works for brokers, lenders and homeowners — from card payoff to a better loan in about six weeks.",
};

export default async function HowItWorksPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const { view } = await searchParams;
  const initial = view === "homeowners" ? "homeowners" : "brokers";

  return (
    <section className="section" style={{ paddingTop: 0 }}>
      <div style={{ background: "var(--surface)", borderBottom: "1px solid var(--line)" }}>
        <div className="container stack" style={{ gap: 18, paddingTop: 72, paddingBottom: 40 }}>
          <p className="eyebrow">How it works</p>
          <h1 className="h1-page">From high card balances to a better loan in about six weeks</h1>
          <p className="lead">Choose your view. Brokers and lenders manage the file; homeowners see what to expect at each step.</p>
        </div>
      </div>
      <div className="container stack" style={{ paddingTop: 32 }}>
        <AudienceTabs initial={initial} />
      </div>
    </section>
  );
}
