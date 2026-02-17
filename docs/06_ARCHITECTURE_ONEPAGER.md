# AETHOS V1 — ARCHITECTURE ONE-PAGER

## 0) Purpose
This document describes the V1 system architecture for **Aethos**: a symbolic analytics engine for timing intelligence and structured self-knowledge. It defines boundaries, responsibilities, data flow, and security posture so engineering can estimate, implement, and validate correctness.

---

## 1) Guiding Principles (Non-Negotiables)

### 1.1 Canonical Truth Source
All systems derive from a single canonical birth input:
- Local datetime + IANA timezone
- Geo coordinates (lat/lon) + place resolution metadata
- Converted to UTC + Julian Day (JD UT)

**Rule:** Every symbolic system computation must be reproducible from this canonical object.

### 1.2 Separation of Concerns (Three-Layer Engine)
Aethos separates:
1) **Calculation Layer** — deterministic math (ephemeris, calendars, gate mapping)
2) **Interpretation Layer** — language layer (non-deterministic phrasing; no event claims)
3) **Correlation Layer** — journaling + analytics (user-state signals correlated with activations)

### 1.3 Auditable Outputs
- Every computed artifact must include `version`, `source`, and `settings` (e.g., Lahiri vs other ayanamsa).
- Changes to algorithms require version bump and regression tests.

### 1.4 Privacy by Default
- Birth data is sensitive; store the minimum needed for V1.
- Encrypt at rest.
- Do not sell or share user data.

---

## 2) System Overview (Context Diagram)

**Client** (Web/Mobile-first) → **API** → **Engines** → **DB**

[Client UI]
|
| HTTPS (JWT)
v
[API Gateway / Backend]
|---- Auth + User
|---- Profile Builder (canonical birth)
|---- Calculation Engines
|---- Timing Engine (daily activations)
|---- Journal + Correlation
|
v
[PostgreSQL]
| tables: users, birth_profiles, system_profiles, daily_activations, journal_entries
v
[Object Storage Optional]
| future: exports, reports, images


---

## 3) Component Breakdown

## 3.1 Frontend (V1)
**Goal:** Fast onboarding → dashboard → daily activations → journal entry.

Recommended V1 approach:
- Responsive web app (mobile-first), deployable quickly.
- UI focuses on clarity, not theatrics.

Core UI modules:
- Onboarding: birth input + location search
- Dashboard: today’s activations + core signatures
- Journal: mood score + tags + note
- Profile: multi-system highlights (facts-first)

Frontend responsibilities:
- Form validation (not canonicalization)
- Session management
- Rendering of computed outputs
- Journal entry capture

---

## 3.2 Backend API (V1)
Recommended stack:
- Python + FastAPI (or equivalent)
- Postgres
- Swiss Ephemeris for astronomical computation
- Background job runner (Celery/RQ) for daily activation generation

Backend responsibilities:
- Canonical birth conversion (UTC/JD)
- Deterministic system computation
- Persistence of system layers
- Daily activation generation
- Journaling write + retrieval
- Minimal analytics endpoints for V1

---

## 4) Calculation Engines (Deterministic)

### 4.1 Western Tropical Engine
Inputs:
- `birth_profile` (UTC/JD, lat/lon)
Settings:
- House system: Whole Sign (V1)
Outputs:
- Planets (lon/lat, speed optional)
- Angles (Asc/MC/Desc/IC)
- Houses (Whole Sign sign-indexed)
- Optional: core aspects (natal-only)

### 4.2 Vedic Sidereal Engine
Inputs:
- canonical birth + planetary longitudes
Settings:
- Sidereal mode: Lahiri (V1)
Outputs:
- Sidereal longitudes (planets, angles)
- Nakshatra + pada for key points (Sun/Moon; optionally all planets)
- Optional later: Vimshottari scaffolding

### 4.3 Human Design Engine
Inputs:
- canonical birth + planetary longitudes (tropical)
Key requirement:
- Compute **design moment**: Sun longitude exactly 88° behind natal Sun longitude (root-find over JD)
Outputs (V1):
- Gate + line activations for key bodies (Sun/Earth/Moon + planets if desired)
- Derived: Type, Strategy, Authority, Profile (as available from implemented mapping)
Notes:
- Gate mapping must use canonical HD wheel mapping (not simple 360/64 binning).
- V1 can ship “activations + profile” first; centers/channels can be phased.

### 4.4 BaZi Engine
Inputs:
- canonical birth time + location
Settings:
- Mode declared explicitly in output:
  - `standard_clock_time` (fast V1 default) OR
  - `true_solar_time` (advanced; later)
Outputs:
- Four pillars (year/month/day/hour) stems/branches
- Day Master
- Optional later: 10-gods, luck pillars

### 4.5 Numerology Engine
Inputs:
- user name (optional) + birth date
Outputs:
- Life Path
- Expression (optional if name provided)
- Supporting numbers

---

## 5) Timing Engine (Daily Activations)

### 5.1 Purpose
Generate a daily set of “what’s active” signals:
- Transit-to-natal aspects
- Angle crossings (optional later)
- House activations (Whole Sign)
- Intensity scoring + confidence labeling

