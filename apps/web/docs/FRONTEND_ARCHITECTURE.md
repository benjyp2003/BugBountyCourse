# Frontend architecture, contracts, and state

Status: architecture proposal, not implemented code or a finalized schema. Follow [ADR 0002](../../../docs/adrs/0002-versioned-content-and-server-authority.md) and the [content model](../../../docs/course-design/CONTENT_MODEL.md). Type examples below document public data only. Implement canonical schemas and generated types in `packages/contracts` when authorized.

## App Router boundaries

Use Next.js App Router, TypeScript strict checking, Tailwind semantic token mappings, and native HTML controls where practical. Do not select dependencies beyond these requirements before a demonstrated need.

Proposed structure; create files only as implemented behavior needs them:

```text
apps/web/
├── app/
│   ├── layout.tsx                 # font/theme and shared landmarks
│   ├── (platform)/layout.tsx      # AppShell + primary navigation
│   ├── (platform)/page.tsx        # Dashboard
│   ├── (platform)/learn/          # outline and module routes
│   ├── (platform)/labs/           # list and workspace route
│   ├── (platform)/skills/
│   ├── (platform)/reports/        # list only
│   └── (focus)/                   # lesson and report editor, no sidebar
├── components/
│   ├── layout/                   # AppShell, FocusShell, Navigation
│   ├── course/                   # MissionSummary, ModuleProgression
│   ├── lesson/                   # LessonRenderer, block adapters, questions
│   ├── evidence/                 # HttpRequest, HttpResponse, RequestComparison
│   ├── lab/                      # objective, status, account reveal, notes
│   ├── mentor/                   # contextual entry, drawer, hint progression
│   ├── skills/                   # evidence-backed rows
│   └── reports/                  # fields, evidence references, review comments
├── lib/
│   ├── api/                      # typed fixed-origin client + error mapping
│   ├── content/                  # safe normalization, renderer capability checks
│   └── view-models/              # explicit mappings only when needed
├── hooks/                        # shared interaction hooks after actual reuse
├── types/                        # UI-only types, never duplicated API DTOs
├── styles/                       # semantic tokens, typography, global rules
└── docs/
packages/ui/                      # generic primitives; no domain or fetching
packages/contracts/               # content JSON Schema + generated API TS
```

Route groups do not affect URLs. Put the lesson route path specified in SCREENS under `(focus)` and the module route under `(platform)` without declaring duplicate route leaves. Report details similarly use `(focus)`. Both share the same root layout/theme so navigation does not reset preferences.

Server components load initial public content and learner snapshots through platform-api, compose shells, and render static explanation/evidence where possible. Client boundaries own answer forms, step navigation, copy/select controls, drawers, report drafts, and submission status. Pass only serializable public data across the boundary. A small lesson session coordinator can be a client component with server-rendered reading content passed as children; do not require the entire navigation shell to hydrate for a textarea.

Use route-level `loading`, `error`, and `not-found` boundaries as appropriate. A block-level error boundary isolates an optional interaction failure without hiding the rest of a lesson. Personalized server reads are request-scoped and not stored in shared/static caches. Public content may be cached by immutable ID + revision + schema version only after confirming no learner data is mixed in. Revalidate learner snapshots after acknowledged writes; never let a cache leak one learner's progress to another.

Same-origin `/api` forwards only to a configured platform-api origin with fixed paths. Session bootstrap must deliver its HttpOnly cookie to the browser through that boundary, not through a server-only fetch whose Set-Cookie is lost. Server rendering forwards the incoming session only to the trusted API. Cookie-authenticated writes follow platform CSRF/origin policy. No secrets or DB client in web, even in server components. No direct provider/lab-control calls from the browser.

## Component hierarchy and ownership

```text
RootLayout
  AppShell / FocusShell / LabWorkspaceShell
    MissionSummary / CourseOutline / ModuleProgression
    LessonSession (revision, drafts, pending operations)
      LessonHeader + StageOutline
      LessonRenderer (public ordered blocks)
        ExplanationBlock / CalloutBlock
        HttpRequestBlock → HttpRequest → EvidenceText
        HttpResponseBlock → HttpResponse → EvidenceText
        QuestionBlock / ReasoningChallenge / MultiChoiceChallenge
        CodeInspection / RequestComparison / IdentifyParameter [later]
        MentorCheckpoint → MentorDrawer → HintProgression [later]
        LabLaunchBlock [later]
        ReportExercise [later]
      LessonNavigation + CompletionFeedback
    LabWorkspace → Objective + Status + Accounts + Notes + Submission
    ReportEditor → StructuredFields + Evidence + ReviewComments
```

