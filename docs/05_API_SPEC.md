# AETHOS V1 — API SPEC

## 0) Purpose
This document specifies the V1 HTTP API surface for Aethos, including endpoint contracts, authentication, request/response shapes, errors, and conventions. V1 prioritizes:

- onboarding + canonical birth profile creation
- deterministic system profile retrieval
- daily timing activations retrieval
- journal entry CRUD (minimal)
- settings/preferences (minimal)

---

## 1) Conventions

### 1.1 Base URL
- `https://api.aethos.app/v1` (example)

### 1.2 Content Type
- Requests: `Content-Type: application/json`
- Responses: `application/json`

### 1.3 Authentication
- JWT bearer tokens (V1)
- Header:
  - `Authorization: Bearer <token>`

### 1.4 Idempotency
- `POST /profile/birth` should be idempotent for the current user (updates or creates canonical profile).

### 1.5 Versioning
- API version in URL path (`/v1`)
- Each computed payload includes `engine_version` in body.

---

## 2) Error Model

### 2.1 Standard Error Response
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Birth time is invalid.",
    "details": {
      "field": "local_time",
      "reason": "Expected HH:MM:SS"
    }
  }
}
2.2 Common Error Codes
VALIDATION_ERROR (400)

UNAUTHORIZED (401)

FORBIDDEN (403)

NOT_FOUND (404)

CONFLICT (409)

RATE_LIMITED (429)

INTERNAL_ERROR (500)

3) Auth Endpoints
3.1 Sign Up
POST /auth/signup

Request:

json
Copy code
{
  "email": "user@example.com",
  "password": "string"
}
Response (201):

json
Copy code
{
  "user": { "id": "uuid", "email": "user@example.com" },
  "token": "jwt_token_string"
}
Errors:

400 validation

409 email exists

3.2 Login
POST /auth/login

Request:

json
Copy code
{
  "email": "user@example.com",
  "password": "string"
}
Response (200):

json
Copy code
{
  "user": { "id": "uuid", "email": "user@example.com" },
  "token": "jwt_token_string"
}
Errors:

401 invalid credentials

3.3 Logout (Optional V1)
POST /auth/logout

Notes:

For JWT, logout can be client-side (delete token). Server can maintain a denylist later.

Response (200):

json
Copy code
{ "ok": true }
4) Profile Endpoints
4.1 Create/Update Birth Profile (Canonicalization)
POST /profile/birth
Auth: Required

Purpose:

Create or update the canonical birth profile.

Trigger recomputation of system profiles (sync for V1 or async job).

Request:

json
Copy code
{
  "local_datetime": "1991-11-06T17:43:00",
  "timezone": "America/Detroit",
  "location": {
    "lat": 41.9464,
    "lon": -86.3389,
    "place_label": "Berrien Springs, MI, USA",
    "place_source": "geocoder_v1"
  },
  "birth_time_confidence": "exact"
}
Response (200):

json
Copy code
{
  "birth_profile": {
    "local_datetime": "1991-11-06T17:43:00",
    "timezone": "America/Detroit",
    "utc_datetime": "1991-11-06T22:43:00Z",
    "jd_ut": 2448568.44653,
    "location": {
      "lat": 41.9464,
      "lon": -86.3389,
      "place_label": "Berrien Springs, MI, USA",
      "place_source": "geocoder_v1"
    },
    "birth_time_confidence": "exact"
  },
  "recompute": {
    "status": "queued",
    "job_id": "uuid",
    "systems": ["western_tropical","vedic_sidereal","human_design","bazi","numerology"]
  }
}
Notes:

If V1 is synchronous, recompute.status can be "completed" and omit job_id.

Errors:

400 invalid timezone or datetime

400 invalid lat/lon

401 unauthorized

4.2 Get Profile Summary
GET /profile/summary
Auth: Required

Response (200):

json
Copy code
{
  "birth_profile": {
    "local_datetime": "1991-11-06T17:43:00",
    "timezone": "America/Detroit",
    "utc_datetime": "1991-11-06T22:43:00Z",
    "jd_ut": 2448568.44653,
    "location": {
      "lat": 41.9464,
      "lon": -86.3389,
      "place_label": "Berrien Springs, MI, USA"
    },
    "birth_time_confidence": "exact"
  },
  "summary": {
    "core_identity": {
      "western": { "Sun": "Scorpio", "Moon": "Scorpio", "Asc": "Taurus" },
      "vedic": { "Moon_nakshatra": "Uttara Bhadrapada (Pada 3)" },
      "human_design": { "type": "Reflector", "profile": "1/3" },
      "bazi": { "day_master": "Yang Fire" }
    },
    "generated_at": "2026-02-16T21:10:00Z"
  },
  "system_status": {
    "western_tropical": "ready",
    "vedic_sidereal": "ready",
    "human_design": "ready",
    "bazi": "ready",
    "numerology": "ready"
  }
}
Errors:

404 if no birth profile exists (or return empty with onboarding_required=true)

4.3 Get Full System Profile
GET /profile/system/{system_name}
Auth: Required

Path params:

system_name ∈ western_tropical | vedic_sidereal | human_design | bazi | numerology

Response (200):

json
Copy code
{
  "system_name": "western_tropical",
  "payload": {
    "engine_version": "1.0.0",
    "computed_at": "2026-02-16T21:10:00Z",
    "settings": { "zodiac": "tropical", "house_system": "whole_sign" },
    "angles": { "Asc": { "lon": 49.12 }, "MC": { "lon": 298.65 } },
    "points": { "Sun": { "lon": 224.12 }, "Moon": { "lon": 210.65 } }
  }
}
Errors:

