# GL — Zero-to-One Build OS v1.1

Version: 1.1 (patched from v1 after Ponte stress test)
Last updated: 260413
Owner: GlobaLink LLC (universal methodology, not product-specific)
Companion file: `gl/build-os-ponte-stress-test.md` — the adversarial application that produced the v1.1 patches
Origin prompt: `uploads/GL_Build_OS_Opus_Prompt_v1.md`

> **Purpose.** A reusable operating system for taking a new product from problem to first paying customer in ~25% of the time an unstructured build takes. Written for a solo operator with AI tooling. COMMAND is the source corpus; Ponte is the stress test. The playbook is the extraction.
>
> **Use.** Run every new product through all 8 sections in order. If a section doesn't hold, the playbook has a gap — note it and patch forward.
>
> **What changed in v1.1** (six patches, each driven by a real failure Ponte surfaced):
> 1. §1 — Bilateral validation rule + Phase 0.5 Concierge phase for marketplaces
> 2. §2 — 1:1 ratio rule for bilateral ICPs
> 3. §3 — Moat type taxonomy (8 types, not software-only)
> 4. §5 — Cultural context override on cognitive-load rules
> 5. §6 — Operator fieldwork as a first-class lane type
> 6. §8 — Renamed "Defensibility Protection," four branches not patent-only

---

## Section 1 — Phase Architecture

### Principle
Build in strict phase gates. No phase begins until the previous gate's falsifiable success criteria are met with evidence. Validation always precedes code.

### Why — neurobiology + decision science
Once the brain has invested energy in building an artifact, the sunk-cost circuitry defends that artifact even when evidence says kill it. Validation before code keeps the commitment response from forming around the wrong object — you commit to the *problem*, not the solution. Secondary effect: written phase gates externalize working memory, freeing 1–2 of your ~4 cognitive chunks for the work itself.

### How — sequential
1. Map the full phase sequence on one page before Phase 0 begins. Names and order only.
2. Write gate criteria BEFORE entering each phase. Never after.
3. Every gate criterion must be falsifiable — binary, evidence-backed.
4. Define kill signals while still objective.
5. Define walk-back protocol — if the gate fails, what do you undo and where do you restart?
6. Forbid Phase N+1 work until Phase N gate passes. "I'll just start the scaffold while we validate" is phase drift.
7. **[v1.1 patch]** For multi-sided products, apply the **bilateral validation rule**: every phase gate has one criterion per side, and neither side advances more than one phase ahead of the other. When one side races ahead, validated interest on that side cools while the other catches up, forcing re-validation. Never validate demand without supply, or supply without demand.

### Phase sequence (canonical)

- **Phase 0 — Validation.** No code. Discovery only. Gate = consistent pain language from real prospects.
- **Phase 0.5 — Concierge *(v1.1 — new phase for service/marketplace/physical products)*.** The founder runs the full operation manually for ~10 transactions before writing code. No MVP, no matching algorithm, no product — just the operator doing the work by hand using off-the-shelf tools (WhatsApp, spreadsheets, email). Concierge produces (a) the operational playbook, (b) the real friction map, (c) the first revenue, and (d) the data that informs the MVP. **Concierge is not optional for marketplaces, services, or physical-operation products.** For pure software products it is optional, but it never hurts.
- **Phase 1 — MVP.** First shipped product, built from Concierge learnings. Gate = operator can do the work 10x faster with the MVP than without it.
- **Phase 2 — Real integrations.** Webhooks, APIs, external systems. Gate = the product does its job end-to-end without manual intervention for the common path.
- **Phase 3 — Defensibility.** Layered moat construction (see §3), operational accumulation. Gate = copycat would need N months to replicate the operational state.
- **Phase 4 — Scale / expansion.** Only once the flywheel is turning.

### Template — Phase Gate Checklist
```
PHASE [N]: [Name]
Objective: [One sentence — what this phase produces]
Duration target: [X weeks]
Product type: [software | marketplace | service | physical | hybrid]

ENTRY CRITERIA (all must be true):
- [ ] Previous phase gate closed with evidence attached
- [ ] [Phase-specific prerequisite]

BILATERAL CHECK (v1.1 — multi-sided products only):
- [ ] Side A gate criteria defined
- [ ] Side B gate criteria defined
- [ ] Neither side >1 phase ahead of the other

WORK PRODUCTS:
- [Artifact 1]
- [Artifact 2]

GATE CRITERIA (falsifiable, evidence required):
- [ ] [Measurable criterion] — Evidence: [file/link/count]
- [ ] [Measurable criterion] — Evidence: [file/link/count]

KILL SIGNALS (any true = stop):
- [Signal that invalidates the phase]
- [Signal that invalidates the product]

WALK-BACK PROTOCOL (if gate fails):
- Undo: [artifacts to shelve]
- Regress to: [earlier phase name]
- Reconsider: [what to re-examine]
```

### Failure mode + early warning
- **Failure mode:** Phase drift — starting N+1 work in parallel with closing N.
- **Early warning:** You find yourself building infrastructure for unvalidated features ("we'll need this eventually anyway").
- **Recovery:** Shelve the N+1 work in a branch, return to the N gate criteria. Do not delete — shelve.

### COMMAND illustration
Phase 0 was discovery calls only, zero code. Gate = consistent verbatim pain language across 10+ operators. The phrases "I'm still the one copy-pasting" and "every session starts over" closed the gate. Those exact phrases became the positioning. Skipping Phase 0 would have produced a product aimed at a pain not actually felt in those words. COMMAND did not need a formal Phase 0.5 Concierge because the product is software-only, but retrospectively a 10-operator manual Shift Change Brief cohort would have produced better MVP specs.

---

## Section 2 — ICP Surgery

