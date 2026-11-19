# HANDOVER — Continue nanoGPT Three-Lanes from Commit 6

**Implementation instruction for the next AI:** Read the files linked below, inspect the source repository at the immutable SHAs, then **implement source commits 6–10 in the existing Three-Lanes project folder and push the result to `main`**. Do not stop after merely suggesting a plan, and do not ask to redesign the UI. Report verified progress and any blocked checks.

## 1. Repository ownership, links and scope

- **WRITE ONLY:** `https://github.com/sabareeshrao/Three-Lanes/tree/main/projects/project-rebuild`
- **READ-ONLY ORIGINAL CODE:** `https://github.com/sabareeshrao/Project-Rebuild`
- **CURRENT PUBLISHED VIEWER:** `https://sabareeshrao.github.io/Three-Lanes/projects/project-rebuild/`
- **IMMUTABLE REFERENCE/PROTOTYPE:** `https://sabareeshrao.github.io/Three-Lanes/`
- Do not push to Project-Rebuild, touch the root prototype, alter Petclinic lessons, or modify root design files. Keep all changes scoped under `projects/project-rebuild/`.
- The root `AGENTS.md` describes a generic platform, but **the existing nanoGPT viewer and its project-specific UI constraints are already implemented**. Extend it; do not rewrite/refactor the UI as a new application.

## 2. Read these exact files, in this order

1. `AGENTS.md` and `projects/project-rebuild/AGENTS.md` (project-specific updates take precedence when they clarify the existing nanoGPT UI).
2. `HANDOVER-NEW-PROJECT.md`, `SUBCOMMIT-100-LINE-RULE.md`, `DIAGRAM-QUALITY-STANDARD.md`.
3. `design-system/README.md`, `design-system/tokens.css`, `illustration-library/catalog.json` (200 independent illustration ingredients, **not** a whitelist).
4. `projects/project-rebuild/index.html`, `app.js`, `styles.css`, `github-theme.css`, `syntax.js`.
5. `projects/project-rebuild/commits.json`, `lessons.json`, `source-links.json`, `visuals.json`, `coverage-audit.json`.
6. `projects/project-rebuild/VISUAL-QA-TRACKER.md`, `tests/validate.mjs`, `tests/syntax.mjs`.

## 3. VERIFIED CURRENT PROGRESS — do not redo

- Five *oldest* historical source commits (1–5) are already included; **14 one-file instructional steps and 14 SVG diagrams**.
- Current newest original commit: **#5** `f260dc8059da1bc079e5ab46d56c02fda7914ad0` — `feat: construct one-step-ahead prediction targets`.
- Existing covered source changes: **192 added/deleted lines** across **14 changed-file occurrences**.
- Frontend viewer is the original Three-Lanes 2-visual-canvas shell, narrow middle rail, and shared full-width source inspector below, with a **GitHub Dark color palette and syntax-highlighted Python/Markdown/TOML/source diffs**.
- Source inspector defaults **open** and stays open across commits/files/substeps. Source mode (`View` or `Commit changes`) must persist across navigation; it closes only on explicit user action.
- Presently the rail shows **ordinal commit numbers**, not SHA strings. The real full SHA stays in commit metadata, source URLs and GitHub links. An older line in project `AGENTS.md` or `README.md` mentioning SHA on the *chip face* is obsolete.
- Visual lanes and middle rail have fixed **700px** height; the source inspector height is **stable and viewport-aware** (minimum 430px). It can occupy almost a full viewport for code reading. Inner source areas scroll; wheel scrolling must be able to return to the page.
- `project.json` may still contain legacy theme metadata `chatgpt-dark`; the actual current palette comes from `github-theme.css` loaded after the shared styles. Preserve the GitHub Dark appearance rather than changing the geometry or following that stale metadata.
- The nested page has not received an independent confirmed desktop/mobile manual visual-interaction review; do not claim such a review was completed.

