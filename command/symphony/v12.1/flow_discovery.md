# flow_discovery.md — Two-step dispatch + handoff chain architecture
[EVIDENCE] — archive after 90 days
Discovered: 2026-04-20
Method: Source-code archaeology (app/router/page.tsx, lib/pipeline/routerExecution.ts, lib/pipeline/executeTask.ts) validated against v12 network capture (J5 harness re-run confirms production deploy).

---

## Entry surface

`/router` (client component, app/router/page.tsx, ~3053 lines) renders a single-column task composer:
- **Textarea** — `placeholder="What do you need done"`, stores `taskInput`.
- **Route-to dropdown** (`routeTo` state, default `"auto"`) — controls whether a recommendation is fetched.
- **Handoff-to dropdown** (`handoffTo` state, default empty) — optional; when set, a chained task is auto-generated on Agent A completion.
- **Priority dropdown** — `normal` default.
- **Two buttons** visible simultaneously before any recommendation:
  - `Auto-select agent` — visible only when `routeTo === "auto"`. Fires Step 1.
  - `Send Task` — visible only when `!recommendation`. Fires direct dispatch (bypasses Step 1, goes straight to dispatch).

> ⚠️ **v12 test artifact correction**: The v12 J2_handoff.spec.ts locator `button:has-text("Send Task"), button:has-text("Auto-select agent")` matches the **first** in DOM order, which is `Auto-select agent`. So the v12 run DID trigger Step 1 — not direct dispatch. The single `/api/route-task` call in `J2_P2_network.json` is Step 1's fingerprint. Step 2 either never ran or ran but the 15-second timeout cut the capture before Agent A responded.

---

## Step 1 — Recommendation (client → server → client)

**Trigger**: user clicks `Auto-select agent` → `handleGetRecommendation()` (app/router/page.tsx:~1288).

**Wire**: single `POST /api/route-task` with body:
```json
{
  "workspace_id": "<uuid>",
  "task_description": "<textarea>",
  "task_type": "research|build|plan|null"
}
```

**Response**: `RouterRecommendation` object:
```ts
{
  recommended_agent_id: string | null,
  recommended_agent_name: string,
  confidence: "high" | "medium" | "low",
  confidence_score: number,        // 0–100
  reason: string,                  // rationale
  alternatives: [{ agent_id, agent_name, score }],
  all_agents_unavailable: boolean
}
```

**Branch**:
- `confidence_score >= AUTO_EXECUTE_THRESHOLD` (const — currently 70 based on UI) AND agent available → **auto-fires Step 2** via `handleAutoExecute(rec)`. No user click required.
- Low confidence → `RecommendationPanel` renders; user must manually click dispatch.

---

## Step 2 — Dispatch + Execute (high-confidence auto-execute path)

Triggered inside `handleAutoExecute` (app/router/page.tsx:1501). Five phases:

### 2a. `autoExecPhase = "dispatching"`
- `dispatchTask(description, agentId, priority, title, handoffTo)` — `lib/store.ts:~1160` fires `POST /api/tasks/dispatch`:
  ```json
  {
    "workspace_id": "<uuid>",
    "agent_id": "<uuid>",
    "title": "<auto-or-override>",
    "description": "<textarea>",
    "priority": "normal",
    "handoff_to_agent_id": "<uuid-or-null>"
  }
  ```
  Returns `{ ok: true, taskId: "<uuid>" }`.

### 2b. `autoExecPhase = "countdown"` — `CountdownOverlay`
- 4-second override window (`OVERRIDE_WINDOW_MS`) during which user can cancel.
- `routeAndExecute()` (lib/pipeline/routerExecution.ts:125) polls `overrideSignal.cancelled` every 100ms.
- Writes `routing_auto_queued` audit row to Supabase.