### Principle
You do not target a market. You target one specific person with one specific pain using their own verbatim vocabulary. "Market segment" is a fiction that lets you avoid finding the one buyer.

### Why — behavioral psychology (identification + identity reframe)
Specificity activates the "this is about me" circuit in ~2 seconds; generic language activates dismissal in the same window. That dismissal happens below awareness — no amount of "better copy" recovers from it.

Second mechanism: the highest-converting framing isn't "you have a pain" (triggers shame defense), it's "the pain is structural, not a character flaw" (removes shame, creates urgency). The reframe only lands if you know exactly whose identity you're reframing. Vague ICP → vague reframe → no response.

### How — sequential
1. Name one person per side. Firm size, tools, day. If you can't name them, you have a wish, not an ICP.
2. Score candidates on the signal that predicts *conversion*, not the signal that's easy to see.
3. Find the "double-pain" operator — someone who has the problem AND advises others on it. Converts at 2–5x baseline.
4. Harvest language verbatim. Never paraphrase. Copy exactly from Reddit, Slack, LinkedIn, calls. Harvest in the buyer's native language — translated pain language loses the nuance that makes it convert.
5. Run the identity reframe test. If the buyer uses your framing back to you in the next call, it landed.
6. Delete anyone under threshold. Do not nurture low scores.
7. **[v1.1 patch]** For bilateral/multi-sided products, apply the **bilateral ICP rule**: run this entire section once per side. Each side gets its own rubric, its own pain language harvest, its own identity reframe. AND enforce the **1:1 ratio rule**: never let T1 count on one side exceed 2x the T1 count on the other. If the ratio breaks, stop intake on the easier side until the harder side catches up. Imbalanced prospect pools cool faster than you can serve them.

### Template — ICP Scoring Rubric (weighted, generic)
```
Prospect: [Name]
Source: [Channel]
Side: [Side A | Side B | N/A for single-sided]

Score 0–10, then weight:

Role match         [  ] × 0.15 = [  ]
Firm size fit      [  ] × 0.10 = [  ]
Pain signal        [  ] × 0.25 = [  ]  (verbatim pain in public posts?)
Double-pain signal [  ] × 0.15 = [  ]
Tool stack signal  [  ] × 0.10 = [  ]
Channel access     [  ] × 0.10 = [  ]
Conversion prob    [  ] × 0.15 = [  ]

TOTAL: [    ] / 10
7.0+ = T1 (contact in 48h — or queue if ratio breaks)
5.0–6.9 = T2 (survey first, then warm)
<5.0 = do not contact

BILATERAL RATIO CHECK (multi-sided only):
Side A T1 count: [   ]
Side B T1 count: [   ]
Ratio: [   ] — must be <= 2:1; if broken, pause the larger side
```

### Template — Pain Language Harvest Prompt
```
You are a research assistant. Find verbatim language from [ROLE]
operators describing frustration with [PROBLEM DOMAIN].

Search:
- Reddit (subs: [list 3–5])
- LinkedIn posts/comments (past 90 days)
- Hacker News threads
- Indie Hackers
- Public Slack archives
- [Native-language forums if non-English market]

Return format:
- Exact quote (never paraphrase)
- Source URL
- Author role (if public)
- Date
- Language (return quotes in original language; translate only for
  reader comprehension, keeping the original verbatim)
- Emotion behind the quote

Minimum 25 quotes. Flag any phrase repeating across 3+ sources —
those are the highest-leverage anchor phrases. Do not editorialize.
```

### Failure mode + early warning
- **Failure mode:** ICP inflation — broadening because the narrow definition feels too small. Multi-sided variant: drifting toward whichever side is easier to find.
- **Early warning:** Your ICP doc starts including "also" clauses. Every "also" is dilution.
- **Recovery:** Cut back to the single narrowest tier where your highest-converting prospect came from. For bilateral products, enforce the 1:1 ratio rule hard — stop the easier side.

### COMMAND illustration
The "double-pain operator" was the sales consultant running AI in their own practice AND advising clients on AI. Two pains fixed with one product. Conversion ran materially higher than general sales consultants.

---

## Section 3 — Positioning: Structural Moat

### Principle
A position is only a moat if your strongest competitor cannot solve it by their own nature. Temporary leads decay. Structural walls compound.

### Why — competitive strategy + systems thinking
"First mover" leads shrink on contact with well-funded competitors. The only positions that survive aggression are ones the competitor is structurally prevented from occupying — by business model, incentives, or product nature. "We got here first" is not a moat. "They cannot get here without destroying their own business" is.

### How — sequential
1. Map the full landscape. Incumbents, adjacents, substitutes, unclaimed layers.
2. For each competitor, ask: "Could they solve this without contradicting their core incentive?"
3. Identify unclaimed layers. Strong positions usually live at layer boundaries — where the abstraction shifts direction.
4. Run the "by structural definition" test. Complete this sentence: "No [incumbent type] can solve this by structural definition because [incentive conflict]." If you can't finish it, you don't have a moat yet.
5. Identify compounding assets. What raises switching cost over time?
6. Write the 1-sentence position. Test it on someone not in your head.
7. **[v1.1 patch]** Consult the **Moat Type Taxonomy** below. Name which types apply to your product. Products rarely have only one moat type — most strong positions are a stack of 2–4. Name each one explicitly.

### Moat Type Taxonomy *(v1.1 — new)*

v1 had an implicit software bias. The full moat taxonomy covers eight types. Most strong products stack 2–4.

**Software moats**