## 4. EXACT NEXT FIVE HISTORICAL COMMITS — verified chronologically

| Project commit # | Immutable source SHA | Original message | Changed files | Changed lines (+/-) |
|---:|---|---|---:|---:|
| 6 | `a8fbec715e7b50e56d14a423e4418f3b85b11283` | `feat: build a deterministic character vocabulary` | 4 | 66 (+66/-0) |
| 7 | `c995142808be5fbbca8f3cd972abfa43d2fa31c2` | `feat: encode and decode text with character IDs` | 4 | 69 (+69/-0) |
| 8 | `68bbc41373179cc8419f3ae60081e53704ce919f` | `feat: load a UTF-8 corpus into a token stream` | 5 | 68 (+68/-0) |
| 9 | `851ded3c6f98fe31431b9ace1aa5415260a05a1b` | `feat: split token streams into train and validation sets` | 4 | 72 (+71/-1) |
| 10 | `f8d57e6599a3502d1881002af219c78bca336832` | `feat: sample reproducible next-token training batches` | 5 | 123 (+122/-1) |
| **Next batch** | **5 distinct real SHAs** | | **22 file occurrences** | **398 changed lines** |

Source: use GitHub API `GET /repos/sabareeshrao/Project-Rebuild/commits/<full SHA>` or the corresponding historical commit page, including its parent SHA and entire changed-file inventory. GitHub's default commit listing is newest-first; **never treat it as chronological**. If an API patch is omitted/truncated, fetch the complete diff; mark anything unverifiable IN PROGRESS rather than fabricating it.

### Canonical file-to-step ownership (minimum step plan)

| Commit | Required single-file substeps, each owned by its exact changed file |
|---|---|
| **6** | `6.1` examples/03_character_vocabulary.py; `6.2` lessons/03_character_vocabulary.md; `6.3` src/rebuild_gpt/tokenizer.py; `6.4` tests/test_tokenizer.py |
| **7** | `7.1` examples/04_encode_decode.py; `7.2` lessons/04_encode_decode.md; `7.3` src/rebuild_gpt/tokenizer.py; `7.4` tests/test_tokenizer.py |
| **8** | `8.1` data/tiny_story.txt; `8.2` examples/05_load_corpus.py; `8.3` lessons/05_load_corpus.md; `8.4` src/rebuild_gpt/data.py; `8.5` tests/test_data.py |
| **9** | `9.1` examples/06_split_train_val.py; `9.2` lessons/06_split_train_val.md; `9.3` src/rebuild_gpt/data.py; `9.4` tests/test_data.py |
| **10** | `10.1` README.md; `10.2` examples/07_sample_batch.py; `10.3` lessons/07_sample_batch.md; `10.4` src/rebuild_gpt/data.py; `10.5` tests/test_data.py |

**Expected if no file requires splitting:** 22 new source-file steps and 22 new SVGs, producing **10 real commits / 36 instructional steps / 590 total added+deleted historical lines**. These are planned totals based on checked commit inventories, **not a claim they have been implemented**. Verify every file diff including context is at most 100 instructional lines; if any file exceeds 100, subdivide it further with new step IDs and audit full coverage. The 100-line limit is **per substep, not per entire real commit**: commit 10 has 123 total changed lines across five files.

## 5. Preserve these exact data contracts

Append to the existing files — **never replace commits 1–5**:

