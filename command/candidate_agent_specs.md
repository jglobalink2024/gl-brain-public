# Candidate Agent Specs — Post-Eric Build Queue
[PERSISTENT — queued, not active]
Last updated: 260420
Author: Strategic AI (Opus 4.7) | updated CC (Sonnet 4.6)
Status: HOLD until Eric invite shipped. Build after first paying customer lands. (Agents 1–2 pre-built.)

---

## Why this queue exists

Pattern recognition across recent work (Symphony v10 → v11 → v12 → v12.1,
CC staging, brain commits) identified 6 recurring task types where no
matching agent existed. Each has been flagged in agent_activity_log.md
≥ 2 times. Building these agents would compress future work cycles and
reduce first-principles reasoning on patterns we now know cold.

Priority order reflects: which agent saves the most time × how often
the task recurs. Priorities below are SUGGESTED; Jason rank-orders.

---

## AGENT 1 — `cc-prompt-architect`

**Status: BUILT 260420**

**Priority**: P0 (highest frequency of recurrence)

**Purpose**: Author structured CC prompts with phases, gates, checks,
commit discipline, and Phase 7-style reports.

**Why it's needed**: We've written 4+ CC prompts in days (staging, F1
fix, v12.1 patch, master). All follow a common structure but require
re-deriving it each time. Agent eliminates re-derivation.

**Input contract**:
- Task description (what CC should do)
- Scope boundaries (what's in, what's out)
- Preconditions (env vars, repo state, required files)
- Effort tier (LOW/MEDIUM/HIGH/XTRA HIGH/MAX with justification if MAX)
- Model target (Sonnet or Opus)
- Success criteria (how we know it worked)

**Output**: Full CC prompt ready to paste, with:
- Phase structure (typically 3–7 phases)
- Gate checks (tsc, eslint, preflight)
- Commit message conventions
- Pause points for human confirmation
- Phase 7 report template
- Explicit DO NOT section
- Effort tier declaration

**Guardrails**:
- Always include Opus-vs-Sonnet declaration
- Always include pause points for destructive or irreversible actions
- Always include commit message format
- Never consolidate Stripe links or touch gl/entities.md (inherit hard rules)

**Expected activation frequency**: 2–4× per week.

---

## AGENT 2 — `brain-committer`

**Status: BUILT 260420**

**Priority**: P0

**Purpose**: Write and commit brain files with correct conventions
(file lifecycle tags, commit messages, public/private discipline).

**Why it's needed**: 10+ brain commits per week with consistent
format requirements. Easy to drift on: lifecycle tags, commit
messages, entity.md leakage prevention.

**Input contract**:
- File path in brain repo
- Content (or content description)
- Lifecycle tag ([ONE-USE] / [EVIDENCE] / [PERSISTENT])
- Commit message category (state / patterns / decisions / killed /
  research / log / review)

**Output**: Commit-ready file with header, tags, and the exact
`cd + git add + git commit + git push` sequence.

**Guardrails**:
- Never writes to gl/entities.md
- Always includes lifecycle tag in file header
- Commit messages always prefixed with `brain:`
- Never edits v[N] symphony files after they're frozen
- Auto-updates state.md last-updated date when state.md is touched

**Expected activation frequency**: Daily during active build weeks.

---

## AGENT 3 — `symphony-persona-architect`

**Status: BUILT 260420**

**Priority**: P1 (recurs every symphony, but symphonies are less frequent)

**Purpose**: Generate persona briefs with behavioral constraints,
abandon triggers, language samples, and role-in-test-doctrine notes.

**Why it's needed**: v12 had 4 personas. v13 will likely add LATAM
operator + enterprise buyer + real-name RAP-flagged ICP targets.
Each brief is ~60 min from scratch; agent compresses to ~15 min with
higher consistency.

**Input contract**:
- Persona name (real or synthetic)
- Role (stakeholder, ICP, non-target, adversarial)
- Tech fluency (low / medium / high)
- Device and tool profile
- Domain background (1–2 paragraphs from Jason)
- Target journey(s) to participate in

**Output**: Full persona brief matching the v12 Personas format:
- Role + demographics
- Mental model pre-session
- Task prompt they'd type (journey-specific)
- Expected observables
- Abandon triggers
- Feedback language samples
- Role in test doctrine

**Guardrails**:
- Must include ≥ 3 abandon triggers
- Must include ≥ 1 persona-unique "catches" (what this persona sees
  that others miss)
