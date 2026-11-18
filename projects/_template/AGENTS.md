# AGENTS.md — instructions for a new project folder

This file is intentionally copied from `projects/_template/AGENTS.md` into each `projects/<slug>/`.

Before doing work here, also read the repository root **AGENTS.md** and **HANDOVER-NEW-PROJECT.md**; those define the required viewer features and nonregression tests.

## Project initialization

1. Treat the project at `project.json` as the only source repository for this folder. Replace every `REPLACE_*` placeholder with actual verified details.
2. Populate `commits.json` with genuine full 40-character commit SHAs, real file paths and a stable step ID. No synthetic history, fake code, or assumed offsets.
3. Populate `source-links.json` with source file/symbol/dependency/test references *at that same SHA*. Verify that each file exists and that its target symbol and line are correct; handle parent revision for old-side diff.
4. Put approved diagrams in `svg/` and focused standalone HTML previews in `frontend-ui/`; connect them in `visuals.json` using `<sha>:<step-id>`. Reuse the library and shared engine instead of pasting giant visual strings into `index.html`.
5. The current general-purpose JSON project loader may not exist yet; inspect shared `src/` code. If missing, implement project-agnostic support centrally and regression-test the existing Petclinic demo.
6. Keep project-specific content isolated here. Do not overwrite or mix SHA keys across repositories.

## Verification

Use the root handover's acceptance checklist. In particular: historical GitHub source lines, View/GitHub modes, default full-width View here Before/After, clickable SVG-source toggle, keyboard controls, preserved scroll, responsive UI, and accurate source dependencies. Report verifiable links and exact commit SHAs. Never claim a GitHub Pages site is published before verifying it.

Start implementing the user's specific project request once the target repo and goal are provided; don't ask them to re-paste the handover.
