# AGENTS.md — Three-Lanes coding-agent instructions

> **Read this file before modifying the repository.** This is the entry point for AI coding agents (including agents that discover root `AGENTS.md`). For the complete project contract, read [HANDOVER-NEW-PROJECT.md](./HANDOVER-NEW-PROJECT.md) and [projects/_template/README.md](./projects/_template/README.md).
>
> These are repository instructions, not proof of implementation. The new-project JSON template is **not yet connected to a generic runtime loader**; the current running viewer remains Spring Petclinic-specific.

## Modular SVG construction — newer rule, supersedes every approved-pattern restriction

**The diagram vocabulary is OPEN.** Read [illustration-library/README.md](./illustration-library/README.md), the 50 individually addressable assets in [illustration-library/catalog.json](./illustration-library/catalog.json), and canonical design tokens. Each database, CPU, RAM module, server, arrow, table and web browser is its OWN reusable source SVG and stable ID. Agents may reuse, recolor, combine, adapt or entirely invent any new diagram or illustration with a unique descriptive ID. **No whitelist, prior registration, candidate status or approval is required to create, use, commit or publish a novel SVG.** The six diagrams in `design-system/registry.json` are optional historical reference compositions, not the only permitted designs.

**Non-negotiable quality, not restricted subject matter:** real source accuracy, thin uncluttered connectors (ordinary flow strokes ≤3 px in a 640×400 canvas), compact arrowheads (≤12 px long), no arrows through labels or objects, no clipping at the viewport edges, no overlapping text and no huge empty/top-heavy space. Use a reasonable central composition and inspect actual desktop/mobile screenshots. Validate SVG accessibility (viewBox, title, desc), no scripts/remote resources, and visual geometry. Each teaching substep still covers exactly one changed source file with ≤100 instructional code lines. Do not use click-to-source SVG behavior in the root prototype.

## Mandatory AI design-system bootstrap (highest priority)

