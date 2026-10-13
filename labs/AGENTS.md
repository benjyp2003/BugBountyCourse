# Vulnerable lab guidance

Applies to this subtree in addition to root guidance. Everything here is untrusted infrastructure, even when maintained in this repository.

Do not create or start labs during the current documentation phase. Later labs must use synthetic data, explicit learning objectives, allowlisted versioned templates, disposable state, and the isolation gate in docs/security/LAB_ISOLATION.md.

Never connect a lab to the platform database/network, use platform/provider credentials, mount host paths or Docker sockets, run privileged, or share writable state with another lab. Do not use real third-party targets or private vulnerability evidence in fixtures.

Keep each lab's intentional vulnerability documented separately from unintended containment weaknesses. Do not accidentally fix the intended exercise, and do not preserve an unintended escape merely because a lab is vulnerable. Public lab metadata describes goals and evidence expectations; solutions remain in server-only instructor/grading material.

Future per-lab guidance should define the vulnerability/root cause, intended observations, allowed interactions, reset behavior, resource needs, and verification. Test the learning behavior and containment independently.
