# Web guidance

Applies to this subtree in addition to root guidance. Runtime implementation is deferred until authorized.

Use Next.js with TypeScript. Route shells select a mission; a reusable course engine renders validated discriminated block data. Do not hard-code a React page for each lesson. Web receives public lesson projections from platform-api and must never import private course grading files.

Keep progress, quiz grades, learner identity, and availability server-authoritative. UI state may retain unsent drafts and pending operations but cannot award completion. Submit stable operation IDs for retryable writes and recover gracefully from timeouts. Avoid introducing a global state framework until actual state needs justify it.

Follow the mission-centered visual and accessibility requirements in PRODUCT_SPEC.md. Use semantic controls, explicit labels, visible focus, announced feedback, and local overflow for HTTP/code panels. Render learner and model text safely; no unsanitized HTML or automatic external request execution.

Use generated API types from packages/contracts. Reusable presentational primitives belong in packages/ui; lesson-specific renderers stay here. Keep secrets and platform DB access out of the frontend, including server components. A Next.js server route may forward authenticated platform requests but must not become a second domain backend.

Once code exists, validate the actual lesson/quiz/progress/next-lesson path with end-to-end tests and a keyboard/mobile review. Check that private grading fields are absent from browser bundles and initial network responses.
