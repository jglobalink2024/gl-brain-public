# Agent Activity Log
[PERSISTENT]
Canonical location: globalink-brain/command/agent_activity_log.md
Last updated: 260422
Format: YAML frontmatter per entry, reverse-chronological (newest on top)

---

## Purpose

Track every agent/skill activation across all Claude instances (Claude Code,
Claude.ai chat, Claude for Chrome). Enables:
- Monthly analysis of which agents are load-bearing
- Gap detection — tasks that consistently lack matching expertise
- RAP doctrine compliance audit
- Decisions on which new agents to build or retire

---

## Entry format

Every activation is a YAML frontmatter block followed by an optional
free-form note. Newest entry on top.

Required fields:
- `date`: YYMMDD
- `session_type`: one of [build, strategy, gtm, competitive, patent, qa, ops]
- `vehicle`: one of [cc, chat, chrome]
- `task`: one-line description
- `scan_performed`: [yes, no, n/a]
- `activated`: agent/skill name OR `none_fit` OR `n/a`
- `why`: one-sentence justification
- `outcome`: one of [shipped, partial, blocked, abandoned]
- `efficiency_gain`: one of [none, low, medium, high] — subjective
- `gap_flagged`: string if new agent would help, else `none`

Optional fields:
- `duration_min`: integer minutes
- `credit_cost`: USD decimal
- `related_commit`: git hash
- `related_symphony`: version string
- `notes`: free-form follow-up

---

## Entries

---
date: 260422
session_type: build
vehicle: cc + chat
task: Fixed 4 compounding bugs blocking product execution; verified
  product thesis end-to-end
scan_performed: yes
activated: brain-committer (this session)
why: v12.1 QA revealed COMMAND was generating manual-relay briefs
  not auto-executing; 5-hour diagnostic sprint found 4 gaps:
  (1) agents_protocol_check constraint missing api_proxy
  (2) executeTask.ts no pooled key fallback
  (3) stranded working-tree sonar-pro fix never pushed
  (4) PPLX_API_KEY vs PERPLEXITY_API_KEY name mismatch
outcome: shipped
efficiency_gain: critical (unblocks every downstream launch gate)
gap_flagged: 2 new brain patterns lessons on working-tree drift +
  multi-layer staleness
related_commits: 84b1a4b, 0edc12d, 4b54855
notes: |
  Perplexity-1 executed research task, 647 tokens, 5066ms, $0.02
  real burn. Output rendered in-app with Chain button. First time
  product has actually delivered on its thesis.

---
date: 260420
session_type: build
vehicle: multi-model (Gemini + ChatGPT + Claude + CC)
task: Built symphony-persona-architect agent
scan_performed: yes
activated: none existed for persona design
why: Multi-model used for research diversity + voice variation + structural rigor + mechanical install; no single model could do all four well
outcome: shipped
efficiency_gain: high (expected; activation frequency = every symphony)
gap_flagged: none
notes: |
  First multi-model agent build. Research by Gemini Pro Deep
  Research, draft by ChatGPT Plus, structure by Claude Opus 4.7,
  install by CC Sonnet 4.6. Total active time ~30 min across 4
  sessions.

---
date: 260420
session_type: build
vehicle: multi-model (Gemini + ChatGPT + Claude + CC)
task: Built gap-flagger agent (meta-agent for monthly reviews)
scan_performed: yes
activated: brain-committer (for brain write conventions)
why: Meta-agent completes the tracking loop; monthly reviews now automated
outcome: shipped
efficiency_gain: high (compresses 45 min manual review to ~5 min)
gap_flagged: none
notes: |
  Final agent in the 6-agent build queue. Activates monthly on
  day 1 for previous month's review.
