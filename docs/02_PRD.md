# AETHOS V1 – PRODUCT REQUIREMENTS DOCUMENT (PRD)

## 1) Overview
Aethos is a symbolic analytics engine for timing intelligence and structured self-knowledge. V1 focuses on: canonical birth processing, multi-system profile generation, daily timing intelligence, and structured journaling.

## 2) Target User (ICP)
Primary: 22–45, already symbol-literate (astrology/HD), dissatisfied with shallow apps, values rigor and privacy.  
Secondary: coaches/therapists and reflective professionals.

## 3) Core Promise
Provide deterministic timing activations and a structured journal archive so users can notice patterns over time without deterministic/predictive claims.

## 4) V1 Scope (P0)
### Onboarding
- DOB, TOB, location (geocode)
- Canonical UTC + JD
- Time confidence indicator (exact/approx/unknown)

### Systems in V1 (facts only)
- Western Tropical (Whole Sign)
- Vedic Sidereal (Lahiri) basic placements + nakshatra for Moon/Sun
- Human Design: design-time calc + gate/line for key points + type/profile (initial)
- BaZi: Four Pillars (mode declared)
- Numerology: basic core numbers

### Dashboard
- Core signatures: Sun/Moon/Asc, HD type/profile, BaZi Day Master
- Today’s top activations (transit-to-natal)
- One daily reflection prompt

### Timing Intelligence (Daily)
- Transit-to-natal aspects
- Intensity score (orb-weighted)
- “Hard vs soft” classification
- Confidence label

### Journaling
- Mood (1–10), tags, notes
- Link entry to daily activation set
- Basic correlation views (later iterations)

## 5) Non-Claims / Ethics
Aethos does not predict events and does not provide medical/legal/financial advice. It provides symbolic timing context and supports reflective practice. Avoid deterministic wording (“this will happen”).

## 6) Data Model (V1)
- User
- BirthProfile (canonical UTC/JD, lat/lon)
- SystemProfiles (per system layer)
- DailyActivation (timing events + scores)
- JournalEntry (mood/tags/notes)

## 7) Architecture (High Level)
- Frontend: web/mobile-first
- Backend: Python API + Swiss Ephemeris
- DB: Postgres
Separation: Calculation layer vs Interpretation vs Correlation.

## 8) Success Metrics
- D7 retention, D30 retention
- Journal completion rate
- Paid conversion (if applicable)

## 9) Out of Scope (V1)
Social features, marketplace, full AI readings, advanced dashas, therapist dashboard.
