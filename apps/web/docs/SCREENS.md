# Navigation and V1 screen specifications

Status: target design; route paths are proposals for Next.js pages, not API endpoints. Examples are synthetic. Implement in [milestone order](README.md), not all at once.

## Visual direction for the validated slice

The dashboard, module, and interactive lesson use the dark-first workspace in
[DESIGN_SYSTEM.md](DESIGN_SYSTEM.md). The dashboard begins with CURRENT_SESSION,
module identifier, lesson title, aligned status/progress, and Continue, followed by
LEARNING_PATH rows. No statistic cards, radial charts, or activity heatmaps.
The module uses MODULE_01, OBJECTIVE, and LESSON_SEQUENCE. The lesson groups short
prompts and HTTP artifacts into the existing guided investigation; observation,
hypothesis, evidence, and conclusion are distinct patterns. Native request-part
buttons keep direct selection keyboard accessible. Navigation is a compact sidebar
at desktop and a modal drawer below 1024 px. Only dashboard and learn are enabled
in this prototype; the broader destinations below remain future scope.

## Information architecture

A course contains ordered weeks; V1 presents each week as a module. Modules reference ordered immutable lesson revisions. Lessons contain ordered blocks and activity references; activities hold submitted work and server outcomes. Labs and report exercises attach to lesson context but may also be revisited from their primary destinations. Skills summarize evidence only when an approved policy exists.

```text
Dashboard → current mission → lesson step → server outcome → next available lesson
Learn → course → module/week → lesson
Lesson → inspect evidence → reasoning/quiz → optional lab → explanation/report → review
Labs → available lab → challenge/status/notes → return to originating lesson
Reports → owned drafts/submissions → structured editor → feedback → revise
Skills → evidence-backed topic/subskill → related completed work or available lesson
```

The loop is a teaching model, not a rigid wizard requiring every stage. Module/lesson breadcrumb and step labels answer “Where am I?”; explicit completed/required indicators answer “What have I done?”; one next action answers “What next?”

## Route and navigation proposal

| Destination | Route | Shell and purpose |
| --- | --- | --- |
| Dashboard | `/` | App shell; current mission |
| Learn | `/learn` | App shell; course progression |
| Module | `/learn/[courseId]/modules/[moduleId]` | App shell; week objectives and ordered lessons |
| Lesson | `/learn/[courseId]/lessons/[lessonId]` | Focused shell; resolved retained/current revision |
| Labs | `/labs` | App shell; available/recent challenge list |
| Lab | `/labs/[labId]` | Workspace shell; authorized session resolved by API |
| Skills | `/skills` | App shell; skills and evidence |
| Reports | `/reports` | App shell; owned draft/submission list |
| Report editor | `/reports/[reportId]` | Focused editor shell; structured work and review |

Use stable IDs in URLs. A `step` query may identify a block for shareable location, but is validated against returned content and never grants access or completion. Resolve the learner's retained revision through platform-api; do not pick the latest revision in the browser. Routes never contain credentials, tokens, answers, or raw evidence. Bad IDs show a recoverable not-found state; locked lessons show prerequisite explanation instead of content leakage. Access checks belong to the API.

Desktop app shell: 56 px top navigation, 224 px sidebar, main region. Sidebar has exactly Dashboard, Learn, Labs, Skills, Reports once those destinations are usable. Product name links home. Top bar contains course context, theme control, and current-user menu. Initially label the user “Anonymous learner” and explain same-browser persistence in the menu; no invented profile or level. Streak appears compactly only if supplied by an authoritative capability. Omit unknown streak/XP rather than fabricating zeros. No permanent Mentor navigation item.

Focused lessons replace the full sidebar with “Back to module,” breadcrumb, lesson title, and compact progress. A contents button opens the lesson outline when needed. Leaving and returning preserves acknowledged work; unsent drafts need an explicit warning. Mobile uses labeled modal navigation. Highlight the parent Learn destination for module routes.

## Shared screen states

All screens use a named heading during loading with geometry-stable placeholders. Errors describe what failed and provide a scoped Retry without losing drafts. Empty is distinct from unavailable and from loading. Background refresh keeps readable last-confirmed data labeled when stale. Missing progress must never be presented as zero or complete. Session expiry explains that saved anonymous work requires the original valid session; preserve the current in-memory draft while recovery options are presented, with no false recovery promise.