1. **Cross-vendor structural.** No single vendor has incentive to help buyers use competitors. Permanent. Example: COMMAND.
2. **Unclaimed layer.** Position at a stack-layer boundary where the abstraction shifts direction. Example: Vercel above Next.js, Stripe above payment processors, Cloudflare above origin servers.
3. **Compounding software asset.** User data, workflow history, or integrations accumulate over time and raise switching cost. Example: Notion workspaces, HubSpot integrations.
4. **IP / patent.** Narrow claim on a novel mechanism. See §4 and §8. Temporary (20 years) but can be extended via continuations.

**Non-software moats**

5. **Liquidity moat.** Once a marketplace has enough supply + demand to produce reliable matches, switching cost is the loss of access to both sides. Grows monotonically with every successful match. Example: eBay, Airbnb in core markets. **Only applies to multi-sided products.**
6. **Trust / vetting moat.** In trust-scarce markets, the ability to produce a vetted match or vetted result is itself the moat. Compounds via accumulated vetting data + reputation. Example: Medallion apps, licensed professional services, background-check providers.
7. **Regulatory capture moat.** Compliance with complex regulation is expensive to build and expensive for a copycat to match. Particularly strong in finance, healthcare, immigration, privacy-regulated markets. Example: regulated fintech, LGPD/GDPR-compliant platforms in regulated verticals.
8. **Physical presence / operator moat.** The founder's physical presence, local network, or cultural fluency is the unfair advantage — impossible to replicate remotely. Compounds via accumulated local relationships. Example: locally-embedded marketplaces, high-touch service businesses. **Time-bounded:** as the operator's presence fades, so does the moat, unless it's been transferred to the team.

### Moat type triage
For each candidate moat type:
- **When does it apply?** What product/market conditions trigger it?
- **How is it built?** What operational sequence produces it?
- **How does it compound?** What grows monotonically over time?
- **What kills it?** What failure mode removes the moat?

### Template — Moat Identification Prompt (paste into Opus)
```
Product: [ONE SENTENCE]
ICP: [WHO]
Product type: [software | marketplace | service | physical | hybrid]
Cultural context: [low-context / high-context market]

Help me identify whether this has a structural moat.

1. Is there an incumbent category that could solve this? Who?
2. Would solving it contradict their core business incentive?
   State the conflict in one sentence.
3. Is there a layer of the stack where this product sits that is
   currently unclaimed? What layer?
4. What asset does this product accumulate over time that raises
   switching cost? Software, data, identity, community, vocabulary,
   liquidity, trust graph, regulatory posture, physical presence?
5. Complete: "No [incumbent type] can solve this by structural
   definition because [incentive conflict]." If you cannot finish
   the sentence, say so.
6. Which of the 8 Moat Type Taxonomy categories apply? Rate each
   1–5 for this product:
   - Cross-vendor structural
   - Unclaimed layer
   - Compounding software asset
   - IP / patent
   - Liquidity (marketplace only)
   - Trust / vetting
   - Regulatory capture
   - Physical presence / operator
7. Name the moat stack — which 2–4 types are the actual defense?

Be adversarial. If there's no moat, say so.
```

### Failure mode + early warning
- **Failure mode:** Moat theater — claiming a moat that is actually a head start. Or naming only a software moat when the real moat is operational.
- **Early warning:** Your moat sentence is "we have better [X]" or "we're faster at [Y]." Those are leads, not moats.
- **Recovery:** Re-run the "by structural definition" test AND consult the taxonomy. If you can't find a type that applies, the moat is fake.

### COMMAND illustration
Moat sentence: "No AI vendor can solve cross-vendor coordination by structural definition because no vendor has incentive to help their buyer use a competitor's product." Moat stack: (1) Cross-vendor structural — permanent. (2) Unclaimed layer — "Vercel above Next.js." (3) Compounding software asset — workspace data, agent configs, workflow history. (4) Narrow IP — Metabolic Clock, Learned Agent Cards, Contradiction Radar, FRAGO Protocol.

### Ponte illustration (from stress test)
Moat stack: (1) Liquidity — bilateral marketplace flywheel. (2) Trust/vetting — in-person vetting process. (3) Regulatory capture — LGPD + labor + insurance compliance. (4) Physical presence — founder in São Paulo. No software moat. No cross-vendor structural. No IP. This is a 4-type non-software moat stack, which v1 could not name.

---

## Section 4 — Novel Concept Research: Discipline Scan

### Principle
The mechanism that solves your software problem often already exists in biology, physics, military doctrine, or another mature field. Scan those fields, extract the mechanism, kill-test the transfer. Original ideas are rare; original transfers are not.

### Why — novel concept research methodology
Software is a young field with a shallow pattern library. Biology has 3.5B years of solved coordination problems. Military doctrine has 3000 years of solved decision-under-uncertainty problems. When you have a hard software problem, the probability that no mature field has solved its structural analog is near zero. The failure isn't idea scarcity — it's cross-domain search discipline.

First-principles reframing removes assumption load. Most "hard" problems are only hard under an inherited assumption. Remove it, the problem often collapses into a known pattern.

### How — sequential
1. Multi-discipline scan. For your core problem, ask: "How does biology solve this? Physics? Military doctrine? Economics? Neuroscience? Anthropology? Sociology? Service design?" The default five (bio/physics/military/econ/neuro) fit mechanism problems; anthropology/sociology/service-design fit trust and operating-model problems.
2. Extract mechanisms, not metaphors. "Like an ant colony" is a metaphor. "Pheromone trails as distributed coordination without central control" is a mechanism. Mechanisms transfer; metaphors don't.
3. Run the First Principles Kill Test on every candidate. 8-step plus K1–K4 adversarial extension.
4. Prior art as GPS, not stop sign. A hit narrows your claim to what's actually novel.
5. Score for IP viability OR operational uniqueness (see below). High-viability → IP register OR operational-uniqueness register. Low-viability → still built as feature.
6. Recycle killed concepts into a "built, not filed" list.

