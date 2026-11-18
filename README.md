## CURRENT VISUAL STANDARD — LIGHTWEIGHT PETCLINIC STYLE (supersedes bulky 50-asset library)

The former 50 large, shaded, detailed hardware/cloud/server SVGs have been **deleted from main**. Do not restore, link or imitate them. Use **only the simple, flat, thin-outline visual vocabulary shown in the original Petclinic prototype**, available in `illustration-library/catalog.json` and `design-system/diagram-catalog/`. Icons are transparent, outlined, softly blue/green/red, easy to understand; connectors 1.5–2.2px with compact outlined tips (~7px); subtle dots and 120px grid on full diagrams, abundant whitespace. No bulky arrowheads, 3D rack renders, gradients, clutter, or text-only boxes. Compose symbols as needed or freely invent new components; the list is NOT a whitelist. Keep source-accurate one-file-per-step explanations and screenshot QA.

# Three-Lanes — visual commit learning engine

A modular, browser-based three-lane visualizer for understanding real GitHub changes. Current demonstration: **10 non-consecutive Spring Petclinic commits**, expanded into **25 learning steps**.

**Live site:** https://sabareeshrao.github.io/Three-Lanes/

## AI agents: start here

**[AGENTS.md](./AGENTS.md)** is the repository-level instruction file for coding agents that support it. **[GitHub Copilot instructions](./.github/copilot-instructions.md)** provide equivalent guidance for Copilot; every copied project folder also contains its own `AGENTS.md`.

When opening this repository in a supported coding agent, give it the **target GitHub repository URL and the goal**. The agent can read these files and the detailed [handover](./HANDOVER-NEW-PROJECT.md), create `projects/<slug>/`, and implement the project using the existing UI and source-integrity rules. The current JSON template still needs a repository-agnostic runtime loader; do not assume it is plug-and-play.

## Shared design system and catalog

