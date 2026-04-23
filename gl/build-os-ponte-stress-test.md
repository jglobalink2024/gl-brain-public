# Build OS v1 — Ponte Stress Test (record)

Last updated: 260413
Companion: `gl/build-os.md` (v1.1 canonical, patched from this stress test)
Origin: Opus session 260413, `uploads/GL_Build_OS_Opus_Prompt_v1.md`

> **Purpose.** Record of the adversarial stress test that applied the v1 Build OS to Ponte (São Paulo expat PA marketplace). This document exists to (a) preserve the failure findings that justified the v1.1 patches, and (b) serve as the Ponte Phase 0 reference.
>
> **This is not the canonical playbook.** The canonical is `gl/build-os.md` (v1.1). This is the test that produced v1.1.

---

## How the test was run

Pass 1 of the Opus session extracted v1 of the Build OS from the COMMAND build corpus. Pass 2 applied v1 to Ponte as an adversarial test — looking for where the playbook breaks, not where it confirms. For each of the 8 sections, the test asked:

1. What transfers directly from COMMAND?
2. What needs adaptation for Ponte's conditions?
3. What does the playbook not cover that Ponte needs?
4. What's the specific Ponte output using that section's template?

Ponte's conditions that stress the playbook:

- Marketplace (two-sided), not single-sided SaaS
- Physical presence in São Paulo as unfair advantage
- Brazilian high-context culture — trust built in person
- WhatsApp-first interface, not a web app
- LGPD, Brazilian labor law, insurance as structural friction
- Portuguese-first, English-secondary
- Two ICPs (expat demand + Brazilian PA supply) simultaneously
- Jason is PART of the product (in-person vetting)

---

## Failure findings by section

### §1 — Phase Architecture
**Failure:** v1 assumed single-sided sequential validation. Marketplaces require bilateral validation (demand AND supply in lockstep) or one side cools while the other catches up. v1 also had no "Concierge phase" — it jumped from Phase 0 (validation) to Phase 1 (MVP), which is wrong for marketplaces and services.

**Patch applied to v1.1:** Added bilateral validation rule and inserted Phase 0.5 Concierge as a canonical phase for marketplaces, services, and physical-operation products.

### §2 — ICP Surgery
**Failure:** v1 implicitly assumed one ICP. Bilateral products need two, run in lockstep. Also, the "double-pain operator" concept mapped differently on the supply side — PAs don't "delete tools," they "quit agencies."

**Patch applied to v1.1:** Added bilateral ICP rule + 1:1 ratio rule (never let T1 count on one side exceed 2x the other).

### §3 — Positioning: Structural Moat
**Failure:** v1's moat framework was software-biased. It named cross-vendor, unclaimed layer, compounding software asset, IP. It did not name liquidity, trust/vetting, regulatory capture, or physical presence — all of which matter for non-software products and all of which matter for Ponte.

**Patch applied to v1.1:** Added 8-type Moat Type Taxonomy covering both software and non-software moats.

### §4 — Novel Concept Research
**Failure:** Minor. The discipline scan fields were mechanism-biased (bio/physics/military). For operating-model products, anthropology, sociology, service design, and matching market design are more relevant. Also, K3 in the Kill Test was labeled "IP/legal" — which only makes sense for software mechanisms.

**Patch applied to v1.1:** Added operating-model-problem field list + made K3 context-sensitive ("IP prior art" for software, "regulatory/compliance" for non-software). Added Operational Uniqueness Scoring as a parallel to IP Viability Scoring.

### §5 — Psychology Layer
**Failure — the hardest.** v1's 20-minute onboarding rule and cognitive-load efficiency bias are correct for low-context Anglophone markets and *wrong* for high-context cultures like Brazil. Brazilian trust-building requires *longer* relational time, not shorter. Applying v1 literally to Ponte would break the product. This is a cultural blindspot, not an edge case.

**Patch applied to v1.1:** Added Cultural Context Check as a mandatory first step in §5. Subordinated the cognitive-load rules to cultural context. Documented that v1 had an Anglophone software-market efficiency bias as its default.

### §6 — AI Tool Stack Architecture
**Failure:** v1 assumed all work was AI-tool-driven. Ponte's core value-producing work is physical — in-person vetting interviews, community presence, relationship building. v1 had no lane for operator fieldwork and no handoff rules between physical-world work and AI-tool systems.

