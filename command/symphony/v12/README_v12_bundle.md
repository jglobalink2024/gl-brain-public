# Symphony v12 — Bundle README
[ONE-USE for this drop; PERSISTENT once committed to brain]
Bundle date: 260420
Author: Strategic AI (Opus 4.7)
Target execution: post-BILL-02 Vercel deploy + agent re-auth

---

## What's in this bundle

| File | Purpose | Brain destination |
|---|---|---|
| `COMMAND_Personas_v12.md` | 4 persona briefs for orchestrator role-play | `globalink-brain/command/symphony/v12/` |
| `COMMAND_Journeys_v12.md` | 5 journey scripts with CLICK-THEN-OBSERVE assertions | `globalink-brain/command/symphony/v12/` |
| `COMMAND_Claims_v12.md` | 7 claim pass/fail criteria with scoring rubric | `globalink-brain/command/symphony/v12/` |
| `COMMAND_Symphony_v12_Prompt.md` | Orchestrator prompt — paste into next Opus chat | `globalink-brain/command/symphony/v12/` |
| `patterns_v12_delta.md` | Doctrine update — append to patterns.md | `globalink-brain/command/patterns.md` (append) |

---

## Key shift from v11 to v12

**v11 unit of test**: Items (64 checklist entries)
**v12 unit of test**: Personas × Journeys × Claims (cells in a 4×5 matrix)

**v11 verification**: DOM presence, code reading, endpoint response
**v12 verification**: Click-then-observe with screenshots, network
payloads, credit deltas, backend state queries

**v11 weakness**: Superficial passes possible (button exists ≠ button works)
**v12 guard against**: Every assertion is a post-action observation

**v11 persona coverage**: 20 personas, surface depth
**v12 persona coverage**: 4 personas, behavioral depth (including
abandon-trigger enforcement)

---

## Handoff sequence for Jason

### Step 1 — Commit to brain (5 min)

```bash
cd C:\Users\jdavi\OneDrive\Desktop\GlobalInk Repos\globalink-brain
mkdir -p command/symphony/v12
```

Move these 4 files into `command/symphony/v12/`:
- COMMAND_Personas_v12.md
- COMMAND_Journeys_v12.md
- COMMAND_Claims_v12.md
- COMMAND_Symphony_v12_Prompt.md

Append `patterns_v12_delta.md` content into existing
`command/patterns.md` (keep the existing patterns.md content,
add this at the bottom).

Commit:
```bash
git add command/
git commit -m "brain: symphony v12 design — personas, journeys, claims, orchestrator prompt"
git push
```

Sync to public mirror fires automatically (~16 seconds).

### Step 2 — Verify BILL-02 deployment (5 min)

Don't fire the orchestrator until BILL-02 is visible on production.

- Check Vercel dashboard for latest deployment of commit `3593d49`
- Sign in as jcameron5206 → /settings/billing
- Confirm: 4 tiers (Solo, FM, Standard Pro, Agency), NO Studio,
  Pilot (Free) as current plan

If anything wrong on this screen, stop — there's a deploy issue before
symphony can run.

### Step 3 — Re-auth stalled agents (10 min)

Settings > Integrations:
- Claude-1: paste/reconnect API key
- GPT-4-1: paste/reconnect API key
- Perplexity-1: paste/reconnect API key

Return to dashboard — all three should show Idle (not Stalled).

Run a trivial dispatch to confirm one agent works end-to-end before
starting symphony (sanity check — doesn't count against v12 budget).

### Step 4 — Fire Symphony v12 (2.5-3 hours)

- Open fresh Opus 4.7 Claude.ai chat (NEW conversation, not continuation)
- Paste the contents of `COMMAND_Symphony_v12_Prompt.md` between the
  marker lines as your first message
- Orchestrator will fetch brain files and begin
- Keep browser available for MODE B fallback if Playwright setup
  isn't accessible to the orchestrator

### Step 5 — Review and commit proof files (30 min)

Orchestrator produces 4 proof files:
- COMMAND_ProofLog_v12.md
- COMMAND_Findings_v12.md
- COMMAND_Matrix_v12.md
- COMMAND_Delta_v11_v12.md

Review Delta first — it's the honesty check against v11.

Commit to brain:
```bash
git add command/symphony/v12/
git commit -m "brain: symphony v12 complete — [verdict from Matrix_v12.md]"
git push
```

Update brain `command/state.md` with v12 result summary.

### Step 6 — Act on verdict

| Verdict | Next action |
|---|---|
| **SHIP** | Canary (Iris 10-min walk) → Eric invite draft |
| **SHIP WITH FIXES** | CC Sonnet fixes → v12.1 surgical patch (failed cells only) → canary → Eric |
| **DO NOT SHIP** | CC Sonnet fixes CRITICALs → v12 re-run of affected journeys only |

---

## Budget and time

| Activity | Time | Credit cost |
|---|---|---|
| Bundle review + brain commit (now) | 30 min | $0 |
| BILL-02 prod verify | 5 min | $0 |
| Agent re-auth | 10 min | $0 |
| Symphony v12 execution | 2.5-3 hr | $5-8 |
| Proof review + brain commit | 30 min | $0 |
| **Total to ship decision** | **~4 hr** | **$5-8** |

This is the fastest legitimate path to a "ship or don't" decision on
Eric's May 5-10 invite. Skipping v12 would save the $5-8 but expose
Eric to untested handoff paths — which is the exact failure mode
we discussed at the start of this chat.

---

## Questions to answer before firing

Before firing the orchestrator, confirm:

- [ ] BILL-02 commit 3593d49 is deployed (Vercel shows latest)
- [ ] 4 tiers visible on /settings/billing, no Studio
- [ ] 3 test agents re-authed and Idle
- [ ] Credit balance > $5 on test workspace
- [ ] Opus 4.7 chat is fresh (not continuation of this chat)
- [ ] Brain files synced to public mirror (verify fetchability of
      personas_v12.md from the raw URL)
- [ ] At least 3 hours of loose availability for MODE B fallback

If all checked: fire.
If any unchecked: resolve first.

---

## What this bundle does not include

- Canary (Iris) brief — will build after v12 verdict is SHIP
- Eric invite draft — will build after canary passes
- LATAM persona extensions — post-May 1
- BYOK standalone journey (J6) — held for v13

These are documented in patterns_v12_delta.md under "Journeys NOT YET
IN DOCTRINE" and "Additions for later symphonies."