Each screen below specifies its primary action, information priority, special states, and small-screen behavior. General accessibility/responsive rules remain in [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md).

## Dashboard

**Purpose:** tell the learner exactly what to do next. Primary action: Continue current mission, or Start Week 1 for a new learner. Mission selection follows server availability/resume information, not a random recent-content recommendation.

Priority: current module/title → active lesson and objective → completed count → action. Secondary: weekly completed activities with a textual count, a small skills preview if assessed, recent activity, labs solved, compact streak if available. Use rows/sections; no wall of statistic cards. Weekly summaries must label their date range/timezone and never infer progress from time-on-page.

```text
+---------------------------------------------------------------+
| BountyLab                  Course                 User / Theme |
+-------------+-------------------------------------------------+
| Dashboard * | CURRENT MISSION                                 |
| Learn       | Broken Access Control                           |
| Labs        | Lesson 4 of 7 · Understanding object ownership   |
| Skills      | 3 of 7 complete  [======--------]                |
| Reports     | [Continue lesson]                               |
|             |-------------------------------------------------|
|             | This week             | Skills to practice      |
|             | 2 lessons complete    | Authorization: evidence  |
|             |-------------------------------------------------|
|             | Recent activity                                 |
|             | Saved reasoning · Read authorization             |
+-------------+-------------------------------------------------+
```

New learner: explain the first objective, estimated duration if published, and Start; omit empty analytics. All current content complete: show “Weeks 1–2 complete” and Review work, not a locked Week 3 CTA. Mission fetch failure: retry mission while other loaded sections remain available. Mobile keeps mission first, then weekly activity and recent work; no multi-column statistics.

## Learn

**Purpose:** reveal course structure and progression. Primary action: Resume active lesson or Open available module. V1 displays Week 1 HTTP & Web Foundations and Week 2 Broken Access Control. Optional future modules are visibly “Not yet released,” distinct from prerequisite-locked published content.

Each module row exposes title, short description, estimated total duration, completed percentage and count, lesson count, and lab count/availability. Duration and counts come from published metadata; do not invent values. Use an ordered progression with a subtle connecting rule, no thumbnail grid or game map.

```text
+-----------------------------------------------------+
| Learn                         [Resume current lesson]|
| Course: Web security foundations                    |
|                                                     |
| 01  Week 1 · HTTP & Web Foundations     Complete      |
|     Read browser traffic and reason about requests  |
|     Duration · 7 lessons · labs: published count     |
|     7/7 complete · 100%                 [Review]    |
|  |                                                  |
| 02  Week 2 · Broken Access Control      Active        |
|     Investigate identity and object ownership       |
|     Duration · 7 lessons · lab availability          |
|     3/7 complete · 43%                 [Open module] |
|                                                     |
| Later modules · Not yet released                    |
+-----------------------------------------------------+
```

Counts above illustrate layout only, not final curriculum. Empty published catalog: explain content unavailable and Retry, with no dead Start button. Locked module names its prerequisite. Mobile stacks metadata below titles and keeps status/action readable. Missing lab capability says “Lab not available yet” rather than a launch control.

## Module

**Purpose:** connect concepts to ordered lessons and show prerequisites. Primary action: Continue the active lesson; all complete lessons remain reviewable.

Broken Access Control concepts: authentication vs authorization, object ownership, IDOR, BOLA, horizontal and vertical privilege escalation. Expand acronyms in introductory copy. The following order is illustrative until content publication approves it.

```text
+---------------------------------------------------------+
| Learn / Week 2                                          |
| Broken Access Control                      3/7 complete |
| Reason about who may access which object.               |
| Concepts: identity · ownership · IDOR/BOLA · escalation  |
|                                                         |
| ✓ 01 Authorization boundaries                  [Review] |
| ✓ 02 Identifying objects                       [Review] |
| ✓ 03 Two-account testing                       [Review] |
| > 04 Read authorization · Active              [Continue]|
|   05 Write authorization · Available             [Open]|
| - 06 Hidden endpoints · Locked: finish prerequisite     |
| - 07 Final challenge · Locked: finish prerequisite     |
+---------------------------------------------------------+
```

