[PERSISTENT]
Last updated: 260505
Author: CC (filed) · Claude Chat (drafted)

> **Note:** This is an architecture/ reference doc. Not tracked in `integrity.md`
> (current schema covers only the 5 canonical files: state, decisions,
> patterns, killed, research). If hash-anchoring of architecture docs is
> desired in future brain hardening, extend `integrity.md` with a
> `tracked_reference_docs:` section.

---

---
tier: T2
project: CMD
workstream: TECH
title: COMMAND Deep Dive — Brain Alignment 260504
date: 2026-05-04
session: "[GL | TECH | Build State Snapshot · Brain Alignment | 260504]"
status: COMPLETE
version: v01
tags: [command, build-state, gp-1, pure-path-a, brain-hardening, alignment]
---

# 🎯 COMMAND — Deep Dive · Brain Alignment 260504

> **Purpose:** Get every Claude variant (Chat, CC, Cowork, Chrome) and every future session onto identical ground truth about where COMMAND actually is, what's shipping, what's theater, and what unblocks the next move.

> **Audience:** Future-Jason, future-Claude, future-CC. Read this before any non-trivial COMMAND session if state.md hasn't been touched in >3 days.

---

## 📊 1. Quick Summary — The Five Truths

- 🚧 **Product is not yet what it says on the box.** Pure Path A is the standing posture: cockpit-only, no notebook, no June 1 product deadline. Ship only when six "done" criteria are met.
- 🟢 **Brain is now hardened.** Five-layer prevention architecture is live. POINTER v3.1 + integrity.md trust anchor closes F4 + F8a. Closeout v2 (260503) closes F8a/F8c. Auto-catchup can no longer self-certify.
- 🔴 **GP-1 gate has not cleared.** Cookie-consent dialog in `auth.setup.ts` is blocking the Playwright smoke gate. Single-line fix. COMMAND code itself is healthy (canary 172ms, audit ledger active). *(Note: fix confirmed present in commit 1af2195 — see state.md entry 260504 for canonical GP-1 status.)*
- 📉 **GTM is paused, honestly.** 231 contacts touched, zero paying customers. Warm pipeline (Eric, Grant, Richard, Jon, Blaz) is on hold pending GP-1 + cockpit-done criteria. Coming-soon page replaces the marketing pitch.
- 📅 **June 1 is a relocation date, not a product date.** São Paulo anchor stands. Retirement stands. Product ships when real, not when calendar says.

---

## 🏗️ 2. Architecture Snapshot — What Exists Today

### 🟢 Working (verified)

- 🟢 **Golden Path Smoke** — `e2e/golden-path.spec.ts` hits 3× GREEN at 11.0s / 9.5s / 17.4s on 260424. Real backend round-trip: dispatch → `/api/tasks/execute` → Anthropic 200 → audit ledger → status complete.
- 🟢 **Single canonical autoHandoff** — Batches A + E shipped (`78b078d`, 260423). Three forked entrypoints collapsed to one. All `audit_ledger` writes route through `lib/ledger.ts → writeLedgerEntry` with entry_seq sequencing + SHA-256 hash chain + 23505 retry.
- 🟢 **audit_ledger entry_seq trigger** — `pg_advisory_xact_lock(hashtext(workspace_id))` serializes concurrent inserts (`60eeec0`, 260423). Closes I-6.
- 🟢 **Credit hooks (Slot 3)** — `lib/credit-hooks.ts` wired into `executeTask.ts` and `pitch/route.ts`. `try_deduct_credits` RPC eliminates TOCTOU. Cost field on audit_ledger now structured `{ model, modelLabel, inputTokens, outputTokens, totalTokens, costUSD, provider, keyId }` (`b25afc9` + `59a0d1e`, 260427).
- 🟢 **BYOA pooled-key fallback** — `canvasExecution.ts` resolves `agent.api_key || getPooledKey(vendor)` (`f2010ee`, 260427). Eric can use canvas day-one with no BYOA setup.
- 🟢 **/dev dashboard** — Email-gated (`DEV_EMAILS`) debugging control room. Smoke test SSE, log stream, atomic reset RPCs (`dev_nuclear_reset`, `dev_clear_tasks`), durable audit trail (`event_type='dev_action'` survives nuclear).
- 🟢 **ROI baseline math** — Defensible 2-mode system (`cbe033f`, 260428). n<5 → industry benchmark 8 min/task (McKinsey GI 2023 cited). n≥5 → per-agent-type adaptive bucket math. Header comment + `baselineExplanation` aligned with current model.
- 🟢 **Canvas Run-in-Agent button** — Always renders (`0ca485d`, 260428). No-agent case shows actionable amber error, not silent dead end. Playwright verified.
- 🟢 **Symphony v12 verdict** — SHIP WITH FIXES. F1 (BILL-03), F2 (J2 spec rewrite to /router + /bridge), F3 (skeleton loaders), F4 (router threshold 75→70), F5 (J2 v12.2 PASS) all closed.

