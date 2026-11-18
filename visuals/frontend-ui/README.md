# Reusable frontend UI library

Drop a finished **standalone `.html` component preview** directly into this folder. The copied file can include HTML, CSS and JavaScript and renders in an isolated iframe so it cannot accidentally change the rest of Three-Lanes.

## Reuse an HTML preview

1. Copy a finished preview into `visuals/frontend-ui/`, e.g. `add-visit-button.html`.
2. Open `src/visuals/visual-registry.js`.
3. Register it using the original GitHub SHA and the exact step number:

```js
"f9399b7a9fe3a244ba75e83bf2bc6f2cb32b3011:5.1": {
  frontend: "visuals/frontend-ui/petclinic-5.1.html"
}
```

Only that step's user-facing preview changes; the SVG engine, commit timeline and code panels remain untouched. Existing built-in interactive previews are in `src/visuals/frontend-ui/petclinic-previews.js` and remain active by default.

The sample `petclinic-N.N.html` files are independent archived previews derived from the current Petclinic visual engine. They include Before / After toggles but do not execute any Spring Boot backend.

**Do not paste application-wide CSS into the main index.** Keep a preview's styles scoped inside its own HTML file.
