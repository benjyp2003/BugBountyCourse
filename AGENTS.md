# BountyLab repository guidance

## Mission and current phase

BountyLab teaches security reasoning through Learn → Think → Inspect → Lab → Explain → Report → AI Review. Learners form hypotheses, collect evidence, explain root causes, and practice professional reporting. Payload recall is not the learning goal.

The current phase is documentation and architecture only. Do not implement application features, install frameworks, or introduce runtime scaffolding unless the user explicitly authorizes the next implementation milestone. The first implementation milestone is a working Week 1 HTTP lesson, quiz, persisted progress, and navigation to the next lesson. V1 covers Weeks 1–2 only.

Read [PRODUCT_SPEC.md](PRODUCT_SPEC.md), [ARCHITECTURE.md](ARCHITECTURE.md), [ROADMAP.md](ROADMAP.md), and applicable component `AGENTS.md` files before changing a component. Read relevant ADRs under `docs/adrs/`; respect accepted decisions until an explicit replacement ADR documents a change.

## Architecture constraints

- Use this monorepo and its existing checkout. Cloud tasks are already isolated; do not create a worktree unless requested.
- `apps/web`: Next.js and TypeScript; reusable data-driven course engine.
- `apps/platform-api`: FastAPI modular application owning users, published course delivery, progress, assessments, XP, skills, and reports.
- PostgreSQL is the primary database, owned by platform-api. Only platform-api and its migration tooling receive platform database credentials.
- `apps/ai-mentor` is an independent AI domain; `apps/lab-manager` is an independent isolation/orchestration domain. Their directories are reserved now, not a requirement to deploy them for milestone 1.
- Do not introduce one service per platform domain, a message broker, service mesh, or generic plugin framework without demonstrated need and an ADR.
- Local development will use Docker Compose. Do not fabricate a working Compose setup during the documentation phase.
- Labs are untrusted infrastructure. They must not reach the platform database, credentials, host Docker socket, host filesystem, control plane, or other labs. See `docs/security/LAB_ISOLATION.md` before any lab work. A Compose container alone is not evidence of adequate isolation.

## Product and UI constraints

Optimize around the current mission: learning objective, lesson stage, evidence, submission, feedback, and next action. Use restrained typography, clear hierarchy, semantic controls, useful density, and responsive layouts. No oversized marketing hero, excessive gradients, glowing cards, emoji navigation, decorative text highlighting, or generic dashboard clutter.

Use structured course content and explicit block renderers. Do not create a separate hard-coded React page for each lesson, execute arbitrary content code, or render unsanitized HTML. Treat learner text, course imports, HTTP examples, lab responses, and model output as untrusted data.

The mentor defaults to progressive hints and Socratic questions. Do not expose solutions, answer keys, grading rubrics, or hidden lab internals to the browser or model unless a deliberate authorized workflow requires them. AI is advisory and never the authority for progress or quiz grades.

## Engineering expectations once implementation is authorized

- Keep platform domain rules in platform-api modules; web renders and orchestrates UI. Never trust client-provided completion, scores, user identity, XP, or authorization decisions.
- Use explicit versioned API and content contracts. Generate TypeScript types from the platform OpenAPI schema rather than maintaining independent backend/frontend DTO copies.
- Keep migrations reviewable and forward-compatible. Document data ownership and rollback/restore implications for risky changes.
- Make writes idempotent where retries are expected. Use database constraints and transactions for correctness, including progress and assessment completion.
- Validate at trust boundaries. Apply object-level authorization to every learner-owned record. Keep solutions and grading material in server-only paths.
- Do not add dependencies or abstractions for hypothetical future requirements. Prefer small modules and clear interfaces.
- Never commit secrets, real target credentials, personal data, or production vulnerability evidence. Use synthetic examples and explicitly authorized targets.
- Preserve unrelated user changes. Do not reset, overwrite, or clean the repository broadly.

## Validation and communication

Documentation changes need consistency and link checks, not invented application tests. Once code exists, run checks appropriate to the affected workflow and confirm that tests actually execute. Add meaningful tests for behavior and trust boundaries; do not create trivial tests that mirror implementation.

Report what changed, what was verified, and concrete limitations. Do not claim a service runs, a security boundary holds, or a workflow passes without runtime evidence. Update documentation and ADRs when implementation changes a documented decision. Keep commands and configuration reproducible and free of embedded credentials.
