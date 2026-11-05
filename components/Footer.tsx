import Link from "next/link";
import { CONTACT } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-cols">
          <div style={{ flex: "1 1 260px" }}>
            <p style={{ fontFamily: "var(--font-heading)", fontSize: 24, fontWeight: 800, color: "#fff" }}>
              Equi<span style={{ color: "var(--aqua)" }}>Bridge</span>{" "}
              <span style={{ fontSize: 13, letterSpacing: 4, color: "var(--aqua)" }}>CAPITAL</span>
            </p>
            <p style={{ marginTop: 10 }}>Intelligent Lending. Greater Possibilities.</p>
          </div>
          <div>
            <h3>Solutions</h3>
            <Link href="/solutions#bridge">Combination Bridge Loan</Link>
            <Link href="/solutions#review">Scenario Review</Link>
            <Link href="/solutions#platform">Partner Platform</Link>
          </div>
          <div>
            <h3>Company</h3>
            <Link href="/about">About us</Link>
            <Link href="/how-it-works">How it works</Link>
            <Link href="/portal">Partner portal</Link>
          </div>
          <div>
            <h3>Contact</h3>
            <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
            <p style={{ padding: "3px 0" }}>{CONTACT.phone}</p>
            <p style={{ padding: "3px 0" }}>{CONTACT.city}</p>
          </div>
        </div>
        <p className="footer-legal">
          © {new Date().getFullYear()} EquiBridge Capital. NMLS #{CONTACT.nmls}. Licensed in {CONTACT.states}. Equal Housing
          Opportunity. This is not a commitment to lend. All loans are subject to credit approval, underwriting and
          property eligibility; no specific credit score result is guaranteed. <Link href="/privacy">Privacy</Link> ·{" "}
          <Link href="/terms">Terms</Link> · <Link href="/licensing">Licensing</Link>
        </p>
      </div>
    </footer>
  );
}
