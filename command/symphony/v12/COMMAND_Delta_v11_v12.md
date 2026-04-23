# COMMAND Symphony v11 → v12 Delta
[EVIDENCE] — 260420

## What changed between the two runs

### v11 state (as of preflight attempt — 260419)
- **Preflight: FAILING.** `bill02_deploy_check.spec.ts`, `agent_state_check.spec.ts`, and `credit_balance_check.spec.ts` all blocked by auth.
- Root cause: `signInViaSupabase` helper POST'd to Supabase REST API and injected the session into localStorage. Production uses `@supabase/ssr`, which reads chunked cookies (`sb-<ref>-auth-token.0/.1`), not localStorage. The middleware redirected the test back to `/login`.
- v11 ran with the `PLAYWRIGHT_PHASE_B=1` toggle, which pointed `testDir` at `tests/` — `e2e/symphony_v12/` files that didn't end in `.spec.ts` were silently skipped.
- Net result: no v11 evidence captured end-to-end; run aborted at preconditions.

### v12 state (this run — 260420)
- **Auth rewritten.** Real form-driven sign-in via `#login-email` / `#login-password` / `▶ Send Task`-style locators. `page.context().storageState()` captures the `sb-ycxaohezeoiyrvuhlzsk-auth-token` cookie to `e2e/symphony_v12/.auth/user.json`.
- **Config extended.** New `SYMPHONY_V12=1` mode: `testDir: e2e/symphony_v12`, baseURL=appURL, no webServer, workers=1, globalTeardown disabled.
- **Setup file renamed.** `auth.setup.ts` → `auth.spec.ts` so the persona-run testMatch `**/*.spec.ts` picks it up.
- **Journey specs shipped.** 5 spec files (`J1_first_dispatch`, `J2_handoff`, `J3_failure_recovery`, `J4_returning_user`, `J5_conversion`) using the new storageState and the existing helpers (`persona_protocol`, `network_capture`, `screenshot_pairs`, `credit_delta`).
- **Submit button locator corrected.** First pass used `Route|Dispatch|Submit` keywords; production button reads `▶ Send Task`. Fixed in J1/J2/J3, verified via 9-test re-run.
- **Net result:** 17/17 green, 20-cell matrix populated, 19 PASS / 1 PARTIAL / 0 FAIL.

---

## What the app itself proved between v11 and v12

| Aspect | v11 | v12 |
|---|---|---|
| Can a Playwright session reach an authenticated page? | NO (auth injection broken) | YES (real UI sign-in + storageState) |
| Is BILL-02 live in production? | Could not be verified | VERIFIED: 4 tiers present, no $349 phantom, glossary styled |
| Does the router pick the right agent for research? | Could not be verified | VERIFIED: research → Perplexity-1, confidence 68, reason "type match (research) + active" |
| Is the handoff chain end-to-end observable? | NO | PARTIAL — router stage captured, Agent A → Agent B step not walked |
| Do error surfaces render for sparse input? | Could not be verified | VERIFIED for all 4 personas; no stack leak to non-technical personas |
| Does `/outputs`, `/dashboard`, `/agents` persist for returning user? | Could not be verified | VERIFIED (shallow) |

## What remains from v11's debt

None blocking. One carryover:

- **C3 end-to-end handoff verification** remains PARTIAL. Not a new regression — v11 never reached it either. The harness now gets further (router call captured) but still stops at the recommendation response. Addressed in `COMMAND_Findings_v12.md` as F2.

## New findings introduced by v12 run

- **F1** — triple `"Current plan"` label on `/settings/billing` for a Pilot/Free account. Not a regression from v11 (v11 never rendered the page under auth), but now observable and reproducible. MINOR severity.

## Harness files that changed between v11 and v12

- `command-app/command-app/e2e/symphony_v12/auth.spec.ts` — NEW (replaces the broken localStorage injection pattern)
- `command-app/command-app/playwright.config.ts` — EDITED to add `SYMPHONY_V12=1` mode
- `command-app/command-app/e2e/symphony_v12/journeys/J{1-5}_*.spec.ts` — NEW

Preflight spec files (`bill02_deploy_check`, `agent_state_check`, `credit_balance_check`) still use the old `signInViaSupabase` helper. They can be either:
- Migrated to consume the new `auth.spec.ts` storageState (cleanest), or
- Retired in favor of the journey cells (J5 already covers BILL-02 with stricter assertions than the original preflight).

## Verdict delta

- **v11 verdict:** could not be rendered (run aborted at preconditions)
- **v12 verdict:** SHIP WITH FIXES (see `COMMAND_Matrix_v12.md`)
