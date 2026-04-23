# COMMAND Symphony v12 — Claims Pass/Fail Criteria
[PERSISTENT]
Last updated: 260420
Author: Strategic AI (Opus 4.7)
Companion files: Personas_v12.md, Journeys_v12.md, Symphony_v12_Prompt.md

---

## Purpose

Every product claim on the landing page, one-pager, and Dock deck is
translated into a testable assertion. Each claim has a PASS bar and
a FAIL bar. "Partial" exists only where explicitly defined.

Marketing claims that cannot be translated into a testable assertion
must either be rewritten or removed from external comms before beta.

---

## C1 — Agent Status Dashboard

**Public claim**: "See every AI agent in one place, live."

**Testable translation**:
The dashboard displays the real-time state of every agent connected to
the user's workspace, updated within 2s of state change, accurate to
backend truth.

**PASS criteria** (all must hold):
- Every registered agent in the workspace is visible in the dashboard
- State transitions (Idle ↔ Working ↔ Error) reflect within 2s of the
  underlying backend event
- State shown in dashboard matches state queryable from Supabase
  directly (spot check: pull workspace agent rows, compare to UI)
- Agent name, vendor, and last-activity timestamp visible per agent

**FAIL criteria** (any one triggers):
- Agent in backend is missing from dashboard
- State lag > 5s
- Dashboard shows stale state after agent has transitioned
- Dashboard shows states that don't exist in backend (phantom agents)

**PARTIAL** (explicit):
- All agents shown, all state transitions correct, but timestamps not
  displayed — FAIL on missing metadata, PASS on core state
  (counts as PARTIAL, needs fix before beta)

**Tested by**: J1.4, J1.5, J2.1, J3.2, J4.1

---

## C2 — Task Router

**Public claim**: "One task. The right agents pick it up."

**Testable translation**:
When a user submits a task, the router selects an appropriate agent (or
sequence of agents) based on task content, without requiring the user
to specify which vendor to use.

**PASS criteria** (all must hold):
- Research-heavy tasks route to Perplexity-class agent first (if available)
- Writing tasks route to Claude or GPT-4 (user-configurable default is fine)
- Router decision is deterministic given same inputs (or explicitly
  probabilistic with visible reasoning)
- Router does not fail silently — every dispatch either succeeds or
  produces a routing_error event
- User can override router choice (optional for v12 pass but noted)

**FAIL criteria** (any one triggers):
- Research task routed to Claude-only (Perplexity ignored when available)
- Router chooses same agent for every task type (no actual routing)
- Router dispatches to a Stalled/Error agent (no health check)
- Router produces no event at all for some tasks (silent drop)

**PARTIAL**:
- Router makes correct choice for 4 out of 5 persona prompts →
  PARTIAL, acceptable for beta, track 1 failure case

**Tested by**: J1.4, J2.1, J3.2

---

## C3 — Handoff & Context Bridge

**Public claim**: "Output flows between agents. No copy-paste."

**Testable translation**:
When one agent completes output and a downstream agent is invoked, the
downstream agent's prompt includes MEANINGFUL TEXT from the upstream
output, and the downstream agent's output demonstrably uses that context.

**This is the crown jewel claim. Failing C3 = product is broken.**

**PASS criteria** (all must hold):
- J2.2 assertion passes: Agent B's request body contains a contiguous
  substring ≥ 20 chars from Agent A's output
- J2.3 assertion passes: Agent B's output references ≥ 2 specific entities
  (names, numbers, dates, citations) from Agent A's output
- No unresolved template strings in handoff payloads
  (`{{previous_output}}`, `[context from agent A]`, etc.)
- Handoff chain depth ≥ 3 agents maintains context integrity
  (not just 2-hop — 3-hop must also pass)

**FAIL criteria** (any one triggers):
- Handoff payload contains ID reference only with no inline text AND
  downstream output shows no context awareness
- Handoff payload empty / null
- Downstream output is generic enough to have been produced without
  upstream context
- Unresolved templating present in payload
- Context degrades at depth 3 (A→B fine, B→C broken)

**PARTIAL**:
- C3 has NO partial state. Context transfer either works or doesn't.
  Partial context transfer IS failure — Eric and Danielle will notice.

**Tested by**: J2.2, J2.3, J2.4 (exclusively — C3 cannot be validated
by any other journey)

---

## C4 — Zero-API-Key Onboarding

**Public claim**: "Start using COMMAND without an API key."

**Testable translation**:
A brand-new user can sign up and produce their first real agent output
without ever being shown, prompted for, or required to configure an
API key.

**PASS criteria** (all must hold):
- J1.1 assertion passes: no "API key" string visible on landing or
  onboarding screens
- J1.4 assertion passes: first dispatch succeeds with pooled keys
- Settings > Integrations screen has BYOK option but is NOT in the
  onboarding flow
- Credit balance deduction on first dispatch confirms pooled keys
  are being used (not user keys, since none are configured)

**FAIL criteria** (any one triggers):
- Any "API key required" screen in onboarding
- First dispatch fails with "no key configured" error
- Onboarding forces BYOK before first use
- Pooled keys exhausted / unavailable (silent failure mode)

**Tested by**: J1.1, J1.2, J1.4, J5.1

---

## C5 — BYOK (Bring Your Own Keys)

**Public claim**: "Or bring your own keys. Your choice."

**Testable translation**:
A user who OPTS IN to BYOK can configure their own API keys per vendor
in Settings > Integrations, those keys are stored encrypted, scoped
per workspace, and used in place of pooled keys for subsequent dispatches.

