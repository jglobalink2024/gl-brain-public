# COMMAND_Findings_v12.1.md
[EVIDENCE] — archive after 90 days
Run: v12.1 C3-only patch + F1 close verification
Date: 2026-04-20
Harness commit: f2ffa0c (command-app)
Deploy: https://app.command.globalinkservices.io

---

## Findings summary

| ID  | Severity    | Status       | Title                                                                 |
|-----|-------------|--------------|-----------------------------------------------------------------------|
| F1  | MAJOR       | CLOSED       | Multiple "Current plan" labels on /settings/billing                   |
| F2  | MINOR       | PATCHED      | J2 spec covers dispatch only (PARTIAL) — deep probe added in v12.1    |
| F3  | MINOR (UX)  | OPEN         | /overview + side-nav expansion load silently (no skeleton/spinner)    |
| F4  | MINOR (UX)  | OPEN (NEW)   | Router auto-execute threshold at 70% may gate medium-confidence       |
| F5  | MAJOR       | OPEN (NEW)   | /send-task UI redesigned; v12.1 DEEP harness cannot exercise C3 chain |

---

## F1 — Multiple "Current plan" labels (CLOSED)

**Baseline (v12, pre-fix, Apr 20):** All four J5 cells reported 3 matches of "Current plan" on `/settings/billing` for a Pilot/Free (trialing) user.

**Root cause:** `isCurrentTier` in `app/(app)/settings/billing/page.tsx:179` resolved truthy on paid-tier cards for users whose `status="trialing"` + `workspace?.isFoundingMember=true`, producing a false "Current plan" badge on two tier cards in addition to the uppercase banner header.

**Fix (commit f2ffa0c):** Two short-circuits in `isCurrentTier`:
1. `if (status === "trialing") return false;` — banner pattern for Pilot/Free
2. `if (workspace?.isFoundingMember === true) return false;` after the founding_member branch — FM precedence prevents double-match

**Post-fix evidence:** `F1_verification.md` — all 4 J5 cells now observe count=1 (header only). Harness 4/4 PASS, 37.3s. BILL-02 assertions preserved.

**Jason browser confirm:** received 2026-04-20 — visual fix verified.

---

## F2 — J2 dispatch-only coverage (DEFERRED → PATCHED in v12.1)

**Baseline (v12):** Frozen `J2_handoff.spec.ts` locator `button:has-text("Send Task"), button:has-text("Auto-select agent")` matched `Auto-select agent` first in DOM order — Step 1 fired (`/api/route-task`), but the 15s capture window closed before the countdown + execute phase.

**v12.1 remediation:** New sibling spec `J2_handoff_deep.spec.ts` walks the full two-step flow with 120s poll + low-confidence panel handler + cross-origin vendor-API capture (api.anthropic.com, api.openai.com, api.perplexity.ai). See `flow_discovery.md` for architecture.

**Doctrine change:** Shallow dispatch success ≠ C3 PASS. Non-P2/P3 personas in v12 that shipped only shallow J2 coverage are rescored to NOT_TESTED in the v12.1 matrix.

---

## F3 — Silent slow-load on Overview + side-nav (OPEN, ship-soon)

**Source:** Jason browser session, 2026-04-20, Pilot/Free account.

**Observations:**
- Side navigation collapsible sections (Settings, Integrations) — visible delay when expanding, no intermediate loading state.
- `/overview` page (money counter / usage meter) — loads silently with blank content area, no skeleton/spinner during data fetch.
- Both observed on Pilot/Free; presumed to affect all tiers (same components).

**Severity:** MINOR (UX polish). Not a ship-blocker. First-impression friction — the app looks "dead" during the fetch window.

**Recommended fix pattern:**
- Shimmer skeleton component (pre-exists elsewhere in the app for tasks list) mounted as fallback during the Supabase fetch.
- For side-nav expansion: immediate CSS-only height transition, separate from data resolution — decouples interaction feedback from data load.

**Owner:** command-app · UI polish backlog. Not gated behind Phase 2.

---

## F4 — Router auto-execute threshold gates medium-confidence research (OPEN, NEW)

**Source:** v12.1 J2 DEEP probe, P3 Danielle cell (2026-04-20).

