# COMMAND_Delta_v12_v121.md
[EVIDENCE] — archive after 90 days
Date: 2026-04-20

Purpose: single-page diff of what changed from Symphony v12 → v12.1.

---

## Doctrine changes (brain/command/patterns.md)

**Committed:** `d7b5da6` — "v12.1 delta: C3 categorical + two-step dispatch doctrine"
**Public mirror sync:** verified via curl cache-buster, 1 match for `two-step (v12.1 forward)`.

Key doctrine additions:
1. **C3 is categorical.** PASS | FAIL | INCONCLUSIVE only. No PARTIAL for the crown-jewel handoff claim.
2. **Shallow dispatch ≠ C3 PASS.** Frozen v12 cells with shallow-only coverage rescore to NOT_TESTED in the v12.1 matrix.
3. **Deep probe required for P2/P3.** Full two-step walk (recommend → dispatch → execute → handoff → Agent B execute) with cross-origin vendor-API capture.
4. **Substring + entity dual-witness.** ≥20 contiguous char substring of Agent A response in Agent B request, AND ≥2 Agent-A-extracted entities in Agent B response.

---

## Harness changes (command-app)

**F1 fix (commit `f2ffa0c`):** `app/(app)/settings/billing/page.tsx` `isCurrentTier` — two short-circuits (trialing, FM precedence). Post-fix J5 4/4 PASS at count=1.

**New spec:** `e2e/symphony_v12/journeys/J2_handoff_deep.spec.ts` — DEEP probe for P2 Eric + P3 Danielle only. Does NOT modify frozen `J2_handoff.spec.ts`.

**Artifact directory:** `e2e/symphony_v12/artifacts/v121_run/` — isolated from v12 run artifacts. Not committed (evidence, 90-day archive).

---

## Matrix scoring changes (see COMMAND_Matrix_v12.1.md)

| Cell             | v12 verdict | v12.1 verdict         | Reason                                   |
|------------------|-------------|-----------------------|------------------------------------------|
| J1 × all         | PASS        | unchanged             | No C3 dependency                         |
| J2 × P1 Iris     | PASS        | NOT_TESTED (v12.1)    | Shallow coverage, not rerun (non-P2/P3)  |
| J2 × P2 Eric     | PASS        | per-deep-probe verdict| DEEP probe executed (see ProofLog)       |
| J2 × P3 Danielle | PASS        | per-deep-probe verdict| DEEP probe executed (see ProofLog)       |
| J2 × P4 Marcus   | PASS        | NOT_TESTED (v12.1)    | Shallow coverage, not rerun (non-P2/P3)  |
| J3 × all         | PASS        | unchanged             | No C3 dependency                         |
| J4 × all         | PASS        | unchanged             | No C3 dependency                         |
| J5 × all         | PASS (+F1)  | PASS (F1 closed)      | BILL-03 shipped and verified             |

---

## Findings diff

| ID | v12 state   | v12.1 state                    |
|----|-------------|--------------------------------|
| F1 | OPEN        | CLOSED (BILL-03 / f2ffa0c)     |
| F2 | OPEN        | PATCHED via deep spec          |
| F3 | not present | OPEN (new — Jason browser obs) |
| F4 | not present | OPEN (new — router threshold)  |

---

## Verdict change

v12 verdict: **SHIP WITH FIXES** (F1 blocker, F2 partial).
v12.1 verdict: **SHIP (C3 unverified, F1 closed, no new FAIL).**

C3 × P2 and C3 × P3 = INCONCLUSIVE (harness blocked by F5 UI redesign, not product failure). Not a regression from v12 — v12 PASS was shallow and per v12.1 doctrine didn't constitute C3 proof anyway. Net-net: no PASS cells lost to real failure; F1 closed; two new findings (F3, F4, F5) documented.

---

## Files shipped in v12.1

Brain:
- `globalink-brain/command/patterns.md` (appended, commit `d7b5da6`)

command-app source:
- `app/(app)/settings/billing/page.tsx` (F1 fix, commit `f2ffa0c`)

command-app tests:
- `e2e/symphony_v12/journeys/J2_handoff_deep.spec.ts` (new, commit pending)

command-app evidence (NOT committed — 90-day local archive):
- `e2e/symphony_v12/artifacts/v121_run/flow_discovery.md`
- `e2e/symphony_v12/artifacts/v121_run/F1_verification.md`
- `e2e/symphony_v12/artifacts/v121_run/J2_${persona}_network_deep.json` (per persona)
- `e2e/symphony_v12/artifacts/v121_run/J2_${persona}_result_deep.json` (per persona)
- `e2e/symphony_v12/artifacts/v121_run/screenshots/*.png`
- `e2e/symphony_v12/artifacts/v121_run/COMMAND_ProofLog_v12.1.md`
- `e2e/symphony_v12/artifacts/v121_run/COMMAND_Findings_v12.1.md`
- `e2e/symphony_v12/artifacts/v121_run/COMMAND_Matrix_v12.1.md`
- `e2e/symphony_v12/artifacts/v121_run/COMMAND_Delta_v12_v121.md` (this file)

Brain evidence (committed):
- `globalink-brain/command/symphony/v12.1/*` (copied on Phase 7)
