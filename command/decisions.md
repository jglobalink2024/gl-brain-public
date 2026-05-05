# COMMAND — Decisions Register
Last updated: 260505

---

## [260505] POINTER Step 3.5 Isolation Test — PASS 5/5

[PERSISTENT]
Last updated: 260505
Author: CC

**Session:** [GL/COMMAND | TECH | POINTER Step 3.5 Isolation Test | 260505]

**Decision:** POINTER v3.3 Step 3.5 gate logic confirmed production-sound.

All five edge cases verified against the inline rule:
- Case 1 (date-newer, full day): 🔴 BANNER ✅
- Case 2 (same-day, YYMMDD < HHMM anchor): 🟢 CLEAR ✅
- Case 3 (same-day, 5-min drift, HHMM precision): 🔴 BANNER ✅
- Case 4 (date-older): 🟢 CLEAR ✅
- Case 5 (malformed trailing letter, Check A stops before B): 🔴 BANNER ✅

F8a closure confirmed. HHMM-precision catches sub-day corruption
that day-only comparison misses. Check A short-circuit works correctly.

**Status:** RESOLVED — no gate changes required.

---

## [260505] POINTER v3.5 Hardening Candidate — integrity.md Blind Spot

[PERSISTENT]
Last updated: 260505
Author: CC

**Session:** [GL/COMMAND | TECH | POINTER Step 3.5 Isolation Test | 260505]

**Finding:** Step 3.5 validates each brain file's `Last updated:` header
against integrity.md's `last_verified` field. However, integrity.md's
own `last_verified` field is never validated for format compliance
(YYMMDD or YYMMDD-HHMM). If integrity.md itself is corrupted or
receives a malformed last_verified value, Step 3.5 trusts it blindly
and the entire date-proxy check becomes unreliable.

**Proposed v3.5 fix:**
Add a pre-check (runs before Check A) that validates integrity.md's
`last_verified` field format. Invalid format →
🔴 HARD BANNER: "integrity.md last_verified is malformed ([value]).
Cannot use as comparison anchor. Operator must inspect and rebless."
Stop. Do not proceed to Check A or B.

**Status:** CANDIDATE — not yet implemented. Gate for v3.5 authoring.

---

## 260505 — tsx scripts do not auto-load .env.local — explicit dotenv required

**Session:** [GL/COMMAND | BUILD | C2+C3 Verification · Sentinel Scaffold | 260505]
**Decision:** All housekeeping agent scripts must explicitly call `config({ path: resolve(process.cwd(), ".env.local") })` at entry point — tsx does not auto-load .env files.

### Finding
sentinel/index.ts failed on first run: "Missing Supabase credentials" despite AGENT_SUPABASE_URL
and fallback vars (SUPABASE_SERVICE_KEY, NEXT_PUBLIC_SUPABASE_URL) being present in .env.local.
Root cause: `npx tsx scripts/agents/X/index.ts` runs without loading .env.local automatically.
Next.js loads .env.local via its own startup pipeline; tsx does not replicate this.

### Resolution
Added to sentinel/index.ts entry:
```typescript
import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(process.cwd(), ".env.local") });
```
supabase-client.ts already has correct fallback chain (AGENT_SUPABASE_SERVICE_KEY ?? SUPABASE_SERVICE_KEY ?? SUPABASE_SERVICE_ROLE_KEY).
After fix: sentinel ran green, both targets HTTP 200, 4 rows in health_log.

### Pattern for all future agent scripts
Every script under scripts/agents/ that reads env vars must include the dotenv load block
as its first import. This is the canonical pattern — commit 9fdeb80.

---

## 260505 — Housekeeping agent Vercel env vars deferred — local-only deployment

**Session:** [GL/COMMAND | BUILD | C2+C3 Verification · Sentinel Scaffold | 260505]
**Decision:** Agent infrastructure env vars (AGENT_SUPABASE_URL, GL_BRAIN_LOCAL_PATH, VERCEL_TOKEN) added to .env.local only — not pushed to Vercel production.

### Reasoning
GL_BRAIN_LOCAL_PATH=C:\dev\gl-brain is a Windows path. Vercel runs Linux. Deploying this
var to production is meaningless and potentially confusing. Housekeeping agents (sentinel,
brain-warden, credit-auditor, ledger-janitor) are designed to run on Jason's local machine
via Windows Task Scheduler, not on Vercel edge functions.

### Deferred condition
Re-open if any housekeeping agent moves to a cloud deployment (e.g., Vercel cron, GitHub Actions,
Render scheduled job). At that point: replace GL_BRAIN_LOCAL_PATH with a cloud-accessible
brain read path (e.g., GitHub API or Supabase storage).

---

## 260505 — C2 entity carry-through was a test defect, not a code defect

**Session:** [GL/COMMAND | BUILD | C2+C3 Verification · Sentinel Scaffold | 260505]
**Decision:** The "entity carry-through bug" blocking C2 in symphony v12 was a test scaffolding error — no code fix required.

### Finding
symphony v12 J2 result showed next_task_id: null, causing autoHandoff to exit early (line 82-86:
`if (!completedTask.next_task_id) return { triggered: false }`). This was marked as a code bug.

### Root cause
The symphony test scenario never configured a "THEN SEND TO" chain in the task router UI.
Without an explicit chain setup, next_task_id is null by design — autoHandoff is correct to exit.
The code is not broken; the test setup was incomplete.

### Resolution
J2_handoff_deep.spec.ts v3 (commit 3c17ba6) proves C2 via the Context Bridge path (CCF form →
structured handoff prompt → HANDOFF LOG) without requiring the chain pipeline. Two distinct
vendors confirmed: Perplexity-1 (source) → GPT-4-1 (target). C2 criterion met.

### Note
Full auto-chain (system-driven context carry without operator action) is Phase 3. C2 is satisfied
by the operator-assisted CCF handoff: one structured prompt generated by COMMAND, pasted once.

