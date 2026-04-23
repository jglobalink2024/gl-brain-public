---
name: COMMAND SOP v8 — Operating Rules, Tool Assignments, Infrastructure, Gated Items
description: Hard rules, tool assignments, build workflow, Playwright standards, GTM operating rules, deferred gates, key contacts and links. Source: SOP v8 (260413).
type: project
---

## Source document
`C:\Users\jdavi\Downloads\COMMAND_SOP_v8.txt`
Also at: `C:\Users\jdavi\Downloads\COMMAND_Project_Knowledge_260413\COMMAND_SOP_v8.txt`

## Hard rules (never violate)

1. Never reference n8n in customer-facing code — GL internal only
2. Never imply single-vendor — model-agnostic enforced architecturally
3. Never remove no-credit-card pilot gate (14-day)
4. Always use workspace_id as tenant isolation on EVERY Supabase query
5. Entity name: GlobaLink (never GlobalInk)
6. Never use agent codenames COMMAND-0, FORGE-1, SIGNAL-1, RECON-1 — use function names: Research Agent, Draft Writer, GTM Agent, Ops Agent
7. **"PILOT" NOT "TRIAL"** — hard rule across ALL forward-facing copy
8. Sign off: JCMD only (never "Jason / JCMD")

## Tool assignments

| Tool | Use for |
|------|---------|
| Claude (claude.ai) | Strategy, reasoning, prompt writing, outreach drafts, GTM copy, research synthesis, document drafting |
| Claude Code | ALL file edits, git ops, TypeScript checks, Playwright tests, npm ops, multi-file work |
| Cursor | Only when AI-assisted autocomplete needed in a specific large file — surgical edits only |
| Chrome/Browser agent | UI navigation (Notion, Tally, Brevo, Documenso) |
| Perplexity | Research mode (audits, competitive intel); Search mode (checklists, lookups) |

## Build workflow

- Every Claude Code session: state repo explicitly, list full file paths, CLAUDE.md reads automatically
- Pre-push: `npx tsc --noEmit` → exit 0 required; Playwright clean required
- Commit format: `type(scope): description — session context`
- `preflight.ps1` must run before every git push (scans: banned tokens, codenames, n8n, off-palette hex)

## Playwright standards

- Suite: APP-SMOKE, GL-SMOKE, D5, D8, E5
- Clean baseline: 17/17 PASS; 4 known flakies (acceptable on retry)
- Config: `dotenv.config({ path: ".env.local" })` at top; trace on first retry; screenshot+video on failure
- Run: `npx playwright test` with `PLAYWRIGHT_PHASE_B=1`

## Supabase rules

- Project ref: `ycxaohezeoiyrvuhlzsk`
- `workspace_id`: universal tenant isolation key — required on EVERY query
- Exceptions (workspace_id not required): workspaces table, founding-member-count, webhooks/stripe, internal/seed
- Migrations applied manually via SQL Editor (CLI not linked)
- Schema v3: 9 tables + agent_events + agent_handoffs (CCF = JSONB)

## GTM operating rules

- ICP priority: #1 Sales/RevOps, #2 Operations, #3 Executive coaching, #4 Marketing
- Outreach voice: peer-level observation, not authority claim; mirror private confession (Reddit), not public performance (LinkedIn)
- T1: research frame; T2/T3: pure question mode; never salesy
- **"Human middleware" is COMMAND-owned vocabulary** — use freely, no attribution needed
- Reddit account: u/Popular_Pepper7679; 14-day listen-only period initiated 260402; 5 subreddits; zero self-promo until karma 50+; karma 500+ before direct promotion

## Beta program rules

- Modified Rolling Gate: one user in → 48h stabilization → next user in
- Beta syllabus: command.globalinkservices.io/beta-syllabus
- FM cohort: 25 slots, $99/mo locked for life, closes Sept 30, 2026
- Tracked in Notion Beta Users DB

## Key infrastructure URLs

| Asset | URL |
|-------|-----|
| App | app.command.globalinkservices.io |
| Landing | command.globalinkservices.io |
| Sales Hub | command.globalinkservices.io/sales-hub |
| Beta Syllabus | command.globalinkservices.io/beta-syllabus |
| Navattic demo | globalink.navattic.com/fcr04wg |
| Dock.us | globalinkservices.dock.us/acme-E7sOXt5HpHir |
| Booking | app.reclaim.ai/m/GlobaLink-Jason |
| MS Clarity | w35dn6egp4 |

## Gated/deferred items (do not do until gate is met)

| Item | Gate |
|------|------|
| Trademark COMMAND (USPTO Class 42, ~$350) | First revenue |
| Patent provisional filings (~$1,050 for 3) | First paying customer + attorney consult; Jason = micro entity (75% USPTO discount) |
| Vouch insurance ($155.75/mo) | First paying customer OR COI request |
| Axiom log drain | Vercel Pro or first revenue |
| YC Application | Phase 3 metrics (5 conditions) |
| ORACLE integration | First paying customer |
| Navattic rebuild (fix "trial" → "pilot") | Beta testing complete |
| Anthropic partner outreach | Beta validation confirmed |
| @anthropic-ai/sdk upgrade 0.79→0.82 | Post-beta review (breaking change) |
| Investor outreach | 2–3 paying customers as advocates; military-specific VCs first: Moonshots, Veteran Fund, Context |
| Annual pricing | Phase 3 |
| Solo/Studio/Agency Stripe links | Create before pricing page goes live |

## Investor strategy (when ready)

- Pre-recruit advisors from ICP before pitching civilian VCs
- Military-specific VCs first: Moonshots Capital, Veteran Fund, Context Ventures
- Gate: 2–3 paying customer advocates
- Opening frame: "23 years running command-and-control architectures — 14 systems simultaneous, nothing drops in handoff. Now watching 1-person firms collapse under 3 unconnected AIs. Built the missing thing."

**Why:** SOP v8 is the master operating document. It supersedes all earlier SOPs. When in doubt about a rule, defer to SOP v8.
**How to apply:** Run preflight.ps1 before every push. Never open gated items early — each gate exists because the cost (financial or reputational) isn't justified without the trigger.
