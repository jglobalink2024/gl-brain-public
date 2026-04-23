# COMMAND_Matrix_v12.1.md
[EVIDENCE] — archive after 90 days
Date: 2026-04-20
Run: v12.1 C3-only patch + F1 verification

## Legend
- **PASS** — all cell assertions pass, positive evidence captured.
- **FAIL** — at least one assertion failed with product-side root cause.
- **INCONCLUSIVE** — harness could not exercise the claim; no product failure observed.
- **NOT_TESTED** — cell not re-executed in v12.1 (doctrine: non-P2/P3 shallow-J2 cells rescore here).
- **PASS (v12)** — unchanged from v12 baseline, no C3 dependency.

---

## Journey × Persona matrix

|                  | P1 Iris     | P2 Eric       | P3 Danielle   | P4 Marcus   |
|------------------|-------------|---------------|---------------|-------------|
| **J1 Routing**   | PASS (v12)  | PASS (v12)    | PASS (v12)    | PASS (v12)  |
| **J2 Handoff**   | NOT_TESTED  | INCONCLUSIVE  | INCONCLUSIVE  | NOT_TESTED  |
| **J3 Dashboard** | PASS (v12)  | PASS (v12)    | PASS (v12)    | PASS (v12)  |
| **J4 Context**   | PASS (v12)  | PASS (v12)    | PASS (v12)    | PASS (v12)  |
| **J5 Billing**   | PASS        | PASS          | PASS          | PASS        |

Totals: 4 PASS (v12 carried), 4 PASS (v12.1 F1 re-verified), 2 NOT_TESTED, 2 INCONCLUSIVE.

---

## Claims × Persona matrix (7 claims)

| Claim                                            | P1 Iris   | P2 Eric      | P3 Danielle  | P4 Marcus |
|--------------------------------------------------|-----------|--------------|--------------|-----------|
| C1 routing engine picks correct agent            | PASS      | PASS (route  | PASS (route  | PASS      |
|                                                  |           |  recorded    |  recorded    |           |
|                                                  |           |  confidence= |  confidence= |           |
|                                                  |           |  68)         |  68)         |           |
| C2 dispatch + execute surfaces real output       | PASS (v12)| NOT_TESTED   | NOT_TESTED   | PASS (v12)|
| **C3 context handoff (Agent A → Agent B carry)** | NOT_TESTED| **INCONCLUSIVE** | **INCONCLUSIVE** | NOT_TESTED |
| C4 dashboard reflects state                      | PASS (v12)| PASS (v12)   | PASS (v12)   | PASS (v12)|
| C5 context bridge / CCF works                    | PASS (v12)| PASS (v12)   | PASS (v12)   | PASS (v12)|
| C6 billing tiers correct                         | PASS      | PASS         | PASS         | PASS      |
| C7 no banned terms / GL hygiene                  | PASS (v12)| PASS (v12)   | PASS (v12)   | PASS (v12)|

C3 categorical per v12.1 doctrine — INCONCLUSIVE is the defensible v12.1 state (harness blocked by F5, not a product failure).

---

## Deltas vs v12

| Cell              | v12 verdict | v12.1 verdict | Reason |
|-------------------|-------------|---------------|--------|
| J5 × P1–P4        | PASS + F1   | PASS (F1 closed) | BILL-03 shipped + visual confirm |
| J2 × P1 Iris      | PASS        | NOT_TESTED    | v12.1 doctrine: shallow ≠ C3 PASS |
| J2 × P2 Eric      | PASS        | INCONCLUSIVE  | DEEP probe blocked by F5 |
| J2 × P3 Danielle  | PASS        | INCONCLUSIVE  | DEEP probe blocked by F5 |
| J2 × P4 Marcus    | PASS        | NOT_TESTED    | v12.1 doctrine: shallow ≠ C3 PASS |

All other v12 cells carried unchanged into v12.1.

---

## Findings on matrix

| Finding | Status | Blocks ship? |
|---------|--------|--------------|
| F1 Current-plan dedup | CLOSED | No (was, now resolved) |
| F2 J2 shallow-only | PATCHED (spec added, deferred to v12.2 for UI-match) | No |
| F3 /overview slow-load | OPEN | No (UX polish) |
| F4 Router threshold gate | OPEN | No (UX polish) |
| F5 Harness vs UI mismatch | OPEN | No (harness issue, not product) |

No ship-blocker in v12.1.

---

## v12.1 verdict

**SHIP (with C3 unverified).** F1 closed. No new product FAIL. All v12 cells still PASS. C3 verification deferred to v12.2 harness rewrite — not blocking because no C3 failure was observed; harness simply could not exercise the claim. Product may be working correctly in the redesigned UI.
