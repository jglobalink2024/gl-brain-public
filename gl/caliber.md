# CALIBER — Claude Model Selection Rubric
# GlobaLink | globalink-brain/gl/caliber.md
# Locked: 260416 | [PERSISTENT]

## Scoring Table

| Factor              | 1 — Haiku                          | 2 — Sonnet                              | 3 — Opus                                   |
|---------------------|------------------------------------|-----------------------------------------|--------------------------------------------|
| **Complexity**      | Single-step, lookup, format        | Multi-step, conditional logic           | Ambiguous, multi-domain, first-principles  |
| **Context Length**  | < 5K tokens                        | 5K–40K tokens                           | > 40K or high-signal dense context         |
| **Output Quality**  | Functional (internal, throwaway)   | Customer-facing or decision-relevant    | Crown jewel (IP, spec, legal, strategy)    |
| **Iteration Count** | High (≥ 10 loops, batch jobs)      | Medium (3–9 loops)                      | Low (1–2, must be right)                   |
| **Cost Sensitivity**| Tight (production cost matters)    | Moderate (dev / ops tasks)              | Low (one-off, high-value decisions)        |
| **Time Sensitivity**| < 500ms required (live UX path)    | Seconds acceptable (async, background)  | Minutes acceptable (batch, async strategy) |

## Decision Rule

Sum all 6 factors (min 6, max 18):

| Score | Model  | When                                            |
|-------|--------|-------------------------------------------------|
| 6–9   | Haiku  | Fast, cheap, high-volume, low-stakes            |
| 10–14 | Sonnet | Default workhorse — most COMMAND tasks          |
| 15–18 | Opus   | Strategic, irreversible, or customer-crown work |

**Default model: Sonnet.** Override only when score lands clearly outside 10–14.
**Never use Opus without stating the score first.**

State format before every significant task: `CALIBER: [score]/18 → [Model]`

Applies to: Claude Code, Claude Chat, Cursor, Claude Chrome — equally.

---

## Validation — 3 Example Tasks Scored

### Example A: Classify a support ticket by topic
- Complexity: 1 | Context: 1 | Quality: 1 | Iterations: 1 | Cost: 1 | Time: 1
- **Total: 6 → Haiku** ✓ (high-volume, throwaway, sub-500ms)

### Example B: Draft a discovery call summary from a transcript
- Complexity: 2 | Context: 2 | Quality: 2 | Iterations: 2 | Cost: 2 | Time: 2
- **Total: 12 → Sonnet** ✓ (internal ops, multi-step, customer-relevant)

### Example C: Write a patent claim amendment for a specific feature
- Complexity: 3 | Context: 2 | Quality: 3 | Iterations: 3 | Cost: 3 | Time: 3
- **Total: 17 → Opus** ✓ (IP, irreversible, must be right first time)

---

## Shareability
CALIBER is internal as scoped here (GlobaLink-specific stack + cost tolerance).
The concept is shareable as a public post or client guide — strip internal refs first.
Revisit at Phase 3 GTM.
