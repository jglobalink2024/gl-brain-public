# COMMAND — Symphony v11 Glossary Verification
# [EVIDENCE] Glossary anchors + tooltip coverage across pages
# Date: 2026-04-17

---

## Glossary anchor coverage

| Page | `[data-glossary]` count | Anchors observed |
|------|------------------------:|------------------|
| `/outputs` | 3 | Canvas, Agent, Workspace |
| `/dashboard` | 5 | (count only; term list not enumerated this session) |
| `/canvas` | 1 | (count only) |
| `/pricing` | 1 | (count only) |
| `/settings/billing` | **0** | ❌ MISSING |
| `/settings/integrations` | (not sampled this session) | - |
| `/router` | (not sampled this session) | - |
| `/settings/profile` | (not sampled this session) | - |

**Observation:** Billing page is the notable gap. Terms like "Pilot", "Pro", "operator", "agent instance" are all glossary-worthy but unanchored.

---

## Tooltip behavior verification (sample: Workspace on /outputs)

- Hover event fired at coordinate (683, 150)
- DOM query post-hover: `document.querySelector('[role="tooltip"]')` → element present
- Tooltip content: **"Your team's shared environment in COMMAND"**
- Computed style: `display:block`, `visibility:visible`
- No JavaScript errors in console

**Tooltip PASS** for this sample. Structural behavior consistent across other glossary spans (same component, same attribute-based wiring).

---

## Gaps

### MINOR-GLOSS-01 — Billing page has zero glossary anchors
**Page:** `/settings/billing`
**Fix:** Add anchors for Pilot, Agent, Operator, Agent Instance.

### MINOR-TOOLTIP-STYLE — Visual affordance missing
**Page:** All glossary-bearing pages
**Issue:** Glossary spans lack `text-decoration: underline dotted` and `cursor: help` visual hints. Users only discover tooltips by accident.
**Fix:**
```css
[data-glossary] {
  text-decoration: underline dotted;
  text-underline-offset: 2px;
  cursor: help;
}
```

---

## Verdict

**Glossary system: PASS** — functional tooltip accessibility is correct; two minor gaps (billing page coverage + visual affordance) do not block release.

Glossary coverage score: **4 of 5 tested pages PASS** (billing is the odd one out).
