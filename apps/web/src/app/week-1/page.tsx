"use client";
import Link from "next/link";
import { week } from "@/prototype/content";
import { usePrototypeProgress } from "@/prototype/progress";
export default function WeekPage() {
  const { practiced } = usePrototypeProgress();
  return (
    <main id="main" className="page module-page" tabIndex={-1}>
      <Link className="back-link" href="/">
        ← Dashboard
      </Link>
      <div className="module-intro">
        <div>
          <p className="eyebrow accent">MODULE_01 // HTTP_FOUNDATIONS</p>
          <h1>{week.title}</h1>
          <p className="lede">{week.summary}</p>
        </div>
        <div className="module-progress">
          <strong>
            {practiced ? "2" : "1"}
            <span> / 6</span>
          </strong>
          <p>lessons complete{practiced ? " in preview" : ""}</p>
          <progress
            aria-label="Module preview progress"
            value={practiced ? 2 : 1}
            max={6}
          />
        </div>
      </div>
      <div className="module-objective">
        <span className="small-label">OBJECTIVE</span>
        <p>
          Read a request. Trace its context.
          <br />
          Separate what you observe from what you assume.
        </p>
      </div>
      <section aria-labelledby="sequence-title">
        <div className="section-heading">
          <h2 id="sequence-title">LESSON_SEQUENCE</h2>
          <span className="muted">6 lessons</span>
        </div>
        <ol className="lesson-list">
          {week.lessons.map((item, i) => {
            const state = i === 1 && practiced ? "Complete" : item.state;
            return (
              <li
                key={item.id}
                className={state === "Current" ? "current-lesson" : ""}
              >
                <span className="lesson-index">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="lesson-list-copy">
                  {item.href ? (
                    <Link href={item.href}>
                      {item.title}
                      <span aria-hidden="true"> →</span>
                    </Link>
                  ) : (
                    <h3>{item.title}</h3>
                  )}
                  <p>{item.detail}</p>
                  {i === 2 && (
                    <span className="scope-note">
                      Outline only in this prototype
                    </span>
                  )}
                </div>
                <div className="lesson-meta">
                  <span className={`lesson-state state-${state.toLowerCase()}`}>
                    {state === "Complete" && <span aria-hidden="true">✓ </span>}
                    {state}
                  </span>
                  <span className="muted">{item.minutes} min</span>
                </div>
              </li>
            );
          })}
        </ol>
      </section>
      <details className="future-path">
        <summary>
          After the foundations <span aria-hidden="true">+</span>
        </summary>
        <p>
          Week 2 introduces identity and access control. You’ll use the same
          observation → hypothesis → evidence method to reason about
          permissions.
        </p>
        <p className="muted">Future curriculum is outside this prototype.</p>
      </details>
    </main>
  );
}