---
date: 260420
session_type: build
vehicle: cc
task: Built symphony-scorer agent (doctrine enforcement)
scan_performed: yes
activated: symphony-journey-architect (read log entry for journey-format awareness); brain-committer (planned handoff for commit; fell back to direct git per dep availability)
why: Scorer is the doctrine gatekeeper at verdict synthesis; v12's "PASS (shallow)" calls are the exact failure mode this agent prevents. Getting it wrong means future symphonies pass shallow evidence silently.
outcome: shipped
efficiency_gain: high
gap_flagged: none
related_symphony: v12 (used as self-test reference)
notes: |
  Highest-stakes agent in the bundle. Opus mandatory — doctrine requires
  judgment beyond pattern matching (INCONCLUSIVE vs PARTIAL, severity
  softening detection, matrix/rationale consistency enforcement).
  Validated against v12 artifacts: scorer correctly overrides v12's
  "PASS (shallow)" calls on J2 × P1/P3/P4 and v12's "PARTIAL" on J2 × P2,
  rewriting all four C3 cells to INCONCLUSIVE. With C3 weighted 2× and
  entirely INCONCLUSIVE, arithmetic yields 16/24 = 66.7% pass rate →
  DO NOT SHIP (stricter than v12's actual SHIP WITH FIXES, correctly so
  per the doctrine committed in patterns.md's "Shallow C3 is NOT a PASS"
  section). Dependency check initially failed (no symphony-* agent
  directories present at ~/.claude/agents/); user override proceeded
  using v12 artifacts as primary format anchor and Claims_v12.md + the
  patterns.md doctrine correction sections as the rule source. Three
  verdicts (SHIP / SHIP WITH FIXES / DO NOT SHIP) only — resisted the
  temptation to invent a fourth "CANNOT CERTIFY" verdict; the math
  handles INCONCLUSIVE thesis claims naturally by dropping pass rate
  below 85%. Next activation: when v12.1 or v13 final verdict synthesis
  is requested.
---

---
date: 260420
session_type: build
vehicle: cc
task: Built symphony-journey-architect agent
scan_performed: yes
activated: brain-committer (inherited commit format); cc-prompt-architect (inherited phase structure)
why: Journey spec authoring recurs every symphony; agent compresses ~60 min to ~15 min per journey
outcome: shipped
efficiency_gain: high
gap_flagged: none
notes: |
  Opus-built because journey doctrine requires judgment — Sonnet drifts
  toward shallow verification. Six-method verification rule enforced
  mechanically. Runtime estimator tuned from v12 journey data (DEEP
  ≈ 1 min / 2 assertions; STRUCTURAL ≈ 1 / 3; SURFACE ≈ 1 / 4).
  Dependency check initially failed (cc-prompt-architect dir present
  but empty; brain-committer dir absent) but user override proceeded;
  built using v12 journey specs as primary format anchor plus brain
  spec's own output-contract definition. Next activation: when v13
  planning begins, or earlier if Jason requests a new journey for
  Phase 1.5 / Phase 2 features.
---

---
date: 260420
session_type: build
vehicle: cc
task: Built brain-committer agent
scan_performed: yes
activated: cc-prompt-architect (format reference — read SKILL.md as pattern; did not invoke to write prompt)
why: Creating the agent itself; cc-prompt-architect format was reference only, not invoked as author
outcome: shipped
efficiency_gain: n/a
gap_flagged: none
related_commit: 834b116
notes: |
  Zeroth entry for brain-committer. Expected activation frequency: daily
  during active build weeks. Paired well with cc-prompt-architect for
  commit-message consistency. Dependency check initially failed due to
  Windows ~ path resolution; resolved on retry.
---

---
date: 260420
session_type: build
vehicle: cc
task: Built cc-prompt-architect agent
scan_performed: yes
activated: none_this_is_the_build
why: Creating the agent itself; no existing agent to activate
outcome: shipped
efficiency_gain: n/a
gap_flagged: none
related_commit: 1c19e66
notes: |
  Zeroth entry for cc-prompt-architect. Built to compress CC prompt
  authoring across future sessions. Expected activation frequency:
  2-4x per week.
---

