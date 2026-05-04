[PARKED]
Created: 260427
Trigger to reactivate: 260512 OR first paying customer
Reason parked: Pre-revenue focus protection
File lifecycle: [PERSISTENT]

---

# Agency Channel / Bennett Spooner / OpenClaw Game Plan
Session: [GL | STR | Agency Accelerants Game Plan · OpenClaw Channel Strategy | 260427]

## Strategic Reframe

| Old frame | New frame |
|---|---|
| Bennett is competing for the same buyer | Bennett is training agencies who will need COMMAND for their clients |
| OpenClaw is a competitor | OpenClaw is the technical backend whose users can't operate it long-term |
| AIOS vocabulary is a threat | AIOS vocabulary is market validation seeded by someone else's spend |

The play: Position COMMAND as the productized output that agencies hand to their clients after the build. Bennett trains them to build. You ship them what to sell.

---

## Intelligence Baseline

- **Agency Accelerants** — Skool community, $97/mo, 161 members, run by Bennett Spooner (founder of OperatorOS, Atlanta-based)
- **OpenClaw** — formerly Clawdbot/Moltbot. Free, open-source autonomous AI agent by Austrian dev Peter Steinberger. Published Nov 2025. CLI/messaging interface (Signal, Telegram, WhatsApp, Discord). 347K GitHub stars as of Apr 2026.
- **ClawHub marketplace** — exploded from 5,700 skills (Feb 2026) to 44,000+ community-built skills. 65%+ are MCP wrappers.
- **Cisco red flag** — AI security team confirmed data exfiltration + prompt injection in a third-party OpenClaw skill
- **Maintainer quote (Discord):** "if you can't understand how to run a command line, this is far too dangerous of a project for you to use safely"
- **Peter Steinberger** joined OpenAI Feb 2026

### Threat Classification

| Factor | Assessment |
|---|---|
| ICP overlap | Low — they target tech-savvy agency builders, not boutique consultants |
| Product overlap | Low — education/services vs. B2B SaaS |
| Vocabulary overlap | HIGH — "Agent Command Center," "AOS," "AIOS" hitting same language |
| Market validation | HIGH — 161 paying members proves demand is real |
| Timing threat | Moderate — growing fast, seeding the term |
| Kill probability | Very Low — he trains builders, you serve operators |

**Verdict:** Indirect competitor. Direct intel asset.

---

## Task 1 — Three DM Hook Variants

### Hook A — The Handoff Hook
*Use for builders who clearly have current clients*

> [Name] — Quick one. When you hand off a custom command center to a client, are they running it solo a month later, or pinging you weekly? Asking because we built COMMAND for that exact handoff. A cockpit your client uses without CLI or a dev on call. Operator-grade. If your clients fit that, want to compare notes? 15 min is all I need. — Jason

### Hook B — The Resell Hook
*Use for agency owners with multiple clients*

> [Name] — You're shipping bespoke command centers. We're shipping productized. Curious if there's overlap. We've had agencies ask about white-label so their clients get a cockpit branded under the agency. Not built yet — but if it'd matter for your work, I'd love your input on what it should look like. 15 min if you're open. — Jason

### Hook C — The Operator Hook
*Use for anyone posting about OpenClaw or security*

> [Name] — Saw your post on OpenClaw. Quick question — Cisco's research team flagged a data exfil issue on a third-party skill recently. Are you sandboxing client-side or running direct? We built COMMAND with skill governance baked in for non-technical operators. If your clients can't run CLI, would love to compare notes on the safety layer. — Jason

**Deployment notes:**
- Never DM in Skool — outside Bennett's house only
- LinkedIn first touch, Waalaxy follow-up sequence
- A/B test: same persona, different hook, n=10 each

---

## Task 2 — Positioning Sweep (Claude Code Prompt)

Scan both COMMAND repos for killed terms and produce a replacement audit.

**REPOS:**
- `C:\Users\jdavi\OneDrive\Desktop\GlobalInk Repos\command-app\command-app`
- `C:\Users\jdavi\OneDrive\Desktop\GlobalInk Repos\command-gl`

**KILLED TERMS (find every occurrence, case-insensitive):**
1. "AIOS" → REPLACE: "Agent Operations Center" or "cockpit"
2. "AOS" → REPLACE: "Agent Operations Center" or "cockpit"
3. "Agent Operating System" → REPLACE: "Agent Operations Center"
4. "trial" → REPLACE: "pilot" (UI/copy ONLY — skip code identifiers)
5. "Decision Provenance Graph" → DELETE
6. "Cognitive Arbitrage" → DELETE
7. "Confidence Decay" → DELETE (patent/marketing only — skip code)
8. "Quorum Sensing" → DELETE
9. "MHC" → DELETE
10. "agent economy" → DELETE

**EXCLUDE:** `node_modules/`, `.next/`, `.git/`, `*.lock`, `*.sql` migration files

**OUTPUT FORMAT:** `| File path | Line # | Current text (full sentence) | Suggested replacement | Skip? |`

**Save audit to:** `gl-brain\command\positioning-sweep-260427.md`

**DO NOT auto-replace.** Audit only. Jason reviews every line before changes apply.

### Positioning Lines to ADD (next sprint)