### 5.2 Inputs
- Current date/time (UTC)
- User natal profile (western tropical baseline)
- Ephemeris transit positions

### 5.3 Outputs
`daily_activations` object per user per day:
- list of activation events (planet, aspect, natal point, orb, intensity)
- summary (top 3 activations, overall intensity)
- metadata (engine version, orb policy, settings)

### 5.4 Scoring (V1)
Simple but consistent:
- Weight by:
  - aspect type (conjunction/opposition/square > trine/sextile)
  - orb tightness (smaller orb = higher intensity)
  - natal point importance (Sun/Moon/Asc/MC weighted higher)

---

## 6) Correlation + Journaling (V1)

### 6.1 Journal Entry Model
Fields:
- date (local + UTC normalized)
- mood score (1–10)
- tags (array)
- note (text)
- optional: energy score, sleep score (future)

### 6.2 Correlation (V1 Minimal)
V1 does not need “AI conclusions.” It needs:
- basic overlays:
  - mood vs intensity (day-level)
  - tag frequency during high-intensity windows

Future correlation engine can evolve into hypothesis testing and personalized patterns.

---

## 7) Data Model (Core Tables)

### 7.1 `users`
- id (uuid)
- email
- password_hash / oauth_id
- created_at

### 7.2 `birth_profiles`
- user_id (fk)
- local_datetime
- timezone
- utc_datetime
- jd_ut
- lat, lon
- place_label (city/region)
- birth_time_confidence (exact/approx/unknown)
- created_at

### 7.3 `system_profiles`
Stores per-system computed JSON blocks:
- user_id (fk)
- system_name (western_tropical / vedic_sidereal / human_design / bazi / numerology)
- payload_json (jsonb)
- version
- settings_json (jsonb)
- created_at

### 7.4 `daily_activations`
- user_id (fk)
- date_utc (YYYY-MM-DD)
- payload_json (jsonb)
- version
- created_at

### 7.5 `journal_entries`
- user_id (fk)
- date_local (YYYY-MM-DD)
- date_utc (YYYY-MM-DD)
- mood_score (int)
- tags (text[])
- note (text)
- created_at

---

## 8) API Surface (V1 Endpoints)

### Auth
- `POST /auth/signup`
- `POST /auth/login`
- `POST /auth/logout`

### Profile
- `POST /profile/birth` (create/update canonical birth profile; triggers recompute)
- `GET /profile/summary`
- `GET /profile/system/{system_name}`

### Timing
- `GET /timing/today`
- `GET /timing/range?start=YYYY-MM-DD&end=YYYY-MM-DD`

### Journal
- `POST /journal/entry`
- `GET /journal/entry?date=YYYY-MM-DD`
- `GET /journal/range?start=...&end=...`

### Settings
- `GET /settings`
- `POST /settings` (preferences: ayanamsa, display options, notification prefs)

---

## 9) Security, Privacy, Compliance

### 9.1 Data Security
- TLS everywhere
- Encrypt sensitive fields at rest (birth details, notes)
- Proper secrets management (no secrets in repo)
- Role-based access for admin tooling (future)

### 9.2 Privacy Posture (V1)
- No sale of user data
- Minimal analytics collection
- Clear user consent for any personalization features
- Export/delete requests supported in roadmap

### 9.3 Non-Claims (App Store / Ethical)
- Avoid deterministic event claims
- Present activations as reflective context
- Keep “medical/legal/financial” disclaimers explicit

---

## 10) Deployment & Operations (V1)

### 10.1 Environments
- dev
- staging
- production

### 10.2 Hosting
- Containerized backend (Docker)
- Managed Postgres
- CDN for frontend

### 10.3 Background Jobs
- Nightly “precompute daily activations”
- Recompute on profile updates
- Optional: notifications job (future)

---

## 11) Observability & QA

### 11.1 Logs & Metrics
- request logs + trace ids
- error monitoring (Sentry or equivalent)
- latency and DB query metrics

### 11.2 Regression Testing (Critical)
- Fixture birth profiles with expected outputs (hashes/golden JSON)
- Calculation engine unit tests (angles, houses, sidereal offsets, HD design-jd solver)
- “Same input → same output” enforced

---

## 12) Known Risks & Mitigations

### Risk: Incorrect Human Design gate mapping
Mitigation:
- Implement canonical wheel mapping table + regression tests against known public calculators.

### Risk: Timezone / historical DST inaccuracies
Mitigation:
- Use IANA timezone DB; store canonical UTC/JD; test fixtures across edge cases.

### Risk: Over-scope (too many systems too early)
Mitigation:
- V1 ships “facts + daily activations + journaling.”
- Defer advanced interpretive layers.

### Risk: Interpretation language crosses into prediction
Mitigation:
- Centralize copy rules in `docs/08_COMPLIANCE_NONCLAIMS.md`
- Lint-like review for phrasing in UI templates

---

## 13) V1 “Definition of Done”
V1 is considered complete when:
- User can onboard, generate multi-system profile, view today’s activations, and journal.
- Daily activations are consistent and reproducible.
- Data is stored securely and retrievable across sessions.
- Regression test suite passes on fixtures.
- Non-claims language is present and enforced in UI.

---
