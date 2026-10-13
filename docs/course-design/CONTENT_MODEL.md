# Initial course-content model

This document specifies a conceptual contract, not an implemented schema. The eventual schema belongs in `packages/contracts`; authored content belongs in `course`.

## Hierarchy and revisions

A course contains ordered weeks; a week contains ordered lesson references. A published course revision selects immutable lesson revisions. Stable IDs identify concepts across revisions; positive integer revisions identify the exact content presented. `schema_version` identifies the structure's compatibility, independently of a lesson's editorial revision.

| Entity | Initial fields |
| --- | --- |
| Course | `id`, `revision`, `schema_version`, `title`, `summary`, ordered `weeks` |
| Week | `id`, `number`, `title`, `objectives`, ordered lesson references |
| Lesson | `id`, `revision`, `schema_version`, `title`, `objectives`, `estimated_minutes`, prerequisite lesson IDs, ordered `blocks`, `completion_policy` |
| Block | stable `id`, discriminating `type`, learning-loop `stage`, type-specific fields, optional activity reference |
| Activity | stable `id`, lesson revision, response schema, requirement status, grading mode, attempt/retry policy |
| Private grading definition | activity ID, exact lesson revision, expected answers or rubric, feedback rules, pass threshold |

Use IDs such as `week-01`, `w01-http-request-response`, and `request-method`. IDs are unique in their documented scope. Block/activity IDs must be unique within a lesson revision. References cannot point to unpublished or missing lessons. Prerequisites must be acyclic.

## Block types

| Type | Learner-visible data | Submission/behavior |
| --- | --- | --- |
| `explanation` | heading, safe structured text or restricted Markdown | Read-only; no arbitrary HTML |
| `callout` | semantic kind, title, body | Information/warning without color-only meaning |
| `http_request` | label, method, path, headers, body, annotations | Inspect synthetic text; never automatically execute |
| `http_response` | label, status, headers, body, annotations | Inspect escaped response text |
| `question` | prompt, response constraints | Short response; optional or required submission |
| `multi_choice_challenge` | prompt, stable option IDs/text, single/multiple mode | Server-graded option IDs; answer key is private |
| `reasoning_challenge` | scenario, prompt, evidence references, response constraints | Save explanation; V1 completion based on required submission, not AI judgment |
| `code_inspection` | language, escaped code, prompt, line/evidence references | Read/annotate; never execute learner-supplied code |
| `ai_mentor_checkpoint` | mode, prompt, permitted hint ceiling | Optional advisory interaction; provider-independent fallback |
| `lab` | allowlisted template reference, objective, evidence checklist | Requires lab authorization/isolation; no embedded runtime secret |
| `report_exercise` | prompt, report fields, public rubric criteria | Save owned report; private feedback rules remain server-side |

Milestone 1 implements only blocks required by its lesson. Other types are specified here for direction, not a requirement to implement every renderer immediately. An unsupported type in a published lesson must fail publication with a clear error, rather than disappear silently.

## Completion and grading

`completion_policy` names required activity IDs and, where applicable, the assessment pass threshold. The first lesson requires a nonempty bounded reasoning response and a passing quiz. Presence-based reasoning completion is explicit; it does not claim that the reasoning is correct. Multi-choice answers are graded deterministically. Required non-quiz activities must not depend on model availability.

For milestone 1, allow retries with a new attempt ID. Repeated delivery of the same submission ID returns the existing outcome; it must not create another attempt. Incorrect answers return explanatory feedback after submission. Do not expose hidden grading details through public lesson payloads or initial web bundles.

Revisions create new immutable grading definitions. An in-progress learner resumes the revision on which they started if retained; archived revisions remain available to existing learners until an explicit migration policy is enacted. Completion does not disappear when a new revision is published. Historic attempts retain their original outcome. Selecting the current catalog does not silently regrade earlier records.

## Illustrative lesson shape

This abbreviated shape demonstrates the contract; it is not seed content or an implementation file:

```json
{
  "schema_version": "1",
  "id": "w01-http-request-response",
  "revision": 1,
  "title": "Read an HTTP conversation",
  "objectives": ["Separate request data from response data"],
  "estimated_minutes": 12,
  "prerequisites": [],
  "blocks": [
    {"id": "intro", "type": "explanation", "stage": "learn", "body": "A client sends a request; a server returns a response."},
    {"id": "request", "type": "http_request", "stage": "inspect", "method": "GET", "path": "/profile", "headers": [{"name": "Host", "value": "training.invalid"}], "body": ""},
    {"id": "response", "type": "http_response", "stage": "inspect", "status": 200, "headers": [], "body": "Synthetic profile response"},
    {"id": "reason", "type": "reasoning_challenge", "stage": "think", "activity_id": "explain-direction", "prompt": "Which side supplies the status code, and what evidence supports your answer?", "max_length": 2000},
    {"id": "quiz", "type": "multi_choice_challenge", "stage": "explain", "activity_id": "request-method", "mode": "single", "prompt": "Which request method is shown?", "options": [{"id": "get", "text": "GET"}, {"id": "post", "text": "POST"}]}
  ],
  "completion_policy": {"required_activity_ids": ["explain-direction", "request-method"], "quiz_pass_percent": 100}
}
```

## Publishing validation

Validate schema versions, unique IDs, references, prerequisite order, supported renderers, required activities, bounded response sizes, option IDs, private grading matches, and valid thresholds. Reject missing grading keys or accidental private fields in the public projection. Escape snippets and restrict Markdown link protocols; never interpret course text as application code.

`course` will have separate `public` and `private` authoring paths. Only platform-api's content loader may access the private path. Web consumes public API projections rather than importing the course tree. CI will verify this separation, schema compatibility, and representative rendering once implemented.
