# Brain Ops Alerting — Dual Channel (260503)

[PERSISTENT]
Last updated: 260505 (migrated from globalink-brain state.md)
Author: CC
Origin: 260503 Brain Hardening #3 — ntfy.sh second alert channel

GitHub Actions for `gl-brain` and `gl-brain-public` use TWO independent alert channels for failure detection. Designed so a single-vendor outage cannot mask brain-ops failures.

---

## Channels

| Channel | Transport | Secret | Priority | Use |
|---|---|---|---|---|
| Brevo | SMTP email | `BREVO_API_KEY` | normal | Primary — full failure context in email |
| ntfy.sh | HTTP push | `NTFY_TOPIC` | urgent (sync) / high (heartbeat) | Backup — fast push to phone/desktop |

**Independence guarantee:** different API, different secret, different transport. No shared dependency between them.

## Topic / Address

- ntfy topic (gl-brain-ops): `gl-brain-ops-25a9465b49b52d152e14aa5d0f071c5e`
- Subscribe in ntfy app on iOS/Android/desktop to receive pushes
- Brevo email recipient: `jason@globalinkservices.io`

## Workflows that fire alerts

### `.github/workflows/sync-public.yml`
Fires when private → public mirror sync fails.
- Step "Notify on failure (Brevo email)" — `if: failure()`
- Step "Notify on failure (ntfy.sh push)" — `if: failure()`, Priority: urgent

### `.github/workflows/brain-heartbeat.yml`
Fires when brain `Last updated:` is stale > 48 hours.
- Inside `AGE_HOURS > 48` branch, before `exit 1`
- Brevo + ntfy curl both fire, Priority: high (ntfy)

## Verification record (260503)

Live failure injection test:
- Injected `exit 1` as first step in sync-public.yml
- Run 25297494565 → failed
- Brevo: messageId `<202605040203.16871763278@smtp-relay.mailin.fr>` — HTTP 200
- ntfy: id `YaeDaKZglqcm` — HTTP 200
- Both channels confirmed independent + working
- Revert (run 25297521970) → succeeded, workflow back to production state

## Migration to gl-brain (PENDING)

The ntfy + Brevo workflows currently live in the `globalink-brain` repo's `.github/workflows/`. When `gl-brain` becomes the canonical repo (post-archival of globalink-brain), the workflows + secrets must be ported:

1. Copy `sync-public.yml` and `brain-heartbeat.yml` from `globalink-brain/.github/workflows/` to `gl-brain/.github/workflows/`
2. Add `NTFY_TOPIC` secret to `gl-brain` repo (Settings → Secrets and variables → Actions)
3. Add `BREVO_API_KEY` secret to `gl-brain` repo
4. Update workflow target paths (e.g., `gl-brain-public` mirror not `globalink-brain-public`)
5. Verify with one deliberate `exit 1` injection + revert (same protocol as 260503 test)

## Open action

- Jason: install ntfy app on phone/desktop and subscribe to topic `gl-brain-ops-25a9465b49b52d152e14aa5d0f071c5e` if not already subscribed (needed to receive pushes when alerts fire).
