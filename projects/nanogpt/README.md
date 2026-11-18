# nanoGPT · Three-Lanes

**Published route (subject to Pages deployment):** https://sabareeshrao.github.io/Three-Lanes/projects/nanogpt/batches/001/

This project uses the SAME shared source viewer and dark theme as the independent Spring Petclinic batch, with its Mentor Explanation design. It does not overwrite the root demo or other Spring Petclinic data.

## Batch 001

- Exactly **10** original, consecutive GitHub commits from Karpathy's `nanoGPT` default-branch ancestry.
- 33 learning slices, each at most 100 genuine diff/context physical lines. These are not additional Git commits.
- 33 independent SVG diagrams, mapped one-to-one to learning slices, each with clickable source reference.
- GitHub commit: original immutable SHA. Before code: original parent SHA. After code: selected commit SHA.
- All 1042 GitHub-added/deleted lines have been assigned once and verified against GitHub's per-commit stats.
- The right lane is intentionally quiet for backend-only or documentation-only changes; no imaginary web frontend.
- Mentor Explanation uses source-backed descriptions and SHA-pinned historical links.

**QA:** Source coverage verified; visual and interaction QA pending. See `VISUAL-QA-TRACKER.md`. This is a published preview, not a claim of all visual quality gates passed.

## What was reused

- `projects/spring-petclinic/shared/viewer.css` — unchanged styling, including mentor panel.
- `projects/spring-petclinic/shared/viewer.js` — same engine, now accepts a project repository from the page's `data-repository` attribute, preserving Petclinic default.
- `projects/nanogpt/shared/mentor.js` — nanoGPT-specific mentor content with identical panel contract.
- `projects/nanogpt/batches/001/steps.json` and `parts/` — source-bound sliced patches on demand.
