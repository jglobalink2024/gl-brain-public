# COMMAND — Symphony v11 Findings
# [EVIDENCE] Full production QA sweep — real browser only
# Date: 2026-04-17
# Operator: Jason Davis (GlobaLink LLC)
# Target: https://app.command.globalinkservices.io

---

## SEVERITY LEGEND
- **CRIT**: Blocks release or creates revenue/compliance risk
- **MAJOR**: User-visible regression, degrades core journey
- **MINOR**: Cosmetic or edge-case; does not block
- **NIT**: Polish / copy suggestion

---

## MAJOR-04 (NEW) — Billing page plan tiers do not match pricing page

**Where:** `/settings/billing`
**Severity:** MAJOR
**Evidence:** Symphony v11 BILL-02

**What:**
The billing page surfaces a different set of tiers than `/pricing`:

| Plan | /pricing (public) | /settings/billing |
|------|------------------:|------------------:|
| Solo | $49 | $49 |
| Standard Pro | $149 | renamed "Pro" $149 |
| Founding Member Pro ($99 locked) | ✅ present | ❌ MISSING |
| Agency ($799) | ✅ present | ❌ MISSING |
| Studio ($349) | ❌ not on pricing | ✅ phantom tier |

Additionally, the billing page marks "Pro $149" as "Current plan" — but the test user is in Pilot (Free, 11 days remaining). State mismatch.

**Why it matters:**
- An FM prospect who completes pilot and goes to /settings/billing to activate their locked $99 rate **cannot do so** — the tier isn't there.
- Agency tier is invisible from in-app billing — forces users back to /pricing or a sales touch.
- "Studio $349" is a phantom tier; implies product configuration that does not match public pricing.
- "Current plan" label lying to the user erodes trust.

**Fix:**
1. Replace `/settings/billing` SELECT A PLAN block with the same 4 tiers as /pricing (FM, Solo, Standard Pro, Agency).
2. Compute "Current plan" from user's actual subscription state, not a hard-coded default.
3. If user is FM-eligible and on pilot, FM tier CTA should be primary.

---

## MINOR-GLOSS — Billing page has zero glossary anchors

**Where:** `/settings/billing`
**Severity:** MINOR
**Evidence:** GLOSS-01

Terms like "Pilot", "Pro", "operators", "agent instances" appear with no `[data-glossary]` anchor. Non-blocking but reduces onboarding clarity.

**Fix:** Add glossary anchors for "Pilot", "Agent", "Operator" on billing.

---

## MINOR-TOOLTIP-STYLE — Glossary underline style not visible on hover

**Where:** `/outputs`, `/dashboard`, etc.
**Severity:** MINOR
**Evidence:** MAJOR-03

The spec expected `text-decoration: underline dotted` + `cursor: help` on `[data-glossary]`. Computed style shows:
- `textDecorationLine: none`
- `cursor: auto`

Functional tooltip opens correctly with `role="tooltip"` — so accessibility passes — but visual affordance that the term is hoverable is absent.

**Fix:**
```css
[data-glossary] { text-decoration: underline dotted; cursor: help; }
```

---

## MINOR-ENV — Test workspace has all 3 agents in "Stalled"

**Where:** `/dashboard`, all agent cards
**Severity:** MINOR (environmental, not product)
**Evidence:** JE-04, JG-03

Agents `Claude-1`, `GPT-4-1`, `Perplexity-1` all show "Stalled" / "NEEDS ATTENTION" in the test workspace. Product correctly surfaces the state honestly (not a regression), but blocks end-to-end dispatch testing this session.

**Fix:** Operator action — re-authenticate agents in the test workspace before next QA run. Log the root cause in a separate task (likely expired extension session token).

---

## NIT — Page title on /pricing reads generic

**Where:** `/pricing`
**Severity:** NIT

Title: `"COMMAND — Agent Operations Center"` (same as homepage)
Expected: `"Pricing — COMMAND"` for consistency with other page titles.

**Fix:** Set `<title>Pricing — COMMAND</title>` in the pricing route.

---

## Carried forward (no new findings)

F01, F02, F03, F04, F05, F06, F07, F08 all hold. CRIT-03 server-side key verification holds.

---

## Overall

- 0 CRIT
- 1 MAJOR (BILL-02)
- 4 MINOR
- 1 NIT

**Recommendation: GO WITH FIX.**
Fix BILL-02 before the first FM payment path is customer-visible (priority 1). MINOR items can bundle into next cosmetic sweep.
