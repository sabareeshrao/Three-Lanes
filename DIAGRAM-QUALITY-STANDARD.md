# Three-Lanes — Non-negotiable 10-commit visual quality standard

**Mandatory design-system review:** Before drawing, read [design-system/README.md](./design-system/README.md), [design-system/registry.json](./design-system/registry.json) and [design-system/tokens.css](./design-system/tokens.css). Use approved diagram patterns and canonical tokens. A genuinely new code mechanism may introduce a **candidate** pattern, requiring source/visual review before approval. Run the design and browser screenshot audits, then manually inspect compositions and real source.

## Open-ended illustration rule (latest)

**Before creating diagrams, consult the 50 modular illustrations in `illustration-library/catalog.json` and their SVG source files. They are individual building blocks with stable IDs, not a whitelist. You MAY reuse, combine, alter or invent new SVG components and original diagrams without candidate approval or catalog registration. Assign unique IDs and keep source fidelity, accessibility, thin arrows (≤3px connector stroke; ≤12px arrowheads), no collisions or clipping, and desktop/mobile screenshot QA.** Prior text requiring an *approved pattern ID*, *candidate registration* or *SVG click-to-focus* is superseded for the root prototype. No generic text-only box drawings. The fixed design tokens and one-file-per-step rule still apply.

**Applies to:** Every new project, every batch of **exactly 10 selected, real GitHub commits**, every SVG architecture diagram, and every focused frontend UI preview. This file is mandatory for agents reading the root `AGENTS.md` or a copied `projects/<slug>/AGENTS.md`.

**Goal:** Publish a visually compelling, technically correct learning experience—not 10 automatically generated generic diagrams. Quality takes priority over throughput. A batch is **not complete until all 10 commit entries and their applicable visuals pass review**. If work cannot be completed, report the accurate count and remaining defects instead of claiming success.

## Mandatory 100-line cap per learning subcommit

Before drawing a visual, read [SUBCOMMIT-100-LINE-RULE.md](./SUBCOMMIT-100-LINE-RULE.md). For every actual GitHub commit, split its complete verified changes into **numbered logical learning subcommits**, each containing **no more than 100 code/diff lines across all its code slices and files**, including context, additions and deletions. A large commit can have dozens of subcommits; never truncate or skip lines. Give every meaningful subcommit its own specific visual and source links. The 10-per-batch count is **10 real SHAs**, not 10 subcommits. Record exact code-line counts and verified full-diff coverage in `VISUAL-QA-TRACKER.md`; exceeding the 100-line cap or missing lines fails the quality gate. The complete historical file/diff inspectors remain accessible and exempt from the instructional display cap.

## 1. Batch contract

1. Work in **batches of 10 actual commits** (Batch 001 = 10, Batch 002 = next 10, etc.). Choose and verify full 40-character SHAs and exact changed files. Different steps within a single commit are substeps, **not extra commits**.
2. Each commit may have multiple meaningful learning substeps. Use as many visual components as needed to explain its *actual* change; do not pad the count with irrelevant diagrams or split code artificially.
3. **Each changed concept gets its own purpose-built visual**. If two substeps genuinely show the same underlying system, adapt the visual to highlight the *different* step; do not silently clone the same unmodified SVG across substeps.
4. **First three commits in every batch are the visual showcase**. Their diagrams/previews must be the most polished and distinctive examples, with thoughtful visual storytelling and unusually strong technical clarity—not a row of labeled rectangles. This does **not** excuse lower quality in commits 4–10.
5. All 10 commits must retain their original historical SHA, source path, and verified code links. A beautiful diagram that misrepresents the code is a failure.
6. Save visuals modularly in each project folder: `projects/<slug>/svg/` and `projects/<slug>/frontend-ui/`. Register them by **`<full-sha>:<step-id>`** in `visuals.json` / the active registry, not by a mutable branch or a reused global filename.

## 2. What an excellent architecture diagram looks like

- **Visually explain a mechanism.** Show real relationships such as request flow, method call, state transition, validation boundary, persistence/transaction boundary, data transformation, dependency edge, race condition, rendering path, or Before/After result, whichever the source supports.
- **Use professional diagram vocabulary:** purpose-built browser/server/database icons, data tables, timelines, axes, lifelines, annotated code fragments, state transitions, before/after contrasts, highlight overlays, real arrows, and grouped interfaces. Choose only elements that genuinely clarify this commit.
- **Not merely text in boxes.** A generic flowchart with three rectangles and arrows is not acceptable as the main diagram when a richer representation would help. Avoid repeatedly reusing the same layout for all ten commits.
- **Create meaningful hierarchy:** a concise, beginner-friendly entry point, an unmistakable main change, one or two emphasized paths/objects, and lightweight secondary context. The eye should discover *what changed and why* within a few seconds.
- **Be technically faithful:** labels must correspond to the actual selected revision and its changed behavior. Mark reconstructed behavior as a teaching visualization when needed. Do not fabricate endpoints, DTO fields, database tables, frontend elements, runtime traces or program output.
- **Embed navigable semantics:** map meaningful SVG labels/icons to real classes, methods, source paths or tests where those targets exist. Preserve the current click-to-open / same-click-to-close source preview.
- **Use consistent visual language without visual repetition:** shared color semantics, typography and spacing are good; cloned diagrams with only a title swapped are not.

## 3. Frontend UI quality rules