| Phrase | Use it on |
|---|---|
| "No CLI required" | Landing page hero, sales hub |
| "Operator-grade" | Beta syllabus, Sandra story |
| "The cockpit, not the engines" | About page (verify it's there) |
| "Audit-grade safety" | Pricing page security section |
| "Built for the operator your agency hands off to" | NEW — agency channel landing page |

---

## Task 3 — T1.5 Notion Segment Spec

**DB Name:** Outreach Pipeline — T1.5 Builders
*(separate view of existing Outreach Pipeline DB, NOT a new database)*

**Filter:** Tier = T1.5

### Fields to Add to Outreach Pipeline DB

| Field | Type | Options |
|---|---|---|
| Tier | Select | T1, T1.5, T2, T3 (add T1.5 to existing) |
| Build Stack | Multi-select | OpenClaw · Claude Code · n8n · Make · Custom · Mix |
| Has Clients? | Select | Yes · No · Unknown |
| Hook Variant | Select | Handoff · Resell · Operator |
| Source | Select | Skool-AA · LinkedIn · Twitter · GitHub · YouTube · Other |
| Skool Handle | Text | (only if from Agency Accelerants) |
| Public Posts | URL | (link to most recent agent-related post) |

### Intake Checklist (answer all 8 before adding contact)

1. Agency owner or solo builder?
2. Current clients on this work? (Y/N/Unknown)
3. What stack do they openly mention?
4. Posting publicly about pain (handoff / security / client confusion)?
5. Shared blueprints in the community?
6. LinkedIn followers / credibility signal?
7. Best DM channel? (LinkedIn > Twitter > Skool — never lead Skool)
8. Which hook variant fits best?

---

## Task 4 — Bennett Intel Template

Save to: `gl-brain\command\intel\agency-accelerants-260427.md`

```markdown
# Agency Accelerants Intel Log
Started: 260427
Member: jason@globalinkservices.io
Cancellation deadline: 260524 (27 days from join)
Cancel target: 260523 — DO NOT MISS

---

## Members Roster (top 25 active)
| Name | LinkedIn | Skool handle | Active in | Stack | Tier 1.5? | Notes |

## Blueprints Shared
| Date | Author | Title | URL | Tools used | Solves | COMMAND overlap |

## Bennett's Sales Calls (recorded)
| Date | Industry | Deal size | Pitch arc | Objection patterns | Close move | Notes |

## Member Pain Points (free product feedback)
| Date | Member | Pain stated | Their stack | COMMAND solves? |

## Tooling Stack Frequency
| Tool | # mentions | Use case | MCP available? | Build status in COMMAND |

## Vocabulary Watch
| Term | First seen | Used by | COMMAND verdict: own / counter / ignore |

## Cancellation Checklist
- [ ] Day 20 (260517): half-time intel review
- [ ] Day 25 (260522): final scrape pass
- [ ] Day 26 (260523): CANCEL subscription
- [ ] Day 27 (260524): brain commit final intel
- [ ] Mark this file [PERSISTENT] in lifecycle tag
```

---

## Task 5 — Phase 3 Candidate Features (Agency Channel)

**Build gated to first paying customer.** Priority order:

| # | Feature | Why it matters | Risk if skipped |
|---|---|---|---|
| 1 | OpenClaw Bridge — plug existing OpenClaw setups in as managed vendor | OpenClaw users keep their stack, COMMAND becomes the cockpit above it | Medium — competitor could ship first |
| 2 | Agency Multi-Tenant — one agency manages multiple client workspaces | Unlocks Bennett's 161 members as resellers | Medium — needed for agency channel |
| 3 | Cockpit Handoff Doc — auto-generated client operating manual | Solves "agency leaves, client confused" problem | Low — nice-to-have |
| 4 | Skill Sandbox + Audit Log — formal governance layer for MCP/skills | Enterprise + security-conscious buyers; directly counters Cisco finding | High — if going upmarket, table stakes |
| 5 | White-label / partner program — agencies sell COMMAND under their brand | Unlocks Bennett's 161 members as resellers | Low — until 10+ paying customers |

---

## Outreach Cadence (to run when reactivated)

| Week | Action | Volume |
|---|---|---|
| Week of activation | Join community, identify top 25 active members | 25 saved profiles |
| Week +1 | First-touch DMs (Skool + LinkedIn) | 25 DMs / 5 per day |
| Week +2 | Follow-ups + cold outreach to non-community OpenClaw posters | 25 follow-ups + 25 new |
| Week +3 | Demo calls scheduled | Target: 5 booked |
| Week +4 | First paying customer from this segment | 1 close |

---

## OpenClaw vs COMMAND Positioning Table

| | OpenClaw | Agency Accelerants | COMMAND |
|---|---|---|---|
| Who runs it | Technical power users | Agency builders | Boutique consultants |
| Interface | CLI / messaging apps | Training community | SaaS dashboard |
| Requires CLI? | Yes | Yes | No |
| Cross-vendor? | No (single agent) | No | Yes (BYOA) |
| Safe for non-devs? | Explicitly not | No | Yes — that's the point |

---

## Reactivation Checklist (run on 260512 or first paying customer)

1. Re-read this file
2. Verify Bennett's community still active (check member count)
3. Verify OpenClaw landscape unchanged (Cisco finding still valid?)
4. Check if openclaw-mission-control repo has shipped an enterprise dashboard (direct threat signal)
5. Resume from Workstream 1 — Join community
6. Pull T1.5 Notion spec, add fields if not done
7. Pull three hook variants above, test n=10 each