### Template — Novel Concept Research Prompt (Perplexity Research mode)
```
Problem: [ONE PARAGRAPH]
Core structural challenge: [ONE SENTENCE]
Domain type: [mechanism problem | operating-model problem]

Research how these fields have solved structurally similar problems:

MECHANISM-PROBLEM FIELDS:
1. Biology (cellular, ecological, evolutionary)
2. Physics (signal processing, thermodynamics, information theory)
3. Military doctrine (C2, distributed ops, decision under uncertainty)
4. Economics (mechanism design, market structure, incentives)
5. Neuroscience (attention, memory, motor coordination)

OPERATING-MODEL FIELDS:
6. Anthropology (immigrant networks, kinship trust, mutual aid)
7. Economic history (medieval trading posts, guild trust, caravanserais)
8. Sociology (high-context vs low-context trust formation)
9. Service design (concierge systems, white-glove operations)
10. Matching market design (Roth, Shapley, stable matching)

For each field, return:
- Closest structural analog to my problem
- The mechanism used to solve it
- Key papers, textbooks, primary sources
- Transfer risk: what breaks if ported to my product's domain?

Flag any mechanism already attempted with prior outcomes.
```

### Template — First Principles Kill Test (full 8-step + K1–K4)
```
Concept under test: [NAME]
One-sentence description: [WHAT IT IS]
Product type: [software | marketplace | service | physical | hybrid]

STEP 1 — CLARIFY
Restate the concept in one sentence a first-time reader could follow.

STEP 2 — OBJECTIVE TRUTHS
List only demonstrable facts about the problem domain. No opinions.

STEP 3 — ASSUMPTIONS + CONSTRAINTS
List every embedded assumption. Label each: HARD (cannot be removed),
SOFT (can be challenged), FALSE (is actually not true).

STEP 4 — REFRAME FROM FIRST PRINCIPLES
Remove SOFT and FALSE assumptions. Restate the problem with only HARD
constraints remaining.

STEP 5 — SOLUTION OPTIONS
Generate 3–5 solutions from the reframed problem.

STEP 6 — CONVERGE
Preferred + runner-up with reasoning.

STEP 7 — EXECUTE
Action plan with controls, gates, rollback points.

STEP 8 — ADVERSARIAL EXTENSION (K1–K4)
K1: Technical kill vector
K2: Market kill vector
K3: Legal kill vector
  — For software mechanisms: IP / patent prior art
  — For non-software products: regulatory / compliance
K4: Psychological / adoption kill vector

For each: (a) kill mechanism, (b) early warning signal,
(c) survives / survives-with-modification / dies.

Final verdict: SURVIVES / SURVIVES-WITH-MODIFICATION / DIES.
```

### Template — IP Viability Scoring (software mechanism concepts)
```
Concept: [NAME]

Novelty gap            [ /10]
Claim constructability [ /10]
Enforceability         [ /10]
Defensibility          [ /10]
Strategic value        [ /10]

TOTAL [ /50]
40+ = file provisional
30–39 = register + build as feature
<30 = build only, do not file
```

### Template — Operational Uniqueness Scoring (non-software concepts)
```
Concept: [NAME]

Operating novelty      [ /10]  (how different from incumbents?)
Copycat cost           [ /10]  (how expensive to replicate?)
Accumulation speed     [ /10]  (how fast does it compound?)
Protection instrument  [ /10]  (trademark / trade secret / contract?)
Strategic value        [ /10]

TOTAL [ /50]
40+ = protect formally (trademark, trade secret NDA, contract)
30–39 = document internally, build
<30 = build, no special protection
```

### Failure mode + early warning
- **Failure mode:** Metaphor mistaken for mechanism. Treating a surface analogy as a rigorous transfer.
- **Early warning:** You're using the source-field name as a marketing term before verifying the mechanism transfers.
- **Recovery:** Go back to the source literature. If you cannot cite a paper or doctrine describing the mechanism formally, the transfer is unvalidated.

### COMMAND illustration
Concepts explored: Metabolic Clock (pacing), Quorum Sensing (consensus), pheromone trails. Quorum Sensing died on prior art. Metabolic Clock survived at 95%. Dead patents became live features.

---

## Section 5 — Psychology Layer

### Principle
Psychology is a design input applied at every decision point — not copywriting applied at the end. Every product, pricing, onboarding, and outreach decision has a psychological consequence. Either you design for it on purpose or you design for it badly.

### **[v1.1 override] Cultural context comes first**
Before applying any rule in this section, run the **cultural context check**:

1. Is the buyer in a **low-context culture** (Anglophone, Northern European, transactional) or a **high-context culture** (Brazil, Japan, much of Asia, Latin America, Middle East, relationship-first)?
2. Does trust in this market form through **relationship time** or through **efficient execution**?
3. Would minimizing onboarding time in this market **signal respect for the buyer's time**, or would it **signal disrespect / suspicion / low commitment**?

The answer determines whether the rules below apply as written or inverted.

**Low-context default:** minimize onboarding time, efficient flows, 20-minute rule, decision fatigue reduction. Efficiency = respect.

**High-context override:** maximize trust-producing time, extended onboarding with in-person or voice touchpoints, relationship sequencing before product. Efficiency can read as disrespect. The goal is not the fastest path — it's the path that produces trust.

**v1 had an efficiency bias that is the correct default for Anglophone software markets and the wrong default for everywhere else. Check the context first.**

### Why — all four disciplines converge
Behavioral: operators in low-context markets are 2–3x more responsive to loss-framed urgency than gain-framed. Neurobiology: working memory is ~4 chunks — still true everywhere. Sales psychology: the research frame deactivates the sales-defense circuit globally. Identity psychology: operator vocabulary > consumer vocabulary globally.

