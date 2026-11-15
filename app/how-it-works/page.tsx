import type { Metadata } from "next";
import Link from "next/link";
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
      <div className="container stack" style={{ gap: 18, paddingTop: 56 }}>
        <div className="stack" style={{ gap: 8 }}>
          <p className="eyebrow">Watch · about 2½ minutes, with sound</p>
          <h2 className="h2">How a bridge makes a credit-constrained borrower refinance-ready</h2>
        </div>
        <video
          controls
          playsInline
          preload="metadata"
          poster="/videos/equibridge-explainer-poster.jpg"
          style={{ width: "100%", aspectRatio: "16 / 9", borderRadius: 16, background: "#0f4c5c", boxShadow: "0 12px 32px rgba(15,76,92,0.12)" }}
        >
          <source src="/videos/equibridge-explainer.mp4" type="video/mp4" />
          Your browser can’t play this video. <a href="/videos/equibridge-explainer.mp4">Download it here</a>.
        </video>
        <Link href="/process" className="link-arrow" style={{ alignSelf: "flex-start" }}>
          Brokers &amp; lenders: see the full process, from conditional approval to funding →
        </Link>
      </div>
      <div className="container stack" style={{ paddingTop: 48 }}>
        <AudienceTabs initial={initial} />
      </div>
    </section>
  );
}
