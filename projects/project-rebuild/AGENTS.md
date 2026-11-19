# Project-Rebuild · agent instructions

This entire project is isolated in `Three-Lanes/projects/project-rebuild/`. The external `sabareeshrao/Project-Rebuild` repository is **read-only source material**. Do not modify root prototype files, global design tokens, the existing Petclinic project, or the source repository.

Read `../../AGENTS.md`, `../../HANDOVER-NEW-PROJECT.md`, `../../SUBCOMMIT-100-LINE-RULE.md`, `../../design-system/README.md`, and the 200-element `../../illustration-library/catalog.json`.

**Existing implementation:** five oldest source commits, 14 file-scoped teaching steps and 14 SVG diagrams. The actual SHA and patch are in `lessons.json`; never invent history, offsets or code. Every step covers exactly one file and no more than 100 instructional diff/code lines. For the next batch, inspect chronological GitHub history, not recent-first GitHub UI order.

**Visual style:** retain Apple/SF system font via shared CSS tokens, neutral charcoal UI, blue backend, green frontend, orange fullstack, fixed 700px lanes and independent invisible scrollbar on commit rail. Diagrams use thin 1.5–2.2px connectors, tiny outlined arrowheads, light continuous grid and only the simple Petclinic-style line vocabulary. Avoid bulky illustration art, green page film, repeated empty text boxes, clipped labels and fake frontend reconstructions. New SVGs are allowed and do not need to match a catalog whitelist.

**Source behavior:** View shows real source at the selected immutable SHA; Commit changes shows real diff with GitHub coordinates. Open file uses original GitHub blob at SHA. No click-to-focus SVG behavior. Mentor explanations should be specific, concise and collapsible; avoid repeating the same claims.

Run `node projects/project-rebuild/tests/validate.mjs` then root checks. Record desktop/mobile browser QA in `VISUAL-QA-TRACKER.md`; do not imply a manual visual review occurred if only static/CI checks ran.
