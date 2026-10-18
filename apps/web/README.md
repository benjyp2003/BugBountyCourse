# Frontend prototype / 01

## Run and validate

Node.js 22 or later (validated on 24); npm with the committed lockfile.

```sh
npm ci
npm run dev
npm run lint
npm run typecheck
npm test
npm run build
```

The Playwright tests use `/usr/bin/chromium` in the managed workspace. Elsewhere,
set `PLAYWRIGHT_CHROMIUM_EXECUTABLE` to an installed Chromium executable. Tests
start their own local server. Screenshots are written to ignored `test-results/`.

## Implemented scope

- `/`: current mission first, compact path, compact synthetic recent activity.
- `/week-1`: six lessons in a ruled sequence, explicit states, future week disclosed
  only on request. Only the current lesson has an implemented destination.
- `/week-1/read-http`: Hook → Observe → Think → Inspect → Explain → Apply.
  Select request parts, draft a hypothesis, identify the order selector, compare
  a reasoning draft with an explanation, then prepare order 419 with the same
  synthetic session. A conclusion distinguishes a prepared request from evidence
  of a server result.

All examples use `training.invalid` and a synthetic bearer credential. No HTTP
example is executed. No private course definitions are imported. `src/prototype`
contains typed public tutorial fixtures, not transport contracts or grading rules.
The six discriminated blocks are rendered by one lesson engine; only the block
patterns required by this lesson exist. No global state library or shared UI
package was created.

## Design decisions

The visual identity is a dark security research workspace: near-black canvas,
charcoal surfaces, compact monospace navigation and controls, restrained cyan
selection, and semantic green/amber/red states. Explanatory prose uses system sans.
The local mono stack prefers IBM Plex Mono, Geist Mono, and JetBrains Mono, with
Consolas/Liberation Mono fallbacks; no font download or dependency was added.
Square navigation and 3-4 px control/panel radii replace the editorial notebook.
The dashboard presents session metadata, a request artifact, and compact module
rows. The module uses an objective strip and lesson sequence. The lesson preserves
its existing guided interactions, now with recognizable investigation labels.
HTTP has aligned headers and raw/formatted views without shell chrome. Mobile
navigation uses a native modal dialog with Escape, focus containment, and focus
return. HTTP overflow remains local. Dark is the default regardless of OS theme.

The lesson advances through short, purposeful interactions, not a long article.
Request selectors use native buttons and explanatory feedback. A bearer
credential supplies identity context; it does not imply permission to read an
order. The final record makes the absence of a server response explicit.

## Accessibility

Semantic landmarks, ordered progression, heading levels, associated input labels,
visible focus, a skip link, and polite feedback announcements support navigation.
Each request selector exposes its value and pressed state. Representation toggles
use pressed buttons. Step changes focus the new instructional heading. All controls
can be reached with Tab and activated with Enter. Disabled next actions prevent
skipping an interaction, and revisiting reached steps retains drafts. Text and
labels supplement color. Future curriculum uses a native details disclosure.
HTTP overflow stays inside the artifact. Reduced-motion preferences are respected.

Playwright covers the keyboard completion path, incorrect-selection recovery,
reasoning drafts, controlled-change retries, raw representation, preview progress
reset, and safe learner-text rendering. Axe checks WCAG A/AA rules on all three
pages at 390, 768, and 1440 px, plus interaction and final states. Automated checks
supplement visual and keyboard review; a human screen-reader study remains useful.

## Redesign validation (2026-10-18)

Validated on Windows with installed Chrome via
`PLAYWRIGHT_CHROMIUM_EXECUTABLE=C:\Program Files\Google\Chrome\Application\chrome.exe`.
Lint, typecheck, production build, and all six Playwright tests pass. Axe reports
no violations in the exercised states. Visually reviewed dashboard, module, and
interactive lesson screenshots at 1440 and 390 px, plus the 375 px drawer.
Additional automated checks cover 768 px, 320 px reflow, 812 x 375 landscape,
reduced motion, dark rendering with a light OS preference, and drawer focus
wrapping, Escape, focus return, and navigation. Screenshots remain in ignored
`test-results/`; rerun the suite to regenerate them.

Frontend documentation links and whitespace checks pass. This is Chromium
validation, not a cross-browser or screen-reader certification. No backend,
persistence, lab isolation, or production learning workflow is claimed.

## Intentional differences from the architecture baseline

The user authorized a frontend study rather than the persisted milestone. There
is no API, anonymous authentication, database, Compose stack, assessment endpoint,
AI, lab runtime, reports, XP, or authoritative course completion. Progress starts
from a mock snapshot and records practice in memory while this application is
open; a refresh resets it. Drafts survive step changes, not lesson unmounts or
refreshes. The conclusion explains this limit. No account or save promise appears.

Public tutorial explanations are intentionally in the frontend. They are teaching
content, not a production assessment key. The “Compare” action reveals a worked
explanation without grading the learner's text. See
[ADR 0003](../../docs/adrs/0003-frontend-visual-prototype.md).

The Week 1 sequence places this as lesson 2, as requested in the current design
brief, rather than the baseline's first lesson. Available outline items indicate
the proposed progression; labels explicitly identify unimplemented destinations.
The next lesson is named at the end but has no fabricated lesson page.

## Remaining UX questions

- Does the compact technical workspace remain approachable to beginners?
- Do learners understand that authentication and resource selection are distinct,
  and that neither demonstrates authorization?
- Does selecting evidence directly feel discoverable without further cues?
- How much support should remain when learners write a hypothesis or explanation?
- Should future lessons require completion or permit independent exploration?

Validate these with learner sessions before growing the component system.

## File inventory

Created for this slice (paths relative to `apps/web`):

- `src/app/layout.tsx`, `src/app/globals.css`, `src/app/page.tsx`
- `src/app/week-1/page.tsx`, `src/app/week-1/read-http/page.tsx`
- `src/components/shell.tsx`, `src/components/http-evidence.tsx`,
  `src/components/lesson-engine.tsx`
- `src/prototype/content.ts`, `src/prototype/progress.tsx`
- `tests/prototype.spec.ts`, `playwright.config.ts`
- `package.json`, `package-lock.json`, `tsconfig.json`, `next.config.ts`,
  `eslint.config.mjs`, `README.md`

Also created: repository `.gitignore`, root `README.md`, and ADR 0003.
The architecture, product specification, and roadmap now identify the frontend
study separately from the production milestone. Next.js adds its generated
framework-guidance block to `apps/web/AGENTS.md`; existing guidance is preserved.
`next-env.d.ts` and route types are generated by `npm run typecheck`, development,
or build and are not committed.