**[Browse the Design Catalog](https://sabareeshrao.github.io/Three-Lanes/design-system/catalog/)** · [Tokens](./design-system/tokens.css) · [Pattern registry](./design-system/registry.json) · [Agent instructions](./design-system/README.md).

The registry starts with six approved patterns and can grow to unlimited new candidate/approved patterns. Project viewers import shared fonts and colors. `npm run audit:design` and `npm run test:visual` validate tokens, SVG metadata, responsive rendering and screenshot evidence. The Pages deployment depends on these automated gates; they do not replace human visual/source review.

## Open-ended illustration rule (latest)

**Before creating diagrams, consult the lightweight modular SVG kit in `illustration-library/catalog.json` and their SVG source files. They are individual building blocks with stable IDs, not a whitelist. You MAY reuse, combine, alter or invent new SVG components and original diagrams without candidate approval or catalog registration. Assign unique IDs and keep source fidelity, accessibility, thin arrows (≤3px connector stroke; ≤12px arrowheads), no collisions or clipping, and desktop/mobile screenshot QA.** Prior text requiring an *approved pattern ID*, *candidate registration* or *SVG click-to-focus* is superseded for the root prototype. No generic text-only box drawings. The fixed design tokens and one-file-per-step rule still apply.

## Visual quality standard for 10-commit batches

Read **[DIAGRAM-QUALITY-STANDARD.md](./DIAGRAM-QUALITY-STANDARD.md)** before producing any new diagrams. Every batch must include ten verified commits; each deserves a distinctive, source-accurate visual. The first three are visual showpieces, but every diagram must pass overlap/clipping, readability, arrow/connector, responsive desktop/mobile, source-navigation, and scroll-persistence checks. Use the copied **[VISUAL-QA-TRACKER.md](./projects/_template/VISUAL-QA-TRACKER.md)** to record the results; no batch is called complete before all ten pass.

## Large commits: 100-line learning subcommits

Read **[SUBCOMMIT-100-LINE-RULE.md](./SUBCOMMIT-100-LINE-RULE.md)**. Each of the 10 real commits can expand into **any number of numbered explanatory subcommits**. Each subcommit is limited to **100 total code/diff lines** (including additions, removals and context), so a 1,000+ line change gets broken into small, meaningful pieces instead of being truncated or presented as one massive diagram. All original changed lines must be covered and all GitHub links must preserve the real SHA and old/new line numbers. Track line counts, visual quality and full coverage in the batch QA tracker; explanatory subcommits do **not** create new Git commits.

## Start a new GitHub project using Three-Lanes

**[Read the complete new-project handover](./HANDOVER-NEW-PROJECT.md)**, then copy the **[projects/_template](./projects/_template)** starter folder to `projects/<your-project-slug>/`. The handover includes the new-chat prompt, code-integrity rules, shared-engine migration plan, UI requirements, and acceptance tests.

**Important:** The starter is not connected to a project-agnostic loader yet. The existing Spring Petclinic demo remains the behavior reference; a shared project loader must be implemented before a new repository's JSON files can drive the viewer.

## The three lanes

- **Backend (left):** SVG architecture diagrams and the relevant original code.
- **Commit timeline (middle):** commit numbers, expandable learning steps, keyboard navigation.
- **Frontend (right):** rendered UI previews and relevant HTML/code.
- **View** keeps the visual explanation and focused code. **GitHub** retains the visual while showing exact diffs, original source, and a **View here** before/after comparison.

## Modular structure

```text
Three-Lanes/
├── index.html                            # Small HTML shell
├── styles/
│   └── app.css                           # App theme and layout
├── src/
│   ├── app.js                             # Navigation, GitHub loading, source viewer
│   ├── data/
│   │   └── petclinic-demo.js             # 10 commits / 25 teaching steps
│   └── visuals/
│       ├── asset-library.js              # Optional standalone asset loader
│       ├── visual-registry.js            # Choose a file for a particular SHA + step
│       ├── backend-svg/
│       │   └── petclinic-diagrams.js     # Existing dynamic backend diagrams
│       └── frontend-ui/
│           └── petclinic-previews.js     # Existing interactive UI previews
├── visuals/
│   ├── svg/
│   │   ├── README.md
│   │   └── petclinic-*.svg               # 17 archived original SVGs
│   └── frontend-ui/
│       ├── README.md
│       └── petclinic-*.html              # 8 standalone HTML previews
└── .github/workflows/pages.yml
```

## Navigate from diagrams to exact source code

Each selected commit can expose **Source links** under the visual. The links are resolved against the historical **40-character GitHub commit SHA**, not the repository's latest `main` branch.

- Click an underlined class, method, SQL label, server or database icon in an inline SVG to preview the corresponding source line in Three-Lanes.
- Click **Source links** to view exact numbered code within the lane; click the adjacent arrow to open the same line on GitHub.
- Related source references include verified controller/domain/repository definitions, SQL constraints and tests where applicable.
- The in-page preview shows actual file text and nearby lines, not recreated teaching snippets.
- A link is offered only when the specified file and symbol are found at that SHA. Unavailable references are not assigned invented line numbers.
- Existing **View**, **GitHub**, **View here**, 10-commit navigation, and scroll-position persistence remain intact.

The initial curated relationships are in [`src/navigation/source-manifest.js`](./src/navigation/source-manifest.js); the reusable navigator is [`src/navigation/code-navigation.js`](./src/navigation/code-navigation.js).

**Example:** [OwnerController.java line 103 at Commit 8.1](https://github.com/spring-projects/spring-petclinic/blob/bb37aad8c332264723817d855e8b3b96b7c392bc/src/main/java/org/springframework/samples/petclinic/owner/OwnerController.java#L103) is linked to [OwnerRepository.java line 45 at that exact same commit](https://github.com/spring-projects/spring-petclinic/blob/bb37aad8c332264723817d855e8b3b96b7c392bc/src/main/java/org/springframework/samples/petclinic/owner/OwnerRepository.java#L45).

The relationships in this 10-commit demo are curated and line-verified, **not** an exhaustive automatically generated call graph for arbitrary repositories.

## Copy and paste an existing visual

All **25 existing visual steps** have been exported individually. You can reuse or modify them without editing the app's UI rendering logic.

**Backend:** copy a finished SVG into `visuals/svg/` (example: [petclinic-8.1.svg](./visuals/svg/petclinic-8.1.svg)).

**Frontend:** copy a finished HTML preview into `visuals/frontend-ui/` (example: [petclinic-5.1.html](./visuals/frontend-ui/petclinic-5.1.html)).

Then open [src/visuals/visual-registry.js](./src/visuals/visual-registry.js) and register the file under the real commit SHA + learning-step ID. For example:

```javascript
window.THREE_LANES_VISUAL_ASSETS = Object.freeze({
  "bb37aad8c332264723817d855e8b3b96b7c392bc:8.1": {
    backend: "visuals/svg/petclinic-8.1.svg"
  },
  "f9399b7a9fe3a244ba75e83bf2bc6f2cb32b3011:5.1": {
    frontend: "visuals/frontend-ui/petclinic-5.1.html"
  }
});
```

The registered file replaces **only** that step's visual. Other steps continue using the original dynamic SVG and UI preview generators. The registry starts empty to preserve the existing visuals until you deliberately register an override.

New standalone HTML previews are isolated in sandboxed iframes to keep their CSS and JavaScript from affecting the overall site.

## Run locally

The app is static and has no build step. For local testing, serve the repository over HTTP (e.g. `python -m http.server 8000` from the repo root), then open `http://localhost:8000`. GitHub Pages serves the same files automatically.

## Scaling beyond the initial 10 commits

The new file structure improves **maintainability and reusability**, but it does not by itself index 100,000 commits. For very large repositories, the next layer should add paginated commit ingestion, cached/sharded commit metadata, on-demand diffs, virtualized timeline navigation, and indexed search. The current demo still deliberately loads only its 10 selected commits.

The UI diagrams are instructional reconstructions, not screenshots of a running historical application. Original GitHub source is loaded live where supported by the GitHub API, subject to network and rate limits.
