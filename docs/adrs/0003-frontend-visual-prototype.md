# ADR 0003: Isolate a frontend visual and learning prototype

Status: accepted for the explicitly authorized frontend prototype only.

## Context

The current task authorizes the shell, dashboard, Week 1 module, and one complete
interactive lesson to validate the visual identity and learning experience. It
explicitly excludes the backend and the rest of the frontend. The persisted
milestone in the initial architecture is not the scope of this study.

## Decision

Use Next.js and TypeScript in `apps/web`, with typed synthetic public tutorial
fixtures and a small discriminated-block renderer. Keep mock practice state in
memory, clearly identify the preview, and do not treat it as authoritative grades
or course completion. Include public instructional explanations and interactive
request annotations; do not import private course keys or simulate an assessment
API. No grading of free text is claimed.

Implement only the interactions and presentation required by this vertical slice.
Do not scaffold services, shared component systems, or generated API transport
types without a platform OpenAPI source. Do not send HTTP examples to a server.

## Consequences

The visual and keyboard learning experience can be reviewed independently. Mock
state resets on refresh. The next lesson is outline content, not an implemented
learning destination. The prototype cannot satisfy persisted milestone acceptance
criteria and is not production-ready course delivery.

ADRs 0001 and 0002 remain the production direction. Production assessment keys,
grading, authorization, completion, and progress will be server-owned; prototype
feedback and progress must be replaced with those contracts before implementing
that milestone. This decision grants no broader implementation scope.
