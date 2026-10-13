# Lab manager guidance

Applies to this subtree in addition to root guidance. This directory reserves a future independent domain; do not build orchestration for milestone 1.

Read docs/security/LAB_ISOLATION.md before designing or running a lab. The manager is a trusted control plane for hostile workloads. Its runtime credentials and control endpoints must be inaccessible to lab networks. It has no platform database credentials.

Accept authenticated platform requests for reviewed allowlisted template revisions. Own provisioning, scoped ingress references, resource limits, TTL, reset, cleanup, and restart reconciliation. platform-api owns learner authorization and its lab-session references; this service owns runtime state.

Never accept arbitrary images, shell commands, mount paths, privilege flags, or upstream URLs from learners. Do not expose runtime sockets to labs or browsers. Enforce session separation and deny-by-default egress. Validate provisioning failure cleanup and expired-session access.

Select a sandbox runtime only after a representative containment prototype and ADR. A vulnerable container on the trusted Compose network is prohibited. If no adequate boundary is available, keep labs disabled and report the concrete blocker.

Before enabling any template, run the isolation release gate, lifecycle checks, and two-session ownership/separation checks. Do not claim isolation from process startup or a single blocked network request.
