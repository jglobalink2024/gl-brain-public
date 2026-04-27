# COMMAND Cockpit — "Done" Definition
[PERSISTENT]
Last updated: 260427

## The Rule

This file defines when the COMMAND cockpit is real enough to show real users.
Do not move these goalposts without a dated brain commit explaining why.
If all six criteria below are true, it's real. Until then, it's not for sale.

---

## The Six Criteria

1. **Install gate** — A non-technical operator can install the Chrome extension
   and reach their first task handoff in under 10 minutes, unassisted.

2. **Real handoff** — At least one end-to-end context handoff works across
   two different vendors (e.g., Claude → ChatGPT, or Perplexity → Claude)
   without any manual copy-paste from the user.

3. **Honest agent status** — Agent status in the cockpit dashboard reflects
   actual agent availability or activity, not webhook theater or stale pings.

4. **Real routing** — Task routing considers actual agent availability and
   recent load — not just task type match. The router has to know something
   real about the agents it's sending work to.

5. **Seven-day retention** — At least three people who are not Jason have
   used COMMAND for seven or more days and returned to it without being
   prompted to do so.

6. **Pitch-product parity** — Every sentence on the landing page matches
   something the product actually does. No aspirational claims, no demo-mode
   features. Walk the homepage with a new user and every sentence should be
   demonstrable live.

---

## What "Done" Is Not

- "Done" is not when the golden path smoke test passes. That's engineering hygiene.
- "Done" is not when Eric gets his invite. Eric getting his invite is a milestone,
  not the finish line.
- "Done" is not when the dashboard looks good in a screenshot. Visual fidelity is not
  product fidelity.
- "Done" is not when the build calendar hits Phase 4. Calendar alignment is a proxy,
  not the thing.

---

## Who Can Unlock Beta

Design partners (3–5 people who watch you use COMMAND on real work and give feedback)
come before beta users. Beta users who get access before criteria 1–6 are met are
a liability — they form opinions about a product that doesn't exist yet.

Gate sequence:
  Design partner watch sessions → criteria 1–4 verified →
  3 people use it for 7 days (criterion 5) → pitch-product audit (criterion 6) →
  beta invites open

---

## Locked: 260427
Rationale: Pure Path A decision. See gl-brain/command/decisions.md entry 260427.
