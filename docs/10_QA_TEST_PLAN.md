# AETHOS V1 — QA & TEST PLAN

## 0) Purpose
Aethos is a symbolic analytics engine. In this category, **correctness is product**. V1 QA ensures:

- deterministic engines are accurate and reproducible
- canonical birth conversion is robust (timezone/DST/location)
- outputs do not drift across refactors
- daily timing activations are consistent
- privacy/non-claims requirements are verifiably present

This plan defines test types, fixture strategy, regression methods, and release gates.

---

## 1) Quality Pillars (What Must Be True)

### 1.1 Determinism
Given the same canonical birth profile + engine settings, Aethos must return the same system outputs (within defined numeric tolerances).

### 1.2 Canonicalization Correctness
Local datetime + timezone + lat/lon must convert to:
- correct UTC datetime
- correct JD UT
and roundtrip without drift.

### 1.3 Calculation Accuracy (Core)
Western Tropical, Vedic Sidereal, and Timing Transits must match trusted reference calculators within tolerance (Swiss Ephemeris parity).

Human Design and BaZi must match verified reference outputs for fixture profiles once mapping and calendar rules are finalized.

### 1.4 Output Contract Stability
API response shapes and stored payload schemas must remain stable or be versioned.

### 1.5 Safety & Compliance
Non-claims language must be present and no deterministic “event prediction” phrasing must enter templates.

---

## 2) Test Environments

- **Local dev**: fast unit tests + small fixture set
- **CI**: full suite on every PR merge to main
- **Staging**: end-to-end smoke tests + nightly activation generation
- **Production**: health checks, monitoring, and canary release validation

---

## 3) Test Types (What We Test)

### 3.1 Unit Tests (Fast)
Scope:
- normalization utilities (degrees, signs, wrap-around)
- JD conversion and timezone handling
- aspect detection (angles, orb policy)
- scoring functions
- nakshatra mapping boundaries
- HD design-time solver (bisection convergence)
- BaZi stem/branch lookups (once implemented)

Pass criteria:
- 100% pass in CI
- deterministic outputs under test constraints

---

### 3.2 Golden Fixture Tests (Critical)
Golden tests validate the whole output payload against known-good results (or their stable hashes).

Approach:
- Store canonical fixture inputs (`fixtures/birth_profiles.json`)
- For each fixture, compute system payloads
- Compare to stored golden JSON or a stable hash of canonicalized JSON.

Why:
- Prevent silent drift during refactors.
- Detect changes in ephemeris flags/settings.

Pass criteria:
- No fixture diffs without explicit version bump + approved PR notes.

---

### 3.3 Integration Tests
Validate API-level behavior:
- onboarding creates birth profile
- system profiles computed and retrievable
- timing endpoints return payload with correct date alignment
- journal entry creates/reads/updates

Pass criteria:
- API returns correct schema + status codes
- auth gates enforced

---

### 3.4 End-to-End Smoke Tests (Staging)
Simulate a user flow:
1) signup/login
2) submit birth profile
3) fetch summary + one system profile
4) fetch today’s timing
5) post journal entry
6) fetch journal entry range

Pass criteria:
- completes without errors
- response shapes intact
- no PII leaks in logs

---

### 3.5 Performance & Load (V1 Minimal)
Key measurements:
- `/profile/birth` recompute latency (sync) or queue time (async)
- `/timing/today` p95 latency
- daily activation generation batch time

Targets (initial):
- p95 API latency < 500ms for reads
- recompute job completes < 30s for one user (V1)
- nightly batch completion within off-peak window

---

## 4) Fixture Strategy (The Backbone)

### 4.1 Fixture Set Requirements
Create 15–30 fixture birth profiles covering:
- multiple timezones (including DST boundaries)
- high-latitude locations
- leap years
- near-midnight times
- uncertain birth time use case (approx)
- known public figures (optional) used only as calculation check, not identity features

Each fixture includes:
- local datetime
- timezone
- lat/lon
- reference outputs from trusted sources (saved separately)

---

### 4.2 Reference Sources for Validation
For V1 validation, use at least two independent references where possible:
- Swiss Ephemeris direct outputs as ground truth for astronomy
- trusted astrology calculators for cross-check (Astro.com / Astro-Seek)
- Vedic calculators for sidereal + nakshatra cross-check
- Human Design chart calculators for gate/line/cross-check (once wheel mapping is implemented)
- BaZi calculators for four pillars cross-check (once calendar rules are implemented)

