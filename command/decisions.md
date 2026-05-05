# COMMAND — Decisions Register
Last updated: 260505

## 260505 — gap-flagger log schema: align SKILL.md to live schema (forward-only) [via: CC]

Session: [GL/COMMAND | OPS | Agent Dev Kit v2 · Gap-Flagger 2605 · GLaOS Outline | 260505]

**Decision:** Update `gap-flagger/SKILL.md` input contract to formally accept the live `agent_activity_log.md` field names as primary. Do NOT migrate existing log entries. Forward-only extension: new entries should add optional fields when possible.

**Field mapping (live → SKILL.md canonical):**

| Live log field | SKILL.md contract field | Resolution |
|---|---|---|
| `activated` | `agent_name` | Accept `activated` as valid alias; update SKILL.md to document both |
| `date` (YYMMDD) | `timestamp` (ISO-8601) | Accept YYMMDD; note precision loss (no time-of-day) in SKILL.md |
| `outcome` | `task_outcome` | Accept `outcome` as valid alias; update SKILL.md to document both |
| *(absent)* | `first_month` | Apply heuristically from install date; add as optional field for new entries |
| *(absent)* | `invoker` | Add as optional field for new entries |
| *(absent)* | `handoff_to` | Add as optional field for new entries |

**Rationale:** The live log has 10+ entries already committed in the established format. Migrating existing entries would violate the append-only principle (`RM_RF_BLOCKED` class violation — append-only is sacred). `SKILL.md` was written before the live log existed and diverged during initial setup. The simpler and safer fix is to align the spec to the implementation, not the implementation to the spec. The field-mapping heuristic gap-flagger currently applies is correct — this decision formalizes it.

**Impact on gap-flagger:** Remove "schema mismatch" from Section 12 Data Quality in future reviews once SKILL.md is updated. The heuristic mapping is now the official contract, not a workaround.

**Excluded options:**
- *(a) Migrate existing log entries to SKILL.md field names* — rejected. Violates append-only. 10 entries would need rewriting. No operational benefit.
- *(c) Keep mismatch unresolved* — rejected. It's a recurring data-quality flag. Two reviews is enough signal to decide.

**Next action:** Update `gap-flagger/SKILL.md` input contract section to document `activated`/`date`/`outcome` as accepted aliases. Add optional fields to the schema table. Target: before 2606 review.

---

## 260504 — GP-1 Stale-Execution Guard: executeTask 2b.5 [via: CC]

Session: [GL/COMMAND | GP-1 | Stale-Exec Guard · 48h Clock Start | 260504]

**Decision:** Add stale-execution guard (section 2b.5) inside `executeTask.ts` immediately before `// ── 2c. Mark agent active` (commit 1af2195).

**Root cause diagnosed:** The `dispatchTask` route calls `void fetch("/api/agents/proxy")` as fire-and-forget. When a Playwright test fails/times out, this background proxy continues running through the full Perplexity → autoHandoff → executeTask(Claude) chain. The `beforeEach` nuclear reset then fires for the NEXT test, deleting tasks and setting agents to "idle". But executeTask — which was already running — had a ~200ms window between its initial task fetch (line ~224) and its `agents.update({ status: 'active' })` call (line ~307). The nuclear reset's "idle" write fired in this window, and executeTask then OVERWROTE it with "active". The agents-idle poll (`timeout: 30s`) then timed out waiting for Claude-Drafting to go idle while Claude API was still processing.

**Fix (lib/pipeline/executeTask.ts, section 2b.5):**
Re-query the task by ID immediately before marking the agent active. If the task is no longer in the DB (deleted by nuclear reset), return early with `errorCode: 'task_not_found'` WITHOUT touching agent status. This shrinks the race window from ~200ms to ~1 DB round-trip (~10ms).

**Evidence:** Dev log from `/dev` page showed a repeating `nuclear reset → autoHandoff → executeTask → anthropic request → task complete` cycle for 1+ hour across 15+ failed test runs, confirming the stale background proxy as the source.

**Confirmed working:** Playwright golden-path.spec.ts — 3 passed, 7.3m, no retries (commit 1af2195 tested post-fix).

**GP-1 gate status:** GREEN as of 260504 ~01:00. 48h clock started. GP-2 gate opens 260506 ~01:00.

---

## 260503 — Eric Repurposed as Discovery User, Not Beta [via: Chat → CC]

Session: [GL | STRATEGY | Cockpit-Done Recovery · Eric Repurpose | 260503]

**Decision:** Eric reach-out for May 5–10 window approved as DISCOVERY USER, not beta launch.

