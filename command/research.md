# COMMAND — Research Register
Last updated: 260504

---
## globalink-brain Dual-Name Reconciliation — Findings (260504)
[EVIDENCE]
Last updated: 260504
Author: CC
Session: [GL/BRAIN | OPS | globalink-brain dual-name reconciliation · escalation | 260504]

**Root Cause:**
The `globalink-brain` GitHub repo (remote: jglobalink2024/globalink-brain.git) and the `gl-brain`
repo (remote: jglobalink2024/gl-brain.git) are two separate GitHub repos that diverged from a
common ancestor (commit a4181cd) around 260422. They were never the same renamed repo — they are
parallel repos that both received commits for ~12 days.

**How the divergence happened:**
At some point during the 260422 session, a new repo `gl-brain` was created and started receiving
commits (including all Hardening #2, #3, #4 content and the full session log stack). Meanwhile
brain-committer still had the OneDrive `globalink-brain` path cached and routed two sessions'
writes there today (P1-4 MCP migrations, Documenso NDA fields) instead of to gl-brain.

**What was done:**
1. gl-brain feat/globalink-brain-migration branch: merged globalink-brain content in (commit 9f02044)
2. Appended missing globalink-brain content to 4 conflicted files (decisions, killed, research, state)
   using union strategy — commit 5e4d6c7 on gl-brain main
3. All globalink-brain references updated to gl-brain across:
   - ~/.claude/hooks/PreToolUse.sh (2 patterns)
   - ~/.claude/hooks/PostToolUse.sh (1 pattern)
   - ~/.claude/CLAUDE.md Rule 12 section
   - gap-flagger/SKILL.md (4 occurrences) — both ~/.claude/agents/ and globalink-claude-config
   - symphony-journey-architect/SKILL.md (3 occurrences) — both copies
   - symphony-scorer/SKILL.md (15 occurrences) — both copies
   - globalink-claude-config committed + pushed: cbe49cb

**Disposition of globalink-brain repo:**
KEPT as-is (not deleted, not archived). Contains older content and the two today-sessions that
were accidentally written there. All unique content has been merged into gl-brain main.
Jason to archive on GitHub when convenient — no active writes should go there going forward.

**Canonical brain:** `C:\dev\gl-brain` / github.com/jglobalink2024/gl-brain.git

---

## PP Market Intelligence (260413)
Source: Perplexity Research Mode, 50 sources

Key facts:
- Business AI adoption crossed 50% for first time March 2026
- Boutique consulting firms run 4–7 AI subscriptions, $80-200/mo
- $0 currently allocated to coordination/memory layer
- #1 ICP pain: context loss switching AI tools
  "45 minutes a day as a human USB cable"
- Sandra's confirmed stack: ChatGPT ($20) + Claude ($20) +
  Perplexity ($20) + Fathom ($0-18) + Notion ($10-20) = $70-98/mo
- Only 9% of consumers pay for more than one AI subscription
  Sandra running 3 simultaneously = early adopter

Competitive gap confirmed:
No tool provides BYOA cross-vendor coordination for
non-technical boutique consultants. Gap is vacant.

260504 — gl-brain relocated to C:\dev\gl-brain. OneDrive sync risk eliminated.

## Gemini Viability Assessment (260413)
Source: Gemini Deep Research

Key findings:
- SMB ARR ceiling: $5M ARR requires 4,100 firms at $1,200 ACV
- Feature-death risk if product stays as UI wrapper only
- Microsoft A2A ships May 2026 — likely Microsoft-ecosystem-wrapped
- OpenClaw v4.0 mid-2026 — watch for no-code onboarding path
- Cofia (YC W26) — closest conceptual YC competitor
- Patent claims need narrowing before filing

ROI Tracker finding:
15-min baseline inflated. Confirmed critical by audit.
Adaptive baseline implemented in Fix 2.

---
## Brain-Commit Pipeline Test — 260420
[ONE-USE]
Last updated: 260420
Author: CC

Brain-commit pipeline test entry. Verifies brain-committer append + stage + commit + push sequence.
---

## 260427 — Superhuman Go Competitive Intel
- Superhuman Go = Grammarly full rebrand (Oct 29 2025, ~$825M acquisition of Superhuman Mail)
- Stack: Grammarly writing + Superhuman Mail + Coda docs + Go AI assistant
- Walled garden — ecosystem-locked, migration required, enterprise/high-volume email target
- NOT in boutique segment (1-15 person shops) — that is COMMAND's beachhead
- COMMAND differentiator: BYOA vendor-neutral, zero migration, works on existing stack
- Ad messaging (SXSW 2026): "AI is just a blinking cursor without you" / "All you" — human-first empowerment frame
- Watch: 12-18 month window before they work down-market toward boutique firms
- Monitor: Coda integration depth (async multi-agent coordination is their next frontier)
- Anthropic Coordinator Mode (~May 2026 GA) compounds same window pressure

---
## --- Research from globalink-brain (pre-merge, 260412–260427) ---

## Competitive Threat: Anthropic Coordinator Mode (260427)
Status: Approaching GA ~May 2026
Implication: Makes April/FM cohort close timing non-negotiable.
  If Coordinator ships before COMMAND has paying customers,
  the "why not just use Claude natively" objection gets sharper.
Moat: COMMAND is cross-vendor. Coordinator is Anthropic-only.
  BYOA boundary holds — Coordinator is one of our engines,
  not our cockpit.

## Competitive Intel: Microsoft + IBM (260427)
Microsoft A2A: LIVE (shipped, not just announced)
  — Microsoft-ecosystem-wrapped, not cross-vendor
IBM: "Front door to the super agent" framing
  — available to appropriate as validation language
  — "even IBM is saying agents need a front door"

## Gartner Multi-Agent Data (260427)
1,445% surge in multi-agent inquiries (Gartner)
40%+ of agentic AI projects projected canceled by 2027
  due to lack of observability
Implication: COMMAND's observability layer is the moat.
  "40% of your competitors' AI projects will fail.
  COMMAND is why yours won't."

## Academic Validation: Provenance Paradox (260413)
Paper: arXiv:2603.18043
Finding: Validates COMMAND's cross-vendor coordination approach
  academically. Can cite in patent applications and investor
  materials as independent validation.

## IP Register v4 (260412)
Novel claims — triple-validated (Claude + PP + Gemini):
  Tier 1: Metabolic Clock 95%
  Tier 1: Learned Agent Cards 95%
  Tier 1: Contradiction Radar 90%
  Tier 2: FRAGO Protocol 5-step 85%

Dead patent claims:
  Provenance edge types → IETF ACTA identical names
  Agent economy → CPMM anticipated (arXiv:2603.16899)
  Quorum Sensing/MHC → 5x prior art match

Active renamed claims:
  WPL (Workspace Provenance Ledger)
  CASE (Cross-Agent Synthesis Engine)
  WDC (Workspace Dream Cycle)

Prior art landscape:
  IETF ACTA — identical edge type names
  CPMM — cost-per-quality-unit anticipated
  ACNBP — cross-vendor attestation
  Provenance Paradox (arXiv:2603.18043) — validates us

## Competitive Moat Confirmation (260412)
Cross-vendor boundary: triple kill test confirmed zero
  direct competitors for BYOA cross-vendor coordination.
Every threat operates within single frameworks.
Crown jewel patents: Metabolic Clock, Learned Agent Cards,
  Contradiction Radar.
Closest threats:
  Mindra — beta, unconfirmed cross-vendor
  Wayfound — supervision not routing
  Trace (YC S25) — context-driven not performance-driven

## Organic Search / Perplexity Play (260413)
Reddit/LinkedIn/YouTube are most-cited domains in
  AI-generated search answers (Perplexity, ChatGPT Search).
Consistent posting on these platforms trains tools to
  recommend COMMAND organically.
Strategy: 2-3x/week LinkedIn + occasional Reddit r/AItools.
  Focus on BYOA framing and fratricide pain story.
