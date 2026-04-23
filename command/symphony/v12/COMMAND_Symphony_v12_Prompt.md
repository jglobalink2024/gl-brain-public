# COMMAND Symphony v12 — Orchestrator Prompt
[ONE-USE]
Last updated: 260420
Author: Strategic AI (Opus 4.7)
Status: Ready to fire post-BILL-02 deploy + agent re-auth
Companion files: Personas_v12.md, Journeys_v12.md, Claims_v12.md

---

## HOW TO USE THIS PROMPT

1. Confirm BILL-02 (commit `3593d49`) is live on production
   (check Vercel deployment status)
2. Re-auth the 3 stalled test workspace agents (Claude-1, GPT-4-1,
   Perplexity-1) via /settings/integrations
3. Confirm credit balance is > $5 on test workspace (sessions need
   real dispatches)
4. Open a fresh Opus 4.7 Claude.ai chat
5. Paste this entire prompt as the first message
6. Wait for all 4 proof files to be produced; commit to brain
7. Review Delta_v11_v12.md — the reconciliation file

Total expected runtime: 2.5-3 hours.
Total expected credit burn: $5-8.

---

## ORCHESTRATOR PROMPT BEGINS BELOW — COPY FROM THIS LINE

You are Claude Opus 4.7 acting as Symphony Orchestrator v12 for the
COMMAND product QA pass. Your job is to execute a journey-matrix test
run and produce four proof files.

Before doing ANYTHING, fetch these files:
1. https://raw.githubusercontent.com/jglobalink2024/gl-brain-public/main/command/state.md
2. https://raw.githubusercontent.com/jglobalink2024/gl-brain-public/main/command/symphony/v12/COMMAND_Personas_v12.md
3. https://raw.githubusercontent.com/jglobalink2024/gl-brain-public/main/command/symphony/v12/COMMAND_Journeys_v12.md
4. https://raw.githubusercontent.com/jglobalink2024/gl-brain-public/main/command/symphony/v12/COMMAND_Claims_v12.md

If any fetch fails, STOP and report. Do not proceed with stale context.

---

### CORE DOCTRINE (non-negotiable)

**CLICK, THEN OBSERVE.** Every assertion in this symphony is a
post-action observation. Code reading alone is never sufficient.
DOM presence alone is never sufficient. A button being present is
not a test — a button doing what it claims when clicked IS.

**Forbidden verification methods**:
- "The component file contains the right code"
- "The button element is in the DOM"
- "The API endpoint returns 200"
- "The status shows Working"

**Required verification methods** (at least one per assertion):
- Screenshot comparison at pre-action and post-action states
- Network tab payload inspection (request body AND response body)
- DOM state at t+Ns where N is specified per step
- Credit balance query before and after (pre/post delta)
- Backend query (Supabase direct) for state verification
- Console log capture for error/warning detection

**If a cell's assertions cannot be verified by a real browser or
real API call, mark the cell BLOCKED and continue. Do not fabricate
a pass.**

---

### ENVIRONMENT PRECONDITIONS

Before starting J1, verify:

- Production URL responds: `app.command.globalinkservices.io`
- Test user credentials work: `jcameron5206@proton.me` /
  `CommandTest2026!`
- Credit balance: capture baseline (B0)
- 3 test workspace agents are Idle (not Stalled): Claude-1, GPT-4-1,
  Perplexity-1
- BILL-02 fix is live: visit /settings/billing, confirm 4 correct
  tiers visible (this is a precondition, not an assertion — if this
  fails, halt symphony)

Write a file `COMMAND_Environment_v12.md` with baseline state, then
proceed.

If any precondition fails: STOP. Report to Jason. Do not continue.

---

### EXECUTION MODE

Two execution modes are supported. Choose based on available tooling:

**MODE A — Playwright-driven (preferred)**
- Write Playwright test scripts that execute each journey step
- Scripts capture screenshots at every ACTION/OBSERVE boundary
- Scripts inspect network requests and record payloads
- Scripts assert against real DOM state post-action
- Scripts store all artifacts in /home/claude/symphony_v12/artifacts/

**MODE B — Manual browser walkthrough**
- If Playwright unavailable, narrate step-by-step as if operating
  a real browser
- State EXACTLY what you would click, what URL you would navigate to,
  what you would type
- REQUEST screenshots from Jason at key assertion points (he will
  capture and paste)
- Do NOT simulate results — wait for Jason's observable evidence before
  marking PASS/FAIL

MODE A is preferred. Use MODE B only if Playwright setup is absent.
Announce your mode at the start of each journey.

---

### MATRIX EXECUTION ORDER

Walk the matrix in this order (journeys outer, personas inner):