**Patch applied to v1.1:** Added Operator Fieldwork as a first-class lane type. Added Fieldwork Handoff Protocol (debrief template) for transitioning physical-world data into AI-tool systems. Added "fieldwork" as a third task type alongside walk-away and presence.

### §7 — GTM Architecture
**Failure:** v1's channel triad (LinkedIn automation + Reddit karma + survey) does not transfer to Brazil. WhatsApp is primary, Instagram secondary, in-person presence tertiary. Also, cohort scarcity + price lock needs to become bilateral "Founding Member" / "Founding Professional" status for marketplaces.

**Patch applied to v1.1:** Updated §7 to explicitly call out channel triad as culturally contextual. Added marketplace variant for cohort structure.

### §8 — IP + Moat Protection (renamed: Defensibility Protection)
**Failure — significant.** v1 treated defensibility as synonymous with patents. For Ponte — which has no patent angle at all — v1's guidance would have wasted the limited IP budget. The real Ponte defensibility stack is trademark + trade secret + regulatory compliance, none of which v1 named.

**Patch applied to v1.1:** Renamed §8 to "Defensibility Protection." Expanded from patent-only to four branches: Patent / Trademark / Trade Secret / Regulatory Compliance. Each with when-to-use, how, cost profile, timeline. Added Defensibility Triage Prompt that covers all four branches.

---

## Ponte deliverables produced in the stress test

These were produced during Pass 2 as the "specific Ponte output" for each section's template. They are the working artifacts, not final Ponte strategy — Ponte Phase 0 will refine them with real discovery data.

### Ponte Phase 0 Checklist (June 2026 onward)

```
WEEK 1–2 — ARRIVAL + FOUNDATION
[ ] Physical presence in São Paulo established (housing, SIM, CPF)
[ ] Initial advisors identified: Brazilian lawyer (labor + LGPD),
    accountant (CLT vs PJ), insurance broker (Tokio Marine or equivalent)
    — INTRO MEETINGS ONLY
[ ] Ponte Serviços LTDA filing initiated
[ ] WeWork or equivalent co-working space secured (network node)

WEEK 2–4 — EXPAT SIDE RESEARCH (DEMAND)
[ ] Join expat WhatsApp groups via introduction (not cold)
[ ] Attend first InterNations event
[ ] 5 research-framed conversations with expats about household help
[ ] Log verbatim pain phrases in English/Spanish
[ ] Begin drafting Expat ICP v1

WEEK 3–5 — PA SIDE RESEARCH (SUPPLY)
[ ] Get 3 warm intros into Brazilian PA networks
[ ] 5 research-framed conversations (in Portuguese, in person) with
    experienced PAs
[ ] Log verbatim pain phrases in Portuguese
[ ] Begin drafting PA ICP v1

WEEK 4–6 — REGULATORY OPEN ITEMS
[ ] Formal engagement with labor lawyer on CLT vs PJ question
[ ] Perplexity Research deep-dive: LGPD for two-sided platforms
[ ] Insurance broker conversation: what's available, what it costs
[ ] WhatsApp Business API research: what's allowed, what's restricted

WEEK 6–8 — BILATERAL DATA CONSOLIDATION
[ ] 10+ expat conversations logged
[ ] 10+ PA conversations logged
[ ] Pain language lists in both languages
[ ] Bilateral ICP v2 with weighted scoring
[ ] Moat hypothesis sanity-checked against what's been learned

WEEK 8–12 — FIRST CONCIERGE MATCHES (MANUAL) ← Phase 0.5
[ ] 3 expats agree to a paid concierge match (no software)
[ ] 3 PAs vetted in person for those matches
[ ] First match executed end-to-end on WhatsApp by Jason personally
[ ] Document the protocol as it happens — this becomes the trade secret

PHASE 0 GATE (end of ~Week 12):
- [ ] 10+ paired pain phrases confirmed (verbatim, both languages)
- [ ] 3 successful concierge matches delivered end-to-end
- [ ] Regulatory open items have named paths forward
- [ ] Decision: proceed to Phase 1 (Concierge Scale) or regress
```

### Three highest-leverage actions in first 30 days

1. **Get one senior Brazilian PA to vouch for you inside her network.** One trusted introducer unlocks weeks of research in a high-context market. Path: coffee with any PA Jason already has a weak tie to, explicit ask for one warm introduction to her most trusted peer, research-framed conversation with the peer. Trust compounds by referral; do not skip the vouching step.

