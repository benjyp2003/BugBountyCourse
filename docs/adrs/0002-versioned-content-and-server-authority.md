# ADR 0002: Use versioned structured content and server-authoritative completion

Status: accepted

## Context

The course will grow to many lessons with recurring interaction patterns. Hard-coded pages would duplicate rendering and assessment behavior. Content revisions could otherwise change historic results unexpectedly. The browser and AI outputs cannot be trusted to determine grades or progress.

## Decision

Author lessons as versioned structured data with discriminated block types. Validate content before publishing and expose only learner-safe projections through platform-api. Keep answer keys and private rubrics in server-only content paths; never bundle them into web assets.

Use immutable published lesson revisions. Save assessment attempts and progress against the revision used. Platform-api performs deterministic quiz grading and transactional completion; the AI mentor provides advisory feedback only.

For milestone 1, use an opaque anonymous learner session stored in an HttpOnly cookie, resolved server-side. This supports a real persistent workflow without prematurely building account registration. It is not a promise of cross-device or permanent anonymous access.

## Alternatives

- Hard-coded lesson React pages: rejected because the course needs reusable interactions and content review independent of UI code.
- Client-side answer keys and completion: rejected because learner-controlled inputs could forge grades and expose solutions.
- AI-scored required completion: rejected because provider availability and nondeterministic feedback would govern core progression.
- Full authoring CMS and account platform first: deferred because neither is necessary to validate milestone 1.

## Consequences

Schema evolution and publishing require validation. Public and private content must remain explicitly separated. Old revisions must stay resolvable while records reference them; progress migration requires a deliberate policy rather than automatic regrading.

Anonymous sessions need expiration, token hashing, CSRF defenses, and ownership checks. Clearing or losing the browser cookie loses access to the associated progress until a later account/recovery feature exists.

## Revisit when

Authors need a publishing UI, a new block type is required by reviewed curriculum, or durable identity/account linking becomes a product requirement. Record the effect on historic attempts and learner access before changing these rules.
