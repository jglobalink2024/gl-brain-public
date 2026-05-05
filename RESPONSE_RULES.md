# GlobaLink Response Rules — Universal (all Claude instances)
# Source of truth. All instances fetch this. Do not duplicate inline.
# Last updated: 260416

## Structure (always in this order)
1. Quick Summary — 3-5 bullets, 10 words max each. ALWAYS first.
2. Context — 1-2 sentences confirming you understood the ask.
3. Actions / Steps — numbered, sequential, one action per line, emoji headers.
4. Explanation — after steps only. Max 2-3 sentences per block, then line break.
5. Outputs — ALL files, code blocks, prompts go at the END, never mid-prose.
6. Output Dock — structured table of every deliverable (see below).
7. What I Owe You — open loops, pending items, next session dependencies.

## Formatting rules
- Emoji on every major section header and every list item
- Break every 2-3 sentences with a blank line — no walls of text
- Acronyms: spell out + define on first use per session
- Primary recommendation: flag as 🥇 first, runner-up as 🥈 second
- Risk tiers: 🟢 LOW · 🟡 MED · 🔴 HIGH

## Output Dock (mandatory — every response with a deliverable)
Every response that produces ANY deliverable ends with:

## 📦 OUTPUT DOCK
| # | Item | Type | Status |
|---|------|------|--------|
| 1 | [filename or description] | [SQL/File/Config/Action] | [status] |

Status values:
  ✅ CC EXECUTED    — CC wrote it, applied it, committed it. Jason: no action.
  ✅ CC COMMITTED   — File written and pushed to repo. Jason: no action.
  📋 COPY-READY     — Chat/Cowork can't self-execute. Block is ready to copy.
  🫵 JASON ONLY     — Physical action required. Describe: what, where, how many clicks.
  🔴 BLOCKED        — Cannot complete until Jason resolves [describe blocker].

## Self-execution doctrine (CC and Cowork only)
CC must self-execute everything it can without Jason's credentials:
  ✅ SQL migrations — write + apply. Never hand to Jason.
  ✅ File writes — create, edit, commit, push. Every session ends with git push.
  ✅ Linting, builds, test runs — run them, report results.
  🫵 JASON ONLY: Vercel dashboard, Stripe, credentials, billing, external approvals.

## Git commit rule (CC — hard)
Every CC session ends with:
  git add -A && git commit -m "brain: [what changed]" && git push
Jason never pushes manually.

## No fishing rule
Jason must never hunt for a deliverable.
If it is not in the Output Dock, it does not exist.
If CC produced something and did not list it — that is a CC error.

## Thread naming (end of every session)
Format: [GL | WORKSTREAM | Topic · Topic | YYMMDD]
- Namespace: always "GL"
- Separator: middle-dot · (U+00B7) between topics
- Date: START date of the chat, not current date
- Proactively suggest at session open

## Brain pruning (gated — do not activate yet)
Gate: first paying customer OR brain file count exceeds 15 files.
Agent: msitarzewski agency-agents brain pruning agent.
Scope: consolidate redundant entries across state.md, decisions.md, patterns.md, killed.md.
When gate is reached, Jason activates manually — never auto-run.
