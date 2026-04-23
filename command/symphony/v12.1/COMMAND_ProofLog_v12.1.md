# COMMAND_ProofLog_v12.1.md
[EVIDENCE] — archive after 90 days
Run: v12.1 C3 deep-probe + F1 close verification
Date: 2026-04-20
Harness commit: f2ffa0c + J2_handoff_deep.spec.ts (not-yet-committed)
Deploy: https://app.command.globalinkservices.io
Test user: jcameron5206@proton.me (Pilot/Free trialing, workspace_id=ws-1776139325700)

---

## What was captured

### F1 verification (J5 harness, 4/4 PASS, 37.3s)
See `F1_verification.md`. Post-fix count of "Current plan" text on `/settings/billing` reduced from 3 → 1 across all four personas. BILL-02 tier assertions unchanged. Jason browser confirm received 2026-04-20. **F1 CLOSED.**

### Two-step dispatch flow discovery
See `flow_discovery.md`. Initial discovery from source-code archaeology identified a `/router`-style UI with Auto-select agent / CountdownOverlay / LowConfidencePanel. **Rerun screenshots revealed the production UI is redesigned to a `/send-task` simple analyze + Best-match + Send Task flow.** Harness was not rewritten against the new UI in v12.1 scope.

### J2 DEEP probe (P2 Eric, P3 Danielle)

| Persona      | Vendor calls captured | C3 verdict     | Cell verdict |
|--------------|-----------------------|----------------|--------------|
| P2 Eric      | 0                     | INCONCLUSIVE   | BLOCKED → FAIL per doctrine fallback |
| P3 Danielle  | 0                     | INCONCLUSIVE   | BLOCKED → FAIL per doctrine fallback |

**Note on verdict:** The harness's assertion logic currently flips INCONCLUSIVE (agent_calls=0) into two FAIL assertions ("agent_a_output_in_agent_b_input", "agent_a_entities_in_agent_b_output") because shared_substring_len=0 and entities_carried=0 trivially. The C3 **verdict field** in `c3_assessment` correctly reports INCONCLUSIVE. Per v12.1 doctrine (C3 categorical, no PARTIAL), the cell verdict should be **INCONCLUSIVE**, not FAIL. The assertion-level FAILs are harness-emitted noise from a blocked chain, not product failures.

**Root cause of INCONCLUSIVE:** UI redesign (see flow_discovery.md ⚠️ section) — `J2_handoff_deep.spec.ts` was written against older source paths that no longer match the live `/send-task` component tree. `▶ Send Task` was never clicked, so no dispatch + no vendor POSTs fired.

### Network evidence per cell

Each persona captured exactly **one POST**: `/api/route-task` with the persona's research prompt. Response confirmed routing engine healthy:
- P2 Eric prompt (consulting + Q1 newsletter): `confidence_score=68, recommended=Perplexity-1, fallback=Claude-1`
- P3 Danielle prompt (Stripe pricing + cold email): `confidence_score=68, recommended=Perplexity-1, fallback=Claude-1`

Router is correctly typing both prompts as "research" and recommending the only research-capable agent. The 68 score = "medium" confidence, below the 70 auto-execute threshold. This may or may not reflect the current UI's threshold gate — harness did not exercise that path.

### Agent vendor calls
**Zero vendor calls fired during either test** (0 × api.anthropic.com, 0 × api.openai.com, 0 × api.perplexity.ai). No credit was spent on Anthropic / OpenAI / Perplexity inference during the deep probe. Budget guard held.

### Screenshot evidence
8 screenshots captured (2 personas × 4 boundary states: 01_router_loaded, 02_prompt_filled, 03_routed, 04_final). Stored at `artifacts/v121_run/screenshots/`. These are the primary visual evidence that the production UI is redesigned vs source-tree assumptions.

---

## What C3 status is defensible from this evidence

- **C3 × P2 Eric (J2):** INCONCLUSIVE — harness could not exercise the full chain on current UI. Route recommendation fired correctly; dispatch + execute + handoff never walked.
- **C3 × P3 Danielle (J2):** INCONCLUSIVE — same root cause.
- **C3 × other personas (J2):** NOT_TESTED per v12.1 doctrine (non-P2/P3 rescore).

No C3 cell received positive proof of entity-and-substring carryover. **v12.1 does not validate C3 on the production deploy.** This is an INCONCLUSIVE result, not a FAIL — product behavior was not observed to be broken; harness simply did not exercise it.

---

## What F1 closure is defensible from this evidence

- J5 post-fix 4/4 PASS at count=1 on the live `/settings/billing`.
- `isCurrentTier` code fix minimal and scoped.
- Jason visual browser confirm received.
- **F1 is ship-quality closed.** BILL-02 preserved. No regressions observed on assertions_attempted=14 per cell.

---

## Findings registry (see COMMAND_Findings_v12.1.md for detail)

| ID | State      | One-liner |
|----|------------|-----------|
| F1 | CLOSED     | Current plan dedupe shipped in BILL-03 / f2ffa0c |
| F2 | PATCHED    | J2 DEEP spec added (needs UI-redesign rewrite for v12.2) |
| F3 | OPEN       | Silent slow-load on /overview + side-nav expansion |
| F4 | OPEN       | Router auto-execute threshold may gate research queries (context: source tree; live UI not verified) |
| F5 | OPEN (NEW) | v12.1 harness assumes pre-redesign router UI — needs rewrite for live /send-task |

---

## Budget

Rerun cost: **$0 agent inference** (zero vendor POSTs). Playwright browser compute only. Well under $10 ceiling.
