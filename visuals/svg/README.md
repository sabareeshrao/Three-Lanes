# Reusable backend SVG library

Drop a finished **standalone `.svg`** file directly into this folder. Existing Petclinic SVGs are extracted from the exact visual generator used in the original project.

## Reuse an SVG

1. Copy an existing SVG or paste a new SVG into `visuals/svg/`, e.g. `owner-search.svg`.
2. Open `src/visuals/visual-registry.js`.
3. Register it with the real commit SHA and viewer substep:

```js
"bb37aad8c332264723817d855e8b3b96b7c392bc:8.1": {
  backend: "visuals/svg/petclinic-8.1.svg"
}
```

The viewer substitutes the saved SVG only for that step. Every other step still uses the existing built-in renderer in `src/visuals/backend-svg/petclinic-diagrams.js`.

SVGs are scalable vector source files, **not PNG screenshots**. They should use `viewBox`, include their own paths, icons and text, and remain readable in a variable-width lane. Keep the original GitHub code in the source panel, not inside the SVG.

The sample files named `petclinic-N.N.svg` are archived copies of the diagrams that were already created for the 10-commit demonstration. You can reuse, edit, or rename them.
