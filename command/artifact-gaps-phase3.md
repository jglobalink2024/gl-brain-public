# COMMAND Artifact Gaps — Phase 3 Blocker Audit
# GlobaLink | globalink-brain/command/artifact-gaps-phase3.md
# Locked: 260416 | [PERSISTENT]

---

## PHASE 3 BLOCKERS (Build Now)

### 1. Schema Migration Log
**Status: BLOCKER**
15 pending Supabase migrations with no log of what was applied, when, or by whom.
**MVV:** Single markdown table — migration name, applied date, environment,
applied by, result. One row per SQL block run in the Supabase SQL Editor.
**Lives at:** `command-app/command-app/docs/ops/migration-log.md`
**Why now:** Phase 3 adds more schema changes. Without a log, migrations will
conflict and there is no rollback reference.

### 2. FM Cohort Tracker
**Status: BLOCKER**
Founding Member $99 pilot is active. No structured record of who signed, NDA
status, seat count, access tier, or renewal date.
**MVV:** Table — name, company, signed date, NDA status, tier, seats, cohort expiry, next action.
**Lives at:** `globalink-brain/command/fm-cohort-tracker.md`
**Why now:** Active prospects in motion. Missing tracker = deal slips or NDA gap undetected.

### 3. Credentials Audit Log
**Status: BLOCKER**
No inventory of which API keys, tokens, and service accounts exist, who holds
them, when they rotate, or what access they carry.
**MVV:** Table — service name, credential type, owner, rotation schedule,
last rotated, scope/permissions.
**Lives at:** `globalink-brain/command/credentials-audit.md` (brain only, never repo)
**Why now:** Phase 3 adds Stripe live keys, new Supabase service roles, and
third-party integrations. Uncatalogued credentials are a security gap.

### 4. Onboarding Runbook
**Status: BLOCKER**
No documented sequence for activating a new COMMAND workspace: Supabase row
creation, Stripe subscription attach, feature flag defaults, welcome email trigger.
**MVV:** Step-by-step checklist, 10–15 steps, with exact SQL or UI path for each.
**Lives at:** `command-app/command-app/docs/ops/onboarding-runbook.md`
**Why now:** First beta user activation will happen in Phase 3. Without a
runbook, first activation is improvised and unrepeatable.

### 5. Feature Flag Registry
**Status: BLOCKER**
No record of what feature flags exist, what they gate, default state, and
which user cohorts (FM vs. standard) have them enabled.
**MVV:** Table — flag name, gates what, default (on/off), FM cohort override,
who can toggle, added date.
**Lives at:** `command-app/command-app/docs/ops/feature-flags.md`
**Why now:** Phase 3 introduces new gated features. Without a registry, flags
accumulate as invisible state. One wrong default breaks FM cohort access.

---

## DEFERRED (Phase 4 or Later)

| Artifact                        | Why Deferred                                                         | Target Phase |
|---------------------------------|----------------------------------------------------------------------|--------------|
| Post-mortem registry            | No production incidents yet; create after first P0 event            | Phase 4      |
| Rate limit playbook             | No rate limit events; build reactively after first breach           | Phase 4      |
| Vendor incident response plan   | No SLA-bound vendor contracts in Phase 3; revisit at 10 customers   | Phase 4      |
| API deprecation registry        | No external API consumers yet; create when first partner integrates | Phase 4      |
| Browser compatibility matrix    | COMMAND targets Chrome/Edge only in Phase 3; expand at Phase 4 GTM  | Phase 4      |

---

## Summary

| Artifact                  | Phase 3 Blocker? | MVV exists? | Owner         |
|---------------------------|------------------|-------------|---------------|
| Schema Migration Log      | YES              | YES         | Claude Code   |
| FM Cohort Tracker         | YES              | YES         | Jason + CC    |
| Credentials Audit Log     | YES              | YES         | Jason (brain) |
| Onboarding Runbook        | YES              | YES         | Claude Code   |
| Feature Flag Registry     | YES              | YES         | Claude Code   |
| Post-mortem registry      | No               | —           | Phase 4       |
| Rate limit playbook       | No               | —           | Phase 4       |
| Vendor incident response  | No               | —           | Phase 4       |
| API deprecation registry  | No               | —           | Phase 4       |
| Browser compatibility     | No               | —           | Phase 4       |
