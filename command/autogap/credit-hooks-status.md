# Slot 3 -- Credit Lifecycle Hooks Status
# [PERSISTENT]
# Verified: 260425
# Source: code-read against command-app commit 69d1f5d (current HEAD at gate-status.md run 4)

---

## 1. STATUS: PARTIALLY IMPLEMENTED

A task-count gate exists for free/trial plans. The credits infrastructure
(starter_credits_used column, credit-hooks.ts module, beforeLLMCall/afterLLMCall
wrappers) is scaffolded at the DB layer but has zero application-layer wiring.

No token-based or cost-based credit accounting exists anywhere in the codebase.

---

## 2. EVIDENCE

### Pre-call: check workspace.starter_credits_used vs plan limit
**MISSING**

`starter_credits_used` column exists in `workspaces` table (confirmed via
`dev_nuclear_reset` SQL which sets it to 0), but no application code reads it.
`checkPlanGate` (`lib/billing/planGate.ts:101`) checks `task_executions` COUNT
per month -- a different mechanism, not the credits column.

### Pre-call: deny request if over limit (return 402 or similar)
**PARTIAL -- task-count gate only, free/trial only**

`lib/billing/planGate.ts:101-119`:
```
feature === "execute_task" + plan === "free" || "trial"
  -> counts task_executions WHERE workspace_id + created_at >= monthStart
  -> if count >= limit: return { allowed: false, reason: "monthly_task_limit_reached", upgradeRequired: "pro" }
```
Callers return HTTP 403 (not 402). Free: 10 tasks/mo. Trial: 50 tasks/mo.
Solo, pro, founding_member, studio, agency: NO limit check (unlimited).

`starter_credits_used` is never read in this gate or anywhere else.

### Post-call: increment starter_credits_used by N
**MISSING**

`lib/pipeline/executeTask.ts:851-873` inserts a `task_executions` row with
`tokens_used` populated (sum of input + output tokens from vendor response).
But `workspaces.starter_credits_used` is never incremented -- not in
executeTask, not in canvasExecution, not in autoHandoff, not in pitch/route.

### Post-call: audit ledger entry with cost attribution
**PARTIAL -- entry exists, cost always null**

`executeTask.ts:877-903` writes audit_ledger event_type="task_executed" with:
- `description`: "vendor=anthropic model=claude-sonnet-4-5 tokens=N duration=Xms"
- `cost: null` -- explicitly set to null, never populated

Tokens are in the description string but not in a typed field. No dollar amount
or credit-unit amount is ever computed or stored.

### Reset: nuclear reset zeros credits
**EXISTS**

`supabase/migrations/20260424b_dev_admin_rpcs.sql:113-117`:
```sql
UPDATE public.workspaces
   SET starter_credits_used = 0,
       updated_at = now()
 WHERE id = p_wid;
```
This is the ONLY place `starter_credits_used` is touched by any code.

### Plan gating: free vs pro vs FM behaves differently
**EXISTS via task-count, NOT via credits**

`planGate.ts:13-19` PLAN_LIMITS table:
```
free:            { tasks_per_month: 10  }
trial:           { tasks_per_month: 50  }
solo:            { tasks_per_month: 50  } -- same as trial
founding_member: { tasks_per_month: 500 }
pro:             { tasks_per_month: 500 }
studio/agency:   { tasks_per_month: 9999 } -- effectively unlimited
```
Only free and trial plans are actually CHECKED (`planGate.ts:102-103`):
`const freeOrTrial = plan === "free" || plan === "trial";`
All other plans skip the count check and return `{ allowed: true }` immediately.

---

## 3. UNIT QUESTIONS

**What is the increment unit for starter_credits_used?**

UNKNOWN. The column exists and is reset to 0 on nuclear, but is never
incremented anywhere in application code. No migration or comment defines
the unit. Candidates based on codebase patterns:

- Tasks (integer count) -- consistent with current planGate implementation
- Tokens (integer from vendor responses) -- executeTask captures tokensUsed
- Vendor-cost-cents (float) -- no cost computation exists anywhere

The TODO comment in `pitch/route.ts:2-5` says:
"When workspace has no own keys, use selectModel() to pick model, check
credits.remaining > 0, and call afterLLMCall() with usage tokens after
stream completes to deduct cost."

This implies the INTENDED unit is tokens (or cost derived from tokens),
but `selectModel()` and `credit-hooks.ts` do not exist.

**Is lib/credit-hooks.ts built?**

NO. `Glob('lib/credit*')` returns no files. The module is referenced in
a TODO comment but has never been created.

---

## 4. ICP RISK

**Scenario:** Eric (P2 persona, boutique consulting founder, likely trial or
early paid plan) hits the task execution limit.

**Current behavior by plan:**

| Plan | Task limit | What happens at limit |
|------|-----------|----------------------|
| free | 10/mo | HTTP 403, upgrade_required: "pro" |
| trial | 50/mo | HTTP 403, upgrade_required: "pro" |
| solo/pro/FM/studio/agency | none | No gate -- runs forever |

**Risk on free/trial:** Limit is enforced. Eric gets a 403 with an upgrade
prompt. User-facing handling depends on the UI caller -- need to verify the
error surfaces as a readable message, not a silent failure.

**Risk on paid plans:** NO credit tracking. A paid workspace can execute
unlimited tasks at GL's pooled API key cost (when user has no BYOK).
If Eric is on solo/pro and uses the pooled key, every execution is at GL's
expense with no counter.

**Risk on starter_credits_used:** The column is reset on nuclear but never
incremented. Any business logic that reads this column (future billing code,
analytics, upgrade prompts) will always see 0. This is a silent data
integrity gap -- the counter never accumulates.

**Risk on pitch/route.ts:** The Pain-to-Pitch route uses GL's ANTHROPIC_API_KEY
directly (`process.env.ANTHROPIC_API_KEY`). There is no per-user rate limit
or credit gate. This is a pre-existing known gap (TODO comment on line 2).

---

## 5. RECOMMENDED POST-GATE ACTIONS (Slot 3 implementation)

Ordered by minimum viable increment:

1. **Define the unit.** Decide: tasks (simplest) or tokens (more accurate).
   Credit token costs once in a constants file.
2. **Create lib/credit-hooks.ts.** Implement beforeLLMCall (check + deny)
   and afterLLMCall (increment + ledger with cost field populated).
3. **Wire into executeTask.ts** around the vendor fetch block (steps 4-6).
4. **Wire into pitch/route.ts** (per the existing TODO comment).
5. **Add starter_credits_used to planGate check** for non-free/trial plans
   OR remove the column if task-count is the canonical gate going forward.
6. **Audit ledger cost field** -- populate with token-derived cost estimate
   post-call so billing analysis is possible without re-parsing descriptions.
