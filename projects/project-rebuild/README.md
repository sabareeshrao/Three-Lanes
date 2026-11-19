# Project-Rebuild — nanoGPT commit lessons in Three-Lanes

**[Continue from commit 6 — detailed AI handover](./HANDOVER-NEXT-COMMITS.md)**

**[Launch nested viewer](https://sabareeshrao.github.io/Three-Lanes/projects/project-rebuild/)**  
Original source repository (read-only): https://github.com/sabareeshrao/Project-Rebuild

This prototype-compatible Three-Lanes project explains the **first five historical commits** of an original, learning-first nanoGPT implementation. The code belongs to the source repository; these visualization files live only in `sabareeshrao/Three-Lanes/projects/project-rebuild/`.

## The first five commits

1. `daaa0c5a` — establish an independent GPT learning roadmap.
2. `603875d9` — installable Python/PyTorch project and setup docs.
3. `464f68b4` — represent token IDs as two-dimensional PyTorch tensors.
4. `fcee5a14` — test batch dimensions and integer dtype.
5. `f260dc80` — make one-token-shifted input/target pairs.

These five real commits require **14 teaching steps** because each changed file owns a separate lesson. All 192 original additions/deletions appear in exact source diffs with line coordinates. No fake frontend UI is shown for this Python project.

## Viewer behavior

The **original Three-Lanes prototype HTML and shared CSS** define the interface. Just like the Petclinic viewer, it has two fixed-height visual canvases and a **narrow middle conveyor** displaying real SHA chips and file-specific substep chips. The left visual is a source-grounded lightweight SVG; the right visual shows the genuine Python example, documented setup, or expected behavior (not a fictional browser frontend). The one **shared source-control bar** below the three columns opens full-width **Before / After** source or complete **Commit changes** with real GitHub line coordinates. Clicking the same mode again closes it, and **Open file** targets the original SHA. Mentor explanations are optional dropdowns that do not resize the 700px lanes. Keyboard navigation and the original mobile lane selector remain available.

## Folder contract

- `project.json` — repository configuration.
- `commits.json` — five genuine GitHub commits and their files.
- `lessons.json` — all 14 steps, genuine source snapshots, patches and file-only coordinates.
- `source-links.json` — SHA-pinned per-file locations.
- `visuals.json` — one diagram path per file step.
- `svg/` — 14 individually authored SVGs matching the Three-Lanes light blueprint look.
- `coverage-audit.json` and `VISUAL-QA-TRACKER.md` — provenance and acceptance checklist.
- `tests/validate.mjs` — local source/asset integrity check.

**Implementation policy:** `index.html` is a closely preserved copy of the original root prototype markup, `styles.css` contains only project-specific additions, and the full UI skin is imported directly from `../../styles/app.css`. Do not introduce a separate visual design, custom main grid, or independent commit rail. Source-level structural parity is checked against all 55 original element IDs.

New batches should start from the sixth chronological source commit, retain real SHAs and split any file with more than 100 diff/code lines. **Do not copy, overwrite or change the root Petclinic prototype.**