404 if system not computed yet

4.4 Recompute System Profiles (Optional V1)
POST /profile/recompute
Auth: Required

Request:

json
Copy code
{ "systems": ["human_design"] }
Response:

json
Copy code
{
  "status": "queued",
  "job_id": "uuid",
  "systems": ["human_design"]
}
5) Timing Endpoints
5.1 Get Today’s Activations
GET /timing/today
Auth: Required

Optional query params:

tz (IANA string) for display alignment (default user tz)

Response (200):

json
Copy code
{
  "date_utc": "2026-02-16",
  "date_local": "2026-02-16",
  "payload": {
    "engine_version": "1.0.0",
    "computed_at": "2026-02-16T08:00:00Z",
    "summary": {
      "overall_intensity": 0.62,
      "top_activations": [
        { "label": "Mars square Sun", "intensity": 0.78 },
        { "label": "Venus trine Moon", "intensity": 0.55 }
      ]
    },
    "events": [
      {
        "transit_body": "Mars",
        "natal_point": "Sun",
        "aspect": "square",
        "orb_deg": 1.42,
        "polarity": "hard",
        "intensity": 0.78,
        "confidence": "high"
      }
    ]
  }
}
Errors:

404 if no birth profile

404 if daily activations not computed (or compute on demand)

5.2 Get Activations Range
GET /timing/range?start=YYYY-MM-DD&end=YYYY-MM-DD
Auth: Required

Response (200):

json
Copy code
{
  "start": "2026-02-01",
  "end": "2026-02-16",
  "days": [
    {
      "date_utc": "2026-02-16",
      "summary": { "overall_intensity": 0.62, "top_activations": [] }
    },
    {
      "date_utc": "2026-02-15",
      "summary": { "overall_intensity": 0.40, "top_activations": [] }
    }
  ]
}
Notes:

Range response can return summaries only for performance; full payload per day can be fetched via GET /timing/day/{date} if needed.

5.3 Get Specific Day Activations (Optional)
GET /timing/day/{date_utc}
Auth: Required

Example:

/timing/day/2026-02-16

Response:

Same shape as /timing/today

6) Journal Endpoints
6.1 Create Journal Entry
POST /journal/entry
Auth: Required

Request:

json
Copy code
{
  "date_local": "2026-02-16",
  "mood_score": 6,
  "tags": ["work", "focus"],
  "note": "Felt pressure but stayed focused."
}
Response (201):

json
Copy code
{
  "entry": {
    "id": "uuid",
    "date_local": "2026-02-16",
    "date_utc": "2026-02-16",
    "mood_score": 6,
    "tags": ["work", "focus"],
    "created_at": "2026-02-16T21:15:00Z"
  }
}
Errors:

400 if mood_score out of range

409 if one-entry-per-day enforced and entry exists (or use upsert endpoint)

6.2 Get Journal Entry by Date
GET /journal/entry?date_local=YYYY-MM-DD
Auth: Required

Response (200):

json
Copy code
{
  "entry": {
    "id": "uuid",
    "date_local": "2026-02-16",
    "mood_score": 6,
    "tags": ["work","focus"],
    "note": "Felt pressure but stayed focused.",
    "created_at": "2026-02-16T21:15:00Z"
  }
}
Errors:

404 if not found

6.3 Update Journal Entry
PUT /journal/entry/{id}
Auth: Required

Request:

json
Copy code
{
  "mood_score": 7,
  "tags": ["work","focus","calm"],
  "note": "Better after midday."
}
Response (200):

json
Copy code
{ "ok": true }
6.4 List Journal Entries Range
GET /journal/range?start=YYYY-MM-DD&end=YYYY-MM-DD
Auth: Required

Response (200):

json
Copy code
{
  "start": "2026-02-01",
  "end": "2026-02-16",
  "entries": [
    { "date_local": "2026-02-16", "mood_score": 6, "tags": ["work"] },
    { "date_local": "2026-02-15", "mood_score": 5, "tags": ["rest"] }
  ]
}
7) Settings Endpoints (Minimal V1)
7.1 Get Settings
GET /settings
Auth: Required

Response:

json
Copy code
{
  "settings": {
    "display_timezone": "America/Detroit",
    "vedic_ayanamsa": "lahiri",
    "house_system": "whole_sign",
    "notifications": { "enabled": false }
  }
}
7.2 Update Settings
POST /settings
Auth: Required

Request:

json
Copy code
{
  "display_timezone": "America/Los_Angeles",
  "notifications": { "enabled": true, "time_local": "08:30" }
}
Response:

json
Copy code
{ "ok": true }
Notes:

house_system and ayanamsa changes may trigger recompute.

For V1, you can lock house system + ayanamsa and omit these fields if desired.

8) Internal/Operational Endpoints (Optional V1)
8.1 Health Check
GET /health
Response:

json
Copy code
{ "ok": true, "version": "api-v1" }
8.2 Job Status (if async recompute)
GET /jobs/{job_id}
Response:

json
Copy code
{
  "job_id": "uuid",
  "status": "running",
  "progress": 0.5,
  "started_at": "2026-02-16T21:11:00Z"
}
9) Authorization Rules (V1)
All profile, timing, journal, and settings endpoints require auth.

Users may only access their own resources.

Admin endpoints are not exposed in V1.

10) Open Questions (Confirm Before Implementation)
Synchronous vs async recompute on /profile/birth (recommended: async with job status; can fallback to sync).

Do we enforce one journal entry per day in V1? (recommended: yes).

Do we precompute daily activations nightly (recommended) or on-demand?

Do we allow any system settings changes in V1 or hard-lock them?
