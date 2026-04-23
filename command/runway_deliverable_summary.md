# RUNWAY Deliverable Audit — Executive Summary

**Date:** 2026-04-16
**Session:** GL | BUILD | Deliverable Audit · RUNWAY Feed | 260416
**Auditor:** Claude Code (Sonnet, high effort)
**Dataset:** `runway_deliverable_audit.csv` (adjacent in this folder)

---

## Assumptions stated before data

1. **`globalink-brain-public` was not local at session start** — it was cloned from `github.com/jglobalink2024/gl-brain-public` during the audit. The public repo is a redacted mirror of the private brain; most content overlaps. Unique-to-public content flagged separately below.
2. **`gl/entities.md` was excluded** per hard rule — logged as "private, excluded" with zero scoring.
3. **Binary files** (PDF, DOCX, CSV data dumps, raw SQL) are logged as `Unreadable`. They may contain valuable content but could not be scored via text tools in this session. Jason should surface these for a second pass if any prove critical.
4. **command-app is an enterprise product, not a source repo.** Most of its 1,200+ files are code. Only .md files + a handful of prompt-carrying .ts files were scored. The audit deliberately did NOT score component files, tests, or migrations.
5. **command-gl is a sales site for COMMAND.** The scoring bias is: most content here will land LOW on `helpfulness_pre_icp` because it's positioning for an existing product. What mattered was finding the *skills library* and any universally-reusable narrative.
6. **"Qualifying" = has business/content meaning.** Pure code, config for build tooling, CI files, and test fixtures were skipped from scoring.
7. **Scoring is conservative.** Where a file was ambiguous, it was marked MAYBE rather than YES — the RUNWAY intent filter (question #4: "would this feel like a COMMAND sales doc?") biased toward NO for anything promotional.

---

## Audit summary

| Metric | Count |
|---|---|
| Total files walked (all 4 repos) | ~2,443 |
| Total qualifying files scored | 163 |
| Unreadable / binary (logged, not scored) | 8 |
| Private-excluded | 1 (`gl/entities.md`) |

### Breakdown by repo (qualifying)
| Repo | Files walked | Qualifying scored | Unreadable |
|---|---|---|---|
| globalink-brain | 123 | 70 | 8 |
| command-gl | ~1,100 | 37 | 0 |
| command-app | ~1,200 | 38 | 0 |
| globalink-brain-public | 20 | 18 | 0 |

### Breakdown by business domain (top tags)
| Domain | Count | Notes |
|---|---|---|
| Internal-Process | ~55 | Brain ops, state, decisions — mostly NOT for RUNWAY |
| Product | ~35 | Specs, architecture — mostly COMMAND-specific |
| GTM | ~22 | Discovery playbooks, outreach — highest YES density |
| Marketing | ~20 | One-pagers, brand briefs — NOT founder education |
| Operations | ~18 | SOPs, runbooks |
| Research | ~15 | Market intel, persona packs, UX research |
| AI-Education | ~14 | Skills references, JRF formats, RAP |
| Strategy | ~12 | Positioning, competitive, roadmaps |
| Legal | ~5 | IP register, compliance |
| Finance | ~1 | Ponte unit economics only |

### Breakdown by file type (top tags)
| File Type | Count |
|---|---|
| Document | ~60 |
| Brain-File | ~25 |
| Template | ~18 |
| Reference | ~17 |
| UI-Copy (HTML) | ~15 |
| Prompt | ~10 |
| SOPs | ~8 |
| Checklist | ~6 |
| Unreadable | 8 |

---

## RUNWAY candidates — YES (21)

High-confidence migrations. Each would sit inside RUNWAY with minor reframing (strip COMMAND/Jason-branding, add founder-voice wrapper).

| File | Domain | Why it belongs | What it becomes in RUNWAY |
|---|---|---|---|
| `COMMAND_Target_Customer_Profile_v3.txt` | GTM;Marketing;AI-Education | ICP scoring rubric + 3 buyer personas | "Define Your First 10 Customers" workbook |
| `COMMAND_Discovery_Call_Playbook_v4.txt` | GTM;Sales;AI-Education | Validated 20-min script to extract pain w/o pitching | "Your First 5 Customer Conversations" |
| `COMMAND_LinkedIn_DM_Sequence_v3.txt` | GTM;Marketing | 4-touch peer-level outreach with psychology | "Cold Outreach That Doesn't Feel Like Spam" |
| `COMMAND_ICP_Scoring_Rubric_v3.txt` | GTM;AI-Education | Weighted prospect-qualification tool | "Prioritize Your Prospect List" spreadsheet |
| `COMMAND_Pitch_Deck_Outline_v4.txt` | GTM;Strategy | 9-slide pain-first investor pitch structure | "Build Your Founder Deck in One Session" |
| `COMMAND_FM_Outreach_Sequence_v4.txt` | GTM;Marketing | Tier-specific founding-member email sequence | "Price Your Pilot and Sell It" |
| `COMMAND_PostCall_Followup_v2.txt` + v3 | GTM;Sales | Post-call relationship-nurturing sequence | "What to Send After Every Discovery Call" |
| `ORACLE-SKILLS-REFERENCE.md` | AI-Education | Multi-agent skill activation guide | **"Your AI Stack" core module — Claude/ChatGPT/Perplexity/Cursor decision tree** |
| `COMMAND_Skills_Agents_Reference_v2.md` | Product;AI-Education | Agents + skills cross-reference | Feeds into "Your AI Stack" module |
| `COMMAND_Rapid_Assessment_Protocol_v1.md` | AI-Education;Operations | Quick agent/skill-matching decision framework | "Which AI for Which Job" flowchart |
| `command/narrative.md` | Product;Strategy | Founder narrative + 3-phase roadmap structure | "Tell Your Story Before You Build It" |
| `command/gtm.md` | GTM;Marketing | Founder pain story + GTM playbook | Pain-discovery prompt library |
| `docs/COMMAND_UI_Complexity_Research.md` | Research | UX research: density vs. simplicity tradeoff | "Design for Trust, Not Simplicity" mini-lesson |
| `docs/specs/skills-library.md` | Product | 12 domain skill packs w/ system prompts | Copy-paste prompt starter pack |
| `docs/testing/COMMAND_User_Simulation_Persona_Pack_v1.md` | Research | 8 founder personas for UX testing | "Build Your 4-Persona Map" workbook |
| `docs/JASON_VOICE_PROFILE.md` | AI-Education | Writing-voice codification case study | **"Voice Engineering 101" — have AI match your voice** |
| `docs/testing/comfort-test-protocol.md` | Research | UX comfort-testing protocol | "Test Your App Before You Ship It" |
| `lib/skills/defaults.ts` | Product;AI-Education | **12 complete domain-skill system prompts, copy-paste ready** | **Starter pack — the single highest-value migration** |
| `skills/consulting/decision-toolkit/SKILL.md` | AI-Education;Operations | Structured decision framework with AI agents | "Make Better Decisions with AI" module |
| `skills/consulting/deep-research/SKILL.md` | AI-Education;Research | Multi-source research w/ Claude + Perplexity division of labor | **Canonical multi-tool lesson — Claude + Perplexity together** |

---

## RUNWAY candidates — MAYBE (16)

Conditional inclusions. Each has a value vector but also a risk vector. Decision rule for each row: does the condition clear?

| File | Domain | Condition for inclusion |
|---|---|---|
| `gl/build-os.md` | Product;Operations;Strategy | Strip GL-specific naming → becomes "Universal 8-Step Zero-to-One Methodology" |
| `Ponte_PP_Research_1_Competitive_Landscape.md` | Research;Strategy | Only if reframed as "How to validate a new market" template, not Ponte-specific |
| `Ponte_PP_Research_2_Operational_Intel.md` | Research;Operations | Same — reusable marketplace-launch pattern only |
| `docs/COMMAND_Client_Readiness_Brief.md` | Product | Only if reframed from COMMAND beta checklist → universal "Launch Checklist" |
| `COMMAND_Discovery_Call_Playbook_v2.md` (gl) | GTM;Sales | Older version of v4 — use only if v4 is unavailable |
| `COMMAND_Target_Customer_Profile_v2.md` (gl) | Marketing;Strategy | Older version of v3 — use only if v3 is unavailable |
| `public/beta-syllabus.html` (gl) | AI-Education;Product | If stripped of COMMAND beta branding → generic "AI Onboarding Syllabus" |
| `skills/consulting/daydream/skill.md` (gl) | AI-Education;Research | Advanced multi-agent synthesis (Sonnet + Haiku) — include only as "intermediate track" |
| `skills/consulting/transcript-analyzer/SKILL.md` (gl) | Operations;Product | If founder use case written (e.g., "analyze your customer calls") |
| `public/demos/command-pain-to-pitch-v3.html` (gl) | Product;Marketing | Could be rebuilt as a RUNWAY demo of the "pain → document" workflow |
| `command/patterns.md` (public) | Internal-Process;AI-Education | Engineering-heavy — only if RUNWAY has a "for technical founders" track |
| `gl/format.md` (public) | AI-Education | If reframed as "Claude response standard" not "Jason override" |
| `gl/jrf-chat-inject.txt` (public) | AI-Education | Copy-paste prompt primer for Claude.ai — useful if taught as "prime your AI" |
| `gl/jrf-code-inject.txt` (public) | AI-Education | Useful for Cursor/Claude-Code users specifically |
| `gl/jrf-chrome-inject.txt` (public) | AI-Education | Useful if RUNWAY teaches browser-automation workflows |
| `gl/jrf-cowork-inject.txt` (public) | AI-Education | Useful if RUNWAY teaches file-workstream patterns |

---

## Excluded — notable omissions

Files that scored high on one dimension (often CLIENT_FACING = 5) but low on HELPFULNESS_TO_PRE_ICP. Flagged so Jason can decide to adapt vs. skip.

| File | Why high elsewhere | Why not RUNWAY |
|---|---|---|
| `public/index.html` (command-gl) | CF=5 — live marketing page | Assumes reader already understands COMMAND's problem |
| `public/pricing.html` (command-gl) | CF=5 — live pricing | No educational value for a founder still figuring out their first AI workflow |
| `COMMAND_One_Pager_v5.html` (brain) | CF=5, EOU=5 | Sales copy — RUNWAY intent filter #4 fails hard |
| All command-gl `/sales/*.html` one-pager variants | CF=4 | Same — COMMAND sales assets |
| `public/demo.html` (command-gl) | CF=5 | Shows multi-agent coordination visually but no narrative to teach it |
| `command/research.md` (brain + public) | Strong market intel (9% multi-AI adoption, etc.) | Theory without "how to test this yourself" = not actionable for pre-ICP |
| `COMMAND_Competitive_Landscape_v3.md` | EOU=5, well-written | Internal strategy — founders don't need this to start |
| `Plan_-_Unicorn_Thesis_and_Moat_(Traverse)` | EOU=5, strong strategic doc | Traverse is a different entity; strategic thinking too advanced for pre-ICP |
| `GL_COMMAND_Brand_Identity_Brief_v4.txt` | EOU=5 | Internal brand guidelines, not universal voice-building |

---

## Gaps — what RUNWAY needs that doesn't exist yet

Based on RUNWAY intent (AI education + document toolkit + multi-agent encouragement), these categories are NOT adequately represented in current GlobaLink assets:

### HIGH-priority gaps (block MVP)

1. **First-30-days onboarding sequence.** Nothing in the brain teaches "here's your first week with AI." Everything assumes the reader is past day zero.
2. **Multi-tool decision tree.** No file explains *when* to pick Claude vs. ChatGPT vs. Perplexity vs. Cursor for a specific job. ORACLE-SKILLS-REFERENCE is the closest, but it's internal-jargon-heavy.
3. **Guided-prompt format for real founder documents.** RUNWAY's promise is "documents built via guided AI prompts, not templates." Current assets are templates (one-pagers, rubrics) — not guided prompt chains. This entire category must be built from scratch.
4. **Founder-voice narration.** All docs are impersonal. Jason's voice is codified (`JASON_VOICE_PROFILE.md`) but no module uses it to *teach*. RUNWAY needs Jason narrating "here's why you care about this."
5. **Simple cost/ROI explainer for founders new to paid AI.** Pre-ICP founders ask "how many tasks does $20 buy me?" and there's no primer.

### MEDIUM-priority gaps (enrich MVP)

6. **Failure case studies.** Every GL doc shows success. Pre-ICP founders need inoculation: "here's what happens when you pick the wrong tool."
7. **7-day compressed launch playbook.** GL has 90-day sequences. Pre-ICP founders need "Day 1–Day 7" versions.
8. **Weekly/monthly operating cadence for solo founders.** When to do discovery, when to pivot, when to ship — nothing written for the pre-ICP rhythm.
9. **Voice/brand consistency check prompts.** JASON_VOICE_PROFILE teaches the methodology but not the prompt a founder can run against their own writing.
10. **"Before you raise" readiness checklist.** What proves PMF before pitching? Not written.

### LOW-priority gaps (nice-to-have)

11. **Video/audio walkthroughs.** All assets are text.
12. **Founder-to-founder testimonials or walkthroughs.** No "here's how a founder used RUNWAY" yet (obvious — RUNWAY doesn't exist).
13. **Non-English content.** Pre-ICP LATAM founders (Alhaji archetype suggests international scope) — no PT-BR or ES assets exist here.

---

## Quantitative summary

| Metric | Value |
|---|---|
| Total qualifying files scored | **163** |
| RUNWAY YES candidates | **21** (12.9%) |
| RUNWAY MAYBE candidates | **16** (9.8%) |
| RUNWAY NO | **126** (77.3%) |
| Average `helpfulness_pre_icp` (all scored) | **~2.0 / 5** |
| Average `ease_of_use` (all scored) | **~3.6 / 5** |
| % files with `multi_agent_signal = YES or PARTIAL` | **~45%** |
| % files with `ai_skill_building = YES or PARTIAL` | **~33%** |

---

## Unique-to-public content (globalink-brain-public)

Per the supplementary audit on globalink-brain-public, the public repo is ~90% mirror of the private brain. Content that appears unique or optimized for public distribution:

- **`POINTER_*.md` files (4)** — Claude.ai project-knowledge fetch guides. Public-only by design.
- **`gl/jrf-*-inject.txt` files (4)** — Distilled format variants optimized for copy-paste into different Claude surfaces (chat / code / chrome / cowork). Useful as teaching artifacts for "how to prime an AI tool."
- **`README.md`** — Public sync disclaimer and redaction notes.

No novel strategic content was found in the public brain that wasn't already in the private brain.

---

## Top 3 strategic takeaways for RUNWAY build

1. **The GTM library is the strongest RUNWAY seed.** Discovery playbook v4, LinkedIn DM sequence v3, ICP scoring rubric v3, pitch deck outline v4, and target customer profile v3 are all *validated-in-market* artifacts that translate directly to Pre-ICP founders with minimal editorial work.

2. **The single highest-value technical asset is `lib/skills/defaults.ts`.** Twelve ready-to-use domain-skill system prompts that follow a consistent pattern (vertical + use case + output format + behavior constraints + handoff rules). Repackaged as "starter templates," this IS the copy-paste prompt library RUNWAY needs.

3. **The multi-agent story is underbuilt.** RUNWAY's core differentiator (encouraging multi-tool thinking) is only partially served by existing assets. ORACLE-SKILLS-REFERENCE, the JRF inject variants, and skills/consulting/deep-research together sketch it — but no single file is "here's how you run Claude + Perplexity + Cursor as a team." **This is the #1 gap to fill with new RUNWAY content**, and the place where RUNWAY most clearly differentiates from "just another AI course."
