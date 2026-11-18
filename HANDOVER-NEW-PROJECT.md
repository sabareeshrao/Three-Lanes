# Three-Lanes — New Project Handover

**Purpose:** Use the Spring Petclinic prototype as the *reference implementation* for building a Three-Lanes visual commit explorer for **any GitHub source repository**. Open this document at the start of a new ChatGPT conversation or a new project folder. This is an implementation handover, not a claim that the current Petclinic app is already repository-agnostic.

**Prototype repository:** https://github.com/sabareeshrao/Three-Lanes  
**Existing demo:** https://sabareeshrao.github.io/Three-Lanes/  
**Default project:** `spring-projects/spring-petclinic`  
**Current curated scope:** 10 real, nonconsecutive commits, expanded into 25 learning steps. Existing assets: 17 SVGs and 8 standalone frontend HTML previews.

## Central catalog required

Read [design-system/README.md](./design-system/README.md), [design-system/registry.json](./design-system/registry.json), and [design-system/tokens.css](./design-system/tokens.css) before authoring. Load tokens in project viewers; only approved visual patterns can be published. New code mechanisms may have candidate patterns after visual review. Commit belts scroll vertically with invisible bars. Run both design/Chromium audits and inspect screenshots.

## 1. What the next agent/developer must understand

You want to create `projects/<project-slug>/` for each new source-code repository, **reusing the same Three-Lanes UI and engine rather than copying or rewriting a huge HTML page**.

The prototype is the approved **visual and functional reference**. Preserve its design and behavior. Build a shared engine that reads each project's repository URL, immutable commits, learning steps, source links, SVG files, frontend previews, and UI labels from project data.

Do **not** silently substitute fabricated source code, line numbers, dependencies, GitHub commit histories, or browser UI for backend-only commits.

## 2. Current implementation (verified)

```text
Three-Lanes/
├── index.html
├── styles/app.css
├── src/
│   ├── app.js
│   ├── data/petclinic-demo.js
│   ├── visuals/
│   │   ├── backend-svg/petclinic-diagrams.js
│   │   ├── frontend-ui/petclinic-previews.js
│   │   ├── asset-library.js
│   │   └── visual-registry.js
│   └── navigation/
│       ├── source-manifest.js
│       └── code-navigation.js
├── visuals/
│   ├── svg/                # 17 existing *.svg examples
│   └── frontend-ui/        # 8 existing *.html examples
└── .github/workflows/pages.yml
```

- `index.html`: lightweight shell, both lanes, commit rail, source panels, Before/After inspector.
- `styles/app.css`: ChatGPT-like dark theme and responsive layout.
- `src/app.js`: navigation, persistent selection and viewport position, GitHub commit fetching, diff parsing, View/GitHub modes and source inspector.
- `src/data/petclinic-demo.js`: 10 Petclinic commits with 25 predefined substeps.
- `src/visuals/backend-svg/petclinic-diagrams.js`: existing code-generated diagrams.
- `src/visuals/frontend-ui/petclinic-previews.js`: existing focused UI simulations.
- `src/visuals/visual-registry.js`: optional `<SHA>:<step-id>` → saved SVG/HTML mapping. **It is currently empty**; the generated visuals are the active defaults.
- `src/visuals/asset-library.js`: loads registered standalone SVG/HTML files.
- `src/navigation/source-manifest.js`: manually curated, **Petclinic-specific** code and dependency references for 25 steps.
- `src/navigation/code-navigation.js`: resolves symbol text at a SHA, shows in-page code with exact line numbers, and makes matched SVG labels clickable. **Its source URL roots are still Petclinic-specific.**

**Important:** Current `src/app.js` still uses `DEFAULT_REPO='spring-projects/spring-petclinic'` and `window.PETCLINIC_DEMO`; the new project cannot simply change a JSON file and work today. Refactor these to project configuration first.

## Mandatory 10-commit visual production standard

**Every new project is built in batches of exactly ten distinct real commits.** Read [DIAGRAM-QUALITY-STANDARD.md](./DIAGRAM-QUALITY-STANDARD.md) before generating content. The first three commits per batch require especially extraordinary, visually diverse diagrams/previews, but **no commit is allowed to sacrifice technical or visual quality**. Use meaningful architecture, method calls, tables, request paths, state transitions, SQL constraints and accurate focused UI rather than simple text inside generic boxes.

Never use a diagram that has overlapping labels, off-canvas elements, bulky arrows, unreadable mobile text, confusing connectors, fabricated code or invented user interfaces. Create reusable source SVG/HTML assets; preserve SHA-pinned source navigation and click-again-to-close.

**Required audit:** visually inspect at 1440px and 390px, test source links and click-to-toggle, compare before/after, and check layout/scroll persistence for each applicable step. Copy `projects/_template/VISUAL-QA-TRACKER.md` into each new project. A batch is only COMPLETE after **10/10 commit entries** pass these checks. Report actual progress and defects if anything is unfinished; do not invent quality scores or inspection results.

## Mandatory one-file steps and scrolling commit conveyor

