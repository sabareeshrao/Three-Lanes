# Project-Rebuild — nanoGPT commit lessons in Three-Lanes

**[Launch nested viewer](https://sabareeshrao.github.io/Three-Lanes/projects/project-rebuild/)**  
Original source repository (read-only): https://github.com/sabareeshrao/Project-Rebuild

This standalone Three-Lanes project explains the **first five historical commits** of an original, learning-first nanoGPT implementation. The code belongs to the source repository; these visualization files live only in `sabareeshrao/Three-Lanes/projects/project-rebuild/`.

## The first five commits

1. `daaa0c5a` — establish an independent GPT learning roadmap.
2. `603875d9` — installable Python/PyTorch project and setup docs.
3. `464f68b4` — represent token IDs as two-dimensional PyTorch tensors.
4. `fcee5a14` — test batch dimensions and integer dtype.
5. `f260dc80` — make one-token-shifted input/target pairs.

These five real commits require **14 teaching steps** because each changed file owns a separate lesson. All 192 original additions/deletions appear in exact source diffs with line coordinates. No fake frontend UI is shown for this Python project.

## Viewer behavior

The left lane displays a source-specific lightweight blueprint diagram; the middle lane scrolls vertically through the five SHAs and their numbered file-scoped steps; the right lane shows authentic source snapshots and the complete changed-file diff. Use **View / Commit changes**, **Before / After**, **Open file** at an immutable SHA, previous/next buttons or left/right keyboard arrows. Mentor explanations are collapsible. On mobile, switch between the Visual and Source panes while the commit rail remains accessible.

## Folder contract

- `project.json` — repository configuration.
- `commits.json` — five genuine GitHub commits and their files.
- `lessons.json` — all 14 steps, genuine source snapshots, patches and file-only coordinates.
- `source-links.json` — SHA-pinned per-file locations.
- `visuals.json` — one diagram path per file step.
- `svg/` — 14 individually authored SVGs matching the Three-Lanes light blueprint look.
- `coverage-audit.json` and `VISUAL-QA-TRACKER.md` — provenance and acceptance checklist.
- `tests/validate.mjs` — local source/asset integrity check.

New batches should start from the sixth chronological source commit, retain real SHAs and split any file with more than 100 diff/code lines. **Do not copy, overwrite or change the root Petclinic prototype.**