### 🟡 Working but unverified end-to-end

- 🟡 **Slot 1 — Canvas full chain** — Button-to-API wire confirmed live (HTTP 200). Full chain blocked by api_key save bug (now fixed `260427`, post-deploy verification pending Jason).
- 🟡 **Slot 2 — autoHandoff** — Production data shows 6 real `agent_handoffs` rows from Apr 22-23 (real `decisions_made` content, real handoff prompts). New spec architecturally cannot observe entity carry-through from browser (Agent A+B both run server-side in one request). Verified via DB inspection, not via spec.
- 🟡 **Brain Hardening #1 (closeout v2)** — Built and committed 260503. Failure-path test (move `brain-committer/SKILL.md` aside, run closeout, expect Brevo email + exit 1) pending Jason's manual run.

### 🔴 Known blocking issues

- 🔴 **GP-1 gate** — Cookie consent dialog in `auth.setup.ts` not dismissed → Playwright smoke fails on the gated assertions. Single-line fix: add `getByRole('button', { name: 'Essential Only' })` dismissal after `page.goto`. Until this fires, GP-1 cannot run GREEN, autogap queue stays parked, Eric stays on hold. *(Note: fix confirmed in commit 1af2195 — see state.md for current gate status.)*
- 🔴 **`starter_credits_used` never increments** — Column exists, hook exists, but real usage never deducts on pooled-key calls. Margin risk before Eric onboards. Parked behind GP-1.
- 🔴 **Pooled-key paid plans have no token cap or audit trail** — Margin bleed risk. Parked behind GP-1.

### ⚪ Parked (post-GP-1, post-first-revenue)

- ⚪ **Canvas-to-Router post-workflow dispatch** — Slot 1 Phase 3 feature, fully designed, deferred.
- ⚪ **GP-2 (chain dispatch Perplexity → Claude)** — Gates on GP-1 stable 48h.
- ⚪ **GP-3 (self-serve onboarding)** — Parked post-first-revenue.
- ⚪ **Dual rate tables consolidation** — `model-router.ts` per-million vs `costs.ts` per-1000. Tech debt before paid tiers.

---

## 🧠 3. State Management — The Hardest Truth

The single root cause of every persistent COMMAND bug since 260413: **no single source of truth for task lifecycle state.**

Three surfaces independently asserted state, none deferred to a canonical owner:

1. **`audit_ledger`** — Hash-chained event log. Was being written from 19 different code sites with three different patterns (`.insert()`, `.upsert({onConflict:'id'})`, `.upsert({onConflict:'workspace_id,entry_seq'})`).
2. **UI polling** — `agent.status` derived from 5/15/30s adaptive polling. No Realtime subscription. Sidebar stuck at "Working..." after task completes.
3. **`execution_mode` derivation** — UI-derived prop only. Column did not exist in schema. Lost on refresh. Manual flow buttons rendered on auto tasks.

### What got fixed (260423–260428)

