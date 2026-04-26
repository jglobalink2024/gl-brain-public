# Mock BYOA Webhook Layer — Recon
# [PERSISTENT] — gl-brain/command/autogap/mock-byoa-webhook.md
# GlobaLink LLC | COMMAND Platform
# Authored: 260425 via CC read-only recon (command-app, no code changes)

---

## Context

From state.md (260424 top-of-file):
> "CHAIN TEST: Structurally blocked — needs mock BYOA webhook layer or live external agents. Parked Tier 1."

The autogap items "autoHandoff collapse" and "Canvas no-op" are already SHIPPED per
`slot-1-2-verification.md` (commits 78b078d et al). The remaining blocker is the chain
test in `e2e/golden-path.spec.ts` — the full Playwright test that verifies the two-agent
dispatch chain (Perplexity-Intel → Claude-Drafting) end-to-end.

This doc designs the mock layer needed to unblock it.

---

## 1. Current Behavior — What Happens When the Chain Test Runs Today

The chain test ("chain: Perplexity-Intel → Claude-Drafting with zero state drift")
drives the real Router UI. Full observed sequence:

1. `beforeEach`: nuclear reset via `/api/dev/reset/nuclear`; seed guard ensures agents exist
2. Test navigates to `/router`, fills task description + intent
3. Sets ASSIGN TO = Perplexity-Intel, THEN SEND TO = Claude-Drafting
4. Router's `handleDispatch` fires:
   - Creates Task A (Perplexity-Intel)
   - Creates Task B (Claude-Drafting, status: queued)
   - POSTs to `/api/tasks/chain` to link them: `{ task_id: A, next_task_id: B, auto_execute: true }`
   - Calls `routeAndExecute` → POSTs to `/api/tasks/execute`
5. `/api/tasks/execute` → `executeTask`:
   - Finds agent "Perplexity-Intel", resolves `vendor = "perplexity"`
   - Calls `workspace.perplexity_api_key ?? getPooledKey('perplexity')`
   - **No Perplexity key in test env** → `api_key = null`
   - Returns `{ success: false, error: "no_api_key" }` immediately
   - Task A stays at `status: "active"` (executeTask sets active before attempting vendor call)
   - Actually: executeTask sets task `active`, then on failure sets `failed` + writes error
6. Test polls for Task A `status === "complete"` with 120s timeout → **TIMES OUT**
7. Test fails. Gate sees RED if chain test is included.

**The no-op:** Perplexity-Intel can't execute without a Perplexity API key. Task A reaches
`failed`, never `complete`. autoHandoff never fires. Claude-Drafting never executes.

**Why the chain test is parked Tier 1, not just a test bug:**
Pulling a real Perplexity key into the test environment introduces cost, rate-limit
fragility, and external dependency. The chain test needs to run in < 3 min, reliably,
on every scheduler tick. That rules out real external API calls for BYOA agents in test.

---

## 2. Root Files Involved

| File | Role |
|---|---|
| `e2e/golden-path.spec.ts` | Chain test lives here (lines 95–251). Drives real Router UI. Polls `/api/dev/state` for task completion. 120s/180s timeouts. |
| `lib/pipeline/executeTask.ts` | Core task executor. Resolves vendor, calls API, marks task complete, returns `{ success, vendorResponse }`. Does NOT call `triggerAutoHandoff` directly. |
| `app/api/tasks/execute/route.ts` | Task execution route. Calls `executeTask`, then calls `triggerAutoHandoff` on success. The handoff fires HERE, not inside executeTask. |
| `app/api/agent-events/route.ts` | External BYOA webhook receiver. On `task_complete` event: finds agent's active task, marks it complete, calls `triggerAutoHandoff`. This is the real production path for external agents. |
| `app/api/agents/proxy/route.ts` | Internal proxy — calls Anthropic/Perplexity/OpenAI directly server-side for agents with a configured vendor. Also calls `triggerAutoHandoff` on success. |
| `lib/pipeline/autoHandoff.ts` | 10-step handoff pipeline: guard on `next_task_id + auto_execute` → CCF → checkpoint → handoff record → queue Task B → executeTask. |
| `app/api/tasks/chain/route.ts` | Wires `next_task_id` + `auto_execute` on Task A before dispatch fires. Must be called BEFORE executeTask or autoHandoff exits at guard. |
| `app/api/dev/state/route.ts` | State inspector used by chain test to poll task + agent status. |
| `app/api/dev/reset/[action]/route.ts` | Nuclear reset used in `beforeEach`. |
| `lib/stores/useCommandStore.ts` | Client store — `routeAndExecute`, `handleDispatch`, `handleAutoExecute`; wires chain before calling `/api/tasks/execute`. |

