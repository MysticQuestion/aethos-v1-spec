# AETHOS V1 — DATA MODEL

## 0) Purpose
This document defines the **canonical data contract** for Aethos V1: the objects we store, the JSON payload shapes, versioning rules, and examples. It is designed to be:

- deterministic and auditable (calculation outputs)
- safe and compliant (privacy + non-claims)
- stable for engineers (clear interfaces)
- extensible (new systems and features without breaking old data)

---

## 1) Design Principles

### 1.1 Canonical Birth Source
All symbolic systems derive from **one** canonical birth object:
- local datetime + timezone
- geocoded coordinates
- canonical UTC + JD UT

**Rule:** Every system layer must be reproducible from these canonical fields + explicit settings.

### 1.2 Layered System Outputs
Each symbolic system is stored as its own JSON layer:
- `western_tropical`
- `vedic_sidereal`
- `human_design`
- `bazi`
- `numerology`

Downstream modules (timing, journaling, protocols) consume a **unified profile view**, but the stored truth remains separated by system.

### 1.3 Version Everything
Every computed payload includes:
- `engine_version` (semantic version)
- `settings` (e.g., house system, ayanamsa, HD wheel mapping version)
- `computed_at` timestamp (UTC)

### 1.4 Privacy Default
- Birth profile is sensitive.
- Journal notes are sensitive.
- Store minimum required for V1, encrypt at rest.

---

## 2) Core Entities (Conceptual)

### 2.1 User
Represents a human account.

### 2.2 BirthProfile (Canonical)
Truth-source for all deterministic computations.

### 2.3 SystemProfile (Per-system JSON)
Computed “facts layer” for each symbolic system.

### 2.4 DailyActivation
Daily timing events generated from transits and natal profile.

### 2.5 JournalEntry
User-provided reflection signals.

---

## 3) Database Tables (V1)

Recommended database: PostgreSQL with JSONB for system payloads.

### 3.1 `users`
**Fields**
- `id` (UUID, PK)
- `email` (unique)
- `password_hash` (or oauth fields)
- `created_at` (timestamp)
- `updated_at` (timestamp)

**Notes**
- Keep auth separate from symbolic data.
- Support OAuth later without schema pain.

---

### 3.2 `birth_profiles`
**Fields**
- `id` (UUID, PK)
- `user_id` (UUID, FK → users.id)
- `local_datetime` (timestamp, no tz)
- `timezone` (IANA tz string, e.g., `America/Detroit`)
- `utc_datetime` (timestamp with tz)
- `jd_ut` (double precision)
- `lat` (double precision)
- `lon` (double precision)
- `place_label` (text; human readable)
- `place_source` (text; provider name, optional)
- `birth_time_confidence` (enum: `exact | approx | unknown`)
- `created_at`, `updated_at`

**Notes**
- `jd_ut` is the canonical numeric time anchor for all engines.
- `birth_time_confidence` informs UX and interpretation confidence.
- `place_label` is display only; compute from lat/lon.

---

### 3.3 `system_profiles`
Stores one row per system per user.

**Fields**
- `id` (UUID, PK)
- `user_id` (UUID, FK)
- `system_name` (text; constrained to known names)
- `engine_version` (text; e.g., `1.0.0`)
- `settings_json` (jsonb)
- `payload_json` (jsonb)
- `computed_at` (timestamp with tz)

**Indexes**
- unique: (`user_id`, `system_name`) — latest only, V1
  - or allow history later with (`user_id`,`system_name`,`computed_at`)

---

### 3.4 `daily_activations`
**Fields**
- `id` (UUID, PK)
- `user_id` (UUID, FK)
- `date_utc` (date)
- `engine_version` (text)
- `settings_json` (jsonb)  — orb rules, aspect list, weighting
- `payload_json` (jsonb)
- `computed_at` (timestamp with tz)

**Indexes**
- unique: (`user_id`, `date_utc`)

---

### 3.5 `journal_entries`
**Fields**
- `id` (UUID, PK)
- `user_id` (UUID, FK)
- `date_local` (date)
- `date_utc` (date) — derived; for correlation alignment
- `mood_score` (int; 1–10)
- `tags` (text[] or jsonb)
- `note` (text) — encrypt at rest
- `created_at`, `updated_at`

**Indexes**
- (`user_id`, `date_local`) unique or not (decide: one entry per day in V1 is simplest)

---

## 4) Canonical JSON Contracts

This section defines the JSON payload shapes stored inside `system_profiles.payload_json` and `daily_activations.payload_json`.

---

