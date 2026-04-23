# COMMAND Symphony v12 — Findings
[EVIDENCE] — 260420

Ordered by severity. Each finding cites the artifact that proves it.

---

## F1 — Multiple "Current plan" labels on billing page (MINOR, UX)

**Severity:** MINOR — does not block a dispatch, sale, or agent operation. Visible to every customer who opens `/settings/billing`.

**Evidence:** All 4 personas × J5 cells report `"Current plan" label count on page: 3`. Pilot/Free user should see exactly 1. Files: `J5_P1_IRIS_result.json`, `J5_P2_ERIC_result.json`, `J5_P3_DANIELLE_result.json`, `J5_P4_MARCUS_result.json`.

**Likely cause:** Badge or label rendered per tier card regardless of the user's actual plan state.

**Impact:** Tier attribution ambiguity — a user glancing at the billing page cannot immediately identify which tier they are on. For P3 Danielle (primary ICP, "pricing ambiguity" is a listed abandon trigger), this is directly adjacent to an abandon signal.

**Recommended fix:** Render the "Current plan" badge on exactly one tier card, driven by the workspace's subscription state. Pilot/Free users should see it on the Pilot card only.

**Priority:** Fix before first paid customer upgrade flow goes live.

---

## F2 — C3 handoff chain not observable via single-call dispatch (HARNESS GAP)

**Severity:** INCONCLUSIVE — not an app regression; a test coverage gap.

**Evidence:** `J2_P2_network.json` contains exactly 1 agent-related request: `POST /api/route-task`. No second agent call captured within the 15s observation window.

**Interpretation:** The production dispatch flow appears to be two-step — (1) user submits task → router returns recommendation, (2) user clicks a subsequent control to dispatch to the recommended agent. The harness submitted the prompt but did not walk the second step, so Agent A's output flowing into Agent B's request body was not verified.

**Impact on claim verdicts:** C3 cannot be declared PASS in this run. It is PARTIAL (routing works, handoff wiring not observed). A follow-on run must:
1. Click `▶ Send Task` to execute dispatch
2. Wait for Agent A (Perplexity) to return
3. Confirm Agent B (Claude) gets invoked with Agent A's output payload
4. Assert Agent B request body contains ≥20 char substring of Agent A response

**Recommended fix (test harness, not app):** Extend `J2_handoff.spec.ts` to walk the full dispatch + bridge flow. If the app requires user-initiated handoff (CCF form fill), the test must simulate that form fill.

---

## F3 — Router intelligence confirmed for research tasks (POSITIVE)

**Severity:** POSITIVE — confirms a launch-critical capability.

**Evidence:** `J1_P3_network.json` captured router decision:
- Input: 400-word research prompt (Stripe pricing research → cold email draft)
- `task_type` classified as `research`
- `recommended_agent_name`: `Perplexity-1`
- `confidence_score`: 68
- `reason`: `"type match (research) + active"`
- `alternatives`: Claude-1, GPT-4-1 listed with queue depths

**Why this matters:** P3 Danielle's primary abandon trigger is "router makes a dumb choice (sends research to Claude instead of Perplexity)." The router correctly routed research → Perplexity. C1 PASS confirmed live in production.

---

## F4 — Error surface visible for sparse-prompt submissions (POSITIVE)

**Severity:** POSITIVE — confirms C4 passes for all 4 personas.

**Evidence:** All 4 J3 cells passed `c4_error_surface_visible` assertion after submitting the sparse prompt `"fix"`. For P1 Iris and P4 Marcus (non-technical), no technical stack trace text was visible.

**Interpretation:** The "Task needs more context" error card renders reliably, with no JSON/stack exposure to non-technical users.

---

## F5 — /agents page exposes 3 registered agents for BYOA workspace (POSITIVE)

**Severity:** POSITIVE — confirms C7 persistence at shallow depth.

**Evidence:** All 4 J4 cells passed `c7_agents_registered` (Claude, GPT-4, Perplexity names visible).

**Interpretation:** The BYOA agent registry persists correctly across sessions — a returning user sees their registered agents without reconfiguration.

---

## F6 — Billing tier set matches BILL-02 spec (POSITIVE — regression gate)

**Severity:** POSITIVE — re-confirms the BILL-02 fix (commit 3593d49) is live.

**Evidence:** All 4 J5 cells pass:
- `tier_solo_visible`, `tier_fm_visible`, `tier_std_pro_visible`, `tier_agency_visible` all PASS
- `price_49/99/149/799_visible` all PASS
- `no_studio_349_phantom` PASS (count = 0)
- `glossary_elements_present`, `glossary_underlined`, `glossary_cursor_help` all PASS

**Interpretation:** BILL-02 fix is stable in production, with no regression to the Studio $349 phantom or the pre-glossary-styling state.

---

## F7 — Auth session persistence via @supabase/ssr cookies verified (POSITIVE)

**Severity:** POSITIVE — confirms the auth architecture that blocked prior preflight runs.

**Evidence:** `auth.spec.ts` produced `e2e/symphony_v12/.auth/user.json` with one cookie: `sb-ycxaohezeoiyrvuhlzsk-auth-token`. All 17 subsequent tests reused this storageState and landed on authenticated pages without redirecting back to `/login`.

**Interpretation:** The previously-reported preflight auth failures were caused by localStorage-only session injection, which does not satisfy the `@supabase/ssr` cookie-based middleware. Real UI sign-in saved as storageState is the correct pattern. This is now documented in `auth.spec.ts` and the `SYMPHONY_V12=1` config mode.

---

## F8 — Handoff surface (/bridge) renders on direct navigation (POSITIVE)

**Severity:** POSITIVE — confirms the handoff UI is reachable.

**Evidence:** J2 cells for P1, P3, P4 (shallow probes) all passed `bridge_surface_visible` (text matches /Handoff|Context Bridge|CCF/i visible within 8s).

**Interpretation:** The Context Bridge entry point is discoverable. Depth testing (form fill, checksum, copy) not performed this run.

---

## Next-run recommendations

1. **Close C3 verification**: extend `J2_handoff.spec.ts` to execute the full dispatch → Agent A → Agent B chain. This is the last claim needing definitive PASS before launch confidence is complete.
2. **Ship F1 fix**: single-render the "Current plan" label, tied to workspace subscription state.
3. **Optional deeper J4**: verify specific prior-session context is retrievable (not just that the page loads).
