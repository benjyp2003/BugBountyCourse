# Visual system and interaction rules

Status: dark-first visual direction, validated first in the three-screen frontend prototype. Production features remain subject to milestone authorization.

## Identity and principles

The visual reference is a mature developer tool combined with a technical learning workspace. A learner should identify the mission, relevant evidence, and next action before noticing decoration.

1. **Mission first.** One primary action per working region. Dashboard opens with the current mission; lesson opens with its objective and current activity.
2. **Evidence is first-class.** Give HTTP, JSON, and code deliberate typesetting, stable alignment, and precise labels. Keep observed evidence distinct from hypotheses and feedback.
3. **Reasoning over rewards.** Explain feedback and requirements. Streaks and completion counts are secondary; no confetti, leaderboards, or punitive hint prompts.
4. **Hierarchy before containers.** Use headings, spacing, and thin dividers. Panels frame requests, questions, or bounded tasks; ordinary prose does not need cards.
5. **Quiet surfaces, explicit controls.** Accent means interaction or selection. Status combines words and shapes/icons, not color alone.
6. **Long-session comfort.** Moderate line lengths, dark-first surfaces, stable page layouts, minimal motion, and readable dense evidence.

Prohibited: Matrix text, skulls, random padlocks, cyberpunk, neon green, glow, fake terminals around HTTP, giant gradient heroes, purple glow, excessive rounded cards/pills, emoji as primary UI, random highlighted headline words, AI sparkles, glassmorphism, and decorative charts. Charts require an actual learner decision and a textual equivalent.

## Color tokens

Dark is the default, independent of OS preference. Near-black and charcoal surfaces carry the interface; color is semantic and localized, never a decorative panel fill. Use one-pixel borders and surface contrast, without decorative shadows.

| CSS token | Dark value | Use |
| --- | --- | --- |
| `--canvas` | `#0B0D0E` | Workspace canvas |
| `--surface` | `#111416` | Navigation and bounded tasks |
| `--raised` | `#161A1D` | Toolbar and hover surfaces |
| `--ink` | `#EDF0F2` | Primary text |
| `--muted` | `#A1ABB2` | Secondary text |
| `--line` | `#272D31` | Structural separators |
| `--control` | `#65737D` | Necessary control boundaries |
| `--accent` | `#83D4E4` | Interaction, selection, focus |
| `--selected` | `#1B2E35` | Local selected value background |
| `--green` | `#8BC7A1` | Success, confirmed, running |
| `--amber` | `#DFBA79` | Hypothesis, attention, warning |
| `--red` | `#EF9292` | Error, security failure |

Status foregrounds sit on canvas/panel backgrounds; do not assume they work on arbitrary tinted fills. A thin decorative divider can have lower contrast; a boundary necessary to recognize an input cannot. Body and secondary text must meet 4.5:1; large text and essential non-text UI must meet 3:1. Links in prose are underlined. Disabled actions retain readable text and an adjacent reason; do not reduce a whole form to illegibility.

`lab.active` aliases success color plus a “Running” label and activity icon. `lesson.completed` aliases success plus a check and “Complete.” Neither creates another accent palette. Future severity badges use explicit text: Informational → info, Low → neutral, Medium → warning, High → error, Critical → error plus heavier border/icon. Severity is distinct from lesson failure and is never an input to skill scoring by itself.

Set `color-scheme: dark` at the root. No theme switcher is added to the prototype. A future optional light theme needs independent contrast validation; it must not change the dark default.

## Typography

Monospace defines navigation, headings, controls, metadata, progress, and HTTP. Evaluated choices: IBM Plex Mono for its readable technical character, Geist Mono for a compact developer-tool voice, and JetBrains Mono for code-heavy views. Prefer IBM Plex Mono in the local font stack, followed by Geist Mono, JetBrains Mono, Consolas, and Liberation Mono. No font files or external requests are added; actual rendering uses the first installed family. Use system sans for explanatory prose and drafts.

| Role | Size / line height | Weight |
| --- | --- | --- |
| Page title | 26 / 36 px | 500 |
| Mobile title | 22 / 31 px | 500 |
| Section heading | 20 / 28 px | 500 |
| Lesson prose | 14-15 / 22-24 px | 400 |
| Control / metadata | 11-13 / 18-21 px | 400 |
| HTTP values | 13-16 / 23-26 px | 400 |

Implement in rem. Use compact labels such as CURRENT_SESSION, MODULE_01, REQUEST_01, OBSERVATION, HYPOTHESIS, EVIDENCE, and CONCLUSION. Keep questions and prose in sentence case. Do not shrink HTTP to fit; scroll it locally. Maintain semantic headings and tabular alignment. Avoid serif editorial headings and oversized marketing titles.

## Spacing, geometry, and density

Spacing scale in px (implemented as rem): 4, 8, 12, 16, 24, 32, 48, 64. Default control internal gaps 8; related fields 16; section gaps 32; major page divisions 48. Use 16 px mobile gutters, 24 px tablet, 32 px desktop.

Top bar: 56 px minimum. Sidebar: 224 px, with compact lowercase navigation and a > selection marker. Show only implemented destinations in the prototype. Main content: maximum 1200 px centered inside available width. Reading column: maximum 720 px; evidence/comparison region: maximum 1040 px. Inputs/buttons: minimum 44 px height; compact evidence toolbar controls may be 32 px visually with at least 24×24 px targets and sufficient separation, aiming for 44×44 on touch.

Radii: 2-4 px controls, 4-6 px evidence/panels, square navigation drawer. Circular avatars are fine; pills are reserved for short statuses when they improve scanning. Borders: 1 px. Focus: 2 px accent outline with 2 px offset. No decorative shadows; separate the drawer with a border and scrim. Layer proposal: base 0, sticky chrome 10, popover 20, modal backdrop 30, modal 40, critical toast 50. Inline form errors are preferred to toasts.