---
date: 260420
session_type: qa
vehicle: chat
task: Symphony v12 persona-journey matrix design
scan_performed: no
activated: none
why: Strategic AI worked from first principles; did not scan agent library
outcome: shipped
efficiency_gain: n/a
gap_flagged: symphony-persona-architect, symphony-journey-architect, symphony-scorer
notes: |
  This chat produced the v12 bundle, v12.1 bundle, and effort-tier doctrine.
  Work was genuinely novel so "no agent fit" is probably correct, but the
  scan wasn't performed. Flagged for retrospective awareness. 6 candidate
  agents queued as separate specs for post-Eric build.
---

---
date: 260420
session_type: build
vehicle: cc
task: Symphony v12 staging — brain placement + harness build
scan_performed: unknown
activated: unknown
why: CC did not declare RAP activation in session report
outcome: shipped
efficiency_gain: unknown
gap_flagged: cc-prompt-architect
notes: |
  Retrospective entry. CC built the entire e2e/symphony_v12/ harness,
  committed both repos, and verified public mirror sync. No RAP declaration
  in the Phase 7 report. Going forward, CC must announce activation or
  explicitly state "scanned, none fit."
---

---
date: 260420
session_type: ops
vehicle: cc
task: Fixed brain public mirror sync workflow (allowlist → blocklist)
scan_performed: yes
activated: none (no deployed agent matches ops/workflow-edit tasks)
why: Sync workflow used explicit cp allowlist that missed all subdirectories
  (command/symphony/**) and new top-level files (command/agent_activity_log.md,
  command/candidate_agent_specs.md). Public mirror was stuck at 5 command/
  files from run #59. Blocked agent-5 Claude and all multi-instance workflows
  from reading current brain state via public URLs.
outcome: shipped
efficiency_gain: high (unblocks every future Claude instance from stale reads)
gap_flagged: none
related_commit: b0f5746
notes: |
  Replaced allowlist cp-by-file approach with blocklist rsync approach.
  command/ now syncs recursively (subdirectories and future files included
  automatically). gl/ syncs recursively with --exclude='entities.md'.
  Pre-verified exclude pattern safety: only one file named entities.md
  exists in the tree (gl/entities.md), so basename match is both sufficient
  and unambiguous. Post-deploy verification: all 5 target URLs returned
  200 (agent_activity_log, candidate_agent_specs, symphony/v12/Personas,
  Journeys, Claims); safety check on gl/entities.md returned 404.
  Placeholder project copies (ponte, traverse, phase-line) and POINTER
  file copies retained as-is — out of scope for this fix.
---

---

## Monthly review protocol

First day of each month, Strategic AI (or designated reviewer) runs:
1. Count entries in last 30 days
2. Tally activation counts per agent — top 5 are load-bearing
3. Tally `gap_flagged` mentions — repeat flags become build candidates
4. Tally `scan_performed: no` — compliance score for RAP doctrine
5. Write review summary to: globalink-brain/command/reviews/agent_review_YYMM.md

Review output format:
```markdown
# Agent usage review — YYMM
## Load-bearing (top 5)
- [agent-name]: N activations across M session types
## Consistent gaps (≥3 mentions)
- [proposed-agent]: flagged in [tasks]
## RAP compliance
- X% of entries had scan_performed = yes
## Recommendations
- Build: [list]
- Retire: [list — activations = 0 in 60 days]
- Refine: [list — activated but outcome = blocked/abandoned]
```

---

## Anti-patterns (do not do)

- ❌ Skipping the scan and writing `scan_performed: yes` (dishonest log)
- ❌ Writing entries in bulk at end of day (lossy — write live)
- ❌ Activating an agent without logging it (breaks tracking)
- ❌ Flagging "gap" for every novel task — only flag if task recurs ≥ 2×
- ❌ Using fields outside the defined schema (breaks parseability)

---

## Seed entries above are reference templates only.
## Real entries begin with the next activation.
