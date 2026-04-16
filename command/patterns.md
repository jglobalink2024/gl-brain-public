# COMMAND — Build Patterns
Last updated: 260416

## Concurrent CC Sessions
Safe when file surfaces confirmed non-overlapping.
Check before every batch:
- lib/pipeline/ files: shared — one session at a time
- components/tasks/: shared — one session at a time
- components/dashboard/: safe from components/canvas/
- app/api/ routes: safe to split by route prefix
- supabase/migrations/: each session gets unique timestamp

## Migration Timestamp Ordering
Use seconds apart to control apply order:
  Phase 2.2 → 20260413120000
  Phase 2.3 → 20260413120001
Never use same timestamp. Never rely on alphabetical.

## Session Eating
When multiple CC instances work same repo simultaneously,
one may commit the other's staged files. Not a bug.
Detection: check git log after any session.
Impact: usually harmless. Prevention: not worth attempting.

## executeTask System Prompt Order (LOCKED)
1. Workspace DNA (## Firm Operating Context)
2. Agent system prompt
3. Skills constraints (if applied)
4. Prior session context (if includedCheckpointId)
5. Context brief (truncates first if over budget)
DNA is never truncated. Context brief truncates first.

## Supabase FK Cascade Rule
Always add ON DELETE CASCADE to workspace_id FKs.
Omitting causes test user accumulation in teardown.

## Skills Empty Allowlist Rule
Empty allowedTools = passthrough, not total block.
Advisory by default until operator configures skills.

## API Key Security Pattern
API keys must go through server-side API routes.
Never write directly to Supabase from client browser.
Never log api_key. Never return in responses.

## Vendor Fetch Timeout
All vendor API calls must have 30-second AbortController timeout.
Hung API hangs entire execution without timeout.

## Stripe Env Var Naming (LOCKED 260413, UPDATED v9.5)
One canonical name per price ID. No fallback aliases.
All follow STRIPE_{TIER}_PRICE_ID convention:
STRIPE_FM_PRICE_ID | STRIPE_PRO_PRICE_ID |
STRIPE_SOLO_PRICE_ID | STRIPE_STUDIO_PRICE_ID |
STRIPE_AGENCY_PRICE_ID
Never add || fallback aliases — they cause silent failures.
Old names STRIPE_PRICE_STUDIO / STRIPE_PRICE_AGENCY retired in 8635e83.

## Fail-Safe Not Fail-Open (Stripe)
Unknown price ID → default to 'free' not 'pro'.
Billing errors should deny access, not grant it.

## Rate Limiter Pattern (Serverless)
In-memory rate limiters reset on cold start.
Use Supabase audit_ledger count query for rate limiting
in serverless environments. Counts events in time window.
Replace with Upstash Redis before horizontal scale.

## system_prompt Redaction Pattern
Never store full system_prompt in task_executions.
Store: system_prompt_hash (SHA-256) + system_prompt_length.
Workspace DNA and agent instructions are sensitive.

## Agent Fuzzy Matching (Canvas)
4-tier matching for canvas step agent assignment:
1. Exact display_name match
2. Case-insensitive includes
3. agent_type match
4. null (show warning, do not silently fail)
Never silently leave a step unassigned.

## Self-Learning Agent Pattern
Agent definitions live in .claude/agents/ inside the repo (not global ~/.claude/agents).
This makes them version-controlled, product-specific, and auto-loadable.
Bootstrap pattern: agent reads a JSON baseline on first run, populates it from live data,
  uses it for drift detection on every subsequent run.
Self-patch pattern: agent opens GitHub PRs to propose changes to its own definition.
  Never auto-applies changes to itself without human review.

## Ops Run Log Pattern
Diagnostic agents write structured run logs to docs/ops/YYYY-MM-DD-HH-MM.md.
Each log has YAML frontmatter with key metrics for machine-readable trend extraction.
Committed to git automatically after each run — creates a durable history.
Cleanup rule: prune logs >30 days, keep weekly anchors + RED-health runs + permanent records.
Scheduled: daily at 7:01 AM via Claude Code scheduled tasks.

## Canary Probe Pattern
Don't rely on Vercel "READY" status alone — make real HTTP requests to production.
Three probes: health endpoint (200 + latency), auth rejection (expects 401 not 200),
  primary feature route (500 = crisis). Live proof the app is serving, not just deployed.

## Codebase Drift Detection Pattern
Read filesystem (app/api/) at runtime and compare against a stored baseline.
New routes not in baseline = uncovered monitoring gap → queue for self-patch.
Removed routes still in baseline = dead checks → flag and remove.
Always compare local vs production commit SHA — catches silent deploy failures.

## Chat/Thread Naming Convention (LOCKED 260413, UPDATED 260416)
Name every Claude.ai chat based on the ENTIRETY of the
conversation — not just the opening topic.

CANONICAL FORMAT: [GL | WORKSTREAM | Topic · Topic | YYMMDD]

HARD RULES:
1. Leading namespace is always "GL" — never "COMMAND" or any project name
2. Separator between topics is middle-dot "·" (U+00B7) — never "-" or ","
3. Date = START date of the chat (when it was created/opened — NOT last activity)
   If uncertain about start date, Claude asks Jason before naming
4. Brackets [ ] are required
5. Pipe with spaces " | " separates all sections

VALID EXAMPLES:
✅ [GL | QA | F01-F02 OAuth Fix · Dependabot #8 | 260416]
✅ [GL | OPS | File Lifecycle Policy · Cleanup Agent · Chat Naming Fix | 260416]

INVALID EXAMPLES:
❌ COMMAND | QA | F01-F02 OAuth Fix + Dependabot #8 | 260416  (missing brackets, wrong namespace, wrong separator)
❌ [GL | QA | F01-F02 | 260417]  (wrong date if chat opened 260416)
❌ [GL | COMMAND | Phase 2 Sprint · Audit · Brain Init · 260413]  (wrong namespace)

Never name a chat based only on the opening question.
Never use the current date if the chat started on a different day — always use start date.
Review the full conversation before naming.
Always suggest a thread name when the session is closing out.

## Pending Actions Tracking (LOCKED 260416)
Never bury manual Jason-action deliverables in prose. Always write to
PENDING_ACTIONS.md in the target repo root.

Row format: `- [ ] TYPE | WHERE | WHAT | YYMMDD | SESSION`
Types: SQL | VERCEL | GITHUB | GCP | VERIFY | STRIPE | HUBSPOT | OTHER

CC reads at session open (surface relevant open items), writes at session close
(any new manual actions). Jason checks off. Never delete rows.

## Brain Multi-Variant Sync (LOCKED 260416)
All Claude variants (Code, chat, Cursor) read from and write to the same private
brain repo. No variant is a second-class citizen.

READ priority: GitHub MCP → local filesystem → public mirror fallback
WRITE priority: GitHub MCP (chat) | local git (CC/Cursor) | output block (fallback)

Commit format all variants: `brain: [description] [via: CC | chat | cursor]`
Full protocol: globalink-brain/gl/brain-sync-protocol.md
Setup required: GitHub PAT (contents:write on brain repo) + GitHub MCP in Claude.ai

## File Lifecycle Policy (LOCKED 260416)
Every file Claude creates must be tagged at creation:
[ONE-USE] — delete after 7 days or after the commit that ran it
[EVIDENCE] — keep 90 days, then archive (tests/personas/, docs/ops/)
[PERSISTENT] — keep forever (brain files only)

SESSION_CLOSEOUT_*.md: [ONE-USE], expires 3 days
CC_*.md in repo root: [ONE-USE], expires 7 days post-commit
docs/ops/*.md: [EVIDENCE], archive after 30 days (keep RED-health runs forever)
tests/personas/*: [EVIDENCE], archive after 90 days
globalink-brain/**: [PERSISTENT]

Cleanup enforced by ops-watchdog Step 6 (daily after health checks).
Full policy: globalink-brain/command/file-lifecycle.md
