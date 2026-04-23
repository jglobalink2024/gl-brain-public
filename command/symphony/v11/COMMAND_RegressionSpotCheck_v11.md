# COMMAND — Symphony v11 Regression Spot-Check
# [EVIDENCE] 10-item regression pass against live production
# Date: 2026-04-17

---

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| REG-01 | Credit balance stable across navigation | PASS | $9.94/$10.00 preserved across 7 page visits |
| REG-02 | No banned agent codenames | PASS | 0 hits for `COMMAND-0\|FORGE-1\|SIGNAL-1\|RECON-1` |
| REG-03 | "n8n" never surfaces in UI | PASS | 0 hits across 7 pages |
| REG-04 | Entity name: GlobaLink (never GlobalInk) | PASS | 0 typo hits |
| REG-05 | No Phase Line / Ponte / Traverse leakage | PASS | 0 hits |
| REG-06 | "pilot" not "trial" | PASS | /pricing + /billing both use "pilot" |
| REG-07 | Sidebar AppLayout consistency | PASS | Same nav on 6 pages |
| REG-08 | Agent labels vendor + ordinal only | PASS | Claude-1, GPT-4-1, Perplexity-1 only |
| REG-09 | Design tokens (amber + --tx2) | PASS | #F0A030 + #9DA8B5 confirmed; 0 banned hex |
| REG-10 | Workspace ID format stable | PASS | `ws-1776139325700` used consistently |

**Regression score: 10/10 PASS.**

No v10→v11 regressions detected. All surviving behaviors from Symphony v10.1 hold.

---

## Design token audit (detailed)

Sampled computed styles via `getComputedStyle()`:
- `[data-glossary]` text color: `rgb(157, 168, 181)` = `#9DA8B5` ✓ (canonical --tx2)
- Amber accents on vendor badges: `rgb(240, 160, 48)` = `#F0A030` ✓
- Background: `rgb(8, 11, 17)` = `#080B11` ✓
- Card surface: `rgb(13, 17, 23)` = `#0D1117` ✓

Banned hex scan across /dashboard, /outputs, /canvas, /pricing, /billing, /router, /settings/integrations:
- `#64748b`: 0 hits
- `#475569`: 0 hits
- `#334155`: 0 hits
- `#7a8099`: 0 hits
- `#30363D`: 0 hits
- `#94a3b8`: 0 hits
- `#5dcaa5`: 0 hits

Design-token discipline: **100%.**