But: cognitive load rules are context-dependent. In high-context cultures, the dominant cognitive load is *trust assessment*, not *information processing*. Shortening the interaction increases trust-assessment load rather than decreasing it.

### How — 8 checkpoints (updated)
1. **Cultural context check FIRST.** Without this, every rule below may be inverted.
2. **Loss aversion in pricing and urgency.** Name what they lose, not what they gain. Loss category varies by buyer: time, money, status, access, opportunity.
3. **Identity reframe in copy and positioning.** Rewrite the strongest pain as a structural fact. The reframe axis varies by buyer — "not a character flaw" for competent-but-overwhelmed operators, "you are a professional" for stigmatized service workers, etc.
4. **Cognitive load — context-dependent.**
   - Low-context: 20-minute ceiling, 4-chunk working memory, one decision per screen.
   - High-context: *minimum trust-producing time*, extended sessions with human presence, relationship sequencing.
   - Do NOT apply the low-context default to a high-context buyer.
5. **Decision fatigue in operator workflows.** Sequential steps, no option menus in execution flows, walk-away vs presence labeling — applies everywhere.
6. **Deletion signal targeting in GTM.** Universal where applicable. "I quit my last [X]" is a receptivity indicator in any culture.
7. **Research frame in outreach.** Universal — arguably stronger in high-context cultures, where curiosity reads as respect.
8. **Operator vocabulary, not consumer vocabulary.** Universal, but translate the identity term to the local culture: "pilot" in English, "piloto" in Portuguese, "profesional" for service roles, etc.

### Template — Psychology Audit Checklist (v1.1 — with cultural context check)
```
Decision under review: [e.g., pricing, onboarding, outreach]

CULTURAL CONTEXT CHECK (run first)
[ ] Buyer cultural context: [low-context | high-context]
[ ] Trust formation mode: [efficient execution | relationship time]
[ ] Appropriate onboarding length: [under 20 min | 30+ min with presence]

LOSS AVERSION
[ ] Is loss named explicitly, earlier than gain?
[ ] Is urgency structurally real, not manufactured?
[ ] Is the loss category correct for this buyer?

IDENTITY REFRAME
[ ] Does the framing remove shame?
[ ] Does it name pain as structural, not personal?
[ ] Is the reframe axis correct for this buyer's identity?

COGNITIVE LOAD (context-dependent)
[ ] LOW-CONTEXT: under 4 chunks, under 20 min, 1 decision per step?
[ ] HIGH-CONTEXT: enough relationship time, enough human presence?
[ ] Onboarding length matches cultural context?

DECISION FATIGUE
[ ] Sequential flows single-path?
[ ] Walk-away steps marked as walk-away?

DELETION SIGNAL
[ ] Does targeting prioritize recent deletion signals?

RESEARCH FRAME (outreach only)
[ ] Is the first touch a question, not a pitch?
[ ] Channel matches cultural context (DM in low-context, voice/in-person
    in high-context)?

VOCABULARY
[ ] Operator identity, not consumer identity?
[ ] Translated to local culture where needed?
```

### Template — Copy Review Prompt
```
Review this copy for psychological fit. Answer each:

0. CULTURAL CONTEXT: what culture is the buyer in? Low-context or
   high-context? Does this copy respect that context?
1. Loss aversion: is cost of inaction named before benefit of action?
2. Identity reframe: blames structure or person? Is the reframe axis
   right for this buyer's identity?
3. Cognitive load: if low-context, is chunk count under 4 in first
   100 words? If high-context, does the copy make room for relationship?
4. Decision fatigue: how many decisions asked of the reader?
5. Research vs pitch frame.
6. Vocabulary: operator or consumer?
7. Urgency: structurally real or manufactured?

Return: redline edit with reasoning.
```

### Failure mode + early warning
- **Failure mode:** Applying low-context efficiency rules to a high-context buyer. Or vice versa.
- **Early warning:** Your onboarding metrics look fast but conversion drops. Or your relationship-heavy process is losing low-context buyers to impatience.
- **Recovery:** Re-run the cultural context check. Adjust the onboarding length and channel mix accordingly.

### COMMAND illustration (low-context)
"Agent Debt" = pure loss aversion. "Stop being the bridge" = identity reframe. "Pilot" not "trial." 20-minute onboarding is correct because the buyer is a US/Anglophone operator in a low-context professional market.

### Ponte illustration (high-context — from stress test)
Same principles, inverted defaults. Brazilian PA vetting and expat onboarding require *longer* relationship time, not shorter. First match handled in person by Jason with an extended conversation. The 20-minute rule would break Ponte if applied literally. Identity reframe for PAs is "você é profissional, não empregada" — elevating professional standing, not just removing shame.

---

## Section 6 — AI Tool Stack Architecture

### Principle
Each tool has one lane. Mixing lanes costs more time than doing the task manually. Lane discipline removes the "which tool?" decision from every task.

**[v1.1 patch]** Not every lane is an AI tool lane. Products with physical operations have an **Operator Fieldwork lane** — a non-tool lane for in-person work — with handoff rules back to the AI tool system.

### Why — cognitive load + decision fatigue
Tool switching is not free. Every switch costs ~15–30 seconds of working-memory reload and 1 decision token. Wrong-tool choice produces worse output AND takes longer. Lane discipline fixes both. Decisions made later in the day are statistically lower-quality — removing "which tool?" at the top of every task preserves decision capacity for the actual work.