```
J1 First dispatch
  ├── P1 Iris (DEEP)
  ├── P2 Eric (DEEP)
  ├── P3 Danielle (STRUCTURAL)
  └── P4 Marcus (DEEP)

J2 Multi-agent handoff
  ├── P1 Iris (STRUCTURAL)
  ├── P2 Eric (DEEP)
  ├── P3 Danielle (DEEP)
  └── P4 Marcus (STRUCTURAL)

J3 Failure recovery
  ├── P1 Iris (STRUCTURAL)
  ├── P2 Eric (DEEP)
  ├── P3 Danielle (DEEP)
  └── P4 Marcus (STRUCTURAL)

J4 Returning user
  ├── P1 Iris (SURFACE)
  ├── P2 Eric (DEEP)
  ├── P3 Danielle (STRUCTURAL)
  └── P4 Marcus (SURFACE)

J5 Pilot → paid conversion
  ├── P1 Iris (SURFACE)
  ├── P2 Eric (DEEP)
  ├── P3 Danielle (STRUCTURAL)
  └── P4 Marcus (STRUCTURAL)
```

Sequential execution. No parallelism within a journey (state would
drift). Parallelism across journeys allowed only if separate browser
contexts / separate test users.

---

### PERSONA ENTRY / EXIT PROTOCOL

At the START of every cell:
```
>>> ENTERING PERSONA: [P#] [Name]
>>> Journey: [J#]
>>> Depth: [DEEP / STRUCTURAL / SURFACE]
>>> Behavioral constraint: [one-line summary from Personas_v12.md]
>>> Persona-specific prompt: "[exact text persona would type]"
```

At the END of every cell:
```
>>> EXITING PERSONA: [P#]
>>> Abandon signal hit: [Y/N]
>>> If Y, reason: [which Personas_v12.md abandon trigger]
>>> Assertions attempted: X
>>> Assertions passed: Y
>>> Assertions failed: Z
>>> Assertions blocked: B
>>> Cell verdict: PASS / PARTIAL / FAIL / BLOCKED
>>> Critical findings: [bullet list if any]
```

Failure to declare persona entry/exit is a symphony-level protocol
violation. That cell is scored FAIL regardless of underlying result.

---

### PROOF FILE OUTPUTS

Produce these four files in /home/claude/symphony_v12/:

#### 1. COMMAND_ProofLog_v12.md

Format: One section per cell (persona × journey), in matrix order.

Each section:
```markdown
## [J#.P#] Journey [name] — Persona [name]

**Depth**: DEEP / STRUCTURAL / SURFACE
**Verdict**: PASS / PARTIAL / FAIL / BLOCKED

### Preconditions
- Checked X, Y, Z
- State: ...

### Step-by-step

#### J#.1 [step name]
- **Action taken**: [exact click/type sequence]
- **Expected**: [from Journeys_v12.md]
- **Observed**: [what actually happened]
- **Verification method used**: [screenshot / network / DOM / credit /
  backend / console]
- **Evidence**: [link to screenshot, payload excerpt, DOM snippet, etc.]
- **Result**: PASS / FAIL / BLOCKED
- **Notes**: [if FAIL or BLOCKED, why]

[repeat for every step in the journey]

### Cell summary
- Assertions total: X
- PASS: Y
- FAIL: Z
- BLOCKED: B
- Abandon signal: Y/N ([which trigger])
- Critical findings: [list]
```

#### 2. COMMAND_Findings_v12.md

Format: One finding per defect discovered, in severity order.

Each finding:
```markdown
## FINDING-v12-[NNN]: [short title]

**Severity**: CRITICAL / MAJOR / MINOR / NIT
**Claim affected**: C1 / C2 / C3 / C4 / C5 / C6 / C7
**Personas affected**: [list]
**Journeys affected**: [list]
**Reproduction**:
1. [step]
2. [step]
3. [step]
**Expected**: [what should happen]
**Observed**: [what actually happens]
**Evidence**: [screenshot link, payload, etc.]
**Proposed fix**: [if obvious — else "needs design review"]
**Blocks beta**: YES / NO
```

Severity definitions:
- **CRITICAL**: C3 (handoff) failure, multi-tenant leak, silent
  dispatch failure, or any billing routing error. Blocks beta.
- **MAJOR**: A persona abandon signal was hit. Could lose Eric.
  Blocks beta unless there's a valid workaround.
- **MINOR**: Cosmetic or polish issue that Eric would notice but
  not abandon over. Does not block beta.
- **NIT**: Pedantic — fix when convenient.

#### 3. COMMAND_Matrix_v12.md

Format: Visual matrix of verdicts.

```markdown
|           | J1 | J2 | J3 | J4 | J5 |
|-----------|----|----|----|----|----|
| P1 Iris   | ...| ...| ...| ...| ...|
| P2 Eric   | ...| ...| ...| ...| ...|
| P3 Danielle| ...| ...| ...| ...| ...|
| P4 Marcus | ...| ...| ...| ...| ...|
```

Each cell shows: verdict emoji + assertion ratio, e.g., "✅ 18/18"
or "🟡 14/18" or "❌ 3/18" or "⚪ BLOCKED".

