"use client";
import Link from "next/link";
import { usePrototypeProgress } from "@/prototype/progress";
export default function Dashboard() {
  const { practiced } = usePrototypeProgress();
  return <main id="main" className="page dashboard" tabIndex={-1}>
    <div className="page-heading"><p className="eyebrow muted">CURRENT_SESSION</p><h1>Your investigation workspace</h1></div>
    <section className="mission" aria-labelledby="mission-title">
      <div className="mission-copy">
        <p className="mission-module">MODULE_01 / HTTP_FOUNDATIONS</p>
        <h2 id="mission-title">Read an HTTP conversation</h2>
        <p className="mission-description">Separate the resource being requested from the session requesting it.</p>
        <dl className="session-metadata">
          <div><dt>STATUS</dt><dd>{practiced ? "PRACTICE_COMPLETE" : "IN_PROGRESS"}</dd></div>
          <div><dt>LESSON</dt><dd>02 / 06</dd></div>
          <div><dt>PROGRESS</dt><dd>{practiced ? "2" : "1"} / 6 complete · preview</dd></div>
        </dl>
        <progress aria-label="Week 1 preview progress" value={practiced ? 2 : 1} max={6} />
        <Link className="primary-button" href="/week-1/read-http">{practiced ? "Revisit lesson" : "Continue"}<span aria-hidden="true">→</span></Link>
      </div>
      <div className="mission-artifact" role="group" aria-label="Preview of the lesson evidence">
        <div className="artifact-caption"><span>REQUEST_01</span><span>SYNTHETIC</span></div>
        <div className="preview-request"><span className="method">GET</span> /api/orders/<span className="identifier">418</span></div>
        <dl className="preview-headers"><div><dt>HOST</dt><dd>training.invalid</dd></div><div><dt>ACCEPT</dt><dd>application/json</dd></div></dl>
        <div className="artifact-question"><span className="small-label">INVESTIGATION_02</span><p>Which value selects the order?</p></div>
        <span className="artifact-footnote">STATUS / No server response collected</span>
      </div>
    </section>
    <section className="learning-path" aria-labelledby="path-title">
      <div className="section-heading"><h2 id="path-title">LEARNING_PATH</h2><Link className="text-link" href="/week-1">Open module →</Link></div>
      <ol className="compact-path">
        <li><span className="path-number">01</span><div><Link href="/week-1"><strong>HTTP_FOUNDATIONS</strong></Link><p>{practiced ? "2" : "1"} of 6 lessons explored</p></div><span className="path-current">&gt; ACTIVE</span></li>
        <li><span className="path-number muted">02</span><div><strong>BROKEN_ACCESS_CONTROL</strong><p>Identity and object ownership · outside this preview</p></div><span className="path-current muted">· PLANNED</span></li>
      </ol>
    </section>
    <section className="activity" aria-labelledby="activity-title"><h2 id="activity-title">RECENT_ACTIVITY</h2><p className="activity-summary">{practiced ? "02 / Request investigation practiced" : "01 / Browser-to-server request explored"}</p><p>{practiced ? "Resource selection and session context examined. No server response collected." : "A synthetic starting snapshot. Continue with the HTTP request investigation."}</p></section>
  </main>;
}
