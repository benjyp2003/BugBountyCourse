# BountyLab architecture

Status: accepted initial direction; implementation has not begun. See [ADR 0001](docs/adrs/0001-limited-services-for-v1.md) and [ADR 0002](docs/adrs/0002-versioned-content-and-server-authority.md).

## Principles

Use a modular platform backend with a small number of meaningful domain boundaries. Keep deterministic learning and progress independent of model availability. Publish structured lessons and render them through a reusable engine. Treat intentionally vulnerable labs as hostile infrastructure. Prefer explicit contracts and direct calls over speculative infrastructure.

## Repository structure

```text
.
├── AGENTS.md
├── PRODUCT_SPEC.md
├── ARCHITECTURE.md
├── ROADMAP.md
├── apps/
│   ├── web/                 # Next.js + TypeScript; course engine and learner UI
│   ├── platform-api/        # FastAPI modular backend; PostgreSQL owner
│   ├── ai-mentor/           # independent mentor policy/provider service, deferred
│   └── lab-manager/         # isolated lab lifecycle control plane, deferred
├── labs/                    # vulnerable educational apps; separate trust zone
├── course/                  # versioned authored content and server-only grading
├── packages/
│   ├── contracts/           # API/content schemas and generated TS types
│   └── ui/                  # reusable presentational/accessibility primitives
├── infra/                   # Compose, deployment, and CI/CD, to be implemented
└── docs/
    ├── adrs/
    ├── course-design/
    ├── data/
    └── security/
```

Directories currently contain guidance only. Do not interpret their presence as running services. Later internal layouts should remain conventional: web route shells and block renderers; platform domain modules and migrations; AI policy/provider adapters; lab lifecycle and runtime adapters. Add these when code requires them.

## Boundaries and ownership

| Component | Responsibilities | Must not own or do |
| --- | --- | --- |
| web | Lesson rendering, accessible mission UI, local draft state, submission and feedback presentation | Database access, grading authority, authorization, orchestration, provider secrets |
| platform-api | Learner identity, course publication/delivery, quizzes, progress, XP, skills, reports, authorization, application persistence | Execute learner code, directly run vulnerable labs, delegate authoritative grades to AI |
| ai-mentor | Progressive hint policy, context handling, model provider access, hypothesis/evidence/report feedback | Platform DB access, lab runtime access, autonomous tools, authoritative grades or progress writes |
| lab-manager | Provision authorized lab templates, scoped session access, TTL/reset/cleanup, runtime isolation policy | User/course ownership, platform DB credentials, exposing Docker control to labs or web |
| labs | Intentionally vulnerable synthetic applications and disposable exercise data | Platform dependencies, shared secrets, shared data stores, unrestricted network access |
| course | Authored versioned lesson blocks, objectives, ordering, assessments and private grading material | Executable arbitrary templates or scripts |
| contracts | Canonical content schema and generated transport types | Domain business logic or a second independently maintained set of API DTOs |
| ui | Reusable controls and presentation primitives | Course state, network clients, domain grading rules |

Platform-api uses internal modules for identity, catalog/content, assessment, progress, and reporting. XP and skills become modules only when implemented. Modules may share a database transaction; they are not separately deployed services.

## Runtime and communication

Milestone 1 runs three Compose services: web, platform-api, and PostgreSQL. Database migrations run as a documented controlled step before API readiness. Keep the database port internal by default. Use a stable local same-origin route for `/api` forwarded to platform-api, reducing browser cookie and CORS complexity. The API enforces session ownership, request validation, and CSRF/origin protections for cookie-authenticated mutations. An edge/proxy route must not convert arbitrary user input into upstream URLs.

Web reads public lesson content and submits activities to platform-api. Platform-api loads validated published content from the course bundle, reads private grading definitions, and writes quiz attempts plus completion changes in PostgreSQL transactions. It returns feedback and next-lesson availability. A learner session cookie is opaque, HttpOnly, SameSite, expiring, and Secure outside local HTTP development. Store a digest of the session token, never the token itself, in PostgreSQL.

When AI is introduced, web calls platform-api, which authorizes the learner and forwards bounded context to ai-mentor through an authenticated internal endpoint with timeouts. The mentor returns advisory feedback. Platform-api stores only deliberately selected conversation data under an explicit retention policy. Provider secrets exist only in ai-mentor. No direct browser/provider connection, arbitrary URL fetching, or model tools are required for V1.

When labs are introduced, platform-api authorizes a lab request and asks lab-manager to provision an allowlisted template. Lab-manager returns a scoped expiring route/reference. Learner lab traffic reaches an isolated lab ingress/data plane, not a general platform proxy. The lab manager's control endpoint and runtime credentials are unreachable from lab networks. Platform-api may store the learner's lab-session reference; lab-manager owns runtime lifecycle state and reconciles expiry after restart.

## Database and content

PostgreSQL is the platform system of record. Only platform-api and its migration tooling access its schema. See [DOMAIN_MODEL.md](docs/data/DOMAIN_MODEL.md) for conceptual entities and invariants. The mentor does not need a separate database in V1; lab runtime state does not belong in the platform database as an orchestration authority.

Course files are the authoring source of truth. Publishing validates their schema, IDs, references, navigation, and grading configuration and registers an immutable content revision in the platform catalog. Learner records reference the revision they used. A content edit must not silently regrade historic attempts or remove completed progress. See [CONTENT_MODEL.md](docs/course-design/CONTENT_MODEL.md).

## Contracts

Use a versioned platform HTTP API with explicit error responses. FastAPI request/response models produce OpenAPI; generated TypeScript types live in `packages/contracts` once generation is implemented. The content schema is a versioned JSON Schema in that package; choose standard discriminated block types and validate authored content during CI and API loading. Do not introduce a cross-language code-generation system beyond these needs.

Internal AI and lab requests have explicit versioned schemas maintained with their service boundaries. Include authenticated caller identity, correlation IDs, timeouts, and safe errors. Do not expose internal provider prompts or runtime credentials through response objects.

## Isolation and security

Labs require a separate runtime trust boundary. Local Compose is for the trusted platform stack; enabling vulnerable labs requires a verified separate sandbox/VM or equivalent boundary and deny-by-default networking. No host Docker socket, privileged container, shared platform mounts, platform environment variables, or shared lab networks. A cloud deployment's exact isolation technology is intentionally undecided until a representative lab can prove these guarantees. See [LAB_ISOLATION.md](docs/security/LAB_ISOLATION.md).

Validate and escape content at rendering boundaries. Never execute HTTP snippets automatically against external destinations. Apply object ownership to progress, reports, and lab references. Keep answer keys and private feedback rules out of public bundles and API serialization. Redact cookies, authorization headers, tokens, and sensitive evidence before AI calls or logs. Limit submissions, sessions, and mentor requests to control resource abuse.

## Development and delivery

Use Docker Compose for reproducible local development with a named PostgreSQL data volume, documented seed/publish commands, and service readiness checks. Pin tools and dependencies with lockfiles once frameworks are chosen. Application readiness requires functional checks; a running container is insufficient.

CI should later validate content and contracts, run relevant Python and TypeScript checks, apply migrations against temporary PostgreSQL, and exercise the Week 1 end-to-end learning path. Lab containment checks run separately before lab release. Deployment, production identity, model provider choice, and lab runtime choice remain explicit later decisions, not blockers for milestone 1.
