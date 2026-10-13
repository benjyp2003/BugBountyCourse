# Web guidance

Applies to this subtree in addition to root guidance. Runtime implementation is deferred until authorized.

Use Next.js with TypeScript. Route shells select a mission; a reusable course engine renders validated discriminated block data. Do not hard-code a React page for each lesson. Web receives public lesson projections from platform-api and must never import private course grading files.

Keep progress, quiz grades, learner identity, and availability server-authoritative. UI state may retain unsent drafts and pending operations but cannot award completion. Submit stable operation IDs for retryable writes and recover gracefully from timeouts. Avoid introducing a global state framework until actual state needs justify it.

Follow the mission-centered visual and accessibility requirements in PRODUCT_SPEC.md. Use semantic controls, explicit labels, visible focus, announced feedback, and local overflow for HTTP/code panels. Render learner and model text safely; no unsanitized HTML or automatic external request execution.

Use generated API types from packages/contracts. Reusable presentational primitives belong in packages/ui; lesson-specific renderers stay here. Keep secrets and platform DB access out of the frontend, including server components. A Next.js server route may forward authenticated platform requests but must not become a second domain backend.

Once code exists, validate the actual lesson/quiz/progress/next-lesson path with end-to-end tests and a keyboard/mobile review. Check that private grading fields are absent from browser bundles and initial network responses.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
