---
name: COMMAND Pricing — Tiers, Stripe Links, FM Cohort, ROI Calculator
description: All pricing tiers with Stripe links, Founding Member details, ROI calculator formula, pilot vs trial rule. Source: GL_COMMAND_DOMAIN_PRICING_260330.md + SOP v8.
type: project
---

## Source documents
- `C:\Users\jdavi\Downloads\GL_COMMAND_DOMAIN_PRICING_260330.md`
- `C:\Users\jdavi\Downloads\COMMAND_SOP_v8.txt`

## Pricing tiers

| Plan | Price | Instances | Notes |
|------|-------|-----------|-------|
| Solo | $49/mo | 3 | Email support |
| Pro | $149/mo | 10 | Priority support — MOST POPULAR badge |
| Studio | $349/mo | Unlimited | 5 seats, dedicated onboarding |
| Agency | $799/mo | Unlimited | White-label, SLAs, LATAM localization |
| **Founding Member** | **$99/mo locked for life** | 10 (Pro-level) | vs $149 standard Pro; closes Sept 30, 2026 |

All plans: 14-day pilot, no credit card required.

## Stripe links (NEVER consolidate — keep separate)

- FM Pro: `https://buy.stripe.com/9B68wRgwAcp8dt2dJp9k407`
- Standard Pro: `https://buy.stripe.com/bJe00lfsw74O74E5cT9k408`
- Solo/Studio/Agency: **NOT YET CREATED** — gap to close

## Founding Member cohort

- Price: $99/mo locked for life (vs $149 standard Pro)
- Slots: 25 total (tracked manually in Notion Beta Users DB)
- Close date: **September 30, 2026** (was April 14 in earlier docs — corrected in SOP v8)
- Includes: Locked pricing, direct roadmap input, FM badge, 30-min onboarding call
- `STRIPE_FM_PRICE_ID` not yet in Vercel — **C4 critical gap — FM webhook falls through**

## The "$99 pilot" reference in discovery calls

The playbook references "$99 pilot" — this IS the Founding Member price ($99/mo locked vs $149 standard Pro). Not a separate product. When using pilot framing in calls: the FM offer IS the pilot offer. Use FM Stripe link.

## ROI calculator formula (for landing page — not yet live)

`(sessions/day × min/handoff × 5 days) / 60 = hours/week saved`
`value = hours/week saved × hourly rate`
`ROI = (value − $34/week) / $34 × 100%`

Inaction cost frame (use post-call in follow-up, NOT during call):
> "Operators running 3 AI tools spend 5–15 hours/week as the manual relay. At $200/hour billing rate, that's $1,000–3,000/month in invisible overhead. COMMAND pilot is $99."

## Annual pricing

Deferred to Phase 3. When ready: 20–25% discount vs monthly; show monthly equivalent on annual plan page.

## Gaps to close (non-critical but needed)

- Solo/Studio/Agency Stripe links not yet created
- Annual pricing deferred to Phase 3
- Pricing page not live on command-gl
- ROI calculator not yet on landing page
- FM cohort tracking is manual (Notion) — no automated seat counter

**Why:** The FM cohort is the conversion engine pre-beta. $99 locked pricing removes the "I'll check back later" response. Sept 30 deadline creates real urgency without lying.
**How to apply:** Always say "pilot" not "trial." FM offer is the default pilot offer for T1 HOT prospects. Never quote both prices in the same sentence without context — leads with FM ($99) as the active offer.
