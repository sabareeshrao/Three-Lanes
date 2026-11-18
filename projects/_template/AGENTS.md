# AGENTS.md — instructions for a new project folder

This file is intentionally copied from `projects/_template/AGENTS.md` into each `projects/<slug>/`.

Before doing work here, also read the repository root **AGENTS.md** and **HANDOVER-NEW-PROJECT.md**; those define the required viewer features and nonregression tests.

## Mandatory 10-commit diagram quality

**Before building visuals, read `../../DIAGRAM-QUALITY-STANDARD.md` and follow it as a blocking acceptance test.** Create exactly **10 distinct verified commits per batch** (each may have multiple learning substeps), and do not trade diagram quality for speed. The **first three commits must be visual showpieces**; every other commit must also have purposeful, polished, technically faithful SVG/HTML, not repeated text-in-box flowcharts.

Inspect every visual at **1440px and 390px**: zero overlaps/clipping, readable text, controlled arrows, real code/line navigation, no invented frontend behavior, and preserved scroll position. Track all 10 in this folder's `VISUAL-QA-TRACKER.md` (included in the copied template). A batch is only COMPLETE when all 10 have passed source/visual/navigation review; otherwise give the accurate progress and unresolved defects.

## Mandatory max-100-line subcommits

Follow [../../SUBCOMMIT-100-LINE-RULE.md](../../SUBCOMMIT-100-LINE-RULE.md). Each **real historical commit** may be divided into unlimited numbered explanatory subcommits, e.g., `7.1` through `7.20`. **Each learning subcommit must contain at most 100 source/diff lines in total** (additions, deletions and context, summed across files). Break giant commits into more meaningful steps, never truncate, and confirm **every changed line** in the complete real diff is covered. Keep real SHA, original paths and both old/new line numbers, with a unique visual when appropriate. Record per-subcommit line counts and complete-diff coverage in the copied `VISUAL-QA-TRACKER.md`. Ten original SHAs still make one batch; these subcommits do not create Git history.

## Project initialization

1. Treat the project at `project.json` as the only source repository for this folder. Replace every `REPLACE_*` placeholder with actual verified details.
2. Populate `commits.json` with genuine full 40-character commit SHAs, real file paths and a stable step ID. No synthetic history, fake code, or assumed offsets.
3. Populate `source-links.json` with source file/symbol/dependency/test references *at that same SHA*. Verify that each file exists and that its target symbol and line are correct; handle parent revision for old-side diff.
4. Put approved diagrams in `svg/` and focused standalone HTML previews in `frontend-ui/`; connect them in `visuals.json` using `<sha>:<step-id>`. Reuse the library and shared engine instead of pasting giant visual strings into `index.html`.
5. The current general-purpose JSON project loader may not exist yet; inspect shared `src/` code. If missing, implement project-agnostic support centrally and regression-test the existing Petclinic demo.
6. Keep project-specific content isolated here. Do not overwrite or mix SHA keys across repositories.

## Commit rail with independent scrolling

When a real commit expands into dozens or hundreds of learning subcommits, **show every subcommit inside a fixed-height, independently scrollable middle commit lane**. Keep its header in place, use a subtle thin scrollbar and make the active subcommit visible by adjusting **only the rail's `scrollTop`**. Do not call `scrollIntoView()` on the document or make the entire page thousands of pixels taller. Preserve the rail scroll position when switching View/GitHub modes, changing source files or re-rendering the same step. Keep keyboard arrow navigation functional. For an implemented example, inspect `projects/spring-petclinic/shared/viewer.css` and `viewer.js`; do not modify the root prototype.

## Verification

Use the root handover's acceptance checklist. In particular: historical GitHub source lines, View/GitHub modes, default full-width View here Before/After, clickable SVG-source toggle, keyboard controls, preserved scroll, responsive UI, and accurate source dependencies. Report verifiable links and exact commit SHAs. Never claim a GitHub Pages site is published before verifying it.

Start implementing the user's specific project request once the target repo and goal are provided; don't ask them to re-paste the handover.