- Language samples must sound like real people (not marketing copy)
- Stays consistent with ICP doctrine (Sales/RevOps #1, Ops #2,
  Coaching #3)

**Expected activation frequency**: Every symphony (v13, v14, etc.).

---

## AGENT 4 — `symphony-journey-architect`

**Status: BUILT 260420**

**Priority**: P1

**Purpose**: Generate journey scripts with CLICK-THEN-OBSERVE
assertions, verification methods, and fail-signal specificity.

**Why it's needed**: Same logic as persona architect — journeys are
the backbone of Symphony scope, and building them first-principles
takes hours. Agent compresses.

**Input contract**:
- Journey name + purpose (why this matters)
- Claims exercised (C1–C7)
- Personas × depth matrix (who runs this, at what depth)
- Preconditions
- Known constraints (e.g., two-step dispatch for handoff journeys)

**Output**: Full journey spec matching v12 Journeys format:
- Step-by-step (ACTION / EXPECTED / VERIFICATION / FAIL SIGNAL)
- Per-step assertion count
- Depth-adjusted assertion lists for DEEP / STRUCTURAL / SURFACE
- Total assertion count
- Runtime estimate

**Guardrails**:
- Every assertion must be post-action observation (no DOM-presence-only)
- Forbidden verification methods list included
- Depth differentiation must be meaningful (not cosmetic)
- Assertion count realistic for listed runtime

**Expected activation frequency**: Every symphony.

---

## AGENT 5 — `symphony-scorer` [BUILT — 260420]

**Status**: BUILT 260420 via CC Opus 4.7 (dep-check overridden by operator). Location: `~/.claude/agents/symphony-scorer/SKILL.md`. Self-tested against v12 artifacts — correctly overrides v12's "PASS (shallow)" calls, producing stricter DO NOT SHIP verdict under strict C3 doctrine.

**Priority**: P1

**Purpose**: Synthesize matrix, findings, and verdict from proof files.
Enforces doctrine (C3 = 2× weight, no PARTIAL on C3, shallow ≠ PASS).

**Why it's needed**: Verdict synthesis is where doctrine gets violated
silently (v12 called shallow C3 probes "PASS (shallow)" — doctrine says
that's not allowed). Agent enforces rules mechanically.

**Input contract**:
- Raw proof files (ProofLog, network captures, screenshots)
- Claim map (which claim each cell tested)
- Severity rubric (current doctrine)

**Output**: Three files:
- COMMAND_Matrix_v[N].md (with correct PASS/PARTIAL/FAIL/
  INCONCLUSIVE/BLOCKED distinctions)
- COMMAND_Findings_v[N].md (severity-sorted, with repro paths)
- COMMAND_Delta_v[N-1]_v[N].md (what changed, what held, what's new)

**Guardrails**:
- Enforces C3 doctrine (no shallow passes, INCONCLUSIVE ≠ PARTIAL)
- Enforces 2× weighting on C3 for overall verdict
- Never softens CRITICAL findings to MAJOR without explicit reason
- Catches version-skew errors (e.g., v10 rubric applied to v12 results)

**Expected activation frequency**: Every symphony closeout.

---

## AGENT 6 — `gap-flagger` (meta-agent) [BUILT — 260420]

**Status: BUILT 260420** via CC Sonnet 4.6. Location: `~/.claude/agents/gap-flagger/SKILL.md`. Research: Gemini Pro. Draft: ChatGPT Plus. Structure: Claude Opus 4.7. Install: CC Sonnet 4.6.

**Priority**: P2 (most subtle value, slowest to build, highest leverage
long-term)

**Purpose**: Reads agent_activity_log.md monthly and nominates new
agents to build based on recurring `gap_flagged` entries.

**Why it's needed**: Without this, gap detection depends on Jason
or Strategic AI remembering to look. Meta-agent automates the loop.

**Input contract**:
- 30-day window of agent_activity_log.md entries
- Existing build queue (this file)
- Known retirement candidates

**Output**: Monthly review file
(globalink-brain/command/reviews/agent_review_YYMM.md) with:
- Top 5 load-bearing agents
- Gap candidates (flagged ≥ 3× in window)
- Retirement candidates (0 activations in 60 days)
- Refinement candidates (50/50 shipped/blocked)
- Priority-ranked build recommendations

**Guardrails**:
- Never auto-builds — only recommends
- Never deletes log entries
- Only marks retirement AFTER 60-day zero-activation window
- Cross-references Jason's explicit priorities before ranking

**Expected activation frequency**: Monthly (first of the month).

---

## Build order recommendation

| Phase | Agents | Why this order |
|---|---|---|
| Phase 1 (post-Eric) | cc-prompt-architect, brain-committer | Highest recurrence; compound savings |
| Phase 2 (pre-v13) | symphony-persona-architect, symphony-journey-architect | Compress next Symphony design cycle |
| Phase 3 (v13 closeout) | symphony-scorer | Enforces doctrine at verdict synthesis |
| Phase 4 (ongoing) | gap-flagger | Only useful once activity_log has enough entries |

---

## Build template for each agent

When CC builds these, each agent gets:
- `~/.claude/agents/[agent-name]/SKILL.md`
- Description following existing pattern
- Trigger phrases in description (so Claude auto-scans correctly)
- Input contract validation
- Output schema
- Guardrails list
- Example invocation
- Anti-patterns

Template file (to be created by cc-prompt-architect ironically):
`~/.claude/agents/.template/SKILL.md`

---

## What this file does NOT do

- Does not authorize any builds — that's Jason's call after Eric ships
- Does not create the agents — only specifies them
- Does not modify existing agents in ~/.claude/agents/ or .cursor/rules/
- Does not commit to agent-agents repo (Chief of Staff PR #429 is
  separate and already submitted)
