# GlobaLink Operating Principles
Last updated: 260504

## Hard Rules (never violate)
- Entity name: GlobaLink — never "GlobalInk"
- Hard wall: GL/PL/Traverse/Ponte never commingle
- n8n: GL internal infrastructure only, never customer-facing
- workspace_id on every Supabase query — no exceptions
- "pilot" not "trial" everywhere in product copy
- Never mention price until user feels the product
- Agent codenames (COMMAND-0, FORGE-1, etc.): NEVER USE
- Downloads: C:\Users\jdavi\Downloads\ — never Desktop
- FM and Standard Pro Stripe links: never consolidate
- Rule 12 — Brain writes route through brain-committer agent.
  Direct writes to globalink-brain/command/ or gl/ are violations.
  See gl/decisions.md 260428 entry for per-file mode defaults.
- Rule 13 — Complete Delegation Contract (v1.4). See ## RULE 13 section below.

## Build Doctrine
- Phase/date rule: frame by phase+function, never calendar
- Opus: novel reasoning only. Sonnet: all execution.
- Extended thinking: Opus only, never Sonnet
- CC for multi-file builds. Cursor for surgical edits.
- Every CC prompt ends with git commit + push
- Remember rule: "remember X" → appended to next CC prompt

## Voice Profile — Jason

**Opener:** "Name —" with hard line break after.

**Structure:** Short blocks. Sentences break mid-thought for rhythm.

**Verbs:** Casual over corporate.
- "hit you back up" not "circle back"
- "grateful for the intro" not "appreciate your consideration"

**Frame:** Peer, not vendor. Skip setup the prospect already knows.
- Not "Sent the one-pager a bit ago — curious if anything stuck"
- Use "Curious your thoughts on the one-pager"

**Warmth:** Possessives over articles.
- "our call" not "the call"

**Rhythm:** Repetition is intentional. Don't edit out deliberate echoes ("curious your thoughts... curious if anything stuck").

**Sign-off:**
- **JCMD** — when Jason personally types and sends
- **JD** — all automated outreach (Waalaxy, Brevo, templates)

## Rule 14 — Web Fetch Cache Assumption (new 260503)

For any agent reading remote content via web_fetch or equivalent (GitHub raw URLs, API JSON, etc.):

1. Treat content as cache-suspect for ≥30 min past last known write
2. Use local filesystem reads as ground truth when available
3. Document cache age in any drift-check output
4. For critical freshness gates, compute hashes/signatures locally rather than comparing remote fetches

**Why:** claude.ai web_fetch holds responses in internal cache independently of CDN. Cache-bust query params are rejected. This creates a hard ceiling on Chat-side freshness detection. CC-side local reads are the only reliable path to current content.

**When to apply:** Any Session-Start or periodic-check logic that reads shared state across variants. Applies to all agents and all projects.

**Banned phrases:**
- "in the trenches"
- "pain points"
- "value prop"
- "seamlessly"
- "empower"
- "let's get started"
- "circle back" *(added 260420)*

## ICP Priority
1. Sales/RevOps consulting (1–15 people, owner-led)
2. Operations consulting
3. Executive coaching

## CALIBER Mismatch Stop Protocol (260503)

Format every turn:
  CALIBER: [X]/18 → [Recommended] (running: [Actual])

If recommended ≠ actual: STOP before generating. State swap
direction. Wait for operator to switch model in UI and re-send.
Do not generate the answer on the wrong model tier.

Exceptions (flag but proceed):
- Mid-thread intentional model persistence
- Single-line factual answers (trivial cost delta)
- Sequenced tool-call escalation within one turn

Claude cannot self-swap models. Model selection occurs at the
API request layer before generation begins. No tool exists to
change the running model mid-conversation. CC contracts specify
MODEL: at the top because each contract is a new API request —
that is the only self-selection mechanism available in the stack.

Running model is identified from system prompt, not from memory.
Never state a model name without verifying against system context.

## RULE 13 — COMPLETE DELEGATION CONTRACT (v1.4 — amended 260504)

Doctrine: Every cross-variant delegation prompt must specify five parameters
in addition to the task itself. Missing any one = incomplete delegation.
Executor variant MUST STOP and request before proceeding.

FIVE REQUIRED PARAMETERS:
1. VARIANT     — explicit destination (CC / CCO / CfC / Chat / Excel / PowerPoint)
2. CALIBER     — model tier with 6-factor score breakdown
3. EFFORT      — think / think hard / ultrathink
4. REVERSIBILITY — IRREVERSIBLE / PARTIALLY-IRREVERSIBLE / REVERSIBLE / DRAFT
5. QUALITY BAR — PRODUCTION / IPCTD / DRAFT / EXPERIMENTAL

ROUTING DECISION LOGIC:
- Strategy / writing / synthesis / explanation       → Chat
- Repo work / terminal / multi-file code edits       → CC
- Drive ops / parallel scans / unattended desktop    → CCO
- Web automation / multi-tab / claude.ai UI ops      → CfC
- In-situ spreadsheet work                           → Excel
- In-situ deck work                                  → PowerPoint

TIEBREAKERS:
- Needs terminal access?                     → CC
- Drive-native operation?                    → CCO (CC cannot write to Drive)
- Hands-off while operator works elsewhere?  → CCO not Chat
- Browser-based UI manipulation?             → CfC

REQUIRED PROMPT HEADER (verbatim):
═══════════════════════════════════════════════════════════════
DELEGATION CONTRACT (Rule 13)
═══════════════════════════════════════════════════════════════
VARIANT: [CC / CCO / CfC / Chat / Excel / PowerPoint]
CALIBER: [score]/18 → [Model]
  Complexity [1-3] — [reason]
  Context [1-3] — [reason]
  Output [1-3] — [reason]
  Iterations [1-3] — [reason]
  Cost [1-3] — [reason]
  Time [1-3] — [reason]
EFFORT: [think / think hard / ultrathink]
REVERSIBILITY: [IRREVERSIBLE / PARTIALLY-IRREVERSIBLE / REVERSIBLE / DRAFT]
QUALITY BAR: [PRODUCTION / IPCTD / DRAFT / EXPERIMENTAL]
═══════════════════════════════════════════════════════════════

BRAIN-COMMITTER VERSION PIN:
Self-report version on every invocation. Compare against CLAUDE.md pin.
Mismatch = warn but do not block.

VARIANT SCOPE: All six variants. No exemptions. CfC fully in scope from v1.4.

## RULE 17 — VARIANT SHORTHAND REFERENCE (v1.4 — structural)

| Code       | Full Name               | Surface               | Strengths                                                        |
|------------|-------------------------|-----------------------|------------------------------------------------------------------|
| CC         | Claude Code             | CLI / IDE plugins     | Repo work, terminal, multi-file edits, git ops, codebase scans   |
| CCO        | Cowork                  | Desktop autonomous    | Drive-native writes, parallel investigation, unattended desktop  |
| CfC        | Claude in Chrome        | Browser extension     | Web automation, multi-tab workflows, claude.ai UI manipulation   |
| Chat       | Claude Chat             | web/mobile/desktop    | Strategy, content, MCP-connected work, conversational synthesis  |
| Excel      | Claude for Excel        | Office add-in         | In-situ spreadsheet work                                         |
| PowerPoint | Claude for PowerPoint   | Office add-in         | In-situ deck work                                                |

Use codes verbatim in DELEGATION CONTRACT headers (Rule 13).
Locked reference — do not abbreviate or invent new codes.