**PASS criteria** (all must hold):
- BYOK section present in Settings > Integrations
- Keys can be entered, saved, and masked in UI (first 4 + last 4 chars
  only visible after save)
- Post-BYOK dispatch uses user's key (verified by Stripe cost tracking:
  no COMMAND credit deduction for vendors with BYOK active)
- Key removal reverts to pooled keys
- Keys encrypted at rest in Supabase (not inspected directly in v12;
  confirmed by engineering note)

**FAIL criteria** (any one triggers):
- BYOK section missing / broken
- Keys visible in plaintext after save
- BYOK dispatch still charges COMMAND credits (keys not actually used)
- Key removal doesn't revert to pooled
- Keys leak across workspaces

**Tested by**: J3.2 (if injecting failure via key revoke), otherwise
exercised implicitly via J2 if BYOK workspace used

---

## C6 — Billing & Tiers

**Public claim**: Implicit claim via /pricing — four tiers at stated prices.

**Testable translation**:
The billing surface accurately reflects the subscription state, offers
correct upgrade paths, routes to correct Stripe products, and never
shows a tier that doesn't exist.

**PASS criteria** (all must hold):
- 4 tiers displayed on /pricing AND /settings/billing:
  Solo $49, Founding Member Pro $99, Standard Pro $149, Agency $799
- NO phantom tiers (no Studio $349 — the BILL-02 fix verification)
- Current plan label computed from subscription state, not hardcoded
- FM activate routes to Stripe link `9B68wRgwAcp8dt2dJp9k407` ($99)
- Standard Pro activate routes to Stripe link
  `bJe00lfsw74O74E5cT9k408` ($149)
- Stripe checkout price matches tier card price (within 1 cent)

**FAIL criteria** (any one triggers):
- Missing tier
- Phantom tier
- Hardcoded "Pro" as current plan when user is Pilot (BILL-02 regression)
- Stripe link consolidated (FM and Standard Pro sharing a URL —
  HARD RULE violation per memory)
- Price mismatch between tier card and checkout

**PARTIAL**:
- 4 tiers correct, routing correct, but glossary affordance missing →
  PARTIAL (bundled minor fix acceptable post-beta)

**Tested by**: J5.1, J5.2, J5.3, J5.5

---

## C7 — MCP Host

**Public claim**: "Plug in MCP servers. COMMAND routes and checkpoints."

**Testable translation**:
The user can register an MCP (Model Context Protocol) server via
`/api/mcp/register`, check its status via `/api/mcp/status`, and
observe that task completion auto-fires a CCF (Conversation Checkpoint
Framework) checkpoint.

**PASS criteria** (all must hold):
- POST to `/api/mcp/register` with valid payload returns 200 + server_id
- GET `/api/mcp/status?id=...` returns current state
- On any `task_complete` event, a CCF checkpoint row is created
  (verified via J2.7)
- MCP scope field present on status (note: flagged as "tacked onto next
  sprint" — may be PARTIAL for v12)
- MCP endpoint URL and capabilities columns present on agents table
  (pending SQL migration per prior state)

**FAIL criteria** (any one triggers):
- Register endpoint returns 4xx/5xx on valid payload
- Status endpoint inaccessible
- task_complete doesn't fire checkpoint
- SQL migrations missing (breaks MCP entirely)

**PARTIAL**:
- MCP register + status + checkpoint working, but scope field missing
  → PARTIAL, ship-acceptable
- MCP SQL migrations pending → FAIL (blocker until migrations run)

**Tested by**: J2.7, J4.3; API-level assertions direct, not via persona UI

---

## Cross-claim test coverage matrix

|     | J1 | J2 | J3 | J4 | J5 |
|-----|----|----|----|----|-----|
| C1 Dashboard | ✓ | ✓ | ✓ | ✓ |    |
| C2 Router | ✓ | ✓ | ✓ |    |    |
| C3 Handoff |    | ✓ |    |    |    |
| C4 Zero-key | ✓ |    |    |    | ✓ |
| C5 BYOK |    |    | ✓ |    |    |
| C6 Billing |    |    |    |    | ✓ |
| C7 MCP |    | ✓ |    | ✓ |    |

---

## Scoring rubric

Each claim scored per journey × persona cell:
- **PASS**: all PASS criteria met, zero FAIL triggers
- **PARTIAL**: explicit partial condition met (only where defined)
- **FAIL**: any FAIL criterion triggered
- **NOT_TESTED**: persona/journey combination skipped (expected, not a deduction)
- **BLOCKED**: test could not run due to environment failure
  (deducted from symphony score as "environmental", not product)

**Symphony verdict**:
- ≥95% PASS across tested cells → SHIP
- 85–94% PASS with 0 CRITICAL FAIL on C3/C4/C6 → SHIP WITH FIXES
- <85% OR any CRITICAL FAIL on C3/C4/C6 → DO NOT SHIP, fix and re-run

**C3 is weighted 2x.** Context handoff failure is the product-thesis
failure. A 100% pass on C1/C2/C4-C7 with C3 FAIL is DO NOT SHIP.

---

## What this sheet is NOT

This sheet does not test:
- Extended multi-turn conversations (post-beta work)
- Collaborative features (not MVP)
- Integrations beyond the listed four vendors (future work)
- Mobile responsive layouts (not beta scope)
- SSO/SAML (enterprise, not beta)

Scope discipline: v12 proves what we claim to Eric. Nothing more,
nothing less.
