# Canvas No-op → autoHandoff Recon
# [PERSISTENT] — gl-brain/command/autogap/canvas-noop-handoff.md
# GlobaLink LLC | COMMAND Platform
# Authored: 260425 via CC read-only recon (command-app, no code changes)

---

## 1. Current Behavior — What Happens When a Canvas Step Completes

There are two execution paths. Neither triggers `autoHandoff`.

### Path A — Manual checklist (user-driven)

1. User opens a step's `StepDetailSidebar`, pastes output, clicks "Mark Complete"
2. `completeStep(stepId, output)` in `canvas-store.ts` updates local state:
   - Marks step → `complete`, next pending step → `active`
   - Closes sidebar, advances `activeStepId`
3. Background `PATCH /api/canvas/step/:id` persists the status to `canvas_steps`
4. `PATCH` route (`app/api/canvas/step/[id]/route.ts`) also advances the next pending step to `active` in DB
5. If all steps are `complete`/`skipped`, `canvas_workflows.status = "complete"` and `CompletionPanel` renders "Mission Complete"
6. **No autoHandoff. No Router task created. Workflow terminates.**

### Path B — Automated execution (runWorkflow)

1. User clicks "Run All" → `runWorkflow(workflowId, workspaceId)` in `canvas-store.ts`
2. Store validates all steps have `agent_id`, then loops sequentially
3. For each step: `POST /api/canvas/execute-step` → `executeCanvasStep()` → `executeTask()`
4. `executeTask` runs the agent, updates `tasks.status = "complete"`, writes `audit_ledger`
5. **`triggerAutoHandoff` is NOT called.** `autoHandoff` is only called by:
   - `/api/tasks/execute/route.ts` (Router dispatch path)
   - `/api/agent-events/route.ts` (external BYOA webhook)
   - `/api/agents/proxy/route.ts` (internal proxy path)
   — `canvasExecution.ts` calls none of these
6. `executeCanvasStep` marks `canvas_steps.execution_status = "complete"`, returns output
7. Store loop moves to next step
8. On last step: if all `execution_status ∈ {complete, skipped}`, API returns `workflow_complete: true`
9. Store sets `workflowExecState = "complete"`, `workflow.status = "complete"`
10. `CompletionPanel` renders. User can "Package deliverable" (clipboard markdown) or "Save as Template"
11. **No handoff. No Router task. No output forwarded to next agent.**

### The No-op Explained

Canvas tasks are created by `executeCanvasStep` **without** `next_task_id`, `auto_execute`, or `chain_id`:

```typescript
// canvasExecution.ts:73–85 — task insert
await db.from("tasks").insert({
  id: taskId,
  workspace_id: step.workspace_id,
  agent_id: step.agent_id,
  title: step.title,
  description: step.description ?? step.title,
  status: "active",
  // ← no next_task_id
  // ← no auto_execute
  // ← no chain_id
  created_at: now,
  updated_at: now,
});
```

Even if `triggerAutoHandoff` were called, it exits immediately at Step 2 (`next_task_id === null`). The no-op is structural — Canvas and the Router are two separate execution silos with no bridge at completion.

---

## 2. Root Files Involved

