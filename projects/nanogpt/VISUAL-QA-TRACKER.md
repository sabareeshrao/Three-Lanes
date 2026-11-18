# nanoGPT · Batch 001 — Visual QA tracker

**Status: IN PROGRESS.** Source change coverage verified for all ten real historical commits. SVG assets are present and statically inspected. **1440px / 390px browser screenshot review and full UI interaction testing are not completed.** Do not label this batch visually complete until these tests pass.

| Commit | Changed lines | Learning steps | Historical source | 1440px | 390px | Click/source test |
|---|---:|---:|---|---|---|---|
| 1 · fe804286 | 628 | 12 | Verified | Pending | Pending | Pending |
| 2 · c9fe00c0 | 12 | 2 | Verified | Pending | Pending | Pending |
| 3 · 5d2b4807 | 98 | 7 | Verified | Pending | Pending | Pending |
| 4 · 70b5d93a | 52 | 2 | Verified | Pending | Pending | Pending |
| 5 · b760ef13 | 33 | 2 | Verified | Pending | Pending | Pending |
| 6 · 3000cf5d | 63 | 1 | Verified | Pending | Pending | Pending |
| 7 · ee6459f1 | 14 | 1 | Verified | Pending | Pending | Pending |
| 8 · dea15072 | 107 | 4 | Verified | Pending | Pending | Pending |
| 9 · cc117441 | 21 | 1 | Verified | Pending | Pending | Pending |
| 10 · 97e2ab1b | 14 | 1 | Verified | Pending | Pending | Pending |

Every addition/deletion in each supplied GitHub patch was assigned exactly once to a step. All displayed diff/context slices are ≤100 lines. The original Petclinic viewer and CSS are reused; project-specific SVG and mentor content are stored separately. The exact patch audit is in `batches/001/source-audit.json`.

## November 18, 2026 — targeted reconstruction

- nanoGPT **View** now defaults to a side-by-side Before/After inspector, including when the file was introduced in that commit. Spring Petclinic keeps its prior default.
- Replaced **33/33** initial SVGs with source-derived mechanism diagrams, model-configuration comparisons, and documentation-only patch treatments. No fictional application frontend.
- Improved focused diagrams for causal self-attention and the triangular mask, token/position embeddings, the Transformer residual block, checkpoint weight import, generation, shifted token windows, training, benchmark timing, profiler schedule, and DDP/rank-zero logic.
- Curated **33 individual Mentor Explanation** texts and updated **223 historical source references**. Changed code/diff coverage remains **1,042 added/deleted text lines** across 10 original commits.
- Static validation of all 33 SVG strings: exactly one root SVG, balanced markup, no raw unescaped ampersands, every `data-target` within its step's source-target array. **33/33 PASS**.
- **Remaining mandatory work:** independent rendered screenshots and full browser interaction testing at 1440px and 390px, including click-to-open/click-again-to-close and scroll-position stability. This tracker is still **IN PROGRESS**, not 10/10 visual PASS.
