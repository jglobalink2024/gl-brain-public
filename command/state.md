# COMMAND — Current State
Last updated: 260416

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

### Vercel Env Vars — ALL DONE (260415-2):
STRIPE_FM_PRICE_ID ✓
STRIPE_PRO_PRICE_ID ✓
STRIPE_SOLO_PRICE_ID ✓
STRIPE_STUDIO_PRICE_ID ✓ (was STRIPE_PRICE_STUDIO, renamed 8635e83)
STRIPE_AGENCY_PRICE_ID ✓ (was STRIPE_PRICE_AGENCY, renamed 8635e83)
GOOGLE_CLIENT_ID ✓ (added 260413)
GOOGLE_CLIENT_SECRET ✓ (added 260413)
GOOGLE_REDIRECT_URI ✓ (added 260413)
HUBSPOT_CLIENT_ID ✓ (added 260413)
HUBSPOT_CLIENT_SECRET ✓ (added 260413)
HUBSPOT_REDIRECT_URI ✓ (added 260413)
VERCEL_API_TOKEN ✓ (added 260415 — token: command-ops-watchdog, No Expiration)

### Third-Party Setup — ALL DONE (260415-2):
- Google Cloud Console: OAuth 2.0 client "COMMAND Web" confirmed (created Apr 4) ✓
  redirect URI: https://app.command.globalinkservices.io/api/integrations/google/callback ✓
  scopes added: userinfo.email, gmail.compose, documents ✓
- HubSpot: public app "GlobaLink COMMAND" verified via OAuth bridge ✓
  client ID: 461a2577-d1b5-4a89-b3c5-7cdf22db8ee0 — accepted by HubSpot
  redirect URI: https://app.command.globalinkservices.io/api/integrations/hubspot/callback — accepted
  scopes: crm.objects.contacts.read/write, crm.objects.deals.read/write, oauth — all accepted
- VERCEL_API_TOKEN: ops-watchdog now has runtime error visibility ✓

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

## Symphony v9.5 Full Re-Run — COMPLETE (8635e83, 260413)
Session: COMMAND | QA | Symphony v9.5 Full Re-Run | 260413
Full randomized re-run against live deploy (v9 ran against stale build).
56 personas tested. Live Playwright browser verification + local dev server.
Commit: 8635e83 (12 files changed, 2202 insertions)

Results:
- TypeScript: exit 0
- Playwright: 56 passed, 11 skipped, 4 did not run (exit 0, 1.2h)
- Primary ICP 93% at 8+ purchase intent (TARGET MET)
- All personas 91% at 7+ (NEAR MISS by 1 — E9 Jenna at 6)
- Truth score: ~96% | Regression: 96.2% | Interaction: 6/7 PASS
- Zero new CRITICALs
- Fix queue: P0=0, P1=3 (M10, N2, N5), P2=3, P3=3

10 reports in tests/personas/. Feature file updated with v9.5 verdicts.
Also shipped: STRIPE_PRICE_STUDIO → STRIPE_STUDIO_PRICE_ID,
  STRIPE_PRICE_AGENCY → STRIPE_AGENCY_PRICE_ID (env var standardization).

## API Key Architecture (260413-2) — SHIPPED
Commit: a50ffa4
- Proxy route: pooled env-var keys as default fallback (ANTHROPIC_API_KEY, OPENAI_API_KEY, PERPLEXITY_API_KEY)
- Workspace key still takes priority when set (BYOK path unchanged)
- Onboarding: API key screen removed entirely; agents provisioned api_proxy on first run
- Integrations page: "YOUR API KEYS (OPTIONAL)" — green "Using COMMAND keys" / violet "Using your key" mode badges
- No schema migration required — existing anthropic_api_key / openai_api_key / perplexity_api_key columns reused as BYOK columns
- TODO in proxy route: rate limit pooled key usage by plan tier (Phase 3)

## Ops Watchdog (260413 — session 4)
Built self-learning production diagnostic agent. Replaces 7-layer manual ops playbook.
Commits: 253e633 (v1), b03582e (v2), 0a44554 (cleanup command)

