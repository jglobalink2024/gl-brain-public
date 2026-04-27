# Slots 1 + 2 -- Verification Status
# [PERSISTENT]
# Verified: 260425
# Source: code-read + test file audit against command-app current HEAD

---

## Slot 1 -- Canvas "Run in [Agent]" Button

### Autogap diagnosis (260423): STALE

Original diagnosis said: "dead no-op `() => {}` in Canvas step sidebar".
This was accurate as of the COMMAND_CanvasExecution_v1.md audit (260413),
which explicitly documented C1 CRITICAL: "onClick: () => {}" at
StepDetailSidebar.tsx:551.

### Current code status: WIRED

`components/canvas/StepDetailSidebar.tsx:568-605` -- button now calls:
```typescript
onClick={() => {
  fetch("/api/canvas/execute-step", {
    method: "POST",
    body: JSON.stringify({ step_id, workflow_id, workspace_id })
  })
  .then(async (r) => { ... setStepOutput(data.output) })
  .catch(() => setStepError("Network error..."))
}}
```

`app/api/canvas/execute-step/route.ts` -- fully implemented:
auth -> rate limit (10/min) -> plan gate -> double-execution guard (409) ->
`executeCanvasStep` -> workflow completion check -> `writeLedgerEntry`.

`lib/pipeline/canvasExecution.ts` -- full execution engine:
agent lookup -> api_key check -> task insert -> `executeTask` -> step status
update (running -> complete/failed) -> ledger entry on failure.

### Test evidence: MISSING -- SHIPPED BUT UNVERIFIED

`e2e/canvas.spec.ts` tests:
- canvas route loads (textarea visible)
- ghost text rotates
- Run Workflow button triggers decomposition
- pipeline renders with step nodes after decomposition

None of these tests click "Run in [Agent]" on a step with an assigned agent
and verify execution. The execute-step API path has zero Playwright coverage.

**Verdict: SHIPPED BUT UNVERIFIED**
The wiring is present in code. No browser test proves the button -> API ->
executeTask chain works end-to-end in a live session. This is a post-gate
manual test requirement before any client demo involving canvas.

**Manual test needed:**
1. Create a workflow with an assigned agent
2. Open StepDetailSidebar for a step
3. Click "Run in [Agent Name]"
4. Verify step output appears and execution_status = "complete" in DB

---

## Slot 2 -- autoHandoff Collapse

### Autogap diagnosis (260423): STALE

Original diagnosis said: "delete 2 private copies in api/agents/proxy/route.ts,
route all chains through lib/pipeline/autoHandoff.ts".

### Current code status: SHIPPED

`git log --oneline -- lib/pipeline/autoHandoff.ts`: commit `78b078d`
"refactor: collapse autoHandoff forks + audit_ledger single writer"

`lib/pipeline/autoHandoff.ts` -- single canonical implementation:
- 10-step pipeline: fetch completed task -> guard -> fetch next task ->
  CCF payload -> context checkpoint -> agent_handoff insert -> queue next
  task -> advance chain counter -> audit event -> executeTask auto-fire
- `checkPlanGate` guard before auto-fire (HOLE 1.4)
- Self-handoff guard (FIX 11): skips CCF ceremony when source == target agent
- Single writer to audit_ledger via `writeLedgerEntry`

No private copies found in `app/api/agents/proxy/route.ts` or elsewhere.
`Grep("triggerAutoHandoff", src/)` confirms single import path.

### Test evidence: INCONCLUSIVE -- SHIPPED BUT UNVERIFIED

`e2e/symphony_v12/journeys/J2_handoff_deep.spec.ts` exists and is specifically
designed to test autoHandoff C3 (crown-jewel claim: Agent A output carried
into Agent B input). The spec uses:
- Network capture of vendor API calls
- Shared-substring check (>=20 chars of Agent A output in Agent B input)
- Entity-carry check (>=2 Agent A entities appear in Agent B output)

**Symphony v12 verdict on J2:** INCONCLUSIVE on both P2 Eric and P3 Danielle (v12.1).
Root cause fully diagnosed and fixed in v12.2 (commit 49ff1a0, 260427):

**3 bugs found:**
1. Wrong URL filter — `isAgentVendorCall` checked vendor URLs (server-side for pooled keys). Fixed to `isAgentExecutionCall` matching `/api/tasks/execute` (always browser-visible).
2. Wrong UI surface — "Auto-select agent" went through `routeAndExecute` (client-side) which does NOT call `triggerAutoHandoff`. Fixed to "▶ Send Task" → TaskBriefCard → "▶ Run with" → HTTP endpoint (triggers Agent B server-side).
3. Wrong completion signals — polled for "handoff from"/"chained" text. Fixed to `page.waitForResponse` on `/api/tasks/execute`.

**Architecture insight:** `next_task_id` in the execute response = proof handoff triggered. Entity carry-through is BLOCKED (always server-side), correctly marked BLOCKED not INCONCLUSIVE.

**Verdict: SPEC FIXED — v12.2 SHIPPED (commit 49ff1a0)**
The spec will now correctly exercise the chain and produce PASS or FAIL (not INCONCLUSIVE). Run `npx playwright test e2e/symphony_v12/journeys/J2_handoff_deep.spec.ts` to confirm live verdict.

**Manual test still recommended:**
1. Route a task with handoffTo agent selected
2. Execute Agent A via "▶ Run with {agent}" 
3. Confirm `next_task_id` in response + `agent_handoffs` row written with correct CCF payload

---

## Summary Table

| Slot | Code Status | Test Evidence | Verdict |
|------|-------------|--------------|---------|
| 1 -- Canvas "Run in Agent" button | WIRED (StepDetailSidebar:568, execute-step/route.ts) | NONE -- canvas.spec.ts covers decomp only | SHIPPED BUT UNVERIFIED |
| 2 -- autoHandoff collapse | SHIPPED (78b078d, single canonical implementation) | J2 v12.2 spec fixed (49ff1a0) — run to confirm live verdict | SPEC FIXED, RUN PENDING |
| 3 -- Credit lifecycle hooks | PARTIAL (task-count gate exists; credit module missing) | credit_balance_check.spec.ts checks Anthropic balance, not hooks | NOT IMPLEMENTED |

---

## Post-Gate Manual Test Queue

These must be done before marking autogap Slots 1-2 as VERIFIED:

- [ ] CANVAS: Click "Run in [Agent]" on a step with an assigned agent ->
      verify output appears in sidebar + DB execution_status = "complete"
- [ ] HANDOFF: Route a task with handoffTo set -> execute -> confirm Agent B
      receives Agent A context (check agent_handoffs row + task execution)
- [x] HANDOFF: J2_handoff_deep.spec.ts v12.2 rewritten (49ff1a0, 260427). 3 root-cause
      bugs fixed. Run the spec to get live PASS/FAIL verdict.
- [ ] HANDOFF: Run `npx playwright test e2e/symphony_v12/journeys/J2_handoff_deep.spec.ts`
      and confirm PASS (not INCONCLUSIVE) before marking Slot 2 VERIFIED
