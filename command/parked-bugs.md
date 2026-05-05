# COMMAND — Parked Bugs
# Purpose: every non-Golden-Path bug goes here. Not deleted, not fixed now.
# Reviewed ONLY after Golden Path test has been green for 48 consecutive hours.

Last updated: 260423

---

## Review Protocol

1. Golden Path test green for 48 hours → unlock this file
2. Pick ONE bug from the list
3. Confirm it doesn't regress the Golden Path (write a regression test first)
4. Fix in one CC session
5. Re-run Golden Path test — must still be green
6. Move bug to `resolved-bugs.md` with commit ref

No parallel work. No "while we're in there." Discipline.

---

## Parked — Tier 1 (post-48h-gate-clear)

- A: /api/health — add Supabase SELECT 1 ping for real DB health
- D: Golden Path assertions upgrade — SSE parse + audit_ledger
     zero-errors check + DB agent status=idle verification
- Mock BYOA webhook layer — test-mode endpoint simulating external
  agent receive + callback for chain test deterministic CI runs

### Template
### BUG-P1-XXX — [Title]
- **Reported:** YYMMDD
- **Symptom:** [what user sees, one sentence]
- **Suspected cause:** [if known, else "unknown"]
- **Golden Path impact:** [none / tangential / related]
- **Notes:** [context, reproduction steps, file paths]

---

## Parked — Tier 2 (opportunistic)

- UI affordance for chain visibility — Sandra/Eric should see Agent A → Agent B handoff
  happen, not just the final output. Currently autoHandoff fires server-side with no real-time
  breadcrumb in the UI. Proposed: emit a Supabase Realtime event on agent_handoffs insert
  and display "→ Handing off to [Agent B]..." in the task card. (Added 260427)
- 429 UX banner in SmokeTestCard
- Playwright spec covering /dev routes end-to-end
- Shared types file — kill as any in pipeline files
- copy() fallback when clipboard API unavailable
- :focus-visible styling
- aria-expanded on collapsible cards
- Test user teardown cascade — accumulated test users in Supabase
  with FK constraints blocking delete; growing row count per run
- Rotate production ANTHROPIC_API_KEY if any debug reuse happened

---

## Deferred Infra

- Private → public brain sync Action repair (workflow broke on
  repo rename globalink-brain → gl-brain)

---

## Parked — Tier 3 (UX polish, deferred to post-Eric)

(empty on initialization)

---

## Resolved — moved to resolved-bugs.md

(empty on initialization)

---

## Rules for adding bugs to this file

- Every bug must have a symptom in one sentence
- Must state Golden Path impact (none / tangential / related)
- No fixes in this file — this is a queue, not a log
- When tempted to fix a parked bug outside the review protocol: STOP
- Tier assignment is the operator's call (Jason), not CC's default

---

## Migrated from globalink-brain — 260413 audit Active Fixes (status: VERIFY)

[PERSISTENT] [migrated from globalink-brain state.md 260505]

These items were on the "Active Fixes (still open)" list in globalink-brain's state.md as of 260505. Status not independently re-verified during migration. Operator should walk each before assigning to a tier or unparking.

| Item | globalink-brain severity | Last claimed status | Verify against |
|---|---|---|---|
| `Run in [Agent]` button dead — `StepDetailSidebar:551` | Critical | Open per 260413 audit | Check if button now wired or component refactored since 260413 |
| ROI tracker inflated baseline | Critical | Open per 260413 audit | `lib/roi/` — confirm baseline calc; gl-brain credit-hooks-status.md may already cover this |
| Smart suggestions wrong fallback | Critical | LIKELY FIXED via P0#3 TRACK 1 (260504) | Verify against TRACK 1 commit + cockpit-done C1 walk |
| Two auto-handoff implementations (deduplicate `lib/pipeline/`) | High | Open per 260413 audit | Search for both implementations; check if one was removed during GP-1 work |
| No vendor fetch timeout (30s AbortController) | High | LIKELY FIXED 260504 (90s AbortController shipped per state.md GP-1 entry) | Verify timeout values in `app/api/agents/proxy/route.ts` |
| API keys written client-side (must route server-side) | High | Open per 260413 audit — security gap | Audit any code path writing `api_key` from client; should be server-only |

Migration policy: do NOT silently move any of these to "resolved" without explicit verification + commit reference. Mark `[VERIFIED FIXED — commit X]` or `[VERIFIED OPEN — added to Tier N]` per item.
