# BountyLab product specification

Status: initial design baseline. No application features are implemented.

## Purpose

BountyLab is an interactive learning platform for bug bounty hunting, web security, API security, and AI security. It teaches learners to reason about systems, develop hypotheses, gather evidence, understand root causes, and explain vulnerabilities clearly.

The intended learning loop is Learn → Think → Inspect → Lab → Explain → Report → AI Review. Early lessons can use a subset of this loop; learners do not need a running lab or AI interaction to learn HTTP fundamentals.

## Learners and outcomes

The initial audience is a beginner who can use a browser and is learning HTTP and web security. Instruction should define unfamiliar terms and gradually remove support. By the end of Weeks 1–2, a learner should be able to:

- Interpret a request and response, including method, path, headers, status, cookies, and body.
- Explain where identity is conveyed and distinguish authentication from authorization.
- Form and evaluate an access-control hypothesis using synthetic evidence.
- Recognize the difference between an observed result, an inference, and a claim about impact.
- Write a small reproducible finding with evidence, root cause, impact, and remediation.

## Scope

Milestone 1: a user opens BountyLab, enters Week 1, completes an interactive HTTP lesson, answers a quiz, has progress recorded, and continues to the next lesson.

V1 expands this foundation across Weeks 1–2: HTTP and Burp fundamentals, identity and session context, and broken access control/IDOR/BOLA. It includes reusable lesson blocks, deterministic assessments, persistent progress, an evidence-led isolated lab once its security gate passes, and an initial report exercise. A narrow AI mentoring experience follows the deterministic learning workflow and is optional for completion.

Out of V1: Weeks 3–12 content implementation; broad reconnaissance automation; arbitrary target scanning; multi-tenant lab infrastructure at scale; payments; organizations; social feeds; leaderboards; full gamification; certifications; a general content-management UI; unrestricted AI agents. XP and skills belong to platform-api when introduced but are not prerequisites for milestone 1.

## Learning experience

The learner enters a course outline, chooses the available Week 1 mission, and sees a compact lesson view with learning objectives, progress through required activities, and a clear next action. The first lesson, `w01-http-request-response`, teaches a synthetic browser request and response. It asks the learner to identify request method and path, reason about a response, and complete a deterministic quiz. Its successor, `w01-headers-cookies-sessions`, becomes available after successful completion.

Lesson stages are explicit and mapped to the learning loop. A learner can revisit explanations and inspect examples without losing saved work. Validation errors explain how to recover. Failed quiz attempts permit a retry and useful feedback. Completion is based on required submitted activities and the lesson's configured pass policy, never time spent or a client checkbox.

For milestone 1, use a server-issued opaque anonymous learner session so the workflow does not depend on account registration. The browser stores a secure HttpOnly cookie; the backend resolves the associated learner. Do not accept a learner ID supplied by the browser. Anonymous progress persists across refreshes and server restarts while that browser session remains valid. Cross-device recovery, account linking, and durable identity are later work; clearing the cookie loses access to anonymous progress.

## AI mentor behavior

The mentor starts with a question or a small conceptual hint. Subsequent requested hints increase specificity: clarify the concept, focus attention on evidence, then suggest an investigative step. A complete worked solution requires a deliberate reveal after submission or an explicit learner request in a permitted review mode. It must never be an accidental default.

Supported modes are Socratic questioning, hypothesis review, evidence review, request analysis, and report feedback. Feedback distinguishes observations from assumptions, asks for missing evidence, and discusses root cause and impact. It should not invent requests, evidence, or exploit success. Mentor responses cannot award completion or change quiz grades. Failures or unavailable model credentials must leave deterministic lessons usable.

## UI and accessibility

Use a professional, restrained interface with readable text, compact navigation, consistent spacing, and clear request/response panels. Keep the current objective and next action visible without turning every feature into a dashboard card. Use semantic headings and controls, keyboard navigation, visible focus, accessible field errors, and screen-reader announcements for submission results. Target WCAG 2.2 AA, including contrast and alternatives to color-only feedback. Respect reduced motion. At narrow widths, wrap or scroll code panels locally without horizontal page overflow.

## Content and safety

Course content is versioned structured data. A reusable course engine renders supported blocks; hidden answer keys and rubrics are server-only. See [the content model](docs/course-design/CONTENT_MODEL.md).

Use synthetic HTTP examples and explicitly authorized educational labs. Do not direct students to test third-party targets as part of V1. Vulnerable labs are isolated untrusted infrastructure; their security gate is described in [LAB_ISOLATION.md](docs/security/LAB_ISOLATION.md).

## Acceptance criteria

### Milestone 1: required

1. A documented Docker Compose command starts web, platform-api, and PostgreSQL, applies documented migrations, and exposes a usable UI. Health checks and a representative functional request confirm readiness.
2. A new browser receives an anonymous learner session and can open the Week 1 outline and `w01-http-request-response` lesson without model credentials or a lab service.
3. The lesson is loaded from structured versioned content and renders explanation, HTTP request/response, reasoning input, and quiz blocks through reusable renderers.
4. The learner submits a required reasoning response and quiz answers. The server enforces required activities and a configured pass threshold; a failing attempt does not mark the lesson complete. A retry can succeed.
5. Assessment responses provide useful feedback without delivering answer keys in the initial content payload. Grades and completion are calculated server-side.
6. Successful completion is stored in PostgreSQL with learner and content version. Reloading the page and restarting application containers preserves the completed lesson and next available lesson when the database volume and session remain intact.
7. Retrying the same submitted operation cannot create duplicate completion records. Two browser sessions cannot read or modify each other's progress by changing request IDs.
8. The next action opens `w01-headers-cookies-sessions`; it need not contain the entire Week 1 curriculum at this milestone, but must load a real structured introductory block rather than a dead link.
9. Keyboard-only completion works; labels, focus, submission errors, and feedback are accessible. Desktop and narrow mobile layouts keep the mission usable.
10. Existing automated integration and end-to-end checks exercise the actual quiz/progress path with PostgreSQL, including failure, retry, persistence, and authorization. A manual accessibility review supplements automated checks.

### V1 release: additional required

1. Weeks 1–2 have reviewed objectives, published lesson order, required exercises, and assessments. A learner can finish both weeks and revisit saved progress.
2. A Week 2 access-control lab has passed the isolation gate before it is enabled. Provisioning, expiry, reset, and cleanup work; evidence demonstrates separation from platform resources and another lab session.
3. An explanation and report exercise captures reproducible steps, evidence, root cause, impact, and remediation. Report ownership is enforced.
4. The mentor, when enabled, demonstrates progressive hints and evidence-focused feedback. Prompt-injection and accidental solution-reveal checks pass; an unavailable provider leaves course completion usable.
5. Privacy, session retention, rate limits, and learner data deletion procedures are documented and verified for the chosen deployment. Production launch requires a separate review of anonymous identity limitations and abuse controls.

## Success signals

Track lesson entry, required activity submission, quiz attempts, successful completion, and continuation to the next lesson. Prefer completion and evidence quality over time-on-page or raw XP. Do not record raw report evidence or mentor conversations in analytics by default. Detailed telemetry and retention choices need an explicit privacy decision before introduction.