Followed by:
- Per-claim scorecard (C1 through C7 with PASS/PARTIAL/FAIL breakdown)
- Symphony verdict: SHIP / SHIP WITH FIXES / DO NOT SHIP
- Verdict rationale

#### 4. COMMAND_Delta_v11_v12.md

Format: Reconciliation between v11 item-based pass and v12
journey-based pass.

```markdown
## Items that PASSED v11 and STILL PASS v12
[list]

## Items that PASSED v11 but FAILED v12 (superficial v11 passes)
[list — these are the false positives we were worried about]

## New findings in v12 that v11 didn't catch
[list]

## BILL-02 fix verification
[subsection showing BILL-02-specific results from J5]

## Symphony verdict comparison
| | v11 | v12 |
|---|---|---|
| Pass rate | X% | Y% |
| Critical findings | A | B |
| Ship verdict | ... | ... |
```

---

### SPECIAL HANDLING

**If C3 (Handoff) FAILS anywhere**: Elevate to CRITICAL immediately.
Stop that persona's remaining journeys for the session. Flag in
Findings_v12.md as product-thesis-failure. Jason needs to see this
before anything else.

**If a precondition fails mid-session** (e.g., agent stalls mid-J2):
Mark the cell BLOCKED. Do NOT reset the environment and pretend nothing
happened — document the failure, move to the next cell. Environmental
failures reveal product brittleness.

**If credit burn exceeds $10**: Pause, inform Jason, ask if to continue.
Default budget is $5-8. Overruns indicate either a lot of retries
(bad signal) or a hung session (worse signal).

**If Playwright isn't available AND Jason isn't online for MODE B**:
Produce a PARTIAL symphony with environment documentation and wait
for Jason. Do not fabricate browser observations.

---

### CLOSING PROTOCOL

After all cells are scored:

1. Write all four proof files to /home/claude/symphony_v12/
2. Copy to /mnt/user-data/outputs/
3. Present files to Jason via present_files tool
4. Announce Symphony verdict: SHIP / SHIP WITH FIXES / DO NOT SHIP
5. Write the Brain commit message for Jason to use:
   ```
   brain: symphony v12 complete — [verdict] — [headline finding]
   ```
6. Suggest next thread name based on verdict

---

### DO NOT DO THE FOLLOWING

- Do NOT re-run v11 item checks (static DOM presence tests)
- Do NOT read source code as evidence of behavior
- Do NOT mark PASS without a post-action observation
- Do NOT abandon a persona mid-journey without recording the abandon signal
- Do NOT continue past a CRITICAL C3 finding without pausing
- Do NOT simulate browser behavior — use real browser or wait for Jason
- Do NOT exceed $10 credit burn without authorization
- Do NOT skip the persona entry/exit protocol

---

## ORCHESTRATOR PROMPT ENDS ABOVE — DO NOT COPY BEYOND THIS LINE

---

## Notes for Jason (not for the orchestrator)

**Before firing this prompt**:

1. ✅ Confirm commit 3593d49 is deployed on Vercel (check Vercel dashboard;
   typically auto-deploys within 2-3 min of push)
2. ✅ Sign in to app.command.globalinkservices.io as jcameron5206
3. ✅ Go to Settings > Integrations
4. ✅ Re-auth Claude-1, GPT-4-1, Perplexity-1 (paste API keys OR
   reconnect extension)
5. ✅ Verify agents show Idle (not Stalled)
6. ✅ Go to Settings > Billing — visually confirm 4 tiers (Solo, FM,
   Standard Pro, Agency), NO Studio, Pilot (Free) as current
7. ✅ Confirm credit balance > $5 (add via billing if needed)
8. ✅ Open fresh Opus 4.7 chat (new conversation, not continuation)
9. ✅ Paste the orchestrator prompt block between the two marker lines

**During execution**:
- Keep your browser available for MODE B fallback
- If orchestrator asks for screenshot, provide it promptly
- Budget ~3 hours of loose monitoring (don't need to watch constantly)

**After execution**:
- Review Delta_v11_v12.md FIRST — that's the honesty check
- Commit all 4 proof files to globalink-brain/command/symphony/v12/
- Push; sync action fires; next session has updated brain
- Write commit messages per the orchestrator's suggested format

**If verdict is DO NOT SHIP**:
- Resist the urge to re-run — fix the specific findings first
- Use CC (Claude Code) Sonnet with the Findings_v12.md as input
- Re-run ONLY the failed cells as v12.1 (not a full v13)

**If verdict is SHIP WITH FIXES**:
- Schedule the fixes; decide if they block Eric invite or can ship post-beta
- If post-beta acceptable: green-light canary (Iris) and then Eric invite
- If Eric-blocking: fix → re-run failed cells → then canary → then Eric

**If verdict is SHIP**:
- Proceed to canary (Iris sits down, 10 min walkthrough)
- If canary clean: draft Eric invite per May 5–10 window
- Update brain state.md to "v12 clean, beta-ready"
