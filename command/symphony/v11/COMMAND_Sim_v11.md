# COMMAND — Symphony v11 Real-User Simulation
# [EVIDENCE] Sandra-first simulation — app.command.globalinkservices.io
# Date: 2026-04-17
# Test user: jcameron5206@proton.me

---

## Sandra's first 10 minutes — ground truth

Sandra = boutique Sales/RevOps consultant running 3 AI agents in parallel tabs. Core ICP. First-time login to COMMAND.

### T+00:00 — Lands on `/`
Hits root, redirects to `/dashboard` (authenticated session persisted). **Friction: none.**

### T+00:10 — Sees dashboard
H1 "Agent Status Dashboard". Credit balance top-right: "⚡ Starter Credits — $9.94 remaining of $10.00". Three agent cards: Claude-1, GPT-4-1, Perplexity-1 — all showing **"Stalled / NEEDS ATTENTION"**.
**Sandra's read:** "Why are my agents broken? I haven't even started."
**Friction: HIGH** — but product is honest. This is a *test-environment state*, not a product bug.

### T+00:30 — Clicks "Send a Task" in sidebar → `/router`
Sees textarea "What do you need done? Be specific about the expected output." — types "Summarize yesterday's discovery call with Meridian Labs and extract BANT." Submits.
**Response:** Router returns `all_agents_unavailable: true`. UI shows warning, no silent failure.
**Sandra's read:** "OK, at least it told me. Let me fix my agent connection."

### T+01:00 — Navigates to `/settings/integrations`
Sees 3 BYOA cards (Anthropic, OpenAI, Perplexity) with "● Using COMMAND keys" default badge. Google + HubSpot OAuth Connect buttons visible.
**Sandra's read:** "Clean. I can just use COMMAND keys to start, or paste my own when I'm ready."

### T+02:00 — Tries a glossary hover on `/outputs`
Hovers "workspace" → tooltip appears: "Your team's shared environment in COMMAND."
**Sandra's read:** "Helpful. Though the word wasn't visually marked as hoverable — I only found it by accident."
**Friction: MINOR** (MINOR-TOOLTIP-STYLE finding)

### T+03:00 — Visits `/canvas`
Sees "Start from a template" with "Zero-Touch CRM Update" (exactly her use case). Copy: "Turn post-call notes into a structured CRM update automatically. Extracts BANT criteria and pushes to Google Sheets or HubSpot."
**Sandra's read:** "This is exactly my workflow. I want this."

### T+04:00 — Checks `/pricing`
Sees Founding Member Pro $99/mo (25/25 remaining, rate locked forever). Standard Pro $149. Solo $49. Agency $799.
**Sandra's read:** "FM is the obvious pick. Locked forever is a no-brainer."
Clicks "Start Free Pilot" on FM → Stripe checkout `cs_live_a1QwNmu4znCxe...` loads successfully.

### T+05:00 — Decides to check current state at `/settings/billing`
Sees "Pilot (Free) · 11 days remaining" + "Activate Pro Plan" CTA. But SELECT A PLAN block shows: **Solo $49 | Pro $149 (Current plan) | Studio $349**.
**Sandra's read:** "Wait — where's the $99 founding member rate I just saw? Where's Agency? And why does it say Pro is my 'current plan' when I'm in a free pilot?"
**Friction: HIGH** — Breaks trust at exactly the moment she was ready to commit money.
**This is MAJOR-04 (BILL-02).**

### T+06:00 — Sandra's likely next step
Either:
- Goes back to /pricing and uses the Stripe CTA directly (works, but feels like the product is disorganized)
- Emails sales asking "is the founding member rate still available? Your billing page doesn't show it"
- Abandons the session to "come back later"

**Conclusion:** Every other journey is clean. The single friction that costs the sale is the billing/pricing tier mismatch.

---

## Inferred conversion impact

Assuming ~30% of evaluation-qualified prospects reach /settings/billing before activating FM:
- 30% × (confusion-induced drop-off of ~15–25%) = 5–8% of FM cohort leaked to friction
- At 25-seat cohort × $99/mo × 12mo LTV ≈ $2,475/seat
- 1–2 seats leaked = **$2.5K–5K ARR loss per cohort fill cycle**

Fix priority: **before next wave of outbound**.

---

## What worked (no friction)

- Dashboard honesty about agent state
- BYOA default clearly marked ("● Using COMMAND keys")
- Router returning `all_agents_unavailable` explicitly
- Canvas template copy matches ICP language ("post-call notes", "BANT", "HubSpot")
- Pricing page FM story is complete and compelling
- Stripe checkout sessions load (no redirect hang, no 500)
- No banned codenames, no n8n leakage, no entity-name typos

---

## What didn't work

- Billing page tier mismatch (BILL-02)
- Test-env agents all stalled (environmental, not product)
- Glossary affordance invisible without hover discovery
- Billing page missing glossary anchors