- ✅ **Single ledger writer** — All 23 `audit_ledger` write sites now route through `writeLedgerEntry` (Batch E, `6ee63bf` + `78b078d`).
- ✅ **Entry_seq trigger + advisory lock** — Concurrent writes serialize on `hashtext(workspace_id)`. Retry loop hardened 3→10 attempts with exponential backoff.
- ✅ **Single autoHandoff** — Three entrypoints collapsed to one canonical implementation in `lib/pipeline/autoHandoff.ts` (Batch A).
- ✅ **`tasks.execution_mode` column** — Migration `20260423_user_intent_execution_mode.sql` added column. `executeTask.ts` writes it at execution entry. Router writes it on dispatch. Survives refresh.
- ✅ **Strict `isAutoExecuting` UI gate** — `TaskBriefCard` reads live status from Zustand store by taskId. Manual flow elements hidden during automated execution.
- ✅ **`updated_at` column bug** — 5 occurrences in `canvasExecution.ts` fixed (column doesn't exist, all canvas step status writes were silently failing). Fixed to `started_at` / `completed_at` (`fbc7a90`, `9cbefa4`).

### What's still drifting

- ⚠️ **Sidebar Realtime subscription on `agents`** — Only `audit_ledger` is subscribed. Agent status still propagates via polling. Mitigation: `TaskOutputPanel` writes directly to Zustand store on `complete` / `error`, bypassing the round-trip. Real fix (Batch B) parked.

---

## 🎯 4. The Strategic Posture — Pure Path A

**Locked 260427.** This is non-negotiable doctrine until Jason explicitly changes it.

### What Pure Path A means

- 🛠️ **Build the real cockpit.** Cockpit only. No notebook. No detour features.
- 📅 **June 1 passes without a paying customer if necessary.** Retirement happens. São Paulo move happens. Product does not ship to customers until it's real.
- 🚫 **No theater.** Handoff, status dashboard, and task router were UI theater pre-260427. Pure Path A accepts this honestly.
- 📋 **Six "done" criteria** (`cockpit-done-definition.md`, locked, goalposts cannot move without brain commit):
    1. Non-technical operator onboards in <10 min
    2. One real end-to-end cross-vendor handoff without copy-paste
    3. Real agent status observable
    4. Intelligent routing
    5. Three non-Jason users returning after 7+ days unprompted
    6. Landing page copy matches actual product function sentence-for-sentence

### What changed externally (260427 sweep)

- 🚫 **Eric drafts marked DEAD** (`eric-delay-firmer.md` + `eric-delay-softer.md` ⛔ WILL NEVER BE SENT). Eric protocol: silence until criteria 1–6 met. If Eric reaches out: *"Still building. Will reach out when it's ready."*
- 🟡 **Sales pipeline frozen** — Eric → HOLD, Danny/Amy/Cody → COLD HOLD. Warm-network reset note drafted for Grant, Jon, Richard, Blaz (honest reset, not beta pitch).
- 🌐 **Public pages cleaned** — `/pricing`, `/beta-syllabus`, `/one-pager` redirect 302 to `/`. `/sales-hub` stays (internal, API-key gated). `/demo` and `/privacy` stay.
- 📄 **Landing page replaced** — 731-line marketing pitch archived. New page: 3-sentence thesis, status strip ("building Phase 1"), email CTA. No pricing. No ROI calculator. Old page at `command-gl/public/index_marketing_v1_260422.html`.
- ⏸️ **Waalaxy paused** — CfC prompt drafted for billing-date surface + campaign pause.

### Why this works

The structural moat is permanent: COMMAND owns the **operator identity layer**, not the model layer. No single AI vendor (Anthropic, OpenAI, Perplexity, Grammarly/Superhuman) can solve cross-vendor coordination by definition — they all have walled-garden incentives. COMMAND's BYOA cockpit thesis stays correct even when Anthropic Coordinator Mode (~May 2026 GA) and Superhuman Go (Grammarly's $825M rebrand) ship. They're walled gardens. COMMAND is the cockpit, not the engines.

---

## 🛡️ 5. Brain Architecture — Five Layers + Hardening

The brain is now production-grade. Here is the full picture.

### Layer 1 — Freshness Gate (POINTER v3.1)

