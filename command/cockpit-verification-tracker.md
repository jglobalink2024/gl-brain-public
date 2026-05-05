[PERSISTENT]
Last updated: 260505
Author: CC audit session
Session: [GL/COMMAND | BUILD | C4 Penalty Audit · Semantic Matcher | 260505]

# COMMAND Cockpit — Verification Tracker

Cross-reference: cockpit-done-definition.md (the criteria)
Purpose: tracks evidence, test status, and blockers for each of the 6 criteria.
Update on each verification walk.

## Sequence (unblock order)

C4 → C3 → C2 → C1 → C5 → C6

C4 must be fixed before C3 verification is worth running (routing correctness
gates status accuracy). C2 gates on C3. C1 gates on C2. C5 is independent but
requires product stability. C6 is currently trivially met (coming-soon page).

---

## C4 — Task routing considers availability and load, not just type

**Status: FAIL**
**Gating: blocks C3 → C2 → C1 sequence**

### Criterion
> "Task routing considers availability and load, not just type"

### Evidence
- File: command-app/command-app/lib/pipeline/semanticMatcher.ts
- Formula: combinedScore = keywordScore × 0.6 + historyScore × 0.4
- No load term. No availability signal beyond error-status exclusion.
- status, task_success_rate, avg_token_efficiency fetched but unused in scoring.
- Audited: 260505

### Fix required
Add in-flight task count query + loadPenalty term. Session size: S.
See decisions.md 260505 entry for full spec.

### Pass criteria
- [ ] inflightCount query added; runs within scoreAgentsForTask
- [ ] loadPenalty = min(inflightCount × 10, 30) applied to combinedScore
- [ ] inflightCount + loadPenalty exposed on AgentScore interface
- [ ] Playwright test: same-type agents; idle scores higher than agent with 2 active tasks
- [ ] Score delta is non-zero and monotonic with in-flight count
- [ ] routing_decisions.candidate_agents shows loadPenalty field

---

## C3 — Agent status reflects actual use, not webhook theater

**Status: IMPROVING (as of 260503)**
**Gating: blocked until C4 PASS**

### Criterion
> "Agent status reflects actual use, not webhook theater"

### Evidence (260503 walk)
- Sidebar polling 5–30s shipped
- Realtime subscription on agents table NOT shipped (I-3 known gap)
- Status updates lag by up to 30s without Realtime
- Cannot verify accurately until routing is load-aware (C4)

### Pass criteria
- [ ] Realtime subscription on agents table ships (I-3)
- [ ] Status update latency < 5s for in-flight state changes
- [ ] Playwright test: task dispatched → agent status shows 'active' within 5s
- [ ] Playwright test: task completed → agent status returns to 'idle' within 5s

---

## C2 — One real end-to-end handoff works across 2+ vendors without copy-paste

**Status: PARTIAL (as of 260503)**
**Gating: blocked until C3 PASS**

### Criterion
> "One real end-to-end handoff works across at least 2 vendors without copy-paste"

### Evidence (260503 walk)
- autoHandoff code exists
- J2_handoff_deep BLOCKED on entity carry-through bug
- Chain test parked Tier 1
- No observable browser-side end-to-end test passing

### Pass criteria
- [ ] J2_handoff_deep entity carry-through bug resolved
- [ ] Playwright test: Vendor A output → Vendor B input, no manual copy-paste
- [ ] Test passes with real API calls (not mocks)
- [ ] Two distinct vendors confirmed (e.g., Perplexity → Claude)

---

## C1 — Non-technical operator installs and starts using in under 10 minutes

**Status: PARTIAL (as of 260503)**
**Gating: blocked until C2 PASS**

### Criterion
> "A non-technical operator can install and start using it in under 10 minutes"

### Evidence (260503 walk)
- Pooled-key fallback shipped
- No documented run with real non-technical user

### Pass criteria
- [ ] One real non-technical user (not Jason) completes onboarding in ≤10 min
- [ ] Session recorded or observed
- [ ] No support intervention during onboarding
- [ ] User can dispatch first task unassisted

---

## C5 — 3 people who aren't Jason have used it for 7+ days and returned unprompted

**Status: NOT MET (as of 260503)**
**Gating: independent; requires product stability**

### Criterion
> "3 people who aren't Jason have used it for 7+ days and returned unprompted"

### Evidence (260503 walk)
- Zero of three
- Eric repurposed as discovery user 260503 (decisions.md) — does not count
  toward C5 until 7 unprompted return days observed

### Pass criteria
- [ ] 3 confirmed discovery users with ≥7 days of unprompted return usage
- [ ] Logged in decisions.md with dates
- [ ] None were promised features the product cannot yet deliver

---

## C6 — Pitch on landing page matches what the product does, sentence for sentence

**Status: MET (trivially) (as of 260503)**
**Note: coming-soon page promises nothing; will need re-evaluation when real landing ships**

### Pass criteria
- [ ] When real landing page ships: each claim audited against actual product behavior
- [ ] No claim that outpaces shipped functionality

---

## Walk History

| Date | Session | Overall |
|------|---------|---------|
| 260503 | [GL \| STRATEGY \| Cockpit-Done Recovery · Eric Repurpose \| 260503] | Not real |
| 260505 | [GL/COMMAND \| BUILD \| C4 Penalty Audit · Semantic Matcher \| 260505] | Not real — C4 FAIL confirmed |
