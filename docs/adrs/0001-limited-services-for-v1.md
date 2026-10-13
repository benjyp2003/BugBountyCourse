# ADR 0001: Use a modular platform API and two independent domain services

Status: accepted

## Context

BountyLab's first milestone is one interactive HTTP lesson with a quiz and persisted progress. Users, content, assessment, progress, XP, skills, and reports share authorization and data consistency requirements. Splitting each into a service would introduce distributed transactions, deployment overhead, network failure handling, and duplicate contracts before the learning workflow is proven.

AI mentoring has its own policy, provider credentials, latency, cost, and failure modes. Lab orchestration has a fundamentally different infrastructure trust boundary: its workloads are intentionally vulnerable. These domains warrant independent service boundaries even though neither needs to run for milestone 1.

## Decision

Use FastAPI platform-api as a modular application with one PostgreSQL database. Keep identity, course delivery, assessment, progress, XP, skills, and reports in this application. Define internal modules as features are implemented; avoid generic domain frameworks.

Reserve independent ai-mentor and lab-manager services. Introduce their runtime implementations only at the relevant milestones. The mentor cannot write authoritative progress or access the platform database. The lab manager controls a separate isolated runtime and does not receive platform database credentials.

Milestone 1 deploys web, platform-api, and PostgreSQL through local Docker Compose. There is no queue, broker, service mesh, or per-domain microservice requirement.

## Alternatives

- One service per domain: rejected for V1 because operational and consistency costs exceed demonstrated benefits.
- Everything inside platform-api: rejected for AI provider/policy separation and lab infrastructure isolation. Platform-api must not become an execution environment for vulnerable workloads.
- Start all reserved services immediately: rejected because empty service scaffolds do not validate the learner workflow or isolation.

## Consequences

Platform changes can use ordinary database transactions and one authorization model. Deployments and local debugging remain simple. Module boundaries require discipline; shared persistence is not permission to bypass domain rules.

AI and lab integrations add explicit internal contracts and failure handling when introduced. Service separation alone does not establish lab containment; the runtime/network requirements still apply.

## Revisit when

A platform module has measured independent scale, operational ownership, compliance isolation, or release needs that cannot be met within the modular application. Document migration, ownership, consistency, and operational costs before extracting it.
