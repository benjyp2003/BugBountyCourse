# Infrastructure

Reserved for Docker Compose, container definitions, CI/CD, and deployment documentation. No runtime configuration is implemented yet.

Milestone 1 Compose will run web, platform-api, and PostgreSQL with controlled migrations, functional readiness checks, and a persistent database volume. Keep database exposure internal by default and commit no secret values.

Vulnerable labs require a separate verified runtime/network boundary; do not add them to the trusted platform network. Deployment and lab runtime choices need evidence and explicit ADRs before configuration is introduced.