**Observation:** P3's research prompt (`TEST_PROMPTS.P3_DANIELLE.J2`) triggered `/api/route-task` which returned `confidence_score=68, confidence="medium"` recommending `Perplexity-1` for type match (research) + active. Because 68 < `AUTO_EXECUTE_THRESHOLD=70`, the countdown/auto-execute path did not fire — `LowConfidencePanel` rendered instead, requiring a manual "▶ Execute with Perplexity-1" click.

**Evidence file:** `J2_P3_DANIELLE_network_deep.json` — single capture of `/api/route-task` with `confidence_score: 68`.

**Why it matters:** The router is correctly matching the prompt to Perplexity (the only research-capable agent), the recommendation is "medium" not "low," yet the UX still demands a confirm click. For a persona whose whole value prop is "one-shot from prompt to answer," this creates friction and arguably misrepresents router competence as indecision.

**Severity:** MINOR (UX polish). Does not break routing — just forces an extra click on the majority of research queries. The threshold's purpose (user consent for low-confidence calls) is sound; the issue is the calibration.

**Recommended fix options (product decision — not prescribing):**
1. Lower `AUTO_EXECUTE_THRESHOLD` from 70 to 60 for unambiguous type matches.
2. Add a second dimension: auto-execute when `type_match=true && recommended_agent is only-of-type`, regardless of score.
3. Render LowConfidencePanel with a 4-second auto-execute countdown pre-selected on the top candidate (consent-with-default pattern — matches the high-conf countdown UX).

Option 3 is the lowest-risk change: preserves the human-in-the-loop gate but eliminates the forced click for the common case.

**Owner:** command-app · router UX. Flag for Phase 2 review.

---

## F5 — /send-task UI redesigned; DEEP harness cannot exercise C3 chain (OPEN, NEW)

**Source:** v12.1 J2 DEEP probe screenshots (both P2 + P3), 2026-04-20.

**Observation:** The live production `/send-task` page does NOT match the source-code paths `flow_discovery.md` was initially built against. There is no `Auto-select agent` button, no `CountdownOverlay`, no `LowConfidencePanel` with per-candidate `▶ Execute with <Agent>` buttons. Instead the UI shows: `CLEAR | ✦ REFINE TASK | …ANALYZING (spinner) | ▶ Send Task`, with inline `Best match → <AgentName>` status after analysis.

**Impact:** Both P2 + P3 DEEP probes captured only the `/api/route-task` POST. `/api/tasks/dispatch` was never called and no vendor POST (api.anthropic.com / openai / perplexity) fired — because the harness never clicked `▶ Send Task`. **C3 × P2 and C3 × P3 return INCONCLUSIVE.**

**Root cause candidates:**
1. Source tree has been refactored since flow_discovery.md was authored from `app/router/page.tsx` — the live page is served by a different component tree.
2. Or a feature flag / experimental UI is enabled for this account that routes to a different page at `/send-task` vs `/router`.
3. Or the route `/router` now redirects to `/send-task` with the simpler UI.

**v12.2 remediation:**
- Rewrite `J2_handoff_deep.spec.ts` against the live `/send-task` UI.
- Locate `▶ Send Task` button, click after Best-match appears, poll for execute completion, capture vendor POSTs.
- Re-verify C3 chain on production. Until then, C3 is unverified (not failed — just not exercised).

**Severity:** MAJOR (harness integrity). Does NOT indicate the product is broken — product may be working fine end-to-end in the redesigned flow. Harness simply cannot observe it.

---

## C3 deep-probe outcome (J2 × P2 Eric, P3 Danielle)

Per `COMMAND_ProofLog_v12.1.md`:
- **C3 × P2 Eric (J2):** **INCONCLUSIVE** — agent_calls_observed=0, harness blocked by F5.
- **C3 × P3 Danielle (J2):** **INCONCLUSIVE** — agent_calls_observed=0, harness blocked by F5.

C3 verdict field in `c3_assessment` correctly reports INCONCLUSIVE. Cell-level assertion tallies show 2 FAIL (trivially, because shared_substring_len=0 and entities_carried=0 on an empty chain) + 1 BLOCKED — these are harness-emitted noise from F5, not product failures. Per v12.1 doctrine (C3 categorical; INCONCLUSIVE valid; no PARTIAL), the defensible cell verdict is INCONCLUSIVE.

---

## v12.1 deltas not yet acted on

- Router threshold calibration (F4) — product decision pending.
- Overview/side-nav loading states (F3) — UI backlog.
- No other v12 findings required patching in v12.1.