- When a commit changes frontend presentation, show the **specific changed UI component and visible result**, not an invented entire application.
- Make Before/After behavior clear where appropriate; show actual interactive states for form validations, pagination, controls and navigation when supported by the source.
- Use the saved standalone HTML approach. Keep styles/scripts scoped so previews cannot break the main shell.
- Backend-only changes may have a conceptual UI-impact explanation when useful, but **must not invent changed frontend source code** or falsely claim that a particular screenshot existed.
- Ensure keyboard and touch accessibility for any interaction; state changes should be visible and understandable.

## 4. SVG design and rendering requirements — zero tolerated defects

- **No overlapping text** or text obscuring lines, icons, arrows or other labels. No clipping, overflow outside SVG viewBox/card, hidden bottom rows, or labels leaking outside containers.
- **No bulky arrows/arrowheads**, crossing connectors that obscure information, or tangled spaghetti routes. Prefer orthogonal/curved paths with consistent small arrowheads, labeled only when necessary.
- **No illegible microtext.** Inspect at *actual rendered sizes*, especially when a desktop SVG is scaled to a narrow mobile lane. Break long labels, rearrange panels, enlarge viewBox or change layout rather than shrinking labels into unreadability.
- **No foggy overlays, opacity haze, gratuitous shadows, excessive borders, or decorative empty panels**. Keep the approved ChatGPT-dark application shell; visuals may use lighter internal canvases for readability.
- Use semantic color consistently (e.g. backend blue, frontend green, full-stack orange for timeline chips); do not overload red/green alone to explain a meaningful difference. Maintain sufficient contrast and clear non-color indicators.
- Use valid SVG markup, a `viewBox`, reusable definitions with non-colliding IDs, descriptive `role=img`/`aria-label` or title, scalable strokes, and predictable responsive sizing.
- Test desktop and mobile—at minimum **1440 px** and **390 px** viewport widths—and the actual Three-Lanes layout, not just an isolated SVG file. Don't add internal vertical scrollbars as a shortcut.
- Keep diagrams and the source explorer from shifting the page: keyboard navigation, View/GitHub switching, loading and SVG clicks must preserve the user's vertical reading position.

## 5. Mandatory review loop for EACH of the 10 commits

**Do not publish first and promise to audit later. Review before marking each item done.**

1. **Source audit:** read the changed file/diff at the exact SHA; record file, precise symbols, affected area, old/new change, dependencies and test evidence. Make no unsupported claims.
2. **Design plan:** decide the one question this visual answers and the best visual metaphor. For the first 3 commits, deliberately plan a standout composition.
3. **Create:** produce real SVG/HTML assets, not screenshots standing in for the required source/editable asset. Link the correct step and source revision.
4. **Inspect visually:** render and screenshot or otherwise inspect the actual result at desktop 1440 and mobile 390. Do not rely only on source-code syntax review or subjective self-rating.
5. **Audit exact defects:** check overlaps, clipped labels, off-canvas elements, arrowheads, connectors, contrast, legibility, wasted space, layout stability and unintended scrollbars.
6. **Audit behavior:** click linked SVG elements and source references; verify correct historical line opens, second click closes, changing target switches; verify View/GitHub/Before-After and arrow keys.
7. **Improve and retest** until defects are resolved. Reject mediocre or repetitive visuals; don't accept an untested 'probably fine' output.
8. **Record evidence** in `projects/<slug>/VISUAL-QA-TRACKER.md`: SHA, step, visual asset, distinguishing design, source evidence, desktop/mobile inspection, navigation and pass/fail, and remaining issues.

**Quality gate:** Aim for 10/10 presentation quality for every commit, especially the first three, but treat this as a design aspiration rather than a factual score that can be asserted without independent assessment. A commit is **PASS** only when source integrity and all critical rendering/interaction checks have succeeded. Any severity-1 issue (fabricated code/line, broken link, clipping, overlap, obscured arrows, incorrect dependency, broken source toggle, forced page jump) blocks completion.

## 6. Batch completion criteria and deliverables

A batch may be called **COMPLETE** only if:

- All **10 distinct, verified commit SHAs** and their intentional substeps are recorded in project data.
- Each relevant substep has a distinctive, readable SVG or frontend HTML visual, saved in the correct modular library.
- The first three commits visibly demonstrate extraordinary effort and do not look like lightly customized templates.
- The source links, dependencies and Before/After code are verified at exact commit/parent SHAs.
- All 10 commit entries have passing desktop/mobile visual inspections and navigation/scroll checks recorded in the tracker.
- A batch summary shows the exact **10/10 commit count**, number of substeps/assets, known unsupported features and tests actually run; code and assets are committed to the target repo.
- No change regresses the already-approved Three-Lanes experience.

**If the batch has unfinished work:** label it **IN PROGRESS** with the actual count, failed IDs and next concrete actions. Do not claim all 10 diagrams were completed or 10/10 quality based solely on code generation.

## 7. Reuse and scaling

Reusable visual components and layouts are encouraged, but each commit's important technical mechanism must remain visually specific. Keep diagrams in separate files and registry mappings; do not re-inline 10 sets of SVG/HTML in a monolithic `index.html`.

For tens of thousands of commits, keep the same per-batch standards but use on-demand loading, indexed commit metadata and automated structural checks. Automation helps catch defects; **it does not replace actual visual inspection or source verification**.
