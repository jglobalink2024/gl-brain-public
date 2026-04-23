# COMMAND — Symphony v11 Purchase Intent
# [EVIDENCE] Would Sandra pay? Real-browser-sourced verdict
# Date: 2026-04-17

---

## Bottom line

**Pays: YES — but via /pricing, not /settings/billing.**
If Sandra only had `/settings/billing` to go on, she would **NOT** pay (she can't find the $99 FM tier).

---

## Intent score (0–100)

- **Product-market fit signal on /pricing:** 95/100 — FM story is tight, ICP language precise, Stripe path loads cleanly
- **Dashboard first-impression:** 62/100 — honest but scary ("all 3 agents stalled")
- **Billing page trust signal:** 38/100 — tier mismatch caught mid-evaluation breaks the purchase moment

**Weighted composite: 72/100 — WOULD PURCHASE if they stay on /pricing path**

---

## What closes the sale

1. Locked-forever FM rate ($99 vs $149 Standard Pro) — *compelling loss-aversion frame, working as intended*
2. "25 of 25 slots remaining" scarcity counter — *credible because it's obviously real, not fake-countdown*
3. "No credit card required" pilot — *removes the commitment friction*
4. Clean outputs page with vendor attribution — *Sandra can show her boss "this was Claude, that was GPT"*
5. HubSpot OAuth already wired — *this is her exact pipeline tool*

---

## What kills the sale

1. **Billing page tier mismatch (MAJOR-04)** — blocks FM activation from the one place a current user naturally goes to spend money
2. Dashboard agents all stalled in the test environment — creates "is this product working?" doubt on page 1
3. Glossary affordance invisible — power users miss the definition system entirely until they accidentally hover

---

## Dollar-weighted fix priority

| Fix | Est. ARR impact if not fixed | Priority |
|-----|-----------------------------:|----------|
| BILL-02 billing/pricing tier mismatch | **$2.5K–5K per cohort cycle** | P0 — before next outbound wave |
| Glossary underline + cursor | < $500/cycle | P2 |
| Billing glossary anchors | < $500/cycle | P2 |
| Reconnect stalled test agents | operator/internal | P1 (QA productivity) |

---

## Would Sandra recommend?

**On /pricing path:** yes — "FM rate is a steal, they built exactly what I needed."
**On /billing friction path:** no — "I wanted to give them money and they couldn't find it to take."

---

## Conversion gate decision

**GO WITH FIX.**
Ship FM outreach once BILL-02 is resolved. Do not ship to FM before BILL-02 closes — the path from pilot → paid is broken for exactly the customers you want to convert.
