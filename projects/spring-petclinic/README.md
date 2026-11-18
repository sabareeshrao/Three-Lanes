# Spring Petclinic — Independent Three-Lanes Project

**Prototype protection:** Only new files within `projects/spring-petclinic/` belong to this work. The original Three-Lanes root app is unchanged.

**Batch 001:** The earliest ten consecutive commits in `spring-projects/spring-petclinic`, starting with [the January 9, 2013 root commit](https://github.com/spring-projects/spring-petclinic/commit/349fdef18bcf688709f19097c140c69724905768). SHA chronology and direct parent-chain verified against GitHub REST data.

- `project.json` — new project metadata, separate from the prototype
- `batches/001/commits.json` — verified ten commits and file inventory
- `batches/001/steps.json` — 34 actual source slices, maximum 86 diff lines per step
- `batches/001/visuals.json` — verified 26 SVG + 8 HTML visual mappings
- [`batches/001/index.html`](./batches/001/index.html) — dedicated independent viewer

**Status: IN PROGRESS.** Following [the 100-line subcommit rule](../../SUBCOMMIT-100-LINE-RULE.md) and [diagram quality standard](../../DIAGRAM-QUALITY-STANDARD.md). Data publication is not equivalent to completed visual QA. Full archived source remains at the original GitHub revision.

## Batch 001 preview

The new viewer is expected at **https://sabareeshrao.github.io/Three-Lanes/projects/spring-petclinic/batches/001/**. This URL has not yet been browser-verified. All 10 early real commits and 34 learning subcommits are present; visual QA remains **IN PROGRESS**, recorded in [VISUAL-QA-TRACKER.md](./VISUAL-QA-TRACKER.md).

## Batch 002 — Next ten historical commits

[**Open Batch 002 viewer**](./batches/002/index.html) · [Commit and source audit](./batches/002/source-audit.json) · [Batch 002 QA tracker](./BATCH-002-QA.md)

Ten direct descendants of Batch 001's final commit, numbered **11–20**. The large 2013 legacy Petclinic import at Commit 19 was divided into 129 focused learning subcommits, contributing to **160 total subcommits** in this batch. Each shows **at most 68 code/diff lines**, stored in lazy-loaded shards. The five binary assets and three rename-only resources are accounted for without inventing source lines.

**Batch 002 preview URL:** https://sabareeshrao.github.io/Three-Lanes/projects/spring-petclinic/batches/002/

### Mentor walkthrough and Maven diagram updates

Both batch pages use shared project-only files `shared/viewer.js`, `shared/viewer.css` and `shared/mentor.js`. A beginner-style explanation appears directly below the active SVG or UI preview. Batch 001's six Maven diagrams were replaced with functional build-system explanations. The original root Three-Lanes prototype was not modified. Browser visual QA is still required before marking these complete.
