POINTER_VERSION: v3.2
POINTER_CONTENT_HASH: 04db35999c32a1e89bc0cd47c7865e5acf5cde69f37713617ac370dd436937b3
Last updated: 260428
Author: CC

# GlobaLink Brain — COMMAND Project
# Add this file to Claude.ai project knowledge.
# Claude fetches these URLs at session start automatically.

---

## L1 FRESHNESS GATE — RUN BEFORE ANY NON-TRIVIAL OUTPUT

You are reading this from the project knowledge file. Run all five steps in
order. Emit the gate verdict at the top of your first reply (HARD / SOFT / CLEAR).
This gate closes failure modes F4 (POINTER drift) and F8a (self-sealing freshness).

### STEP 1 — POINTER version parity check

1. Read `POINTER_VERSION` from the top of THIS file (your project knowledge copy).
2. Fetch `https://raw.githubusercontent.com/jglobalink2024/gl-brain-public/main/POINTER_COMMAND.md`
   and read its `POINTER_VERSION` line.
3. Compare.

| Result | Action |
|---|---|
| Versions match | Proceed to Step 2 |
| Local < remote | 🔴 HARD BANNER: "POINTER drift — project knowledge POINTER is v[local], brain is v[remote]. Re-upload POINTER_COMMAND.md to project knowledge before continuing." Stop. Do not synthesize. |
| Local > remote | 🟡 SOFT BANNER: "Project knowledge POINTER is ahead of brain (v[local] vs v[remote]). Possible mid-flight update. Confirm with operator before continuing." |
| Fetch failed | 🟡 SOFT BANNER: "Cannot reach gl-brain-public to verify POINTER version. Proceeding with local v[local]; flag stale risk." |

### STEP 2 — Required brain fetch

Always fetch:
- `https://raw.githubusercontent.com/jglobalink2024/gl-brain-public/main/gl/format.md`
- `https://raw.githubusercontent.com/jglobalink2024/gl-brain-public/main/command/state.md`
- `https://raw.githubusercontent.com/jglobalink2024/gl-brain-public/main/command/integrity.md`
- `https://raw.githubusercontent.com/jglobalink2024/gl-brain-public/main/RESPONSE_RULES.md`
- `https://raw.githubusercontent.com/jglobalink2024/gl-brain-public/main/gl/principles.md`
- `https://raw.githubusercontent.com/jglobalink2024/gl-brain-public/main/gl/decisions.md`

Session-type additions:
- BUILD:
  - `https://raw.githubusercontent.com/jglobalink2024/gl-brain-public/main/command/patterns.md`
  - `https://raw.githubusercontent.com/jglobalink2024/gl-brain-public/main/command/killed.md`
- STRATEGY:
  - `https://raw.githubusercontent.com/jglobalink2024/gl-brain-public/main/command/decisions.md`
  - `https://raw.githubusercontent.com/jglobalink2024/gl-brain-public/main/command/research.md`
- GTM:
  - `https://raw.githubusercontent.com/jglobalink2024/gl-brain-public/main/command/decisions.md`
  - paste `gl/entities.md` (private — operator pastes)
- COMPETITIVE:
  - `https://raw.githubusercontent.com/jglobalink2024/gl-brain-public/main/command/research.md`
  - `https://raw.githubusercontent.com/jglobalink2024/gl-brain-public/main/command/killed.md`
- PATENT:
  - `https://raw.githubusercontent.com/jglobalink2024/gl-brain-public/main/command/killed.md`
  - `https://raw.githubusercontent.com/jglobalink2024/gl-brain-public/main/command/decisions.md`
  - `https://raw.githubusercontent.com/jglobalink2024/gl-brain-public/main/command/research.md`

### STEP 3 — Date freshness check

Read `Last updated:` from `command/state.md`. Compare to today.

| Age of state.md | Action |
|---|---|
| ≤ 3 days | Proceed to Step 3.5 |
| 4–7 days | 🟡 SOFT BANNER: "state.md is N days old — confirm priorities before substantive work" |
| > 7 days | Proceed to Step 5 (auto-catchup synthesis) before any output |

### STEP 3.5 — Integrity verification (closes F8a)

Read `command/integrity.md`. For each of the five tracked files
(state.md, decisions.md, patterns.md, killed.md, research.md):

**Date proxy check (Chat + CC):**
Compare each file's `Last updated:` header to integrity.md's `last_verified:` field.
If any file's `Last updated` is more recent than `last_verified` → INTEGRITY DRIFT detected.

