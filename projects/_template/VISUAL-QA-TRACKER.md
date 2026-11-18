# Visual QA Tracker — 10-Commit Batch

> Copy into `projects/<slug>/VISUAL-QA-TRACKER.md`. Mandatory review artifact for each batch.
> Read `../../DIAGRAM-QUALITY-STANDARD.md`, `../../SUBCOMMIT-100-LINE-RULE.md`, and root `AGENTS.md`. Do not mark PASS without full source coverage, a maximum of 100 code/diff lines per learning subcommit, and visual/interaction checks.

## Batch metadata

- Project: `<slug>`
- Target GitHub repository: `<owner>/<repo>`
- Batch: `001` (10 *distinct real commits*, not 10 substeps)
- Status: **IN PROGRESS**
- Completed: **0/10**
- Reviewer / review date: not yet reviewed

## Per-commit tracker

Each real commit must be split into as many meaningful **learning subcommits** as needed. The hard limit is **100 total instructional code/diff lines per subcommit**, including added, deleted and context lines across all files. Never create additional fake Git commits, and never truncate the original changes. Full GitHub source/diff archival views may remain longer than 100 lines.

| Position | Full 40-character SHA | Actual diff code-line count | Subcommit count / IDs | Max subcommit lines (≤100) | All changed lines assigned? | 1440px / 390px tested? | Navigation & scroll tested? | Visual QA status |
|---|---|---:|---|---:|---|---|---|---|
| 01 · SHOWCASE | — | — | — | — | ☐ | ☐ | ☐ | TODO |
| 02 · SHOWCASE | — | — | — | — | ☐ | ☐ | ☐ | TODO |
| 03 · SHOWCASE | — | — | — | — | ☐ | ☐ | ☐ | TODO |
| 04 | — | — | — | — | ☐ | ☐ | ☐ | TODO |
| 05 | — | — | — | — | ☐ | ☐ | ☐ | TODO |
| 06 | — | — | — | — | ☐ | ☐ | ☐ | TODO |
| 07 | — | — | — | — | ☐ | ☐ | ☐ | TODO |
| 08 | — | — | — | — | ☐ | ☐ | ☐ | TODO |
| 09 | — | — | — | — | ☐ | ☐ | ☐ | TODO |
| 10 | — | — | — | — | ☐ | ☐ | ☐ | TODO |

### Per-subcommit source coverage audit

Duplicate the following row for **every** learning subcommit of **every** real commit, not only the first ten steps.

| Step ID | Real commit SHA | Source file and exact diff hunk / old–new ranges | Instructional diff/code lines (1–100) | Changed lines assigned / accounted for | Visual asset | Desktop/mobile visual review | Exact source links / SVG toggle | Pass / defects |
|---|---|---|---:|---|---|---|---|---|
| 1.1 | — | — | — | — | — | ☐ | ☐ | TODO |

**Coverage proof:** for each commit, compare the union of all assigned changed line coordinates against the **complete verified diff**. Report any missing, duplicated or unavailable changed lines explicitly. A 1,000+ line commit may require 10, 20 or more subcommits. The count is governed by semantic boundaries and the 100-line cap, not an arbitrary upper limit.

## Mandatory checks

- [ ] 10 unique immutable SHAs, all changed files and code claims verified
- [ ] Every real commit split into logical numbered subcommits of **at most 100 total instructional code/diff lines** (added + removed + context; summed across files)
- [ ] Every changed source line of the **complete historical diff** assigned to an audited subcommit, including old/new coordinates and rename/deletion handling
- [ ] Actual code/diff line count recorded for **each subcommit**; full original source/diff remains reachable
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
