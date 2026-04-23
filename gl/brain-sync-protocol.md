# GlobaLink Brain — Multi-Variant Sync Protocol
# [PERSISTENT]
Last updated: 260422

> 260422 rename: private GL brain repo moved from `jglobalink2024/globalink-brain`
> to `jglobalink2024/gl-brain`. Public mirror moved from `globalink-brain-public`
> to `gl-brain-public`. Legacy repo is archived read-only; do not write.
> Local folder rename pending (file locks).

## Intent

Every Claude variant (Code, Chat, Cursor, Chrome) reads from and writes to the correct
brain for the entity context of the session. Single source of truth per entity.
Jason is never the action officer for syncing. No manual paste paths.

---

## Entity → Brain Mapping (HARD WALL)

| Entity | Brain repo | GitHub account | Supabase relay |
|--------|-----------|----------------|----------------|
| GlobaLink LLC (GL) | jglobalink2024/gl-brain | jglobalink2024 | gl-brain (wlhodjpgidopmtkqxtss) |
| Phase Line LLC (PL) | jphaselinellc2018/phase-line-brain | jphaselinellc2018 | pl-brain (hrmlntvdbvxypversnfv) |
| Personal / HEARTH | jcameron52061/hearth-brain | jcameron52061 (temp) | hearth-brain (jexhxufepfcdhbpkvjck) |

**These walls are absolute. Never write GL content into PL or HEARTH brain, or vice versa.**
When in doubt about which brain a piece of content belongs to: GL is business/product,
PL is company (dormant), HEARTH is personal/operator. Not three versions of the same thing.

---

## Write Paths

### Claude Code / Cursor (primary — all three brains)

1. Write/edit local brain files in the appropriate local repo
2. `git add <specific files>` (never `git add .`)
3. `git commit -m "brain: [description] [via: CC]"`
4. `git push`

Local paths:
- GL: `C:\Users\jdavi\OneDrive\Desktop\GlobalInk Repos\globalink-brain\`
- PL: `C:\Users\jdavi\OneDrive\Desktop\GlobalInk Repos\phase-line-brain\`
- HEARTH: `C:\Users\jdavi\OneDrive\Desktop\GlobalInk Repos\hearth-brain\`

Commit format: `brain: [description] [via: CC | cursor | watchdog←chat]`

### Claude Chat → GL brain only (async — via brain_queue)

At session close, for each GL brain file that needs updating:

```sql
INSERT INTO brain_queue (file_path, operation, section_header, content, via)
VALUES (
  'command/state.md',       -- target file relative to globalink-brain root
  'append',                 -- 'append' | 'full_replace'
  'Session Log',            -- ## header to append after (null = end of file)
  '[content to add]',       -- the actual update text
  'chat'
);
```

**brain_queue is in command-gl Supabase (ycxaohezeoiyrvuhlzsk) — the GL project DB.**
ops-watchdog drains it at 7:01 AM daily → commits to globalink-brain → git push.
Trigger early drain: `/ops-check`

### Claude Chat → PL / HEARTH brains

PL is dormant — no active chat sessions target it. CC/Cursor is the only write path.
HEARTH is personal — typically Jason works HEARTH content via CC locally, not Claude chat.

**If a Claude chat session ever needs to write to PL or HEARTH:**
Output a brain update block at the end of the session for CC to commit in the next session.
Format:
```
[BRAIN WRITE REQUIRED]
Brain: hearth | pl
File: state.md
Operation: append | full_replace
Content:
[content here]
[END BRAIN WRITE]
```
CC will detect this block at session open and apply it before proceeding.

---

## Read Paths

### Claude Code / Cursor
Local filesystem — direct file access. Always current.

### Claude Chat (GL sessions)
**Priority order:**
1. GitHub Integration connector → attach brain files from jglobalink2024/gl-brain
2. Fallback: public mirror (jglobalink2024/gl-brain-public) raw URLs

**Auto-fetch at session open (STEP 0):** `gl/format.md` — defines JRF response format.
Then fetch the POINTER file for the session's project target.

### Claude Chat (HEARTH sessions)
Fetch from jcameron52061/hearth-brain via GitHub MCP or HEARTH project knowledge files.

### Claude Chat (PL sessions)
PL is dormant. If a PL session is needed: fetch from jphaselinellc2018/phase-line-brain.

---

## Relay Infrastructure (observability — not a write path)

Each brain repo has a GitHub webhook → Supabase Edge Function (`brain-relay`) that captures
commit metadata into a `brain_commits` table. This is read-only observability — you do not
write TO the relay. The relay captures what you write via git push.

| Brain | Webhook ID | Relay URL |
|-------|-----------|-----------|
| GL | 608905295 | wlhodjpgidopmtkqxtss.supabase.co/functions/v1/brain-relay |
| PL | 608905468 | hrmlntvdbvxypversnfv.supabase.co/functions/v1/brain-relay |
| HEARTH | 608905648 | jexhxufepfcdhbpkvjck.supabase.co/functions/v1/brain-relay |

Relay `brain_id` values: `"gl"`, `"pl"`, `"hearth"` (set by env var at deploy time).
Historical commits (pre-relay) were backfilled 260422 with empty file arrays.

---

## Session Close Checklist (all variants)

Before announcing session complete:
1. Identify which brain files changed this session
2. Write updates via the correct path:
   - CC/Cursor: local file → git push (immediate, all 3 brains)
   - Chat (GL): INSERT into brain_queue (async, committed by watchdog)
   - Chat (PL/HEARTH): output [BRAIN WRITE REQUIRED] block
3. Confirm commit SHA (CC) OR INSERT success (chat)
4. Suggest thread name: `[GL | WORKSTREAM | Topic · Topic | YYMMDD]`

Never announce "done" until brain updates are queued or committed.

---

## Common Failures (do not repeat)

| Failure | What happened | Rule |
|---------|--------------|------|
| GitHub Integration write | GH Integration is READ-ONLY. Commits via it don't work. | Chat writes go to brain_queue only. |
| `git add .` in brain repo | Staged unintended files including secrets. | Always stage specific files by name. |
| Output block fallback | Jason had to paste output into next session. | Never use. brain_queue exists for a reason. |
| CC local memory | Wrote memory to `~/.claude/projects/...` instead of brain repo. | All persistent memory → brain repo only. |
| Wrong brain for entity | GL session wrote to HEARTH brain by mistake. | Check entity context at session start. |
| Relay as write path | Tried to write TO the relay directly. | Relay is capture-only. Write via git push. |

---

## brain_queue Schema (GL Supabase — ycxaohezeoiyrvuhlzsk)

```sql
id            uuid        PK, auto
created_at    timestamptz DEFAULT now()
file_path     text        -- relative path in globalink-brain, e.g. 'command/state.md'
operation     text        -- 'append' | 'full_replace'
section_header text       -- ## header to insert after (null = end of file)
content       text        -- content block to write
via           text        -- 'chat' | 'cursor' | 'CC'
committed_at  timestamptz -- null = pending; set when watchdog commits
commit_sha    text        -- git SHA after commit
```
