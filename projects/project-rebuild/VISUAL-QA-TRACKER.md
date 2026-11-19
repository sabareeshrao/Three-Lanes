# Project-Rebuild — first five historical commits · QA tracker

Source: https://github.com/sabareeshrao/Project-Rebuild  
Three-Lanes folder: `projects/project-rebuild/`  
Scope: **five earliest genuine commits, fourteen one-file steps**, not ten real commits.

## Historical coverage

| Commit | Immutable source SHA | Files / step IDs | Changed lines | Instructional step lines |
|---|---|---|---:|---|
| 1 | `daaa0c5a9eca7334c73dd224d8bc36f07c63b2f8` | README.md · 1.1 | 27 | 27 |
| 2 | `603875d9d6dba28142865a1099d9bb194b4984f7` | .gitignore, README, pyproject, __init__ · 2.1–2.4 | 43 | 10, 15, 20, 1 |
| 3 | `464f68b46663b5f57de1c38781c995b3c57b509f` | example, lesson, tensors.py · 3.1–3.3 | 44 | 8, 23, 13 |
| 4 | `fcee5a141a735fb0609891d6e07d30bc78f183e0` | tests/test_tensors.py · 4.1 | 17 | 17 |
| 5 | `f260dc8059da1bc079e5ab46d56c02fda7914ad0` | README, example, lesson, tensors, tests · 5.1–5.5 | 61 | 14, 8, 22, 10, 22 |
| **Total** | **5 SHAs** | **14 file-specific steps** | **192** | **All ≤ 100** |

Every original added/deleted patch line is assigned to exactly one source file and step; each source file's old/new coordinate pairs are in `lessons.json`. Complete changed-file inventory and counts are in `coverage-audit.json`. The diff is neither sampled nor invented.

## Quality verification

- [x] Five real historical SHAs, in oldest-to-newest order
- [x] Exact changed-file inventory, no file merged across substeps
- [x] Full original unified patches and source snapshots at historical SHAs
- [x] All 192 additions/deletions mapped to old/new source coordinates
- [x] Fourteen diagrams authored separately, source-specific and in light Petclinic style, with duplicate background grids and filler footers removed
- [x] All substeps below 100 instructional code/diff lines
- [x] Original root Three-Lanes CSS reused directly; the two-visual-lane shell and source inspector are preserved; no prototype changes
- [x] Representative historical file snapshots spot-checked byte-for-byte against original GitHub source (1.1, 2.2, 3.3, 5.4, 5.5)
- [x] Original root prototype and nested viewer structural ID audit: all 55 IDs preserved, plus two mentor IDs
- [ ] Browser screenshots of this **nested viewer** at 1440px and 390px inspected manually
- [ ] Click/keyboard/scroll interactions independently exercised in a rendered browser
- [ ] Each diagram manually reviewed for balance and technical semantics

**Status:** Source-data and design implementation complete. Browser-level inspection of the *new project route* is still an open acceptance task, separate from the existing root prototype's automatic smoke test. Do not mark visual/manual QA PASS until actual inspection occurs.

## How to validate

```bash
node projects/project-rebuild/tests/validate.mjs
npm run audit:design
npm run test:visual
```

The project's static source validator enforces 14 file scopes, real SHA links, 192 changed lines, original DOM element parity, shared original stylesheet, and transparent SVG safety/weight. The root smoke test covers the root prototype and illustration catalog but does not automatically inspect this nested viewer.

## Source inspector / rail regression fix

- [x] Source inspector opens by default below the shared controls
- [x] Changing commit or file does not close source or reset View/Commit changes
- [x] Commit belt shows ordinal numbers; actual SHA remains in summary and original links
- [x] Added project-local static regression checks for default source visibility and numeric chips
- [ ] Browser verification for source persistence and numbered rail across steps
