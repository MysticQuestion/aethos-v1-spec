Good.

You’re asking for **institutional-grade depth**, not startup-blog fluff.

We’re going to make this roadmap something a serious CTO, a disciplined angel, or a SkyDeck reviewer could read and say:

> “This is sequenced. This is constrained. This founder understands build risk.”

Replace your current `docs/11_ROADMAP_MILESTONES.md` with the version below.

This is the complete, capital-aware, systems-aware roadmap.

---

# 11_ROADMAP_MILESTONES.md

## Aethos – Full Execution Roadmap (V1 → Validation → Scale)

---

# I. Strategic Positioning

Aethos is building:

> A symbolic analytics engine that transforms deterministic astronomical data into structured behavioral reflection tools.

This roadmap is governed by five constraints:

1. Capital discipline
2. Cognitive simplicity in V1
3. Deterministic engine before interpretive layering
4. Measurable retention before expansion
5. Founder sustainability

The roadmap is intentionally sequential, not parallel.

---

# II. Development Philosophy

V1 must prove three hypotheses:

### H1 – Timing signals feel meaningful when paired with journaling.

### H2 – Users will pay for structured symbolic reflection.

### H3 – Pattern awareness improves retention.

Everything in this roadmap supports validating those hypotheses.

Nothing else.

---

# III. Phase 0 — Structural Lock & Pre-Engineering Alignment

**Duration: 2–3 weeks**

## Objective:

Stabilize architecture, scope, and hiring clarity before writing production code.

---

### Deliverables:

* Repository fully structured
* Architecture one-pager finalized
* Data model locked
* API spec locked
* User journeys defined
* QA test framework defined
* Compliance language finalized
* Hiring brief prepared
* Calculation layer scaffolded

---

### Technical Decisions Locked in Phase 0:

* Canonical birth input as single source of truth
* Whole Sign houses
* Swiss Ephemeris backend
* Deterministic output only (no probabilistic ML)
* Journal data stored separately from computed timing facts
* No AI interpretation in V1

---

### Exit Criteria:

* Repo can be reviewed by CTO without confusion
* No unresolved architectural questions
* V1 exclusion list documented

---

# IV. Phase 1 — Core Engine Construction

**Duration: 8–10 weeks**

This phase builds the deterministic spine.

---

## 1. Backend Engineering Milestones

### M1 — Canonical Chart Engine

**Purpose:** Reliable deterministic birth data transformation.

**Components:**

* Place resolution (geocoding)
* Historical timezone resolution (DST accurate)
* UTC conversion
* Julian Day computation
* Swiss Ephemeris wrapper
* Tropical + Sidereal support
* Whole Sign house computation
* Output serialization

**Testing:**

* 10 known birth charts must match Astro.com within tolerance.
* UTC conversion must match authoritative timezone databases.

**Failure condition:** Any mismatch >0.01° must be debugged.

---

### M2 — Transit Engine

**Purpose:** Generate transit-to-natal events.

**Components:**

* Planetary daily ephemeris generation
* Aspect detection (conjunction, opposition, square, trine, sextile)
* Orb classification (configurable)
* Applying/separating logic
* Hard vs soft tagging
* House activation mapping

**Performance requirement:**

* 30-day range generation <500ms server-side.

---

### M3 — Salience Scoring Model v1

Salience Score = weighted composite of:

* Aspect type weight
* Orb proximity weight
* Personal planet involvement multiplier
* Angular house multiplier
* Exactitude proximity boost

Formula must be transparent and deterministic.

No ML.

---

### M4 — Journal Service

**Data fields:**

* mood (1–10)
* energy (1–10)
* stress (1–10)
* optional tags
* free text
* linked activation IDs
* timestamp (local + UTC)

**Security:**

* All entries encrypted at rest.
* No cross-user access.

---

### M5 — Correlation Engine v1

Compute:

* Average mood per activation category
* Hard aspect stress variance
* House activation frequency vs mood shifts
* Planet frequency mapping

No causality claims.
No predictive overlays.

Pure statistical correlation.

---

## 2. Frontend Milestones

### M6 — Onboarding Flow

Requirements:

* Stripe subscription gating
* Canonical birth entry validation
* Non-claims acceptance capture
* Birth confidence toggle

Edge case:

* Unknown birth time disables houses and angles.

---

### M7 — Today View

Must include:

* Salience score prominently displayed
* Top 3–7 ranked activations
* Detail modal
* Journal entry CTA

Latency target:
<2 seconds first load.

---

### M8 — Weekly Summary

Includes:

* Mood distribution graph
* Activation frequency summary
* Hard vs soft ratio
* Suggested focus theme

---

### M9 — Monthly Report

Signature deliverable.

Includes:

* Top activated planet
* Most volatile house
* Mood correlation chart
* Upcoming high-salience dates

Exportable summary (Phase 1.5 optional).

---

### Phase 1 Exit Criteria:

* 10 internal testers onboarded
* No critical bugs
* Journal → summary pipeline stable
* Billing stable
* Correlation engine returns coherent outputs

---

# V. Phase 2 — Private Paid Beta Validation

**Duration: 8–12 weeks**

---

## Objective:

Prove retention and insight density.

---

## Cohort Size:

50–100 curated users.

---

## Metrics Monitored:

* Week 1 retention
* Month 2 retention
* Journaling compliance (≥3 entries/week)
* Clarity score (1–10)
* Support burden per 20 users

---

## Iteration Allowed:

* Prompt clarity adjustments
* Salience weighting refinement
* UX simplification
* Copy clarity

Not allowed:

* New systems (HD/BaZi/Gene Keys UI)
* AI interpretation layer
* Social features

---

### Phase 2 Exit Criteria:

