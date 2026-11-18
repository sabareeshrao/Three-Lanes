# Three-Lanes repository instructions for GitHub Copilot

This repository maintains a modular visual commit-learning viewer. **Read [../AGENTS.md](../AGENTS.md) before coding**, then consult [../HANDOVER-NEW-PROJECT.md](../HANDOVER-NEW-PROJECT.md) and [../projects/_template/README.md](../projects/_template/README.md).

For a new GitHub repository project, create `projects/<slug>/` from `projects/_template/` and use **actual 40-character GitHub commit SHAs**, verified source line links, real dependencies/tests, and standalone SVG/HTML assets. Adapt shared `src/` modules instead of copying the monolithic demo. The existing viewer and visual behavior are regression requirements: 3 lanes, ChatGPT dark theme, default full-width View here Before/After, SVG click-to-preview and click-again-to-close, keyboard navigation and vertical scroll persistence.

The current starter JSON manifest is **not yet connected to a generic project loader**. Inspect actual code and implement the missing adapter before claiming that a new project can be selected by config alone.

Do not fabricate code/source references. Test and verify all modifications; only report deployed Pages URLs as live after checking deployment.