Architecture:
- .claude/agents/ops-watchdog.md — agent definition (in git, self-patches via PR)
- .mcp.json — Vercel + Supabase + GitHub MCP servers wired
- .claude/commands/ops-*.md — 7 focused commands
- .claude/settings.json — PostToolUse push reminder hook
- docs/ops/schema-baseline.json — bootstraps from live system on first run
- docs/ops/*.md — run logs written after every /ops-check

9 checks: Vercel deploy health, runtime errors (24h, with deltas), Supabase schema
vs baseline, audit ledger anomalies, vendor API status, credit/plan gates, rate
limit pressure, canary HTTP probes (live app verification), codebase drift detection.

Self-learning: every run writes a log; next run computes deltas vs prior run.
Self-improving: agent opens GitHub self-patch PRs when it finds uncovered patterns.
Schema baseline: auto-bootstrapped on first run from Supabase + filesystem + planGate.ts.
Daily scheduled: 7:01 AM every day via Claude Code scheduled tasks.
Pre-onboarding gate: /ops-beta-ready (12-point GO/NO-GO checklist).
Weekly digest: /ops-week (reads last 7 run logs for trend summary).
Cleanup: /ops-cleanup (prunes logs >30 days, keeps weekly anchors + RED + permanent records).

Tokens: VERCEL_API_TOKEN + GITHUB_TOKEN confirmed in .env.local. SUPABASE_SERVICE_ROLE_KEY already present.
First bootstrap: runs tonight at 7:01 AM. schema-baseline.json will be populated.
ACTION: Click "Run now" in Scheduled sidebar to pre-approve tool permissions before first auto-run.

## Claude Code Tooling (260413 — session 3)
Implemented all recommendations from /insights report (177 sessions, Apr 3-14):
- Root CLAUDE.md: added SESSION PROTOCOL, BRAIN REPO, WORKING STYLE, SECURITY, GIT DISCIPLINE, NAMING CONVENTIONS
- command-app CLAUDE.md: added GIT DISCIPLINE + SQL DISCIPLINE (info_schema check, IF EXISTS guards, FK constraints)
- command-gl CLAUDE.md: added GIT DISCIPLINE + public repo secret-check callout
- command-extension CLAUDE.md: rebuilt from near-empty — added REPO IDENTITY, HARD RULES, BRAIN PROTOCOL, GIT DISCIPLINE
- ~/.claude/commands/preflight.md: /preflight custom command (tsc → eslint → staged diff)
- ~/.claude/commands/closeout.md: /closeout custom command (chat name → brain update → commit → push)
- ~/.claude/settings.json: pre-commit hook — blocks git commit if tsc or eslint fails (scoped to TypeScript projects only)

## v10 Criticals — ALL CLOSED (260414 → 260415)
Session: COMMAND | QA | v10 Criticals + v10.1 Verification | 260415
Commit: e2ebd87 (3 CRIT + 3 MAJOR fixed)
v10.1 Real-browser verification: 6/6 PASS — SHIP

CRIT-01 Stripe: removed customer_creation from subscription checkout — PASS
CRIT-02 OAuth: server-side workspace resolution + settingsRedirect helper — PASS
CRIT-03 API key: pollVendor verify gate in /api/integrations/workspace-key — PASS
MAJOR-01 Dashboard: sessionStorage flag set at redirect time — PASS
MAJOR-02 Outputs: Promise.all merging tasks + outputs tables — PASS
MAJOR-03 data-glossary: attribute added to GlossaryTerm + JargonTooltip — PASS

Verification report: docs/ops/2026-04-15-v10.1-verification.md

Key code files patched:
- app/api/stripe/checkout/route.ts
- app/api/integrations/google/auth/route.ts
- app/api/integrations/hubspot/auth/route.ts
- app/api/integrations/workspace-key/route.ts (NEW)
- app/(app)/settings/integrations/page.tsx
- app/dashboard/page.tsx
- app/(app)/outputs/page.tsx
- components/ui/GlossaryTerm.tsx
- components/Tooltip.tsx
- lib/glossary.ts (expanded to 17 terms)

## Third-Party Infrastructure — DONE (260415-2)
Session: COMMAND | Ops | Third-Party Infrastructure + Brain Sync | 260415
All items that were "pending manual steps" are now closed:
- GCP scopes configured (userinfo.email, gmail.compose, documents) on globalink-command project
- Google "COMMAND Web" OAuth client confirmed — redirect URI correct — env vars in Vercel
- HubSpot "GlobaLink COMMAND" public app verified via OAuth bridge — all 5 scopes accepted
- VERCEL_API_TOKEN created + added to Vercel prod + .env.local — ops-watchdog unblocked
- Stray GCP project (command-globalink under jdavis5206@gmail.com) still needs deletion — low priority

## CSP Fix — SHIPPED (dfc12b2, 260416)
Session: COMMAND | Ops | Third-Party Infra + CSP Fix | 260416
HubSpot was blocked by the Content Security Policy in next.config.mjs:
- connect-src: added https://api.hubapi.com (was missing — browser blocks fetch to HubSpot API)
- frame-src: added https://app.hubspot.com (was 'self' only — blocks HubSpot OAuth in frame context)
All HubSpot calls are currently server-side; fix is forward-looking for client-side status checks
and any future HubSpot widgets (meetings embed, chat). TypeScript clean. Deployed to production.

## F01/F02 OAuth workspace_id Fix — SHIPPED (87d9527, 260416)
Session: COMMAND | QA | v10.1 F01/F02 Fix | 260416
Found during v10.1 symphony (commit d11ca40): Google + HubSpot Connect hrefs missing workspace_id.

Commits:
- 87d9527: fix: F01/F02 attach workspace_id to OAuth Connect hrefs + session fallback (260416)
- 5bccc73: chore(deps): pin follow-redirects >=1.16.0 via overrides (Dependabot alert #8)

Changes:
- page.tsx: href={`/api/integrations/google/auth?workspace_id=${ws.id}`} — same for HubSpot
- google/auth/route.ts + hubspot/auth/route.ts: query param primary, session fallback, error only if both fail
- CRIT-02 guardrail preserved — unauthorized direct hits still get error=unauthorized
- package.json: overrides.follow-redirects >=1.16.0 — closes GHSA-r4q5-vmmm-2653 (moderate, CVSS 6.9)
- npm audit: 0 vulnerabilities

Dependabot PR #5 can be closed (fix applied via npm overrides).

Post-deploy verification required on production (see tests/personas/COMMAND_F01_F02_Fix_Verify.md):
- Inspect Google Connect button href — confirm workspace_id=<uuid> present
- Click Connect Google — confirm redirect to accounts.google.com consent screen
- Repeat for HubSpot

## Symphony v11 — READY TO RUN
Build is clean and all infrastructure is wired:
- Phase 2 complete + all audits closed
- v10.1 verified (6/6 PASS on production)
- Google OAuth + HubSpot OAuth + VERCEL_API_TOKEN all configured
- CSP unblocked for HubSpot
- P1 carryovers from v9.5: M10, N2, N5 — may surface in v11 run
Best run window: 10 PM – 2 AM CT (off-peak Anthropic API throughput)
Avoid: 9 AM – 6 PM CT (peak); avoid 7:01 AM (ops watchdog scheduled run)

## File Lifecycle + Brain Sync Protocol — SHIPPED (260416)
Session: GL | OPS | File Lifecycle + Brain Multi-Variant Sync | 260416

Implemented full file lifecycle policy and multi-variant brain sync protocol:

File lifecycle:
- Purpose tags [ONE-USE] / [EVIDENCE] / [PERSISTENT] — required on every file CC creates
- Retention rules: CC_*.md (7d), SESSION_CLOSEOUT_*.md (3d), tests/personas/* (90d), docs/ops/* (30d)
- Enforcement: ops-watchdog Step 6 added — cleanup sweep runs daily after health checks
- Brain file: globalink-brain/command/file-lifecycle.md

Brain multi-variant sync:
- All Claude variants (Code, chat, Cursor) read + write the same private brain repo
- Claude Code: local filesystem + git push (unchanged)
- Claude chat: GitHub MCP server (`github-brain`) → direct commit to private brain repo
- Fallback: public mirror for reads, output block for writes if MCP not active
- Commit format all variants: `brain: [description] [via: CC | chat | cursor]`
- Brain file: globalink-brain/gl/brain-sync-protocol.md
- Setup required (Jason one-time action): GitHub PAT (contents:write on brain repo) + GitHub MCP in Claude.ai

Files updated:
- globalink-brain/gl/brain-sync-protocol.md (new)
- globalink-brain/command/file-lifecycle.md (already committed 2f22175)
- globalink-brain/command/patterns.md (brain sync + file lifecycle patterns added)
- Root CLAUDE.md (FILE LIFECYCLE section added, BRAIN REPO updated)
- command-app/CLAUDE.md (FILE LIFECYCLE section added, Session Open/Close updated)
- command-app/.claude/agents/ops-watchdog.md (Step 6 cleanup sweep added)
- feedback_thread_naming.md in CC memory (date = start date rule, updated when to surface name)

## Standards
Chat/thread naming canonical format: [GL | WORKSTREAM | Topic · Topic | YYMMDD]
Authoritative rules + examples: globalink-brain/command/patterns.md → "Chat/Thread Naming Convention"

## Next Session Priorities
1. (Optional) Enable Claude chat brain writes: GitHub PAT (contents:write on brain repo only) + GitHub's hosted MCP at claude.ai Settings → Integrations → custom MCP. Until then, chat uses output-block fallback — Claude Code commits on next session.
2. v11 symphony run — 20 personas, 8 previously-blocked items, real transactions (tonight 10 PM CT)
3. Post-deploy verify F01/F02 on production (see COMMAND_F01_F02_Fix_Verify.md) — inspect hrefs + click through OAuth consent screens
4. Close Dependabot PR #5 on GitHub (follow-redirects fix already applied via npm overrides in 5bccc73)
5. Send Eric beta invite (Phase 2 + audit-clean + v10.1 verified — ready now)
6. Grant Carlson 7-day follow-up (check date)
7. Delete stray GCP project: command-globalink under jdavis5206@gmail.com (created in error, low priority)

## FM Cohort
25 slots | $99/mo | Closes Sep 30 2026
0 slots filled | Beta free until ~Aug 1 2026
