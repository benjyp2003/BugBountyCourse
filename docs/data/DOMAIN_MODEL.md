# Conceptual platform database model

PostgreSQL is the primary store, owned by platform-api. This is a conceptual model; table names, columns, and migrations will be finalized during implementation.

## Milestone 1 entities

| Entity | Meaning and relationships | Important constraints |
| --- | --- | --- |
| Learner | Stable internal identity; initially anonymous | Server-assigned identity; no client-chosen ownership |
| LearnerSession | Expiring credential reference belonging to one learner | Unique token digest; revocation/expiry; raw opaque token is never stored |
| CourseRevision | Published catalog metadata and immutable bundle reference/hash | Unique course ID + revision; retain referenced versions |
| LessonRevision | Published lesson metadata and private/public bundle references | Unique lesson ID + revision; tied to published catalog references |
| LessonProgress | Learner's state for an exact lesson revision | Unique learner + lesson ID + revision; `not_started`, `in_progress`, `completed`; completion timestamp only after policy passes |
| ActivitySubmission | Learner response for a required activity in a lesson revision | Owned by learner; bounded typed response; submission idempotency key scoped to learner and operation |
| QuizAttempt | Submitted deterministic assessment and outcome | Exact grading revision, server-computed score/pass, immutable final outcome; retry creates a new attempt |

Course text remains authored in versioned files. The database stores published references/metadata and learner state, not a second independently editable content source. Public and private content projections must remain separate even if metadata references both.

## Relationships and transaction boundaries

A learner has sessions, progress records, submissions, and quiz attempts. Attempts and submissions reference exact lesson/activity revisions. Platform-api resolves identity from the session, verifies that content is published and available, validates the response, grades deterministically, and stores the result. When required work passes, it updates progress in the same transaction.

Idempotency covers the full submission outcome, not merely one insert. Concurrent retries must resolve through unique constraints and transactional handling. Reusing an idempotency key with a different payload is an explicit conflict. Completion cannot be reverted by a late failing attempt. Submitted attempts retain their feedback/grade so a replay can return the same result.

The current catalog selects lessons for new starts. Existing progress stays attached to its immutable revision; returning learners resume it. A completed stable lesson satisfies progression unless an explicit curriculum migration specifies otherwise. Do not cascade-delete content metadata referenced by learner records.

## V1 expansion entities

| Entity | Purpose | Boundary |
| --- | --- | --- |
| Report | Learner-owned evidence, reproduction, root cause, impact, remediation, and revision history as needed | Platform-api; synthetic lab evidence only by default |
| MentorInteraction | Optional selected prompt/feedback record, mode and hint level | Platform-api persistence under explicit consent/retention policy; model cannot write progress |
| LabSessionReference | Learner, template revision, opaque runtime session ID, observed status/expiry | Platform ownership reference; lab-manager is lifecycle authority |

Future, outside milestone 1: account identity linked to a learner, skill definitions/observations, and an XP ledger. If XP is introduced, use immutable award events with unique award causes to prevent duplicate rewards. Do not add tables for unused features merely because the domains appear in the roadmap.

## Authorization, lifecycle, and privacy

Every read/write of learner-owned progress, submissions, reports, and lab references checks ownership. Public content access does not grant access to private grading material or another learner's work. Session cookies require secure attributes, CSRF/origin checks on writes, and expiry/revocation handling. A database ID is not an authorization mechanism.

Use server timestamps and bounded payloads. Avoid raw credentials and unnecessary HTTP headers in stored evidence. Logs should carry correlation IDs and safe operational metadata rather than full submissions. Define actual session lifetime, learner retention, deletion, and backup behavior before public launch. Database restart with the retained local volume preserves records; deleting that volume intentionally resets development state.

The anonymous session design supports persistence within a browser session's validity. It does not offer password recovery or cross-device progress. Account linking needs a later explicit migration and access policy.