### 2c. `autoExecPhase = "executing"` — `ExecutingState`
- Override window expired → `executeAndReturn` → `executeTask({taskId, agentId, workspaceId, supabase})`.
- `executeTask` (lib/pipeline/executeTask.ts) runs **in the browser context** (BYOA — user's Anthropic/OpenAI/Perplexity keys live in Supabase agents.api_key column, fetched client-side, used in direct browser → vendor fetch).
- **External fetch fires direct from browser**:
  - Anthropic: `POST https://api.anthropic.com/v1/messages` (claude-3-5-sonnet-20241022, max_tokens 4096, 30s AbortController timeout)
  - OpenAI: `POST https://api.openai.com/v1/chat/completions` (gpt-4o)
  - Perplexity: `POST https://api.perplexity.ai/chat/completions` (llama-3.1-sonar-large-128k-online)
- Response `content[0].text` (Anthropic) / `choices[0].message.content` (OpenAI/PPLX) = Agent A output.
- Output persisted to Supabase `agent_executions` + `agent_outputs` tables via `executeAndReturn`'s side effects.

### 2d. `autoExecPhase = "complete"` — result card
- `DispatchBrief` renders with Agent A name, rationale, output preview.
- **If `handoffTo` was set** at dispatch time, the server-side autoHandoff pipeline (lib/pipeline/autoHandoff.ts) generates a chained task containing Agent A's output as structured context. The chained task fires the same execute pipeline for Agent B — producing a second browser → vendor POST.

### 2e. Handoff task polling (v12.1 harness insight)
- The chained task may not appear instantly. The router page polls Supabase `tasks` table via Realtime subscription; the chained task with `handoff_from_task_id=<A>` appears after autoHandoff writes it. Agent B's execute fires as soon as the chained task status = "queued" + autoExec eligibility.
- End-to-end chain (Agent A → handoff → Agent B complete) typically takes **40–75s** in production. 90s ceiling recommended.

---

## Network signature — what Playwright captures

`beginCapture(page)` hooks `page.on("request"|"response")` — this captures **all** browser-originated requests including cross-origin (`api.anthropic.com`). Body cap is 10KB per request/response.

**Expected capture for P2 Eric J2 DEEP (full chain)**:

| # | URL | Method | Purpose |
|---|-----|--------|---------|
| 1 | `/api/route-task` | POST | Step 1 recommendation |
| 2 | `/api/tasks/dispatch` | POST | Step 2a task creation |
| 3 | `https://api.anthropic.com/v1/messages` (or openai/perplexity) | POST | **Agent A execution** |
| 4 | `/api/tasks/dispatch` | POST | Step 2e handoff task creation (server-side may skip and write direct to DB) |
| 5 | `https://api.anthropic.com/v1/messages` (or other vendor) | POST | **Agent B execution** |
| + | Various Supabase `/rest/v1/*` polls | GET/POST | Task status polling |

Calls 3 and 5 are the C3 witnesses. Substring test: Agent A `content[0].text` → Agent B `messages[0].content` (user role) or `system` prompt must share ≥20 contiguous chars AND Agent B output must reference ≥2 named entities from Agent A output.

---

## ⚠️ UI REDESIGN DISCOVERED (2026-04-20, post-rerun)

The source-code archaeology above describes the v12-era `/router` UI
(Auto-select agent button + CountdownOverlay + LowConfidencePanel). The
**production `/send-task` UI** captured in screenshots J2_*_deep_03_routed.png
shows a **different, simpler design:**

- Heading: "Send a task"
- Side-nav entry: "Send a Task"
- Buttons visible: CLEAR | ✦ REFINE TASK | …ANALYZING (spinner state) | ▶ Send Task
- Inline status: `Best match → <AgentName>` displayed after `/api/route-task` returns
- Dropdowns: TASK TYPE, PRIORITY, ASSIGN TO (default "Auto (recommended)"), THEN SEND TO
- NO visible "Auto-select agent" button, NO countdown overlay, NO
  LowConfidencePanel with per-candidate Execute buttons.

**Implication:** The two-step flow is still conceptually two-step
(`/api/route-task` fires on analyze, then the user clicks `▶ Send Task` to
dispatch), but the UI labels and components differ from the source tree. The
v12.1 harness was written against the older source-code paths and could not
exercise the new flow end-to-end. Both J2 DEEP probes captured only the
`/api/route-task` POST; no `/api/tasks/dispatch` or direct vendor call fired
because the test never clicked `▶ Send Task`.

**C3 DEEP probe verdict (both personas): INCONCLUSIVE — harness could not
exercise the current UI.** Per v12.1 doctrine (C3 categorical), this is a
legitimate outcome. The C3 claim remains unverified in v12.1, not FAILED.

**v12.2 remediation (not in scope here):** Rewrite
`J2_handoff_deep.spec.ts` against the live `/send-task` UI — locate and click
`▶ Send Task` after analysis, poll for execute completion, capture vendor
POSTs from there.

---

## Known UX observations (from Jason's browser walk 2026-04-20)

These feed Finding F3 (slow-load / silent loading state):

- Side navigation collapsible sections (`Settings`, `Integrations`) load visibly slowly — user reports perceptible delay expanding the nav group.
- `/overview` page (money counter / usage meter) loads slowly with no intermediate skeleton or spinner — appears silent/blank during data fetch.
- Applies on both Pilot/Free and likely all tiers.
- Severity: MINOR (UX polish) but noticed on first impression — ship-soon, not ship-blocker.

---

## Test implementation plan — J2_handoff_deep.spec.ts

- DO NOT modify frozen `J2_handoff.spec.ts`.
- Create sibling spec `J2_handoff_deep.spec.ts` that:
  1. Covers P2 Eric and P3 Danielle only (DEEP iteration).
  2. Begins network capture before navigating to /router.
  3. Fills textarea with persona's J2 prompt.
  4. **Sets `handoffTo` dropdown** to a second configured agent (select by id, not by display index — fetch from fixtures/personas or the workspace's live agent roster).
  5. Clicks `Auto-select agent` button.
  6. Polls the page up to 90 seconds for `autoExecPhase === "complete"` OR for the appearance of a handoff task card with `handoff_from_task_id` set.
  7. Ends capture.
  8. Filters captures: isolates calls 1, 2, and both agent-vendor POSTs (3 and 5).
  9. C3 assertion: For each sequential agent pair (3→5), require shared ≥20 char substring and ≥2 entity references (regex-extracted proper nouns, numbers, or dates of length ≥3).
  10. Writes `artifacts/v121_run/J2_${persona}_network_deep.json`, `J2_${persona}_result_deep.json`, and screenshot pairs at each boundary.

Non-P2/P3 personas are NOT re-run in v12.1 — their v12 PASS (shallow) is rescored to NOT_TESTED in the v12.1 matrix per patterns doctrine.
