# COMMAND — Current State
Last updated: 260413-2

## Live URLs
App: app.command.globalinkservices.io
Landing: command.globalinkservices.io
NDA: go.command.globalinkservices.io/betaNDA
Stripe FM: https://buy.stripe.com/9B68wRgwAcp8dt2dJp9k407
Stripe Pro: https://buy.stripe.com/bJe00lfsw74O74E5cT9k408

## Build State
Phase 1 + 1.5: COMPLETE
Phase 2: COMPLETE — all 15 sub-phases + all audit
  fixes shipped. Product is audit-clean.
Phase 3: NOT STARTED (gate: first paying customer)

## Commits (260413 — session 2)
a8e0412 Phase 2.1 real agent connections
0366c0f Phase 2.3 auto-handoff
ddd7364 Phase 2.4 router execution
b1969a9 Phase 2.6 canvas linear execution
f3ccfd8 Phase 2.7 semantic matchmaking
c20d16a Phase 2.X workspace DNA
2241bad Phase 2.4.5 smart suggestions
21076b1 Phase 2.5 skills + Google OAuth
3a1df14 Phase 2.Y RevOps templates
1a9cb40 Phase 2.9 ROI tracker
bcaa350 8 critical audit fixes (Wave 1)
c30ad1a 16 polish fixes (Wave 2 — Session V)
7400009 14 high fixes (Wave 3 — Session U)
0ef088d Brain POINTER files updated to public URLs
ab2583c Brain state update
87f8cec Brain initialization

## Audit Status — ALL CLOSED
Wave 1 (bcaa350): 8 critical — DONE
Wave 2 (c30ad1a): 16 polish — DONE
Wave 3 (7400009): 14 high — DONE
Total fixes: 38 across 3 sessions

## Pending Manual Steps
### Supabase SQL Editor — DONE 260413:
20260413900000_task_executions_redact_prompt.sql ✓
(+ all 15 April 13 migrations applied)

### Vercel Env Vars — DONE 260413 (all 5 price IDs confirmed):
STRIPE_FM_PRICE_ID ✓
STRIPE_PRO_PRICE_ID ✓
STRIPE_SOLO_PRICE_ID ✓
STRIPE_PRICE_STUDIO ✓
STRIPE_PRICE_AGENCY ✓
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
GOOGLE_REDIRECT_URI
HUBSPOT_CLIENT_ID
HUBSPOT_CLIENT_SECRET
HUBSPOT_REDIRECT_URI

### Third-Party Setup Still Needed:
- Google Cloud Console: OAuth 2.0 client + 3 scopes
- HubSpot Developers: Public app + 5 scopes

## Symphony v9 Cleanup — COMPLETE (ed34843, 260413)
Session: COMMAND | QA | Symphony v9 Cleanup | 260413
34 findings total. 19 false positives (stale deploy). 15 real.
Code fixes: 5 shipped. Batch verify: 12 VERIFIED. Jason handles env vars.

Fixed:
- ST-09: double-execution guard covers running + complete (409)
- BF3: per-step export warning in CompletionPanel (amber confirm UI)
- MJ3: pricing page moved to app/(app)/pricing + AppLayout wrapper
- MJ2: lib/executeTask.ts → lib/pipeline/executeTask.ts (6 refs in Product Spec)
- BF1: Product Spec Semantic Matchmaking updated — "3-signal" claim removed, Phase 3 noted

Verified (no changes needed):
C1, MJ1, B2, M5, M7, L5, M10, M12, L1, L2, L4, L7 — all confirmed in code

## API Key Architecture (260413-2) — SHIPPED
Commit: a50ffa4
- Proxy route: pooled env-var keys as default fallback (ANTHROPIC_API_KEY, OPENAI_API_KEY, PERPLEXITY_API_KEY)
- Workspace key still takes priority when set (BYOK path unchanged)
- Onboarding: API key screen removed entirely; agents provisioned api_proxy on first run
- Integrations page: "YOUR API KEYS (OPTIONAL)" — green "Using COMMAND keys" / violet "Using your key" mode badges
- No schema migration required — existing anthropic_api_key / openai_api_key / perplexity_api_key columns reused as BYOK columns
- TODO in proxy route: rate limit pooled key usage by plan tier (Phase 3)

## Claude Code Tooling (260413 — session 3)
Implemented all recommendations from /insights report (177 sessions, Apr 3-14):
- Root CLAUDE.md: added SESSION PROTOCOL, BRAIN REPO, WORKING STYLE, SECURITY, GIT DISCIPLINE, NAMING CONVENTIONS
- command-app CLAUDE.md: added GIT DISCIPLINE + SQL DISCIPLINE (info_schema check, IF EXISTS guards, FK constraints)
- command-gl CLAUDE.md: added GIT DISCIPLINE + public repo secret-check callout
- command-extension CLAUDE.md: rebuilt from near-empty — added REPO IDENTITY, HARD RULES, BRAIN PROTOCOL, GIT DISCIPLINE
- ~/.claude/commands/preflight.md: /preflight custom command (tsc → eslint → staged diff)
- ~/.claude/commands/closeout.md: /closeout custom command (chat name → brain update → commit → push)
- ~/.claude/settings.json: pre-commit hook — blocks git commit if tsc or eslint fails (scoped to TypeScript projects only)

## Next Session Priorities
1. Send Eric beta invite (Phase 2 + audit-clean, ready now)
2. Grant Carlson 7-day follow-up (check date)
3. Google OAuth env vars — GOOGLE_CLIENT_ID/SECRET/REDIRECT_URI still needed in Vercel

## FM Cohort
25 slots | $99/mo | Closes Sep 30 2026
0 slots filled | Beta free until ~Aug 1 2026
