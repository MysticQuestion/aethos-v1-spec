# Aethos Engine Roadmap

## Engine principle

Aethos must separate calculation, interpretation, and lived correlation. The calculation layer produces deterministic, versioned facts. The interpretation layer turns those facts into bounded language with sources and confidence. The journal/calibration layer lets users compare symbolic timing with lived experience without implying causality.

## Current spec assets

- Canonical birth intake schema: `schemas/canonical/aethos.birth_intake.v1.json`
- Calculator config schema: `schemas/canonical/aethos.calc_config.v1.json`
- Timing event schema: `schemas/canonical/aethos.timing_event.v1.json`
- Insight object schema: `schemas/canonical/aethos.insight_object.v1.json`
- Report module schema: `schemas/canonical/aethos.report_module.v1.json`
- Python scaffolds for canonical chart, Human Design, Gene Keys, and timing events live under `src/aethos/`.

## Backend requirements by layer

### 1. Canonical birth service

Required capabilities:

- Parse birth date, optional birth time, birthplace, and current location.
- Resolve geocoding to latitude/longitude.
- Resolve IANA timezone for historical date/time.
- Convert local birth time to UTC and Julian Day UT.
- Store birth-time confidence: exact, approximate, unknown.
- Preserve original user input alongside canonical values.

Recommended tests:

- DST boundary births.
- Historical timezone changes.
- Unknown time charts.
- Coordinates at date-line and polar edge cases.

### 2. Astrology calculation service

Required capabilities:

- Swiss Ephemeris / pyswisseph-backed planetary longitudes.
- Tropical and sidereal zodiac support.
- Ayanamsa policy, starting with Lahiri for Vedic/sidereal outputs.
- House-system support: whole sign first, Placidus/equal optional.
- Planet and point selection from calculator config.
- Aspect detection with orb policy.
- Versioned calculation output.

Golden fixtures:

- At least 12 reference charts across timezones and hemispheres.
- Known ascendant/midheaven checks.
- Tropical/sidereal offset checks.
- Retrograde flag checks.

### 3. Vedic/Jyotisha layer

Required capabilities:

- Sidereal planetary placements.
- Nakshatra and pada for Moon and major points.
- Rashi chart baseline.
- Dasha timelines only after source review and fixture coverage.

Guardrails:

- Use precise terminology.
- Avoid flattening Jyotisha into generic astrology copy.
- Clearly disclose calculation settings.

### 4. Human Design layer

Required capabilities:

- Personality and design activations from correct birth/design times.
- Mandala-aware gate mapping.
- Gate + line for key planetary points.
- Bodygraph/type/profile only after validated rule tables are complete.

Current scaffold note:

- `src/aethos/calculators/human_design.py` intentionally raises until the gate wheel mapping is populated. Keep this fail-loud behavior; do not ship naive longitude binning.

### 5. BaZi / Four Pillars layer

Required capabilities:

- Year, month, day, and hour pillars.
- Solar-term based month boundary handling.
- Local time and timezone precision.
- Day master and elemental distribution.
- Luck pillars after the core pillars are fixture-tested.

Guardrails:

- Document whether the implementation uses exact solar terms or approximations.
- Do not present approximated pillars as final.

### 6. Numerology layer

Required capabilities:

- Pythagorean and Chaldean mappings.
- Life Path, Birthday, Expression, Vowels/Inner, Consonants/Outer, and Personal Year.
- Master number policy for 11, 22, and 33.
- Input sanitization for punctuation, diacritics, and empty names.

### 7. Tarot / divination layer

Required capabilities:

- Local card draw that works without network or auth.
- Upright/reversed state.
- Daily pull and three-card spread.
- Optional interpretation service via Supabase Edge Function.
- Calm fallback text: “The interpretation service is unavailable. Your card draw is still shown below.”

Guardrails:

- No fear-based language.
- No medical/legal/financial advice.
- Interpretation should support inquiry, not command action.

### 8. Timing intelligence service

Required capabilities:

- Daily timing feed.
- Transit windows with start, peak, and end dates.
- Exact hits.
- Confidence scores.
- User-configurable alert preferences.
- Calendar view and monthly/year-ahead digest outputs.
- Journal correlation without causal claims.

Infrastructure needed:

- Event-window calculation service.
- Background queue.
- Timing windows table.
- Notification provider.
- User preferences table.
- Cache keyed by profile, config, and date range.

### 9. Reports service

Required capabilities:

- Natal report.
- Aethos synthesis report.
- Vedic, BaZi, Human Design, Gene Keys, Numerology, and Astrocartography report templates.
- Monthly and year-ahead timing reports.
- Relationship synastry report.
- Decision brief.
- Practitioner session prep.
- PDF/JSON export.

Needed:

- Deterministic chart snapshot.
- Interpretation retrieval with source IDs.
- LLM synthesis with citations and versioned prompts where used.
- Report storage and versioning.
- PDF renderer and export UI.

## API contract priorities

1. `POST /v1/intake/normalize`
2. `POST /v1/charts/calculate`
3. `GET /v1/profiles/{profile_id}`
4. `GET /v1/timing/daily`
5. `GET /v1/timing/windows`
6. `POST /v1/journal/entries`
7. `POST /v1/reports/generate`
8. `GET /v1/reports/{report_id}`
9. `POST /v1/divination/interpret`

## Operational requirements

- Version all calculation settings and interpretation templates.
- Cache deterministic calculations.
- Store confidence and data-quality notes.
- Add RLS policies before production user data is stored.
- Provide export/delete for birth profiles, journal entries, reports, and calibration records.