---

## 260505 — scoreAgentsForTask dead code gap — Phase 3 wire-up required

**Session:** [GL/COMMAND | BUILD | C4 Playwright Verification · Router Load Scoring | 260505]
**Decision:** Document and park the scoreAgentsForTask / taskDescription wiring gap as a Phase 3 item.

### Finding
scoreAgentsForTask (semanticMatcher.ts) is dead code in the current UI flow.
routeAndExecute() in router/page.tsx is called from handleDispatch and handleAutoExecute.
Neither call passes taskDescription, so the `if (options.taskDescription)` branch in
routerExecution.ts never executes. scoreAgentsForTask never runs in production.

C4 is satisfied by task-router-engine.ts + /api/route-task (confirmed by Playwright tests).
semanticMatcher.ts with load penalty is ready for Phase 3 when embeddings ship.

### Why not fix now
Wiring taskDescription into routeAndExecute would require:
1. Changing the routeAndExecute() call signature in router/page.tsx
2. Ensuring the taskInput state is available at dispatch time (it is — but the change
   touches the dispatch hot path, which is GP-1 critical)
3. End-to-end test coverage for the new path

Rule: no hot-path surgery until GP-1 is 48h GREEN. Park until C3 PASS.

### Phase 3 action item
After C3 PASS: pass taskInput.trim() as taskDescription in all routeAndExecute() calls
in router/page.tsx. Verify routing_decisions.candidate_agents shows loadPenalty field.
This activates the routing_decisions audit trail for the full semantic scoring path.

---

## 260505 — Playwright test pattern: waitForResponse over UI element assertions

**Session:** [GL/COMMAND | BUILD | C4 Playwright Verification · Router Load Scoring | 260505]
**Decision:** In COMMAND Playwright tests, use page.waitForResponse() to detect API calls — not UI element assertions — when the UI has multiple rendering branches.

### Finding
The router page has a Phase 2.4 auto-execute flow: high-confidence recommendations
skip the static RecommendationPanel and immediately dispatch the task. The "Recommended Agent"
text appears for <100ms (between setRecommendation and setAutoExecPhase) — Playwright's poll
misses it. Tests that assert on transient UI text are flaky by design.

### Pattern (canonical for COMMAND)
```typescript
// Register BEFORE click — catches API call regardless of UI branch
const routeTaskDone = page.waitForResponse(
  (resp) => resp.url().includes("/api/route-task") && resp.status() === 200,
  { timeout: 20_000 },
);
await button.click();
await routeTaskDone;
await page.waitForTimeout(300); // let route interceptor parse body
```

### Also found
Cookie consent dialog (fresh browser context) blocks form interaction if not dismissed first.
Fix: add `getByRole("button", { name: /essential only/i }).click()` in beforeAll after navigation,
wrapped in try/catch (dialog may not appear if preference is stored).

---

## 260505 — C4 fix shipped: semanticMatcher.ts load penalty live

Session: [GL/COMMAND | BUILD | C4 Penalty Audit · Semantic Matcher | 260505]

Commit: 7a5d856 — command-app main
File: lib/pipeline/semanticMatcher.ts

Changes shipped:
- Bulk in-flight query: tasks WHERE workspace_id=wid AND status IN ('queued','active') AND agent_id IN [agent IDs]
- inflightMap: Record<agentId, count> built from query results
- loadPenalty = Math.min(inflightCount * 10, 30) applied to combinedScore
- combinedScore = Math.max(0, Math.round(kw*0.6 + hist*0.4 - loadPenalty))
- inflightCount + loadPenalty added to AgentScore interface (debuggability)
- rationale string updated to mention load penalty when active tasks > 0
- console.log updated to show load breakdown per agent

TypeScript: exit 0. ESLint: clean. Preflight: PASSED.

C4 criterion: "Task routing considers availability and load, not just type"
Status: IMPLEMENTATION COMPLETE — pending Playwright verification.

---

## 260505 — C4 workload penalty audit: FAIL verdict + minimum fix scoped

Session: [GL/COMMAND | BUILD | C4 Penalty Audit · Semantic Matcher | 260505]

**Verdict: C4 FAIL — strict cockpit-done definition not met**

### What was audited
File: command-app/command-app/lib/pipeline/semanticMatcher.ts
Criterion: C4 = "Task routing considers availability and load, not just type"

### Finding
No load term exists in semanticMatcher.ts. The scoring formula is:
  combinedScore = keywordScore × 0.6 + historyScore × 0.4

- keywordScore: type match + keyword overlap — not load
- historyScore: past success rate (outcome='success' last 30 days / total) — not load
- status field: used only to exclude 'error' agents at query level
- task_success_rate, avg_token_efficiency: fetched from agents table, NEVER USED in scoring

No is_active boolean, no in-flight count, no queue depth, no workload penalty of any kind.

### Why 260503 recon misread "93 vs 74" as a workload penalty
The delta was a historyScore difference between two agents with different recent
success rates. Identical keyword scores; the 0.4×history weight produced the gap.
No penalty term. Interpretation was wrong; the code is clear.

### Minimum fix scoped (Session size: S)
File: command-app/command-app/lib/pipeline/semanticMatcher.ts
Change: Add in-flight task count query + load penalty term

1. After agent fetch, count tasks WHERE assigned_agent_id IN agents AND status IN ('active','dispatched') AND workspace_id = workspaceId. Build inflightMap: agentId → count.

2. In scoring loop:
   const inflightCount = inflightMap[agent.id] ?? 0;
   const loadPenalty = Math.min(inflightCount * 10, 30); // cap 30
   const combinedScore = Math.round(keywordScore * 0.6 + historyScore * 0.4 - loadPenalty);

3. Expose inflightCount + loadPenalty on AgentScore interface for debuggability.

Idle-0 vs idle-2 (same type, same history): delta = 20 points. Monotonic + non-zero. ✓

