"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type NavItem = { href: string; label: string; children?: { href: string; label: string; note: string }[] };

const NAV: NavItem[] = [
  { href: "/solutions", label: "Solutions" },
  {
    href: "/how-it-works",
    label: "How It Works",
    children: [
      { href: "/how-it-works", label: "Overview", note: "The 2½-minute introduction" },
      { href: "/process", label: "The EquiBridge Process", note: "For brokers & lenders: approval to funding" },
    ],
  },
  { href: "/about", label: "About" },
  { href: "/about#contact", label: "Contact" },
];

// Dropdown for a menu item with sub-pages. Opens on click or tap (works the same on phones),
// closes on Escape, an outside click, or when the page changes.
function NavMenu({ item, pathname }: { item: NavItem; pathname: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const children = item.children ?? [];
  const isCurrent = children.some((c) => c.href === pathname);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="nav-menu" ref={ref}>
      <button
        type="button"
        className="nav-menu-btn"
        aria-expanded={open}
        aria-haspopup="true"
        data-current={isCurrent ? "true" : undefined}
        onClick={() => setOpen((o) => !o)}
      >
        {item.label} <span aria-hidden="true">▾</span>
      </button>
      {open ? (
        <div className="nav-menu-list">
          {children.map((c) => (
            <Link key={c.href} href={c.href} aria-current={pathname === c.href ? "page" : undefined}>
              <span className="nav-menu-label">{c.label}</span>
              <span className="nav-menu-note">{c.note}</span>
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <div className="container">
        <Link href="/" className="brand" aria-label="EquiBridge Capital home">
          <Image src="/logo-full.png" alt="EquiBridge Capital" width={1200} height={765} priority />
        </Link>

        <nav className="main-nav" aria-label="Main">
          {NAV.map((item) => {
            if (item.children) return <NavMenu key={item.href} item={item} pathname={pathname} />;
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
          <Link href="/submit-scenario" className="btn btn-primary btn-sm">
            Submit a Scenario
          </Link>
        </div>
      </div>
    </header>
  );
}
