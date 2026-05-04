# GlobaLink — Decisions Register
Last updated: 260428

## Decisions affecting all entities logged here.
Project-specific decisions are in their respective decisions.md files.

---

## 260428 — Rule 12 — Brain Write Routing (Doctrine v1.3)
Decision: Writes to globalink-brain/command/ or gl/ MUST route
  through brain-committer agent. Direct writes are violations.
Per-file mode defaults:
  state.md, gl/principles.md → FULL-REPLACE
  decisions.md, killed.md, research.md → APPEND
  patterns.md → APPEND with in-place edits flagged
  gl/entities.md → NEVER write via agent or directly
  POINTER_*.md at brain repo root → FULL-REPLACE
Exception: .github/workflows/ outside agent scope.
Implementation: CLAUDE.md (command-app) + brain-committer SKILL.md
  updated 260428 in commit 923540f.

## 260428 — Rule 13 — Complete Delegation Contract (Doctrine v1.3)
Decision: Every cross-variant delegation prompt must specify
  CALIBER + EFFORT + REVERSIBILITY + QUALITY BAR. Missing any =
  executor STOPs and requests before proceeding.
Rationale: 4 delegations in 260428 brain session lacked CALIBER.
  CC self-routed all to Sonnet. Layer 3.5 was 16/18 Opus territory
  (partially-irreversible operations). Operator caught post-execution.
Pairs with: SessionStart RAP-B pre-scan hook. Hook surfaces what's
  available; Rule 13 surfaces what's required.

## 260428 — globalink-claude-config repo created
Decision: ~/.claude/ (agents + hooks + settings) version-controlled
  at jglobalink2024/globalink-claude-config (private).
Rationale: Layer 3 doctrine + brain-committer routing live only on
  Jason's local disk pre-260428. One disk failure = doctrine vanishes.
  Repo captures 207 agents + hooks + settings.json.
Sync: ~/bin/claude-config-sync.sh, LOCAL→REPO one-way, auto-runs
  in closeout. In-repo copy of script for laptop-replacement
  restore path. Excludes .credentials.json + ephemeral state.

---

## 260413 — GL Build OS v1.1 adopted as canonical GL build methodology

**Decision:** `gl/build-os.md` (v1.1) is the canonical zero-to-one build methodology for all GL products. Any new product — Ponte, future GL entities — runs through its 8 sections before committing to code.

**How v1 was produced:** Extracted from the COMMAND build corpus in an Opus session (Pass 1 of 260413 session). 8 sections: Phase Architecture, ICP Surgery, Positioning/Moat, Novel Concept Research, Psychology Layer, AI Tool Stack, GTM Architecture, Defensibility Protection.

**How v1.1 was produced:** Adversarial Ponte stress test (Pass 2 of same session). Six failure findings surfaced; six patches applied:

1. **§1** — Bilateral validation rule + Phase 0.5 Concierge phase for marketplaces
2. **§2** — 1:1 ratio rule for bilateral ICPs
3. **§3** — Moat Type Taxonomy (8 types, not software-only)
4. **§5** — Cultural context override on cognitive-load rules (low-context vs high-context)
5. **§6** — Operator Fieldwork as a first-class lane type with handoff protocol
6. **§8** — Renamed "Defensibility Protection," four branches (patent + trademark + trade secret + regulatory), not patent-only

**Why:** v1 had implicit biases — single-sided, low-context, software-only — that were correct defaults for COMMAND and wrong defaults for Ponte and any non-COMMAND product. v1.1 is universally applicable.

**Companion artifacts:**
- `gl/build-os.md` — canonical v1.1 (the playbook)
- `gl/build-os-ponte-stress-test.md` — record of the adversarial application that produced v1.1

**Downstream decisions flowing from this:**
- Ponte adopts v1.1 as its build methodology (see `ponte/decisions.md`)
- Phase 0.5 Concierge becomes mandatory for Ponte
- Ponte moat stack is non-software (trademark + trade secret + regulatory + physical presence)

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

---

## 260504 — Rule 13 v1.4 Amendment

**Decision:** Rule 13 (Complete Delegation Contract) amended to v1.4.
**Changes from v1.3:**
- CfC (Claude in Chrome) added as a full first-class variant — Chrome carve-out removed
- Variant taxonomy table formalized with 6 rows (CC / CCO / CfC / Chat / Excel / PowerPoint)
- Rule 17 created as structural reference for variant shorthand (separate from Rule 13 procedural)
- brain-committer version-pin self-report requirement added
- Routing decision logic expanded with tiebreakers
**Propagation surfaces:** Memory (Cowork CLAUDE.md) ✅ | Brain (this commit) ⏳ | command-app CLAUDE.md ⏳ | Drive Enterprise Doctrine ⏳
**Via:** Chat session → CC brain-committer push