Option A (is_active binary) rejected: criterion says "load" not just "availability."
Binary flag cannot distinguish 1-task vs 10-task agents. Queue depth is correct signal.

### C4 path to PASS
Implement minimum fix above → verify via Playwright that:
  - Two same-type agents: idle gets higher combinedScore than one with 2 active tasks
  - Score delta is non-zero and proportional to in-flight count
  - Routing log shows loadPenalty field populated

C4 PASS gates: cockpit-done-definition.md 260503 walk update.

---

## 260505 — gap-flagger log schema: align SKILL.md to live schema (forward-only) [via: CC]

Session: [GL/COMMAND | OPS | Agent Dev Kit v2 · Gap-Flagger 2605 · GLaOS Outline | 260505]

**Decision:** Update `gap-flagger/SKILL.md` input contract to formally accept the live `agent_activity_log.md` field names as primary. Do NOT migrate existing log entries. Forward-only extension: new entries should add optional fields when possible.

**Field mapping (live → SKILL.md canonical):**

| Live log field | SKILL.md contract field | Resolution |
|---|---|---|
| `activated` | `agent_name` | Accept `activated` as valid alias; update SKILL.md to document both |
| `date` (YYMMDD) | `timestamp` (ISO-8601) | Accept YYMMDD; note precision loss (no time-of-day) in SKILL.md |
| `outcome` | `task_outcome` | Accept `outcome` as valid alias; update SKILL.md to document both |
| *(absent)* | `first_month` | Apply heuristically from install date; add as optional field for new entries |
| *(absent)* | `invoker` | Add as optional field for new entries |
| *(absent)* | `handoff_to` | Add as optional field for new entries |

**Rationale:** The live log has 10+ entries already committed in the established format. Migrating existing entries would violate the append-only principle (`RM_RF_BLOCKED` class violation — append-only is sacred). `SKILL.md` was written before the live log existed and diverged during initial setup. The simpler and safer fix is to align the spec to the implementation, not the implementation to the spec. The field-mapping heuristic gap-flagger currently applies is correct — this decision formalizes it.

**Impact on gap-flagger:** Remove "schema mismatch" from Section 12 Data Quality in future reviews once SKILL.md is updated. The heuristic mapping is now the official contract, not a workaround.

**Excluded options:**
- *(a) Migrate existing log entries to SKILL.md field names* — rejected. Violates append-only. 10 entries would need rewriting. No operational benefit.
- *(c) Keep mismatch unresolved* — rejected. It's a recurring data-quality flag. Two reviews is enough signal to decide.

**Next action:** Update `gap-flagger/SKILL.md` input contract section to document `activated`/`date`/`outcome` as accepted aliases. Add optional fields to the schema table. Target: before 2606 review.

---

## 260504 — GP-1 Stale-Execution Guard: executeTask 2b.5 [via: CC]

Session: [GL/COMMAND | GP-1 | Stale-Exec Guard · 48h Clock Start | 260504]

**Decision:** Add stale-execution guard (section 2b.5) inside `executeTask.ts` immediately before `// ── 2c. Mark agent active` (commit 1af2195).

**Root cause diagnosed:** The `dispatchTask` route calls `void fetch("/api/agents/proxy")` as fire-and-forget. When a Playwright test fails/times out, this background proxy continues running through the full Perplexity → autoHandoff → executeTask(Claude) chain. The `beforeEach` nuclear reset then fires for the NEXT test, deleting tasks and setting agents to "idle". But executeTask — which was already running — had a ~200ms window between its initial task fetch (line ~224) and its `agents.update({ status: 'active' })` call (line ~307). The nuclear reset's "idle" write fired in this window, and executeTask then OVERWROTE it with "active". The agents-idle poll (`timeout: 30s`) then timed out waiting for Claude-Drafting to go idle while Claude API was still processing.

**Fix (lib/pipeline/executeTask.ts, section 2b.5):**
Re-query the task by ID immediately before marking the agent active. If the task is no longer in the DB (deleted by nuclear reset), return early with `errorCode: 'task_not_found'` WITHOUT touching agent status. This shrinks the race window from ~200ms to ~1 DB round-trip (~10ms).

**Evidence:** Dev log from `/dev` page showed a repeating `nuclear reset → autoHandoff → executeTask → anthropic request → task complete` cycle for 1+ hour across 15+ failed test runs, confirming the stale background proxy as the source.

**Confirmed working:** Playwright golden-path.spec.ts — 3 passed, 7.3m, no retries (commit 1af2195 tested post-fix).

**GP-1 gate status:** GREEN as of 260504 ~01:00. 48h clock started. GP-2 gate opens 260506 ~01:00.

---

## 260503 — Eric Repurposed as Discovery User, Not Beta [via: Chat → CC]

Session: [GL | STRATEGY | Cockpit-Done Recovery · Eric Repurpose | 260503]

**Decision:** Eric reach-out for May 5–10 window approved as DISCOVERY USER, not beta launch.

**Tension this resolves:** Original Pure Path A doctrine (260423) said "silence until cockpit-done." A strict reading requires zero contact until criterion #5 is non-zero. But criterion #5 ("3 non-Jason users returning unprompted 7+ days") cannot move from zero without inviting users. Deadlock. Resolution: distinguish CONTACT from PROMISES. The doctrine forbids promises a product can't keep. It does not forbid contact aimed at learning what the product still gets wrong.

**Frame:** Recon-in-force, not attack. Eric is the small element making contact to bring back information that can't be obtained from the inside. He is not the objective. The objective remains the cockpit-done gate.

**Three hard conditions for this to remain honest, not drift to 🅰.1:**
1. No "beta" language anywhere — not in email, not in conversation, not in pricing context. Use "early look" or "friction-finding session."
2. No pricing conversation, no founding member offer, no commitment ask. If Eric loves it, he doesn't get to buy yet. Product is not for sale.
3. Friction log generated, committed to brain post-session, drives next sprint queue. If 30 days pass without code changes traceable to Eric's session → recon failed → fall back to 🅰.4 strict.

