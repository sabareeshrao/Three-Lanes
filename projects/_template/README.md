# New Three-Lanes project folder — starter template

Copy this directory to `projects/<slug>/` for **one new GitHub repository**.

**Start with:** [../../HANDOVER-NEW-PROJECT.md](../../HANDOVER-NEW-PROJECT.md).

## Central catalog required in new projects

Import [../../design-system/tokens.css](../../design-system/tokens.css) using a route-correct URL. Read [../../design-system/README.md](../../design-system/README.md) and [../../design-system/registry.json](../../design-system/registry.json). Reuse approved visual patterns, create candidate patterns for new mechanisms and secure approval before reusing them. Keep the commit conveyor scrollable with its scrollbar hidden. Run both automated quality checks and review screenshots.

## Open-ended illustration rule (latest)

**Before creating diagrams, consult the 50 modular illustrations in `illustration-library/catalog.json` and their SVG source files. They are individual building blocks with stable IDs, not a whitelist. You MAY reuse, combine, alter or invent new SVG components and original diagrams without candidate approval or catalog registration. Assign unique IDs and keep source fidelity, accessibility, thin arrows (≤3px connector stroke; ≤12px arrowheads), no collisions or clipping, and desktop/mobile screenshot QA.** Prior text requiring an *approved pattern ID*, *candidate registration* or *SVG click-to-focus* is superseded for the root prototype. No generic text-only box drawings. The fixed design tokens and one-file-per-step rule still apply.

## Required 10-commit quality gate

Read [../../DIAGRAM-QUALITY-STANDARD.md](../../DIAGRAM-QUALITY-STANDARD.md) before producing any diagram or frontend UI. Work in **10 real commits per batch**; the first three should be visual showpieces, and **all ten** must be distinctive, source-accurate and free of overlapping/clipped text, bulky arrows, unreadable mobile labels and nonfunctional navigation.

Use the supplied [VISUAL-QA-TRACKER.md](./VISUAL-QA-TRACKER.md) to audit the source and visual at 1440px and 390px, verify SVG click-to-open/click-again-to-close and vertical scroll stability, and record defects and completion for each commit. Do not call the batch complete until **10/10** commits pass these checks.

## Mandatory one-file steps and scrolling commit conveyor

Each numbered learning step covers **exactly one changed file**. For a real commit touching 20 files, make at least 20 numbered substeps under its original SHA. Never combine changes from different files (including tests and config). If any one file contains more than 100 instructional lines, break THAT file into smaller substeps. Renames count as one file with old/new paths; binary assets have their own metadata-only step. Audit the verified complete commit to ensure every file and changed line is covered.

With many commits or substeps, the middle commit conveyor is **vertically scrollable inside a fixed-height rail**, its header stays in place, and the selected step is kept visible by scrolling ONLY the rail. Do not expand the page or shift either visual lane. Preserve the current rail scroll offset on ordinary redraws.

Semantic chips: backend blue; frontend green; full-stack **orange, not yellow**; unselected commits neutral.

## Maximum 100 instructional code lines per subcommit

**Read [../../SUBCOMMIT-100-LINE-RULE.md](../../SUBCOMMIT-100-LINE-RULE.md).** For large source commits, create as many numbered **learning subcommits** as necessary. Each may show **no more than 100 total code/diff lines across every file and snippet** (context + deletions + additions). Audit that **all** actual changed lines are covered and that real SHA, paths and old/new line coordinates remain intact. The whole original commit/diff remains externally accessible. Track counts and completeness in `VISUAL-QA-TRACKER.md`. The count of real GitHub commits stays at 10 per batch regardless of how many subcommits you make.

## Commit timeline behavior for large histories

The middle commit lane must be height-limited with its **own vertical scrollbar**, showing the selected real commit's complete subcommit list inside it. With 100+ learning steps, the overall viewer height stays stable. Preserve rail scroll position during normal re-renders and scroll the rail alone (never the entire page) to keep the active step visible on keyboard navigation. Use the implemented CSS/JS in `projects/spring-petclinic/shared/` as a reference when implementing the generic project loader.

## Files

- `project.json`: repository and project identity; the replacement for hardcoded Petclinic URLs.
- `commits.json`: historical commit SHA metadata and specific teaching substeps.
- `source-links.json`: exact historical file/symbol/dependency references keyed by SHA and step.
- `visuals.json`: pointers from SHA + step to reusable SVG/HTML assets.
- `svg/`: copy/paste new or existing SVG diagrams.
- `frontend-ui/`: copy/paste focused standalone HTML UI simulations.

These files are **starter schemas**, not a plug-and-play connected app yet. The current Petclinic implementation has Petclinic-specific logic in `src/app.js` and `src/navigation/code-navigation.js`. The project loader described in the handover must be implemented before the viewer can consume these JSON files.

## How to start

1. Duplicate `projects/_template/` to `projects/my-project/`.
2. Fill `project.json` with the actual GitHub owner/name and project title.
3. Choose and verify immutable 40-character commit SHAs. Record actual steps and file paths in `commits.json`; no guessed code.
4. Add only validated SHA-specific source definitions and dependencies to `source-links.json`.
5. Copy finished diagrams to `svg/` and HTML previews to `frontend-ui/`. Add references in `visuals.json`.
6. Connect these files through the shared engine; test navigation, source line links, full Before/After, scroll position and deployment.

## Expected data shapes

`commits.json` contains `{"commits":[{"sha":"<full-sha>","title":"...","steps":[{"id":"1.1","title":"...","lane":"backend","file":"src/...","symbol":"..."}]}]}`.

`source-links.json` uses `{"byCommitStep":{"<full-sha>:1.1":[{"label":"Controller","role":"controller","file":"src/...","needle":"qualified method signature"}]}}`.

`visuals.json` uses `{"byCommitStep":{"<full-sha>:1.1":{"backend":"./svg/architecture.svg","frontend":"./frontend-ui/preview.html"}}}`. Only include a lane that actually has an appropriate visual.

Never use commit numbers by themselves as unique IDs across different repositories. The intended stable key is `<full-SHA>:<step-id>`.

## Run/deploy notes

GitHub Pages needs all script/style/asset paths to resolve correctly from the project route. Relative links in the current root `index.html` are not automatically valid under a nested folder. The shared viewer must explicitly support project routes and project-relative assets before any nested project page is declared ready.
