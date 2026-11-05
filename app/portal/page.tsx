import type { Metadata } from "next";
import Link from "next/link";
import WaitlistForm from "@/components/WaitlistForm";
import { LockIcon } from "@/components/Icons";
import { CONTACT, REVIEW_TURNAROUND } from "@/lib/site";

export const metadata: Metadata = {
  title: "Partner Portal",
  description: "Secure scenario submission and document upload for EquiBridge broker and lender partners. Opening soon.",
};

export default function PortalPage() {
  return (
    <section className="section">
      <div className="container row" style={{ gap: 48, alignItems: "flex-start" }}>
        <div className="stack" style={{ flex: "1 1 520px", gap: 18 }}>
          <div className="row" style={{ gap: 12, alignItems: "center" }}>
            <p className="eyebrow">Partner portal</p>
            <span className="pill">Opening soon</span>
          </div>
          <h1 className="h1-page">Secure scenario submission for broker &amp; lender partners</h1>
          <p className="lead">
            Upload documents, track each file’s status and receive readiness reports in {REVIEW_TURNAROUND} — all in one
            secure place.
          </p>
          <ul className="checklist">
            <li>Partner login with two-step verification</li>
            <li>Encrypted document upload</li>
            <li>Status tracking for every scenario</li>
            <li>Readiness report with the best exit path</li>
          </ul>
          <div className="card stack" style={{ gap: 10, padding: 24, marginTop: 8 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--teal-deep)" }}>Have a scenario today?</h2>
            <p className="body" style={{ fontSize: 15 }}>
              Send a short summary (no Social Security or account numbers) and we’ll arrange secure document exchange.
            </p>
            <div className="row" style={{ gap: 12 }}>
              <Link href="/about#contact" className="btn btn-primary btn-sm">
                Send a Scenario Summary
              </Link>
              <a href={`mailto:${CONTACT.email}`} className="btn btn-outline btn-sm">
                Email Us
              </a>
            </div>
          </div>
        </div>

        <div className="card stack" style={{ flex: "1 1 380px", gap: 16, boxShadow: "0 20px 48px rgba(15,76,92,0.12)" }}>
          <LockIcon />
          <h2 style={{ fontSize: 22, fontWeight: 700 }}>Get early access</h2>
          <p className="body" style={{ fontSize: 15 }}>
            Join the partner list and we’ll send your login when the portal opens.
          </p>
          <WaitlistForm product="partner_portal" button="Request Access" />
        </div>
      </div>
    </section>
  );
}
