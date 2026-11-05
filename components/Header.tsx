"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/solutions", label: "Solutions" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About" },
  { href: "/about#contact", label: "Contact" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <div className="container">
        <Link href="/" className="brand" aria-label="EquiBridge Capital home">
          <Image src="/logo-mark.png" alt="" width={116} height={40} priority />
          <span className="wordmark">
            <span className="wordmark-main">
              Equi<span className="accent">Bridge</span>
            </span>
            <span className="wordmark-sub">CAPITAL</span>
          </span>
        </Link>

        <nav className="main-nav" aria-label="Main">
          {NAV.map((item) => {
            const isCurrent = !item.href.includes("#") && pathname === item.href;
            return (
              <Link key={item.href} href={item.href} aria-current={isCurrent ? "page" : undefined}>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="header-actions">
          <Link href="/portal" className="btn btn-outline btn-sm hide-sm">
            Partner Login
          </Link>
          <Link href="/portal" className="btn btn-primary btn-sm">
            Submit a Scenario
          </Link>
        </div>
      </div>
    </header>
  );
}