Generic `Button`, `Link`, `Field`, `Textarea`, `RadioGroup`, `Checkbox`, `Dialog`, `Drawer`, `Progress`, `Status`, `Skeleton`, and `ErrorSummary` belong in `packages/ui` when needed. They receive props and callbacks, not learner IDs or fetch clients. Domain adapters connect a block to lesson drafts and activity submissions. Evidence views format HTTP/code but do not grade selections. Page shells coordinate navigation, fetches, and refresh. No generic event bus or component factory framework.

## Public contract philosophy

API models originate in platform-api OpenAPI; generated TS is consumed from `packages/contracts`. Course schema lives there as versioned JSON Schema. Prefer generated transport types plus a tiny mapper over copying DTO definitions into web. UI view models may format display labels, but must not compute grades, prerequisites, or mastery. Mocks implement the same typed boundary and error scenarios in memory; they are not a production persistence subsystem.

| Contract | Minimum conceptual public fields / role |
| --- | --- |
| `CourseSummary` | stable ID, revision, title, summary, ordered week references |
| `ModuleSummary` | presentation of Week: ID/number, title, description, duration, lesson/lab counts, server progress and availability |
| `Lesson` | ID, immutable revision, schema version, title/objectives, duration, prerequisites, ordered public blocks, public completion policy |
| `UserProgress` | lesson ID + revision, not_started/in_progress/completed, required activity statuses, acknowledged completion, next available reference |
| `SkillProgress` | skill/subskill ID, optional policy-backed level, evidence references, assessed timestamp; explicit unassessed state |
| `QuizAttempt` | server attempt reference, lesson/activity revision, submission ID, server result, explanatory feedback, retry permission |
| `LabSummary` | allowlisted lab reference, objective, eligibility reason, observed status, expiry, capabilities; credentials only in separate authorized session response |
| `ReportDraft` | owned reference/revision, structured fields, evidence references, save/submission status and timestamps |

These fields are requirements to reconcile with API design, not ready-made schemas. `ModuleSummary` can be a web view model mapped from Week; avoid introducing a second canonical module entity. Do not include owner IDs in writes as a substitute for session identity. Public policy may say which activities are required and the pass threshold; it never contains expected answers, private rubric rules, or solutions.

Prefer a versioned response/error envelope that supplies safe code, message, optional field errors, retryability, and request reference. UI maps known error codes to recovery actions; unknown errors use a safe generic message. Do not render raw backend traces, provider prompts, or arbitrary error HTML. Agree exact endpoint paths during implementation; this design does not invent functioning API routes.

## Lesson-block type proposal

Retain canonical names (`multi_choice_challenge`, `reasoning_challenge`, `ai_mentor_checkpoint`, `lab`) rather than creating parallel `quiz`, `mentor`, and `lab_launch` schemas. Stage names use `review` in UI; map any existing AI Review display label to optional advisory review.

The following TypeScript sketch shows discriminants and payload ownership. `SafeText` denotes restricted Markdown or structured text decoded by the approved renderer, never trusted HTML. Numeric bounds, URL protocols, reference integrity, and unique IDs require runtime schema validation; TypeScript alone does not validate network data.

```ts
type Stage = 'learn' | 'think' | 'inspect' | 'lab' | 'explain' | 'report' | 'review';
type SafeText = string;
type Base = { id: string; stage: Stage };
type ActivityRef = { activity_id: string };
type Header = { name: string; value: string }; // ordered; duplicates allowed

type HttpRequestData = {
  label: string; method: string; path: string;
  http_version?: string; headers: Header[]; body?: string;
};
type HttpResponseData = {
  label: string; status: number; reason?: string;
  http_version?: string; headers: Header[]; body?: string;
};
type ResponseConstraints = { min_length?: number; max_length: number };

type CoreBlock = Base & (
  | { type: 'explanation'; heading?: string; body: SafeText }
  | { type: 'callout'; kind: 'note' | 'warning' | 'info'; title: string; body: SafeText }
  | ({ type: 'http_request' } & HttpRequestData)
  | ({ type: 'http_response' } & HttpResponseData)
  | ({ type: 'question'; prompt: SafeText } & ActivityRef & ResponseConstraints)
  | ({ type: 'reasoning_challenge'; prompt: SafeText; scenario?: SafeText;
       evidence_block_ids?: string[] } & ActivityRef & ResponseConstraints)
  | ({ type: 'multi_choice_challenge'; prompt: SafeText;
       mode: 'single' | 'multiple'; options: { id: string; text: SafeText }[] }
       & ActivityRef)
  | { type: 'code_inspection'; language: string; code: string;
      prompt?: SafeText; presentation?: 'code' | 'json' | 'terminal_output' }
  | { type: 'ai_mentor_checkpoint'; mode: string; prompt: SafeText;
      permitted_hint_ceiling: number }
  | { type: 'lab'; template_ref: string; objective: SafeText;
      evidence_checklist: string[] }
  | ({ type: 'report_exercise'; prompt: SafeText;
       fields: string[]; public_rubric_criteria: SafeText[] } & ActivityRef)
);

// Proposed extensions: require schema/publisher support before use.
type ExtensionBlock = Base & (
  | { type: 'compare_requests'; left_block_id: string;
      right_block_id: string; prompt?: SafeText }
  | ({ type: 'identify_parameter'; request_block_id: string;
       prompt: SafeText; candidates: { id: string; label: string;
       target: RequestTarget }[] } & ActivityRef)
);
type RequestTarget =
  | { kind: 'path_segment'; index: number }
  | { kind: 'query_entry'; index: number }
  | { kind: 'header'; index: number; part: 'name' | 'value' }
  | { kind: 'body_range'; start: number; end: number };
type LessonBlock = CoreBlock | ExtensionBlock;
```

