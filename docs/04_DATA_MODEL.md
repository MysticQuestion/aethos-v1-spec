# 04_DATA_MODEL.md

## Aethos V1 – Data Model (Canonical Facts → Timing Events → Journal → Correlations)

---

# I. Purpose

This document defines the **minimum viable data model** for Aethos V1.

Aethos is not “content-first.”  
It is a **structured symbolic analytics system**.

The data model must support:

1. Deterministic computation from a single truth source (birth input)
2. Reproducible timing events (transits → natal)
3. Journaling + state tracking
4. Correlation summaries (descriptive, not causal)
5. Privacy separation between identity, birth facts, and reflective content

---

# II. Core Design Principles

## P1 — One Truth Source
Birth data is canonicalized once into:
- UTC
- Julian Day
- Lat/Lon
and then all systems compute from that.

## P2 — Facts are Immutable, Interpretations are Versioned
Computed facts (planet longitudes, aspects) are deterministic.
Interpretations and salience scoring are versioned.

## P3 — Separation of Concerns
- Identity/auth in one table
- Canonical birth facts separated
- Journaling encrypted
- Analytics logs user-deletable

## P4 — Minimal First, Expand Later
V1 stores only what is required to support:
Today → Journal → Weekly → Monthly.

---

# III. Entity Map (V1)

**User**
→ has one **BirthProfile**
→ generates many **TimingEvents**
→ writes many **JournalEntries**
→ receives many **CorrelationSummaries**
→ produces many **AnalyticsEvents** (telemetry)

---

# IV. Canonical Entities

## 1) users
Represents authentication identity.

**Fields**
- user_id (UUID, PK)
- email (unique)
- password_hash (or auth_provider_id)
- created_at (UTC)
- updated_at (UTC)
- status (active, paused, deleted)
- cohort_tag (string, optional)

**Notes**
- Do not store birth data in this table.
- Keep this table portable for auth migrations.

---

## 2) birth_profiles
The canonical truth source.

**Fields**
- profile_id (UUID, PK)
- user_id (UUID, FK users.user_id)
- full_name (optional)
- birth_date_local (YYYY-MM-DD)
- birth_time_local (HH:MM:SS or null if unknown)
- birth_time_confidence (exact, approximate, unknown)
- birthplace_raw (string user entered)
- birthplace_resolved (string normalized)
- lat (float)
- lon (float)
- tzid (IANA timezone string, e.g., "America/Detroit")
- utc_datetime (timestamp UTC)
- julian_day_ut (float)
- canonicalization_version (string)
- created_at (UTC)
- updated_at (UTC)

**Rules**
- If birth_time_confidence = unknown:
  - utc_datetime and julian_day_ut reflect noon local default OR null (choose one and document)
  - angles/houses disabled downstream
- Canonicalization version increments if timezone/geo rules change.

---

# V. Computed Facts Layer (Deterministic Output)

Aethos computes chart facts on demand, but V1 may cache them for speed.

## 3) chart_facts_cache (optional but recommended)
Stores deterministic computed placements so you don’t recompute constantly.

**Fields**
- facts_id (UUID, PK)
- profile_id (UUID, FK birth_profiles.profile_id)
- system (enum: western_tropical, vedic_sidereal)
- house_system (enum: whole_sign)
- computation_version (string)  # ephemeris flags + logic version
- payload (JSONB)              # packed points, houses, angles, etc.
- created_at (UTC)

