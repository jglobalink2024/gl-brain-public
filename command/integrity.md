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
state_hash: 5a1f1f1024543deee1f7d14dd2dff0166cbf331b3b89f053ff0d143e7ef0e4e7
decisions_hash: 5081a5b54f56de23831cc4d1bf74d1ea995669cc07564dc63f552e1d260ba5de
patterns_hash: a8b9478daeb6478ce160745e0d0de300b99bad1150d68d22481798f3eccc89a3
killed_hash: c22503f964cbc1c358809929272a48f4fdf684fada080bdd0db851fd18ee8937
research_hash: d813b4284c86b7fc79219f751159a7dd1a677e7752c1610d7db51ce126ddc747
last_verified: 260505-0305
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