**Tension this resolves:** Original Pure Path A doctrine (260423) said "silence until cockpit-done." A strict reading requires zero contact until criterion #5 is non-zero. But criterion #5 ("3 non-Jason users returning unprompted 7+ days") cannot move from zero without inviting users. Deadlock. Resolution: distinguish CONTACT from PROMISES. The doctrine forbids promises a product can't keep. It does not forbid contact aimed at learning what the product still gets wrong.

**Frame:** Recon-in-force, not attack. Eric is the small element making contact to bring back information that can't be obtained from the inside. He is not the objective. The objective remains the cockpit-done gate.

**Three hard conditions for this to remain honest, not drift to 🅰.1:**
1. No "beta" language anywhere — not in email, not in conversation, not in pricing context. Use "early look" or "friction-finding session."
2. No pricing conversation, no founding member offer, no commitment ask. If Eric loves it, he doesn't get to buy yet. Product is not for sale.
3. Friction log generated, committed to brain post-session, drives next sprint queue. If 30 days pass without code changes traceable to Eric's session → recon failed → fall back to 🅰.4 strict.

**If any condition slips:** Eric pulled, posture returns to 🅰.4 strict hold, no further outreach until cockpit-done criteria materially advance.

**What this decision does NOT do:**
- Does not assert any of criteria 1–6 are met
- Does not unlock Grant, Jon, Richard, or any other warm contact
- Does not reopen Waalaxy / paid outreach
- Does not change "no founding member offers" doctrine
- Does not modify cockpit-done-definition.md

**What this decision does:**
- Reframes Eric specifically as discovery user with explicit conditions
- Acknowledges criterion #5 requires action that strict-hold doctrine forbids — surfaces the deadlock and resolves it without revising the gate
- Establishes contact-vs-promise distinction as doctrine

**Reversal trigger:** If by EoD 260510 (one week from commit) no Eric session is scheduled OR any of the three conditions look at risk, this decision auto-reverts to 🅰.4 strict and Eric is pulled until cockpit-done criteria advance.

---

## 260503 — Hardening #2 + #3 canon + CC SessionStart hook plan

Decision: Adopt POINTER_VERSION + POINTER_CONTENT_HASH + integrity.md trust anchor + L1 Freshness Gate as the architectural canon. Demote Chat-side date proxy to soft-signal-only due to unfix-able web_fetch cache behavior. CC SessionStart hash hook is the recommended primary detector for Hardening #3.

Rationale: Two weeks of real-world validation (Apr 13–28, then May 1–3) revealed the 5-layer architecture works but has a single unfixable gap: claude.ai web_fetch caches responses for ≥30 min and rejects cache-bust params. Any operator-initiated brain write that skips rebessing integrity.md will not be detected by Chat within that window. Chat-side detection has bounded utility — CC-side detection must be primary.

Items closed:
- F4 (POINTER drift): POINTER_VERSION + POINTER_CONTENT_HASH fields verified end-to-end in real Chat session 260503.
- F8a (self-sealing freshness): catchup-originated writes now surface as drift; brain-committer --catchup refuses integrity.md updates.
- F8a gap discovery: Chat-side date proxy unreliable for writes within ~30 min. Root cause and mitigations documented in patterns.md.