Each numbered learning step covers **exactly one changed file**. For a real commit touching 20 files, make at least 20 numbered substeps under its original SHA. Never combine changes from different files (including tests and config). If any one file contains more than 100 instructional lines, break THAT file into smaller substeps. Renames count as one file with old/new paths; binary assets have their own metadata-only step. Audit the verified complete commit to ensure every file and changed line is covered.

With many commits or substeps, the middle commit conveyor is **vertically scrollable inside a fixed-height rail**, its header stays in place, and the selected step is kept visible by scrolling ONLY the rail. Do not expand the page or shift either visual lane. Preserve the current rail scroll offset on ordinary redraws.

Semantic chips: backend blue; frontend green; full-stack **orange, not yellow**; unselected commits neutral.

## Strict limit for large commits: 100-line learning subcommits

See [SUBCOMMIT-100-LINE-RULE.md](./SUBCOMMIT-100-LINE-RULE.md), which is mandatory for any new project. A real commit with thousands of lines must be broken into as many **small, cohesive numbered learning subcommits** as required. Each subcommit covers and displays **at most 100 physical code/diff lines across all its files** (including added, removed, and context). Do not truncate at 100; cover **all changed lines** of the original verified commit across the sequence and audit line-range coverage. Preserve real SHA, path, old/new line numbers, dependencies, Before/After, and clickable SVG-to-code navigation. Large full-file archival/source views remain available. A batch is still 10 real GitHub commits even if their subcommit count is far greater than 10.

## 3. Approved product behavior — preserve exactly

1. Three lanes: backend SVG/architecture **left**, commit/substep rail **middle**, focused frontend UI **right**.
2. Dark ChatGPT-inspired appearance, clean clipped rounded borders, no dim/fog filter, no pointless banners or explanation tooltips.
3. Commit chips: **blue backend**, **green frontend**, **orange full-stack**.
4. Distinct **View** (focused clean code) and **GitHub** (actual commit data) modes. Diagrams/visuals remain visible in both.
5. In GitHub mode, **View here** is the *default* source option. Its **Before/After** source inspector appears **full width immediately below the visual lanes**, not after a duplicate diff. **Commit changes** and **Original source** remain available beneath the primary View here control.
6. Exactly numbered historical source lines and links for the selected commit. Real GitHub diff and raw complete source are available; no invented frontend source when only the backend changed.
7. Click an applicable SVG label/icon or source link → preview the exact historical line and surrounding code. **Click the same item again → close**; click another → switch. The close button also hides it.
8. Arrow navigation between substeps/commits; selection persists. Keep the user's **vertical viewport reading position** stable during navigation, mode switching and asynchronous source refresh, including when content becomes shorter.
9. Never render stray text like `undefined`; never change old behavior simply to add a feature.
10. Use unlimited natural page length, avoid internal vertical scrolling where possible; no layout jitter.

## 4. Target per-project structure

One shared viewer, multiple data/config folders. A new folder can be copied from `projects/_template/`:

```text
projects/
├── _template/
│   ├── project.json
│   ├── commits.json
│   ├── source-links.json
│   ├── visuals.json
│   ├── svg/README.md
│   └── frontend-ui/README.md
├── spring-petclinic/
│   └── ...metadata and visuals
└── <your-next-project>/
    ├── project.json
    ├── commits.json
    ├── source-links.json
    ├── visuals.json
    ├── svg/
    └── frontend-ui/
```

**Currently this is a planned data contract, not wired into the viewer.** The first engineering task is to extract a reusable shared core and project loader from `src/app.js`, then migrate the working Petclinic demo to one `projects/spring-petclinic/` folder without breaking the root site. Use the template as the data model for that migration.

## 5. How to build a new project

1. Choose a public/authorized GitHub repository (owner/name), then create `projects/<slug>/` by copying `projects/_template/`. Never create a second giant copy of `index.html` for every repository.
2. Inspect the source repository, its language/framework/build files, folder layout, commit history, runtime UI, and tests. Record verified facts in `project.json`.
3. Select *real immutable 40-character SHAs*. For each teaching step, store a stable ID, owning commit SHA, real changed file, specific symbol or changed range, lane kind, and short explanation. Start small (e.g. ten curated commits); scale after the engine is stable.
4. Build diagrams in the project's `svg/` or focused standalone UI previews in `frontend-ui/`. Reuse existing saved visuals when appropriate; do not manufacture unrelated UI or simply draw generic rectangles containing text.
5. Add `source-links.json` entries for controller/class/method, imported dependency, repository call, SQL schema and relevant tests only when verified at the **same selected commit**.
6. Register the visual file with the exact `SHA + step ID`. A change to a visual must not change the source SHA, source file or independent source links.
7. Open the project in the shared viewer. Navigate multiple commits, test SVG/source-link toggle, compare Before/After, check frontend and backend steps and viewport persistence.
8. Commit the new project files to GitHub and verify repository contents, actual GitHub Pages deployment and line-link destinations before claiming that the site is live.

## 6. Source integrity and dependency-navigation contract

