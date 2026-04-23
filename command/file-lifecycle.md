# COMMAND — File Lifecycle & Retention Policy
Last updated: 260416

## Why This Exists

No cleanup system existed before this doc. Files accumulated silently across
three separate locations with no rules on what to keep, archive, or delete.
Jason was the de facto organizer — the exact anti-pattern to avoid.

This document defines the rules. The ops-watchdog enforces them automatically.

---

## Three Storage Locations

| Location | What lives there | Persistence |
|----------|-----------------|-------------|
| `/mnt/user-data/outputs/` (Claude.ai) | Files created in chat sessions | Wiped when chat closes — ephemeral |
| `command-app/` file tree | Code, tests, ops logs, CC prompts | Git-tracked — intentional persistence |
| `globalink-brain/` | Decisions, patterns, state, research | Permanent — the point |

---

## File Purpose Tags

Every file Claude creates must be tagged at creation with one of three types.
This is declared in the first line or header of the file when created.

| Tag | Meaning | Lifecycle |
|-----|---------|-----------|
| `[ONE-USE]` | Paste-and-run prompt; disposable after execution | Delete after 7 days or after the commit that executed it |
| `[EVIDENCE]` | Test output, proof file, diagnostic artifact | Keep 90 days, then archive |
| `[PERSISTENT]` | Decision, pattern, state, strategy | Keep forever (lives in brain) |

**Examples by file type:**
- `CC_v10_Criticals_Sonnet.md` → `[ONE-USE]` — paste into CC, done
- `CC_PreV10_Complete_Sonnet.md` → `[ONE-USE]`
- Symphony master prompts before evidence is committed → `[ONE-USE]`
- Symphony output files (`tests/personas/*`) → `[EVIDENCE]`
- `SESSION_CLOSEOUT_*.md` → `[ONE-USE]` — one-chat handoff, expires in 3 days
- Ops run logs (`docs/ops/*.md`) → `[EVIDENCE]`
- Brain state/decisions/patterns files → `[PERSISTENT]`

---

## Retention Policy (Enforced by ops-watchdog Step 6)

```
CC_*.md in repo root          → delete after 7 days post-commit
SESSION_CLOSEOUT_*.md         → delete after 3 days (single-use handoffs)
tests/personas/*_v{N}.md      → move to tests/personas/archive/ after 90 days
docs/ops/*.md                 → move to docs/ops/archive/YYYY-MM/ after 30 days
docs/ops/archive/YYYY-MM/     → keep forever (permanent run history)
globalink-brain/**            → keep forever
```

**Exceptions — keep indefinitely regardless of age:**
- Any `docs/ops/*.md` with `overall_health: RED` in YAML frontmatter
- Any file explicitly marked `[PERMANENT]` in its header
- Any file referenced in a brain entry as evidence

---

## Cleanup Schedule

Automated via ops-watchdog Step 6 (runs daily after health checks at ~7:01 AM).

Manual override: paste "Clean up old files per retention policy" to CC.
Takes 2 minutes. Useful if the automated cleanup missed a cycle.

---

## What Was Wrong Before

- CC prompts accumulated in repo root with no expiry
- `tests/personas/` grew every symphony run, never pruned
- Session closeout files were called "optional" — they're actually useful ONCE (next chat) then noise
- Ops reports in `docs/ops/` had a 30-day cleanup rule in patterns.md but no agent to enforce it
- No purpose tagging — impossible to know at a glance whether a file mattered

---

## Rules for Claude When Creating Files

1. **Tag every file at creation** — include `[ONE-USE]`, `[EVIDENCE]`, or `[PERSISTENT]` in the header
2. **Announce the lifecycle** — tell Jason: "This is a one-use prompt. Delete after CC runs."
3. **Never leave session closeout files open-ended** — always note: "Expires in 3 days."
4. **Ops reports are EVIDENCE, not PERSISTENT** — they age out; the brain is where decisions live
5. **When in doubt: it goes in the brain as PERSISTENT, or it's ONE-USE**