Runs at the top of every Chat/CC session. Five steps:

1. **POINTER version parity** — local POINTER_VERSION vs remote. Drift → HARD BANNER.
2. **Required brain fetch** — `format.md`, `state.md`, `integrity.md`, `RESPONSE_RULES.md`, `gl/principles.md`, `gl/decisions.md` always. Session-type adds (BUILD/STRATEGY/GTM/COMPETITIVE/PATENT).
3. **Date freshness** — `state.md` `Last updated:` ≤3d → CLEAR · 4–7d → SOFT · >7d → escalate to Step 5.
4. **Banner emission** — 🟢 CLEAR / 🟡 SOFT / 🔴 HARD.
5. **Auto-catchup synthesis (L3b)** — fetch last 7 days of brain commits, synthesize delta, surface to operator before answering.

**Step 3.5 (closes F8a):** Integrity manifest verification. Every brain file's `Last updated` compared to `integrity.md`'s `last_verified`. CC-side hook also computes SHA-256. Drift → HARD BANNER. Auto-catchup MUST NOT update integrity.md → catchup-originated content surfaces as drift on next session → operator must rebless via `brain-committer --rebless`. **Catchup can no longer self-certify.**

### Layer 2A — Brevo on-failure alert

Closeout v2 emails `jason@globalinkservices.io` on any silent step failure. Exit code distinguishes "ran clean" (0) from "ran with silent step failures" (1).

### Layer 2B — Daily heartbeat

Cron 9am BRT writes `~/.claude/closeout-last-success` on clean exit. Gap = closeout silently broken.

### Layer 3a — Rule 12 brain-committer routing

All writes to `globalink-brain/command/` or `gl/` MUST route through the brain-committer agent. Direct writes = violation. Per-file modes:
- `state.md` + `gl/principles.md` = FULL-REPLACE
- `decisions.md` + `killed.md` + `research.md` = APPEND
- `patterns.md` = APPEND-with-edits
- `gl/entities.md` = NEVER (private only)
- Exception: `.github/workflows/` — direct writes allowed with manual git discipline.

### Layer 3b — Auto-catchup synthesis

`queue-chat → brain_queue → brain-drain` propagates chat-originated content to brain. By design does NOT touch `integrity.md`. Drift surfaces on next session.

### Layer 3.5 — globalink-claude-config repo + closeout sync

207-agent inventory in `~/.claude/agents/` is version-controlled at `jglobalink2024/globalink-claude-config`. Sync via `~/bin/claude-config-sync.sh` (LOCAL→REPO one-way). Closeout pushes config on every clean exit.

### Brain Hardening #1 (260503 — shipped today)

Closeout v2 hardened against:
- **F8a (silent entry-point failure)** — three health checks: brain-committer SKILL.md existence, sync script presence/exec bit, gl-brain push parity.
- **F8c (silent brain-committer miss)** — brain-committer version check (warn-only until SKILL.md gets a version tag).
- **Brevo failure alert** — fires to jason@globalinkservices.io on any step failure.
- **Heartbeat write** — `~/.claude/closeout-last-success` on clean exit.

`~/bin/closeout` rewritten 129 → 280 lines. Repo copy at `globalink-claude-config/bin/closeout` byte-identical. Both `chmod +x`. `bash -n` passes.

### Brain Hardening #2 (260428 — shipped)

POINTER v3.1 + integrity.md trust anchor. Closes F4 (POINTER drift) and F8a (self-sealing freshness signal). Architecturally complete; live verification (corruption test fires HARD BANNER in real Chat session) was the gating step before declaring it done — Jason confirmed the L1 Gate firing CLEAR today.

### Open audit items (post-Opus 260428 audit)

