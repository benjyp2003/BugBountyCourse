# Platform API guidance

Applies to this subtree in addition to root guidance. Use FastAPI and PostgreSQL once implementation is authorized.

This is the modular application backend for learner identity, course publication/delivery, assessments, progress, XP, skills, and reports. Create domain modules only as needed. Keep related state changes transactional rather than extracting services for each domain.

Own database access and migrations here. ai-mentor and lab-manager must not share platform credentials or query platform tables. Follow docs/data/DOMAIN_MODEL.md for ownership, immutable content revisions, and retry-safe completion.

Resolve the learner from an opaque server-issued session cookie. Store only its digest, enforce expiry and ownership, and protect cookie-authenticated mutations against CSRF. Never trust client learner IDs, scores, completion status, or report ownership. Validate object authorization even when identifiers are difficult to guess.

Load and validate structured course content. Keep private grading material server-only and produce explicit public response schemas. Grade quizzes deterministically. Persist submissions, attempts, and resulting progress in a transaction; repeated operation IDs must return the original outcome or a payload-conflict error.

Generate OpenAPI contracts for the web client. Use bounded response schemas, safe errors, and correlation IDs. Redact sensitive headers and learner evidence in logs. AI feedback is advisory; provider failures must not block deterministic completion. Authorize lab session requests without executing lab workloads here.

Once code exists, use integration tests against PostgreSQL for migrations, session ownership, failure/retry behavior, concurrent duplicate submissions, immutable revision outcomes, and completion persistence. SQLite-only tests do not establish PostgreSQL correctness.
