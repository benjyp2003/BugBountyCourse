# BountyLab roadmap

Implementation note: a scoped frontend visual prototype now exists in `apps/web`. It does not implement the persisted learning milestone or any backend service. See [ADR 0003](docs/adrs/0003-frontend-visual-prototype.md) and [prototype notes](apps/web/README.md). The baseline below describes the production direction.

## Delivery rules

V1 implements Weeks 1–2 only. The 12-week curriculum is direction for content design, not a requirement to scaffold every future feature. Finish each milestone's behavior and validation before broadening scope. No production feature implementation is authorized in the current documentation phase.

## Milestone 0 — design baseline (current)

Deliver root/component agent guidance, product scope and acceptance criteria, repository boundaries, content and conceptual data models, lab isolation requirements, and ADRs. Exit when documents agree, links resolve, and future sessions can identify implemented versus reserved components.

## Milestone 1 — first persisted learning loop

After implementation is authorized:

1. Bootstrap Next.js/TypeScript, FastAPI, PostgreSQL, contracts, and trusted-stack Docker Compose. Establish migrations and readiness checks.
2. Implement anonymous learner sessions and object ownership.
3. Publish the structured HTTP request/response lesson plus a real introductory successor lesson.
4. Build reusable renderers for the blocks this lesson needs: explanation, HTTP examples, reasoning input, and multi-choice quiz.
5. Add deterministic server grading, retry-safe submissions, persisted progress, and next-lesson navigation.
6. Verify the full path, quiz failure/retry, browser ownership separation, reload/restart persistence, and accessibility.

Exit: every milestone 1 criterion in [PRODUCT_SPEC.md](PRODUCT_SPEC.md) passes. No AI, vulnerable runtime, XP, or reporting service is required to reach this exit.

## Milestone 2 — Weeks 1–2 course engine and exercises

Complete reviewed Week 1 HTTP/Burp and Week 2 access-control content. Extend the engine only for required blocks, including code inspection and evidence-led explanation. Add prerequisites and progress views with explicit content revision behavior. Include synthetic traffic exercises while lab isolation is being designed.

Exit: reviewed structured content for both weeks validates, deterministic exercises work, and progress remains consistent across lesson revisions.

## Milestone 3 — isolated Week 2 lab and reporting

Select and document a sandbox runtime after testing a representative lab. Implement the narrow lab-manager lifecycle: allowlisted template, provisioning, scoped access, TTL, reset, reconciliation, and cleanup. Enable a small synthetic IDOR/BOLA exercise only after all isolation checks pass. Add report submission and structured non-AI feedback.

Exit: one lab cannot access platform resources, orchestration credentials, or another lab; lifecycle checks pass; a learner can explain evidence and submit an owned reproducible report. Lab delivery stays blocked if containment cannot be demonstrated.

## Milestone 4 — bounded AI mentoring and V1 hardening

Implement the independent ai-mentor service with progressive hints, hypothesis/evidence review, and report feedback. Keep model usage optional and completion deterministic. Add budget/rate limits, redaction, prompt-injection checks, solution-reveal checks, and explicit retention behavior. Review responsive accessibility, session management, learner data deletion, and operational documentation.

Exit: all V1 criteria pass, including provider-unavailable behavior and lab security checks. A production rollout requires its own identity, abuse, and deployment review.

## Longer-term curriculum direction

This is a proposed sequence, not published V1 content:

| Week | Focus |
| --- | --- |
| 1 | HTTP, browser traffic, Burp fundamentals, evidence and hypotheses |
| 2 | Authentication versus authorization; IDOR, BOLA, and broken access control |
| 3 | Authentication flows, sessions, JWT trust boundaries |
| 4 | Injection vulnerabilities and root-cause reasoning |
| 5 | API and GraphQL security |
| 6 | Business logic and race conditions |
| 7 | Authorized reconnaissance and attack-surface mapping |
| 8 | AI-assisted source review with evidence verification |
| 9 | AI application security and prompt/tool/data boundaries |
| 10 | Real authorized bug bounty methodology and scope handling |
| 11 | Deep hunting, chained hypotheses, and validation |
| 12 | Professional reporting, remediation discussion, and capstone review |

## Deferred decisions

- Durable account login and migration from anonymous learner sessions before cross-device progress is promised.
- Lab runtime and ingress technology after a threat model and containment prototype.
- Model provider and retention policy before mentor requests are enabled.
- Production deployment target, secrets delivery, backup/restore, and monitoring before public launch.
- XP/skills progression rules only after core learning outcomes can be measured.

Record each material decision in an ADR when evidence exists. Do not resolve these by adding placeholder production services.
