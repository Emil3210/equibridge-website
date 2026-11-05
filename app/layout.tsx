import type { Metadata } from "next";
import "@fontsource-variable/inter";
import "@fontsource/montserrat/600.css";
import "@fontsource/montserrat/700.css";
import "@fontsource/montserrat/800.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://equibridgecapital.com"),
  title: {
    default: "EquiBridge Capital — Intelligent Lending. Greater Possibilities.",
    template: "%s | EquiBridge Capital",
  },
  description:
    "A short-term second mortgage that pays off high card balances directly, so equity-rich homeowners can move to a better permanent loan. For brokers, lenders and their clients.",
  icons: { icon: "/logo-mark.png" },
  openGraph: {
    title: "EquiBridge Capital",
    description: "Intelligent Lending. Greater Possibilities.",
    url: "https://equibridgecapital.com",
    siteName: "EquiBridge Capital",
    images: [{ url: "/logo-full.png" }],
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
