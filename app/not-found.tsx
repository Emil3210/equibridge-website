import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section">
      <div className="container stack" style={{ gap: 16, maxWidth: 720 }}>
        <p className="eyebrow">Page not found</p>
        <h1 className="h1-page">We couldn’t find that page.</h1>
        <Link href="/" className="btn btn-primary" style={{ alignSelf: "flex-start" }}>
          Back to Home
        </Link>
      </div>
    </section>
  );
}
