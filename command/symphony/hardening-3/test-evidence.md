[EVIDENCE]
Last updated: 260503
Author: CC

# Hardening #3 — CC SessionStart Hash Hook Test Evidence

Test ran 260503 against `~/.claude/hooks/brain-integrity-check.js`.
Verifies the F8a CC-side detection arm — the path that bypasses
claude.ai web_fetch cache.

## Test 1 — Clean state (no drift expected)

Command: `node ~/.claude/hooks/brain-integrity-check.js`

Output:
```json
{"hookSpecificOutput":{"hookEventName":"SessionStart","additionalContext":""}}
```

Result: ✅ Empty additionalContext = CLEAR. Hook silently passes.

## Test 2 — Drift state (HARD BANNER expected)

Setup: appended a single space to `command/state.md` without
updating `command/integrity.md`. Equivalent to a brain-drain or
auto-catchup write that bypasses brain-committer.

Command: `node ~/.claude/hooks/brain-integrity-check.js`

Output:
```json
{
  "hookSpecificOutput": {
    "hookEventName": "SessionStart",
    "additionalContext": "🔴 BRAIN INTEGRITY MISMATCH detected at session start.\nL1 Step 3.5 (CC-side hash hook) failed for: command/state.md [hash mismatch (expected 9e8c46c0…, got b1028584…)].\nSuspected corruption from auto-catchup, brain-drain queue flush, or out-of-band edit. DO NOT proceed with brain synthesis. Operator must review diff and run `brain-committer --rebless` after verifying brain content is correct. See gl-brain/POINTER_COMMAND.md Step 3.5."
  }
}
```

Result: ✅ HARD BANNER fired. Hash drift detected, file named, recovery path stated.

## Test 3 — Recovery (CLEAR after revert)

Setup: reverted state.md to backup (hash matches manifest again).

Command: `node ~/.claude/hooks/brain-integrity-check.js`

Output:
```json
{"hookSpecificOutput":{"hookEventName":"SessionStart","additionalContext":""}}
```

Result: ✅ Empty additionalContext. Banner clears automatically once integrity is restored.

## Significance

This is the corruption test that **failed on Chat side** during Hardening #2 verification — claude.ai web_fetch cache held stale state.md content for ≥30 min, masking the drift even though raw.githubusercontent.com served the new version. CC-side bypasses every cache by reading the local filesystem directly. F8a detection is now reliably closed for the agent variant where it matters most: developers writing code against the brain.

Manifest at test time:
```
state_hash: 9e8c46c0786bfcfc79a41d668d56eb1fab0678baafe67a4cda84951d244fe169
decisions_hash: 4a9f32bbde0d180ac0de83548361bb4643a54f2664c6ead56e9cac555ca0c431
patterns_hash: 651b546faef0ccebefec50a8c3f3ff45585ee8dbeb7956cd93b8a6ffda8de307
killed_hash: a6453f843593fae27d418ecbca3e764684ef0fbfc29a332d4f2f61d4c7a41364
research_hash: 7f02427b065db153e44e2972ed45925c87346b737d4505b491deb382f7857c6b
last_verified: 260503-2340
```