* ≥60% Month 2 retention
* ≥50% journaling compliance
* ≥8 average clarity score
* Revenue covering infrastructure costs

If not achieved → refine engine before scaling.

---

# VI. Phase 3 — System Expansion (Only if V1 Validated)

---

## Expansion Track A — Human Design Overlay

* Gate calculation integrated into UI
* Type/strategy display
* Limited centers view
* No full bodygraph complexity yet

---

## Expansion Track B — Gene Keys Reflection Layer

* Shadow → Gift display
* Optional contemplative journaling mode
* No Siddhi mystical framing in UX

---

## Expansion Track C — Advanced Correlation Engine

* Heatmap visualization
* Cross-planet pattern clustering
* Behavioral tagging intelligence

---

# VII. Phase 4 — Capital & Scale Decision

At 150+ paying users:

Decision node:

A) Raise pre-seed
B) Continue lean scaling

Raise only if:

* Retention stable
* Engagement strong
* Support manageable
* Architecture scalable

---

# VIII. Risk & Constraint Management

### Risk 1 — Founder overload

Mitigation: strict feature discipline.

### Risk 2 — Overbuilding

Mitigation: enforce V1 exclusion list.

### Risk 3 — Low retention

Mitigation: tighten cohort curation.

### Risk 4 — Misinterpretation as prediction tool

Mitigation: compliance language always visible.

---

# IX. Operational Timeline Snapshot (9 Months)

Month 1–2:
Architecture + engineering alignment

Month 3–4:
Core engine build

Month 5:
Internal testing

Month 6:
Private paid beta launch

Month 7–8:
Refinement + data analysis

Month 9:
Expansion or raise decision

---

# X. Definition of Strategic Success

Aethos succeeds at V1 if:

* Users demonstrate measurable behavioral pattern awareness.
* Users pay voluntarily beyond Month 1.
* Timing signals feel intelligent without deterministic framing.
* The engine proves expandable without collapsing under complexity.

If these are achieved:

Aethos transitions from experiment → platform.

XI. Dependency Graph (Critical Path Map)

V1 development is gated by deterministic sequencing.

Core Dependency Chain

Canonical Birth Engine
→ Transit Engine
→ Salience Model
→ Journal Service
→ Correlation Engine
→ Weekly Summary
→ Monthly Report
→ Beta Launch

If Canonical Birth is unstable → everything collapses.

If Journal pipeline fails → correlation meaningless.

If Salience scoring incoherent → retention collapses.

Therefore:

No frontend polish before canonical engine passes validation.

No marketing before correlation engine works.

No expansion systems until retention validated.

This is non-negotiable.

XII. Resource Model (Realistic Founder Constraints)

Assume:

Founder (you) = 0.5–1.0 FTE strategy + product

Fractional backend engineer = 0.5 FTE

Optional frontend contractor = 0.25 FTE

No full-time hires initially

Estimated engineering hours (Phase 1):

Canonical chart engine: 40–60 hours

Transit + salience engine: 60–80 hours

Journal service: 30–40 hours

Correlation v1: 40–60 hours

Frontend core views: 80–120 hours

QA + integration: 40–60 hours

Total: ~300–400 engineering hours

At $75–125/hr:
$22k–$50k realistic cost range.

This is important.

Investors respect founders who understand cost.

XIII. Infrastructure Assumptions (V1)

Backend:

Python (FastAPI)

Postgres

Redis (optional cache)

Stripe billing

Hosting:

Vercel / Render / Railway / Fly.io

Monthly infra estimate: $50–$200 initially

Data:

Birth data encrypted

Journal encrypted at rest

No unnecessary third-party sharing

Compliance posture:

Not medical advice

Not predictive claims

Clear ToS + Privacy

XIV. Technical Risk Register (Deeper Layer)
TR1 — Timezone Resolution Errors

Impact: incorrect birth chart.
Mitigation: use authoritative timezone DB (IANA), test historical cases.

TR2 — Swiss Ephemeris integration issues

Impact: mismatched planetary data.
Mitigation: benchmark against Astro.com known charts.

TR3 — Overcomplicated salience model

Impact: user confusion.
Mitigation: keep v1 formula simple + transparent.

TR4 — Correlation overstatement

Impact: legal/ethical risk.
Mitigation: enforce language filters in UI.

TR5 — Journal engagement drop

Impact: retention failure.
Mitigation: friction-reduced 60-second check-in mode.

XV. Budget Envelope Strategy
Scenario A — Bootstrapped

Founder funds:
$15k–$30k initial build

Pros:

Control

Clean cap table

Strong signal at raise

Cons:

Slower build

Founder stress

Scenario B — Pre-Seed Before Build

Raise $100k–$250k

Pros:

Faster execution

Reduced founder risk

Cons:

Valuation pressure

Build before validation

Roadmap assumes Scenario A until proven otherwise.

XVI. Kill Criteria (Intellectual Honesty Clause)

If after 90 days of beta:

Retention <40%

Journaling compliance <30%

Clarity score <6

Users describe product as “confusing”

Support burden > 1 ticket per 10 users per week

Then:

Pause expansion.
Refactor engine.
Simplify.

If refactor fails → pivot or sunset.

Serious founders define kill thresholds.

XVII. Expansion Gate Conditions

You may not add:

BaZi

Full Human Design

AI synthesis

Social layer

Until:

Retention ≥60% sustained for 60 days.

This protects product integrity.

XVIII. Long-Term Architecture Trajectory (Post V1)

If validated:

Year 1 roadmap:

Mobile wrapper

Advanced correlation visualization

API layer for enterprise

Structured research partnerships

Possible white-label engine

But only after core retention proven.


