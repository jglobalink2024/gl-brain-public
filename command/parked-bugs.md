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

## Migrated from globalink-brain — 260413 audit Active Fixes (WALK COMPLETE 260505)

[PERSISTENT] [migrated from globalink-brain state.md 260505 · walked CC 260505]

All 6 items verified against current command-app code on 260505. ALL FIXED. None require unparking.

| # | Item | Verdict | Evidence |
|---|---|---|---|
| 1 | `Run in [Agent]` button dead — `StepDetailSidebar:551` | ✅ VERIFIED FIXED | `components/canvas/StepDetailSidebar.tsx` ~line 553: button has real `onClick` posting to `/api/canvas/execute-step` with `step_id`, `workflow_id`, `workspace_id`. Comment confirms intentional design ("always visible; no-agent case handled in onClick"). |
| 2 | ROI tracker inflated baseline | ✅ VERIFIED FIXED | `lib/analytics/roiCalculator.ts`: 2-stage baseline. n<5 → McKinsey GI 2023 8-min industry benchmark. n≥5 → per-agent-type adaptive baseline (avg COMMAND execution × manual_multiplier). Constants `INDUSTRY_BASELINE_MINUTES` + `ADAPTIVE_N_THRESHOLD` + `MANUAL_MULTIPLIER` make calculations explicit. |
| 3 | Smart suggestions wrong fallback | ✅ VERIFIED FIXED via P0#3 TRACK 1 (260504) | Implemented in `lib/pipeline/suggestions.ts`. State.md "260504 — TRACK 1 complete: P0#3 Smart Suggestions fallback fix" entry. |
| 4 | Two auto-handoff implementations | ✅ VERIFIED FIXED (single source) | `lib/pipeline/` contains only `autoHandoff.ts` — duplicate removed. Single source confirmed via directory listing. |
| 5 | No vendor fetch timeout (30s AbortController) | ✅ VERIFIED FIXED | `app/api/agents/proxy/route.ts` lines 36-37, 71-72, 106-107: all 3 vendor branches (Anthropic, OpenAI, Perplexity) use `new AbortController()` + `setTimeout(() => controller.abort(), PROXY_VENDOR_TIMEOUT_MS)`. Constant-based, single configuration point. |
| 6 | API keys written client-side | ✅ VERIFIED FIXED (server-routed) | `app/(app)/settings/integrations/page.tsx` line 196 explicit comment: "The browser never writes workspaces.{vendor}_api_key directly." Line 391: `fetch(...)` with `body: JSON.stringify({ vendor, api_key: key, workspace_id })` to server route — server writes via admin client. `TaskOutputPanel.tsx` only displays `no_api_key` error, doesn't write keys. |

**Net result:** All 6 fixes from the 260413 audit have shipped. This block can be archived after one final review.
