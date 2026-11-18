# New Three-Lanes project folder — starter template

Copy this directory to `projects/<slug>/` for **one new GitHub repository**.

**Start with:** [../../HANDOVER-NEW-PROJECT.md](../../HANDOVER-NEW-PROJECT.md).

## Required 10-commit quality gate

Read [../../DIAGRAM-QUALITY-STANDARD.md](../../DIAGRAM-QUALITY-STANDARD.md) before producing any diagram or frontend UI. Work in **10 real commits per batch**; the first three should be visual showpieces, and **all ten** must be distinctive, source-accurate and free of overlapping/clipped text, bulky arrows, unreadable mobile labels and nonfunctional navigation.

Use the supplied [VISUAL-QA-TRACKER.md](./VISUAL-QA-TRACKER.md) to audit the source and visual at 1440px and 390px, verify SVG click-to-open/click-again-to-close and vertical scroll stability, and record defects and completion for each commit. Do not call the batch complete until **10/10** commits pass these checks.

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