## 4.1 BirthProfile JSON (API Return Shape)
This is the canonical object returned by `GET /profile/summary`.

```json
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
  }
}
4.2 Shared Primitive Types
4.2.1 Point (Planet/Angle) Object
json
Copy code
{
  "name": "Sun",
  "lon": 224.123456,
  "lat": -0.000012,
  "speed_lon": 0.985647,
  "sign": "Scorpio",
  "sign_index": 7,
  "deg_in_sign": 14.123456
}
4.2.2 Aspect Object (Natal or Transit)
json
Copy code
{
  "transit_body": "Mars",
  "natal_point": "Sun",
  "aspect": "square",
  "exact_angle": 90,
  "orb_deg": 1.42,
  "polarity": "hard",
  "intensity": 0.78,
  "confidence": "high"
}
4.2.3 Engine Metadata
Included in every system payload and activations payload:

json
Copy code
{
  "engine_version": "1.0.0",
  "computed_at": "2026-02-16T21:10:00Z",
  "settings": { "house_system": "whole_sign" }
}
5) System Payload Shapes
5.1 Western Tropical (system_name = western_tropical)
Minimum V1 shape (facts-only, no interpretive prose):

json
Copy code
{
  "engine_version": "1.0.0",
  "computed_at": "2026-02-16T21:10:00Z",
  "settings": {
    "zodiac": "tropical",
    "house_system": "whole_sign",
    "ephemeris": "swisseph"
  },
  "angles": {
    "Asc": { "lon": 49.123456, "sign": "Taurus", "deg_in_sign": 19.123456 },
    "MC":  { "lon": 298.654321, "sign": "Capricorn", "deg_in_sign": 28.654321 }
  },
  "points": {
    "Sun":   { "lon": 224.123456, "sign": "Scorpio", "deg_in_sign": 14.123456 },
    "Moon":  { "lon": 210.654321, "sign": "Scorpio", "deg_in_sign": 0.654321 },
    "Mercury":{ "lon": 215.111111, "sign": "Scorpio", "deg_in_sign": 5.111111 }
  },
  "houses": {
    "system": "whole_sign",
    "asc_sign": "Taurus",
    "house_signs": {
      "1": "Taurus",
      "2": "Gemini",
      "3": "Cancer",
      "4": "Leo",
      "5": "Virgo",
      "6": "Libra",
      "7": "Scorpio",
      "8": "Sagittarius",
      "9": "Capricorn",
      "10": "Aquarius",
      "11": "Pisces",
      "12": "Aries"
    }
  }
}
Notes

points can include all planets later; V1 can ship core luminaries + personal planets first if needed.

angles are essential for house alignment and timing.

5.2 Vedic Sidereal (system_name = vedic_sidereal)
V1 includes placements + nakshatra/pada for Sun/Moon at minimum.

json
Copy code
{
  "engine_version": "1.0.0",
  "computed_at": "2026-02-16T21:10:00Z",
  "settings": {
    "zodiac": "sidereal",
    "ayanamsa": "lahiri",
    "ephemeris": "swisseph"
  },
  "points": {
    "Sun":  { "lon": 200.456789, "sign": "Libra", "deg_in_sign": 20.456789 },
    "Moon": { "lon": 341.987654, "sign": "Pisces", "deg_in_sign": 11.987654 }
  },
  "nakshatras": {
    "Sun":  { "name": "Vishakha", "pada": 2 },
    "Moon": { "name": "Uttara Bhadrapada", "pada": 3 }
  }
}
5.3 Human Design (system_name = human_design)
V1 shape prioritizes:

design-time solver metadata

gate/line activations for key bodies

derived type/profile if implemented

json
Copy code
{
  "engine_version": "1.0.0",
  "computed_at": "2026-02-16T21:10:00Z",
  "settings": {
    "design_sun_offset_deg": 88.0,
    "wheel_mapping_version": "hd_wheel_v1",
    "ephemeris": "swisseph",
    "zodiac_basis": "tropical"
  },
  "design_moment": {
    "jd_ut": 2448480.12345,
    "utc_datetime": "1991-08-09T02:57:00Z",
    "solver": {
      "method": "bracket+bisection",
      "tolerance_deg": 0.01,
      "iterations": 42
    }
  },
  "personality": {
    "Sun":   { "gate": 44, "line": 3, "lon": 224.123456 },
    "Earth": { "gate": 24, "line": 3, "lon": 44.123456 },
    "Moon":  { "gate": 1,  "line": 2, "lon": 210.654321 }
  },
  "design": {
    "Sun":   { "gate": 1,  "line": 3, "lon": 136.123456 },
    "Earth": { "gate": 2,  "line": 3, "lon": 316.123456 }
  },
  "derived": {
    "type": "Reflector",
    "strategy": "Wait a Lunar Cycle",
    "authority": "Lunar",
    "profile": "1/3",
    "confidence": {
      "type": "high",
      "reason": "no defined centers (reflector rule)"
    }
  }
}
Notes

Do not ship bogus gate mapping. Use canonical wheel mapping.

derived can be phased; V1 may ship activations first if needed.

5.4 BaZi (system_name = bazi)
V1 includes Four Pillars + declared mode.

json
Copy code
{
  "engine_version": "1.0.0",
  "computed_at": "2026-02-16T21:10:00Z",
  "settings": {
    "mode": "standard_clock_time",
    "calendar_basis": "jieqi_solar_terms",
    "location_included": true
  },
  "pillars": {
    "year":  { "stem": "Xin", "branch": "Wei", "element": "Metal", "animal": "Goat" },
    "month": { "stem": "Wu",  "branch": "Xu",  "element": "Earth", "animal": "Dog" },
    "day":   { "stem": "Bing","branch": "Zi",  "element": "Fire",  "animal": "Rat" },
    "hour":  { "stem": "Ding","branch": "You", "element": "Fire",  "animal": "Rooster" }
  },
  "day_master": { "stem": "Bing", "element": "Yang Fire" }
}
Notes

Pillar values above are example placeholders; actual computation must be validated.

Explicitly store mode to prevent disputes and allow upgrades later.

5.5 Numerology (system_name = numerology)
V1 includes birth-date derived numbers; name-based numbers optional.

json
Copy code
{
  "engine_version": "1.0.0",
  "computed_at": "2026-02-16T21:10:00Z",
  "settings": {
    "system": "pythagorean",
    "name_included": false
  },
  "birth": {
    "life_path": 1,
    "birth_day": 6
  },
  "name": null
}
6) Unified Profile Summary (API Convenience)
The API can present a summary view composed from system layers:

json
Copy code
{
  "summary": {
    "core_identity": {
      "western": { "Sun": "Scorpio", "Moon": "Scorpio", "Asc": "Taurus" },
      "vedic": { "Moon_nakshatra": "Uttara Bhadrapada (Pada 3)" },
      "human_design": { "type": "Reflector", "profile": "1/3" },
      "bazi": { "day_master": "Yang Fire" }
    },
    "non_claims_version": "v1",
    "generated_at": "2026-02-16T21:10:00Z"
  }
}
Important

This summary is derived; the truth lives in system layers.

7) Daily Activations Payload (daily_activations.payload_json)
json
Copy code
{
  "engine_version": "1.0.0",
  "computed_at": "2026-02-16T08:00:00Z",
  "settings": {
    "aspects": ["conjunction","opposition","square","trine","sextile"],
    "orb_policy_deg": {
      "luminaries": 8.0,
      "personal": 6.0,
      "outer": 4.0,
      "angles": 3.0
    },
    "scoring": { "hard_weight": 1.0, "soft_weight": 0.7 }
  },
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
      "exact_angle": 90,
      "orb_deg": 1.42,
      "polarity": "hard",
      "intensity": 0.78,
      "confidence": "high"
    }
  ]
}
8) Journal Entry API Shape
Request:

json
Copy code
{
  "date_local": "2026-02-16",
  "mood_score": 6,
  "tags": ["work", "social", "anxiety"],
  "note": "Felt pressure but stayed focused."
}
Stored object:

json
Copy code
{
  "id": "uuid",
  "date_local": "2026-02-16",
  "date_utc": "2026-02-16",
  "mood_score": 6,
  "tags": ["work", "social", "anxiety"],
  "created_at": "2026-02-16T21:15:00Z"
}
9) Versioning & Migration Rules
9.1 Engine Versions
Every system payload includes engine_version.

If computation logic changes, increment version and recompute.

9.2 Settings Must Persist
Settings are stored alongside payloads so historical outputs are interpretable:

house system

ayanamsa

HD wheel mapping version

BaZi mode

9.3 Forward Compatibility
New fields can be added at any time.

Breaking changes require a new version and a migration note.

10) Data Quality & Validation (V1)
10.1 Canonicalization Checks
Ensure timezone resolves to IANA string.

Ensure UTC datetime and JD UT roundtrip consistently.

Ensure lat/lon within valid bounds.

10.2 Deterministic Testing
Maintain fixtures:

a set of known birth profiles

expected hashes of output JSON blocks

regression tests to detect drift