Dense desktop layouts may reduce row padding to 8–12 px; never shrink target areas, text, or labels to achieve density. Evidence line numbers are optional, non-copying, and hidden from redundant screen-reader reading.

## Core component anatomy

**Button/link:** links navigate, buttons act. Primary filled button only for the current task; secondary outline/text controls for revisiting and help. Pending labels name the action (“Submitting…”). Disabled actions explain prerequisites. No clickable divs.

**Progress:** show “3 of 7 lessons complete” next to an accessible progress element. Use server counts; unknown totals show unavailable data, not 0%. Lesson position (“Step 2 of 5”) is separate from completion. No decorative radial meters.

**HTTP panel:** descriptive caption, compact Copy control, request/status line, header section, blank separator, body. Monospace preserves raw spelling and whitespace. Method/path/header names may differ in weight or restrained syntax color, but the request remains legible without color. Copy returns raw text without annotation markup or line numbers; a screen-reader message confirms success or failure. Redacted fields remain redacted in copied text. Never execute examples. Headers are ordered arrays to preserve duplicates.

**Comparison:** ACCOUNT A and ACCOUNT B are explicit captions with shared scenario context. Show aligned requests side by side only when both have readable width. Differences use a marker and “Changed” label plus highlight; never red/green alone. A text summary describes relevant differences. Narrow screens stack A then B in that order; preserve matching line references. Default copy operates on one request. Synchronized scroll is optional, not required to read either request.

**Question:** prompt, associated evidence, labeled response controls, submit, then explanatory feedback. Native radios/checkboxes for choice; bounded textarea with character guidance for reasoning. Feedback says what the evidence supports and what to investigate next, not just Correct/Incorrect. Presence-based reasoning acknowledgment says “Response saved,” not “Reasoning correct.”

**Mentor/hints:** entry beside the current evidence or question. Closed initially. Desktop panel max 360 px; below wide layouts use a modal drawer. Return focus to trigger on close. Do not steal focus as text arrives. Offer “Give me a hint,” “Challenge my hypothesis,” “Explain this request,” “Review my evidence,” and “Help me understand the concept” only where relevant. Hint 1 → Hint 2 → Hint 3 → Show explanation are separate explicit requests. Reveal is shown only when server policy allows it; no preloaded hidden explanation. Do not invent XP penalties.

## Responsive behavior

Breakpoints are layout thresholds, not device detection. Prefer content fit when a viewport is zoomed or a panel is open.

| Width | Navigation and content |
| --- | --- |
| Below 640 px | Compact top bar; menu button opens modal navigation; one column; 16 px gutters; full-width primary action where useful |
| 640–1023 px | Collapsed navigation drawer; 24 px gutters; one reading column; two columns only for short independent metadata |
| 1024–1279 px | Sidebar visible in app shell, including the prototype lesson; comparisons stack if each would be under 360 px |
| 1280 px and above | 224 px sidebar; wide evidence; lab may use challenge/workspace split; mentor may use a side panel if reading width stays at least 600 px |

At 320 CSS px and 400% zoom, page content reflows without horizontal page scrolling. HTTP/code regions may scroll locally with a labeled focusable region and visible scroll affordance; provide optional soft wrap without changing copied text. Keep long paths/IDs from widening grids (`min-width: 0`). On phones comparisons stack and form fields remain readable at text zoom.

Lesson footer may stick only while it leaves content/focus unobscured. Add bottom safe-area/padding; with a virtual keyboard or short viewport let it flow naturally. Drawer/dialog content scrolls internally with an always reachable close button.

Mobile supports lessons, quizzes, theory, progress, skills, reports reading/basic drafting, and contextual mentor. Lab objective, notes, status, and instructions remain usable. Explain desktop requirements beside “Open target”; do not pretend a complex interception workflow works on a phone, block all learning on mobile, or claim cross-device resume for anonymous users. Suggest continuing in the same desktop browser or recording notes deliberately; do not invent an account feature.

## Accessibility requirements

Target WCAG 2.2 AA; automated scans supplement manual review.

- Provide skip-to-content, header/nav/main landmarks, one page h1, logical headings, breadcrumb nav, and `aria-current` on the current destination/lesson.
- Every flow works with keyboard alone. Preserve native radio arrow-key behavior. Use real tables with headers for tabular skill/report data; use lists for progression.
- Focus remains visible and unobscured under sticky chrome. Route changes move focus to the new main heading; explicit lesson-step changes focus its heading. Background refresh never steals focus.
- Modal navigation/mentor/reset dialogs label themselves, contain focus, make background inert, close on Escape when safe, and restore focus. Unsaved changes require a clear keep/edit/discard choice when the app controls navigation.
- Associate labels, descriptions, constraints, and errors programmatically. On failed submit, focus an error summary linked to fields; retain answers. Announce asynchronous saved/results status politely; urgent failures use an alert once, not repeatedly.
- Do not announce token-by-token mentor output or every lab poll. Announce meaningful status transitions. Provide text equivalents for progress and differences. Hide purely decorative icons from assistive technology.
- Reduced motion removes slide/scale effects, shimmer, smooth scrolling, and animated progress. Ordinary transitions, when allowed, are 120–180 ms and never required to understand state.
- Text spacing overrides, zoom, forced-colors mode, and screen readers must preserve controls and reading order. Native outline/border fallbacks remain visible in forced colors.
- Alternative interactions replace future drag-only activities. No time-limited quiz UI. Lab expiry has an explicit time and warning without a constantly announced countdown; notes must not disappear with the lab.
