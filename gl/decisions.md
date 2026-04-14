# GlobaLink — Decisions Register
Last updated: 260413

## Decisions affecting all entities logged here.
Project-specific decisions are in their respective decisions.md files.

---

## 260413 — Claude Code Tooling Standards

**Decision:** Implement all /insights recommendations as hard rules across all repos.

**What changed:**
- Pre-commit hook added globally: blocks commits with TypeScript or ESLint errors
- /preflight and /closeout custom commands created
- GIT DISCIPLINE rule is now universal: never `git add .` or `git add -A` — always stage specific files
- SQL DISCIPLINE added to command-app: always query information_schema before writing migrations
- SESSION PROTOCOL and BRAIN REPO rules now in root CLAUDE.md and repo-level CLAUDE.md files
- SECURITY rule formalized: never suggest pasting secrets in chat

**Why:** 177 sessions analyzed — top friction sources were buggy code requiring multi-round fixes, Claude not reading context before acting, and git staging collisions from parallel agent sessions. These rules directly address each friction source.
