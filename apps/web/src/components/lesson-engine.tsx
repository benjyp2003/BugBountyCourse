"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import { HttpEvidence } from "./http-evidence";
import {
  partNotes,
  type PrototypeLesson,
  type RequestPart,
} from "@/prototype/content";
import { usePrototypeProgress } from "@/prototype/progress";
export function LessonEngine({ lesson }: { lesson: PrototypeLesson }) {
  const [step, setStep] = useState(0);
  const [furthest, setFurthest] = useState(0);
  const [observed, setObserved] = useState<RequestPart | null>(null);
  const [inspected, setInspected] = useState<RequestPart | null>(null);
  const [hypothesis, setHypothesis] = useState("");
  const [explanation, setExplanation] = useState("");
  const [reviewed, setReviewed] = useState(false);
  const [applyPart, setApplyPart] = useState<RequestPart | null>(null);
  const [order, setOrder] = useState("418");
  const [applied, setApplied] = useState(false);
  const [applyFeedback, setApplyFeedback] = useState("");
  const [finished, setFinished] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const { markPracticed } = usePrototypeProgress();
  const block = lesson.blocks[step];
  function navigate(index: number) {
    setFinished(false);
    setStep(index);
    setFurthest((previous) => Math.max(previous, index));
    requestAnimationFrame(() => {
      heading.current?.focus();
      heading.current?.scrollIntoView({ block: "nearest" });
    });
  }
  const canContinue =
    block.type === "observe"
      ? observed !== null
      : block.type === "think"
        ? hypothesis.trim().length > 0
        : block.type === "inspect"
          ? inspected === "identifier"
          : block.type === "explain"
            ? reviewed
            : true;
  const note = observed ? partNotes[observed] : null;
  function evidence(
    selected?: RequestPart | null,
    onSelect?: (part: RequestPart) => void,
  ) {
    return (
      <HttpEvidence
        request={lesson.request}
        selected={selected}
        onSelect={onSelect}
      />
    );
  }
  function renderBlock() {
    switch (block.type) {
      case "hook":
        return (
          <>
            {evidence()}
            <div className="hook-note">
              <span className="small-label">OBJECTIVE</span>
              <p>
                Find the value that selects an order. Explain why changing it is
                a testable idea, not proof of a vulnerability.
              </p>
            </div>
          </>
        );
      case "observe":
        return (
          <>
            {evidence(observed, setObserved)}
            <div className="annotation" role="status" aria-live="polite">
              <span className="small-label">OBSERVATION</span>
              <h3>{note?.title ?? "The request is your starting point."}</h3>
              <p>
                {note?.body ??
                  "Every part has a job. Select the method, a path segment, or a header value to see what it tells you."}
              </p>
            </div>
          </>
        );
      case "think":
        return (
          <>
            {evidence()}
            <div className="reasoning-field">
              <label htmlFor="hypothesis">Your hypothesis</label>
              <p id="hypothesis-help">
                A hypothesis is a testable possibility. Try: “If I change …, I
                expect …”
              </p>
              <textarea
                id="hypothesis"
                maxLength={1000}
                rows={3}
                value={hypothesis}
                onChange={(e) => setHypothesis(e.target.value)}
                aria-describedby="hypothesis-help"
                placeholder="If I change the order identifier…"
              />
              <span className="field-note">
                A local draft, not an assessed answer.
              </span>
            </div>
            <div className="margin-note">
              <span className="small-label">KEEP THE CLAIM SMALL</span>
              <p>
                A different path may request another order. Whether the server
                returns it is a separate question.
              </p>
            </div>
          </>
        );
      case "inspect":
        return (
          <>
            {evidence(inspected, setInspected)}
            <div
              className={`annotation ${inspected === "identifier" ? "confirmed" : ""}`}
              role="status"
              aria-live="polite"
            >
              <span className="small-label">
                {inspected === "identifier"
                  ? "EVIDENCE IDENTIFIED"
                  : "INSPECT THE REQUEST"}
              </span>
              <h3>
                {inspected === "identifier"
                  ? "418 identifies the requested order."
                  : inspected
                    ? "That part has a different role."
                    : "Which value selects the order?"}
              </h3>
              <p>
                {inspected === "identifier"
                  ? "The bearer token supplies the session credential, while the path selects the resource the session is requesting. The server must decide whether that session may access it."
                  : inspected
                    ? `${partNotes[inspected].body} Look for the value that selects one order within the orders collection.`
                    : "Select the value directly. You can revise your selection as you reason through the request."}
              </p>
            </div>
          </>
        );
      case "explain":
        return (
          <>
            {evidence()}
            <form
              className="reasoning-field"
              onSubmit={(e) => {
                e.preventDefault();
                if (explanation.trim()) setReviewed(true);
              }}
            >
              <label htmlFor="explanation">
                What selects the order, and what supplies identity?
              </label>
              <p id="explanation-help">
                Use the path and Authorization header in your explanation.
              </p>
              <textarea
                id="explanation"
                maxLength={2000}
                rows={3}
                value={explanation}
                onChange={(e) => {
                  setExplanation(e.target.value);
                  setReviewed(false);
                }}
                aria-describedby="explanation-help"
                required
              />
              <button
                className="secondary-button"
                disabled={!explanation.trim()}
                type="submit"
              >
                Compare with the reasoning <span aria-hidden="true">→</span>
              </button>
            </form>
            {reviewed && (
              <div className="annotation confirmed" role="status">
                <span className="small-label">REASONING TO COMPARE</span>
                <h3>Two roles. One request.</h3>
                <p>
                  <code>/api/orders/418</code> selects order 418.{" "}
                  <code>Authorization</code> supplies a bearer credential that
                  the server can use to authenticate the session. Neither tells
                  us whether access is permitted.
                </p>
                <p className="field-note">
                  Compare this with your draft. Your explanation has not been
                  graded.
                </p>
              </div>
            )}
          </>
        );
      case "apply":
        return (
          <>
            {evidence(applyPart, (part) => {
              setApplyPart(part);
              setApplyFeedback("");
              setApplied(false);
            })}
            {applyPart && applyPart !== "identifier" && (
              <div className="annotation" role="status">
                <h3>Keep this part unchanged.</h3>
                <p>
                  {partNotes[applyPart].body} To request order 419 with the same
                  session, change the order identifier in the path.
                </p>
              </div>
            )}
            {applyPart === "identifier" && (
              <form
                className="apply-editor"
                onSubmit={(e) => {
                  e.preventDefault();
                  const success = order === "419";
                  setApplied(success);
                  setApplyFeedback(
                    success
                      ? "The path now selects order 419. The method, host, and session credential stay the same. You have prepared a test; you have not collected a response."
                      : "This task asks for order 419. Change only the identifier to 419; keep the same session.",
                  );
                }}
              >
                <label htmlFor="order">New order identifier</label>
                <div className="inline-editor">
                  <span>/api/orders/</span>
                  <input
                    id="order"
                    aria-invalid={Boolean(applyFeedback && !applied)}
                    aria-describedby={
                      applyFeedback ? "apply-feedback" : undefined
                    }
                    inputMode="numeric"
                    value={order}
                    maxLength={8}
                    onChange={(e) => {
                      setOrder(e.target.value);
                      setApplied(false);
                      setApplyFeedback("");
                    }}
                  />
                  <button className="secondary-button" type="submit">
                    Prepare request →
                  </button>
                </div>
              </form>
            )}
            <div role="status" aria-live="polite">
              {applyFeedback && (
                <p id="apply-feedback" className="apply-feedback">
                  {applyFeedback}
                </p>
              )}
            </div>
            {applied && (
              <>
                <HttpEvidence
                  label="Prepared request · not sent"
                  request={{ ...lesson.request, path: "/api/orders/419" }}
                />
                <div className="investigation-record">
                  <h3>The investigation record</h3>
                  <dl>
                    <div>
                      <dt>Observation</dt>
                      <dd>The order identifier appears in the request path.</dd>
                    </div>
                    <div>
                      <dt>Hypothesis</dt>
                      <dd>Changing it could request a different object.</dd>
                    </div>
                    <div>
                      <dt>Evidence</dt>
                      <dd>Request inspected. No server response collected.</dd>
                    </div>
                    <div>
                      <dt>Conclusion</dt>
                      <dd>
                        We know how to select another order. We cannot yet claim
                        that access is allowed—or that a vulnerability exists.
                      </dd>
                    </div>
                  </dl>
                </div>
              </>
            )}
          </>
        );
    }
  }
  return (
    <main id="main" className="page lesson-page" tabIndex={-1}>
      <Link className="back-link" href="/week-1">
        ← Week 1 · HTTP & Web Foundations
      </Link>
      <div className="lesson-heading">
        <div>
          <p className="eyebrow">
            LESSON_02 / 06 <span aria-hidden="true">·</span> ABOUT 12 MINUTES
          </p>
          <h1>{lesson.title}</h1>
        </div>
        <span className="lesson-heading-note">
          Read the evidence.
          <br />
          Then make the claim.
        </span>
      </div>
      <nav className="stage-navigation" aria-label="Lesson steps">
        <ol>
          {lesson.blocks.map((item, index) => (
            <li key={item.id}>
              <button
                disabled={index > furthest}
                aria-current={step === index ? "step" : undefined}
                onClick={() => navigate(index)}
              >
                <span className="stage-number">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {item.stage}
                <span className="stage-check" aria-hidden="true">
                  {index < furthest ? "✓" : ""}
                </span>
              </button>
            </li>
          ))}
        </ol>
      </nav>
      {finished ? (
        <section className="lesson-finished">
          <p className="eyebrow accent">CONCLUSION / PRACTICE COMPLETE</p>
          <h2 ref={heading} tabIndex={-1}>
            A request is a question.
            <br />
            The response is evidence.
          </h2>
          <p>
            You identified the resource selector and prepared a controlled
            change. The next investigative step would be to compare the server’s
            response and check whether access is authorized.
          </p>
          <p className="local-progress-note">
            This preview records practice only while the app stays open. It does
            not award a grade or save course completion.
          </p>
          <div className="finish-actions">
            <Link className="primary-button" href="/week-1">
              Return to Week 1 <span aria-hidden="true">→</span>
            </Link>
            <button
              className="text-button"
              onClick={() => {
                setFinished(false);
                navigate(0);
              }}
            >
              Revisit the evidence
            </button>
          </div>
          <div className="next-lesson-note">
            <span className="small-label">NEXT IN THE OUTLINE</span>
            <h3>Headers, cookies & sessions</h3>
            <p>
              How does a server recognize who is asking? This lesson is outside
              the prototype.
            </p>
          </div>
        </section>
      ) : (
        <div className="lesson-body">
          <section className="lesson-content" aria-labelledby="step-heading">
            <p className="eyebrow accent">
              {block.stage} <span aria-hidden="true">/</span>{" "}
              {String(step + 1).padStart(2, "0")}
            </p>
            <h2 id="step-heading" ref={heading} tabIndex={-1}>
              {block.title}
            </h2>
            <p className="step-description">{block.body}</p>
            {renderBlock()}
            <div className="step-actions">
              <button
                className="text-button"
                onClick={() => navigate(step - 1)}
                disabled={step === 0}
              >
                ← Previous
              </button>
              {step < lesson.blocks.length - 1 ? (
                <button
                  className="primary-button"
                  disabled={!canContinue}
                  onClick={() => navigate(step + 1)}
                >
                  Continue to {lesson.blocks[step + 1].stage.toLowerCase()}{" "}
                  <span aria-hidden="true">→</span>
                </button>
              ) : (
                <button
                  className="primary-button"
                  disabled={!applied}
                  onClick={() => {
                    markPracticed();
                    setFinished(true);
                    requestAnimationFrame(() => heading.current?.focus());
                  }}
                >
                  Finish practice <span aria-hidden="true">→</span>
                </button>
              )}
            </div>
          </section>
          <aside className="lesson-margin" aria-label="Investigation method">
            <div className="margin-line" />
            <span className="small-label">INVESTIGATION_METHOD</span>
            <p className="margin-quote">
              “What do I know,
              <br />
              and how do I know it?”
            </p>
            <p>Keep your observations separate from your assumptions.</p>
            <ol className="method-list">
              <li>
                <span>01</span> Observation
              </li>
              <li>
                <span>02</span> Hypothesis
              </li>
              <li>
                <span>03</span> Evidence
              </li>
              <li>
                <span>04</span> Conclusion
              </li>
            </ol>
          </aside>
        </div>
      )}
    </main>
  );
}