This sketch deliberately omits private answer keys and solution content. Activity requirement/response schema comes from the public activity/completion contract. An ungraded reflective question can omit a submission activity in a future explicit schema variant; do not guess required status from block type. Code inspection starts read-only; any submitted annotation later needs an explicit activity variant.

| Requested content | Canonical/proposed rendering | Delivery |
| --- | --- | --- |
| Heading, paragraph, explanation | Safe document nodes inside `explanation`; no need for three block types | M1 |
| Note, security warning | `callout` with visible kind/title | Only when lesson needs it |
| HTTP request/response | `http_request`, `http_response` | M1 |
| Short answer / reasoning | `question`, `reasoning_challenge` | Required reasoning in M1 |
| Multiple choice | `multi_choice_challenge` | M1 |
| Code, JSON, terminal output | `code_inspection` plus proposed presentation; static text, never execution | M2 as needed |
| Compare requests | proposed `compare_requests`, references sibling HTTP blocks | M2 as needed |
| Identify parameter | proposed `identify_parameter`, submits candidate ID only | M2 as needed |
| Mentor checkpoint | `ai_mentor_checkpoint` | M4 |
| Lab launch | `lab` | M3 after isolation gate |
| Report exercise | `report_exercise` | M3 |
| Drag/match | No schema yet; require curricular justification and keyboard alternative | Deferred |

Annotations may later target `RequestTarget` or line ranges under a versioned extension. Offsets must document UTF-16 code-unit indexing if used with JS string slicing, end-exclusive, against the unchanged raw body; reject invalid ranges. Do not use substring search to decide which repeated parameter is selected. Query/header order and duplicated names matter. Parameter candidates are all valid selectable locations, not a disguised correct-answer flag. Comparison references are local to the same lesson revision and cannot fetch arbitrary URLs. An annotation/diff must not reveal the solution to an unanswered graded question; display differences only where the authored exercise permits.

## LessonRenderer pipeline

1. Receive learner-safe `Lesson` plus separate authoritative progress/attempt feedback. Validate schema version and runtime shape at the API adapter; publisher validation is still required.
2. Verify unique block IDs, valid references, supported types/capabilities, and activity compatibility. Keys are stable block IDs scoped to lesson revision, never array position. Keep author order.
3. Normalize safe text and evidence into render props without injecting HTML. Restricted Markdown allowlists elements and link protocols; no MDX execution, raw HTML, automatic remote media, or scriptable links. HTTP text remains escaped.
4. Use an explicit exhaustive discriminant switch or typed renderer map. Map public block data to presentational components; inject submission callbacks from the lesson coordinator, not hidden grading logic.
5. Render the active step and accessible outline, including required activity state. Reading position is presentation state only. Preserve drafts when moving between steps within the same lesson revision.
6. On submit, coordinator sends a typed response (option IDs, text, or future selected candidate), exact lesson/activity revision, and operation ID. API returns assessment feedback/progress; refresh relevant snapshots.
7. Offer next lesson only from authoritative availability. A client-side forward click cannot bypass missing work.

Unknown-type policy has two layers: publishing rejects unsupported types; runtime still handles mixed deployments/corrupt responses. Show “This activity needs a newer lesson viewer” with Retry and Back to module instead of crashing or silently dropping content. Unknown required status is treated as blocking, not optional. Only skip an optional unsupported block when a validated envelope explicitly marks it non-required and the server confirms navigation eligibility. Do not convert arbitrary unknown payload into a known union by casting. A wholly unsupported schema version produces a lesson-level recovery state. Client builds and publisher must agree a supported type/schema capability list before release.

