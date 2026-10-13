"use client";
import Link from "next/link";
import { week } from "@/prototype/content";
import { usePrototypeProgress } from "@/prototype/progress";
export default function Dashboard() {
  const { practiced } = usePrototypeProgress();
  return (
    <main id="main" className="page dashboard" tabIndex={-1}>
      <div className="page-heading">
        <p className="eyebrow">YOUR FIELD NOTEBOOK</p>
        <h1>Pick up the thread.</h1>
        <p className="lede">Good investigations start with a closer look.</p>
      </div>
      <section className="mission" aria-labelledby="mission-title">
        <div className="mission-copy">
          <p className="eyebrow accent">
            {practiced ? "KEEP INVESTIGATING" : "CONTINUE LEARNING"}
          </p>
          <p className="mission-module">
            Week 01 <span aria-hidden="true">/</span> {week.title}
          </p>
          <h2 id="mission-title">
            Read an HTTP
            <br className="desktop-break" /> conversation.
          </h2>
          <p className="mission-description">
            A path selects an order. A token identifies a session.
            <br className="desktop-break" /> Learn to tell what a request
            reveals—and what it doesn’t.
          </p>
          <div className="mission-progress">
            <span>{practiced ? "2 lessons explored" : "Lesson 2 of 6"}</span>
            <span>
              {practiced ? "2" : "1"} / 6 complete
              {practiced ? " in this preview" : ""}
            </span>
            <progress
              aria-label="Week 1 preview progress"
              value={practiced ? 2 : 1}
              max={6}
            />
          </div>
          <Link className="primary-button" href="/week-1/read-http">
            {practiced ? "Revisit lesson" : "Continue lesson"}{" "}
            <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div
          className="mission-artifact"
          role="group"
          aria-label="Preview of the lesson evidence"
        >
          <div className="artifact-caption">
            <span>EXHIBIT 01</span>
            <span>HTTP REQUEST</span>
          </div>
          <div className="preview-request">
            <span className="method">GET</span> /api/orders/
            <span className="ink-circle">418</span>
          </div>
          <div className="artifact-annotation">
            <span aria-hidden="true">↳</span> The resource is in the path.
          </div>
          <div className="artifact-question">
            What does this request
            <br />
            actually tell you?
          </div>
          <span className="artifact-footnote">Read first. Infer second.</span>
        </div>
      </section>
      <div className="dashboard-bottom">
        <section aria-labelledby="path-title">
          <div className="section-heading">
            <h2 id="path-title">Your learning path</h2>
            <Link className="text-link" href="/week-1">
              View Week 1 <span aria-hidden="true">→</span>
            </Link>
          </div>
          <ol className="compact-path">
            <li>
              <span className="path-number">01</span>
              <div>
                <strong>HTTP & Web Foundations</strong>
                <p>{practiced ? "2" : "1"} of 6 lessons · In progress</p>
              </div>
              <span className="path-current">Current</span>
            </li>
            <li>
              <span className="path-number muted">02</span>
              <div>
                <strong>Identity & access control</strong>
                <p>Up next, after the foundations.</p>
              </div>
            </li>
          </ol>
        </section>
        <section className="activity" aria-labelledby="activity-title">
          <h2 id="activity-title">This week</h2>
          <p className="activity-summary">
            {practiced ? "Two lessons explored." : "A foundation laid."}
          </p>
          <p>
            {practiced
              ? "You separated a resource selector from session context."
              : "You followed a request from the browser to the server."}
          </p>
          <div
            className="activity-days"
            role="img"
            aria-label="Practice activity: Monday active; Tuesday through Sunday no activity"
          >
            {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
              <span
                key={i}
                className={i === 0 ? "active-day" : ""}
                aria-hidden="true"
              >
                {day}
              </span>
            ))}
          </div>
          <span className="muted activity-caption">
            A little attention, regularly.
          </span>
        </section>
      </div>
    </main>
  );
}
