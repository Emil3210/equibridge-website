import type { Metadata } from "next";
import Image from "next/image";
import ContactForm from "@/components/ContactForm";
import { EyeIcon, HandshakeIcon, ShieldIcon } from "@/components/Icons";
import { CONTACT } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: "EquiBridge Capital helps homeowners with strong payment history and equity move past high card balances to a better loan.",
};

const VALUES = [
  { icon: <ShieldIcon />, title: "Responsible lending", text: "Every loan is fully documented and affordable on its own, even if the exit loan never closes." },
  { icon: <EyeIcon />, title: "Plain-English transparency", text: "Costs, trade-offs and the fact that the home secures the loan are explained up front. No score promises." },
  { icon: <HandshakeIcon />, title: "Partners first", text: "We work through brokers and lenders, who keep their client relationships and exit loans." },
];

export default function AboutPage() {
  return (
    <>
      <section className="section-white" style={{ borderTop: "none" }}>
        <div className="container row" style={{ gap: 48, alignItems: "center", paddingTop: 72, paddingBottom: 72 }}>
          <div className="stack" style={{ flex: "1 1 560px", gap: 18 }}>
            <p className="eyebrow">About us</p>
            <h1 className="h1-page">A bridge for borrowers the system almost lets through</h1>
            <p className="lead">
              EquiBridge Capital exists for homeowners who do the right things — pay on time, build equity — yet get held
              back because their credit cards are near their limits. We pay those balances off directly and line up a
              better loan on the other side.
            </p>
          </div>
          <div style={{ flex: "1 1 360px", display: "flex", justifyContent: "center" }}>
            <Image
              src="/logo-full.png"
              alt="EquiBridge Capital logo: a cable-stayed bridge above the words EquiBridge Capital"
              width={380}
              height={261}
            />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container stack" style={{ gap: 36 }}>
          <h2 style={{ fontSize: 36, fontWeight: 800 }}>What we stand for</h2>
          <div className="grid">
            {VALUES.map((v) => (
              <div key={v.title} className="card stack" style={{ gap: 12 }}>
                {v.icon}
                <h3 className="h3">{v.title}</h3>
                <p className="body" style={{ fontSize: 15 }}>
                  {v.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-white">
        <div className="container stack" style={{ gap: 36 }}>
          <h2 style={{ fontSize: 36, fontWeight: 800 }}>Leadership</h2>
          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
            <div className="card-tint row" style={{ gap: 20, alignItems: "flex-start", padding: 32, borderRadius: 20 }}>
              <div
                aria-hidden="true"
                style={{
                  flex: "0 0 72px",
                  height: 72,
                  borderRadius: "50%",
                  background: "var(--teal-deep)",
                  color: "var(--aqua)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--font-heading)",
                  fontSize: 24,
                  fontWeight: 800,
                }}
              >
                EY
              </div>
              <div className="stack" style={{ gap: 6, flex: "1 1 180px" }}>
                <h3 className="h3">Emil Yussuf</h3>
                <p style={{ fontSize: 14, fontWeight: 600, color: "var(--teal)" }}>Founder &amp; Chief Growth Officer</p>
                <p className="body" style={{ fontSize: 15 }}>
                  Sales leader in mortgage finance, focused on building high-performing teams and KPI-driven growth. [Add
                  years of experience, past roles and NMLS #.]
                </p>
              </div>
            </div>
            {["[Credit & underwriting lead]", "[Compliance advisor]"].map((role) => (
              <div key={role} className="card stack" style={{ gap: 6, borderStyle: "dashed" }}>
                <h3 className="h3" style={{ color: "var(--body)" }}>
                  {role}
                </h3>
                <p className="small">[Name, title and short bio.]</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="section" style={{ scrollMarginTop: 80 }}>
        <div className="container row" style={{ gap: 48 }}>
          <div className="stack" style={{ flex: "1 1 360px", gap: 18 }}>
            <p className="eyebrow">Contact</p>
            <h2 style={{ fontSize: 36, fontWeight: 800 }}>Let’s talk about your next file</h2>
            <div className="stack" style={{ gap: 6, fontSize: 16 }}>
              <a href={`mailto:${CONTACT.email}`} style={{ fontWeight: 600 }}>
                {CONTACT.email}
              </a>
              <p>{CONTACT.phone}</p>
              <p>{CONTACT.city}</p>
            </div>
            <div className="card stack" style={{ gap: 6, padding: 22, borderRadius: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--teal-deep)" }}>Licensing</h3>
              <p className="body" style={{ fontSize: 14 }}>
                EquiBridge Capital, NMLS #{CONTACT.nmls}. [State license numbers.] Verify at{" "}
                <a href="https://www.nmlsconsumeraccess.org" rel="noopener noreferrer" target="_blank">
                  nmlsconsumeraccess.org
                </a>
                .
              </p>
            </div>
          </div>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