HTTP view stores raw synthetic data separately from optional parsed spans. Copy uses raw text; interactive spans expose accessible labels and selected state. Future editing uses controlled inputs with an explicit inspect/edit mode, never a fake shell. Responses/code never execute. Line wrapping is a view preference and cannot change submitted evidence.

## State ownership

| State | Owner/lifetime | Persistence and rules |
| --- | --- | --- |
| Copy feedback, expanded note, request wrap, input focus | Component | Ephemeral; no global store |
| Navigation drawer, mentor visibility, selected evidence | Page/layout | UI only; close/reset on context change |
| Active step | Page + optional URL | Validated block ID; never completion |
| Answer drafts, pending submit IDs, field errors | Lesson coordinator keyed by ID + revision | In-memory until API acknowledgment; warn before losing unsent work |
| Report/evidence note draft | Editor/page | Explicit server save; no localStorage substitute |
| Mentor transcript in open drawer | Context-scoped page | No retention promise; saved history only with approved API policy |
| Theme | Root layout presentation preference | System default; small cookie override allowed |
| User identity/session | Platform-api | HttpOnly opaque cookie; no JS token store |
| Lesson publication/revision, prerequisites, progress, grade | Platform-api | Persistent system of record; server snapshots |
| Report versions, skill evidence/levels, XP/streak | Platform-api if capability implemented | Never computed as authority in frontend |
| Lab runtime lifecycle | Lab-manager via authorized platform-api | UI observes status, never controls infrastructure directly |

Do not introduce Redux/Zustand or a global cache by default. A local reducer is reasonable for an interaction with multiple transitions. Introduce a server-state library only after repeated cache/revalidation needs justify it, with explicit personalized cache boundaries. Browser history does not restore authoritative completion from a stale client snapshot; revalidate on return where needed.

## UI state machines and recovery

**Lesson availability:** locked (reason/prerequisite) → available → active → complete reflects server states. `active` maps from `in_progress`, `complete` from `completed`. Selected/focused is separate. A completed lesson stays reviewable; a later failed retry cannot undo completion.

**Data read:** initial → loading → ready | empty | error. Ready may be refreshing or stale-with-warning. Failure must not turn a loaded completion into a zero value. Session expiry is a separate recovery condition; do not silently replace the learner and present their old work as saved under a new identity.

**Activity write:** pristine → editing → submitting → accepted (server feedback) | rejected (field/assessment feedback) | unknown outcome. Transport timeout is unknown outcome because the server may have committed. Preserve the frozen payload and operation ID for safe replay/status reconciliation. Disable duplicate clicks while pending. Validation/grade rejection permits editing; new intended attempt gets a new ID. Never reuse an ID with changed answers. Refresh/re-entry loads persisted outcome; it does not replay a mutation blindly.

**Report save:** clean → dirty → saving → saved | failed | conflict | unknown outcome. Keep local edits on all failures; server revision conflict cannot overwrite them silently. Save times are server timestamps. Avoid concurrent saves until a revision-aware contract exists.

**Hint:** closed → requesting level N → revealed N | unavailable/retry. Next level requires another deliberate click. Requested maximum is subject to server permissions; never prefetch hidden hints/solutions. A permitted Show explanation requires explicit confirmation of reveal scope, without manipulative XP messaging. Failure does not increment level. AI output is advisory escaped content, not a navigation or grading command.

**Lab:** gated/unavailable → idle → provisioning → ready/running → resetting/expired/stopped or failed. Observe actual backend status and expiry; stop polling on terminal state/unmount and back off on errors. A reset is a destructive lab action with a scoped confirmation, operation ID, and status reconciliation. Notes saved to platform-api survive lab expiry; unsaved notes retain their visible dirty state.

Progress after a submit can be delayed by failed refetch: show accepted feedback plus “Progress refresh unavailable” rather than undoing acknowledgment or inventing next availability. Changing content revision while a draft exists needs an explicit keep/reload choice; resume the retained revision per API policy. Navigation guards are best-effort for app links and browser unload; clearly tell learners that unsent drafts are not durable.

## Frontend trust boundaries

Treat lesson imports, learner text, HTTP snippets, model output, error messages, and lab responses as untrusted. Do not fetch URLs found in content, automatically send evidence to a mentor, or execute examples. Only vetted navigation protocols and authorized lab launch URLs can become links. Open external targets with appropriate opener isolation and a visible new-tab label; never expose lab control-plane addresses.

Copy/reveal controls for fictional credentials operate only on authorized data. Redact credential-bearing evidence before any mentor request under the platform policy; the UI previews selected context and does not send an entire lesson/report by default. Logs/analytics omit raw drafts, tokens, evidence, and model conversations. Do not create telemetry implementation in this documentation phase.
