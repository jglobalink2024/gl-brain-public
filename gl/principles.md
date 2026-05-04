# GlobaLink Operating Principles
Last updated: 260428

## Hard Rules (never violate)
- Entity name: GlobaLink — never "GlobalInk"
- Hard wall: GL/PL/Traverse/Ponte never commingle
- n8n: GL internal infrastructure only, never customer-facing
- workspace_id on every Supabase query — no exceptions
- "pilot" not "trial" everywhere in product copy
- Never mention price until user feels the product
- Agent codenames (COMMAND-0, FORGE-1, etc.): NEVER USE
- Downloads: C:\Users\jdavi\Downloads\ — never Desktop
- FM and Standard Pro Stripe links: never consolidate
- Rule 12 — Brain writes route through brain-committer agent.
  Direct writes to globalink-brain/command/ or gl/ are violations.
  See gl/decisions.md 260428 entry for per-file mode defaults.
- Rule 13 — Cross-variant delegation prompts MUST specify CALIBER
  + EFFORT + REVERSIBILITY + QUALITY BAR. Missing any = STOP.

## Build Doctrine
- Phase/date rule: frame by phase+function, never calendar
- Opus: novel reasoning only. Sonnet: all execution.
- Extended thinking: Opus only, never Sonnet
- CC for multi-file builds. Cursor for surgical edits.
- Every CC prompt ends with git commit + push
- Remember rule: "remember X" → appended to next CC prompt

## Voice Profile — Jason

**Opener:** "Name —" with hard line break after.

**Structure:** Short blocks. Sentences break mid-thought for rhythm.

**Verbs:** Casual over corporate.
- "hit you back up" not "circle back"
- "grateful for the intro" not "appreciate your consideration"

**Frame:** Peer, not vendor. Skip setup the prospect already knows.
- Not "Sent the one-pager a bit ago — curious if anything stuck"
- Use "Curious your thoughts on the one-pager"

**Warmth:** Possessives over articles.
- "our call" not "the call"

**Rhythm:** Repetition is intentional. Don't edit out deliberate echoes ("curious your thoughts... curious if anything stuck").

**Sign-off:**
- **JCMD** — when Jason personally types and sends
- **JD** — all automated outreach (Waalaxy, Brevo, templates)

## Rule 14 — Web Fetch Cache Assumption (new 260503)

For any agent reading remote content via web_fetch or equivalent (GitHub raw URLs, API JSON, etc.):

1. Treat content as cache-suspect for ≥30 min past last known write
2. Use local filesystem reads as ground truth when available
3. Document cache age in any drift-check output
4. For critical freshness gates, compute hashes/signatures locally rather than comparing remote fetches

**Why:** claude.ai web_fetch holds responses in internal cache independently of CDN. Cache-bust query params are rejected. This creates a hard ceiling on Chat-side freshness detection. CC-side local reads are the only reliable path to current content.

**When to apply:** Any Session-Start or periodic-check logic that reads shared state across variants. Applies to all agents and all projects.

**Banned phrases:**
- "in the trenches"
- "pain points"
- "value prop"
- "seamlessly"
- "empower"
- "let's get started"
- "circle back" *(added 260420)*

## ICP Priority
1. Sales/RevOps consulting (1–15 people, owner-led)
2. Operations consulting
3. Executive coaching