**If any condition slips:** Eric pulled, posture returns to 🅰.4 strict hold, no further outreach until cockpit-done criteria materially advance.

**What this decision does NOT do:**
- Does not assert any of criteria 1–6 are met
- Does not unlock Grant, Jon, Richard, or any other warm contact
- Does not reopen Waalaxy / paid outreach
- Does not change "no founding member offers" doctrine
- Does not modify cockpit-done-definition.md

**What this decision does:**
- Reframes Eric specifically as discovery user with explicit conditions
- Acknowledges criterion #5 requires action that strict-hold doctrine forbids — surfaces the deadlock and resolves it without revising the gate
- Establishes contact-vs-promise distinction as doctrine

**Reversal trigger:** If by EoD 260510 (one week from commit) no Eric session is scheduled OR any of the three conditions look at risk, this decision auto-reverts to 🅰.4 strict and Eric is pulled until cockpit-done criteria advance.

---

## 260503 — Hardening #2 + #3 canon + CC SessionStart hook plan

Decision: Adopt POINTER_VERSION + POINTER_CONTENT_HASH + integrity.md trust anchor + L1 Freshness Gate as the architectural canon. Demote Chat-side date proxy to soft-signal-only due to unfix-able web_fetch cache behavior. CC SessionStart hash hook is the recommended primary detector for Hardening #3.

Rationale: Two weeks of real-world validation (Apr 13–28, then May 1–3) revealed the 5-layer architecture works but has a single unfixable gap: claude.ai web_fetch caches responses for ≥30 min and rejects cache-bust params. Any operator-initiated brain write that skips rebessing integrity.md will not be detected by Chat within that window. Chat-side detection has bounded utility — CC-side detection must be primary.

Items closed:
- F4 (POINTER drift): POINTER_VERSION + POINTER_CONTENT_HASH fields verified end-to-end in real Chat session 260503.
- F8a (self-sealing freshness): catchup-originated writes now surface as drift; brain-committer --catchup refuses integrity.md updates.
- F8a gap discovery: Chat-side date proxy unreliable for writes within ~30 min. Root cause and mitigations documented in patterns.md.