| File | Role |
|---|---|
| `lib/stores/canvas-store.ts` | Client Zustand store — owns `runWorkflow` loop, step state, `completeStep` optimistic update |
| `lib/pipeline/canvasExecution.ts` | Server engine — `executeCanvasStep` (single step via `executeTask`), `runCanvasWorkflow` (server-to-server sequential loop) |
| `lib/pipeline/autoHandoff.ts` | Pipeline handoff engine — compiles CCF, writes checkpoint, queues + auto-fires next task; **never called from canvas path** |
| `app/api/canvas/execute-step/route.ts` | POST endpoint — auth, rate limit, plan gate, fetches step, calls `executeCanvasStep`, checks `workflow_complete` |
| `app/api/canvas/step/[id]/route.ts` | PATCH endpoint — manual step completion; advances next step to `active`; updates `canvas_workflows.status` |
| `app/api/tasks/execute/route.ts` | Router task execution endpoint — calls `executeTask` then `triggerAutoHandoff`; **not used by canvas** |
| `app/api/agent-events/route.ts` | External BYOA webhook — calls `triggerAutoHandoff` on `task_complete` events; **not used by canvas** |
| `components/canvas/CompletionPanel.tsx` | Workflow complete UI — "Mission Complete", package deliverable (clipboard), save template, new mission |
| `components/canvas/PipelineView.tsx` | Pipeline UI — renders step nodes, "Run All" button that triggers `runWorkflow` |
| `components/canvas/StepDetailSidebar.tsx` | Per-step sidebar — manual output entry, calls `completeStep` |
| `app/canvas/page.tsx` | Canvas page — auth guard, renders `TaskInputPanel`, `PipelineView`, or `CompletionPanel` based on `viewState` |
| `app/router/page.tsx` | Router page — THEN SEND TO dropdown (lines 2262–2268), `next_task_id` wiring (lines 1522–1529, 1678–1685) |

---

## 3. Three Design Options

---

### Option A — Workflow-level "Dispatch When Complete" (new `post_dispatch_agent_id` column)

**Mechanism:**
- Add `post_dispatch_agent_id TEXT NULL` to `canvas_workflows` table (1 migration)
- Add a "When complete, send to..." dropdown to `TaskInputPanel` (workflow creation) or `PipelineView` header
- When `runWorkflow` detects `workflow_complete = true`: if `post_dispatch_agent_id` is set, call a new route `POST /api/canvas/dispatch-result` that:
  1. Packages all step `execution_output` values into a structured context block
  2. Creates a new `tasks` row for the target agent
  3. Calls `POST /api/tasks/execute` → this triggers `triggerAutoHandoff` (with no `next_task_id` on the dispatch task, so autoHandoff exits immediately, but the task executes)
- Alternatively: the dispatch creates the task and marks it `queued`, leaving it for the user to review and manually dispatch

**Complexity:** M
- 1 DB migration (new nullable column, no FK risk)
- 1 new API route
- UI changes to `TaskInputPanel` + `PipelineView`
- Store change to read `post_dispatch_agent_id` and call dispatch on complete

**Preserved behavior:** All existing canvas flows (manual checklist, automated execution, templates) unchanged. New field is nullable — existing workflows unaffected.

**Risk:** Low. Purely additive. The dispatch step can fail silently without breaking the canvas workflow. No modification to the execution critical path.

---

### Option B — Last-step THEN SEND TO (per-step, mirrors Router)

**Mechanism:**
- Add `handoff_agent_id TEXT NULL` to `canvas_steps` for the terminal step only
- In `executeCanvasStep`: if this is the last step AND `step.handoff_agent_id` is set:
  1. Pre-create a Router task for the target agent (`tasks` insert with `status: "queued"`)
  2. Call `triggerAutoHandoff` with the completed canvas task ID and the pre-created Router task as `next_task_id`
  3. `triggerAutoHandoff` then compiles CCF, writes checkpoint, and auto-fires the Router task
- This reuses the full CCF machinery (context checkpoint, agent_handoff record, audit trail)

**Complexity:** M-L
- 1 DB migration (new column on `canvas_steps`)
- Modify `executeCanvasStep` to accept workflow metadata (to know if this is the last step)
- Pre-create Router task before calling `triggerAutoHandoff` (requires knowing `next_task_id` upfront)
- UI: per-step `handoff_agent_id` selector in `StepDetailSidebar` or `PipelineView`
- Risk of scope creep: which step is "last"? What if user reorders steps?

**Preserved behavior:** All existing steps with `handoff_agent_id = null` behave identically. Only the last configured step changes.

**Risk:** Medium. Touches `executeCanvasStep` (execution critical path). Pre-creating the Router task before the canvas step completes creates a dangling task if the step fails. Requires careful cleanup.

---

### Option C — Client-side Canvas→Router Bridge (store-only dispatch)