States are labeled locked, available, active, complete; a lock icon alone is insufficient. “Active” means server-reported in-progress, not simply selected. Prerequisites follow API policy, not hard-coded sequential locking; the illustration permits an available lesson beside an active one. Show estimated lesson duration and required lab markers when published. No content: return to Learn. Mobile renders a single list with action on its own line if needed.

## Lesson

**Purpose:** focused learning with reusable structured evidence and exercises. Primary action changes with the task: Submit response, Submit quiz, Continue, or Next lesson. Continue between reading steps does not award completion. If required work is incomplete, explain the requirement adjacent to the action.

```text
+------------------------------------------------------------+
| [Back to module] Week 1 / Read an HTTP conversation          |
| Objective: Separate request data from response data         |
| Learn → Think → Inspect → Explain   Step 2 of 5  [Contents] |
+------------------------------------------------------------+
| Inspect this request                                       |
| A client requests one resource.                             |
| Request · synthetic                                [Copy]  |
| GET /api/orders/418 HTTP/1.1                                 |
| Host: training.invalid                                      |
| Authorization: Bearer <synthetic-token>                      |
| Accept: application/json                                    |
|                                                            |
| Which value identifies the object?                          |
| ( ) The bearer token   ( ) 418   ( ) application/json        |
| [Submit answer]                          [Give me a hint]   |
| Feedback after submit: evidence and reasoning               |
+------------------------------------------------------------+
| [Previous]                       Requirement / [Continue]   |
+------------------------------------------------------------+
```

The diagram combines representative controls; the first published lesson retains canonical content, IDs, required reasoning and quiz. Do not force the example question into its actual curriculum. Lesson headings/prose can share a reading step, with one primary exercise per step where possible. Blocks retain author order and stage metadata; stages need not be visited in a fixed global order. Derive step grouping from explicit content/presentation rules, never from a completion heuristic.

Questions ask what to test next, what the server assumes, which value identifies an object, whether evidence concerns authentication or authorization, what confirms the finding, and what behavior is expected. Example feedback: “The request authenticates User A; the server must still verify that User A may access order 418.” Failed answers retain evidence and permit a new attempt. Reasoning submission confirms saving without claiming correctness.

Pending submission keeps the draft, prevents accidental duplicate submission, and reports uncertain outcomes distinctly from failure. On success display server feedback and refreshed progress. Next lesson follows server availability. Optional mentor failure is inline and never disables deterministic Continue. Unsupported required block or schema version shows a compatibility message and Retry/Back to module; do not silently skip it. Mobile retains content order, local code overflow, and accessible footer; mentor opens as a closable modal drawer.

## Labs and Lab workspace

Lab list: challenge title, linked module, difficulty only if published, availability, and last server-reported status. Primary action opens the current eligible lab; new learners see the prerequisite lesson. A lab detail contains objective, scope, target link, fictional accounts, status/expiry, reset, evidence notes, hints, and submission. Target runs externally; no embedded browser in V1.

```text
+----------------------------------------------------------------+
| [Back to lesson] Broken Access Control — Lab 02   Status: Ready  |
+----------------------------+-----------------------------------+
| Challenge                  | Target workspace                  |
| Verify object ownership    | [Open target in new tab]          |
| Authorized target/scope    | Use your browser / local tooling  |
| Fictional accounts         | This is not an embedded browser.  |
| [Reveal] [Copy account]    |                                   |
| Evidence notes             | Evidence checklist                |
| [Observed ...           ]  | Request · response · expected     |
| [Save notes]               | result · observed result          |
| [Hint 1]                   |                                   |
| [Reset lab]                | [Submit evidence]                 |
+----------------------------+-----------------------------------+
```

Only show credentials delivered for the learner's authorized synthetic session; do not put them in content bundles. Reveal/copy deliberately; keep them out of logs/analytics/mentor context. Display scoped link expiry and meaningful status; frontend never infers success from HTTP traffic or marks the challenge solved itself.