- `commits.json`: `commits[]` with `{number,sha,parentSha,date,title,url,stats,steps:[{id,title,file,lane}]}`. Use ordinal numbers 6–10; each real SHA appears once. For every `steps[].id`, preserve existing prefix convention `6.1`, `6.2`, etc.
- `lessons.json`: `steps[]` with `id,commitOrdinal,ordinal,sha,parentSha,title,focus,file,status,language,lane,mentor,visualKind,sourceUrl,commitUrl,patch,patchLines,hunks,added,removed,shownCodeLines,changedCoordinates,before,after`. Each lesson owns **exactly one changed source file**, no mixture of files. Source snapshots must be the authentic entire file contents at parent and selected SHA; preserve GitHub line coordinates.
- `source-links.json`: `byCommitStep[sha+':'+stepId]` maps to that exact owning file, immutable source URL, parent/source SHAs and changed old/new line coordinates.
- `visuals.json`: `byCommitStep[sha+':'+stepId] = {backend:'./svg/<unique-filename>.svg'}`.
- `svg/`: new source-grounded individual SVG for each meaningful step; SVG must have stable unique `data-tl-diagram-id`, `viewBox`, `title`, `desc`, transparent background, no second grid and no click-to-source behavior.
- `coverage-audit.json`: update full running totals and per-step line counts. Verify that every added/deleted line has exactly one assigned owning step and that every changed file is represented.
- `VISUAL-QA-TRACKER.md`: append a separate section for commits 6–10, source audits, diagram QA, scroll/selection checks, desktop/mobile screenshots, and any remaining blockers.

**One-file/100-line invariant:** For each substep, the focused diff includes ≤100 physical added+removed+context lines; archival entire-file Before/After and complete commit changes can be longer. Original parent SHA, path and old/new coordinates must remain authentic. Renames/binary assets get their own correctly described steps. Avoid duplicated or missing changed lines.

## 6. NON-NEGOTIABLE UI FREEZE — preserve the viewer

- **Do not create a second HTML/React UI or a new skin.** Reuse `projects/project-rebuild/index.html`, original shared `../../styles/app.css`, local geometry adjustments in `styles.css`, and `github-theme.css` for **color-only** GitHub Dark styling. Do not change lane geometry, border radii, padding, heights, DOM IDs, or desktop/mobile split.
- Keep left backend mechanism diagram, center numeric commit belt, right code-grounded expected result/experiment. The right lane is **not a fake browser frontend** for this Python-only commit series. Teach actual behavior, test assertions or documented commands, and distinguish expected outputs from independently executed runs.
- Existing `app.js` functions include `renderTimeline()`, `renderInspector()`, `paneHTML()`, `setOutput(step)`, `render()`, `choose()`. Extend data mapping and `setOutput` with relevant next mechanisms rather than recreating the viewer. No duplicate top controls, green page film, yellow fullstack chips, unreadable text, repetitive mentor filler or extra source link sections.
- **Actual commit chips are numerals 1–10**, strongly selected versus dim inactive; the real SHA is shown elsewhere, not in chip face. Display all substeps in fixed-position middle rail; it scrolls internally with invisible scrollbar and retains the selected step without page jumps.
- The page and both 700px visual panels must not bounce or resize when navigating. Preserve the user-selected code view/diff mode, default expanded inspector, Before/After panes, original line numbers, full GitHub links and code-only scrolling.
- **GitHub-style syntax highlighting:** retain `syntax.js` and `github-theme.css`; newly added `.py`, `.md`, `.txt` files must show colored/source-escaped code consistently in Before, After and Commit changes. Theme may change colors only, never geometry or text contents.
- **Mentor dropdown:** short, file-specific, explain *why* the exact source change matters; no recycled templates, hype, generic 'this changes the presentation layer' fillers or repeated paragraphs. Reopening/hiding mentor must not move the upper lanes.

## 7. Diagram system

- Browse `illustration-library/catalog.json` and original Petclinic SVGs **as ingredients**, not as a list of allowed subjects. Illustrate tokenizer vocabulary mapping, encode/decode round-trip, UTF-8 corpus → token IDs, train/validation split and seeded sampling **only where the exact code supports those semantics**. The filenames/commit titles above suggest topics; verify code before depicting any specific algorithm or output.
- Original lightweight Petclinic style: flat outline symbols (browser, file, array, dataset, characters, arrows), centered content, continuous faint grid supplied by parent canvas; **do not add a grid or opaque white paper to the SVG file**.
- Thin connectors generally 1.5–2.2px, small outlined arrowheads, no thick 3D machines, no giant labels/boxes, no clipped/overlapped text, no excessive white/empty space. New modular SVGs may be created freely.
- Diagram is static: clicking it does not open code or cause focus effects. Source is accessed through the shared inspector below.

