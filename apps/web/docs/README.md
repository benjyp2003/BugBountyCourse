# Frontend design baseline

Status: proposed frontend design, 2026-10-13. Documentation only; these specifications do not establish implemented screens, finalized API endpoints, working labs, or deployed services.

BountyLab teaches bug bounty, web, API, and AI security through **Learn → Think → Inspect → Lab → Explain → Report → Review**. Learners move from understanding an application to investigating evidence like a security researcher. AI advice is optional; deterministic completion is independent of model availability.

## Reading map

| Document | Deliverables |
| --- | --- |
| [AGENTS.md](../AGENTS.md) | Future-session instructions and constraints |
| [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) | Principles, tokens, typography, spacing, responsive behavior, accessibility |
| [SCREENS.md](SCREENS.md) | Navigation/information architecture, seven screen specifications and wireframes |
| [FRONTEND_ARCHITECTURE.md](FRONTEND_ARCHITECTURE.md) | Component hierarchy, renderer, block proposal, API contracts, state ownership |
| [ACCEPTANCE.md](ACCEPTANCE.md) | Testable milestone and V1 frontend gates |

## Scope and sequencing

| Phase | Frontend scope after implementation authorization |
| --- | --- |
| Milestone 1 | Minimal mission entry, shell, Learn/Week 1 outline, focused HTTP lesson, reasoning and quiz, server progress, successor |
| Milestone 2 | Complete Weeks 1–2 progression, inspection/comparison exercises, progress views, polished Dashboard |
| Milestone 3 | External isolated lab lifecycle UI and evidence-led report exercise |
| Milestone 4 | Optional contextual mentor, progressive hints, responsive/accessibility hardening |
| Deferred | Scored skill mastery/XP policy, account linking, Weeks 3–12, embedded browser, full request editor, drag/match, broad evidence uploads |

The five navigation destinations describe target V1 information architecture. During incremental implementation expose working destinations only; do not create dead links. A deliberate unavailable screen explains a real gate and offers a useful return action. Skills may show a truthful unassessed state until evidence and policy exist; no skill engine is required for V1.

No backend services, AI functionality, vulnerable applications, production integrations, or feature pages are part of this task. A design-system proof of concept is unnecessary for these decisions.

## Repository alignment

App Router/Tailwind conventions and visual proposals refine existing direction without superseding ADRs. Generic primitives remain in `packages/ui`. “Module” is the UI name for a published week in V1, not a new backend hierarchy. Block names align with the [content model](../../../docs/course-design/CONTENT_MODEL.md); comparison and parameter selection are explicit proposed extensions.

References: [product](../../../PRODUCT_SPEC.md), [architecture](../../../ARCHITECTURE.md), [roadmap](../../../ROADMAP.md), [service ADR](../../../docs/adrs/0001-limited-services-for-v1.md), [content/authority ADR](../../../docs/adrs/0002-versioned-content-and-server-authority.md).

## Decisions awaiting evidence

Agree final generated API/error contracts with platform-api. Validate fonts and all applied token combinations in browser. Confirm published lesson order/durations; illustrative titles are not curriculum. Lab runtime/ingress requires the isolation gate. Skill thresholds, XP, mentor retention/reveal permissions, and upload policy require separate decisions before activation.
