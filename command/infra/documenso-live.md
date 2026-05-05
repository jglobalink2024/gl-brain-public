# Documenso — Live Service Config (260504)

[PERSISTENT]
Last updated: 260505 (migrated from globalink-brain state.md)
Author: CC
Origin: 260504 Documenso Deploy / Render Turbo Fix + Signing Cert sessions

Self-hosted Documenso (e-signature) instance for COMMAND beta NDA flow.

---

## Service

| Field | Value |
|---|---|
| URL | https://documenso-gl.onrender.com |
| Render service ID | `srv-d7b9i69r0fns73fgsgu0` |
| Last deploy (LIVE) | `dep-d7s8n228qa3s73e09hdg` — 2026-05-04 08:06 EDT |
| Start command (LOCKED) | `cd apps/remix && node build/server/main.js` |
| Tier | Render free |
| Pre-Deploy Command | NOT AVAILABLE on free tier — schema sync manual via Supabase SQL Editor |
| Skill agent | `~/.claude/agents/documenso-operator.md` |

## Why the start command is locked

Turbo `persistent: true` tasks silently no-op in non-TTY environments (Render CI). `turbo run start --filter=@documenso/remix` appears to deploy successfully but the server never starts.

`cd apps/remix &&` prefix also fixes the Hono `serveStatic({ root: 'build/client' })` path — without it, static assets 404 because CWD is the monorepo root.

See: `command/patterns.md` → "Render + Hono monorepo: CWD matters for static assets (LOCKED 260504)".

## Database

| Field | Value |
|---|---|
| Supabase project | `ycxaohezeoiyrvuhlzsk` |
| Schema | `documenso` |
| Prisma table state | All tables in sync as of 260504 |
| `pg_trgm` extension | Moved to `documenso` schema (already done) |
| Schema-change protocol | Run Prisma migration locally → manually paste resulting SQL into Supabase SQL Editor (free-tier limitation) |

## Required env vars (Render — `documenso-gl` service)

```
NEXT_PRIVATE_SIGNING_TRANSPORT=local
NEXT_PRIVATE_SIGNING_LOCAL_FILE_CONTENTS=<base64 PEM, RSA 2048, 10yr, CN=documenso-gl>
NEXTAUTH_SECRET=<set>
NEXT_PRIVATE_ENCRYPTION_KEY=<set>
NEXT_PRIVATE_ENCRYPTION_SECONDARY_KEY=<set>
NEXT_PRIVATE_SMTP_*  (SMTP stack — set)
```

Signing cert spec: RSA 2048, 10-year validity, CN=`documenso-gl`, base64-encoded PEM (3772 chars). Stored in Proton Pass.

## Templates

- Beta NDA template ID: `12572`
- Recipient: `2114590` (recipient.1@documenso.com, role SIGNER)
- 5 fields on page 4, Participant right column:
  - SIGNATURE (id `10520397`, y=12.5)
  - NAME / Full Name (id `10520396`, y=15.8, required)
  - TEXT Company/Org (id `10520398`, y=18.6, required)
  - TEXT Title/Role (id `10520399`, y=21.4)
  - DATE (id `10520400`, y=24.2)

## Admin auth

GitHub OAuth via `jglobalink2024` — no password to manage.

Last verified: 260428 (credentials-audit.md row 47).

## Discovery / API surface

- tRPC procedure for fields: `field.setFieldsForTemplate`
- Required header: `x-team-id: 178745`
- Envelope item ID for templates: `envelope_item_lfevxkkomiolhlal` (templateDocumentData)
- Test signing URL pattern: `https://app.documenso.com/sign/<token>`

## Open ops items

- API token generation: Jason must sign in to admin UI → generate API token → save to Proton Pass and `.env.local` of any service that calls Documenso programmatically.
- If Documenso schema changes via upstream: pull migration → paste into Supabase SQL Editor (free-tier limitation).
