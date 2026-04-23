# F1_verification.md — BILL-03 post-fix harness re-run
[EVIDENCE] — archive after 90 days
Run date: 2026-04-20
Run context: v12.1 Phase 3 (F1 close verification)
Commit under test: f2ffa0c (command-app)
Deploy target: https://app.command.globalinkservices.io
Test user: jcameron5206@proton.me (Pilot/Free, status=trialing)

---

## Baseline (v12, pre-fix)

Source: `e2e/symphony_v12/artifacts/v12_run/J5_*_result.json` (Apr 20, pre-commit f2ffa0c)

| Persona | "Current plan" count | Verdict |
|---|---|---|
| P1 Iris | 3 | PASS (non-blocking finding) |
| P2 Eric | 3 | PASS (non-blocking finding) |
| P3 Danielle | 3 | PASS (non-blocking finding) |
| P4 Marcus | 3 | PASS (non-blocking finding) |

All four reported: `FINDING: multiple 'Current plan' labels on billing page — potential tier attribution bug`.

---

## Post-fix (v12.1)

Source: this run, 4/4 J5 cells re-executed against production deploy of f2ffa0c.

| Persona | "Current plan" count | Verdict |
|---|---|---|
| P1 Iris | 1 | PASS |
| P2 Eric | 1 | PASS |
| P3 Danielle | 1 | PASS |
| P4 Marcus | 1 | PASS |

The single match is the `CURRENT PLAN` uppercase header at the top of `/settings/billing` (`page.tsx` line 295), which displays `Pilot (free)` for trialing users. No tier card renders "Current plan" label for a Pilot/Free user — banner pattern.

---

## Harness run

```
SYMPHONY_V12=1 npx playwright test e2e/symphony_v12/journeys/J5_conversion.spec.ts --reporter=list
4 passed (37.3s)
```

All BILL-02 assertions continue to pass:
- 4 tiers present (Solo $49, FM $99, Standard Pro $149, Agency $799)
- Studio $349 absent (no_studio_349_phantom)
- Glossary anchors intact (glossary_terms_present)
- Page title "Billing"

No regressions observed on assertions_attempted=14 per cell.

---

## Code change under test

File: `app/(app)/settings/billing/page.tsx`
Function: `isCurrentTier` (line 179)

Minimal diff — added two short-circuits:
1. `if (status === "trialing") return false;` — Pilot/Free user has no matching tier card (banner pattern)
2. `if (workspace?.isFoundingMember === true) return false;` after the founding_member branch — FM precedence prevents double-match when planTier also resolves to a paid tier

Dependency array updated to include `status`.

No other file touched. BILL-02 state preserved.

---

## Verdict

**F1 → CLOSED via BILL-03 (commit f2ffa0c).**

Jason browser check (Phase 4) pending to confirm visual correctness before v12.1 Phase 5 proceeds.