**Hash check (CC-side hook only — LLMs cannot reliably compute SHA-256):**
The CC SessionStart hook computes SHA-256 over the LF-normalized file content
and compares to the manifest hash. Mismatch → INTEGRITY DRIFT.

On any drift:
🔴 HARD BANNER: "BRAIN INTEGRITY MISMATCH on [file] — suspected corruption from auto-catchup or out-of-band edit. Manual review required. Operator must run `brain-committer --rebless` after verifying brain content is correct."
Stop. Do not synthesize from suspect content.

This step is the structural closure for F8a. Auto-catchup writes brain content
without updating integrity.md, so any catchup-originated change appears as a drift
on the next session start. The freshness signal can no longer self-certify.

### STEP 4 — Banner emission rules

At top of first reply:
- 🟢 CLEAR — all checks pass; do not emit a banner (default state)
- 🟡 SOFT BANNER — proceed but disclose risk; one-line yellow note
- 🔴 HARD BANNER — full STOP; describe drift, point to recovery action, refuse to synthesize

If multiple banners apply, emit the most severe and include the others in its body.

### STEP 5 — Auto-catchup synthesis (L3b)

Triggered only when state.md age > 7 days (Step 3 escalation).

1. Fetch the last 7 days of commits to `gl-brain` via the relay or git log:
   `https://raw.githubusercontent.com/jglobalink2024/gl-brain-public/main/command/state.md`
   Read all session entries dated within the gap window.
2. Synthesize a delta summary in your context — what changed, what shipped, what's open.
3. Surface the synthesis to the operator before answering their question.
4. **DO NOT update integrity.md.** Auto-catchup writes (if any) propagate via
   `queue-chat → brain_queue → brain-drain`, which by design does NOT touch
   integrity.md. This guarantees that catchup-originated content appears as
   integrity drift on the next session, forcing operator review.
5. If POINTER itself was modified during catchup (e.g., remote bumped to a
   new POINTER_VERSION), Step 1 has already fired the HARD BANNER above —
   the operator must re-upload POINTER to project knowledge.

This is the F8a structural fix: catchup can no longer self-certify. The only
path to a clean integrity manifest is through operator-blessed brain-committer
writes.

---

## Response format

All instances load `RESPONSE_RULES.md` for universal response formatting.
Do not duplicate inline. RESPONSE_RULES.md is single source of truth.

## Brain location (local):
`C:\dev\gl-brain\`

## Private repo (CC writes here):
https://github.com/jglobalink2024/gl-brain

## Public mirror (Claude.ai reads here):
https://github.com/jglobalink2024/gl-brain-public

## Sync: automatic after every push (~16 seconds)

---

## POINTER_CONTENT_HASH algorithm

`POINTER_CONTENT_HASH` is SHA-256 of the file content after:
1. Normalizing line endings to LF
2. Replacing the `POINTER_CONTENT_HASH:` line value with the literal `__PENDING__`

Canonical form preserves the field's presence so the hash field itself remains
in the hashed body — only its value is canonicalized. This avoids the chicken/egg
of hashing-the-hash while still binding the hash to the surrounding structure.

Verification (Node):
```js
const fs = require('fs'); const crypto = require('crypto');
const raw = fs.readFileSync('POINTER_COMMAND.md','utf8').replace(/\r\n/g,'\n');
const canonical = raw.replace(/^POINTER_CONTENT_HASH: .+$/m, 'POINTER_CONTENT_HASH: __PENDING__');
const expected = raw.match(/^POINTER_CONTENT_HASH: (.+)$/m)[1];
const actual = crypto.createHash('sha256').update(canonical,'utf8').digest('hex');
console.log(actual === expected ? 'OK' : 'MISMATCH');
```

## Version history

- v3.2 (260504) — Session-type fetch references elevated from relative paths to full
  HTTPS URLs. Closes Chat-side fetch ceiling for STRATEGY / BUILD / COMPETITIVE /
  GTM / PATENT session-type additions. Rule 14 manifestation: claude.ai web_fetch
  blocks URLs not provided verbatim in user/fetch content; relative paths in POINTER
  were unreachable from Chat. CC-side reads unaffected. Hash field recomputed.
- v3.1 (260428) — Hardening #2: POINTER_VERSION + POINTER_CONTENT_HASH fields,
  L1 Freshness Gate Steps 1–5 instantiated, integrity.md trust anchor introduced.
  Closes F4 (POINTER drift) and F8a (self-sealing freshness signal).
- v3 (260428) — 5-layer prevention architecture documented in state.md;
  L1/L3b were architectural intent only, not yet codified in POINTER.
- v2 and earlier — bare URL fetch list.