Items deferred:
- CC SessionStart hook (Hardening #3): Recommended implementation awaits Jason review. Effort: M.
- gl-brain ↔ gl-brain-public sync mechanism: Partial propagation delay discovered Apr 28–May 3. Needs investigation.

Pattern: Any future brain-write detection scheme must account for web_fetch cache ≥30 min on claude.ai. Local filesystem reads preferred over remote fetches for ground truth.

## 260428 — Brain prevention architecture deployed
Decision: 5-layer architecture covers all originally identified
  failure modes (A/B/C/D/E). Bonus SessionStart hook for CC.
Rationale: 15-day blind drift in Apr 13–28 cycle exposed total
  absence of monitoring. Detection + alerting + recovery now
  layered, no single point of failure for brain freshness.
Layers: L1 Freshness Gate, L2A Brevo failure alert, L2B daily
  heartbeat 9am BRT, L3a Rule 12 brain-committer routing,
  L3b auto-catchup synthesis, L3.5 config version control.
Components: globalink-brain repo, globalink-brain-public mirror,
  POINTER_COMMAND.md v3 in project knowledge, sync-public.yml +
  brain-heartbeat.yml workflows, brain-committer agent,
  globalink-claude-config repo.

## 260428 — 4 unmitigated failure modes accepted as known gaps
Decision: F1 (catchup corruption), F3 (hot memory drift),
  F4 (POINTER drift), F7 (architecture rot) identified in
  post-L3.5 audit. Top 3 mitigations queued for next session.
Rationale: shipping 5 layers + audit in one session was the
  right call. Hardening F-series modes is post-MVP work.
Revisit: pre-São Paulo (May 1) — POINTER version field + parity,
  monthly fire drill cron, per-file diffs in catchup approval.

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
  STRIPE_SOLO_PRICE_ID, STRIPE_STUDIO_PRICE_ID,
  STRIPE_AGENCY_PRICE_ID
Rationale: Legacy aliases removed in c30ad1a. STRIPE_PRICE_STUDIO
  and STRIPE_PRICE_AGENCY renamed to match convention in 8635e83.
  ACTION: Update Vercel env vars to match new names.

## 260413 — FM cap race condition: Option B
Decision: Document known race, manual check after purchase.
Rationale: 25-seat cap makes simultaneous purchase
  probability near-zero. Redis lock is over-engineering
  for this volume. Review if cohort fills fast.

## 260413 — system_prompt redacted from DB
Decision: Store hash + length, not full prompt.
Rationale: Workspace DNA + API patterns in plaintext
  in task_executions was a security gap. Hash preserves
  auditability without storing sensitive content.

## 260413 — Gemini vendor status: pending not null
Decision: Gemini/cursor/custom vendors return pending
  status rather than null. UI shows "coming soon."
Rationale: Returning null silently made Sandra think
  her Gemini agent was working when it wasn't.

---

## 260503 — Hardening #3 ships CC-side SessionStart hash hook as canonical F8a detector

Decision: Hardening #3 ships the CC-side SessionStart hash hook (`brain-integrity-check.js`) as the canonical detector for F8a (self-sealing freshness signal). Chat-side date proxy is demoted to soft-signal-only because web_fetch cache makes it unreliable for sub-30-min drift detection. The hook reads gl-brain/command/integrity.md hashes directly from the filesystem, bypasses all caches, and emits a HARD BANNER into CC context on any hash or date-proxy mismatch.

Rationale: Chat-side date proxy was the intended F8a closure in Hardening #2, but the corruption test (260503) revealed claude.ai web_fetch holds stale cached content for 30+ minutes and rejects cache-bust query params. The CC-side hook has no dependency on network or cache — it reads local disk every session. Three-state self-test verified (clean → drift → recovery) on 260503.

Items closed: F8a fully closed (both Chat-side soft signal + CC-side hard signal operational).


---
## --- Decisions from globalink-brain (pre-merge, 260413–260428) ---

## 260428 — Public mirror archived root cause resolved
Decision: globalink-brain-public was archived 260422, causing
  6 days of silent 403 failures on sync Action. Unarchived 260428.
Action: Add on-failure email alert to sync workflow (Brevo).
  Upgrade Node.js 20 in Action before Jun 2 deprecation deadline.
Revive condition: N/A — operational fix

## 260427 — HOT MEMORY DOCTRINE
Decision: Hot memory stores invariant behavioral rules ONLY.
Kill test: "Would Claude do the wrong thing before reading even
  one file?" Yes → hot memory. No → brain.
Brain routing:
  state.md → build/GTM/bugs
  patterns.md → repo/build conventions
  decisions.md → architecture/IP
  killed.md → rejected ideas
  research.md → competitive/market
  entities.md → contacts (private, never synced)
Rationale: State, contacts, intel, and reference data in hot
  memory bloats context and creates staleness risk.

## 260427 — ACTION OFFICER DOCTRINE (Rule 9)
Decision: When Jason gives a digital directive, Claude routes
  to correct variant and executes. Jason reviews and approves.
Acceptable for Jason as actor only:
  physical-world tasks, irreversible legal/financial signatures,
  identity-required tasks.
Never default to handing Jason a todo list.
Violation signal: "stop making me the action officer" →
  self-correct immediately.

## 260427 — RAP-B REAL-SCAN RULE (Rule 10)
Decision: Every non-trivial task requires real scan of:
  /mnt/skills/public + ~/.claude/agents (190 files) +
  .cursor/rules (162 .mdc) + 9 RPM plugin packs.
RAP-B "none" must always be qualified by what was checked.
Stamping without scanning is a Rule 10 violation.

## 260427 — MEMORY-CHECK-PRECEDES-RECON RULE (Rule 11)
Decision: Before filesystem recon on any task involving paths,
  repo state, auth, or install locations — surface relevant
  memory first. Discovering through recon what memory already
  encoded is a Rule 11 violation.

## 260427 — AGENT/SKILL LIBRARY AUDIT CADENCE
Decision: Cowork scans first Monday monthly.
Sources: awesome-claude-code, awesome-mcp-servers,
  Anthropic docs/blog, NPM @anthropic-ai, r/ClaudeAI.
Vetting: 500+ stars or Anthropic-affiliated, ≤90d commit,
  permissive license, no telemetry.
Current inventory: ~/.claude/agents/ 190 .md files
  (189 STOCK + 1 ORIGINAL: cc-prompt-architect, COMMAND-only).
  .cursor/rules 162 .mdc all stock. 9 RPM plugin packs ~100 skills.

## 260416 — API key security: pooled keys default
Decision: Onboarding is API-key-free by default.
  COMMAND pooled keys power all proxy calls.
  BYOK opt-in only via Settings > Integrations.
Enforcement: Eric must never see an API key screen.
Rationale: "Another tool to manage" is the primary kill trigger.
  Key friction must be zero at first contact.

## 260416 — MCP scope overlap warning: Phase 3
Decision: Scope field on MCP status endpoint queued for Phase 3.
  Warns when two registered MCPs have overlapping capability sets.
Gate: first paying customer (same as Phase 3).

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

## 260413 — Stripe price ID canonical names locked
Decision: One env var name per price ID. No aliases.
  STRIPE_FM_PRICE_ID, STRIPE_PRO_PRICE_ID,
  STRIPE_SOLO_PRICE_ID, STRIPE_PRICE_STUDIO,
  STRIPE_PRICE_AGENCY
Rationale: Legacy aliases removed in c30ad1a.
  Dual names caused silent failures.

## 260413 — FM cap race condition: Option B
Decision: Document known race, manual check after purchase.
Rationale: 25-seat cap makes simultaneous purchase
  probability near-zero. Redis lock is over-engineering
  for this volume. Review if cohort fills fast.

## 260413 — system_prompt redacted from DB
Decision: Store hash + length, not full prompt.
Rationale: Workspace DNA + API patterns in plaintext
  in task_executions was a security gap. Hash preserves
  auditability without storing sensitive content.

## 260413 — Gemini vendor status: pending not null
Decision: Gemini/cursor/custom vendors return pending
  status rather than null. UI shows "coming soon."
Rationale: Returning null silently made Sandra think
  her Gemini agent was working when it wasn't.

## 260418 — GTM primary motion: Community-first, not outreach-first
Decision: LinkedIn community-first replaces Waalaxy as primary
  top-of-funnel. Waalaxy demoted to research instrument (€49/mo).
Rationale: Cold outreach yields 3-5 conversations/6wks — research
  instrument, not growth engine. Community-led is fastest
  rapid-growth lever for bootstrap solo founder.
Cancel trigger: End of June; if zero discovery calls + zero
  usable buyer-language quotes harvested, cancel Waalaxy.

## 260418 — Pricing model: Flat + caps + overages (hybrid)
Decision: Reject pure usage. Keep flat as primary. Add task caps
  per tier with overage upsell to next tier. Introduce $29
  Starter tier. Preserve $99 FM locked-rate cohort.
Rationale: Sandra's mental model is flat (ChatGPT/Claude/Perplexity
  all flat). Pure usage breaks conversion, kills engagement,
  destroys FM offer, complicates forecasting.
