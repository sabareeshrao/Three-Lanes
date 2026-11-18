# Visual QA Tracker — 10-Commit Batch

> Copy into `projects/<slug>/VISUAL-QA-TRACKER.md`. Mandatory review artifact for each batch.
> Read `../../DIAGRAM-QUALITY-STANDARD.md` and root `AGENTS.md`. Do not mark PASS without source, visual and interaction checks.

## Batch metadata

- Project: `<slug>`
- Target GitHub repository: `<owner>/<repo>`
- Batch: `001` (10 *distinct real commits*, not 10 substeps)
- Status: **IN PROGRESS**
- Completed: **0/10**
- Reviewer / review date: not yet reviewed

## Per-commit tracker

| Batch position | Full 40-character SHA | Step IDs / asset paths | Distinct visual technique | Source/line verified | 1440px checked | 390px checked | SVG/source toggle + scroll checked | Status / defects |
|---|---|---|---|---|---|---|---|---|
| 01 · SHOWCASE | — | — | — | ☐ | ☐ | ☐ | ☐ | TODO |
| 02 · SHOWCASE | — | — | — | ☐ | ☐ | ☐ | ☐ | TODO |
| 03 · SHOWCASE | — | — | — | ☐ | ☐ | ☐ | ☐ | TODO |
| 04 | — | — | — | ☐ | ☐ | ☐ | ☐ | TODO |
| 05 | — | — | — | ☐ | ☐ | ☐ | ☐ | TODO |
| 06 | — | — | — | ☐ | ☐ | ☐ | ☐ | TODO |
| 07 | — | — | — | ☐ | ☐ | ☐ | ☐ | TODO |
| 08 | — | — | — | ☐ | ☐ | ☐ | ☐ | TODO |
| 09 | — | — | — | ☐ | ☐ | ☐ | ☐ | TODO |
| 10 | — | — | — | ☐ | ☐ | ☐ | ☐ | TODO |

For every item, inspect all changed visual substeps, not only the first one.

## Mandatory checks

- [ ] 10 unique immutable SHAs, all changed files and code claims verified
- [ ] All visual assets live in modular SVG/HTML files and have correct manifest mapping
- [ ] First 3 commit visuals exceptionally clear and compositionally distinct; all 10 purpose-built
- [ ] No generic text-in-box diagrams, repetition, off-canvas SVG, clipped text, overlap or oversized arrows
- [ ] Actual desktop and mobile visual inspection documented
- [ ] All existing and new GitHub source links target the appropriate historical SHA and line
- [ ] SVG/source preview opens, closes on second click, switches targets and preserves vertical position
- [ ] View/GitHub/Before-After and keyboard navigation pass regression tests
- [ ] Changes are committed and the deployment (if requested) actually verified

## Issues and proof

Document inspected images/screenshots (where available), test commands/results, broken checks and links to fixes. Do not assert "10/10 quality" without an actual independent review. If any critical check fails, keep the batch **IN PROGRESS**, listing blocked commit IDs and next actions.
