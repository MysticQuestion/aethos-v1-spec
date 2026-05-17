# BaZi Calculator Landscape Synthesis

## Purpose

This memo captures a quick market scan of free BaZi / Four Pillars calculators and translates the findings into Aethos V1 product guidance. It should be read alongside the Vedic landscape memo and the non-claims framework: BaZi can enrich the multi-system profile, but V1 should not become a fortune-telling, remedial, or life-prediction product.

Research date: 2026-05-11.

## Sources reviewed

The user-provided search list was reviewed alongside adjacent current search results. The most relevant examples for Aethos are:

| Source | Relevant observed positioning/capability | Product implication for Aethos |
| --- | --- | --- |
| [Janet Yung Free BaZi Calculator with Symbolic Stars](https://bazicalculator.janetyung.com/free-bazi-calculator/) | Free BaZi chart with Ming/Yun framing, luck cycles, and symbolic stars such as nobleman/intelligence/peach blossom. | Symbolic stars and luck cycles are common hooks, but they can quickly imply prediction; defer unless framed as non-deterministic reflection metadata. |
| [OpenBAZI](https://www.openbazi.com/chart) | Free personalized BaZi chart with AI analysis and Four Pillars/life-path/fortune language. | AI BaZi analysis is becoming common; Aethos should not compete by adding unconstrained AI fortune readings in V1. |
| [Master Sean Chan BaZi calculator](https://www.masterseanchan.com/wp-content/plugins/bazi-calculator-plugin/bazi-v3.html) | Four Pillars calculation to true solar time, with caution that solar-term boundaries can affect luck pillar age/sequence. | True solar time and solar-term boundary policy must be explicit and fixture-tested. |
| [Feng Shui in Motion BaZi Calculator](https://fsinmotion.com/bazi-calculator/) | Free basic Four Pillars chart using the Chinese solar / Hsia calendar. | Aethos should clearly identify the calendar basis and calculation mode, not just output stems/branches. |
| [Prokerala Chinese BaZi Calculator](https://www.prokerala.com/feng-shui/chinese-bazi-calculator.php) | BaZi chart with day pillar, luck pillar, and personality/self-understanding framing. | Day Master/day pillar is a useful V1 summary concept; luck pillar narratives should be deferred or carefully qualified. |
| [BaZi Hero on the App Store](https://apps.apple.com/app/bazi-hero/id1455210831) | Mobile app positioning around quick BaZi analysis, learning, rich insights, and algorithmic tools. | Aethos can compete on clarity and longitudinal journaling rather than complex expert-tool density. |
| [Master Tsai](https://www.mastertsai.com/) | Chinese Five Element / Four Pillars tooling and current commentary that AI chatbots may analyze charts but often fail to generate them correctly. | Calculation correctness is a defensible Aethos differentiator; generation must be deterministic before interpretation. |
| [FengShui.Geomancy.Net Free BaZi](https://freebazi.geomancy.net/) | Free report positioning around Chinese horoscope sign and personal BaZi element. | Lightweight beginner summaries are expected, but should not replace transparent chart facts. |
| [bazi-calculator.com](https://bazi-calculator.com/) | Mentions stem/branch interactions, symbolic stars, Na Yin, Qi phases, Day Master strength, and chart drawing. | Advanced interaction layers should be post-V1 unless directly tied to journaling insights. |
| [Your Chinese Astrology BaZi calculator](https://www.yourchineseastrology.com/calendar/bazi/) | Traditional Chinese calendar framing around heavenly stems and earthly branches. | Aethos UI needs plain-language education for stems/branches and the Day Master. |
| [Mystical Chi BaZi Calculator](https://mysticalchi.com/tools/bazi-calculator/) | Free chart generator with true solar time correction, Five Phases, and Ten Gods; notes that correction can change hour or day pillar. | Birth location and true solar time policy can materially affect outputs; show confidence and method metadata. |
| [LumiSaju BaZi Calculator](https://lumisaju.com/en/bazi-calculator) | Free BaZi calculator with true solar time correction and multi-system interpretation. | Solar-time correction is increasingly a user-facing quality signal. |
| [NAKSHATRA-style privacy pattern from Vedic landscape](13_VEDIC_CALCULATOR_LANDSCAPE.md) | Browser-local/privacy-first calculators show that users may compare privacy claims across symbolic systems. | BaZi data should inherit the same privacy guarantees as birth/journal data. |

## Market pattern synthesis

### 1) Free Four Pillars generation is commoditized

Most BaZi calculators generate year, month, day, and hour pillars from birth date/time/location. Aethos should not present basic Four Pillars generation as a standalone differentiator.

### 2) True solar time is a major correctness battleground

Several tools explicitly emphasize true solar time or Chinese solar calendar rules. This matters because hour-pillar and sometimes day-pillar results can change near boundaries. Aethos must document whether it uses clock time, local mean solar time, or true/apparent solar time, and whether solar-term boundaries come from a lookup table or astronomical calculation.

### 3) AI fortune analysis is rapidly becoming a default offer

OpenBAZI, LunarZodiac-style tools, and adjacent platforms pair BaZi charts with AI interpretation, career/love/wealth questions, luck-cycle forecasts, and “fortune” positioning. Aethos should resist unconstrained AI fortune readings in V1 and keep interpretation downstream of deterministic facts and compliance-safe copy.

### 4) Symbolic stars and luck cycles are common but high-risk for V1

Nobleman, Peach Blossom, Intelligence, luck pillars, annual forecasts, and day-master strength are common features. They may be useful later, but in V1 they risk shifting the product from structured self-reflection into deterministic advice or outcome prediction.

### 5) Beginner education is as important as chart density

BaZi outputs can be dense: Heavenly Stems, Earthly Branches, hidden stems, Ten Gods, Five Phases, Na Yin, Qi phases, symbolic stars, combinations, clashes, and luck pillars. Aethos should prioritize clear labels, provenance, and “what this field is” explanations over expert-only density.

### 6) BaZi can strengthen Aethos only if it remains part of the shared profile layer

The product opportunity is not “another BaZi calculator.” It is a cross-system symbolic profile where BaZi provides one deterministic lens that can be compared with journaling and timing metadata over time.

## Aethos V1 implications

### Keep BaZi V1 factual and mode-declared

V1 should include:

- Four pillars: year, month, day, and hour where birth time is known.
- Heavenly Stem and Earthly Branch for each computed pillar.
- Day Master / day stem as a concise profile summary.
- Five Phase / element labels for stems and branches.
- Calendar and solar-time policy metadata.
- Computation version and source tables/algorithm identifiers.
- Confidence flags when birth time, location, or solar-term boundary proximity may affect outputs.

V1 should avoid:

- Luck pillar narratives.
- Annual fortune forecasts.
- Career, wealth, marriage, health, fertility, or legal predictions.
- Remedial prescriptions, lucky colors, lucky directions, or talisman-style advice.
- “Peach Blossom” or relationship-star UI unless renamed/contextualized and compliance-reviewed.
- Day Master strength claims unless the formula is deterministic, documented, and fixture-tested.
- AI BaZi chat or “fortune advisor” positioning.

### Required BaZi metadata

Every BaZi payload should include:

```json
{
  "system": "bazi",
  "calendar_basis": "chinese_solar",
  "solar_time_policy": "declared_policy_name",
  "solar_terms_source": "declared_table_or_algorithm",
  "timezone_source": "iana_tzdb",
  "birth_time_confidence": "exact|approximate|unknown",
  "computation_version": "bazi-v1"
}
```

If birth time is unknown, Aethos should either omit the hour pillar or mark it as low-confidence; it should not silently invent an hour pillar.

### Recommended website copy guardrail

Use:

> Aethos includes a BaZi Four Pillars layer as symbolic profile context. It summarizes deterministic stem/branch patterns from birth data for reflection and journaling; it does not forecast fate or prescribe life decisions.

Avoid:

- “Discover your destiny.”
- “Find your future spouse/career/wealth luck.”
- “Know your fortune cycles.”
- “Fix your luck with remedies.”
- “AI master tells you what will happen.”

## BaZi V1 acceptance criteria

- BaZi calculation mode is declared in the product and payloads.
- True solar time / local solar time policy is explicitly documented before launch.
- Solar-term boundary fixtures are tested for at least three edge cases.
- Unknown birth time disables or qualifies the hour pillar.
- Day Master output is fixture-tested against at least three external calculators.
- Public copy passes the non-claims scan before launch.
- BaZi outputs can be linked to journal prompts without predictive wording.