### How — sequential
1. Assign lanes. Each tool gets one. Write it down.
2. Session starters per lane. Template prompt that opens any new session correctly.
3. **[v1.1]** Label every task as one of three types: **walk-away** (AI tool runs unattended), **presence** (you + AI tool), or **fieldwork** (physical world, no AI tool).
4. Parallel session rules. Multiple build sessions allowed only on non-overlapping surfaces.
5. Closeout protocol. Every session ends with memory update, open items, handoff.
6. Rapid Assessment Protocol. Before invoking a specialist agent: 30-second triage — "is there a simpler tool?"
7. **[v1.1]** For fieldwork sessions, apply the **fieldwork handoff rule** (below).

### Template — Tool Assignment Matrix (v1.1 — with fieldwork lane)
```
LANE: STRATEGY
Tool: [e.g., Claude.ai]
Use for: strategy, copy, prompts, synthesis, document production
Never: file edits, builds, terminal ops
Task type: presence

LANE: BUILD
Tool: [e.g., Claude Code]
Use for: multi-file edits, git, tests, scaffolding, walk-away runs
Never: strategy discussions, copy drafting
Task type: walk-away (preferred) or presence

LANE: SURGICAL EDIT
Tool: [e.g., Cursor]
Use for: single-file targeted edits
Never: multi-file work, exploration
Task type: presence

LANE: RESEARCH
Tool: [e.g., Perplexity Research mode]
Use for: competitor scans, market data, literature search
Never: synthesis, implementation
Task type: walk-away

LANE: VIDEO / LONG MEDIA
Tool: [e.g., Gemini]
Use for: video analysis, long audio
Never: text tasks
Task type: walk-away

LANE: UI NAVIGATION
Tool: [e.g., Chrome agent]
Use for: UI-only workflows where no API exists
Never: tasks with available APIs
Task type: presence

LANE: MESSAGING INFRASTRUCTURE (if product uses it)
Tool: [e.g., WhatsApp Business API, SMS gateway]
Use for: product-level messaging and booking flows
Never: cold outreach
Task type: presence or walk-away depending on flow

LANE: VETTING / VERIFICATION INFRASTRUCTURE (if product uses it)
Tool: [e.g., background check provider, document verification]
Use for: identity and reference checks
Never: replacing human judgment at the vetting decision point
Task type: walk-away (runs) / presence (decision)

LANE: OPERATOR FIELDWORK  [v1.1 — new]
Domain: physical world, no AI tool
Use for: in-person meetings, physical vetting, community presence,
         trust-building, fieldwork research
Task type: fieldwork (neither walk-away nor AI-presence)
Handoff rule: see Fieldwork Handoff Protocol below
```

### Fieldwork Handoff Protocol *(v1.1 — new)*
Every fieldwork session must end with a debrief entered into the digital system within 24 hours, containing:

```
FIELDWORK DEBRIEF

Who: [name, role, contact]
When: [date, duration]
Where: [location]
Cultural/language context: [notes]

Verbatim quotes (in original language):
- "..."
- "..."
- "..."

Operator gut read (1–5):
  Trust signal: [ ]
  Capacity signal: [ ]
  Fit signal: [ ]

Open questions for next touch:
- [ ]
- [ ]

Next action:
  What: [ ]
  When: [ ]
  Who: [Jason | other]
```

The debrief is the bridge between physical-world and digital-system lanes. Without it, fieldwork data is lost to memory decay within days. With it, fieldwork output feeds the CRM, ICP scoring, pain language harvest, and operational playbook.

### Template — Session Starter Prompt
```
Session: [NAME — topic + date]
Lane: [STRATEGY | BUILD | SURGICAL | RESEARCH | NAV | FIELDWORK | ...]
Task type: [walk-away | presence | fieldwork]
Context files to read first: [list absolute paths]
Open items from last session: [paste from previous closeout]
Today's objective: [one sentence]
Expected output: [file, decision, artifact, fieldwork debrief]
Closeout requirements: [memory update, file save, brain commit]
```

### Template — Closeout Protocol
```
At end of every session:
1. Summarize what was accomplished (3–5 bullets).
2. Update memory/brain files with new facts, decisions, references.
3. If fieldwork session — fill and file the Fieldwork Debrief.
4. List open items for next session with specific next action.
5. Save generated files to canonical output location.
6. Commit and push brain changes if brain-producing session.
7. Suggest session chat name using standard format.
```

### Failure mode + early warning
- **Failure mode:** Tool smear OR fieldwork data loss. Fieldwork sessions without a debrief protocol lose data in days.
- **Early warning:** You remember that a conversation happened but can't recall verbatim quotes. You're pasting code into a chat interface.
- **Recovery:** For tool smear — close wrong-lane session, open right-lane session, paste work. For fieldwork — never leave a fieldwork session without filing the debrief.

### COMMAND illustration
Claude.ai = strategy. CC = build. Cursor = surgical. Perplexity = research. Gemini = video. Walk-away runs while operator sleeps. Minimal fieldwork — product is software-only.

### Ponte illustration (from stress test)
Adds WhatsApp Business API, Truora/idwall (vetting), bilingual translation, and — critically — Operator Fieldwork as the primary value-producing lane. Jason's in-person PA vetting sessions are the product. The handoff rule is the only way the AI-tool lanes get the data they need.

---

## Section 7 — GTM Architecture

### Principle
Never mention the product until the buyer has named the pain in their own words. The product's job is to match language they already used, not to introduce new language.

### Why — sales psychology + internal commitment
Curiosity and threat activate different neural pathways. A pitch triggers the defense circuit within ~2 seconds. A research conversation triggers curiosity and the buyer leans in. This is neural, not rhetorical.

Internal commitment: when a buyer names a pain in their own words, they're committing to it. When you name it for them, they're evaluating your claim, which triggers skepticism.

