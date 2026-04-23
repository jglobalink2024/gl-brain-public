# COMMAND — Symphony Delta v10 → v11
# [EVIDENCE] What changed, what held, what's new
# Date: 2026-04-17

---

## Held from v10.1 (still PASS)

- F01 — Google OAuth href contains `workspace_id` ✓
- F02 — HubSpot OAuth href contains `workspace_id` ✓
- F03 / CRIT-03 — Server-side API-key verify returns 422 on invalid key ✓
- F04 — Graceful `workspace_not_found` error toast ✓
- F05 — `/dashboard` no longer redirects to `/canvas` ✓
- F06 — "pilot" not "trial" on pricing and billing ✓
- F07 — "LOCKED RATE" + "Founding Member" copy visible ✓
- F08 — Zero banned codenames anywhere ✓
- Design tokens — amber #F0A030, --tx2 #9DA8B5 hold
- Entity integrity — zero "GlobalInk" typos, zero Phase Line/Ponte/Traverse leakage

---

## New in v11 (verified this run)

### MAJOR-02 — Task Router honesty + TaskOutputPanel
- **Status:** PARTIAL (dispatch blocked by environment, UI layer PASS)
- Routing returns `all_agents_unavailable:true` instead of silent failure
- Honest copy on `/router` — no "semantic routing", no "3-signal"
- TaskOutputPanel renders vendor-attributed prior outputs

### MAJOR-03 — Glossary tooltip on hover
- **Status:** PASS (with MINOR cosmetic)
- `role="tooltip"` element appears on hover with correct definition text
- Visual affordance (underline + cursor:help) missing — logged MINOR

---

## New discovered in v11 (regressions/gaps not present in v10.1)

### MAJOR-04 / BILL-02 — Billing page tier mismatch
- Billing page tiers: Solo $49 / Pro $149 / Studio $349
- Pricing page tiers: FM $99 / Solo $49 / Standard Pro $149 / Agency $799
- FM $99 **missing from billing** — FM customer cannot self-activate
- Agency $799 **missing from billing**
- Phantom "Studio $349" not on pricing page
- "Current plan" mislabeled Pro for Pilot user
- **This is a net-new issue surfaced by v11 scope expansion** (v10 did not audit billing at this depth)

### MINOR-GLOSS — Billing page has zero glossary anchors
Newly surfaced by v11 glossary coverage pass.

### MINOR-TOOLTIP-STYLE — Visual affordance missing
Newly surfaced by v11 computed-style audit.

---

## Scoreboard comparison

| Metric | v10.1 | v11 | Delta |
|--------|------:|----:|------:|
| Items executed | ~40 | 64 | +24 |
| PASS | ~36 | 56 | +20 |
| PARTIAL | ~2 | 5 | +3 |
| FAIL | ~2 | 2 | 0 |
| CRIT open | 0 | 0 | 0 |
| MAJOR open | 0 (closed v10) | 1 (BILL-02) | +1 |
| MINOR open | ~3 | 4 | +1 |

**Net movement:** Broader coverage this run surfaced BILL-02 as a new MAJOR. All prior fixes hold.

---

## Release recommendation

**GO WITH FIX.**

- BILL-02 must close before the first FM-cohort outbound wave — it blocks the FM-pilot → FM-paid conversion path.
- MAJOR-02 is environment-limited, not product-broken. Re-run dispatch once agents are re-auth'd.
- All MINOR findings can bundle into the next polish sprint.
- No CRIT or CRIT-class regressions.

v10 closed with "ship if FM cohort < 5 seats, otherwise fix BILL-01". v11 opens with "fix BILL-02 before next outbound wave."
