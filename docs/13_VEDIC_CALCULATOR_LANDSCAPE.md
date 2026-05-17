# Vedic Calculator Landscape Synthesis

## Purpose

This memo captures a quick market scan of free Vedic/Jyotish chart calculators and translates the findings into Aethos V1 product guidance. It is meant to be absorbed into the Aethos spec without expanding V1 beyond the existing core promise: deterministic symbolic timing context + structured reflection + non-predictive journaling.

Research date: 2026-05-11.

## Sources reviewed

The user-provided search list was reviewed alongside adjacent current search results. The most relevant examples for Aethos are:

| Source | Relevant observed positioning/capability | Product implication for Aethos |
| --- | --- | --- |
| [Prokerala Lagna Chart](https://www.prokerala.com/astrology/birth-chart/lagna-chart.php) | Free Vedic birth chart with North Indian and South Indian chart formats. | Chart-format rendering is table stakes, not differentiation. |
| [AstroSage Birth Chart](https://www.astrosage.com/freekphorary/instantchart.asp) | Kundli calculator built around date, exact time, and birthplace; copy leans into planetary impact and predictions. | Aethos should avoid “prediction” framing and emphasize auditable calculation + reflection. |
| [Shamans Market Vedic Astrology Calculator](https://www.shamansmarket.com/pages/vedic-astrology-calculator) | Simple Vedic calculator page branded around sidereal/Lahiri usage. | Simple input UX is expected; Aethos should keep onboarding lightweight. |
| [Astro-Seek Sidereal Calculator](https://horoscopes.astro-seek.com/sidereal-astrology-chart-calculator) | Sidereal birth, transit, solar return, synastry, ayanamsa and house-system controls. | Advanced settings are common for power users but should be hidden or constrained in V1. |
| [Astro-Seek Kundli Calculator](https://horoscopes.astro-seek.com/kundli-free-janam-kundali-online-calculator) | Rasi/Lagna, Navamsa D9, Shodasha Varga D1-D60, Panchanga, Arudha Lagna, Karakas, Yogi points, ayanamsas. | Full Jyotish feature breadth is easy to overbuild; Aethos should defer vargas/dashas beyond V1 unless tied to journaling. |
| [Astro-Seek Nakshatra Calculator](https://horoscopes.astro-seek.com/nakshatra-vedic-astrology-online-calculator) | Explains nakshatras as 27 equal 13°20′ lunar mansions and surfaces Moon/nakshatra calculation. | Moon nakshatra is a strong V1 anchor because it is comprehensible and technically bounded. |
| [VedicAstroBot](https://www.vedicastro.bot/tools/natal-chart) | Free chart generation with planetary positions, houses, nakshatras, divisional charts, Vimshottari/Narayana dashas, and AI report synthesis. | AI interpretation is becoming common; Aethos should differentiate through auditability and user-owned reflection, not “AI astrologer” novelty. |
| [VedicMarga](https://in.vedicmarga.com/) | Free Vedic birth chart, AI astrology chat, daily transits, and current dasha period. | Vedic apps increasingly pair charts with chat; Aethos should remain calculation-first until retention proves interpretation demand. |
| [Vedaansh](https://vedaansh.com/) | Free Kundali with Swiss Ephemeris, Lahiri ayanamsha, all 41 varga charts, Vimshottari/Yogini dasha, Panchang, Shadbala, Ashtakavarga, Jaimini, KP, matching. | Some competitors use “complete/free” breadth as the hook; Aethos should compete on coherence, privacy, longitudinal tracking, and non-claims. |
| [NAKSHATRA](https://www.ournakshatra.com/) | Free browser-local Vedic chart, D1-D60, Vimshottari, matching, Panchang, Muhurat, transits; privacy-first local calculation. | Privacy-first computation is now a competitive claim; Aethos must make privacy concrete, not decorative. |
| [AstrologyNow North Indian Chart](https://www.innerknowing.yoga/northindianchart) | North Indian chart education, chart input, and interpretive learning resources. | Educational scaffolding matters for novice comprehension. |
| [vedicastrology.us.com chart page](https://www.vedicastrology.us.com/index.php/about-mickey/about-vedic-astrology/calculate-your-vedic-astrology-chart/) and [Two Zodiacs explainer](https://www.vedicastrology.us.com/index.php/about-mickey/about-vedic-astrology/the-two-zodiacs) | Free chart embed and clear sidereal-vs-tropical explanation. | Aethos should explain the sidereal/tropical difference plainly and record ayanamsa in every payload. |

## Market pattern synthesis

### 1) Free chart generation is commoditized

Most examples provide free birth-chart generation from date, time, and birthplace. Many include at least planetary positions, houses, nakshatra data, and one or more chart styles. Aethos should not position “free Vedic chart calculator” as the core differentiation.

### 2) Feature breadth is the dominant competitor pattern

The more advanced tools compete by adding D9/Navamsa, D1-D60 vargas, Vimshottari dasha, Jaimini, KP, Ashtakavarga, Shadbala, Panchang, Muhurat, matching, and AI chat. This creates a breadth trap for Aethos: matching every Jyotish feature would dilute V1 and delay the core timing+journaling loop.

### 3) Lahiri/sidereal transparency is expected

Several tools explicitly name sidereal/Lahiri or expose ayanamsa controls. Aethos must treat `ayanamsa`, zodiac mode, ephemeris version, and computation version as first-class metadata in outputs.

### 4) AI astrologer positioning is increasingly common

VedicMarga and VedicAstroBot make AI interpretation/chat part of the offer. Aethos should avoid racing toward a generalized AI astrologer in V1. If AI summaries are introduced later, they must remain downstream of deterministic facts and compliance-safe language.

### 5) Predictive and destiny-oriented copy is common

Many calculator pages use language around predictions, destiny, life events, or exact guidance. This is an opening for Aethos: keep the product emotionally safer and more credible by framing Jyotish outputs as symbolic timing metadata for reflection.

### 6) Privacy is emerging as a differentiator

NAKSHATRA’s browser-local positioning shows that privacy-first claims are already in-market. Aethos should be specific: no data sale/brokering, encryption for birth and journal data, export/delete paths, and minimal analytics.

## Aethos V1 implications

### Keep Vedic V1 narrow and auditable

V1 should include:

- Sidereal planetary placements using Lahiri by default.
- Moon nakshatra and pada.
- Sun nakshatra and pada if already in scope.
- Rasi/house placement metadata where birth time is known.
- Output metadata for ayanamsa, ephemeris, timezone source, and computation version.

V1 should avoid:

- Full D1-D60 varga UI.
- Dasha prediction narratives.
- Muhurat/electional advice.
- Remedial prescriptions.
- Medical, legal, financial, marriage, or deterministic event predictions.
- AI “ask an astrologer” positioning.

### Vedic should support the Aethos loop, not become a standalone Kundli clone

The Vedic layer should serve the core Aethos loop:

1. Canonical birth profile.
2. Deterministic system facts.
3. Daily timing activations.
4. Reflection prompt.
5. Journal entry.
6. Descriptive correlation summary.

Do not add a Vedic feature unless it improves one of those steps.

### Recommended website copy guardrail

Use:

> Aethos includes a Vedic sidereal layer for symbolic self-reflection, including Lahiri-based placements and nakshatra context. It does not predict events or prescribe life decisions.

Avoid:

- “Get your Kundli predictions.”
- “Unveil your destiny.”
- “Know what will happen.”
- “Accurate life/marriage/career predictions.”
- “AI astrologer gives exact guidance.”

## Vedic V1 acceptance criteria

- Every Vedic payload includes `zodiac: sidereal`, `ayanamsa: Lahiri`, `ayanamsa_value_deg`, `ephemeris_version`, and `computation_version`.
- Moon nakshatra/pada is fixture-tested against at least three external calculators.
- Unknown birth time disables or qualifies houses/lagna-dependent outputs.
- UI labels distinguish Vedic sidereal placements from Western tropical placements.
- Public copy passes the non-claims scan before launch.
- Vedic outputs can be linked to journal prompts without predictive wording.