### How — sequential
1. **Channel triad — culturally contextual.** Pick three non-overlapping channels appropriate for the market. Low-context market defaults (LinkedIn / Reddit / survey) do not transfer to high-context markets. High-context markets favor WhatsApp / in-person presence / community referral. Always validate channel fit before committing.
2. **Research-frame outreach.** 3-touch minimum. Every touch is a question, not a statement.
3. **Survey-first for T2** (low-context markets) OR **warm-referral-first for T2** (high-context markets).
4. **Discovery call as research conversation.** Q1–Q5 framework, no pitch, no product walkthrough.
5. **Cohort scarcity + price lock** (single-sided products) OR **founding member status** (multi-sided products — priority access + lifetime no-fee on early matches).
6. **Buyer language in all copy.** Verbatim from discovery calls. Never paraphrase.
7. **Pilot close, not sales close.** "Want to try it?" not "want to buy it?"

### Template — Discovery Call Playbook
```
CALL: [Prospect name, firm, date]
Side (if multi-sided): [A | B]
Cultural context: [low-context | high-context]
Language: [primary language for the call]

OPENING (30 seconds, research frame)
"Thanks for the time. I'm researching [PROBLEM DOMAIN] and you're
someone who would actually know what the problem looks like. I'm
not going to pitch you anything — I'm trying to understand the
problem before I build the wrong thing. Sound good?"

Q1 — What does your week look like? / Tell me about your current
      work with [domain].
   (goal: map the day, find pain naturally)

Q2 — What's the part of this you hate most?
   (goal: surface pain in their words)

Q3 — How did you used to handle this?
   (goal: find deletion signals, past solutions)

Q4 — What would have to be true for this to stop being a problem?
   (goal: hear their ideal solution in their framing)

Q5 — If you could snap your fingers, what would you delete from
     your current situation?
   (goal: deletion signal, receptivity indicator)

DEFLECT-BACK
If they ask about your product: "I'm still mostly learning — would
you be open to a follow-up once I have something worth your time?"
Do not walk through product.

CLOSE
"This was really helpful. Can I send you a 5-minute summary of
what I heard, and if it's accurate, would you want to be first in
line when I have something to show?"

LOG (→ fieldwork debrief if in-person)
- Verbatim pain phrases (copy exactly, 5+ minimum) in ORIGINAL LANGUAGE
- Deletion signal present (Y/N)
- Tier confirmed or adjusted
- Next action with date
```

### Template — Outreach Sequence Structure
```
TOUCH 1 — RESEARCH INTRO
Goal: open a research conversation.
Format: 1 question. No product. No link.
Channel: [low-context default: DM] or [high-context default: warm
         intro via existing contact, not cold DM]

TOUCH 2 — REFERENCE THEIR PUBLIC WORK (or prior conversation)
Goal: prove you've read / remembered.
Format: Quote them back + 1 follow-up question.

TOUCH 3 — OFFER SURVEY, CALL, OR IN-PERSON MEETING
Goal: move to structured research.
Format: varies by context
  - low-context: 5-question survey or 15-min video call
  - high-context: in-person coffee or WhatsApp voice conversation

Rule: Never mention product, pricing, or sell anything in the
first 3 touches. If they ask what you're building, answer briefly
and redirect back to research.
```

### Failure mode + early warning
- **Failure mode:** Pitch creep — research frame slips to pitch frame by touch 2 or 3. OR: culturally wrong channel mix (LinkedIn automation into a WhatsApp-first market).
- **Early warning:** "I think this could help you" or "I built something that…" before the buyer has asked. OR: automation is sending at volume but responses are zero.
- **Recovery:** Delete the pitch sentence. Rewrite as a question. For channel mismatch: stop the automation, rebuild the channel mix for the cultural context.

### COMMAND illustration
FM cohort (25 slots, $99/mo, lifetime price lock, Sep 30 close) is real scarcity. Waalaxy automation uses research-frame language. Discovery calls use Q1–Q5, no pitch. Low-context channel mix.

### Ponte illustration (from stress test)
Channel mix inverted: WhatsApp primary, Instagram DM secondary, in-person community tertiary. LinkedIn automation doesn't work for Brazilian PAs. Cohort structure changed to "Founding Members" (25 expats) and "Founding Professionals" (25 PAs) with bilateral status, not a single-sided price lock. Discovery calls run in two languages, two versions.

---

## Section 8 — Defensibility Protection *(v1.1 — renamed from "IP + Moat Protection")*

### Principle
Defensibility is not just patents. It's whichever legal + operational instruments actually protect your moat stack. For a solo founder, the goal isn't "own the concept" — it's to protect the *specific defensible combinations* competitors cannot easily copy. Use the right instrument for the moat type you actually have.

### Why — IP strategy + economic reality
Patent economics are brutal for broad claims. Prior art is usually thicker than founders realize. Non-software products often have no patent angle at all — their defensibility lives in trademark, trade secret, or regulatory compliance. The solo-founder defensibility budget is constrained — spending it on the wrong instrument wastes it entirely.

### The four branches *(v1.1 — expanded from patent-only)*

Every moat type maps to a specific defensibility instrument. Use the branch that matches your moat stack.

#### Branch 1 — Patent protection *(software mechanisms)*
**When to use:** You have a novel software mechanism with a narrow constructable claim.

**How:**
1. Triage every novel concept with the IP Triage Prompt.
2. Prior art register — every hit narrows the viable claim AND builds a legal defense log.
3. Micro-entity status (solo founders) — ~75% fee cut.
4. Narrow claim construction — multiple narrow claims > one broad claim.
5. Provisional first — 12-month priority for a fraction of full cost.
6. Dead patent list — killed concepts still get built as features.