---

## 3. Three Design Options

---

### Option A — New `/api/dev/mock-agent-complete` Route (Recommended)

**Mechanism:**

Add a new dev-gated route: `POST /api/dev/mock-agent-complete`

```
Body: { agent_id: string, workspace_id: string, mock_output: string }
Gate: requireDevAccess() (DEV_EMAILS env var, same as all /api/dev/* routes)
```

Logic:
1. Find the most recent task for `agent_id` in this workspace with `status IN ('active', 'failed')`
2. `UPDATE tasks SET status='complete', result=mock_output WHERE id=<task>`
3. Call `triggerAutoHandoff({ completedTaskId, workspaceId, vendorResponse: mock_output, supabase })`
4. Return `{ ok: true, task_id, handoff_triggered: true/false }`

Chain test modification (minimal):
```typescript
// After dispatch button click + badge-active confirm:
// Immediately trigger mock completion for Perplexity-Intel
await request.post('/api/dev/mock-agent-complete', {
  data: {
    agent_id: perplexityAgentId,
    workspace_id: workspaceId,
    mock_output: MOCK_PERPLEXITY_OUTPUT,
  }
});
// Then poll for Claude-Drafting to go active (autoHandoff fired) → complete
```

The `triggerAutoHandoff` inside the route fires naturally with the real pipeline:
context checkpoint written, agent_handoff record written, Task B queued → executeTask
fires Claude-Drafting for real (uses pooled Anthropic key, already proven working).

**Complexity:** S
- 1 new route file (~80 lines, mirrors `/api/dev/reset/[action]/route.ts` pattern)
- Minimal chain test modification (~15 lines)
- No changes to executeTask, autoHandoff, or production dispatch path

**Preserved behavior:**
- Production path untouched — no mock code in executeTask or autoHandoff
- Mock route is behind DEV_EMAILS gate; unreachable in production without that env var
- Claude-Drafting executes for real (Anthropic key, real output, real audit trail)

**Risk:** Low.
- Race condition: executeTask may still be running when mock-complete fires. Fix: test
  should wait for Task A `status === 'active'` (not just badge-active) before calling
  mock-complete. If executeTask finishes with `failed` before mock fires, the route's
  status filter `IN ('active', 'failed')` catches it.
- The mock marks a `failed` task as `complete` — acceptable in test context; dev reset
  in `beforeEach` cleans up.

---

### Option B — Seed Perplexity-Intel with Anthropic Vendor in Test

**Mechanism:**

Modify the seed fixture (or add a test-only seed variant) so "Perplexity-Intel"
is seeded with `vendor = "anthropic"` instead of `vendor = "perplexity"`.

Both agents (Perplexity-Intel + Claude-Drafting) then use the pooled Anthropic key.
The full chain runs end-to-end with zero mocking. executeTask succeeds for both.
autoHandoff fires naturally. Claude-Drafting gets real context. Test passes cleanly.

**Complexity:** S (even simpler than Option A)
- Modify `/api/seed-workspace-agents/route.ts` or the seed fixture
- Or: add `TEST_BYOA_VENDOR=anthropic` env var that the seed reads
- Zero changes to test logic, zero new routes

**Preserved behavior:**
- All pipeline code untouched
- Test exercises the FULL chain: dispatch → active → complete → autoHandoff → Claude

**Risk:** Low-Medium.
- **Loses BYOA fidelity**: the test no longer proves that the Perplexity routing path
  works. It proves the chain mechanics work with Anthropic×2, which is not the ICP case.
- "Perplexity-Intel" in the chain test is semantically misleading — the name implies
  a different vendor than the one executing.
- If a future Perplexity-specific bug (different response format, rate limit, payload
  size) appears, this test won't catch it.
- Acceptable for a build gate (mechanics proven), not acceptable for production cert.

---

### Option C — Two-Phase Chain Test (Decouple Dispatch from Handoff Proof)

**Mechanism:**

Split the current chain test into two scoped tests:

**Test C1 — Dispatch proof (existing, already green):**
Drives the Router UI, dispatches to a Claude-only agent, verifies task goes active →
complete. This is effectively what the smoke test already covers. No BYOA involved.