Lifecycle: unavailable (gate/prerequisite) → idle → provisioning → ready/running → expired/stopped; failure/retry and resetting are explicit states. Exact statuses map from final API capability, not invented polling results. During provisioning show stable status and safe retry rules. Reset requires a dialog naming destroyed target state and preserved separately saved notes; disable while an acknowledged reset is pending. Uncertain reset outcome queries status before offering another operation. Submission acknowledgment and lab solved are distinct server results.

On a phone stack objective, status, accounts, notes, then desktop tool instructions. Keep note-taking usable; no compressed fake desktop workspace. Return-to-lesson preserves context. Lab-manager failure leaves theory, saved notes, and reporting usable where policy permits. A local Docker launch instruction is only shown if the approved isolation documentation provides it; do not fabricate a safe launch command.

## Skills

**Purpose:** explain demonstrated knowledge and useful next practice. Primary action: review supporting evidence or open an available related lesson. Initial taxonomy: HTTP, Web architecture, Authorization, Authentication, API security, Injection, Business logic, Recon, Source review, AI security, Reporting.

```text
+----------------------------------------------------------+
| Skills                                                   |
| Learning evidence, not time spent                        |
| HTTP             Evidence available          [View work] |
| Authorization    Developing*                 [View]      |
|----------------------------------------------------------|
| Authorization                                            |
| Object ownership        Strong*          [Evidence]      |
| Horizontal escalation   Developing*      [Practice]      |
| Vertical escalation     Not started      [Open lesson]   |
| BOLA                    Developing*      [Evidence]      |
|----------------------------------------------------------|
| *Illustrative labels; requires approved scoring policy.  |
+----------------------------------------------------------+
```

In the real UI, only server-backed policy may produce “Strong” or “Developing”; the wireframe footnote is design documentation, not product copy. Until then use “Not yet assessed” and links to completed work, distinct from “Not started.” Each future mastery label must expose evidence, assessed date, and an explanation of its meaning. Completion alone is not mastery. Out-of-V1 topics say “Future curriculum” and have no dead practice link. No radar chart, RPG levels, vanity percentages, or implied skill from XP. On mobile turn wide evidence rows into labeled stacked items.

## Reports and report editor

**Purpose:** practice reproducible professional findings. List owned reports by title, asset, status, updated time, and lesson. Primary action: Continue draft, or Start report from an eligible exercise. Empty state links to that exercise rather than displaying a blank essay editor.

```text
+---------------------------------------------------------------+
| Reports                                 [Open report exercise]|
| Title                    Asset          Status       Updated  |
| Missing ownership check  Synthetic API  Draft        Date     |
+---------------------------------------------------------------+
| [Back to reports] Missing ownership check      Unsaved changes |
| Title                    [                                ]   |
| Affected asset           [                                ]   |
| Summary                  [                                ]   |
| Prerequisites            [                                ]   |
| Steps to reproduce       [1. ...                           ]   |
| Expected result          [                                ]   |
| Actual result            [                                ]   |
| Impact                   [                                ]   |
| Evidence                 [Request] [Response] [Notes]          |
| Suggested remediation    [                                ]   |
| [Save draft]                               [Submit for review]|
+---------------------------------------------------------------+
| Review: clarity · evidence · claims · impact · reproducibility |
+---------------------------------------------------------------+
```

Capture root cause through a labeled prompt within Summary (“Explain the missing check/root cause”) to satisfy the product outcome without discarding the requested report structure. Steps are numbered reproducible actions, not a single undifferentiated essay field. Evidence references lesson/lab context and distinguishes observed results from assumptions. V1 can use structured escaped HTTP text and notes; screenshot upload is deferred until storage/type/size/accessibility policy exists. Do not display a fake upload button.

Explicit Save draft first; introduce autosave only with a real revision-aware persistence contract. State is Unsaved → Saving → Saved at server time or Save failed. Conflicts preserve local edits and offer reload/reconcile without silent overwrite. Submission validation focuses linked field errors. Read-only submitted versions remain reviewable; revise through an explicit draft/version flow agreed with the API.

Deterministic submission/feedback works without AI. Optional AI review comments on clarity, missing evidence, unsupported claims, impact reasoning, and reproducibility; comments attach to fields/evidence and are labeled advisory. No fabricated review before an actual response, automatic acceptance of suggestions, or AI award of completion. Mobile stacks editor and review below it; basic drafting stays usable, large evidence stays locally scrollable.
