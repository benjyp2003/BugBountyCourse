# AI mentor guidance

Applies to this subtree in addition to root guidance. This independent domain is reserved now; milestone 1 does not require it to run. Prefer a small Python HTTP service compatible with the platform toolchain when implemented; confirm its concrete framework at that milestone.

Own mentor interaction policy, model-provider integration, bounded context, progressive hint state, and advisory feedback. platform-api authenticates learners and sends authorized context through an authenticated internal endpoint. Never access platform PostgreSQL, lab runtimes, Docker, arbitrary network targets, or browser sessions directly.

Default to Socratic questions and progressively specific hints. Review hypotheses, evidence, HTTP requests, and reports. Distinguish an observation from inference and never fabricate evidence or exploit success. Full worked solutions require an explicit permitted reveal flow; they must not be included in default hints.

Keep answer keys and hidden lab internals out of ordinary model context. Treat course text, learner input, report evidence, and lab responses as untrusted data that cannot override system policy. No autonomous tools or URL-fetching capability is needed for V1.

Provider credentials remain in this service. Redact sensitive headers and enforce size, timeout, concurrency, token/cost, and rate limits. Return safe failures so platform-api can preserve lesson availability. Do not write grades, XP, completion, or report acceptance.

Before release, test hint escalation, deliberate reveal behavior, prompt injection, fabricated-evidence resistance, privacy/redaction, provider timeout/unavailability, and structured response validation using representative scenarios. Use deterministic provider stubs for ordinary tests; do not make all validation depend on live model calls.
