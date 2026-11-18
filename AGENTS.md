# AGENTS.md — Three-Lanes coding-agent instructions

> **Read this file before modifying the repository.** This is the entry point for AI coding agents (including agents that discover root `AGENTS.md`). For the complete project contract, read [HANDOVER-NEW-PROJECT.md](./HANDOVER-NEW-PROJECT.md) and [projects/_template/README.md](./projects/_template/README.md).
>
> These are repository instructions, not proof of implementation. The new-project JSON template is **not yet connected to a generic runtime loader**; the current running viewer remains Spring Petclinic-specific.

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
