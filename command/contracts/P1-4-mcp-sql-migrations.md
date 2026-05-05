# P1-4 — MCP SQL Migrations
[PERSISTENT]
Last updated: 260505
Status: SHIPPED

## Summary
Added MCP-related columns to agents and workspaces tables to unlock the Settings › Integrations MCP section for beta testing.

## Migration
File: `20260413220000_mcp_endpoint_url.sql`

Columns added:
- `agents.mcp_endpoint_url` (text) — MCP server endpoint URL for an agent
- `agents.mcp_capabilities` (jsonb, default '[]') — list of MCP tool capabilities
- `workspaces.mcp_secret` (text, default hex-random) — shared secret for MCP auth
- `idx_agents_mcp_endpoint` (index on agents.mcp_endpoint_url)

All `IF NOT EXISTS` guarded — safe to re-run.

## Evidence
- App commit: 53ec64b (TypeScript types regenerated)
- Migration applied: 260504 via Supabase MCP (ycxaohezeoiyrvuhlzsk)
- Verification query: `SELECT column_name, data_type FROM information_schema.columns WHERE table_schema='public' AND table_name IN ('agents','workspaces') AND column_name IN ('mcp_endpoint_url','mcp_capabilities','mcp_secret') ORDER BY table_name, column_name;` — 3 rows confirmed

## Session
[GL/COMMAND | BUILD | Post-Phase 2 Queue · P0-P1 Clear | 260504]
