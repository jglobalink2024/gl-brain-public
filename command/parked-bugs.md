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