**Test C2 — Handoff proof (new, API-only):**
Does NOT drive the Router UI. Instead:
1. Creates Task A directly via Supabase (or `/api/tasks`) with `next_task_id = Task B`
   and `auto_execute = true`
2. Marks Task A complete directly (or via `/api/dev/mock-agent-complete` from Option A)
3. Calls `triggerAutoHandoff` indirectly (via the mock-complete route or a direct API call)
4. Polls until Claude-Drafting (Task B) reaches `complete`
5. Verifies agent_handoffs row written, context_checkpoints written, agents idle

This separates "does the dispatch work" from "does the handoff work" — cleaner test
boundaries, faster execution, easier debugging.

**Complexity:** M
- Requires Option A's mock-complete route as a dependency
- Requires refactoring the chain test into two specs
- Removes the UI-driven portion of the chain proof

**Preserved behavior:** All production code untouched. The Playwright test is restructured,
not the application.

**Risk:** Low.
- The UI-driven dispatch path is no longer tested end-to-end in this spec (it's covered
  by the smoke test). If someone breaks the Router's chain wiring, C2 wouldn't catch it
  (it bypasses the UI).
- Acceptable given the smoke test already covers dispatch mechanics.

---

## 4. Recommended Option

**Option A — `/api/dev/mock-agent-complete` route**, with Option C as the eventual
clean-room architecture post-gate.

**Reasoning:**

1. **Smallest surface, fastest path to chain test green.** One new route, ~15 line test
   change. Option A unblocks the chain test without restructuring test architecture or
   changing seed data.

2. **Tests the right thing.** autoHandoff, context_checkpoints, agent_handoffs records,
   and Claude-Drafting execution all run for real. The mock is only at the Perplexity
   execution boundary — everything downstream is live.

3. **Option B is tempting but semantically wrong.** Naming an agent "Perplexity-Intel"
   and backing it with Anthropic is a lie the test will eventually make you pay for.
   The first time a real customer has a Perplexity-specific problem, there's no test
   coverage for it.

4. **Option C is the right long-term design** (clean test boundaries) but it requires
   Option A's route as a building block anyway. Build A first, evolve to C post-gate.

**Gate timing:** Option A can ship in one focused session (~90 min):
- 30 min: new route + requireDevAccess wiring + TypeScript clean
- 30 min: chain test modification + local run
- 30 min: preflight + commit + push + Vercel verify

This is the right post-gate first build (260426 + unlock day).

---

## 5. Open Questions — Jason's Call Required Before Code

1. **Mock output content for Perplexity-Intel:**
   What should `MOCK_PERPLEXITY_OUTPUT` contain?
   - Minimal placeholder: `"[MOCK] Perplexity research complete for test chain."`
   - Realistic fixture: a real-looking CRM comparison table (matches task description)
   - *Why it matters:* autoHandoff's `truncateAtSentence` + `extractOpenQuestions` run
     on this string. Realistic output makes the context checkpoint more meaningful for
     the handoff to Claude-Drafting. The test verifies context carries — richer mock =
     stronger test signal.

2. **Race condition handling:**
   When the test calls mock-complete, `executeTask` may still be mid-flight trying
   Perplexity (and about to set `status: "failed"`). Two strategies:
   - **A) Poll for 'failed' first, then mock-complete** — safe, deterministic, adds ~2s
   - **B) Mock-complete route is idempotent** — if status is already 'complete', returns 200 no-op
   - Which do you want the test to use?

3. **Chain test location:**
   The chain test currently lives in `golden-path.spec.ts`. After Option A ships,
   should it stay there (as a second test in the suite, run with `--grep chain`) or
   move to a dedicated `e2e/chain.spec.ts`?
   - Staying in golden-path = single file for "the product works" proof
   - Separate file = easier to exclude from the 3-min smoke gate (smoke uses `--grep smoke`)
   - *Current setup already uses `--grep smoke` for the gate; chain test is already
     excluded from gate runs by the grep filter. Separate file = cleaner but not required.*

4. **Should the chain test be included in the 48h gate scheduler runs?**
   Chain test takes ~3-5 min (Claude-Drafting execution is real Anthropic). Gate
   scheduler has 10-min kill limit. Adding it to the scheduler would mean ~7-8 min
   per run — tight but within limit.
   - *Recommendation: keep chain test OUT of the scheduler gate. Gate = smoke only
     (11-18s). Chain test = separate manual verification step pre-deploy.*

