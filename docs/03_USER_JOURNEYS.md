Aethos V1 – User Journeys (Private Paid Beta, Curated Cohort)
Document role

This file defines V1 behavioral flows end-to-end so engineers can implement screens + services without ambiguity. It also serves as an investor artifact to demonstrate scope discipline.

0) V1 Cohort Model

Launch mode: Private paid beta
Admission: Application + approval
Cohort: Mixed literacy, filtered (C)
Pricing: $15/mo baseline (promo codes supported)
Primary bet: Timing signals become useful only when paired with journaling + correlation loops.

Product posture (non-negotiable):

Not event prediction

Not deterministic outcomes

Not medical/legal/financial advice

A structured reflection tool using symbolic timing as metadata

1) Primary Personas (V1)
P1 — Symbolic-Literate Analyst (30–40%)

Understands astrology basics; wants rigor, not vibes.
Success definition: “I can interpret timing with evidence and repeatability.”

P2 — Psychologically-Literate Seeker (40–50%)

Not an astrologer, but reflective, journals consistently.
Success definition: “It helps me understand patterns in behavior and stress response.”

P3 — Curious Novice (10–20%)

Low literacy but high curiosity; must be protected from confusion.
Success definition: “It gives me clarity without jargon overload.”

Cohort guardrail: If P3 overwhelms support load or shows high confusion, tighten admissions.

2) North-Star Journey (One Sentence)

User moves from “what is happening to me?” → “I can observe recurring timing patterns and my responses to them” → “I can plan and regulate better.”

3) Journey Map Summary (Phases)

Entry & Trust (Day 0): approval → payment → canonical birth → disclaimers → first dashboard

First Signal (Day 1): “today’s activations” + first journal entry

Habit Formation (Week 1): recurring check-ins + “micro-insights”

Pattern Recognition (Weeks 2–4): correlation overlays become meaningful

Monthly Synthesis (Day 30): “timing report” + suggested focus theme

4) Journey A — Application → Approval → Activation (Day 0)
A0. Application page (web)

User intent: “Is this for me?”
Inputs (minimal):

email

2–3 questions (why joining, comfort with journaling, familiarity level)

optional: referral code

System outputs:

stores application record

auto-response email: received + timeline + expectations

Edge cases:

suspicious/spam application → auto-reject

user indicates “I want predictions” → soft reject or place in later cohort

A1. Acceptance email → Create account

User sees:

acceptance + private beta framing

clear boundaries: “no fate claims”

link to create account

System:

creates invite token

token expires (security hygiene)

A2. Subscription checkout

User actions:

choose plan (default $15/mo)

apply promo code (optional)

confirm billing

System:

creates customer + subscription

gates app access behind active subscription

Edge cases:

payment fails → retries + “update payment” screen

chargeback → account paused

A3. Canonical birth input (Truth Source)

User inputs:

date of birth

time of birth (with confidence selector)

birthplace (search / autocomplete)

optional notes: “time from certificate?” “approx?”

System behavior:

resolves place → lat/lon

resolves timezone at birth date (DST historically correct)

converts to UTC + JD

saves canonical birth profile

computes base chart facts

User output:

confirmation screen summarizing inputs + confidence

ability to edit/confirm

Edge cases:

unknown birth time → V1 supports “no time” mode with reduced features (angles/houses disabled)

conflicting timezone/place → force user confirmation

A4. “What this is” framing + agreement

User must accept:

non-claims statement

privacy summary

journaling expectation

System:

logs acceptance timestamp/version

cannot proceed without acceptance

A5. First dashboard load (“Today”)

User lands in Today View (see Journey B).

5) Journey B — Daily Use (Day 1 onward)
B1. Today View (core)

Primary UI blocks:

Salience Score (0–100)

Top Activations (3–7 items)

Transit → natal aspect (planet/point)

orb, applying/separating

house activation tags (Whole Sign)

One recommended reflection prompt

Log entry CTA

User actions:

tap an activation → details

open journal entry

optionally view “week” timing preview

System behaviors:

computes timing events for today window (00:00–23:59 local)

ranks by salience

selects prompt template based on activation types

Edge cases:

no strong activations → show “low-signal day” template + prompt focused on baseline regulation

user confusion → “Explain this simply” toggle (non-LLM, just simplified copy)

B2. Activation Detail View

Shows:

what it is (transit, natal, aspect type)

orb + exactitude window (if available)

typical psychological themes (careful, non-deterministic)

suggested behaviors (“protocols” placeholder)

User actions:

“Log what happened” (links to journal with prefilled tags)

“Save for review” (bookmark)

System:

ties the journal entry to activation id(s)

B3. Journal Entry Flow (V1)

Minimum fields:

mood (1–10)

energy (1–10)

stress (1–10)

free text (required)

tags (optional)

attach activations (auto-suggested)

System:

saves journal record

logs analytics events (see 09 doc)

updates correlation aggregates nightly or immediately

Edge cases:

user writes very short text → prompt “add one more sentence”

user logs crisis/self-harm → show crisis resources + lock to safety copy (no coaching)

B4. End-of-Day Micro Insight (optional notification)

Trigger: user logged an entry
Content: one sentence pattern hint
Example: “You logged higher stress during hard aspects to the Moon this week.”

System:

simple statistics only

no causality claims

6) Journey C — Week 1 Habit Loop
C1. Day 3 “Consistency check”

If user has <2 entries:

show “lightweight mode”: 60-second check-in

reduce friction rather than guilt

C2. Day 7 “Week Summary”

Outputs:

total entries

mood variance

most frequent activation category

most active house

“what to watch next week” (timing preview)

User action:

accept “focus theme” for next week (optional)

System:

sets a “focus tag” that can influence prompt templates

7) Journey D — Month 1 Synthesis (Day 30)
D1. Monthly Report View (V1 signature asset)

Sections:

Your month in signals

of high-salience days

top recurring planets/points

Correlation overlays (not causal)

stress vs hard aspects

mood vs specific houses activated

Your most consistent theme

“relationships,” “work/public life,” “home,” etc.

Next month’s watchlist

upcoming exactitude windows (top 3)

User actions:

export as PDF (optional Phase 1.5)

share anonymized summary (optional Phase 2)

8) Journey E — Support & Feedback (Beta Governance)
E1. In-app feedback (required monthly)

Questions:

clarity (1–10)

usefulness (1–10)

confusion points (free text)

top feature request

System:

stores feedback linked to cohort + version

flags repeated confusion areas for copy refinement

E2. Refund / cancel

instant cancel, retain access until end of billing period

exit survey (optional)

9) V1 Exclusions (Hard Scope Boundaries)

V1 explicitly excludes:

full HD bodygraph (centers/channels/type calc)

BaZi and Gene Keys as user-facing systems (allowed as internal R&D layer)

AI “oracle” interpretations

compatibility/matching

medical/legal/financial advice

10) V1 Success Metrics (Operational)

Target (90 days):

Month 2 retention ≥ 60%

Weekly journaling compliance ≥ 50% (3 entries/week)

Average clarity ≥ 8/10 among retained users

≥ 30% users report “actionable pattern awareness”

Support burden ≤ 1 ticket per 20 users per week

11) Engineering Acceptance Criteria (What “done” means)

The journey is “implemented” when:

user can onboard → see Today → log journal → get week summary → get month report

all payloads are deterministic, versioned

non-claims language is enforced in UI copy

analytics events are emitted per 09 doc

basic test fixtures exist for one known birth profile
