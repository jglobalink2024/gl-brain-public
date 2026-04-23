# KM Architecture — 6 Locked Decisions (Phase 3 Gates)
# GlobaLink | globalink-brain/command/km-architecture.md
# Locked: 260416 | [PERSISTENT]

---

## DECISION 1 — Taxonomy
**Decision:** Flat tag system with 3 reserved top-level namespaces:
`workspace/`, `contact/`, `signal/`. No nested subcategories.

**Rationale:** Nested hierarchies break when agents traverse them; flat tags
with namespaced prefixes are grep-safe, agent-safe, and human-readable.

**Cost of getting it wrong:** Deep hierarchies require a migration and retrain
of all retrieval prompts. Fix mid-Phase 3 is a 2-week regression.

---

## DECISION 2 — Storage Granularity
**Decision:** Atomic note = one fact, one source, one timestamp. Maximum 300 tokens
per stored unit. Composite views are assembled at retrieval time, never stored.

**Rationale:** Chunking composites at write time creates stale aggregations.
Atomic units stay accurate longer and compose cleanly on demand.

**Cost of getting it wrong:** Over-chunked or under-chunked storage makes
semantic search unreliable. Retrieval precision degrades; agents hallucinate
context they think they have.

---

## DECISION 3 — Version Strategy
**Decision:** Append-only. Every fact write creates a new record with a
`supersedes:` pointer to the prior version. No deletes, no overwrites.
UI shows latest; agents get full chain on request.

**Rationale:** Overwrites destroy audit trail. In a regulated SMB context
(HR, compliance), version history is a feature, not overhead.

**Cost of getting it wrong:** Loss of version chain means no provenance for
agent-generated summaries. Liability exposure if a customer disputes a logged fact.

---

## DECISION 4 — Retrieval Mechanism
**Decision:** Hybrid — keyword BM25 for precision, pgvector cosine similarity
for recall. Keyword wins on tie. Reranker: none in Phase 3 (defer to Phase 4).

**Rationale:** Pure semantic search fails on proper nouns (names, SKUs, codes)
which dominate SMB workspaces. BM25 covers these exactly.

**Cost of getting it wrong:** Pure semantic retrieval will miss exact matches
on company names, deal IDs, and SKUs — the core SMB use case. Churn risk Day 1.

---

## DECISION 5 — Agent Access Pattern
**Decision:** Read-only tool call. Agents query KM via a single
`km_search(query, namespace, top_k)` function. Agents cannot write to KM directly.
All KM writes go through a validated write pipeline with a human-review flag
for high-confidence-only auto-commit.

**Rationale:** Agents writing unvalidated facts into shared workspace KM
is a corruption vector. Trust boundary: agents read, humans (or a write-gate) write.

**Cost of getting it wrong:** One hallucinated fact committed to workspace KM
spreads to every subsequent agent query. Snowball corruption. Trust-breaking for SMBs.

---

## DECISION 6 — Cross-Workspace Learning
**Decision:** Zero cross-workspace data sharing in Phase 3. Each workspace is
a hard-isolated KM silo. Aggregate signals (usage patterns only, no content)
are logged to a GlobaLink-owned analytics layer for Phase 4 model improvement.

**Rationale:** SMB customers in regulated industries will not accept shared data
pools. Isolation is the trust anchor. Phase 4 can introduce opt-in aggregate
learning with consent gates.

**Cost of getting it wrong:** Any cross-workspace data bleed discovered by a
customer is an immediate churn + legal event. No recovery path.
