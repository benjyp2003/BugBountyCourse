# BountyLab frontend guidance

Applies throughout `apps/web`, in addition to root guidance. This subtree is documentation only. Do not install frameworks or implement pages until the relevant implementation milestone is authorized.

## Read first

These local documents form a self-contained frontend handoff:

1. [Design index and scope](docs/README.md)
2. [Visual system, responsive behavior, accessibility](docs/DESIGN_SYSTEM.md)
3. [Navigation, screen specifications, wireframes](docs/SCREENS.md)
4. [Architecture, renderer, contracts, state](docs/FRONTEND_ARCHITECTURE.md)
5. [Acceptance criteria](docs/ACCEPTANCE.md)

Repository authority remains [PRODUCT_SPEC.md](../../PRODUCT_SPEC.md), [ARCHITECTURE.md](../../ARCHITECTURE.md), [ROADMAP.md](../../ROADMAP.md), and accepted [ADR 0001](../../docs/adrs/0001-limited-services-for-v1.md) / [ADR 0002](../../docs/adrs/0002-versioned-content-and-server-authority.md). Do not silently override them.

## Product intent

BountyLab teaches security reasoning through Learn → Think → Inspect → Lab → Explain → Report → Review. AI Review is an optional advisory form of Review, never a completion gate. Early lessons use applicable stages only. Prioritize the current mission, evidence, explanation, and next action. This is a technical learning and investigation workspace, not a video library or statistics dashboard.

V1 covers Week 1 HTTP & Web Foundations (including Burp fundamentals) and Week 2 Broken Access Control. Milestone 1 is the first structured HTTP lesson, reasoning and quiz submissions, persisted progress, and a real introductory successor. Labs, reports, and mentoring follow later gates. Skill scoring and XP policies remain deferred.

## Implementation rules when authorized

- Use Next.js App Router, TypeScript, and Tailwind CSS. Prefer server route shells and small client interaction boundaries.
- Keep generic reusable controls in `packages/ui`, as root architecture requires; layouts, domain components, and lesson renderers belong here. Do not duplicate primitives in a local `components/ui` library or create a generic plugin framework.
- Use generated transport types from `packages/contracts`, derived from platform-api OpenAPI, and its versioned content schema. Local documented types are proposals, not a second canonical DTO source. Map to small view models only where presentation differs.
- Consume learner-safe public content. Never import private grading files, answer keys, database models, or provider secrets. Escape untrusted text; no arbitrary HTML, executable MDX, automatic snippet execution, or arbitrary URL proxying.
- Platform-api owns identity, authorization, grading, progress, availability, XP, skills, and reports. A Next.js forwarding route must not become a second domain backend. No database access, including from server components.
- Use the same-origin `/api` boundary and server-resolved HttpOnly anonymous session. Do not supply an owner ID, store session tokens in JavaScript, or promise cross-device anonymous recovery.
- Keep drafts local and visibly unsaved until server acknowledgment. No localStorage progress database or global state framework by default. Retry an uncertain write with the same operation ID and payload; a deliberate new attempt uses a new ID.
- Render discriminated blocks through `LessonRenderer`, never a hard-coded React page for each lesson. Unsupported required work blocks progression and offers recovery. Publication rejects unsupported blocks.
- Keep the mentor contextual, optional, and initially closed. Reveal hints individually. V1 labs open externally and remain gated on isolation verification; opening a link does not establish running status.
- Use neutral surfaces, one restrained blue interaction accent, real light/dark tokens, readable HTTP/code, and compact hierarchy. No hacker imagery, neon/glow, glassmorphism, giant gradient heroes, emoji navigation, decorative charts, or cards around every section.
- Target WCAG 2.2 AA: keyboard paths, visible unobscured focus, labels/errors, non-color status, reduced motion, accessible announcements, and local code overflow.

## Validation

Documentation needs link, consistency, and scope checks, not runtime scaffolding. Once code is authorized, follow [ACCEPTANCE.md](docs/ACCEPTANCE.md): validate the real lesson → submission → persisted completion → successor workflow, failure/retry, revisions, keyboard/mobile behavior, and absence of private grading data in browser assets. Describe proposals as proposals until runtime evidence exists.
