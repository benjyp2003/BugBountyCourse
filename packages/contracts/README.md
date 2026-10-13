# Shared contracts

Reserved for the versioned course-content JSON Schema and generated TypeScript API types from platform-api OpenAPI. No contracts or generation tooling are implemented yet.

Keep API request/response models authoritative in platform-api. Validate course data against the canonical content schema. Do not maintain independent DTO copies or move business rules here. Schema changes must consider published revisions and existing learner records.