| Item | Severity | Status |
|---|---|---|
| F4 — POINTER drift | HIGH×HIGH | ✅ CLOSED via Step 1 version parity |
| F8a — self-sealing freshness | HIGH×HIGH | ✅ CLOSED via integrity.md trust anchor |
| F1 — catchup synthesis corruption | HIGH×HIGH | 🟡 partially mitigated (per-file diffs in approval = #5 in queue) |
| F3 — hot memory drift | HIGH×HIGH | 🟡 partially mitigated (SessionStart hook injects 207-agent inventory) |
| F7 — architecture rot over time | HIGH×HIGH | 🔴 unmitigated — needs monthly fire drill |
| F2 — Brevo silent failure | MEDIUM×HIGH | 🟡 partial — needs fire drill (#4 in queue) |

**Trio remaining open infra items:**
1. Closeout health check + alert (#1) — partially shipped via Hardening #1
2. POINTER version field + content hash parity (#2) — ✅ shipped via Hardening #2
3. Non-Brevo notification channel (#3) — 🔴 only remaining open infra item

---

## 📈 6. GTM Reality — The Honest Read

### Numbers

- 231 contacts touched
- 0 paying customers
- 1 validated pain quote (Jon Smith / Veteran Horizons): *"manual relay is best I've found"*
- ICP: "Sandra" — non-technical boutique operator, 1–15 person shop, owner-led, runs Claude + ChatGPT + Perplexity simultaneously, manually copy-pastes context
- API key onboarding barrier removed (pooled-key fallback in canvasExecution + executeTask)

### Warm pipeline (frozen)

| Contact | Tier | Status | Notes |
|---|---|---|---|
| Eric (jcameron5206@proton.me) | T1 warm | HOLD | Beta gated on GP-1 48h green + Slots 1+2 verified + Slot 3 credit hooks + F5 spec green + 24h stability |
| Grant Carlson (Global Entry Hub) | T1 warm | HOLD | Discovery call complete, follow-up reset note pending |
| Richard Squires | T1 warm | HOLD | Sgt. Maj. McClaflin intro, email `richardsquires1@hotmail.com` |
| Jon Smith (Veteran Horizons) | T1 warm | HOLD | Sole validated pain quote |
| Blaz Marolt | T3 not ICP | CLOSED | Referral source for Grant + Richard |
| Alhaji Bangura (Crown Government Services) | not ICP | DELIVERED | AI Starter Package shipped, novice user |
| Danny / Amy / Cody | COLD | HOLD | Pipeline freeze in effect |

### Discovery call line (locked 260427)

> *"Grammarly bet their entire brand on this problem. I built the boutique version — no migration, no lock-in, works with what you already run."*

Active for: Grant Carlson, Richard Squires, Jon Smith. **Do not deploy** until GP-1 green + cockpit-done criteria 1–6 met.

### Competitive watch

- 🟡 **Superhuman Go** (Grammarly rebrand, $825M Superhuman Mail acq Oct 2025) — walled garden, enterprise/high-volume target. NOT in boutique segment. 12–18mo watch window before they work down-market.
- 🟡 **Anthropic Coordinator Mode** (~May 2026 GA) — compounds same window pressure. Walled garden by definition.
- 🟢 **COMMAND's BYOA cross-vendor moat is permanent.** No single-vendor coordination feature can address it.

### São Paulo Innovation Week (~May 13)

Bilingual EN/PT one-pager needed. LATAM campaign Portuguese-first, post-relocation. Ponte brain deferred to Jun/Jul 2026.

---

## 🚦 7. The Gate Sequence — What Unblocks What

```
GP-1: atomic single-agent task completes
       ✅ all surfaces agree at every step
       ✅ zero audit_ledger errors
       ✅ agents return to idle
       Required: 24h GREEN + 1 confirming run (revised 260428 from 48h consecutive)
                 ↓
              [BLOCKED 260504: cookie consent in auth.setup.ts]
              [FIX CONFIRMED: commit 1af2195 — see state.md for current status]
                 ↓
GP-2: chain dispatch Perplexity → Claude
      Gates on GP-1 stable 48h
                 ↓
GP-3: self-serve onboarding
      Parked post-first-revenue
                 ↓
Eric beta invite
      Gates on: GP-1 48h green + Slots 1+2 manually verified +
                Slot 3 credit hooks + F5 spec rewrite green + 24h stability watch
                 ↓
São Paulo product announcement
      Gates on: cockpit-done criteria 1–6 met
```

**Today's single most-leveraged action:** the ~1-line cookie-consent dismissal in `auth.setup.ts`. That fix unblocks GP-1, autogap queue, Eric, and the entire downstream cascade.

---

## ⚠️ 8. Risk Map

### 🔴 High×High

- **F7 — architecture rot** — No fire drill cadence. Brain entropy compounds silently. Mitigation: monthly fire drill + per-file diffs in catchup approval.
- **Pooled-key margin bleed** — `starter_credits_used` never increments on real calls. Paid plans have no token cap. GL absorbs all API cost. Mitigation: parked behind GP-1.

### 🟡 Medium×High

- **F3 — hot memory drift** — Stale entries, contradictions. Mitigation: SessionStart hook injects 207-agent inventory; Rule 13 forces CALIBER+EFFORT+REVERSIBILITY+QUALITY BAR on every delegation.
- **F2 — Brevo monoculture** — Single notification channel. If Brevo silently fails, no fallback. Mitigation: non-Brevo channel #3 in queue.
- **Sidebar Realtime gap** — Agent status propagates via polling. Mitigated client-side via direct Zustand write on complete/error. Real fix (Batch B Realtime subscription) parked.

### 🟢 Low×High (asymmetric upside)

- **Cross-vendor moat** — Permanently unaddressable by any single AI vendor. Compounding strategic value.

---

## 🧭 9. What the Next Session Needs to Know

If you (Claude or Jason) open a new COMMAND session and read only one section, read this.

### 🎯 Standing posture

- **Pure Path A.** Cockpit only. No notebook. No detour features.
- **Six done criteria locked.** Goalposts cannot move without brain commit.
- **June 1 is a relocation date, not a product date.**
- **Eric protocol:** silence until criteria met. If he reaches out: *"Still building. Will reach out when it's ready."*

### 🛠️ Standing rules

- **Rule 10 — RAP-B real-scan.** Every non-trivial task = real scan of `/mnt/skills/public` + `~/.claude/agents` (207 files) + `.cursor/rules` (162 .mdc) + 9 RPM plugin packs. "None" must be qualified by what was checked.
- **Rule 11 — memory-check-precedes-recon.** Before filesystem recon, surface relevant memory first.
- **Rule 12 — brain-committer routing.** All writes to `globalink-brain/command/` or `gl/` MUST route through brain-committer.
- **Rule 13 — complete delegation contract.** Every cross-variant delegation prompt MUST specify VARIANT + CALIBER + EFFORT + REVERSIBILITY + QUALITY BAR.
- **Action Officer Doctrine (Rule 9).** Jason acts only on physical-world tasks, irreversible legal/financial signatures, identity-required actions. Everything else routes through Claude.

### 🚦 Today's blocker

GP-1 cookie-consent dismissal in `auth.setup.ts`. ~1-line fix. Until it fires, nothing downstream moves. *(Note: fix confirmed in commit 1af2195 — check state.md for current gate status.)*

### 🧪 Testing doctrine

- **All testing is real.** Real browser, real API, real credits. Never simulate unless Jason explicitly says "simulate." If you don't click it, we don't know.

### 📊 Model routing

- **Sonnet** for structured/code/context-provided tasks.
- **Opus** for blank-slate novel reasoning, strategic architecture, or Opus-tier CALIBER scores.
- **Never Haiku** for repo work.

### 🗂️ Brain access

- **POINTER:** `https://raw.githubusercontent.com/jglobalink2024/gl-brain-public/main/POINTER_COMMAND.md`
- **state.md:** `.../gl-brain-public/main/command/state.md`
- **integrity.md:** `.../gl-brain-public/main/command/integrity.md`
- **Local repo:** `C:\dev\gl-brain` (migrated from OneDrive 260504)
- **Brain write relay:** Supabase `brain_writes` table → Edge Function → GitHub commit

---

*T2_CMD_command_deep_dive_260504_v01 · Architecture reference doc · Author: Claude Chat (drafted) · CC (filed 260505) · Not tracked in integrity.md*