- **Never link to `main` or `HEAD` for historical code.** Use `https://github.com/<owner>/<repo>/blob/<full-SHA>/<path>#L<verified-line>`.
- For the old side of a diff, use the commit's **parent SHA** and its original/previous path, especially for renamed/deleted files.
- Resolve source lines against the exact file content at that SHA, not against a code excerpt, guessed offset, current HEAD, or another language version.
- If the source file, symbol or patch cannot be verified, show an explicit unavailable state. Do not fabricate line numbers or relationships.
- A dependency navigation link is meaningful only when it identifies an actual imported class, called method, repository contract, schema rule or related test. Verify the target exists at that SHA and resolve a precise matching declaration.
- One symbol may appear multiple times; support fully qualified paths, signatures or source ranges rather than blindly linking to the first textual match.
- Prefer reuse of a SHA/file-index and cached result; avoid fetching every source file for every scroll/re-render.
- SVG/HTML visuals are teaching artifacts. The GitHub code panel is the authority for historical project source.

## 7. Scalability and module boundaries

A file split helps maintainability, but it does **not** automatically support lakhs (100,000+) of commits. Implement in stages:

- **A — Repository-agnostic engine:** project loader; repository-aware URLs; shared renderers; project-scoped persisted state; preserve legacy Petclinic output.
- **B — Reliable commit navigation:** paginated metadata, on-demand exact diffs/source files, caching, stale-response cancellation and retry/error UI.
- **C — Large history:** server-generated or prebuilt sharded commit index, virtualized timeline, indexed search and batched source/dependency analysis. GitHub REST API limits mean a static browser fetching 100,000 commits is not a scalable indexing strategy.
- **D — Broad repository support:** language-aware symbol extraction (Java, Python, JS/TS, etc.), configurable visual component types, a versioned project manifest, regression tests and GitHub Pages integration.

Keep the shared engine independent of the selected repository. All data and visuals must live in `projects/<slug>/`. Never load the entire codebase or all commits just to render one step.

## 8. Minimum acceptance tests for the next project

- [ ] Root Petclinic prototype still works and looks the same.
- [ ] New project folder can render from its configuration without hardcoded Petclinic files.
- [ ] All shown commits/lines are real and SHA-pinned; original source and Before/After both work.
- [ ] SVG/HTML preview can be copied into the project asset library and selected by its registry.
- [ ] SVG click opens exact code; same SVG click closes; different SVG click switches.
- [ ] Dependency links lead to verified same-revision files/definitions; missing targets are not guessed.
- [ ] View, GitHub, View here, keyboard navigation, and selection persistence work.
- [ ] Vertical reading level stays fixed across updates (no forced scroll or scroll-jitter).
- [ ] Responsive desktop/mobile layout; no overlapping text, unwanted extra scroll bars, fog, or `undefined`.
- [ ] GitHub Pages loads all module paths; source files and linked assets return 200; deployment is actually checked.

## 9. Copy-paste handover prompt for a NEW ChatGPT chat

> I want to build a **new Three-Lanes project** for this GitHub repository: **[PASTE REPOSITORY URL]**.  
> Existing visual/functional reference: **https://github.com/sabareeshrao/Three-Lanes**.  
> First read **HANDOVER-NEW-PROJECT.md** in that repo and inspect the existing app, navigation and visual modules.  
> Create a new folder **projects/[PROJECT-SLUG]** by copying **projects/_template**. Treat the current Spring Petclinic demo as the visual/behavioral benchmark, NOT as a generic data source.  
> Refactor shared engine parts where necessary so the new project loads its own immutable commit SHAs, steps, source paths, correct GitHub line links, dependency references, SVG diagrams and frontend UI previews. Preserve the ChatGPT dark three-lane UX, default full-width View here comparison, keyboard controls, scroll persistence and clickable/toggleable SVG-to-code navigation.  
> Do not invent code, dependencies or commit lines. Audit all links against the exact SHA. Avoid huge monolithic HTML files; load only what the user is viewing.  
> Make incremental commits, run tests, push the finished project and provide its GitHub and verified live GitHub Pages links. Do not change the existing Petclinic demo unless required for shared-engine migration, and then regression-test it.

## 10. Links worth keeping

- Repository: https://github.com/sabareeshrao/Three-Lanes
- Existing site: https://sabareeshrao.github.io/Three-Lanes/
- Existing source app: https://github.com/sabareeshrao/Three-Lanes/blob/main/src/app.js
- Existing backend diagrams: https://github.com/sabareeshrao/Three-Lanes/tree/main/visuals/svg
- Existing frontend previews: https://github.com/sabareeshrao/Three-Lanes/tree/main/visuals/frontend-ui
- Historical navigation prototype: https://github.com/sabareeshrao/Three-Lanes/blob/main/src/navigation/code-navigation.js
- Historical source manifest: https://github.com/sabareeshrao/Three-Lanes/blob/main/src/navigation/source-manifest.js

**Handover status:** Files and current constraints checked against the repository; project-agnostic loader and large-history infrastructure are future engineering work, not already-complete features.