## 8. Implementation sequence for AI

1. Audit existing 5 commits/14 lessons and all current assets. Do not overwrite or renumber them.
2. Download/inspect each next exact SHA (6–10), its full parent/diff, and authentic full file snapshots. Read file content, not just commit messages.
3. Create deterministic step ownership for 22 changed-file occurrences (or more if 100-line splits are required). Prepare a coverage table before drawing anything.
4. Add the 5 genuine commits and steps to `commits.json`, `lessons.json`, `source-links.json`, `coverage-audit.json`. Preserve all historical source strings and line numbers.
5. Design a source-specific SVG for every step and append mappings to `visuals.json`. Extend `setOutput(step)` for observable behavior/expected output without a new page design.
6. Extend the runtime and static QA tests **without weakening the previous 1–5 assertions**. Note that existing `tests/validate.mjs` currently hardcodes `5`, `14`, `192` and some fixed line/SVG counts; update those for the new cumulative scope or calculate them from verified commit metadata, with explicit regression expectations for the first five. `tests/syntax.mjs` iterates over steps and should continue to verify new source.
7. Run locally: `node projects/project-rebuild/tests/validate.mjs`, `node projects/project-rebuild/tests/syntax.mjs`, `npm run audit:design`, `npm run test:visual`. Repair failures. Confirm GitHub Pages deployment status if pushing.
8. Perform independent **nested-viewer** desktop 1440px and mobile 390px browser tests, not just the root catalog smoke test. Exercise numbered commit chips, keyboard navigation, all substeps, long filenames, open/persistent code, Before/After, full diff, SHA-pinned links, internal rail scrolling and page scroll back to the diagrams. Verify all diagrams render and are centered; capture visual QA evidence.
9. Commit only under `projects/project-rebuild/`, push to Three-Lanes `main`, then return the viewer link, commits 6–10 SHAs, final real-commit/step/changed-line counts, exact commit link, and honest QA results. Do not claim complete if source or browser QA has not passed.

## 9. Acceptance checklist

- [ ] Original 5 SHAs, 14 steps, 14 SVGs and their metadata unchanged.
- [ ] Commits 6–10 verified against GitHub and appended oldest-first with the five exact SHA values above.
- [ ] All 22 newly changed source-file occurrences have ≥1 owned step; every changed line accounted for exactly once.
- [ ] No focused instructional substep over 100 code/diff lines.
- [ ] New SVGs are accurate, lightweight, centered, accessible and unclipped; continuous grid remains visually consistent.
- [ ] Current original prototype shapes and Github Dark colors remain; no layout or scroll regressions.
- [ ] Source defaults open and persists across commit/substep changes; selected code mode persists.
- [ ] Before/After and Commit changes are source-exact, syntax-colored and linked to real original SHAs.
- [ ] Updated static and browser tests pass, including a test dedicated to the nested project route.
- [ ] QA tracker contains truthful screenshots/test status and deployment link.

## 10. Paste to the next AI

> Read `https://github.com/sabareeshrao/Three-Lanes/blob/main/projects/project-rebuild/HANDOVER-NEXT-COMMITS.md` first, then the linked repository rules. Continue `Project-Rebuild` by implementing original commits 6–10, not by generating new source commits. Update only `Three-Lanes/projects/project-rebuild/`, keep the original UI and GitHub Dark color-only theme, append all file-scoped lessons and SVGs, run complete source/visual checks, push to the Three-Lanes repository, and return the updated viewer URL with honest QA results.

**Handover status:** This file is an instruction and verified next-commit inventory. **It does not claim commits 6–10 have been built.**