5. **mock-agent-complete security posture:**
   The route must be gated behind `requireDevAccess()` (DEV_EMAILS). Confirm:
   Should it also require the `workspace_id` to match the authenticated user's workspace?
   (Yes — same pattern as all other /api/dev/* routes. Just confirming.)

---

*Authored via CC read-only recon 260425. No code changed. Ready for build post-gate-clear.*

---

## 5b. Jason's Answers — 260426

*Captured from [GL | GATE | 48h Smoke · Autogap Prep | 260424] thread.*

**Q1 — Mock output content → B: Realistic fixture (CRM comparison table matching test task description)**
Placeholder defeats the purpose. `truncateAtSentence` and `extractOpenQuestions` need real prose to operate
meaningfully — if Claude-Drafting receives `"[MOCK] research complete"` it has nothing to carry forward.
Fixture proves handoff is functional, not just structural.
- Store fixture in a separate file: `e2e/fixtures/perplexity-intel-mock-output.md` — editable without touching
  the test or route; easier to swap content shapes later
- Cap: 2000 words max. Big enough to exercise truncation logic, small enough to commit without git bloat.

**Q2 — Race condition handling → A: Poll for `status === 'failed'` first, then mock-complete**
Determinism beats idempotency in test code. When the chain test eventually flakes, you want to know the
exact system state — idempotent route logic is clever but harder to debug. Polling is already the Playwright
pattern everywhere else in the suite (`expect.poll`, `waitForResponse`).
- Tweak: poll with explicit 30s max timeout. If executeTask hasn't marked failed by then, something else is
  wrong — surface a clean test failure, not a hang.

**Q3 — Chain test file location → Move to dedicated `e2e/chain.spec.ts`**
`--grep chain` is fragile — rename one test and the filter silently breaks, smoke run accidentally includes
chain. File-based exclusion is robust. The smoke vs chain distinction is a meaningful architectural boundary
(code-stability gate vs infrastructure-stability validation); file separation makes it visible.
Cost: ~5 min during the build. Do it now while the surface is open.

**Q4 — Chain test in scheduler → Out of scheduler, confirming CC recommendation**
Scheduler is the code-stability gate. Chain test is infrastructure-stability validation. Different purposes,
different SLAs.
- 7–8 min/run × 8 runs = ~60 min of compute + real Anthropic token spend per gate window. Wrong SLA.
- **When chain test SHOULD run:**
  1. Manually before any deploy touching `lib/pipeline/`, `app/api/agents/proxy/`, or chain-related files
  2. Once weekly as a "chain still working" sanity check
  3. After any Slot 1+2 finding gets fixed and the fix is deployed

**Q5 — security posture → Yes, workspace_id must match authenticated user's workspace**
Every other `/api/dev/*` route enforces workspace ownership. Pattern consistency matters — unprincipled
exceptions become the source of future bugs. DEV_EMAILS gate being small (2 emails) doesn't change the
principle.
- Reuse the established helper used by `/api/dev/state` and `/api/dev/reset` — do NOT write a new check.

---

## 6. Naming Clarification (Locked 260426)

**"Slot 2" in this thread = mock BYOA webhook layer (chain test blockage).**
autoHandoff collapse (commit 78b078d) is SHIPPED — that is a separate autogap queue item. The chain test
blockage is the outstanding work this doc addresses. Future sessions: do not conflate these two items.

---

## 7. Sunday 260426 Track Plan (Updated)

| Track | Work | Est. Time | Sequenced When |
|-------|------|-----------|----------------|
| 1 | Slots 1+2 manual verification (button click → DB confirm) | 90 min | After Run 8 GREEN |
| 2 | Slot 3 credit hooks (token-based) | 3–5 hrs | After Track 1 |
| 3 | F5 rewrite (J2 against current /send-task UI) | 60 min | Parallel CC during Track 2 |
| **3.5** | **Option A build: `/api/dev/mock-agent-complete` + chain test** | **~90 min** | **Sequential after Track 2** |
| 4 | Brain hygiene + sync Action repair | 30 min | End of Sunday |

Track 3.5 inserted per Q&A lockdown. If Sunday runs long, Track 3.5 slips to Monday — Q&A is captured
regardless. Chain test verified-working target: 260427 morning (pre-Eric invite).

*Q&A appended 260426. Build-ready for Track 3.5.*