**Cost profile:** Provisional filing ~$100–300 (micro-entity). Non-provisional + attorney ~$5k–15k.
**Timeline:** Provisional same day. Full prosecution 2–5 years.

#### Branch 2 — Trademark protection *(consumer-facing brands)*
**When to use:** Your product has a memorable brand that will be used in consumer-facing contexts. Essential for marketplaces, services, and any direct-to-customer product.

**How:**
1. Clear the mark — search USPTO (or local registry) before committing to a name.
2. File early — register the word mark AND the logo if it's distinctive.
3. File in every market you'll operate in — Madrid Protocol covers many in one filing.
4. Monitor for infringement — a trademark that isn't enforced weakens over time.

**Cost profile:** USPTO filing ~$250–350 per class. Brazil INPI ~R$355+ per class (as of research cutoff — RECHECK BEFORE FILING). Attorney support adds $500–2k.
**Timeline:** 6–18 months to registration. Common-law rights start with use.

#### Branch 3 — Trade secret protection *(operational processes)*
**When to use:** Your moat is operational — a vetting process, a matching protocol, a proprietary methodology — that would lose value if it leaked.

**How:**
1. Document the protocol and mark it "Confidential — Trade Secret."
2. NDA every contractor, employee, partner who touches it.
3. Limit access — only people who need to know should know.
4. Do not publish the mechanism in marketing materials (contradiction: you want the *outcome* to be visible; the *mechanism* must not be).
5. Maintain reasonable security — access logs, encryption, physical control.

**Cost profile:** Low — mostly the cost of good NDAs and operational discipline.
**Timeline:** Immediate protection upon taking reasonable measures. Protection is indefinite but evaporates the moment you fail to maintain secrecy.

#### Branch 4 — Regulatory / compliance capture *(regulated markets)*
**When to use:** Your market is regulated (privacy, labor, finance, healthcare, immigration, etc.) and compliance is expensive to build but valuable once built.

**How:**
1. Map the regulatory surface early — name every applicable regulation.
2. Engage specialist advisors (lawyer, compliance officer, insurance broker) before building.
3. Build compliance in from day one, not bolted on at scale.
4. Document the compliance posture — audit trail, policy documents, training.
5. Treat compliance as a moat-building asset, not a tax.

**Cost profile:** High — specialist advisors, compliance infrastructure, insurance. But it's a cost the copycat also pays, which is the point.
**Timeline:** Months to build; compounds thereafter.

### Template — Defensibility Triage Prompt *(v1.1 — replaces "IP Triage")*
```
Product: [NAME]
Product type: [software | marketplace | service | physical | hybrid]
Moat stack (from §3): [list types]

Run triage across all four branches. For each branch, answer:

BRANCH 1 — PATENT
Is there a software mechanism with a narrow constructable claim?
If yes, run the IP Viability Scoring from §4. If no, skip.

BRANCH 2 — TRADEMARK
Is there a consumer-facing brand, name, or logo?
Actions needed: clear the mark, file in [markets], monitor.

BRANCH 3 — TRADE SECRET
Is there an operational process, protocol, or methodology that
would lose value if it leaked?
Actions needed: document + mark confidential, NDA coverage,
access limits.

BRANCH 4 — REGULATORY / COMPLIANCE
Is the market regulated? Which regulations apply?
Actions needed: advisor engagements, compliance build, audit trail.

OUTPUT:
- Which branches apply and which do not
- Priority ordering (what to do first)
- Cost estimate per branch
- Timeline per branch
- Named blockers / open research items
```

### Failure mode + early warning
- **Failure mode:** Wrong-instrument defense — filing patents when the moat is operational, or skipping trademark when the brand is the moat.
- **Early warning:** You're arguing for a broad software patent claim for a non-software product. Or you haven't filed a trademark for a consumer-facing product after a year.
- **Recovery:** Re-run the moat taxonomy in §3 and match the defensibility branch to the moat type.

### COMMAND illustration (software mechanism → patent branch)
Narrow claims: Metabolic Clock (95%), Learned Agent Cards (95%), Contradiction Radar (90%), FRAGO Protocol (85%). Dead claims (Quorum Sensing, provenance edge types, CPMM-style agent economy) got built as features. Primary branch used: Patent (§8.1). Secondary: Trade Secret for operational IP (§8.3).

### Ponte illustration (operational + brand + regulatory → three branches, no patent)
Primary branches: Trademark (INPI registration of "Ponte" in Brazil), Trade Secret (vetting protocol, reference check methodology, matching criteria), Regulatory Compliance as moat (LGPD, labor classification, insurance wrapper). Patent branch does not apply. v1 would have told Jason to file patents for Ponte — that would have been wasted budget.

---

## Appendix — Known gaps, research open items

These are places the playbook still needs work beyond v1.1. They will become v1.2 patches when resolved.

- **Operating-model IP instrument.** "Operating model innovation" that isn't patentable but is still valuable — we have Trade Secret (§8.3) but the scoring framework for when operational uniqueness deserves formal protection is thin.
- **Second-side cooling metric.** The 1:1 ratio rule (§2) is binary. A smoother metric for bilateral ICP health would be more useful.
- **High-context onboarding length data.** The v1.1 cultural-context override says "high-context needs longer." How much longer? A data-backed answer would strengthen §5.
- **Fieldwork → digital handoff compression.** The debrief template is manual. A voice-to-debrief tool lane could reduce friction.

---

## Version history

- **v1.0** (260413) — Initial extraction from COMMAND build corpus. 8 sections, single-sided software bias. Produced in Opus chat from the Build OS extraction prompt.
- **v1.1** (260413) — Six patches applied after Ponte stress test surfaced the single-sided, low-context, software-biased defaults. Now handles marketplaces, high-context cultures, operator fieldwork, and non-patent defensibility.
