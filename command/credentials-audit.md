# Credentials Audit Log
<!-- [PERSISTENT] — PRIVATE — never sync to public mirror -->
<!-- Verified: sync-public.yml only copies state.md, decisions.md, patterns.md, killed.md, research.md -->
<!-- This file is NOT in the sync list — it stays in the private repo only -->
PRIVATE — never sync to public mirror. Never paste contents into any Claude session, email, or document.
Rotate credentials on schedule. Log every rotation in the Last Rotated column.
Review this file before every Phase 3 integration addition.

Last updated: 260416

---

| Service | Credential Type | Owner | Rotation Schedule | Last Rotated | Scope / Permissions | Notes |
|---------|----------------|-------|-------------------|--------------|---------------------|-------|
| **Supabase** — ycxaohezeoiyrvuhlzsk | Service Role Key (`SUPABASE_SERVICE_ROLE_KEY`) | Jason | 90 days | See .env.local | Full DB access, bypasses RLS — used by adminClient in server routes only | Never expose client-side; server-only via `lib/supabase/admin.ts` |
| **Supabase** — ycxaohezeoiyrvuhlzsk | Anon Key (`NEXT_PUBLIC_SUPABASE_ANON_KEY`) | Jason | 90 days | See .env.local | RLS-gated read/write; public-safe | Used by client-side `createBrowserClient()` and server `createServerSupabaseClient()` |
| **Supabase** — ycxaohezeoiyrvuhlzsk | Project URL (`NEXT_PUBLIC_SUPABASE_URL`) | Jason | N/A | N/A | Project endpoint — not a secret | Public; included in client bundle |
| **Stripe** | Secret Key Live (`STRIPE_SECRET_KEY`) | Jason | 180 days | See .env.local | Full Stripe API access — checkout, subscriptions, webhooks | Server-only; never log or expose to client |
| **Stripe** | Webhook Secret (`STRIPE_WEBHOOK_SECRET`) | Jason | 180 days | See .env.local | Validates inbound webhook signatures at `/api/webhooks/stripe` | Rotate if webhook endpoint URL changes |
| **Stripe** | FM Price ID (`STRIPE_FM_PRICE_ID`) | Jason | N/A | N/A | Identifies FM $99/mo product in Stripe; not a secret | Verify matches Stripe dashboard product ID |
| **Stripe** | Pro Price ID (`STRIPE_PRO_PRICE_ID`) | Jason | N/A | N/A | Identifies Standard Pro $149/mo product | Verify matches Stripe dashboard |
| **Stripe** | Solo Price ID (`STRIPE_SOLO_PRICE_ID`) | Jason | N/A | N/A | Identifies Solo $49/mo product | |
| **Stripe** | Studio Price ID (`STRIPE_STUDIO_PRICE_ID`) | Jason | N/A | N/A | Identifies Studio $349/mo product | Env var renamed 260413 (was STRIPE_PRICE_STUDIO) |
| **Stripe** | Agency Price ID (`STRIPE_AGENCY_PRICE_ID`) | Jason | N/A | N/A | Identifies Agency $799/mo product | Env var renamed 260413 (was STRIPE_PRICE_AGENCY) |
| **Anthropic** | Pooled API Key (`ANTHROPIC_API_KEY`) | Jason | 90 days | See .env.local | Claude model calls via proxy route — default for all workspaces without BYOK | Rate limit monitoring needed (Phase 3 TODO) |
| **OpenAI** | Pooled API Key (`OPENAI_API_KEY`) | Jason | 90 days | See .env.local | OpenAI model calls via proxy route — pooled default | Rate limit monitoring needed (Phase 3 TODO) |
| **Perplexity** | Pooled API Key (`PERPLEXITY_API_KEY`) | Jason | 90 days | See .env.local | Perplexity sonar calls via proxy route — pooled default | Rate limit monitoring needed (Phase 3 TODO) |
| **Google Cloud** | OAuth Client ID (`GOOGLE_CLIENT_ID`) | Jason | N/A | See .env.local | Identifies COMMAND Web OAuth app to Google — not a secret | Project: globalink-command on jdavis5206@gmail.com |
| **Google Cloud** | OAuth Client Secret (`GOOGLE_CLIENT_SECRET`) | Jason | 180 days | See .env.local | Authorizes OAuth code exchange at `/api/integrations/google/callback` | Rotate if OAuth client is compromised |
| **Google Cloud** | Redirect URI (`GOOGLE_REDIRECT_URI`) | Jason | N/A | N/A | `https://app.command.globalinkservices.io/api/integrations/google/callback` — registered in GCP Console | Not a secret; must match GCP Console exactly |
| **HubSpot** | OAuth Client ID (`HUBSPOT_CLIENT_ID`) | Jason | N/A | See .env.local | Identifies "GlobaLink COMMAND" public app to HubSpot | App ID: 461a2577-d1b5-4a89-b3c5-7cdf22db8ee0 |
| **HubSpot** | OAuth Client Secret (`HUBSPOT_CLIENT_SECRET`) | Jason | 180 days | See .env.local | Authorizes OAuth code exchange at `/api/integrations/hubspot/callback` | |
| **HubSpot** | Redirect URI (`HUBSPOT_REDIRECT_URI`) | Jason | N/A | N/A | `https://app.command.globalinkservices.io/api/integrations/hubspot/callback` | Not a secret |
| **Vercel** | API Token (`VERCEL_API_TOKEN`) | Jason | 365 days | 260415 | Ops watchdog runtime error visibility — scoped to command-ops-watchdog token, No Expiration | Token created 260415; used by ops-watchdog agent |
| **Microsoft Clarity** | Project ID (`w35dn6egp4`) | Jason | N/A | N/A | Analytics tracking — not a secret; embedded in client bundle | Production-gated: only active when `NEXT_PUBLIC_GL_INTERNAL` is absent/false |
| **Documenso** | GitHub OAuth (jglobalink2024) | Jason | N/A | N/A | Self-hosted NDA signing platform — login via GitHub OAuth, no password to manage. Access = GitHub account access. | URL: go.command.globalinkservices.io/betaNDA |
| **GitHub** | PAT (jglobalink2024) | Jason | 365 days | See secure store | Used by: brain-writer.yml, sync-public.yml GitHub Actions; Claude Code MCP server for brain repo access | Scopes: repo (full) + read:org OR fine-grained Contents R/W on brain repos |

---

## Rotation Log

| Date | Service | Rotated By | Reason | Old Scope Notes |
|------|---------|------------|--------|-----------------|
| — | — | — | — | — |

---

## Action Items

- [ ] Set up rotation reminders for 90-day keys (Anthropic, OpenAI, Perplexity, Supabase)
- [ ] Confirm Documenso admin credential is stored in a password manager (not .env.local only)
- [ ] Delete stray GCP project `command-globalink` under jdavis5206@gmail.com (see PENDING_ACTIONS.md)
- [ ] Verify GitHub PAT scopes are minimally scoped (not full repo if fine-grained will work)
