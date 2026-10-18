"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";
export function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const drawer = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  function closeNavigation() {
    drawer.current?.close();
    trigger.current?.focus();
  }
  function navigation(mobile = false) {
    return <nav aria-label={mobile ? "Mobile navigation" : "Main navigation"}>
      {[{ href: "/", label: "dashboard" }, { href: "/week-1", label: "learn" }].map(({ href, label }) => {
        const active = href === "/" ? path === href : path.startsWith(href);
        return <Link key={href} href={href} aria-current={active ? "page" : undefined} onClick={mobile ? closeNavigation : undefined}>
          <span aria-hidden="true">{active ? ">" : "·"}</span>{label}
        </Link>;
      })}
    </nav>;
  }
  return <div className="app-shell">
    <a className="skip-link" href="#main">Skip to content</a>
    <aside className="sidebar">
      <Link href="/" className="brand" aria-label="BountyLab home">BOUNTYLAB<span className="brand-period">_</span></Link>
      <div className="edition">SECURITY RESEARCH WORKSPACE</div>
      {navigation()}
      <div className="sidebar-note">
        <span className="small-label">SESSION / PREVIEW</span>
        <p>week_01<br />{path.includes("read-http") ? "lesson_02" : "http_foundations"}</p>
        <div className="tiny-rule" />
        <span className="muted">Local practice<br />Progress resets on refresh</span>
      </div>
    </aside>
    <dialog ref={drawer} className="navigation-drawer" aria-labelledby="navigation-title" onCancel={closeNavigation}
      onKeyDown={(event) => {
        if (event.key !== "Tab") return;
        const controls = event.currentTarget.querySelectorAll<HTMLElement>("button, a[href]");
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }}>
      <div className="drawer-heading"><span id="navigation-title">BOUNTYLAB_</span><button className="secondary-button" onClick={closeNavigation}>Close</button></div>
      {navigation(true)}<p className="muted">SESSION / week_01</p>
    </dialog>
    <div className="workspace">
      <header className="topbar">
        <button ref={trigger} className="menu-button secondary-button" aria-haspopup="dialog" onClick={() => drawer.current?.showModal()}>Menu</button>
        <span>WORKSPACE <span className="topbar-separator">/</span>{path === "/" ? "DASHBOARD" : "MODULE_01"}</span>
        <span className="prototype-label">Interactive prototype</span>
      </header>
      {children}
      <footer className="footer"><span>BountyLab / Learn to investigate.</span><span>Synthetic evidence · Local practice only</span></footer>
    </div>
  </div>;
}
