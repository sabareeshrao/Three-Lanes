# Modular SVG illustration library — 50 standalone assets

**Browse:** [Interactive gallery](./index.html) · [Machine-readable catalog](./catalog.json) · [Source SVG files](./assets/) · [Illustration builder functions](./scripts/motifs.js)

This is the component toolbox for Three-Lanes. Each file is a standalone, editable SVG, identified by a permanent **illustration ID**. It is **not a mandatory list of permitted diagrams**. The AI can use any one asset, combine several, redraw or adapt them, or create an entirely new diagram or component without waiting for a pattern approval. Don't force a code change into an unrelated template.

## AI selection contract

1. **Inspect the actual code first** and decide what needs to be explained. Do not start by choosing the prettiest sample.
2. Optionally inspect `illustration-library/catalog.json`. Search by category, title, ID or tags. For example, use `database-engine` for a recognizable data store or `ram-dimm` when explaining memory.
3. Retrieve exactly the SVG source you need, using the `source` path or `raw` link. Every asset is fully independent. **Arrows** (`arrow-straight`, `arrow-elbow`, `arrow-bidirectional`, `arrow-async`, `arrow-feedback`) are separate code assets, as are tables (`sql-table`), servers and hardware.
4. Combine components when useful. You may embed them as images inside an SVG or HTML, inline their vector groups for precision, or construct new SVG markup. Each composite **diagram** receives its own new ID, independently of the illustration IDs it uses. Namespaced IDs avoid gradients and element collisions when inlining.
5. **Create your own SVG when required.** Give it a meaningful, unique `data-tl-diagram-id` (e.g., `petclinic-owner-lookup`), `viewBox`, `<title>` and `<desc>`. It need **not** match any existing diagram pattern ID or use any catalog asset. New standalone reusable parts may also receive `data-tl-illustration-id` and their own file. Add reusable parts to `catalog.json` for discoverability; this is not a gate on creativity.
6. Apply the [shared design tokens](../design-system/tokens.css) and visually inspect layout/legibility. Source accuracy, clipped text, too-small arrows and confusing composition are meaningful QA concerns. Using a new ID is **never itself an error**.

## Examples

**Retrieve one element by stable ID:**

```js
const library = await fetch('/Three-Lanes/illustration-library/catalog.json').then(r => r.json());
const asset = library.assets.find(item => item.id === 'database-engine');
const svgSource = await fetch('/Three-Lanes/illustration-library/' + asset.source).then(r => r.text());
```

**Embed a component in a new diagram:**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1100 500"
     role="img" aria-labelledby="diagram-title diagram-desc"
     data-tl-diagram-id="owner-lookup" data-design-version="1">
  <title id="diagram-title">Owner lookup</title>
  <desc id="diagram-desc">Browser requests an owner; controller queries a database.</desc>
  <image href="/Three-Lanes/illustration-library/assets/web-browser.svg"
         x="0" y="90" width="380" height="240"/>
  <path d="M360 230H720" fill="none" stroke="#306BAF" stroke-width="5"/>
  <image href="/Three-Lanes/illustration-library/assets/database-engine.svg"
         x="690" y="90" width="400" height="240"/>
</svg>
```

This example is an illustration of **composition**, not a claim that the underlying PetClinic source matches it. Check the real changed source file before making a teaching diagram.

## Content and quality conventions

- Keep original assets transparent, self-contained, and independently versionable.
- Every standalone asset: unique slug ID, matching filename, descriptive title and description, accessible role, `viewBox`, no scripts or remote resources.
- The source SVG is authoritative. Metadata supplies discovery, not rendering or permission.
- The gallery is data-driven and shows **source code links for every illustration**.
- AI may create new arrows, symbols, tables, CPU variants, visual styles or full compositions. The catalog grows naturally; it has no maximum size.
- One learning step still owns exactly **one changed project source file**, with no more than 100 instructional code/diff lines. That rule is independent from how many SVG components the explanation uses.

## Separate repository

The library is packaged inside `Three-Lanes/illustration-library/` because the connected GitHub writer cannot create a new repository. It can be copied unchanged into a standalone repository; relative catalog paths and source SVGs already form an independent package.
