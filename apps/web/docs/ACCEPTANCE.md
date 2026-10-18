# Frontend acceptance and implementation handoff

These are future verification gates, not claims that tests or features exist. Frontend checks supplement, and do not replace, [product acceptance](../../../PRODUCT_SPEC.md), [roadmap gates](../../../ROADMAP.md), or [lab containment verification](../../../docs/security/LAB_ISOLATION.md).

## Documentation baseline — this task

- `apps/web/AGENTS.md` points to a self-contained frontend reading path and describes product intent, phase, stack, constraints, and validation.
- Design principles, dark-first tokens, typography, spacing, layouts, responsive behavior, and accessibility have explicit decisions.
- Navigation and information architecture specify the five destinations, focused lesson mode, contextual mentor, and anonymous identity limits.
- Dashboard, Learn, Module, Lesson, Lab, Skills, and Reports each have low-fidelity wireframes, primary actions, data priority, non-happy-path states, and mobile behavior.
- Architecture defines component ownership, server/client boundaries, shared primitives/contracts, renderer pipeline, block proposal, and state ownership/transitions.
- M1, V1, and deferred behavior are distinguishable. No documentation implies that a service, integration, schema, or runtime test exists.
- Relative Markdown links resolve, file changes stay in frontend documentation except a discoverability link in the root docs index, and existing ADRs remain consistent.

## Milestone 1 — first persisted learning loop

| ID | Observable acceptance criterion | Evidence when implemented |
| --- | --- | --- |
| M1-01 | New anonymous learner can enter Week 1 and open `w01-http-request-response` without an account, lab, or model credentials | Browser end-to-end path against real platform-api |
| M1-02 | Lesson comes from versioned public content; explanation, HTTP request/response, reasoning, and multi-choice use reusable renderers | Content fixture/schema validation and rendered lesson inspection |
| M1-03 | Reasoning and quiz submissions are required by server policy; reading Continue cannot award completion | Failed/incomplete and successful submission scenarios |
| M1-04 | Quiz feedback explains evidence; failed attempt permits retry; required reasoning says Saved rather than claiming correctness | Actual server feedback shown and keyboard-retry path |
| M1-05 | Duplicate click/replayed operation cannot produce duplicate outcomes; uncertain network response preserves draft and safely reconciles | Integration test with lost response after commit; same ID/payload replay |
| M1-06 | Completion and next availability survive reload and service restart with session/database retained | Integration/end-to-end check with real PostgreSQL, not localStorage or a mock |
| M1-07 | Next lesson opens `w01-headers-cookies-sessions` with a real structured introductory block | End-to-end continuation, no dead link |
| M1-08 | Private answers, rubrics, credentials, and owner-ID authority never enter browser assets/public payloads | Build/network inspection and negative serialization/ownership checks |
| M1-09 | 320 px/mobile and desktop keep content readable; code scrolls locally; keyboard-only learner completes the whole flow | Manual keyboard and responsive review plus automated accessibility scan |
| M1-10 | Load failure, field errors, unknown required block, stale progress, and expired session show distinct recovery states | Focused component/integration scenarios without fabricated success |

Do not broaden M1 to lab/mentor/skill engines. The first successor need not contain a complete course, but it must be a real usable destination.

## V1 frontend release — additional criteria

| ID | Observable acceptance criterion |
| --- | --- |
| V1-01 | Dashboard's first useful region is the current mission and one next action. New learners get Start; completed learners get Review; no fabricated statistics appear. |
| V1-02 | Learn and Module show reviewed Weeks 1–2, counts/durations from content, progress and availability from server, and labeled locked/available/active/complete states. Future curriculum is clearly unreleased. |
| V1-03 | All published blocks for supported V1 content render; publication rejects unsupported capabilities. Runtime unknown/invalid required content blocks progression without crashing the shell. |
| V1-04 | HTTP preserves method, path, ordered headers, and body; copy reproduces displayed raw synthetic text without annotation artifacts. Comparison labels both accounts and provides non-color/textual differences on wide and stacked layouts. |
| V1-05 | Required work and drafts remain associated with exact lesson revision. Resume uses retained revision; new publication does not erase historic completion or silently move unsent answers. |
| V1-06 | Lab UI is enabled only after containment gate evidence exists. It represents provisioning, ready/running, failure, reset, expiry and cleanup accurately; external launch is clearly labeled. Reset confirmation and saved-note retention are verified. |
| V1-07 | Report exercise captures title, asset, summary/root cause, prerequisites, reproduction steps, expected/actual results, impact, evidence, and remediation. Real save, failure, ownership, and conflict behavior is clear; submitted feedback is usable without AI. |
| V1-08 | Contextual mentor remains closed initially, does not dominate or gate learning, shows only requested hint level, and requires a permitted explicit solution reveal. Provider failure leaves deterministic completion available. |
| V1-09 | Skills shows truthful unassessed/not-started/future states. If mastery labels are enabled, they have server-owned policy and inspectable evidence; no client-inferred mastery from completion or XP. |
| V1-10 | All seven screen families have distinct loading/empty/error states. Errors preserve inputs, retries are scoped, and missing server data never appears as zero or success. |
| V1-11 | Dark is the default and uses semantic tokens; any future light theme is independently validated; every interactive, error, syntax, selected, and focus state meets contrast requirements. No forbidden decorative aesthetic appears. |
| V1-12 | Keyboard, screen reader, zoom/reflow, touch, and reduced motion checks pass across learning, reporting, dialogs, hints, and available lab controls. Mobile explicitly supports appropriate work without simulating a desktop interception suite. |
| V1-13 | Anonymous session limitations are stated where relevant. No cross-device recovery promise, JavaScript session token storage, private data in shared caches, or fake frontend persistence. |

## Validation matrix for implementation

| Area | Representative checks |
| --- | --- |
| Viewports | 320, 390, 768, 1024, 1440 CSS px; portrait/landscape and open virtual keyboard |
| Themes | Dark default with light and dark OS preferences; focus/error/syntax colors; independent checks if light theme is added |
| Accessibility | Keyboard only, screen-reader headings/labels/results, dialog focus return, 200% text zoom, 400% reflow, reduced motion, forced colors |
| Content | Short/long prose; long paths and JSON; duplicate headers; empty body; malformed/unknown block; old revision; missing reference |
| Learners | New, partial, complete, locked prerequisite, session expired; two separate sessions cannot access each other's work |
| Requests | Slow load, failed load, validation error, rejected quiz, duplicate submit, timeout after commit, server conflict, failed refresh after acknowledgment |
| Optional systems | Mentor unavailable/rate-limited; lab gate closed/provisioning/reset/expired; unassessed skills; report upload capability absent |

Use meaningful renderer/schema checks, real API integration tests, and one representative end-to-end persisted flow. Do not test only mock success or duplicate implementation details. Automated accessibility checks cannot certify reading order, useful feedback, or focus behavior; document manual results. Browser support policy should be established at implementation; at minimum exercise current Chromium, Firefox, and WebKit paths before release.

## Handoff checklist

Before coding, confirm authorized milestone and read local guidance. Reconcile canonical schemas with the block proposal; generate API types rather than copying these illustrative shapes. Build only primitives required by the first lesson. Keep realistic fixtures behind the same typed adapter with no production fallback to mock success. Record actual validation evidence and unresolved limits when completing each milestone. Use a replacement ADR only if changing an accepted repository decision, not merely to restate these frontend conventions.
