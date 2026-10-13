# Vulnerable lab isolation requirements

Status: required policy; no lab runtime has been selected or validated.

## Threat model

Assume a learner can fully compromise a vulnerable lab process, execute code inside its workload, send hostile traffic, exhaust resources, and attempt lateral movement or exfiltration. Course content, learner evidence, lab responses, and model output are untrusted. The trusted platform and the lab control plane must remain safe under that assumption.

## Required boundaries

- Use a separate sandbox/VM or equivalent verified runtime boundary for untrusted lab workloads. A container in the trusted platform Compose network is insufficient.
- Deny traffic from labs to web, platform-api, ai-mentor, lab-manager control endpoints, PostgreSQL, host/control networks, and cloud instance metadata. Deny lab egress by default; allow only documented exercise-specific destinations if needed.
- Give each learner lab session an independent network, storage, and synthetic data set. Deny session-to-session traffic and shared writable volumes.
- Never mount the Docker socket, runtime socket, host directories, platform database volume, or credential files into a lab. Never run labs privileged or with host networking. Drop capabilities and apply runtime restrictions appropriate to the selected isolation technology.
- Inject only synthetic lab-local configuration. No platform sessions, provider keys, real user data, or orchestration credentials may enter lab environments.
- Set resource limits, short TTLs, reset and cleanup behavior, and reconciliation after manager restart. Deleting a session removes its disposable state.
- Expose only intended lab application routes via scoped expiring access. Keep manager authentication and infrastructure control endpoints on a separate trusted channel. A lab reference is not a general URL proxy input.
- Do not execute lab-supplied commands, paths, image names, or templates in the manager. Provision only reviewed allowlisted template revisions. Pin runtime artifacts and preserve their verification.

## Local development

Docker Compose is the development interface for the trusted platform. Future lab development may use a separately provisioned sandbox runtime invoked by lab-manager. Do not add vulnerable applications to the trusted network for convenience. If the chosen environment cannot supply adequate isolation, use synthetic request/response exercises and leave live labs disabled.

## Release gate

Before enabling a lab, record the chosen technology and threat-model evidence in an ADR. In a disposable test environment, verify:

1. A compromised representative lab cannot reach any platform service, database, control endpoint, host resource, metadata endpoint, or runtime socket.
2. Two concurrent sessions cannot communicate or read each other's data; scoped access does not authorize another learner's session.
3. A learner cannot request an arbitrary image, command, upstream URL, mount, privilege, or network configuration.
4. TTL expiry, reset, cleanup, quota limits, and restart reconciliation work, including failed provisioning.
5. Secret/configuration inspection of lab artifacts reveals only synthetic exercise values.
6. The intended learning exercise remains usable through its scoped ingress route.

Document test scope and limitations; network probes alone do not prove resistance to runtime escape. An unresolved isolation requirement blocks live lab release, not the deterministic HTTP course.