**Read first:** [design-system/README.md](./design-system/README.md), [design-system/registry.json](./design-system/registry.json), [design-system/tokens.css](./design-system/tokens.css). Use their canonical Apple-style fonts, charcoal panels, blue/green/**orange** semantic chips, continuous SVG blueprint canvas, fixed lane height and invisible-but-scrollable commit conveyor. New project entrypoints must import tokens. New SVGs must have a unique ID and design version, with viewBox/title/description. New mechanisms may be illustrated freely and are not limited to the reference catalog. **Run `npm run audit:design`, `npm run test:visual`, inspect screenshots and verify historical source** before claiming QA. This section overrides conflicting older guidance. Root SVGs are static, without click-to-focus source.

## Hard rule — split large real commits into ≤100-line learning subcommits

**Read [SUBCOMMIT-100-LINE-RULE.md](./SUBCOMMIT-100-LINE-RULE.md) before selecting or processing commits.** Every real commit, including one with thousands of changed lines, must be decomposed into semantically coherent **numbered learning subcommits** (`1.1`, `1.2`, …). A learning subcommit shows **at most 100 code/diff lines in total across its source snippets and files** (count added, removed and context; no 101-line segments). Split any larger section again rather than truncating it or shrinking it into an illegible diagram. Source archival views may still show full authentic diffs/files.

**Cover every changed text line** of the verified complete real commit diff across those subcommits, preserve original old/new coordinates and commit/parent SHA, and record line counts plus coverage in the project's QA tracker. No upper limit on the subcommit count. A 10-commit batch still means **10 distinct original GitHub SHAs** regardless of substep count; these learning subcommits are not new Git commits. Do not claim complete unless the complete code coverage has been audited.

## Required: exactly one changed file per learning substep

**ONE step = exactly ONE changed file.** A historical GitHub commit changing N files requires at least N numbered learning substeps, all referencing that same real commit SHA. Split by canonical changed-file path BEFORE splitting by functionality. A controller and its test, two XML files, or Java and HTML must never be combined in one learning step.

- Each step's focused diff/code, mentor explanation, visualization, and source lines belong to its single owning file. Other changed files can be named as context only; their changed code must have a separate step.
- If ONE file exceeds 100 instructional code/diff lines, split that same file into multiple sequential steps. Never relax the 100-line cap and never impose an arbitrary step-count limit.
- A rename/move counts as one logical file with both old and new paths. Binary assets each receive their own file-scoped metadata step, with zero invented code lines.
- Audit complete GitHub commit file inventory and diff coordinates: every changed file needs at least one step; every changed line belongs to a step for that file. A multi-file step, missing changed file/line, absent canonical file owner, or more than 100 instructional lines fails QA.
- The archival full-commit source view may show all files, but the focused teaching step must not mix changed files.

**Chip color contract:** backend blue, frontend green, full-stack ORANGE (#EA580C / #F97316), never yellow. Inactive commit chips are neutral charcoal with a subtle category edge.

**Commit conveyor belt:** when there are many commits/substeps, the middle rail has a fixed-height, independently VERTICALLY SCROLLABLE list with a stationary heading. Mouse wheel, touch, keyboard and selected-step navigation scroll only the rail, not the backend/frontend panels or the whole page. Keep the selected step visible without snapping the page or resetting scroll unnecessarily.

## Mandatory 10-commit visual-quality gate

**Every request for a batch of 10 commits must comply with [DIAGRAM-QUALITY-STANDARD.md](./DIAGRAM-QUALITY-STANDARD.md).** Read that file before selecting commits or drawing any visual. This is a blocking review gate, not optional guidance:

- Exactly **10 distinct real commits per batch**, with genuine full SHAs; a multi-step commit still counts as one commit. Create a purposeful visual for every meaningful changed substep.
- **First three commits are showcase quality** (extraordinary layouts and technical clarity), but all ten must meet the same strict standard. Never compromise visual quality for volume.
- No generic repeated three-box flowcharts, text stuffed into rectangles, dull diagrams with only headings changed, overlapping labels, clipping, minuscule text, bulky arrowheads, illegible mobile layouts or meaningless decorations. Use actual mechanism-specific drawings: real interface states, architecture, request/response flows, data transitions, object graphs, SQL constraints, lifelines, and Before/After results as supported by source.
- Source integrity wins: every diagram and UI preview must depict what the exact SHA supports; verify historical code links and semantic SVG-to-code navigation. Do not fabricate a frontend screen for a backend-only change.
- Render, visually inspect and fix **every visual at 1440px desktop and 390px mobile**. Test same-click-to-close SVG previews, controls, GitHub diff and viewport persistence. Do not claim this was done without actual tests.
- Each new project inherits **`projects/_template/VISUAL-QA-TRACKER.md`**. Mark each commit PASS only after source, visual and navigation gates pass; keep the whole batch IN PROGRESS until all **10/10** pass. Record evidence, failures and screenshots when available.
- Store files modularly under the project-specific `svg/` and `frontend-ui/` folders, mapped to stable `<SHA>:<step-id>` identifiers.

If any quality gate is blocked, report the true completion count and remaining defects instead of declaring the batch done.

## Mission

Turn this repository into a reusable, modular **Three-Lanes visual commit learning platform**. Each target GitHub repository gets its own folder under `projects/<slug>/`. Reuse a common viewer, CSS, navigation, source inspection, SVG/HTML visual libraries, and tests. **Never create another monolithic copy of `index.html` for each project.**

**When asked to build a new project, or when the user's task provides a GitHub repository URL:**
1. Read this `AGENTS.md`, the full handover, the template README, and relevant current source modules. Inspect GitHub files instead of assuming the handover is perfectly up-to-date.
2. Identify the target repository's actual GitHub `owner/repo`, technologies, and existing historical commits. Use the user's requested project name, or derive a safe nonconflicting slug from the repository name.
3. Create `projects/<slug>/` from `projects/_template/` and populate its project metadata, verified immutable commit SHAs, steps, source references, and visual asset registry.
4. If a reusable project loader is still missing, implement/extend it in **shared `src/` modules**, with repository-aware source URLs and a project-scoped state key. Migrate the working Petclinic data as needed **without breaking the default demo**.
5. Prefer one SVG or focused standalone HTML visual **per relevant change**, stored in the project asset folders and selected by stable `SHA:step-id`. Reuse existing assets when appropriate; do not invent user-facing frontend source on backend-only changes.
6. Implement only code links whose file, symbol and line can be resolved at the **selected historical SHA**; use the selected commit's parent SHA for the *before* side when appropriate. Related dependencies and tests must be real.
7. Run checks and regression tests, update README/docs, commit changes to the requested repository/branch, and provide exact repository and Pages links. **Do not claim deployment or browser verification unless actually confirmed.**

Proceed with the substantive task autonomously when the repository and goal are supplied. Avoid asking the user to copy instructions from chat or repeat context already present here. When essential information is absent (e.g., no target repository), request only that missing input. Never assume write/deploy permissions or silently target a different repository.

## Required behavior — nonregression contract

- Three lanes: **backend architecture SVG** on the left, **commit/substep timeline** in the middle, **focused frontend preview** on the right.
- ChatGPT-style dark theme, readable and properly clipped rounded corners. No fog, floating help tooltips, redundant captions or diagram text overlapping boxes.
- Timeline chip colors: **blue backend**, **green frontend**, **orange full-stack**.
- **View** shows a focused clean code view; **GitHub** shows authentic commit details. Both retain diagrams/previews.
- In GitHub mode **View here** is the default and opens the **full-width Before/After source inspector directly below the visual lanes**; retain working **Commit changes** and **Original source** options. Do not duplicate the diff above the Before/After comparison.
- Every displayed GitHub source line/link is SHA-pinned and historically accurate. Preserve parent/old side revisions, complete raw-file access, and relevant diff hunks.
- Clicking a linked SVG label/icon opens its exact-code preview; **clicking it again closes**, clicking a different element changes the preview, and **×** closes it. Relevant dependency/test links open their real historical definitions.
- Arrow-key step navigation, selected step persistence, and **fixed vertical scroll level** through step changes, mode changes, and asynchronous updates.
- Responsive layout, full natural page height, no shaking/jitter or unnecessary inner vertical scrolling; never leak `undefined` or invented source text into the UI.

## Source-of-truth files

| Location | Purpose |
| --- | --- |
| `index.html` | Current slim HTML shell (preserve existing DOM contracts) |
| `src/app.js` | Current Petclinic-specific state, timeline, diff/source logic |
| `src/data/petclinic-demo.js` | Current curated 10-commit, 25-step Petclinic dataset |
| `styles/app.css` | Approved dark visual design |
| `src/visuals/backend-svg/petclinic-diagrams.js` | Current generated SVG diagrams |
| `src/visuals/frontend-ui/petclinic-previews.js` | Current UI simulations |
| `src/visuals/visual-registry.js`, `src/visuals/asset-library.js` | Optional drop-in saved assets |
| `visuals/svg/`, `visuals/frontend-ui/` | Existing copy/paste visual library |
| `src/navigation/source-manifest.js` | Petclinic-specific curated source/dependency relationships |
| `src/navigation/code-navigation.js` | Exact-code preview and SVG click/toggle navigation |
| `projects/_template/` | New project data/visual folder scaffold |
| `HANDOVER-NEW-PROJECT.md` | Full architectural plan and test checklist |
| `.github/workflows/pages.yml` | Existing static GitHub Pages deployment |

## New project data rules

Use `projects/<slug>/project.json`, `commits.json`, `source-links.json`, and `visuals.json` together. Project identifiers, SHA strings, file paths, source symbols, asset locations, and language/framework cues must be verifiable. The `projects/_template/` JSON files are an **intended contract**, not a currently functional loader. Implement adapters rather than hardcoding a new repo into Petclinic-specific functions.

For source links, use:
`https://github.com/<owner>/<repo>/blob/<40-character-SHA>/<file-path>#L<verified-line>`

Never link to `HEAD` for historical code, infer a missing line number, or treat an unrelated dependency as a true call edge. If a source or dependency cannot be verified, show an honest unavailable state. For large histories, paginate and cache exact revisions; add sharded indexing and timeline virtualization before claiming 100,000-commit support.

## Before you finish

- [ ] Existing root Petclinic demo still works (10 commits, 25 steps).
- [ ] Each changed step resolves its own source SHA, code, dependencies, and selected saved visuals.
- [ ] Source navigation opens / toggles closed; Before/After remains correct.
- [ ] Vertical scroll position remains stable and keyboard arrows navigate correctly.
- [ ] Layout works at desktop and mobile widths; no unexpected scrollbars/undefined.
- [ ] New project data is isolated to `projects/<slug>/`, shared logic stays shared.
- [ ] All browser-facing JS/CSS/asset paths resolve (especially under GitHub Pages subpaths).
- [ ] No deployment, screenshot or test result is asserted unless independently verified.

**Task execution note:** Do not spend the whole task restating this plan. Inspect, implement, test, commit and report the actual result. If the requested operation cannot be performed with current access, clearly report the blocker and leave existing work intact.


## Approved compact root prototype (November 2026)

The user explicitly approved simplifying the root prototype UI: remove the “VISUAL COMMIT TIMELINE” header subtitle, the “GITHUB SOURCE · 10 SELECTED COMMITS · STEP” summary line, Source Links cards, and the View/GitHub buttons beside Search. In the summary, show the semantic backend/frontend/full-stack chip **first**, then the commit title and brief explanation horizontally; retain the historical GitHub commit link. The single **Original source** action in that header opens the selected GitHub source file at its exact immutable revision (parent SHA for a deleted file). In both source lanes keep one compact horizontal toolbar: **View**, **Commit changes**, the file selector and **Open file**. No redundant inline Original source tab. Do not remove underlying SVG click-to-open/click-again-to-close exact-code previews or full-width Before/After view. Preserve the existing ten curated commits, 25 steps, dark theme, timeline chip colors, scroll persistence and responsive controls. This permission applies to the root prototype only; independent project pages remain separately scoped.


## Root prototype fixed-lane override — November 18, 2026

This newer user decision supersedes the older root-prototype instruction to show code bars below each lane and make SVG labels clickable. **Root prototype only:** keep the backend lane, middle commit rail, and frontend lane at one fixed 700px height (the step 7.1 reference), with clipped rounded corners; do not let any step cause vertical lane movement. Only horizontal panning is allowed inside the visual lanes. Place **one shared right-aligned source toolbar** across the full width below the three columns: View, Commit changes, changed-file selector and Open file. Render the chosen source in the full-width inspector beneath this toolbar, never inside the individual lanes. The active commit must stand out using its semantic color (blue backend, green frontend, orange full-stack), while inactive commits and inactive substeps are neutral charcoal. Highlight the exact active substep in white with an obvious pointer. SVG drawings must be static: remove SVG click-to-code focus, clickable labels, icons and source-peek popups. Keep the real historical GitHub file and commit links, keyboard navigation and actual frontend form interactions. Do not extend this override to independent project viewers.


## Root prototype continuous blueprint canvas (November 18, 2026)

The fixed-height architecture visuals, inactive/quiet illustrations, and focused frontend simulations must use **one full-height, uninterrupted light technical background** (same pale paper color, 24px dots, 120px grid). Do not paint a different opaque background inside individual generated SVGs that stops short of the visual frame. Quiet states must fill the entire visual container and center their text and illustration both vertically and horizontally. Technical SVGs should preserve proportions while centering in the entire fixed frame. Frontend micro-workbenches should use the same canvas underneath their real controls. Avoid gradient/solid horizontal seams, top-aligned orphan visuals, or extra empty lower halves. The 700px lane dimensions, shared bottom source bar, static diagrams, and semantic middle rail remain unchanged.