**Rule:** Any disagreement must be resolved by documented settings differences or treated as a bug.

---

## 5) Numeric Tolerances (Define Precision)
Because floating point and library differences exist, define tolerances:

- Planet longitude: ±0.01° (preferred) up to ±0.05° (max)
- Angles (Asc/MC): ±0.05° (preferred) up to ±0.10° (max)
- Nakshatra boundary: must be correct (no tolerance; boundaries must match)
- Aspect detection: stable within orb policies

All tolerances documented and enforced in tests.

---

## 6) Specific Test Plans by Engine

## 6.1 Canonical Birth Conversion
Tests:
- timezone parsing and DST correctness
- JD UT conversion against known values
- roundtrip: local → UTC → local equals original (within seconds)

Edge cases:
- ambiguous local times (DST fall-back hour)
- invalid timezone string
- invalid lat/lon bounds

---

## 6.2 Western Tropical Engine
Tests:
- planet longitudes match Swiss Ephemeris reference
- Whole Sign houses correct given Asc sign
- Asc/MC computed correctly
- sign and degree-in-sign derived fields correct
- serialization stable and consistent ordering (canonical JSON)

---

## 6.3 Vedic Sidereal Engine
Tests:
- sidereal mode set correctly (Lahiri)
- sidereal longitudes equal tropical - ayanamsa (as per swisseph setting)
- nakshatra mapping correct for Moon (and Sun if included)
- pada calculation correct for boundary conditions

---

## 6.4 Timing Engine (Daily Activations)
Tests:
- transit positions for a given date/time match Swiss Ephemeris
- aspect detection identifies correct aspects for fixture users
- orb policy applied correctly
- intensity scoring reproducible
- date alignment:
  - `/timing/today` respects user timezone display
  - stored `date_utc` consistent

---

## 6.5 Human Design Engine (When Implemented)
Tests:
- design moment solver converges to 88.00° solar offset within tolerance
- gate/line mapping matches reference charts for fixtures
- derived type/profile correct (especially Reflector rule)
- wheel mapping version pinned and tested

---

## 6.6 BaZi Engine (When Implemented)
Tests:
- Four Pillars match reference outputs for fixtures
- explicitly validated mode:
  - `standard_clock_time` V1 baseline
  - `true_solar_time` later enhancement with additional tests
- solar term boundary handling documented and tested

---

## 7) Non-Claims & Copy Safety Tests

### 7.1 UI Copy Rules (Static)
Maintain a restricted vocabulary list for interpretations (templates):
- allowed: “activation”, “correlate”, “reflect”, “pattern”, “consider”
- disallowed: “this will happen”, “you will meet”, “you will lose”, “guarantee”, “destined”

Implement:
- unit tests that scan template strings for banned phrases
- CI gate on banned phrasing

### 7.2 App Store Compliance Check
- Ensure disclaimers appear in onboarding and settings
- Ensure “not medical/legal/financial advice” is present

---

## 8) Security & Privacy QA

### 8.1 Data at Rest
- verify encryption on birth profile sensitive fields (where implemented)
- verify journal note encryption
- verify secrets are not logged

### 8.2 Access Control
- user cannot access another user’s profile/timing/journal
- token required for all endpoints except `/health`

### 8.3 Logging Hygiene
- do not log full birth inputs or journal note content
- mask email in logs where reasonable

---

## 9) Release Gates (Definition of “Safe to Ship”)

A release may ship only if:
- all unit tests pass
- golden fixture tests pass (or approved diffs + version bump)
- integration tests pass
- staging E2E smoke test passes
- non-claims scanning passes
- security checks pass (basic)

---

## 10) Operational Monitoring (Post-Launch)

Track:
- computation errors per engine (rate + top exceptions)
- daily activation job failures
- API latency p95
- user-facing error rates
- suspicious access patterns

Alert thresholds:
- any spike in 500s
- repeated recompute job failures
- drift detected in computed payloads for fixture accounts

---

## 11) Test Artifacts & Repo Structure
Recommended additions (when engineers implement):
- `/tests/unit/`
- `/tests/integration/`
- `/tests/fixtures/`
- `/tests/golden/` (golden JSON or hashes)
- `/scripts/validate_fixtures.py`
- `/scripts/nonclaims_scan.py`

---

## 12) Open Questions (Finalize Early)
1) Exact numeric tolerance standards (0.01° vs 0.05°) for each category.
2) Which two external references are considered authoritative per system.
3) Whether we store golden full JSON or stable hashes of canonicalized JSON.

---
