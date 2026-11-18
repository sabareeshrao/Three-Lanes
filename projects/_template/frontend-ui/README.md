# Frontend HTML preview folder

Drop previously created standalone `.html` visual UI simulations here. Keep CSS/JS scoped in the standalone file.

Connect them through `../visuals.json` using the immutable source SHA and learning step ID. A backend-only commit should not receive an invented frontend source file.

The original Three-Lanes sandboxed iframe loader is in `src/visuals/asset-library.js`; adapt it to project-relative paths when making the project-agnostic loader.