Revisit: Q3 2026 — credit packs if 3+ FM customers ask for
  pay-as-you-go in discovery.

---

## 260503 — L1 Freshness Gate · web_fetch cache-bust limitation · CC-side hook is authoritative

[PERSISTENT]
Author: Chat (via CC brain-committer)

Session: [GL | INFRA | L1 Gate Cache-Bust Test · POINTER v3.1 Verdict | 260503]

**Finding:** Chat-side L1 Freshness Gate cannot force fresh GitHub raw fetches via URL query-param cache-bust (`?nocache=...`). web_fetch's permission system rejects arbitrary query params not previously seen in tool results — returns PERMISSIONS_ERROR. Bare URL succeeds but inherits whatever caching exists at the fetch layer.

**Architectural conclusion:** Chat-side L1 verification is best-effort against potentially stale fetcher caches. The CC SessionStart hook (which reads local file content directly via filesystem, no HTTP layer) is the only authoritative integrity verification path.

**Doctrine implications:**
1. Chat-side L1 SOFT BANNER is the right default when integrity cannot be independently confirmed for all 5 tracked files — do not auto-promote to CLEAR
2. For high-stakes verification (post-corruption test, post-rebless), require CC session pass — Chat session pass is necessary but not sufficient
3. To force freshness when it actually matters, bump POINTER_CONTENT_HASH and push — any cached copy fails parity check on next gate run

**No code change required.** This is a doctrine clarification — captures a known gap in the F4/F8a closure architecture so it isn't re-derived later.

**Related:** Hardening #2 entry (260503 in state.md), POINTER_COMMAND.md v3.1, command/integrity.md.

