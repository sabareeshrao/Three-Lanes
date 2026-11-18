# Three-Lanes — Mandatory 100-Line Learning Subcommit Rule

This rule applies to **every project**, **every 10-real-commit batch**, and every commit regardless of its size. It is mandatory for coding agents reading `AGENTS.md`, the project template, and the visual quality standard.

## Terminology (never rewrite Git history)

- A **real commit** is one existing GitHub commit with its actual immutable 40-character SHA.
- A **learning subcommit** is a numbered explanatory slice of that real commit (for example, `4.1`, `4.2`, `4.3`). A subcommit is **not a newly created Git commit**, does not get a fabricated SHA, and must always reference the real parent commit and actual before/after file paths.
- A batch contains **exactly 10 distinct real commits**, even if those commits expand into 50, 100, or more learning subcommits.

## Hard limit: 100 source/diff lines per learning subcommit

**MAX = 100 physical code/diff lines in total per learning subcommit, across all files and code examples within that subcommit.** Count context, added and deleted lines; do not count headings, file names or `@@` hunk headers as code lines. Do not evade the limit by splitting the same subcommit into multiple 100-line panels. The normal focused view of a subcommit must never contain 101+ source lines.

A Before/After comparison may display the *two versions of the same bounded slice* in parallel; it does not double-count unchanged context, but **each side must still display no more than 100 source lines**. Large original files and the complete, authentic GitHub commit diff remain accessible through **Original source** / **Commit changes** / external GitHub links; those archival views are exceptions to the instructional 100-line cap, not a reason to drop code from the learning sequence.

**If one real GitHub commit modifies thousands of lines, split it into as many learning subcommits as necessary. There is no maximum number of subcommits per real commit.** A 1,000-line diff requires *at least* 10 100-line slices and often more for context or meaningful boundaries. Do not truncate at the 10th slice.

## How to split (semantic boundaries first)

1. Retrieve the **complete actual diff and file list** for that exact commit SHA (including renamed/deleted paths, tests, configuration, database migrations, templates, and assets). Never rely only on the first API page or GitHub's truncated patch preview; if an API omits or truncates a patch, use a reliable full diff or report the unverifiable remainder.
2. Group changes by real functionality: controller endpoint, validation rule, model/entity change, repository/query, schema, API contract, frontend component, test, infrastructure, or integration. Prefer one cohesive idea per subcommit. Split a large function further at meaningful blocks when its code exceeds 100 lines.
3. For each subcommit, select a **contiguous source/diff range** or explicitly enumerated verified ranges that together contain **at most 100** code/diff lines. Across all ranges and files in that subcommit, the aggregate count must stay at or below 100. If needed, create the next subcommit rather than shrinking text, truncating code, or omitting lines.
4. Preserve **original file path, old/new line coordinates, real SHA, exact diff hunk IDs and change type** (addition/deletion/context). If a before-side link is needed, use the actual parent SHA. Do not generate fictitious line numbers.
5. Number subcommits deterministically and consistently: e.g. Commit 3 → `3.1`, `3.2`, …, `3.27`. Keep identifiers stable across refreshes. A subcommit's source navigation should land on its exact relevant code line/range.
6. **Audit coverage:** every changed code line of the real commit must be included in at least one subcommit (or explicitly classified as non-text/generated/binary with rationale). Avoid accidental duplication; shared context may repeat when genuinely necessary but each source change needs an unambiguous assigned slice.
7. Give each meaningful subcommit a **dedicated diagram or focused frontend UI** explaining that slice and linked to the correct historical source. A giant commit is *not* one enormous SVG. The first 3 real commits in each batch remain the visual showpieces; each of their subcommits still has to meet the visual quality standard.
8. Use an expandable/virtualized subcommit timeline and lazy-loaded assets so very large histories do not turn into another monolithic HTML file.

## Example

```text
10 REAL COMMITS IN BATCH 001
Commit 1  SHA abc... (1,035 changed/source-diff lines)
  1.1  REST controller input          84 lines
  1.2  Validation branch             92 lines
  1.3  Domain model                  77 lines
  ...
  1.14 Remaining changed sections   61 lines

Commit 2  SHA def... (68 lines)
  2.1  One cohesive source change    68 lines

...
Commit 10 SHA ... (many lines)
  10.1, 10.2, 10.3, ...
```

These line counts illustrate the *format only*, not verified counts from an actual repository. Source slices are determined from the full real diff, not by blindly partitioning every 100 lines.

## Required machine-checkable data per subcommit

Store, or be able to derive, at minimum:

```json
{
  "id": "3.4",
  "commitSha": "<real-40-character-SHA>",
  "title": "Validate submitted visit date",
  "files": [
    {
      "path": "src/main/java/example/VisitController.java",
      "oldStart": 90,
      "oldEnd": 130,
      "newStart": 92,
      "newEnd": 136
    }
  ],
  "instructionalDiffLineCount": 83,
  "visual": "./svg/3.4-visit-validation.svg"
}
```

This is a **schema illustration**, not an already implemented loader. Record actual ranges and counts based on verified source. The key invariant for a validating script is:

```text
FOR EACH learning subcommit:
  1 <= total instructional code/diff lines <= 100
FOR EACH real commit:
  union(assigned changed lines across its subcommits)
  == all verified changed code lines in the actual commit diff
FOR EACH batch:
  exactly 10 unique real commit SHAs (subcommits do not change this count)
```

For a code-free/binary-only step, explain its metadata explicitly rather than inventing lines.

## Quality gate and progress reporting

- A subcommit **fails** if it exceeds 100 instructional code/diff lines, omits changes, invents or misattributes a line, bundles unrelated features solely to reduce step count, or uses an unreadable oversized SVG.
- The batch's `VISUAL-QA-TRACKER.md` must record per real commit: actual total changed/source-diff lines, number of subcommits, each subcommit's code-line count, assigned file/range coverage, visual review and any uncovered lines.
- Do not claim “100% of lines covered” without comparing the assigned ranges to the real complete diff. If full patches are unavailable, report uncertainty and mark the commit **IN PROGRESS**, not PASS.
- Keep 1440px and 390px visual inspections, SHA-pinned source links, SVG click-again-to-close, Before/After accuracy, keyboard navigation, and vertical scroll persistence.
