# Three-Lanes Design System · v1.0.0

**Status:** shared tokens and the first six catalog patterns are implemented. They are *visual construction references*, not evidence for any historical commit.

- [Browse the design catalog](./catalog/index.html) (GitHub Pages: `/Three-Lanes/design-system/catalog/`)
- [Canonical colors, fonts, sizes and scroll utilities](./tokens.css)
- [Registered diagram patterns and approval states](./registry.json)
- [Automated source checks](../quality-gates/design-audit.mjs)
- [Browser screenshot/geometry checks](../quality-gates/browser-smoke.mjs)

## Mandatory start-of-task sequence for every AI coding agent

1. Read the repository root `AGENTS.md`, project-level `AGENTS.md`, and **this document**. Before generating visuals, read `registry.json` and `tokens.css`; inspect at least one relevant approved SVG example.
2. Analyze the **actual changed file at the immutable commit SHA**. One teaching step = one changed file. Split that file further if it needs more than 100 instructional diff/code lines; every file in the real commit must be covered.
3. Choose a relevant registered **approved** diagram pattern by mechanism, not by convenience or repetition. Do not draw a generic pipeline for a database constraint or UI state. The first three commit diagrams need exceptional composition.
4. Build from the shared tokens. Do not invent a new font stack, green/mint page skin, yellow full-stack chip, painted short SVG canvas, alternate grid background, bulky arrows or an expanding lane height.
5. Run `npm run audit:design` and `npm run test:visual`; inspect screenshots at 1440px and 390px. Fix clipping, overlap, crossing labels and misleading semantics before reporting a visual PASS.
6. Update the project QA tracker and commit the source-grounded diagrams with their **pattern ID** and exact file/step mapping. Do not claim a human visual review happened when only automated checks ran.

## Reuse and extension

**The catalog is open-ended.** If the code requires a mechanism not in `registry.json`, design a NEW diagram type using the same typography, blueprint canvas, layout and spacing system. Create `diagram-catalog/<unique-id>.svg`, add its documented registry entry with `status: "candidate"`, then run audit and capture screenshots. A reviewer must check source fidelity, visual quality and responsive legibility before upgrading its status to `approved`. New project diagrams may use **approved** pattern IDs only; CI refuses candidate or unknown IDs.

Each custom SVG under a project `svg/` directory must declare these root properties:

```xml
<svg viewBox="0 0 760 430" role="img"
     aria-labelledby="title desc"
     data-tl-diagram-type="request-lifecycle"
     data-design-version="1"
     preserveAspectRatio="xMidYMid meet">
```

Include real accessible `<title>` and `<desc>`. Use semantic actual code terms for labels. Only one changed file is the owner of each focused learning step. Existing historical SVGs are grandfathered until they are edited; new or modified project SVGs must meet the contract.

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

The Node audit checks approved catalog metadata/IDs, diagram structure/accessibility, shared-token imports, one-file rule documentation, hidden-but-working conveyor scroll and **new/changed** project SVG pattern approval. The Chromium smoke test checks desktop/mobile catalog rendering, image loading, text viewBox bounds, scrollbar invisibility and scrolling behavior, and saves screenshots for review. **Automated geometry checks cannot judge technical truth, aesthetics, confusing arrows or semantic overlap**; manual visual and historical-source review are still required.

The Pages workflow runs the gates before deployment. Failed gates prevent that workflow from deploying. It does **not** by itself prevent direct pushes or enforce human approval on `main`; configure branch protection/required reviewers and CODEOWNERS in GitHub settings for those guarantees.
