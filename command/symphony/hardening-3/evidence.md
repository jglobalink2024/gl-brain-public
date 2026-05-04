[EVIDENCE]
# Hardening #3 — CC SessionStart Hash Hook Self-Test Evidence
Date: 260503
Author: CC
Hook: ~/.claude/hooks/brain-integrity-check.js
Test runner: node (direct invocation, same code path as SessionStart hook)

---

## TEST A — Clean state (no banner expected)

**Setup:** integrity.md reblessed with current hashes for all 5 tracked files.

**Hook output:**
```json
{"hookSpecificOutput":{"hookEventName":"SessionStart","additionalContext":""}}
```

**Result:** ✅ PASS — additionalContext is empty; no banner injected into CC context.

---

## TEST B — Drift state (HARD BANNER expected)

**Setup:** Appended ` DRIFT_MARKER_TEST` to line 3 of command/state.md without updating integrity.md.

**Hook output:**
```json
{"hookSpecificOutput":{"hookEventName":"SessionStart","additionalContext":"🔴 BRAIN INTEGRITY MISMATCH detected at session start.\nL1 Step 3.5 (CC-side hash hook) failed for: command/state.md [hash mismatch (expected 9e8c46c0…, got ed86766a…)].\nSuspected corruption from auto-catchup, brain-drain queue flush, or out-of-band edit. DO NOT proceed with brain synthesis. Operator must review diff and run `brain-committer --rebless` after verifying brain content is correct. See gl-brain/POINTER_COMMAND.md Step 3.5."}}
```

**Result:** ✅ PASS — HARD BANNER fires; names command/state.md with hash prefix diff (expected 9e8c46c0… ≠ actual ed86766a…).

---

## TEST C — Recovery (banner clears after revert)

**Setup:** Reverted ` DRIFT_MARKER_TEST` from state.md. integrity.md unchanged (still holds correct hash).

**Hook output:**
```json
{"hookSpecificOutput":{"hookEventName":"SessionStart","additionalContext":""}}
```

**Result:** ✅ PASS — additionalContext is empty; banner cleared after revert.

---

## Summary

| Test | Expected | Got | Status |
|------|----------|-----|--------|
| A — Clean | Empty context | Empty context | ✅ |
| B — Drift | HARD BANNER on state.md | HARD BANNER on state.md | ✅ |
| C — Recovery | Empty context | Empty context | ✅ |

All 3/3 states confirmed. F8a detection gap closed for CC sessions.
Hook is production-ready.
