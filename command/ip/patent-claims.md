---
name: COMMAND Patent Strategy — Killed Terms + Surviving Claims
description: Killed terminology table, surviving patent claims, and term replacements as of 260410
type: project
---

## Patent strategy update — 260410

Broad MACP (Multi-Agent Coordination Protocol) combination claim killed.
Narrowed to 5 specific surviving claims. Do not use "MACP" as a combination claim in any new document.

## Killed terms — never use in any new writing

| Killed term | Replacement | Scope |
|-------------|-------------|-------|
| Decision Provenance Graph | Workspace Provenance Ledger (WPL) | All patent and product docs |
| Cognitive Arbitrage | Cross-agent synthesis gap / coordination loss | All docs — preempted |
| Cognitive Arbitrage Detection | Cross-Agent Synthesis Engine (CASE) | Patent and architecture docs |
| Institutional Memory Crystallization | Workspace Dream Cycle (WDC) | Patent and architecture docs |
| Confidence Decay | REMOVE — do not replace | Patent docs only |
| Light Sleep / REM / Deep Sleep | Phase 1 (Ingestion) / Phase 2 (Synthesis) / Phase 3 (Promotion) | Patent claims ONLY |
| MACP (broad combination claim) | Narrowed to 5 specific surviving claims (see below) | Patent strategy docs |

**Note:** Biological metaphors (light sleep, REM, deep sleep) are still OK in marketing — only remove from patent claims.

## Surviving claims (reference these instead of "MACP")

1. CCF (Context Checkpoint Format) — structured 4-field typed handoff package with SHA-256 checksum chain
2. AEP (Agent Event Protocol) — standardized webhook schema for agent lifecycle events; protocol-agnostic event storage
3. Workspace-scoped MCP host secrets — per-workspace secrets for cross-vendor agent registration
4. Automatic context checkpoint generation on agent task completion
5. Stall detection algorithm — progress + last_seen_at delta signal

## Files updated 260410

| File | Action |
|------|--------|
| COMMAND_CCF_Schema_Spec_v1.sql | PATENT RELEVANCE comment narrowed to CCF surviving claims |
| CC_MCP_Host_MVP_260408.md | All MACP combination claim references narrowed to specific surviving claims |
| COMMAND_Gemini_Novel_Tech_Research_260409.md | SUPERSEDED header added — historical record only |

## Killed concepts — do not patent, do not research further

### Quorum Sensing / MHC Self-Non-Self (killed 260413)
- **What:** Decentralized agent coordination modeled on bacterial quorum sensing (autoinducer signaling before destructive operations) and immunological MHC self/non-self tagging (session tokens on modified resources). Agents broadcast intent into shared medium, read environment before acting.
- **Why killed:** Maps directly to 5 existing prior art kills: Cognitive Stigmergy (Ricci 2007), Stigmergic Epistemology (Marsh & Onof 2008), Linda/Tuple Space (Gelernter 1986), Blackboard Architecture (Erman 1980), Active Inference Collective Intelligence (Kaufmann 2021). Mechanism = environment-mediated stigmergic coordination — a commodity pattern.
- **Biology language:** Retired per SOP v8 Section 13. Pain story captured as discovery call ammunition (see `gtm_discovery_calls.md`).

## Files still needing update (manual / PDF rebuild required)

| File | Issue | Action |
|------|-------|--------|
| GL_COMMAND_Thesis_Annex_v2.pdf | Contains "cognitive arbitrage loss" as core term | Rebuild PDF with "cross-agent synthesis loss" |
| COMMAND_IP_Portfolio_Register_v1.pdf | Old broad MACP claims | SUPERSEDED by v2 — remove from active project docs |
| COMMAND_Product_Brief_v3.pdf | Possible "cognitive arbitrage" mention | Review and rebuild if found |
| COMMAND_Agent_Architecture_v2.pdf | Old agent codenames (CMD-0 etc) | Already banned in memory |

**Why:** Broad MACP combination claim was preempted or not defensible. Narrowing to specific claims strengthens the patent position.
**How to apply:** Never write "MACP combination claim" in new docs. Reference specific surviving claims by name.
