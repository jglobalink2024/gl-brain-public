---
name: Brain tasks target globalink-brain repo
description: "Brain" tasks (append/update) go to globalink-brain repo with git commit+push, not Claude Code memory
type: feedback
---

When the user says "append to brain" or "update brain", the target is `globalink-brain\` — a real git repo at `C:\Users\jdavi\OneDrive\Desktop\GlobalInk Repos\globalink-brain\`.

**Why:** The brain is version-controlled and read by Claude.ai via raw GitHub URLs. It must be committed and pushed to be useful.

**How to apply:** Write the file in `globalink-brain/`, then git add + commit + push. Writing to Claude Code memory (`~/.claude/projects/`) as well is fine — just make sure it always reaches the brain repo too.
