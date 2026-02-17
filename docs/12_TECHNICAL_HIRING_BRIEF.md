# AETHOS — TECHNICAL HIRING BRIEF (V1)

## 1) Summary
Aethos is a privacy-first, deterministic symbolic analytics product that computes layered “system profiles” (Western Tropical, Vedic Sidereal, Human Design, BaZi, Numerology) from a single canonical birth input, and produces daily timing activations plus journaling-based correlation loops.

This repo contains:
- product and engineering specifications (`/docs`)
- decision records (`/decisions`)
- early scaffold modules (`/src`)

We are hiring engineering talent to turn spec into production.

---

## 2) What’s Shipping in V1 (Scope Lock)
**V1 MUST SHIP:**
1) Canonical birth profile creation (timezone safe, JD UT correct)
2) Western Tropical chart layer (planets + angles; Whole Sign)
3) Vedic Sidereal layer (planets + nakshatra for Moon; Lahiri)
4) Daily timing activations (transit → natal aspects + intensity ranking)
5) Journaling + basic analytics events
6) Compliance-safe language enforcement (non-claims)

**V1 MAY SHIP (if time):**
- Human Design: personality + design activations (gate+line)
- Gene Keys overlay (gate→shadow/gift/siddhi) on activations

**V1 NOT SHIPPING:**
- Full Human Design bodygraph (centers/channels/type logic)
- BaZi luck pillars + advanced solar-term precision
- AI “life prediction” language (explicitly prohibited)

---

## 3) Engineering Roles Needed

### Role A: Founding Engineer (Backend / Systems)
**Core responsibilities**
- Implement canonical birth conversion (tz/DST correctness)
- Implement Swiss Ephemeris wrappers (pyswisseph)
- Build deterministic computation jobs (sync or queued)
- Implement API from `docs/05_API_SPEC.md`
- Golden fixture regression harness (QA gate)

**Required**
- Python (FastAPI preferred)
- Postgres + migrations
- Experience with deterministic computation pipelines
- Strong test discipline

**Nice**
- Astrology/Jyotish familiarity
- Experience with privacy-first systems

---

### Role B: Frontend Engineer (Product UI)
**Core responsibilities**
- Implement onboarding, profile screens, timing dashboard, journal UI
- Strict non-claims language enforcement in UI copy
- Analytics event wiring (V1 minimal)

**Preferred**
- React/Next.js (or mobile equivalent if chosen)
- UI/UX execution discipline

---

### Role C: Fractional CTO / Technical Lead (Short contract)
**Core responsibilities**
- Validate architecture and scope
- Establish CI, test strategy, deployment
- Help hire/mentor founding engineer(s)
- Ensure correctness and privacy posture

---

## 4) Technical Principles (Non-Negotiable)
- One canonical birth input; everything derives from it
- Deterministic computation; versioned outputs
- Separate calculation from interpretation language
- Tests before “cool features”
- Privacy-first data handling

---

## 5) Milestones (First 30–45 Days)
**Week 1–2**
- Stand up API skeleton
- Implement auth + profile birth submission
- Add canonical timezone/JD correctness tests

**Week 3–4**
- Western Tropical chart output matches references within tolerance
- Timing engine: aspects + intensity for “today” endpoint
- Golden fixture test suite in CI

**Week 5–6**
- Journal CRUD + events
- Vedic layer nakshatra
- Staging deploy + E2E smoke tests

---

## 6) Artifacts Engineers Receive
- PRD (`docs/02_PRD.md`)
- Data Model (`docs/04_DATA_MODEL.md`)
- API Spec (`docs/05_API_SPEC.md`)
- QA Plan (`docs/10_QA_TEST_PLAN.md`)
- Compliance framework (`docs/08_COMPLIANCE_NONCLAIMS.md`)
- ADRs (`/decisions`)
- Scaffold modules (`/src`)

---

## 7) How We Evaluate Candidates
- Ability to implement from a spec
- Test discipline + regression strategy
- Ability to explain tradeoffs clearly
- Comfort with correctness-sensitive systems

---

## 8) Initial Interview Exercise (1–2 hours)
Option 1: Implement a single endpoint + fixture test:
- POST /profile/birth
- GET /profile/system/western_tropical
- Use one fixture birth input and verify Sun longitude is within tolerance vs Swiss Ephemeris reference.

Option 2: Implement a deterministic “timing today” calculation:
- One transit aspect + scoring rule
- Return stable JSON payload with versioning

---

## 9) Contact / Next Steps
We start with a short scoping call + paid technical trial.
We are prioritizing speed, correctness, and discipline over feature sprawl.