**Payload shape (example)**
```json
{
  "points": {
    "Sun": {"lon": 224.123456, "lat": 0.0001, "speed": 0.98},
    "Moon": {"lon": 225.987654, "lat": 4.81, "speed": 13.2}
  },
  "angles": {"asc": 49.12, "mc": 298.44},
  "houses": {"sign_1": "Taurus", "sign_2": "Gemini", "...": "..."}
}
Notes

Facts are not “interpretations.”

Payloads are reproducible from canonical birth profile + computation_version.

VI. Timing Events Layer (Daily Engine Output)
4) timing_events

One row per event detected in a time window.

Fields

event_id (UUID, PK)

profile_id (UUID, FK birth_profiles.profile_id)

event_date_local (YYYY-MM-DD)

event_window_start_utc (timestamp)

event_window_end_utc (timestamp)

Core event attributes

transit_body (string, e.g., "Mars")

natal_point (string, e.g., "Sun", "Asc", "MC")

aspect_type (enum: conj, opp, sq, tri, sex)

orb_deg (float)

applying (bool)

hard_soft (enum: hard, soft)

natal_house (int 1–12, nullable if unknown time)

activated_house (int 1–12, nullable)

exactitude_utc (timestamp nullable; only when computed)

salience_score (int 0–100)

Versioning

timing_engine_version (string)

salience_model_version (string)

Purpose

Powers Today view ranking

Links into journal entries

Feeds correlation engine

VII. Journaling Layer (Encrypted Content + Structured Metrics)
5) journal_entries

Stores reflective entries + numeric state signals.

Fields

entry_id (UUID, PK)

user_id (UUID, FK users.user_id)

profile_id (UUID, FK birth_profiles.profile_id)

created_at_utc (timestamp)

created_at_local (timestamp)

timezone_at_entry (IANA string)

Quant signals

mood (int 1–10)

energy (int 1–10)

stress (int 1–10)

Text

text_encrypted (bytea or text)

encryption_version (string)

Tags / links

tag_list (text[] or JSONB)

linked_event_ids (UUID[])

Notes

Never store plaintext journal body.

Keep quant signals unencrypted for correlation computations (still private).

VIII. Correlation Summaries (Derived, Descriptive Only)
6) correlation_summaries

Stores computed weekly/monthly summaries.

Fields

summary_id (UUID, PK)

user_id (UUID, FK users.user_id)

profile_id (UUID, FK birth_profiles.profile_id)

period_type (enum: week, month)

period_start_local (YYYY-MM-DD)

period_end_local (YYYY-MM-DD)

generated_at_utc (timestamp)

correlation_engine_version (string)

payload (JSONB)

Payload shape (example)

{
  "entries_count": 14,
  "avg_mood": 6.4,
  "avg_stress": 7.1,
  "hard_aspects_days": 5,
  "soft_aspects_days": 3,
  "top_planets": [{"planet": "Mars", "count": 6}],
  "top_houses": [{"house": 7, "count": 8}],
  "associations": [
    {"label": "hard_aspects_vs_stress", "value": 0.22, "type": "descriptive"}
  ],
  "insight_density_score": 0.31
}


Language rule

Associations are labeled “descriptive”

Never claim causality

IX. Analytics Events (Telemetry)
7) analytics_events

Tracks product usage and computation events.

Fields

event_id (UUID, PK)

user_id (UUID, FK users.user_id)

profile_id (UUID nullable)

event_type (string)

payload (JSONB)

created_at_utc (timestamp)

event_version (string)

Examples

today_view_loaded

activation_detail_opened

journal_entry_created

weekly_summary_viewed

X. Minimal JSON Profile Output (App-facing)

The app consumes a profile JSON, built from canonical + cached facts.

V1 recommended output shape:

{
  "profile_id": "uuid",
  "canonical": {
    "utc_datetime": "1991-11-06T22:43:00Z",
    "julian_day_ut": 2448567.44653,
    "lat": 41.9464,
    "lon": -86.3389,
    "tzid": "America/Detroit",
    "birth_time_confidence": "exact"
  },
  "systems": {
    "western_tropical": { "facts_ref": "chart_facts_cache.facts_id" },
    "vedic_sidereal":   { "facts_ref": "chart_facts_cache.facts_id" }
  },
  "summary": {
    "house_system": "whole_sign",
    "notes": ["Aethos provides reflective timing intelligence; not deterministic prediction."]
  }
}

XI. Data Retention & Deletion Rules (V1)

User must be able to delete:

Journal entries (immediate hard delete)

Birth profile (hard delete)

Analytics logs (hard delete)

Entire account (cascading delete)

Retention defaults:

analytics_events: 12 months

correlation_summaries: indefinite (but deleted if user deletes account)

journal_entries: indefinite until user deletes

XII. Future Expansion Hooks (Not V1)

Planned later entities:

protocols (behavioral suggestions engine)

prompt_templates (journaling prompts)

multi-system facts (Human Design, Gene Keys, BaZi)

anonymized cohort benchmarks

V1 structure supports these without migration pain.

XIII. Engineering Notes (Implementation Choices)

Recommended DB: Postgres

Recommended types:

JSONB for payloads

arrays for linked_event_ids, tag_list

Encryption:

libsodium or KMS-managed envelope encryption

encryption_version stored per entry

Versioning:
Every compute layer stores its version string.

This prevents "silent changes" and preserves user trust.


Next move: do you want me to harden `05_API_SPEC.md` into an endpoint-by-endpoint contract that matches this model (including request/response JSON + error codes)?
::contentReference[oaicite:0]{index=0}
