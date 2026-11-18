# Three-Lanes — 200 Lightweight Blueprint SVG Components

**Live gallery:** [Browse all 200](./index.html) · [Catalog metadata](./catalog.json) · [SVG source files](./assets/) · [Designer reference examples](../design-system/diagram-catalog/).

This library contains **200 independently editable SVG modules** in the simple original Petclinic prototype style. The heavy, shaded 50-asset experiment remains retired. Each SVG has its own stable ID, searchable tags and file. AI can combine any number of assets or invent a new one; **200 is the current inventory, not a maximum or a whitelist.**

## Inventory

| Category | Count |
|---|---:|
| Primitives | 20 |
| Connectors | 5 |
| Java & Spring | 18 |
| APIs & Backend | 18 |
| Database & Storage | 16 |
| Testing & Quality | 14 |
| Cloud & DevOps | 18 |
| Security & Identity | 13 |
| AI & ML | 20 |
| Data & Analytics | 14 |
| UI & Frontend | 12 |
| Networking | 10 |
| Hardware | 8 |
| Connectors & Workflow | 14 |
| **Total** | **200** |

## Requirements for future AI

1. **Analyze the real source code change first.** Determine which exact mechanism the learning step must illustrate; never invent behaviors to fit available shapes.
2. Read `catalog.json` and select an appropriate ID, or create a brand-new diagram if the current components don't fit. The existing diagram recipes are examples only.
3. Follow the **Petclinic visual language**: flat light SVG paper; transparent standalone icons; minimal navy/soft-blue/green/red outlines; simple database, browser and controller representations; unobtrusive grid and generous whitespace on the *full diagram only*.
4. **Connector stroke 1.5–2.2px; compact outlined arrowhead around 7px.** No bulky triangular arrows, 3D servers, elaborate decorative icons, excessive labels, overlaps, clipping or oversized gaps.
5. Create one canonical file per teaching substep, at most 100 instructional source/diff lines. This is separate from SVG composition.
6. **Run `npm run audit:design` and `npm run test:visual`**, then inspect actual desktop/mobile screenshots. Browser tests confirm basic geometry, not artistic or factual correctness.
7. To create a new reusable SVG, add `assets/<unique-slug>.svg` and its entry in `catalog.json`, including ID, title, category, search tags and path. For a one-off diagram, a unique ID and valid accessible SVG are enough; no mandatory registration or approval gate.

Each SVG uses `data-tl-illustration-id`, `data-design-version="1"`, an SVG viewBox and accessible `<title>` and `<desc>`. Source is the authority; metadata simply makes assets discoverable.

## Reproducibility

The 175 additions are described by [expansion-175.json](./scripts/expansion-175.json) and their compact artwork comes from [blueprint-renderer.js](./scripts/blueprint-renderer.js). The original 25 retain their authored SVGs. Specialized connector source files have dedicated hand-authored line geometry. Avoid regenerating those specialized files with generic icons unless intentionally revising them.

**This library is stored inside Three-Lanes**, with source paths and manifest ready for use by other repositories or agents.
