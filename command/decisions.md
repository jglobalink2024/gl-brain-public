# COMMAND — Decisions Register
Last updated: 260427

## 260427 — Pure Path A: Cockpit only. No notebook. June 1 is not a product deadline.
Decision: COMMAND builds one product — the cross-vendor AI coordination cockpit.
  The notebook idea (standalone AI session notes) is permanently killed.
  June 1 is the relocation date to São Paulo, not a shipping deadline.
  No beta invites until the cockpit delivers what the pitch says, sentence for sentence.
Rationale: Solo founder + two products + international move breaks something, and the
  founder doesn't get to pick what breaks. The cockpit is the thesis. The notebook was
  a hedge. The hedge costs more than the risk it was covering.
  "Done" is defined in gl-brain/command/cockpit-done-definition.md. Don't move the goalposts
  without a brain commit explaining why.
Pattern: Any new feature proposal must pass this gate: "Does this make the cockpit real
  faster, or does it expand scope?" If scope expansion → kill or park.
  Design partners (not customers) get early access. No pitching a product that isn't real.

## 260422 — audit_ledger writes use upsert + ignoreDuplicates, not insert
Decision: All `audit_ledger` inserts in `executeTask.ts` and `autoHandoff.ts`
  use `.upsert({}, { onConflict: 'id', ignoreDuplicates: true })`.
Rationale: `executeTask` and `autoHandoff` both write to audit_ledger in the
  same request cycle. Both do SELECT MAX(entry_seq) then +1 without a
  transaction, creating a race condition that produces 409 conflicts on the
  unique id. upsert+ignoreDuplicates silences collisions without losing data.
Pattern: Any new audit_ledger write must use upsert, not insert.
  entry_seq is best-effort — do not add a unique constraint on it.

## 260422 — getPooledKey is the canonical fallback for all vendor keys
Decision: Every route that makes a vendor API call must use BYOK key first,
  then `getPooledKey(vendor)` as fallback. Never hardcode
  `process.env.ANTHROPIC_API_KEY` directly in route files.
Rationale: `refine/route.ts` bypassed `getPooledKey` causing 422s for
  workspaces without BYOK. `executeTask.ts` already used this pattern.
  Standardizing across all routes prevents recurrence.
Pattern: `const apiKey = workspace?.vendor_key?.trim() || getPooledKey('vendor');`

## 260420 — Public mirror sync = blocklist, not allowlist
Decision: sync-public.yml uses recursive rsync with a single exclude (gl/entities.md)
  rather than explicit cp-by-file.
Rationale: Allowlist silently drops new subdirectories (symphony/**) and any new
  top-level files — public mirror got stuck 14+ files behind private, blocking
  agent-5 and all multi-instance Claude workflows from reading current state.
Pattern: "sync everything under command/ and gl/, exclude only gl/entities.md."
  Any future private-only file must also be added to the exclude list explicitly.
Safety invariant: gl/entities.md is the ONLY private file. Re-verify before adding
  any new gl/ content that might contain prospect/pipeline data.



## 260413 — Ops-watchdog run logs committed to git (not local-only)
Decision: Write run logs to docs/ops/ inside the repo, committed after every run.
Rationale: Persistent memory that survives machine changes, visible in git history,
  queryable by the agent for trend detection. Local-only would break on new machine.
Pattern: daily auto-commit via scheduled task — "ops: daily run YYYY-MM-DD — GREEN/YELLOW/RED"

## 260413 — Self-patch via GitHub PR (not auto-apply)
Decision: Agent proposes changes to its own definition as GitHub PRs, Jason merges.
Rationale: Agent can open a PR (GitHub MCP available) but should not rewrite its own
  instructions without human review. PRs preserve the decision trail in git.
Branch pattern: ops/watchdog-self-patch-YYYYMMDD

## 260413 — Schema baseline bootstrapped on first run (not hand-coded)
Decision: schema-baseline.json starts as a template with bootstrapped: false.
  First /ops-check populates it from live Supabase + filesystem + planGate.ts.
Rationale: Hand-coding the table list would go stale immediately. Live bootstrap
  captures actual state. Subsequent runs detect drift against that snapshot.

## 260413 — Ops agent lives in command-app git (not global ~/.claude)
Decision: .claude/agents/ops-watchdog.md in the repo, not the user's global agents dir.
Rationale: Agent must grow with the product. Global agents don't have product context
  and don't get committed alongside the code they monitor. Repo-local = version-controlled.

## 260413 — Pooled keys, no new schema columns
Decision: Reuse existing anthropic_api_key / openai_api_key / perplexity_api_key columns as BYOK columns; no migration
Rationale: Columns already existed with correct names. Adding user_anthropic_key etc. would have been redundant duplication.
Pattern: workspace key ?? env var — one line per vendor in proxy route.

## 260413 — Skills Enforcement KEPT
Decision: Rejected Gemini kill recommendation
Rationale: Trust layer not governance layer. Sandra never
  sees compliance language. Rebranded "Agent Guardrails."
  Without enforcement, prompt injection destroys trust.
Alternative rejected: Kill entirely

## 260413 — Semantic Matchmaking KEPT
Decision: Rejected Gemini kill recommendation
Rationale: Required for non-technical UX. Without it Sandra
  must manually select agents — defeats the product promise.
Alternative rejected: Remove in favor of deterministic routing

## 260413 — Workspace DNA over Mem0/Zep
Decision: Simple text field, system prompt injection
Rationale: Zero infrastructure. 80% of perceived second brain
  value at $0 cost. Mem0 graph features = $249/mo. Wrong tier.
Revisit: Phase 3 — Zep temporal graph if Sandra needs
  entity tracking across sessions

## 260413 — Google OAuth before HubSpot
Decision: Google Workspace shipped first
Rationale: Sandra's confirmed stack is Google-native.
  ChatGPT + Claude + Perplexity + Fathom + Notion + Gmail.
  HubSpot penetration lower than assumed in boutique segment.

## 260413 — Canvas: linear execution only
Decision: 15-25hr linear build, not 150-200hr full engine
Rationale: Non-linear branching, async, loop prevention is
  Phase 4. Sandra runs Research → Draft → Review. Linear only.

## 260413 — ROI Tracker over Agent DNA Editor as Phase 2.9
Decision: ROI Tracker is Phase 2.9 priority
Rationale: Renewal conversation framing built into product.
  "COMMAND saved you 14 hours this week" closes the billing gap.

## 260413 — Phase/date rule PERMANENT
Decision: Builds framed by phase+function, never calendar
Rationale: Jason completes "week-long" items in hours.
  Time estimates are suggestions only. Train to standard.

## 260413 — Stripe price ID canonical names locked (UPDATED v9.5)
Decision: One env var name per price ID. No aliases. All follow STRIPE_{TIER}_PRICE_ID.
  STRIPE_FM_PRICE_ID, STRIPE_PRO_PRICE_ID,
  STRIPE_SOLO