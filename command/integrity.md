[PERSISTENT]
Last updated: 260505
Author: CC

# COMMAND Brain Integrity Manifest

Trust anchor for L1 Freshness Gate (POINTER Step 3.5).
Contains content hashes of the five canonical COMMAND brain files.
Updated ONLY by brain-committer on verified-good writes.
Auto-catchup (L3b) MUST NOT update this file — that is the structural fix
for F8a (self-sealing freshness signal). See POINTER_COMMAND.md Step 5.

## Hash algorithm

```
SHA-256 of file content, hex-encoded lowercase.
Line endings normalized to LF before hashing (\r\n → \n).
No trailing newline trimming. UTF-8 input.
```

Verification (Node):
```js
const fs = require('fs');
const crypto = require('crypto');
const raw = fs.readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
const hash = crypto.createHash('sha256').update(raw, 'utf8').digest('hex');
```

Verification (PowerShell):
```ps1
$raw = (Get-Content -Raw -Encoding UTF8 file.md) -replace "`r`n", "`n"
$ms = [System.IO.MemoryStream]::new([Text.Encoding]::UTF8.GetBytes($raw))
(Get-FileHash -Algorithm SHA256 -InputStream $ms).Hash.ToLower()
```

## Manifest

```
state_hash: 9449aaa6710fc862ffd964f828577dc437ba74d8babd74618998a22937f1068a
decisions_hash: 58a808478401a9c900b7e97fd3fd90c555c506ee91d29afcd04a2f04372c0a6d
patterns_hash: 03db3c5b432e39ac668a5f1d8a63079cf6d4f9dbf77dc6c3ad95f9ca810a36aa
killed_hash: c22503f964cbc1c358809929272a48f4fdf684fada080bdd0db851fd18ee8937
research_hash: 761f319511978dc072f2f92f313d8c5939c992287d81a61ed09c7a9d49b70ba9
last_verified: 260505-1843
```

## Update contract

| Trigger | Updates integrity.md? |
|---|---|
| brain-committer write (CC, Jason in loop) | YES — recompute hash for file just written |
| brain-committer write (mode: --catchup) | NO — REFUSE; catchup writes are unverified |
| `~/bin/brain-drain` chat queue drain | NO — chat-originated content is unverified until reblessed |
| closeout-bot writes (queue drain, content append) | NO — bot never updates hashes |
| Bot identity `COMMAND Brain` may commit content | Forbidden from touching `integrity.md` — blocked at `INTEGRITY_LOCKED_PATHS` in brain-drain |
| Auto-catchup synthesis (L3b) | NO — by design; this is the F8a closure |
| Operator manual rebless via brain-committer --rebless | YES — operator confirmed brain state is correct |

## Drift semantics

Architecture C (260504): drift is the **expected** state between operator sessions.
`brain-drain` queue drains write content but are forbidden from blessing hashes.
The L1 banner is **informational** — brain reads remain safe during drift.

L1 Freshness Gate triggers informational drift indicator when:
1. Any brain file's `Last updated:` header is newer than this file's `last_verified:` line, OR
2. Any brain file's computed SHA-256 does not match the manifest hash (CC-side hook only — Chat uses date-based proxy in (1) since LLMs cannot reliably hash)

Either condition implies brain content was modified by a path other than brain-committer
(queue drain, manual edit) and has not been operator-blessed. Brain reads remain safe.

Recovery: operator reviews diff, runs `brain-committer --rebless` to recompute hashes when convenient.
