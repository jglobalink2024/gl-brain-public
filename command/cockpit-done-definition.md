[PERSISTENT]
Last updated: 260503
Author: Jason via CC + Chat
Origin: [GL | STR | Product Reckoning · Pure Path A Decision | 260423]
Source chat: https://claude.ai/chat/9f1c8333-04a4-401c-8bca-c8e630b8d409

# COMMAND Cockpit — "Done" Definition

This file is the locked gate for COMMAND cockpit readiness. Criteria
defined 260423 during Pure Path A reckoning. File created 260503 after
recovery from missing brain artifact (state.md 260427 entry claimed
"created and locked" — never actually written).

## The Six Criteria

COMMAND Cockpit is "real" when:

1. A non-technical operator can install and start using it in under 10 minutes
2. One real end-to-end handoff works across at least 2 vendors without copy-paste
3. Agent status reflects actual use, not webhook theater
4. Task routing considers availability and load, not just type
5. 3 people who aren't Jason have used it for 7+ days and returned unprompted
6. The pitch on the landing page matches what the product does, sentence for sentence

When those six are true, it's real. Until then, it's not for sale.

## Lock Conditions

The criteria do not move without:

1. Explicit decisions.md entry stating which criterion is being revised and why
2. Operator-blessed brain-committer commit (not catchup, not direct edit)
3. Rationale that does not collapse to "we wanted to make a decision the original criteria would have blocked"

If a future session feels pressure to revise these criteria, that pressure is the signal to slow down, not to revise. The whole point of writing this down was to prevent goalpost drift under pressure.

## Tested-Against Record

Each walk against current state appends below with date and session reference.

### 260503 walk (initial after recovery)
Session: [GL | STRATEGY | Cockpit-Done Recovery · Eric Repurpose | 260503]
- C1: PARTIAL — pooled-key fallback shipped, no documented run with real non-technical user
- C2: PARTIAL — autoHandoff code exists, no observable browser-side end-to-end test passing (J2_handoff_deep BLOCKED on entity carry-through, chain test parked Tier 1)
- C3: IMPROVING — sidebar polling 5–30s, Realtime subscription on agents not shipped (I-3 known)
- C4: NOT MET — keyword 60% + history 40%, semantic stubbed, load not a factor
- C5: NOT MET — zero of three. Eric repurposed as discovery user 260503 (decisions.md) — does not advance #5 until 7 unprompted return days observed
- C6: MET (trivially) — coming-soon page promises nothing

Overall: Not yet real by its own definition.

## Anti-Patterns

- Revising criteria on the day they would block a desired decision
- Soft-passing a criterion ("close enough")
- Treating "the code is written" as equivalent to "the criterion is met"
- Inviting users under "beta" framing while criteria are unmet (use "discovery user" or "early look" — see decisions.md 260503 Eric repurposing for the doctrine)
- Counting any user who was promised something the product can't deliver toward criterion #5
