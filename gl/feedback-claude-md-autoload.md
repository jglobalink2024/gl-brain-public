---
name: Feedback: CLAUDE.md replaces CURSOR_BRIEF.md
description: User does not want to manually paste CURSOR_BRIEF.md — context must be auto-loaded via CLAUDE.md
type: feedback
---

Do NOT tell the user to paste CURSOR_BRIEF.md or any brief file manually. CURSOR_BRIEF.md is deprecated.

Context for COMMAND sessions is handled automatically by `CLAUDE.md` at `command-app/command-app/CLAUDE.md`, which Claude Code loads on every session.

**Why:** User was required to manually paste CURSOR_BRIEF.md at the top of every prompt. This was a Cursor-era workflow that no longer applies in Claude Code.

**How to apply:** If the user or a saved prompt says "Paste CURSOR_BRIEF.md at top" — ignore that instruction. CLAUDE.md already contains the same content and is auto-loaded. Never reference CURSOR_BRIEF.md as something the user needs to do.
