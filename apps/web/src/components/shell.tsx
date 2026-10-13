"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
export function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <aside className="sidebar">
        <Link href="/" className="brand" aria-label="BountyLab home">
          <span className="brand-mark" aria-hidden="true">
            b<span>l</span>
          </span>
          BountyLab<span className="brand-period">.</span>
        </Link>
        <div className="edition">A FIELD GUIDE TO WEB SECURITY</div>
        <nav aria-label="Main navigation">
          <Link href="/" aria-current={path === "/" ? "page" : undefined}>
            <span aria-hidden="true">01</span> Overview
          </Link>
          <Link
            href="/week-1"
            aria-current={path.startsWith("/week-1") ? "page" : undefined}
          >
            <span aria-hidden="true">02</span> Learning path
          </Link>
        </nav>
        <div className="sidebar-note">
          <span className="small-label">THE METHOD</span>
          <p>
            Observe carefully.
            <br />
            Question deliberately.
            <br />
            Follow the evidence.
          </p>
          <div className="tiny-rule" />
          <span className="muted">Frontend study / 01</span>
        </div>
      </aside>
      <div className="workspace">
        <header className="topbar">
          <span>
            FIELD NOTES <span className="topbar-separator">/</span>{" "}
            {path === "/" ? "OVERVIEW" : "WEEK 01"}
          </span>
          <span className="prototype-label">Interactive prototype</span>
        </header>
        {children}
        <footer className="footer">
          <span>BountyLab · Learn to investigate.</span>
          <span>Synthetic evidence. Local practice only.</span>
        </footer>
      </div>
    </div>
  );
}