2. **Conduct one in-person expat "research conversation" at an InterNations event — and never offer the product.** One strong pain-language conversation with an expat at an actual meetup does more than 50 LinkedIn DMs. The goal is to hear someone say "I'd pay someone just to handle [X]" in their own words. Log verbatim. Do not pitch. The restraint is the signal.

3. **Book formal intro meetings with all three regulatory advisors (lawyer, accountant, insurance broker) in the same week.** Not to engage them — to surface the regulatory open items fast so research can run in parallel. Each meeting is 30 minutes, research-framed. The purpose is to get a named path forward for each kill vector — LGPD, labor classification, insurance structure — before the pain-language research creates commitment to a shape of product that regulatory reality can't support.

### Ponte moat hypothesis

> **"No existing Brazilian domestic services agency can serve foreign expats at quality by structural definition, because their operating model, language capacity, trust network, and margin structure are optimized for local Brazilian clients — pivoting would require them to rebuild all four in parallel. Ponte wins by being purpose-built for that gap with a founder who is physically present, culturally bilingual, and willing to vet in person for as long as it takes to build the liquidity flywheel. Once the flywheel turns, liquidity + trust + regulatory compliance + brand recognition in the expat community compound faster than any later entrant can catch up."**

Moat stack (using v1.1 taxonomy — which did not exist in v1):

- **L1 — Structural incompatibility of incumbents** — permanent unless they restructure their core model
- **L2 — Liquidity moat** — grows monotonically with every successful match
- **L3 — Trust / vetting moat** — Jason's physical presence as accumulation engine
- **L4 — Regulatory compliance moat** — LGPD + labor + insurance, once built raises copycat cost [REQUIRES RESEARCH]
- **L5 — Brand moat in expat communities** — word-of-mouth in a tight community compounds faster than paid acquisition

No software moat. No cross-vendor structural. No IP. Four-type non-software moat stack that v1 of the playbook could not name.

### Ponte ICPs

**Demand side: Expat Operator**

Foreign professional, 32–50, in São Paulo for 1+ years, earning in USD/EUR, household complexity exceeds personal time budget, has tried informal solutions (friend-of-friend PA, agency) and been burned by at least one. Lives in Jardins, Itaim, Pinheiros, Vila Nova Conceição, or Moema. Double-pain signal: runs own business or consulting practice in addition to household demands. Already active in expat communities (InterNations, expat WhatsApp, coworking spaces). Speaks at least some Portuguese but defaults to English for anything important.

Scoring rubric weights (summary):
- Earning in foreign currency: 0.15
- Household complexity: 0.20
- Prior-bad-experience signal: 0.15
- Tenure in SP: 0.10
- Community access: 0.10
- Role match: 0.10
- Language: 0.10
- Conversion probability: 0.10

**Supply side: Vetted Professional PA**

Brazilian PA or household manager, 28–50, 3+ years of experience managing professional or expat households, speaks functional English, has 3+ checkable references, currently underearning relative to her skills because of agency commission cuts or informal-market pricing. Double-pain signal: has worked for at least one expat household before and saw the rate differential firsthand. Ideally quit her last agency for a reason she can articulate. Willing to be vetted in person and carry professional standing ("profissional," not "empregada").

Scoring rubric weights (summary):
- Years of PA experience: 0.20
- Reference-checkable network: 0.20
- English comprehension: 0.15
- Clean background check: 0.15
- Commute radius to expat neighborhoods: 0.10
- Capacity signal: 0.10
- Prior bad agency experience: 0.10

---

## Research open items (do not guess — research before building)

Flagged as genuine gaps during the stress test. None are filled in because fabricating Brazilian regulatory or commercial specifics is more dangerous than leaving them open.

1. **LGPD compliance for two-sided marketplaces** — exact requirements for platform data handling, cross-border data flow (expats from US/EU), and consent mechanisms.
2. **WhatsApp Business API in Brazil** — cold outreach rules, commerce policy, rate limits, which provider (Meta Cloud API vs Twilio vs Gupshup) fits Ponte's model.
3. **Truora vs idwall** — cost, coverage, quality of background checks for domestic service workers in Brazil.
4. **Tokio Marine (or alternative) insurance wrapper** — structure, availability, and cost of liability insurance for marketplace-matched engagements in Brazil.
5. **CLT vs PJ vs autonomous worker classification** — for marketplace-matched PAs, which classification survives Brazilian labor law audit? This is the regulatory kill vector.
6. **INPI trademark registration** — process, cost, timeline, and class coverage for the "Ponte" word mark + logo in Brazil.

Each requires a Perplexity Research session before Ponte Phase 0 exits.
