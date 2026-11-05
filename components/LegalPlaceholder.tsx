import Link from "next/link";
import { CONTACT } from "@/lib/site";

export default function LegalPlaceholder({ title, summary }: { title: string; summary: string }) {
  return (
    <section className="section">
      <div className="container stack" style={{ gap: 18, maxWidth: 820 }}>
        <p className="eyebrow">Legal</p>
        <h1 className="h1-page">{title}</h1>
        <p className="lead">{summary}</p>
        <p className="card" style={{ padding: 24 }}>
          [Full text to be drafted and approved by counsel before launch.] Questions? Email{" "}
          <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>.
        </p>
        <Link href="/" className="link-arrow">
          ← Back to home
        </Link>
      </div>
    </section>
  );
}
