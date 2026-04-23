# COMMAND Symphony v12 — Journey Scripts
[PERSISTENT]
Last updated: 260420
Author: Strategic AI (Opus 4.7)
Companion files: Personas_v12.md, Claims_v12.md, Symphony_v12_Prompt.md

---

## Core doctrine — CLICK, THEN OBSERVE

v11 failure mode: "Button exists" counted as PASS. This was wrong.

v12 standard: every assertion is a POST-ACTION observation.

Every step in every journey has four parts:

1. **ACTION** — what the user does (click X, type Y, navigate to Z)
2. **EXPECTED OBSERVABLE** — what should change in the UI/system after
   the action completes (within N seconds)
3. **VERIFICATION METHOD** — HOW the tester confirms the observable
   (screenshot + diff, network tab inspection, DOM state at t+Ns,
   credit balance query, backend log read)
4. **FAIL SIGNAL** — what counts as a failure (not just "observable
   missing" but "observable wrong")

If a step cannot be verified by one of the four methods above, the step
is not testable and must be rewritten or removed.

**Forbidden verification methods in v12**:
- "Button is present in DOM" (that's a v11 check — we already have those)
- "Code looks correct in the component file" (reading is not testing)
- "API endpoint returns 200" (without payload inspection)
- "Agent status shows Working" (without confirming Working transitions
  to Idle with real output)

---

## J1 — First paint to first dispatch (happy-path, zero-key)

**Purpose**: Prove that a user can get from landing to first real output
without touching an API key screen, and that the output is real work.

**Claims exercised**: C1 (dashboard), C2 (router), C4 (zero-key)

**Personas run**:
- P1 Iris — DEEP
- P2 Eric — DEEP
- P3 Danielle — STRUCTURAL
- P4 Marcus — DEEP

**Preconditions**:
- Fresh incognito session
- Test user already provisioned: jcameron5206@proton.me / CommandTest2026!
- Pooled API keys available (COMMAND default)
- Workspace on Pilot (Free) tier
- Credit balance: starting value captured pre-session

**Step sequence**:

### J1.1 — Land on app root
- **ACTION**: Navigate to `app.command.globalinkservices.io`
- **EXPECTED OBSERVABLE**: Sign-in screen renders in < 2s; no console
  errors; no "API key required" warning anywhere
- **VERIFICATION**:
  - Screenshot captured; DOM scan for strings "API key", "api_key", "token"
    in visible text content (hidden inputs allowed)
  - Network tab: no failed requests in red
  - Console: zero errors, ≤ 1 warning (acceptable: analytics)
- **FAIL SIGNAL**: Any visible mention of API keys; any 4xx/5xx on initial load

### J1.2 — Sign in
- **ACTION**: Enter test credentials, click Sign In
- **EXPECTED OBSERVABLE**: Redirect to dashboard within 3s; user avatar/
  email visible; agent list renders (may be empty for true new user, or
  populated for test user)
- **VERIFICATION**:
  - Post-click screenshot shows dashboard URL and logged-in state
  - Network tab: `/api/auth/*` returns 200 with session cookie set
  - localStorage has workspace_id set
- **FAIL SIGNAL**: Stuck on sign-in; session cookie missing; dashboard
  route returns without workspace context

### J1.3 — Locate task input (time-to-intent)
- **ACTION**: From logged-in landing state, find the field where you
  type a task. Timer starts at page render, stops at first keystroke.
- **EXPECTED OBSERVABLE**: Task input is discoverable within 15s for P1
  (low fluency), 5s for P2/P3 (high fluency), 10s for P4 (medium)
- **VERIFICATION**:
  - Persona-simulated click path recorded; timestamps captured
  - Orchestrator annotates each click as "purposeful" vs "exploratory"
- **FAIL SIGNAL**: P1 cannot find task input within 15s; requires scroll
  or hover-to-reveal

### J1.4 — Submit first task
- **ACTION**: Type the persona-specific task prompt (see Personas_v12.md);
  click Submit/Send/Dispatch button
- **EXPECTED OBSERVABLE**:
  - Submit button shows loading state within 500ms
  - Agent Status Dashboard shows at least one agent transition from
    Idle → Working within 2s
  - Live Activity log shows dispatch event with timestamp and agent name
  - Credit balance decrements (non-zero delta, captured pre/post)
- **VERIFICATION**:
  - Screenshot at t+500ms (loading state confirmed)
  - Screenshot at t+3s (Working state confirmed)
  - Network tab: POST to `/api/dispatch` or equivalent returns 200 with
    task_id in response body
  - DB or API poll: credit balance pre vs post
- **FAIL SIGNAL**:
  - Submit click produces no visible state change within 2s
  - Agent status stays Idle after dispatch (silent failure)
  - Credit balance unchanged (dispatch was free or didn't fire)
  - Network tab shows request failed but UI shows Working

### J1.5 — Receive first output
- **ACTION**: Wait for output; do not click anything during wait
- **EXPECTED OBSERVABLE**:
  - Agent transitions Working → Idle within 60s
  - Output panel shows generated text > 50 characters
  - Output is ON-TOPIC for the task prompt (substring match: persona's
    prompt contains key nouns; output must contain ≥ 2 of those nouns)
- **VERIFICATION**:
  - Full output text captured as string; substring assertions applied
  - Screenshot of rendered output
  - Network tab: streaming response completed (no abort)
  - Console: no errors during streaming
- **FAIL SIGNAL**:
  - Output is a generic placeholder ("Here's my response to your request")
  - Output is shorter than 50 chars
  - Agent stuck in Working after 60s
  - Output contains visible code fencing or raw JSON (bad for P1)

### J1.6 — Persona-specific abandon check
- **ACTION**: After output renders, persona does NOTHING for 10s
- **EXPECTED OBSERVABLE**: For P1/P4: output is copy-able with obvious
  CTA ("Copy", "Save to Notion", etc.) visible within 5s of output
  landing
- **VERIFICATION**: DOM scan for button/link elements with copy/save/
  export semantics in the output panel
- **FAIL SIGNAL**: P1/P4 has no clear next step after output arrives

**Total assertions**: 18
**Estimated duration per persona**: 6 minutes
**Total J1 runtime**: ~25 min

---

## J2 — Multi-agent handoff with context transfer

**Purpose**: Prove that context ACTUALLY transfers between agents, not
just that a handoff event fires. This is the crown jewel test. COMMAND's
thesis lives or dies here.

**Claims exercised**: C1, C2, C3, C7

**Personas run**:
- P1 Iris — STRUCTURAL (she wouldn't trigger multi-agent consciously,
  so we test whether the router transparently handoffs for her)
- P2 Eric — DEEP
- P3 Danielle — DEEP
- P4 Marcus — STRUCTURAL

**Preconditions**:
- All three test workspace agents authenticated and Idle (Claude-1, GPT-4-1,
  Perplexity-1)
- Credit balance captured pre-session
- Network tab recording enabled for the entire session
- Browser DevTools Performance tab optional

**Step sequence**:

### J2.1 — Dispatch a task requiring research + synthesis + draft
- **ACTION**: Persona types the complex task prompt (see persona files);
  click Submit
- **EXPECTED OBSERVABLE**: Router decomposes task; at least 2 agents
  transition Idle → Working, in sequence (not parallel for this test —
  we want to observe handoff ordering)
- **VERIFICATION**:
  - Screenshot sequence at t+1s, t+5s, t+15s capturing status changes
  - Network tab: multiple POSTs to agent endpoints, in temporal sequence
  - Live Activity log shows ordered handoff events
- **FAIL SIGNAL**:
  - Only one agent ever goes Working (router failed to decompose)
  - All agents go Working simultaneously (parallelism when handoff was
    needed — context can't flow in parallel)
  - Handoff event in log is not paired with actual agent state change

### J2.2 — INSPECT HANDOFF PAYLOAD (the critical step)
- **ACTION**: Open Network tab during the handoff window. Locate the
  POST request to Agent B (the second agent in sequence). Examine
  request body.
- **EXPECTED OBSERVABLE**: Request body to Agent B contains MEANINGFUL
  SUBSTRING from Agent A's output — not just "use context from prior
  step" but actual text from Agent A's response
- **VERIFICATION**:
  - Capture Agent A's full output text (string S_A)
  - Capture Agent B's full request body (string R_B)
  - Assertion: R_B contains a contiguous substring from S_A of
    length ≥ 20 characters (proves real text transfer, not just
    reference passing)
  - Additional assertion: R_B does not contain placeholder strings
    like "{{previous_output}}" or "[context from agent A]" (proves
    templating was resolved, not left as template)
- **FAIL SIGNAL**:
  - R_B contains no substring match to S_A
  - R_B contains unresolved templating
  - R_B references context by ID only with no inline text
    (acceptable ONLY if system uses RAG-style retrieval AND B's output
    later shows retrieval evidence)

### J2.3 — Verify Agent B output references Agent A's specifics
- **ACTION**: Wait for Agent B output. Compare B's output to A's output.
- **EXPECTED OBSERVABLE**: B's output contains at least 2 SPECIFIC
  factual elements from A's output (names, numbers, dates, citations,
  proper nouns)
- **VERIFICATION**:
  - Extract named entities from A's output (proper nouns, numbers, dates)
  - Scan B's output for those entities
  - Assertion: B's output matches ≥ 2 of A's entities
- **FAIL SIGNAL**:
  - B's output is topically related but references no A-specific content
  - B's output could have been produced without A ever running
  - B's output contradicts A's output on a fact A established

### J2.4 — Complete handoff chain (if 3+ agents involved)
- **ACTION**: For Eric's/Danielle's prompts requiring 3 agents, verify
  A→B→C handoff also passes J2.2 and J2.3 assertions for B→C leg
- **EXPECTED OBSERVABLE**: C's output references B's specifics; C's
  request payload contains B's output text
- **VERIFICATION**: Repeat J2.2 and J2.3 methods for second handoff
- **FAIL SIGNAL**: Second handoff fails even if first succeeded (reveals
  context degradation over chain length)

### J2.5 — Credit deduction correctness
- **ACTION**: After full chain completes, query credit balance
- **EXPECTED OBSERVABLE**: Credit deduction matches number of agent
  calls (within published per-call cost)
- **VERIFICATION**:
  - Pre-session balance captured; post-session balance captured
  - Deduction = expected per-call cost × number of calls observed
    in network tab
- **FAIL SIGNAL**:
  - Deduction greater than expected (overcharge)
  - Deduction less than expected (revenue leak — each call must cost)
  - Deduction is exactly zero despite dispatches (billing broken)

### J2.6 — Live Activity log integrity
- **ACTION**: Open Live Activity panel; scroll to this session's events
- **EXPECTED OBSERVABLE**: Log shows every handoff with timestamp,
  source agent, target agent, task_id linkage
- **VERIFICATION**: Log row count matches handoff count from J2.1;
  timestamps are monotonic
- **FAIL SIGNAL**: Log missing handoffs; log shows handoffs not observed
  in network tab (phantom entries); timestamps out of order

### J2.7 — CCF checkpoint auto-fire
- **ACTION**: On `task_complete` event, check for checkpoint creation
- **EXPECTED OBSERVABLE**: CCF (Conversation Checkpoint Framework)
  checkpoint row created in backend or visible in Outputs panel
- **VERIFICATION**: Backend query or Outputs panel scan for checkpoint
  with this task_id
- **FAIL SIGNAL**: Task completed but no checkpoint created

**Total assertions**: 22
**Estimated duration per persona**: 12 minutes for DEEP, 5 for STRUCTURAL
**Total J2 runtime**: ~35 min

---

## J3 — Failure recovery

**Purpose**: Prove that when something goes wrong, the product fails LOUDLY
and CORRECTLY — not silently, not with confusion.

**Claims exercised**: C1, C2, C5

**Personas run**:
- P2 Eric — DEEP
- P3 Danielle — DEEP
- P1 Iris — STRUCTURAL (does she understand what went wrong?)
- P4 Marcus — STRUCTURAL

**Preconditions**:
- Ability to inject failures (revoke a test key mid-session OR
  use a known-broken agent slot)
- Baseline healthy state verified before injection

**Step sequence**:

### J3.1 — Dispatch during healthy state
- **ACTION**: Submit a task while all agents are Idle
- **EXPECTED OBSERVABLE**: Normal dispatch (as in J1.4)
- **VERIFICATION**: As J1.4
- **FAIL SIGNAL**: If this step fails, J3 is invalid — check environment

### J3.2 — Inject failure on Agent A mid-chain
- **ACTION**: While Agent A is Working, revoke its credentials OR force
  rate-limit (via Settings > Integrations toggle)
- **EXPECTED OBSERVABLE**:
  - Within 10s, Agent A state transitions to Error/Failed (not stuck Working)
  - Error state has visible icon AND human-readable explanation in UI
  - Router reacts: either fails the entire chain with a clear message,
    OR reroutes to a fallback agent (if configured)
- **VERIFICATION**:
  - Screenshot at t+10s post-injection
  - DOM scan for error class / role="alert" / icon with error semantics
  - Error text extracted; must not be raw JSON or stack trace
  - Network tab: 401/429/500 captured on original agent; subsequent
    router decision visible
- **FAIL SIGNAL**:
  - Agent stays Working indefinitely (silent failure — PRODUCT KILLER)
  - Error shows raw JSON or stack trace (P1/P4 would quit immediately)
  - No user-facing notification at all
  - Router tries to continue handoff with failed agent's output (which
    doesn't exist)

### J3.3 — Persona-specific error comprehension
- **ACTION**: Persona reads error message
- **EXPECTED OBSERVABLE**:
  - P1/P4: message is in plain language, names the problem, suggests a
    next action
  - P2/P3: message is specific enough to debug (agent name, error type,
    retry/reauth suggestion)
- **VERIFICATION**: Orchestrator reads error text aloud as persona;
  annotates as "comprehensible" or "opaque" per persona
- **FAIL SIGNAL**: P1 would not know what happened or what to do

### J3.4 — Recovery path works
- **ACTION**: Follow the error's suggested next action (re-auth, retry,
  switch agent)
- **EXPECTED OBSERVABLE**: Recovery completes successfully; task either
  resumes from checkpoint OR dispatches fresh with same context
- **VERIFICATION**: Post-recovery dispatch exhibits J1.4 behavior
- **FAIL SIGNAL**: Recovery action doesn't work; error state is terminal
  with no path forward

### J3.5 — Credit handling on failure
- **ACTION**: Check credit balance after failure
- **EXPECTED OBSERVABLE**: Credits deducted only for agents that actually
  produced output (failed agent call is not billed, OR is billed and
  reflected transparently)
- **VERIFICATION**: Pre/post credit comparison; expected deduction
  calculated from successful calls only
- **FAIL SIGNAL**: Charged for failed call AND no notification of charge

**Total assertions**: 14
**Estimated duration per persona (DEEP)**: 10 minutes
**Total J3 runtime**: ~25 min

---

## J4 — Returning user / state persistence

**Purpose**: Prove that the product remembers who you are and what you
were doing across sessions.

**Claims exercised**: C1, C3, C7

**Personas run**:
- P2 Eric — DEEP
- P1 Iris — SURFACE
- P3 Danielle — STRUCTURAL
- P4 Marcus — SURFACE

**Preconditions**:
- Completed J1 or J2 in same browser earlier
- Full session closed (tab closed, not just refresh)

**Step sequence**:

### J4.1 — Re-open app in new tab
- **ACTION**: Close all tabs, wait 60s, open `app.command.globalinkservices.io`
- **EXPECTED OBSERVABLE**: Still authenticated (no re-login needed if
  within session window); dashboard renders with prior state
- **VERIFICATION**: Post-load screenshot; compare agent list, task history
  to pre-close state
- **FAIL SIGNAL**: Re-login prompted (unless >24h); dashboard empty when
  it shouldn't be

### J4.2 — Prior outputs accessible
- **ACTION**: Navigate to Outputs/History section
- **EXPECTED OBSERVABLE**: Prior session's outputs are listed with
  timestamps, task previews, and are clickable
- **VERIFICATION**: DOM scan for output rows; click one to verify full
  content loads
- **FAIL SIGNAL**: Outputs missing; outputs listed but content 404s;
  outputs show other users' data (MULTI-TENANT VIOLATION — CRITICAL)

### J4.3 — Resume from checkpoint (if applicable)
- **ACTION**: If prior session had a CCF checkpoint, attempt resume
- **EXPECTED OBSERVABLE**: Resume loads prior context; next dispatch
  has access to prior handoff chain
- **VERIFICATION**: Dispatch a follow-up task that references prior
  output ("summarize what you just researched"); verify output references
  prior content
- **FAIL SIGNAL**: Resume is broken; follow-up task treats as fresh session

### J4.4 — Workspace isolation
- **ACTION**: Sign out, sign in as different test user (if provisionable),
  OR verify via URL manipulation that prior workspace isn't visible
- **EXPECTED OBSERVABLE**: Other workspace's data is NOT visible
- **VERIFICATION**: DOM scan of new session shows no P2 test user content
- **FAIL SIGNAL**: Any data leak across workspaces (CRITICAL —
  MULTI-TENANT VIOLATION)

**Total assertions**: 10
**Estimated duration per persona (DEEP)**: 8 minutes
**Total J4 runtime**: ~18 min

---

## J5 — Pilot → paid conversion

**Purpose**: Prove that the money path works, end-to-end, with correct
tier display and correct Stripe routing.

**Claims exercised**: C4, C6

**Personas run**:
- P2 Eric — DEEP (he's the actual conversion target)
- P4 Marcus — STRUCTURAL (does pricing feel fair?)
- P3 Danielle — STRUCTURAL
- P1 Iris — SURFACE

**Preconditions**:
- BILL-02 fix deployed to production (✅ commit 3593d49 pushed;
  Vercel deploy status must be confirmed before running this journey)
- Test user currently on Pilot (Free) tier

**Step sequence**:

### J5.1 — Navigate to billing page
- **ACTION**: Click Settings > Billing (or equivalent nav)
- **EXPECTED OBSERVABLE**:
  - Page title reads "Billing — COMMAND"
  - 4 tier cards visible: Solo $49, Founding Member Pro $99, Standard
    Pro $149, Agency $799
  - NO "Studio $349" anywhere
  - Current plan label reads "Pilot (Free)" — NOT "Pro"
  - Days remaining in pilot visible
- **VERIFICATION**:
  - Full page screenshot
  - DOM scan for each tier's price text
  - DOM scan for string "Studio" — must return zero matches
  - Current plan indicator verified against backend (Supabase workspace.plan)
- **FAIL SIGNAL**: Missing tiers; phantom tiers; wrong current plan;
  hardcoded current plan (not computed from subscription state)

### J5.2 — Click Activate on Founding Member
- **ACTION**: Click "Activate" or equivalent CTA on FM tier card
- **EXPECTED OBSERVABLE**: Redirect to Stripe checkout page
  `buy.stripe.com/...` or `checkout.stripe.com/...` within 3s
- **VERIFICATION**:
  - Post-click URL captured; must start with `https://checkout.stripe.com/`
    or `https://buy.stripe.com/`
  - Checkout page shows $99/mo line item (NOT $149, NOT $349)
  - Checkout page shows COMMAND product name
  - cs_live_ session id visible in URL (not cs_test_ — unless explicitly
    in test mode)
- **FAIL SIGNAL**:
  - Redirect to wrong Stripe link (e.g., Standard Pro link)
  - Price on checkout doesn't match tier card price
  - cs_test_ in production environment
  - Redirect fails / 404

### J5.3 — Verify Standard Pro tier routes correctly
- **ACTION**: Go back to billing; click Activate on Standard Pro
- **EXPECTED OBSERVABLE**: Redirect to DIFFERENT Stripe checkout
  showing $149/mo
- **VERIFICATION**: URL captured; must be different cs_ session from J5.2;
  price on checkout = $149
- **FAIL SIGNAL**: Same Stripe link as FM (consolidation violation —
  HARD RULE breach)

### J5.4 — Glossary affordance live
- **ACTION**: Hover over "Pilot" / "Agent" / "Operator" terms on billing page
- **EXPECTED OBSERVABLE**: Cursor shows help cursor; terms show dotted
  underline; hovering triggers tooltip with definition
- **VERIFICATION**:
  - Computed style inspection: `[data-glossary]` has
    `text-decoration: underline dotted` and `cursor: help`
  - Hover state triggers tooltip element in DOM
  - Tooltip text matches glossary.ts definitions
- **FAIL SIGNAL**: No dotted underline; cursor unchanged; tooltip missing

### J5.5 — Abandon checkout, return to app
- **ACTION**: On Stripe page, click browser back button
- **EXPECTED OBSERVABLE**: Return to billing page; still on Pilot tier;
  no phantom "pending" state
- **VERIFICATION**: Billing page shows same state as J5.1
- **FAIL SIGNAL**: Workspace shown as upgraded despite no payment; stuck
  in pending state

**Total assertions**: 16
**Estimated duration per persona (DEEP)**: 10 minutes
**Total J5 runtime**: ~22 min

---

## Total runtime estimate

| Journey | DEEP cells | STRUCTURAL cells | SURFACE cells | Total min |
|---|---|---|---|---|
| J1 | 3 | 1 | 0 | ~25 |
| J2 | 2 | 2 | 0 | ~35 |
| J3 | 2 | 2 | 0 | ~25 |
| J4 | 1 | 1 | 2 | ~18 |
| J5 | 1 | 2 | 1 | ~22 |
| **Total** | **9** | **8** | **3** | **~125 min** |

Plus orchestrator overhead (proof log writing, screenshot organization,
scoring): 40-50 min.

**Full Symphony v12 session estimate: 2.5-3 hours, $5-8 credits.**