Items deferred:
- CC SessionStart hook (Hardening #3): Recommended implementation awaits Jason review. Effort: M.
- gl-brain ↔ gl-brain-public sync mechanism: Partial propagation delay discovered Apr 28–May 3. Needs investigation.

Pattern: Any future brain-write detection scheme must account for web_fetch cache ≥30 min on claude.ai. Local filesystem reads preferred over remote fetches for ground truth.

## 260428 — Brain prevention architecture deployed
Decision: 5-layer architecture covers all originally identified
  failure modes (A/B/C/D/E). Bonus SessionStart hook for CC.
Rationale: 15-day blind drift in Apr 13–28 cycle exposed total
  absence of monitoring. Detection + alerting + recovery now
  layered, no single point of failure for brain freshness.
Layers: L1 Freshness Gate, L2A Brevo failure alert, L2B daily
  heartbeat 9am BRT, L3a Rule 12 brain-committer routing,
  L3b auto-catchup synthesis, L3.5 config version control.
Components: globalink-brain repo, globalink-brain-public mirror,
  POINTER_COMMAND.md v3 in project knowledge, sync-public.yml +
  brain-heartbeat.yml workflows, brain-committer agent,
  globalink-claude-config repo.

## 260428 — 4 unmitigated failure modes accepted as known gaps
Decision: F1 (catchup corruption), F3 (hot memory drift),
  F4 (POINTER drift), F7 (architecture rot) identified in
  post-L3.5 audit. Top 3 mitigations queued for next session.
Rationale: shipping 5 layers + audit in one session was the
  right call. Hardening F-series modes is post-MVP work.
Revisit: pre-São Paulo (May 1) — POINTER version field + parity,
  monthly fire drill cron, per-file diffs in catchup approval.

## 260427 — Pure Path A: Cockpit only. No notebook. June 1 is not a product deadline.
Decision: COMMAND builds one product — the cross-vendor AI coordination cockpit.
  The notebook idea (standalone AI session notes) is permanently killed.
  June 1 is the relocation date to São Paulo, not a shipping deadline.
  No beta invites until the cockpit delivers what the pitch says, sentence for sentence.
Rationale: Solo founder + two products + international move breaks something, and the
  founder doesn't get to pick what breaks. The cockpit is the thesis. The notebook was
  a hedge. The hedge costs more than the risk it was covering.
  "Done" is defined in gl-brain/command/cockpit-done-definition.md. Don't move the goalposts
  without a brain commit explaining why.
Pattern: Any new feature proposal must pass this gate: "Does this make the cockpit real
  faster, or does it expand scope?" If scope expansion → kill or park.
  Design partners (not customers) get early access. No pitching a product that isn't real.

## 260422 — audit_ledger writes use upsert + ignoreDuplicates, not insert
Decision: All `audit_ledger` inserts in `executeTask.ts` and `autoHandoff.ts`
  use `.upsert({}, { onConflict: 'id', ignoreDuplicates: true })`.
Rationale: `executeTask` and `autoHandoff` both write to audit_ledger in the
  same request cycle. Both do SELECT MAX(entry_seq) then +1 without a
  transaction, creating a race condition that produces 409 conflicts on the
  unique id. upsert+ignoreDuplicates silences collisions without losing data.
Pattern: Any new audit_ledger write must use upsert, not insert.
  entry_seq is best-effort — do not add a unique constraint on it.

## 260422 — getPooledKey is the canonical fallback for all vendor keys
Decision: Every route that makes a vendor API call must use BYOK key first,
  then `getPooledKey(vendor)` as fallback. Never hardcode
  `process.env.ANTHROPIC_API_KEY` directly in route files.
Rationale: `refine/route.ts` bypassed `getPooledKey` causing 422s for
  workspaces without BYOK. `executeTask.ts` already used this pattern.
  Standardizing across all routes prevents recurrence.
Pattern: `const apiKey = workspace?.vendor_key?.trim() || getPooledKey('vendor');`

## 260420 — Public mirror sync = blocklist, not allowlist
Decision: sync-public.yml uses recursive rsync with a single exclude (gl/entities.md)
  rather than explicit cp-by-file.
Rationale: Allowlist silently drops new subdirectories (symphony/**) and any new
  top-level files — public mirror got stuck 14+ files behind private, blocking
  agent-5 and all multi-instance Claude workflows from reading current state.
Pattern: "sync everything under command/ and gl/, exclude only gl/entities.md."
  Any future private-only file must also be added to the exclude list explicitly.
Safety invariant: gl/entities.md is the ONLY private file. Re-verify before adding
  any new gl/ content that might contain prospect/pipeline data.



## 260413 — Ops-watchdog run logs committed to git (not local-only)
Decision: Write run logs to docs/ops/ inside the repo, committed after every run.
Rationale: Persistent memory that survives machine changes, visible in git history,
  queryable by the agent for trend detection. Local-only would break on new machine.
Pattern: daily auto-commit via scheduled task — "ops: daily run YYYY-MM-DD — GREEN/YELLOW/RED"

## 260413 — Self-patch via GitHub PR (not auto-apply)
Decision: Agent proposes changes to its own definition as GitHub PRs, Jason merges.
Rationale: Agent can open a PR (GitHub MCP available) but should not rewrite its own
  instructions without human review. PRs preserve the decision trail in git.
Branch pattern: ops/watchdog-self-patch-YYYYMMDD

## 260413 — Schema baseline bootstrapped on first run (not hand-coded)
Decision: schema-baseline.json starts as a template with bootstrapped: false.
  First /ops-check populates it from live Supabase + filesystem + planGate.ts.
Rationale: Hand-coding the table list would go stale immediately. Live bootstrap
  captures actual state. Subsequent runs detect drift against that snapshot.

## 260413 — Ops agent lives in command-app git (not global ~/.claude)
Decision: .claude/agents/ops-watchdog.md in the repo, not the user's global agents dir.
Rationale: Agent must grow with the product. Global agents don't have product context
  and don't get committed alongside the code they monitor. Repo-local = version-controlled.

## 260413 — Pooled keys, no new schema columns
Decision: Reuse existing anthropic_api_key / openai_api_key / perplexity_api_key columns as BYOK columns; no migration
Rationale: Columns already existed with correct names. Adding user_anthropic_key etc. would have been redundant duplication.
Pattern: workspace key ?? env var — one line per vendor in proxy route.

## 260413 — Skills Enforcement KEPT
Decision: Rejected Gemini kill recommendation
Rationale: Trust layer not governance layer. Sandra never
  sees compliance language. Rebranded "Agent Guardrails."
  Without enforcement, prompt injection destroys trust.
Alternative rejected: Kill entirely

## 260413 — Semantic Matchmaking KEPT
Decision: Rejected Gemini kill recommendation
Rationale: Required for non-technical UX. Without it Sandra
  must manually select agents — defeats the product promise.
Alternative rejected: Remove in favor of deterministic routing

## 260413 — Workspace DNA over Mem0/Zep
Decision: Simple text field, system prompt injection
Rationale: Zero infrastructure. 80% of perceived second brain
  value at $0 cost. Mem0 graph features = $249/mo. Wrong tier.
Revisit: Phase 3 — Zep temporal graph if Sandra needs
  entity tracking across sessions

## 260413 — Google OAuth before HubSpot
Decision: Google Workspace shipped first
Rationale: Sandra's confirmed stack is Google-native.
  ChatGPT + Claude + Perplexity + Fathom + Notion + Gmail.
  HubSpot penetration lower than assumed in boutique segment.

## 260413 — Canvas: linear execution only
Decision: 15-25hr linear build, not 150-200hr full engine
Rationale: Non-linear branching, async, loop prevention is
  Phase 4. Sandra runs Research → Draft → Review. Linear only.

## 260413 — ROI Tracker over Agent DNA Editor as Phase 2.9
Decision: ROI Tracker is Phase 2.9 priority
Rationale: Renewal conversation framing built into product.
  "COMMAND saved you 14 hours this week" closes the billing gap.

## 260413 — Phase/date rule PERMANENT
Decision: Builds framed by phase+function, never calendar
Rationale: Jason completes "week-long" items in hours.
  Time estimates are suggestions only. Train to standard.

## 260413 — Stripe price ID canonical names locked (UPDATED v9.5)
Decision: One env var name per price ID. No aliases. All follow STRIPE_{TIER}_PRICE_ID.
  STRIPE_FM_PRICE_ID, STRIPE_PRO_PRICE_ID,
  STRIPE_SOLO_PRICE_ID, STRIPE_STUDIO_PRICE_ID,
  STRIPE_AGENCY_PRICE_ID
Rationale: Legacy aliases removed in c30ad1a. STRIPE_PRICE_STUDIO
  and STRIPE_PRICE_AGENCY renamed to match convention in 8635e83.
  ACTION: Update Vercel env vars to match new names.

## 260413 — FM cap race condition: Option B
Decision: Document known race, manual check after purchase.
Rationale: 25-seat cap makes simultaneous purchase
  probability near-zero. Redis lock is over-engineering
  for this volume. Review if cohort fills fast.

## 260413 — system_prompt redacted from DB
Decision: Store hash + length, not full prompt.
Rationale: Workspace DNA + API patterns in plaintext
  in task_executions was a security gap. Hash preserves
  auditability without storing sensitive content.

## 260413 — Gemini vendor status: pending not null
Decision: Gemini/cursor/custom vendors return pending
  status rather than null. UI shows "coming soon."
Rationale: Returning null silently made Sandra think
  her Gemini agent was working when it wasn't.

---

## 260503 — Hardening #3 ships CC-side SessionStart hash hook as canonical F8a detector

Decision: Hardening #3 ships the CC-side SessionStart hash hook (`brain-integrity-check.js`) as the canonical detector for F8a (self-sealing freshness signal). Chat-side date proxy is demoted to soft-signal-only because web_fetch cache makes it unreliable for sub-30-min drift detection. The hook reads gl-brain/command/integrity.md hashes directly from the filesystem, bypasses all caches, and emits a HARD BANNER into CC context on any hash or date-proxy mismatch.

Rationale: Chat-side date proxy was the intended F8a closure in Hardening #2, but the corruption test (260503) revealed claude.ai web_fetch holds stale cached content for 30+ minutes and rejects cache-bust query params. The CC-side hook has no dependency on network or cache — it reads local disk every session. Three-state self-test verified (clean → drift → recovery) on 260503.

Items closed: F8a fully closed (both Chat-side soft signal + CC-side hard signal operational).


---
## --- Decisions from globalink-brain (pre-merge, 260413–260428) ---

## 260428 — Public mirror archived root cause resolved
Decision: globalink-brain-public was archived 260422, causing
  6 days of silent 403 failures on sync Action. Unarchived 260428.
Action: Add on-failure email alert to sync workflow (Brevo).
  Upgrade Node.js 20 in Action before Jun 2 deprecation deadline.
Revive condition: N/A — operational fix

## 260427 — HOT MEMORY DOCTRINE
Decision: Hot memory stores invariant behavioral rules ONLY.
Kill test: "Would Claude do the wrong thing before reading even
  one file?" Yes → hot memory. No → brain.
Brain routing:
  state.md → build/GTM/bugs
  patterns.md → repo/build conventions
  decisions.md → architecture/IP
  killed.md → rejected ideas
  research.md → competitive/market
  entities.md → contacts (private, never synced)
Rationale: State, contacts, intel, and reference data in hot
  memory bloats context and creates staleness risk.

## 260427 — ACTION OFFICER DOCTRINE (Rule 9)
Decision: When Jason gives a digital directive, Claude routes
  to correct variant and executes. Jason reviews and approves.
Acceptable for Jason as actor only:
  physical-world tasks, irreversible legal/financial signatures,
  identity-required tasks.
Never default to handing Jason a todo list.
Violation signal: "stop making me the action officer" →
  self-correct immediately.

## 260427 — RAP-B REAL-SCAN RULE (Rule 10)
Decision: Every non-trivial task requires real scan of:
  /mnt/skills/public + ~/.claude/agents (190 files) +
  .cursor/rules (162 .mdc) + 9 RPM plugin packs.
RAP-B "none" must always be qualified by what was checked.
Stamping without scanning is a Rule 10 violation.

## 260427 — MEMORY-CHECK-PRECEDES-RECON RULE (Rule 11)
Decision: Before filesystem recon on any task involving paths,
  repo state, auth, or install locations — surface relevant
  memory first. Discovering through recon what memory already
  encoded is a Rule 11 violation.

## 260427 — AGENT/SKILL LIBRARY AUDIT CADENCE
Decision: Cowork scans first Monday monthly.
Sources: awesome-claude-code, awesome-mcp-servers,
  Anthropic docs/blog, NPM @anthropic-ai, r/ClaudeAI.
Vetting: 500+ stars or Anthropic-affiliated, ≤90d commit,
  permissive license, no telemetry.
Current inventory: ~/.claude/agents/ 190 .md files
  (189 STOCK + 1 ORIGINAL: cc-prompt-architect, COMMAND-only).
  .cursor/rules 162 .mdc all stock. 9 RPM plugin packs ~100 skills.

## 260416 — API key security: pooled keys default
Decision: Onboarding is API-key-free by default.
  COMMAND pooled keys power all proxy calls.
  BYOK opt-in only via Settings > Integrations.
Enforcement: Eric must never see an API key screen.
Rationale: "Another tool to manage" is the primary kill trigger.
  Key friction must be zero at first contact.

## 260416 — MCP scope overlap warning: Phase 3
Decision: Scope field on MCP status endpoint queued for Phase 3.
  Warns when two registered MCPs have overlapping capability sets.
Gate: first paying customer (same as Phase 3).

## 260413 — Skills Enforcement KEPT
Decision: Rejected Gemini kill recommendation
Rationale: Trust layer not governance layer. Sandra never
  sees compliance language. Rebranded "Agent Guardrails."
  Without enforcement, prompt injection destroys trust.
Alternative rejected: Kill entirely

## 260413 — Semantic Matchmaking KEPT
Decision: Rejected Gemini kill recommendation
Rationale: Required for non-technical UX. Without it Sandra
  must manually select agents — defeats the product promise.
Alternative rejected: Remove in favor of deterministic routing

## 260413 — Workspace DNA over Mem0/Zep
Decision: Simple text field, system prompt injection
Rationale: Zero infrastructure. 80% of perceived second brain
  value at $0 cost. Mem0 graph features = $249/mo. Wrong tier.
Revisit: Phase 3 — Zep temporal graph if Sandra needs
  entity tracking across sessions

## 260413 — Google OAuth before HubSpot
Decision: Google Workspace shipped first
Rationale: Sandra's confirmed stack is Google-native.
  ChatGPT + Claude + Perplexity + Fathom + Notion + Gmail.
  HubSpot penetration lower than assumed in boutique segment.

## 260413 — Canvas: linear execution only
Decision: 15-25hr linear build, not 150-200hr full engine
Rationale: Non-linear branching, async, loop prevention is
  Phase 4. Sandra runs Research → Draft → Review. Linear only.

## 260413 — ROI Tracker over Agent DNA Editor as Phase 2.9
Decision: ROI Tracker is Phase 2.9 priority
Rationale: Renewal conversation framing built into product.
  "COMMAND saved you 14 hours this week" closes the billing gap.

## 260413 — Phase/date rule PERMANENT
Decision: Builds framed by phase+function, never calendar
Rationale: Jason completes "week-long" items in hours.
  Time estimates are suggestions only. Train to standard.

## 260413 — Stripe price ID canonical names locked
Decision: One env var name per price ID. No aliases.
  STRIPE_FM_PRICE_ID, STRIPE_PRO_PRICE_ID,
  STRIPE_SOLO_PRICE_ID, STRIPE_PRICE_STUDIO,
  STRIPE_PRICE_AGENCY
Rationale: Legacy aliases removed in c30ad1a.
  Dual names caused silent failures.

## 260413 — FM cap race condition: Option B
Decision: Document known race, manual check after purchase.
Rationale: 25-seat cap makes simultaneous purchase
  probability near-zero. Redis lock is over-engineering
  for this volume. Review if cohort fills fast.

## 260413 — system_prompt redacted from DB
Decision: Store hash + length, not full prompt.
Rationale: Workspace DNA + API patterns in plaintext
  in task_executions was a security gap. Hash preserves
  auditability without storing sensitive content.

## 260413 — Gemini vendor status: pending not null
Decision: Gemini/cursor/custom vendors return pending
  status rather than null. UI shows "coming soon."
Rationale: Returning null silently made Sandra think
  her Gemini agent was working when it wasn't.

## 260418 — GTM primary motion: Community-first, not outreach-first
Decision: LinkedIn community-first replaces Waalaxy as primary
  top-of-funnel. Waalaxy demoted to research instrument (€49/mo).
Rationale: Cold outreach yields 3-5 conversations/6wks — research
  instrument, not growth engine. Community-led is fastest
  rapid-growth lever for bootstrap solo founder.
Cancel trigger: End of June; if zero discovery calls + zero
  usable buyer-language quotes harvested, cancel Waalaxy.

## 260418 — Pricing model: Flat + caps + overages (hybrid)
Decision: Reject pure usage. Keep flat as primary. Add task caps
  per tier with overage upsell to next tier. Introduce $29
  Starter tier. Preserve $99 FM locked-rate cohort.
Rationale: Sandra's mental model is flat (ChatGPT/Claude/Perplexity
  all flat). Pure usage breaks conversion, kills engagement,
  destroys FM offer, complicates forecasting.
Revisit: Q3 2026 — credit packs if 3+ FM customers ask for
  pay-as-you-go in discovery.

---

## 260503 — L1 Freshness Gate · web_fetch cache-bust limitation · CC-side hook is authoritative

[PERSISTENT]
Author: Chat (via CC brain-committer)

Session: [GL | INFRA | L1 Gate Cache-Bust Test · POINTER v3.1 Verdict | 260503]

**Finding:** Chat-side L1 Freshness Gate cannot force fresh GitHub raw fetches via URL query-param cache-bust (`?nocache=...`). web_fetch's permission system rejects arbitrary query params not previously seen in tool results — returns PERMISSIONS_ERROR. Bare URL succeeds but inherits whatever caching exists at the fetch layer.

**Architectural conclusion:** Chat-side L1 verification is best-effort against potentially stale fetcher caches. The CC SessionStart hook (which reads local file content directly via filesystem, no HTTP layer) is the only authoritative integrity verification path.

**Doctrine implications:**
1. Chat-side L1 SOFT BANNER is the right default when integrity cannot be independently confirmed for all 5 tracked files — do not auto-promote to CLEAR
2. For high-stakes verification (post-corruption test, post-rebless), require CC session pass — Chat session pass is necessary but not sufficient
3. To force freshness when it actually matters, bump POINTER_CONTENT_HASH and push — any cached copy fails parity check on next gate run

**No code change required.** This is a doctrine clarification — captures a known gap in the F4/F8a closure architecture so it isn't re-derived later.

**Related:** Hardening #2 entry (260503 in state.md), POINTER_COMMAND.md v3.1, command/integrity.md.

---

## 260503 — Carry-Forward Contracts Must Be File-Persisted [via: Chat]

[PERSISTENT]
Author: Chat (documented via CC 260505)

Session: [GL/COMMAND | INFRA | Trio #1 · RESTORE.md Verification | 260503]

Any contract referenced by name in a carry-forward brief MUST
be committed to gl-brain/command/contracts/ before session
close. A name without a file path is a phantom reference —
it evaporates when the context window closes.

Pattern identified: 260428 session closeout referenced "pre-written
Rule 13 contracts in my carry-forward state" for P0#3, P1#4, P1#5.
They were never written to disk. Retrieved in 260503 session via
chat history search + redraft from context.

Fix: contracts/ folder established as the canonical path for any
Rule 13 contract that may be referenced in future sessions.

Note: contracts/ folder creation (WRITE 4 of the 260503 brain close
contract) is still pending — P0-3-smart-suggestions-fallback.md,
P1-4-mcp-sql-migrations.md, and P1-5-documenso-nda-fields.md content
was not in scope of the 260505 execution session.

## 260505 — brain-committer fallback SOP (direct CC path)
Decision: When brain-committer agent is absent from the agent list,
  CC may write directly to gl-brain using the Edit tool + git.
Rationale: ACT-1 (260505) proved direct CC commit is viable. brain-committer
  is a compliance/routing layer, not a physical git gate.
SOP:
  1. Edit the target file with the Edit tool (respect per-file mode: APPEND or FULL-REPLACE)
  2. git -C "C:/dev/gl-brain" add <specific-file>
  3. git -C "C:/dev/gl-brain" commit -m "brain: [description] [via: CC direct — brain-committer unavailable]"
  4. git -C "C:/dev/gl-brain" push origin main
  5. Note the bypass in this file (decisions.md) for audit trail
Rebless: after direct writes, integrity.md state_hash may drift. If closeout
  script does not auto-rebless, compute new SHA-256 via Node (LF-normalized)
  and update integrity.md manifest block + last_verified, then commit.
Constraint: Rule 12 still applies — brain-committer remains the required path
  when available. Direct CC path is fallback-only.

---

## 260505 — Rule 13 Extension: SOURCE_CHAT required in all delegation contracts [via: CC]

Session: [GL/COMMAND | OPS | Rule 13 Extension · SOURCE_CHAT | 260505]

**Decision:** Add SOURCE_CHAT as a required field in all Chat → CC (and Chat → any variant) delegation contracts.

**Rationale:** CC had no way to know which originating Chat thread to return findings to. Prior sessions had delegation contracts with MODEL + CALIBER but no source thread identification. This created orphaned findings with no return path.

**Implementation:** Rule 13 Extension added to `~/.claude/CLAUDE.md` (global, loads on every session). Field is required as the LAST line of the delegation contract header block. Missing SOURCE_CHAT = malformed contract → CC stops and requests it before proceeding.

**Format:**
  SOURCE_CHAT: [GL/WORKSTREAM | DOMAIN | Topic · Topic | YYMMDD]

**CC echo format:**
  RETURN TO: [exact SOURCE_CHAT value]

**Canonical delegation header field order:** MODEL → CALIBER → SOURCE_CHAT

---

## 260504 — Documenso start command: bypass Turbo entirely [migrated from globalink-brain 260505]

[PERSISTENT]
Author: CC

**Decision:** Use `cd apps/remix && node build/server/main.js`, NOT `turbo run start --filter=@documenso/remix`.

**Root cause:** Turbo `persistent: true` tasks silently no-op in non-TTY environments (Render CI). Turbo never errors — it just doesn't run the task. Service appears deployed but server never starts.

**Bonus:** The `cd apps/remix &&` prefix also fixes the Hono `serveStatic` path (looks for `build/client` relative to CWD). See patterns.md "Render + Hono monorepo: CWD matters for static assets (LOCKED 260504)".

**Applies to:** Documenso self-hosted on Render. Live at `https://documenso-gl.onrender.com` since 260504.

---

## 260504 — Render Pre-Deploy Command is a paid feature [migrated from globalink-brain 260505]

[PERSISTENT]
Author: CC

**Decision:** Cannot set `prisma db push` as a pre-deploy step on Render free tier — locked behind paywall.

**Implication:** Schema sync must be done manually in Supabase SQL Editor when Prisma schema changes for the Documenso instance.

**Current state (260504):** Schema is in sync — no action needed unless Documenso schema changes via upstream.

**Trigger to revisit:** Upgrade to paid Render tier (if scale demands), or migrate Documenso to a host with free pre-deploy hooks.

---

## 260505 — F8a closed via two-proof path

[PERSISTENT]
Last updated: 260505
Author: CC

**Decision:** Close F8a (self-sealing freshness signal) using two
independent proofs instead of the originally-specified live-mirror
corruption test.

**Proof 1 — CC arm (deterministic):** ~/.claude/hooks/brain-integrity-check.js
fires at session start, computes SHA-256 of all 5 tracked brain files,
compares to integrity.md manifest, emits HARD BANNER additionalContext
on mismatch. Verified empirically 260505 — fired correctly on session
start with hash mismatch (expected 0abbb0b8…, got a5e3a58c…).

**Proof 2 — Chat arm (prompt-following):** POINTER Step 3.5 prose
verified against 5-case truth table on isolated content (no fetch).
Cases cover date-newer, date-equal, HHMM-newer (F8a tight case),
date-older, and malformed-date branches. Result: PASS 5/5.
Key finding: HHMM precision catches 5-minute drift correctly (Case 3);
Check A correctly short-circuits before Check B on malformed input (Case 5).

**Scope:** F8a is now closed for both detection arms. The CC arm is
the enforcement boundary (developer writes flow through CC).
The Chat arm is informational — Chat sessions surface drift to operators
but cannot block writes.

**Why not the live-mirror test:** Concurrent-write traffic on gl-brain
main + raw.githubusercontent.com CDN cache make hot-brain corruption
tests infeasible (anti-pattern locked in patterns.md 260505). Two
corruption commits (1dd460d, b50b056) were overwritten within minutes
during the test attempt.

**Recovery:** Both corruption commits reverted; integrity.md reblessed
atomically; state.md entry committed via brain-committer.

**Deferred — v3.5 hardening:** integrity.md `last_verified` field itself
is not validated by Check A. If trust anchor is corrupted, Step 3.5
trusts it implicitly. Flagged for future hardening pass; out of scope
for F8a closure.

---

## 260505 — Housekeeping Agent: Zombie Detection Logic

Decision: Zombie tasks are identified by POSITIVE MATCH on executing states, not exclusion of terminal states.
- ZOMBIE_STATES = ["active", "running"] — tasks dispatched and never finished
- TERMINAL_STATES = ["complete", "failed"] — excluded from zombie concern but not used in query
- Query: .in("status", ZOMBIE_STATES) — safer than NOT IN exclusion (won't accidentally pick up unknown/new states)
- RESET_TO_STATUS = "failed" — constraint-valid; "idle" is NOT in tasks_status_check

Constraint reference: tasks_status_check allows: pending | running | complete | failed | active | paused | queued

Trigger: Live smoke run exposed 76 false zombie detections + 20x constraint rejections (all from queued/complete tasks incorrectly swept).

---

## 260505 — All housekeeping agents must load dotenv at module startup

Decision: Every agent index.ts must call `config({ path: resolve(process.cwd(), ".env.local") })` before any import that touches Supabase or env vars. tsx does not auto-load .env.local; agents silently receive undefined credentials without this.

Pattern: dotenv block goes at file top (lines 3-5), before all other imports. This is the canonical env-loading pattern for all scripts in scripts/agents/.

