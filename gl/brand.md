---
name: COMMAND Brand Identity — Voice, Vocabulary, Design Tokens
description: Brand foundation, owned vocabulary, military language rules, approved messaging frames, tone register, design tokens. Source: GL_COMMAND_Brand_Identity_Brief_v4.txt + ViralPhrases_v1 + BrandFlagAudit_v1
type: project
---

## Source documents
- `C:\Users\jdavi\Downloads\COMMAND_Project_Knowledge_260413\GL_COMMAND_Brand_Identity_Brief_v4.txt`
- `C:\Users\jdavi\Downloads\COMMAND_ViralPhrases_v1.md`
- `C:\Users\jdavi\Downloads\COMMAND_BrandFlagAudit_v1.md`

## Foundation

- **Product:** COMMAND
- **Entity:** GlobaLink (never GlobalInk)
- **Primary tagline:** "Stop being the bridge. Start being the boss."
- **Secondary tagline:** "Stop being the middleware. Start being the boss."
- **Hero headline:** "You're running three AI tools. You're still the one copy-pasting between them."
- **Descriptor:** Agent Operations Center for boutique consulting firms
- **Tone:** Direct, operator-facing, peer-level, no hype, no jargon
- **Positioning:** The operator (not the model) is in command. Claude/ChatGPT/Perplexity are instruments — COMMAND is the cockpit.

## HARD RULE: "PILOT" NOT "TRIAL"

Every instance of "trial" → "pilot" across ALL forward-facing copy. No exceptions.
**Why:** Behavioral science — "pilot" is language these operators use with their own clients. Signals peer sophistication, lowers identity exposure at the adoption moment.

## Words to use

Visibility · Control · Operations · Operator · Agents · Handoff · Dashboard · Status · Signal · Real-time · Coordination · Layer · Protocol-agnostic · Model-agnostic · Any stack · Cockpit · Middleware · Multi-instance · Tab chaos · Pilot · Persistent context · BYOA

## Words to avoid

Empower · Revolutionize · Seamless · Unlock · Transform · Trial · Setup · Suite · "AI-powered" (standalone) · Platform (unless formal)

## Owned vocabulary (use freely, no attribution needed)

**Human middleware** — Operator as connective tissue between broken tools. Found organically across operator communities. Most resonant metaphor in market. "Stop being the human middleware."

**Agent Debt** — Unhandled context, missed handoffs, lost state from manual agent coordination.

**Shift Change Brief** — Formal handoff protocol. CCF is the technical implementation.

**BYOA (Bring Your Own Agents)** — COMMAND provides no models. Customers bring their own.

**Persistent context** — AI always knows where you left off, who the client is, what was decided. What COMMAND provides that individual tools don't.

## Military vocabulary — use / avoid

**USE FREELY (civilian-readable):**
Mission · Command center · Situational awareness · Persistent context · Handoff protocol · Coordination layer · Reconnaissance · Pilot

**AVOID (creates distance with civilian operators):**
Chain of command · Subordinates · Battle rhythm · Deconfliction · Synchronization (military sense) · Rank-based framing

**Correct frame:**
"I spent 23 years ensuring info didn't drop between stations under pressure. That's what I see in your AI stack." (peer observation, not authority)

**Incorrect:**
"I commanded 800 soldiers and I can fix your operation." (superior frame — creates distance)

## Voice register: Reddit, not LinkedIn

Operators perform AI competence publicly (LinkedIn). They confess frustration privately (Reddit/Slack/Discord).
COMMAND copy must speak to the private confession, not the public performance.

**NO:** "Streamline your AI operations with COMMAND's unified agent orchestration platform."
**YES:** "You're still the one copy-pasting between them." / "Your AI doesn't know your client." / "Nothing talks to each other."

**Test:** Would this land in a Reddit rant thread? If yes, use it. If it sounds like a press release, cut it.

## Approved messaging frames

| Context | Line |
|---------|------|
| Hero (any audience) | "You're running three AI tools. You're still the one copy-pasting between them." |
| Identity reframe (stalled) | "You already know your tools aren't working together. That's not a character flaw — it's a structural problem nobody's solved." |
| Inaction cost (post-call, NOT during call) | "3 AI tools = 5-15 hrs/week relay = $1,000–3,000/month at $200/hr. COMMAND pilot: $99. ROI first week." |
| Model-agnostic inoculation (always pre-close) | "Whatever tools you're running — Claude, ChatGPT, any combination. That's intentional. COMMAND is the coordination layer above all of them." |
| Investor frame | "23 years running command-and-control architectures — 14 systems simultaneous, nothing drops in handoff. Now watching 1-person firms collapse under 3 unconnected AIs. Built the missing thing." |

## Top viral phrases (from Symphony v8 — 35 real persona sessions)

1. "This 4-step pipeline screenshot is going straight to LinkedIn." (Canvas wow)
2. "I just typed what I needed and it built me a pipeline on screen. I can demo this in 2 minutes." (Canvas)
3. "I handed off a strategy doc between two AIs and nothing got lost. There's a checksum." (CCF trust)
4. "My content tool stalled and COMMAND just routed the task to a different AI. I didn't have to do anything." (Intelligent routing)
5. "I typed 'build me a battlecard' and it broke it into 3 steps with agents and time estimates." (Canvas decomposition)
6. "I stopped switching tabs. I type what I need and COMMAND routes it to the right AI." (Router value)
7. "I can see what all the AI tools are doing without asking anyone." (Visibility)
8. "All my tools on one screen. Agent names, status badges, activity feed. I'm sold." (Dashboard hook)
9. "The legal page has ten sections including breach notification and SLA. I've seen worse from funded startups." (Compliance credibility)
10. "Stop being the bridge. Start being the boss." (Universal)

## Brand risk flags (active — from BrandFlagAudit v1)

**BF1 — ACTIVE HIGH RISK:** Semantic score hardcoded 0 in semanticMatcher.ts:177. COMMAND markets 3-signal routing but only keyword 62.5% + history 37.5% runs in production.
→ **Action:** Remove "3-signal routing" language from all marketing until embeddings ship (Phase 3), OR ship basic embedding via Anthropic API first.

**BF3 — ACTIVE MEDIUM RISK:** Canvas package deliverable produces empty markdown when steps have no pasted output.
→ **Action:** Add per-step validation + disable export until steps have content. Fix before first beta deliverable demo.

**BF8 — DEFERRED MEDIUM RISK:** smartSuggestions.ts backing pipeline may not exist; UI panel exists but logic unclear.
→ **Action:** Build real pipeline module OR remove "smart" language from Feature 7 copy.

## Design tokens (locked — preflight enforced)

| Token | Value |
|-------|-------|
| Background | `#080B11` |
| Surface | `#0D1117` |
| Amber accent | `#F0A030` |
| Amber dim | `#BA7517` |
| Muted text (tx2) | `#9DA8B5` |
| Soft violet | `#A78BFA` (NOT `#7C3AED` — too close to Anthropic brand) |

**Fonts:** Space Mono / Syne / DM Sans

**BANNED (zero occurrences):** `#64748b` `#475569` `#334155` `#7a8099` `#30363D` `#94a3b8` `#5dcaa5`

**NCO/XO warmth tone:** Onboarding, empty states, first task routed, trial-to-paid CTAs, handoff completion ONLY. Cold everywhere else.

**Why:** Brand consistency is a defensibility signal at pre-revenue stage. Inconsistent vocabulary undermines credibility with the exact operators who will scrutinize tool quality.
**How to apply:** Run any new copy through the Reddit test. Check against banned words list. Never use "trial." Never use biology language in patent context.
