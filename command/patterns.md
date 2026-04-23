# COMMAND — Build Patterns
Last updated: 260422

## Concurrent CC Sessions
Safe when file surfaces confirmed non-overlapping.
Check before every batch:
- lib/pipeline/ files: shared — one session at a time
- components/tasks/: shared — one session at a time
- components/dashboard/: safe from components/canvas/
- app/api/ routes: safe to split by route prefix
- supabase/migrations/: each session gets unique timestamp

## Migration Timestamp Ordering
Use seconds apart to control apply order:
  Phase 2.2 → 20260413120000
  Phase 2.3 → 20260413120001
Never use same timestamp. Never rely on alphabetical.

## Session Eating
When multiple CC instances work same repo simultaneously,
one may commit the other's staged files. Not a bug.
Detection: check git log after any session.
Impact: usually harmless. Prevention: not worth attempting.

## executeTask System Prompt Order (LOCKED)
1. Workspace DNA (## Firm Operating Context)
2. Agent system prompt
3. Skills constraints (if applied)
4. Prior session context (if includedCheckpointId)
5. Context brief (truncates first if over budget)
DNA is never truncated. Context brief truncates first.

## Supabase FK Cascade Rule
Always add ON DELETE CASCADE to workspace_id FKs.
Omitting causes test user accumulation in teardown.

## Skills Empty Allowlist Rule
Empty allowedTools = passthrough, not total block.
Advisory by default until operator configures skills.

## API Key Security Pattern
API keys must go through server-side API routes.
Never write directly to Supabase from client browser.
Never log api_key. Never return in responses.

## Vendor Fetch Timeout
All vendor API calls must have 30-second AbortController timeout.
Hung API hangs entire execution without timeout.

## Stripe Env Var Naming (LOCKED 260413, UPDATED v9.5)
One canonical name per price ID. No fallback aliases.
All follow STRIPE_{TIER}_PRICE_ID convention:
STRIPE_FM_PRICE_ID | STRIPE_PRO_PRICE_ID |
STRIPE_SOLO_PRICE_ID | STRIPE_STUDIO_PRICE_ID |
STRIPE_AGENCY_PRICE_ID
Never add || fallback aliases — they cause silent failures.
Old names STRIPE_PRICE_STUDIO / STRIPE_PRICE_AGENCY retired in 8635e83.

## Fail-Safe Not Fail-Open (Stripe)
Unknown price ID → default to 'free' not 'pro'.
Billing errors should deny access, not grant it.

## Rate Limiter Pattern (Serverless)
In-memory rate limiters reset on cold start.
Use Supabase audit_ledger count query for rate limiting
in serverless environments. Counts events in time window.
Replace with Upstash Redis before horizontal scale.

## system_prompt Redaction Pattern
Never store full system_prompt in task_executions.
Store: system_prompt_hash (SHA-256) + system_prompt_length.
Workspace DNA and agent instructions are sensitive.

## Agent Fuzzy Matching (Canvas)
4-tier matching for canvas step agent assignment:
1. Exact display_name match
2. Case-insensitive includes
3. agent_type match
4. null (show warning, do not silently fail)
Never silently leave a step unassigned.

## Self-Learning Agent Pattern
Agent definitions live in .claude/agents/ inside the repo (not global ~/.claude/agents).
This makes them version-controlled, product-specific, and auto-loadable.
Bootstrap pattern: agent reads a JSON baseline on first run, populates it from live data,
  uses it for drift detection on every subsequent run.
Self-patch pattern: agent opens GitHub PRs to propose changes to its own definition.
  Never auto-applies changes to itself without human review.

## Ops Run Log Pattern
Diagnostic agents write structured run logs to docs/ops/YYYY-MM-DD-HH-MM.md.
Each log has YAML frontmatter with key metrics for machine-readable trend extraction.
Committed to git automatically after each run — creates a durable history.
Cleanup rule: prune logs >30 days, keep weekly anchors + RED-health runs + permanent records.
Scheduled: daily at 7:01 AM via Claude Code scheduled tasks.

## Canary Probe Pattern
Don't rely on Vercel "READY" status alone — make real HTTP requests to production.
Three probes: health endpoint (200 + latency), auth rejection (expects 401 not 200),
  primary feature route (500 = crisis). Live proof the app is serving, not just deployed.

## Codebase Drift Detection Pattern
Read filesystem (app/api/) at runtime and compare against a stored baseline.
New routes not in baseline = uncovered monitoring gap → queue for self-patch.
Removed routes still in baseline = dead checks → flag and remove.
Always compare local vs production commit SHA — catches silent deploy failures.

## Chat/Thread Naming Convention (LOCKED 260413, UPDATED 260416)
Name every Claude.ai chat based on the ENTIRETY of the
conversation — not just the opening topic.

CANONICAL FORMAT: [GL | WORKSTREAM | Topic · Topic | YYMMDD]

HARD RULES:
1. Leading namespace is always "GL" — never "COMMAND" or any project name
2. Separator between topics is middle-dot "·" (U+00B7) — never "-" or ","
3. Date = START date of the chat (when it was created/opened — NOT last activity)
   If uncertain about start date, Claude asks Jason before naming
4. Brackets [ ] are required
5. Pipe with spaces " | " separates all sections

VALID EXAMPLES:
✅ [GL | QA | F01-F02 OAuth Fix · Dependabot #8 | 260416]
✅ [GL | OPS | File Lifecycle Policy · Cleanup Agent · Chat Naming Fix | 260416]

INVALID EXAMPLES:
❌ COMMAND | QA | F01-F02 OAuth Fix + Dependabot #8 | 260416  (missing brackets, wrong namespace, wrong separator)
❌ [GL | QA | F01-F02 | 260417]  (wrong date if chat opened 260416)
❌ [GL | COMMAND | Phase 2 Sprint · Audit · Brain Init · 260413]  (wrong namespace)

Never name a chat based only on the opening question.
Never use the current date if the chat started on a different day — always use start date.
Review the full conversation before naming.
Always suggest a thread name when the session is closing out.

## Pending Actions Tracking (LOCKED 260416)
Never bury manual Jason-action deliverables in prose. Always write to
PENDING_ACTIONS.md in the target repo root.

Row format: `- [ ] TYPE | WHERE | WHAT | YYMMDD | SESSION`
Types: SQL | VERCEL | GITHUB | GCP | VERIFY | STRIPE | HUBSPOT | OTHER

CC reads at session open (surface relevant open items), writes at session close
(any new manual actions). Jason checks off. Never delete rows.

## Brain Multi-Variant Sync (LOCKED 260416)
All Claude variants (Code, chat, Cursor) read from and write to the same private
brain repo. No variant is a second-class citizen.

READ priority: GitHub MCP → local filesystem → public mirror fallback
WRITE priority: GitHub MCP (chat) | local git (CC/Cursor) | output block (fallback)

Commit format all variants: `brain: [description] [via: CC | chat | cursor]`
Full protocol: globalink-brain/gl/brain-sync-protocol.md
Setup required: GitHub PAT (contents:write on brain repo) + GitHub MCP in Claude.ai

## File Lifecycle Policy (LOCKED 260416)
Every file Claude creates must be tagged at creation:
[ONE-USE] — delete after 7 days or after the commit that ran it
[EVIDENCE] — keep 90 days, then archive (tests/personas/, docs/ops/)
[PERSISTENT] — keep forever (brain files only)

SESSION_CLOSEOUT_*.md: [ONE-USE], expires 3 days
CC_*.md in repo root: [ONE-USE], expires 7 days post-commit
docs/ops/*.md: [EVIDENCE], archive after 30 days (keep RED-health runs forever)
tests/personas/*: [EVIDENCE], archive after 90 days
globalink-brain/**: [PERSISTENT]

Cleanup enforced by ops-watchdog Step 6 (daily after health checks).
Full policy: globalink-brain/command/file-lifecycle.md

## Testing doctrine — journey-matrix over item-checklist (v12 onward)

**Why the shift**:
v11 scored 56/64 PASS at the item level but missed that the crown-jewel
claim (context handoff) had never been tested end-to-end with real
payload inspection. The item-based approach optimizes for "does the
button exist" when what we actually need is "does the button do what
we claim when a real user clicks it." BILL-02 (phantom Studio tier)
was caught in v11 only because it happened to fall inside an item
check — a journey-based approach would have caught it on persona P2's
first conversion attempt.

**The new doctrine**:

1. Tests are organized by PERSONA × JOURNEY × CLAIM, not by feature or
   page.
2. Every assertion is a POST-ACTION observation. Code reading is not
   evidence. DOM presence is not evidence. Endpoint 200 is not evidence.
3. Four legitimate verification methods:
   - Screenshot comparison (pre-action vs post-action)
   - Network payload inspection (request AND response body)
   - DOM state at t+Ns post-action
   - Backend query or credit-balance delta
4. Personas have BEHAVIORAL CONSTRAINTS (what they'd do, what would
   make them abandon). Orchestrator must honor these — if Marcus
   would never open DevTools, the orchestrator running as Marcus
   cannot use DevTools.
5. Abandon signals are first-class outcomes. A product that ships
   with a P1 abandon signal is broken for Iris, even if every assertion
   passes.

**What this doctrine does NOT replace**:
- CC (Claude Code) multi-file build sessions still use item-level
  verification (TypeScript exit 0, preflight PASS, ESLint 0)
- Unit tests stay item-level
- Migration audits stay item-level
- Security reviews stay item-level

**What it replaces**:
- Any pre-beta QA pass
- Any conversion-path audit
- Any customer-facing claim validation

**Scoring rubric**:
- ≥95% PASS → SHIP
- 85–94% with 0 CRITICAL on C3/C4/C6 → SHIP WITH FIXES
- <85% OR any CRITICAL on C3/C4/C6 → DO NOT SHIP

C3 (handoff) is weighted 2x. Context handoff failure is product-thesis
failure — no other score can compensate.

---

## File locations

Canonical artifacts for v12:
- globalink-brain/command/symphony/v12/COMMAND_Personas_v12.md
- globalink-brain/command/symphony/v12/COMMAND_Journeys_v12.md
- globalink-brain/command/symphony/v12/COMMAND_Claims_v12.md
- globalink-brain/command/symphony/v12/COMMAND_Symphony_v12_Prompt.md

Future symphonies (v13+) inherit this structure. Personas and
journeys evolve as the product grows; claims evolve as marketing
evolves. The doctrine — click-then-observe — does not evolve.

---

## Persona roster (v12 baseline)

- P1 Iris: Non-technical stakeholder, low fluency, Jason's wife
- P2 Eric: Actual P1 beta target, medium-high fluency, real customer
- P3 Danielle: Primary ICP (RevOps at boutique consulting), medium-high
- P4 Marcus: Tertiary ICP (solo coach), low-medium fluency, warm outbound

Additions for later symphonies (suggest, do not add without Jason's green-light):
- P5 Danny Suk Brown: RAP-flagged real outbound target
- P6 LATAM operator (post-May 1)
- P7 Enterprise buyer (Phase 3, not MVP)

---

## Journey roster (v12 baseline)

- J1 First dispatch (happy path, zero-key)
- J2 Multi-agent handoff with context transfer (crown jewel)
- J3 Failure recovery
- J4 Returning user / state persistence
- J5 Pilot → paid conversion

Journeys NOT YET IN DOCTRINE (candidates for v13+):
- J6 BYOK configuration flow (standalone, currently folded into J3)
- J7 Team/workspace invitation flow (if multi-seat ships)
- J8 MCP server registration (currently API-only, tested in J2.7)

---

## Anti-patterns (explicit DO NOTs)

- ❌ Do not run v12 against synthetic personas when real outbound
   targets exist — stay grounded in real buyer profiles
- ❌ Do not run v12 without real credit burn — "simulated" tests are
   not v12 tests
- ❌ Do not skip the persona entry/exit protocol — that's the
   behavioral enforcement layer
- ❌ Do not weight C3 equally with other claims — it's product-thesis
- ❌ Do not let a "mostly passed" verdict become a ship decision —
   the rubric is categorical for a reason
- ❌ Do not re-run a full symphony to verify a single fix — use
   a surgical v12.1 patch covering only the failed cells

---

## Commit convention

When committing symphony artifacts:
```
brain: symphony v[N] [complete|in-progress|verdict]
```

When committing doctrine updates to patterns.md:
```
brain: patterns — [short description of doctrine change]
```

---

## Agent/Skill activation tracking (v12.1 forward)

**Goal**: Know which agents are load-bearing, which tasks lack matching
expertise, and whether RAP (Recon-Activate-Protocol) is actually being
followed.

**Canonical log**: `globalink-brain/command/agent_activity_log.md`

**Write discipline**:
Every Claude instance (CC, Claude.ai chat, Claude for Chrome) writes
one YAML frontmatter entry per non-trivial task that involved (or
should have involved) an agent/skill scan.

**What counts as non-trivial** (triggers RAP + log entry):
- Multi-file builds
- Strategic writing (pitches, personas, journeys)
- QA runs or Symphonies
- GTM content (outreach, one-pagers, email drafts)
- Patent/competitive/research work
- Any task that would reasonably take > 15 min of focused effort

**What does NOT trigger** (skip RAP and log):
- Trivial lookups, single commits to fix typos, status checks
- Conversational turns in a chat that are purely clarifying
- File operations (mv, cp, commit) with no design content

---

## RAP doctrine (updated)

**Recon-Activate-Protocol** was defined in earlier memory; this section
makes it operational with tracking.

**Before starting a non-trivial task**:
1. 🔎 Scan agent/skill libraries:
   - CC / CfC: list `~/.claude/agents/` and `command-app/.cursor/rules/`
   - Claude.ai chat: declare "no filesystem access — Jason, do you want
     me to leverage a specific agent?" OR work from first principles
     and flag for retrospective logging
2. 📋 Decide:
   - **Activate**: existing agent/skill fits → announce "📡 RAP: Activated
     [Name]" and use it
   - **None fit**: no match in library → work from first principles, flag
     `gap_flagged` in log entry if task is likely to recur
3. 📝 Log: write YAML entry to `agent_activity_log.md` with all required
   fields before closing the session

**Compliance gates**:
- CC must include "RAP: [activation status]" in every Phase 7 report
- Claude.ai chat declares scan status in opening response of any session
  involving non-trivial tasks
- Silent skips (doing non-trivial work without declaring scan) count as
  violations and reduce monthly compliance score

---

## What "load-bearing" means

An agent is **load-bearing** if:
- Activated ≥ 3 times in 30 days AND
- Outcomes on those activations were ≥ 80% shipped

An agent is a **retirement candidate** if:
- Activated 0 times in 60 days OR
- Activated but outcomes were consistently blocked/abandoned

An agent is a **refinement candidate** if:
- Activated ≥ 3 times AND
- Outcomes split 50/50 shipped vs blocked (suggests scope mismatch or
  prompt decay)

**Activation concentration (new metric)**:
If any single agent accounts for > 40% of all activations in the 30-day
window, flag it in the monthly review as a concentration risk. Reasons
this matters:
- Over-reliance on one agent suggests we're solving every problem with
  the same hammer (the "golden hammer" anti-pattern)
- May indicate missing specialist agents (we default to the generalist
  because no specialist exists)
- May indicate the generalist has drifted to cover too many use cases
  and is overdue for refactoring into multiple focused agents

Flag format in monthly review:
  "⚠️ Concentration risk: [agent-name] = X% of activations. Candidates
  to split: [task types that should have their own agent]"

This is a SOFT flag — it prompts review, not automatic action. Jason
decides whether to split, retire, or leave as-is.

---

## What gap-flagging triggers

When `gap_flagged` mentions the same agent name **≥ 3 times in 30 days**,
the monthly review auto-adds it to a build queue.

Build queue priorities:
- P0: flagged with outcome=blocked (product was delayed)
- P1: flagged with outcome=partial (product shipped but could've been better)
- P2: flagged with outcome=shipped (would have been faster)

---

## Integration with session types

Session-type-to-agent-affinity examples (non-exhaustive):

| Session type | Likely agents to scan |
|---|---|
| build | cc-prompt-architect, migration-runner, test-harness-builder |
| strategy | competitive-analyst, first-principles-kill-test, pitch-reviewer |
| gtm | outbound-writer, one-pager-builder, icp-validator |
| qa | symphony-scorer, symphony-persona-architect, journey-walker |
| patent | prior-art-auditor, claim-drafter, novelty-scorer |
| competitive | zero-competitor-audit, positioning-sharpener |
| ops | brain-committer, state-md-writer, ops-watchdog |

This table is a starter — additions come from real activations, not speculation.

---

## Commit convention for log entries

Log entries themselves are committed like any other brain write:
```
brain: log — [activation or gap flag headline]
```

Example:
```
brain: log — activated symphony-persona-architect for v13 persona extensions
brain: log — gap flagged: missing patent-claim-differentiator
```

Logs are NEVER squashed, rewritten, or deleted. The append-only property
is what makes monthly analysis honest.

---

## Monthly review

Runs first day of each month. Output file:
```
globalink-brain/command/reviews/agent_review_YYMM.md
```

Strategic AI (or Jason) reads `agent_activity_log.md`, runs the tallies
described in the log file itself, produces the summary, commits it:
```
brain: review — agent usage YYMM
```

First review (May 1 2026) covers the window from this doctrine's commit
date through April 30.

---

## Anti-patterns (explicit DO NOTs for tracking)

- ❌ Writing log entries retroactively in bulk — lossy, dishonest
- ❌ Marking `scan_performed: yes` without actually scanning
- ❌ Skipping entries because "the task was obvious" — if it was truly
   trivial, it doesn't trigger RAP; but most work is less trivial than
   it feels
- ❌ Adding fields outside the defined schema — breaks parseability
- ❌ Flagging a gap on first occurrence of novel work — only flag if the
   task recurs, else every new thing becomes a phantom gap
- ❌ Treating the log as blame infrastructure — it's a signal system,
   not a performance review

---

## Dispatch flow architecture — two-step (v12.1 forward)

**Discovered during v12 network capture review**:
The production dispatch flow is TWO STEPS, not one:

**Step 1 — Recommendation**
- User submits prompt → POST /api/route-task
- Router returns recommendation (agent name, confidence, reasoning, alternatives)
- No downstream agent call fires yet

**Step 2 — Dispatch**
- User reviews recommendation → clicks a subsequent control
- Actual agent dispatch fires
- Agent A processes → output lands → handoff to Agent B (if chained)

**Why this matters architecturally**:
- User retains control — the router is explainable and overridable
- Accidental dispatches (wrong prompt, wrong tier) don't burn credits
- The recommendation itself is a product feature, not a side effect
- Testing must walk BOTH steps — Step 1 alone tests routing, not dispatch

**Testing implication**:
Any Symphony spec that tests dispatch, handoff, or downstream chains
MUST walk the second step. A test that stops after /api/route-task
returns tests C1 (router intelligence) and only C1. C3 (handoff) and
C2 (actual output persistence) require walking Step 2.

**Harness requirement**:
- beginCapture() starts before Step 1 submission
- endCapture() ends after Agent B output lands OR after a timeout
  (recommend 90s ceiling for research → synthesis flows)
- Screenshot pairs at EACH boundary: submission, recommendation display,
  dispatch click, Agent A output, Agent B output
- Network payload inspection on EVERY /api/* call between Step 1 and
  end-of-chain, not just the first

---

## Shallow C3 is NOT a PASS (doctrine correction)

**v12 error**: The Matrix_v12.md marked J2 × P1 Iris, J2 × P3 Danielle,
and J2 × P4 Marcus as "PASS (shallow)" for C3. This was wrong per the
doctrine committed in v12's patterns.md delta:

> "C3 has NO partial state. Context transfer either works or doesn't.
> Partial context transfer IS failure — Eric and Danielle will notice."

**Correction**:
A shallow probe of C3 that verifies surface discoverability (e.g.,
/bridge page renders) is NOT a PASS. It's evidence for C7 (registry
persistence) or discoverability, not for the core handoff claim.

**Going forward**:
- C3 requires POSITIVE evidence of Agent-A-output-in-Agent-B-input
  AND Agent-A-entities-in-Agent-B-output, for EVERY persona assigned
  a C3-bearing journey
- "Shallow C3 = PASS" is a forbidden pattern in Symphony results
- If a run cannot walk the full chain, C3 cells are marked INCONCLUSIVE,
  not PASS
- Matrix must distinguish PASS, INCONCLUSIVE, PARTIAL, and FAIL as
  separate verdicts — not collapse them

**Applies to**:
All symphonies v12.1 onward. v12 proof files stay as historical record;
they're accurate about the evidence they captured, but the scoring on
J2 shallow cells was lenient.

---

## Working-tree drift detection (260422 lesson)

Context: sonar-pro model name fix was made in a CC session, saved
to local filesystem, but NEVER committed. Subsequent sessions saw
`git log` clean and reported "code already has sonar-pro" (true
locally, false on deployed remote). Three layers of staleness
(working tree vs remote vs Vercel vs browser cache) compounded to
produce an error that looked like a code bug but was actually a
deployment gap.

Rules going forward:
1. Any CC session that modifies code MUST end with `git status`
   output in the session report — confirming clean tree or listing
   uncommitted files
2. State reports must include both `git log -1` AND `git status`
3. When debugging deployed behavior, verify what's actually running:
   `vercel inspect [url] | grep commit`
4. Do not trust "locally the code says X" — only trust "remote main
   HEAD says X + Vercel production deploys from that commit + browser
   loaded the post-deploy bundle"
5. CC sessions that end with dirty working tree are INCOMPLETE even
   if their task succeeded — working-tree changes are time bombs
   for future sessions

---

## Multi-layer staleness compounding (260422 lesson)

Context: During 260422 product diagnosis, a single bug symptom
(Perplexity returning "Invalid model 'llama-3.1-sonar-large-128k-online'")
had THREE independent staleness layers:

Layer 1: Local working tree had fix (committed Apr 20 by CC session)
Layer 2: Remote main branch had old value (fix never pushed)
Layer 3: Vercel production pulled from old remote
Layer 4: Browser served cached JS bundle from old deploy

Any ONE of these being "fixed" was not sufficient. All four had
to resolve in sequence. Prior CC session checked Layer 1 only,
declared fix complete, left the rest stale.

Debug checklist for "code says X but behavior says Y":
1. git status — working tree clean?
2. git log -1 — what's on local HEAD?
3. git ls-remote origin main — what's on remote HEAD?
4. vercel inspect [production-url] — what commit is deployed?
5. Hard refresh browser (Ctrl+Shift+R) — fresh bundle loaded?

If any of steps 1-5 surfaces a mismatch, the bug is staleness not
code logic. Fix the mismatch before trying to fix the code.

---

## Symphony severity semantics (clarification)

**INCONCLUSIVE vs PARTIAL**:
These are different, though v12 used them interchangeably.

- **INCONCLUSIVE**: Test could not exercise the claim. Evidence gap.
  Not a product judgment. Example: "harness stopped before Agent B
  invocation; C3 untested."
- **PARTIAL**: Test exercised the claim; claim works imperfectly.
  Product judgment. Example: "handoff fires but Agent B's output
  only references 1 of 2 required entities from Agent A."
- **PASS**: Test exercised the claim; claim works per spec.
- **FAIL**: Test exercised the claim; claim doesn't work or works wrong.

**Rubric implication**:
- INCONCLUSIVE on C3 → can't ship to real customer, but not a defect
- PARTIAL on C3 → product defect, must fix before ship
- Both require the same immediate response (fix the gap), but the
  root cause and remediation path differ