**Mechanism:**
- Add `post_dispatch_agent_id` to workflow state in the store (no new DB column required initially — could use a transient store field or `localStorage`)
- When `runWorkflow` detects `workflow_complete = true` and a dispatch agent is configured:
  1. Package outputs (same logic as `CompletionPanel.handlePackageDeliverable` but automated)
  2. `POST /api/tasks` → create a new task with the packaged output as `description`
  3. `POST /api/tasks/execute` → dispatch the task to the configured agent
- The Router task then appears in the agent's queue and executes normally

**Complexity:** S
- No DB migration (initially)
- No new API routes — reuses `/api/tasks` and `/api/tasks/execute`
- Store change only: add `postDispatchAgentId` field, handle dispatch on completion
- UI: simple "When done, send to..." select in `TaskInputPanel`

**Preserved behavior:** Canvas execution path unchanged. Dispatch happens client-side after workflow completes — can't partially corrupt a canvas run. If dispatch fails, canvas still shows "Mission Complete".

**Risk:** Low-Medium. Client-side dispatch can fail silently (network drop after completion). No CCF context checkpoint generated (loses the structured handoff record). Output quality depends on how the package is formatted (no semantic truncation or open-question extraction that `triggerAutoHandoff` provides).

---

## 4. Recommended Option

**Option A — Workflow-level Dispatch When Complete.**

Reasoning:
- **Additive, not invasive.** One migration, one new route, no changes to `executeCanvasStep` or `autoHandoff`. The execution critical path stays untouched.
- **Server-side dispatch is durable.** Client-side (Option C) drops on page close. Server-side persists.
- **Scope is right for the gate window.** Option B requires pre-creating Router tasks and handling failure cleanup — more moving parts than the problem warrants at Phase 2.6.
- **Output quality.** The dispatch route can use the existing `truncateAtSentence` + `extractOpenQuestions` logic from `autoHandoff` to package canvas output properly, rather than a raw string dump.
- **The "THEN SEND TO" mental model Jason already knows** from the Router transfers directly — one dropdown, same UX pattern.

If timeline is tight, **Option C** is the acceptable short-ship: no migration, zero backend risk, ships in one store commit. Trade-off is no CCF record and client-side fragility.

Option B is overkill for the autogap queue. Defer to Phase 4 (Canvas Full Execution Engine revival) if multi-step per-step handoffs become necessary.

---

## 5. Open Questions — Jason's Call Required Before Code

1. **What should trigger the post-workflow dispatch?**
   - Auto-dispatch immediately when last step completes (no user action)?
   - Or: "Mission Complete" screen shows a "Send to [Agent]" confirm button (user reviews before dispatch)?
   - *Recommendation:* confirm button — avoids auto-firing a Router task against a failed/partial canvas run.

2. **What is the input to the dispatched Router task?**
   - All step `execution_output` values concatenated?
   - Only the last step's output?
   - A structured summary (title + outputs)?
   - *This determines what the downstream agent receives as its task description.*

3. **Does the dispatched Router task auto-execute (fire immediately) or land queued?**
   - Auto-execute = immediate; task shows up in dashboard as active
   - Queued = user reviews in Router before firing
   - *If auto-execute: which agent processes it? The `post_dispatch_agent_id` must be a live, api_key-provisioned agent.*

4. **Should the dispatch be a full `triggerAutoHandoff` (CCF + context_checkpoint) or a simple task create?**
   - Full autoHandoff: generates `context_checkpoints`, `agent_handoffs` record, `auto_handoff_triggered` audit event
   - Simple task create: lighter, no CCF overhead, downstream agent gets raw text
   - *The answer determines whether canvas workflows appear in the audit trail as handoffs.*

5. **Credit gate:** If the dispatched task auto-executes and hits `checkPlanGate`, what happens to the canvas workflow status? Should the workflow still show "Mission Complete" even if the downstream dispatch is blocked?

6. **Does this ship with the autogap gate unlock (260426) or is it a Phase 3 item?**
   - Option C (store-only) could ship within the gate window
   - Option A requires a migration (PENDING_ACTIONS row) and a new route — realistic in a focused build session post-gate

---

*Authored via CC read-only recon 260425. No code changed. Ready for build decision.*
