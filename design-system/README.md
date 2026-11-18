# Three-Lanes Design System · v1.0.0

**Status:** shared design tokens, six optional reference compositions and 200 lightweight SVG primitives, technical symbols and connectors. References are not binding or evidence for a historical commit.

- [Browse the design catalog](./catalog/index.html) (GitHub Pages: `/Three-Lanes/design-system/catalog/`)
- [Canonical colors, fonts, sizes and scroll utilities](./tokens.css)
- [Registered diagram patterns and approval states](./registry.json)
- [Automated source checks](../quality-gates/design-audit.mjs)
- [Browser screenshot/geometry checks](../quality-gates/browser-smoke.mjs)

## Mandatory start-of-task sequence for every AI coding agent

1. Read the repository root `AGENTS.md`, project-level `AGENTS.md`, and **this document**. Before generating visuals, read `registry.json` and `tokens.css`; inspect a Petclinic-style SVG primitive or recipe.
2. Analyze the **actual changed file at the immutable commit SHA**. One teaching step = one changed file. Split that file further if it needs more than 100 instructional diff/code lines; every file in the real commit must be covered.
3. Choose, combine or adapt relevant independent illustrations from `../illustration-library/catalog.json` or freely invent a new diagram with its own ID. Reference compositions are optional. Do not draw a generic pipeline for a database constraint or UI state. The first three commit diagrams need exceptional composition.
4. Build from the shared tokens. Do not invent a new font stack, green/mint page skin, yellow full-stack chip, painted short SVG canvas, alternate grid background, bulky arrows or an expanding lane height.
5. Run `npm run audit:design` and `npm run test:visual`; inspect screenshots at 1440px and 390px. Fix clipping, overlap, crossing labels and misleading semantics before reporting a visual PASS.
6. Update the project QA tracker and commit source-grounded diagrams with their unique **diagram ID** and exact file/step mapping. Do not claim a human visual review happened when only automated checks ran.

## Reuse and extension — open vocabulary

Browse **[Lightweight SVG kit](../illustration-library/)** and their [machine-readable IDs](../illustration-library/catalog.json). A database illustration, router, server, CPU, RAM, SQL table or arrow is a standalone editable SVG. These are **ingredients**, not rigid templates. AI may compose any number of these, change them or invent a completely new diagram. It must **not** force a code change into the six reference compositions, and no prior catalog registration or candidate/approved flag is required for new project diagrams.

New diagrams should have a unique `data-tl-diagram-id`, descriptive `title`, `desc`, `viewBox` and `preserveAspectRatio="xMidYMid meet"`. Optional `data-tl-illustration-id` is reserved for reusable standalone components. Diagram ids are open-ended; validation checks structure, safety and visual geometry, **not membership in a fixed list**.

Thin connector guidelines at 640×400: ≤3px ordinary stroke, ≤12px arrowhead length, ≥12px whitespace between labels and connectors. No edge cropping, arrowheads embedded in icons, overlapping labels, disproportionate strokes or labels too small to read. Screenshots and technical-source review remain mandatory to claim diagram quality.

## Core visual grammar

| Element | Fixed standard |
|---|---|
| UI font | `var(--tl-font-ui)`: Apple San Francisco system stack; Inter fallback |
| Code font | `var(--tl-font-code)`: SF Mono / Menlo / Consolas |
| Body background | `--tl-bg` charcoal |
| Backend / Frontend / Full-stack chips | `--tl-backend` blue / `--tl-frontend` green / `--tl-fullstack` orange |
| Inactive chips | Neutral charcoal, with thin category accent only |
| Diagram paper | `--tl-canvas` light continuous canvas; 24px dots + 120px major grid |
| Diagram scaling | SVG `viewBox`, `xMidYMid meet`; center within the fixed canvas |
| Lane height | `--tl-lane-height:700px` in the root prototype |
| Scrollbar | **Invisible** middle commit conveyor, but keep real vertical scroll |
| Geometry | 13px cards, 15px lane corners; no out-of-bounds text |
| Content | Source-specific, no generic text-in-box reuse, no fabricated UI/code |

Decorative SVG examples in this catalog are fictional specimens and **must not** be linked as a claim about a real commit.

## What the automated checks actually enforce

The Node audit checks catalog metadata, diagram structure/accessibility, shared-token imports, one-file rule documentation, hidden-but-working conveyor scroll and new/changed SVG safety and geometry **without a fixed pattern whitelist**. The Chromium smoke test checks desktop/mobile catalog rendering, image loading, text viewBox bounds, scrollbar invisibility and scrolling behavior, and saves screenshots for review. **Automated geometry checks cannot judge technical truth, aesthetics, confusing arrows or semantic overlap**; manual visual and historical-source review are still required.

The Pages workflow runs the gates before deployment. Failed gates prevent that workflow from deploying. It does **not** by itself prevent direct pushes or enforce human approval on `main`; configure branch protection/required reviewers and CODEOWNERS in GitHub settings for those guarantees.
