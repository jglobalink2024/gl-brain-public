# Brain Connectivity — All Claude Instances → globalink-brain
# GlobaLink | globalink-brain/gl/brain-connectivity.md
# Locked: 260416 | [PERSISTENT]

## Problem
4 Claude instances (Code, Chat, Cowork/Projects, Chrome) need to read from
globalink-brain without Jason pasting files manually each session.

---

## Architecture (One-Time Setup)

### Layer 1 — Claude Code (already works)
Local path: `C:\Users\jdavi\OneDrive\Desktop\GlobalInk Repos\globalink-brain\`
Claude Code reads MEMORY.md + any brain file directly via Read tool.
**Action required: none.** Already functional.

### Layer 2 — Claude Chat (Projects / Cowork)
Use the GitHub MCP referenced in brain-sync-protocol.md.

**Setup steps:**
1. In Claude.ai Project settings → Instructions, add this block:

   > At session start, fetch MEMORY.md from the globalink-brain GitHub repo
   > using the GitHub MCP read tool. Then fetch any files linked in MEMORY.md
   > that are relevant to this session's task category. Do not ask Jason to paste anything.

2. Confirm GitHub MCP (`github-brain` server) is connected to the Project.
   If not: Settings → Integrations → Add MCP → paste server config from
   `globalink-brain/gl/brain-sync-protocol.md`.

3. Session type → auto-fetch map (add to Project Instructions):

| Session type keyword | Auto-fetch files                                          |
|----------------------|-----------------------------------------------------------|
| GTM / sales          | gtm_icp.md, gtm_discovery_calls.md, sales_pipeline.md    |
| Build / COMMAND      | project_command_build.md, sop_operations.md               |
| Legal / IP           | ip_patent.md, reference_key_documents.md                  |
| Brand                | brand_identity.md                                         |
| Default              | MEMORY.md only                                            |

### Layer 3 — Claude Chrome
Claude Chrome navigates GitHub and reads raw content via get_page_text.

**Runtime instruction (start of any Chrome session that needs brain context):**
> "Read MEMORY.md from the globalink-brain GitHub repo."
Chrome navigates, reads, proceeds. No paste required.

### Layer 4 — Cursor
Cursor reads local files. Add brain repo as a workspace root:
Path: `C:\Users\jdavi\OneDrive\Desktop\GlobalInk Repos\globalink-brain\`
Reference files in prompts with `@brain/filename.md`.

### Layer 5 — Public Mirror (Fallback)
If GitHub MCP is unavailable:
- Fallback: Jason pastes MEMORY.md index only (~40 lines) — not individual files.
- This is the one-paste fallback, not the standard path.

---

## Maintenance Rule
After every brain write: `git push` to main.
All instances pull from main. No branches in the brain repo.
