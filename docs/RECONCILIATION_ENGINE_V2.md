# Aethos Reconciliation Engine v2

**Status:** Draft normative specification  
**Version:** `reconciliation-v2.0.0-draft.1`  
**Normative repository:** `MysticQuestion/aethos-v1-spec`

## 1. Purpose

Aethos Reconciliation Engine v2 converts verified, system-specific symbolic outputs into a transparent cross-system analysis without pretending that different traditions are interchangeable, independent, or empirically validated in the same way.

The engine MUST preserve provenance, calculation quality, semantic-mapping rationale, temporal scope, source dependence, uncertainty, disagreement, and methodological versioning. It MUST NOT use an LLM to calculate chart facts, assign weights, alter classifications, or silently repair missing evidence.

The engine has one central rule:

> Reconciliation operates on structured semantic claims derived from canonical source facts, not on free-text interpretations and not on raw symbolic tokens treated as independent votes.

## 2. Non-goals

Reconciliation v2 does not establish the empirical truth of astrology, Human Design, BaZi, numerology, Gene Keys, or other symbolic systems. It does not turn symbolic convergence into causal proof. It does not infer medical, legal, financial, psychiatric, safety, employment, or deterministic life outcomes.

The engine does not permit narrative models to manufacture source coverage. If a cell lacks sufficient independent evidence, it remains insufficient.

## 3. Processing pipeline

```text
Canonical Input
  -> Verified Source Fact
  -> Semantic Claim
  -> Atomic Dimension Effect
  -> Within-System Reduction
  -> Shared-Lineage Adjustment
  -> Cross-System Reconciliation
  -> Reconciliation Result
  -> Narrative Rendering
```

Each transition MUST be versioned and inspectable.

## 4. Required object model

### 4.1 Source Fact

A Source Fact is a deterministic or provider-verified output from one calculation system.

Examples:

- Western: `Mars 14.47 Scorpio`
- Vedic: `Moon in Vishakha, pada 2`
- Human Design: `Type = Reflector`
- Numerology: `Life Path = 1`
- BaZi: `Day Master = Geng Metal`

A Source Fact MUST include:

- source system
- source fact key and value
- canonical input reference
- calculation version
- calculation status
- calculation provenance
- input-quality metadata
- temporal scope
- evidence lineage

### 4.2 Semantic Claim

A Semantic Claim states what a methodology says a Source Fact means before numerical reconciliation occurs.

Example:

```json
{
  "claim_key": "hd.reflector.decision_observation",
  "source_system": "human_design",
  "source_fact_key": "type.reflector",
  "proposition": "Decision processes are conventionally modeled as observational and environmentally responsive.",
  "scope": "identity",
  "methodology_version": "aethos-hd-map-1.0.0",
  "mapping_rationale": "Reflector decision guidance emphasizes lunar-cycle observation rather than immediate commitment."
}
```

The proposition MUST remain bounded to the source methodology. It MUST NOT be phrased as an experimentally demonstrated psychological fact unless separate empirical evidence supports that statement.

### 4.3 Atomic Dimension Effect

A claim MAY map to one or more atomic dimensions. Each effect contains:

- dimension key
- direction in `[-1, 1]`
- magnitude in `[0, 1]`
- mapping confidence in `[0, 1]`
- contextual qualifiers
- methodology version
- rationale

The signed effect value MAY be represented as `direction * magnitude`, but implementations SHOULD retain direction and magnitude separately for auditability.

### 4.4 System Effect

Multiple effects from the same source system MUST be reduced before cross-system reconciliation. A Western chart is not permitted to gain extra voting power merely because the adapter emitted planets, signs, modalities, elements, houses, and aspects as separate objects.

Each `SystemEffect` represents the system's net contribution to one atomic dimension for one scope and one evaluation window.

### 4.5 Reconciliation Result

The engine produces one result per atomic dimension and MAY aggregate those atomic results into higher-level presentation groups.

The four initial presentation groups are:

1. **Pacing & Momentum**
2. **Boundary & Attachment**
3. **Processing & Epistemology**
4. **Form & Adaptation**

These are UI groups, not primitive mathematical axes.

## 5. Initial atomic dimension catalogue

The v2 baseline contains ten atomic dimensions:

| Key | Negative pole | Positive pole | Default presentation group |
| --- | --- | --- | --- |
| `initiation_tendency` | waits / responds | initiates / advances | Pacing & Momentum |
| `decision_latency` | rapid commitment | extended observation | Pacing & Momentum |
| `energy_pacing` | conservation / modulation | sustained exertion / acceleration | Pacing & Momentum |
| `autonomy_interdependence` | interdependent | autonomous | Boundary & Attachment |
| `boundary_permeability` | permeable / receptive | defended / selective | Boundary & Attachment |
| `affective_intensity` | low-intensity / regulated | high-intensity / amplified | Boundary & Attachment |
| `evidence_style` | intuitive / synthetic | analytic / explicit | Processing & Epistemology |
| `cognitive_abstraction` | concrete / situated | abstract / conceptual | Processing & Epistemology |
| `stability_adaptation` | stable / fixed | adaptive / variable | Form & Adaptation |
| `risk_appetite` | conservative | exploratory | Form & Adaptation |

These labels describe reconciliation coordinates, not universal psychological truths. Changes require a methodology version increment.

## 6. Temporal separation

Aethos MUST separate stable and time-varying signals.

### Identity scope

Examples:

- natal Western placements
- core Human Design properties
- natal BaZi structure
- foundational numerology
- stable Gene Keys profile elements

### Cycle scope

Examples:

- planetary transits
- Vedic dasha periods
- BaZi luck pillars
- personal year/month cycles
- Human Design transit activations

An Identity Result and a Cycle Result MUST be independently inspectable. A current Personal Year MUST NOT be counted as another vote about stable identity.

Every time-varying calculation MUST receive an explicit `evaluation_time` and `evaluation_timezone`. Production code MUST NOT use an implicit runtime clock such as `Date.now()` inside a deterministic calculation path.

## 7. Evidence lineage and source dependence

`source_system` is not sufficient to establish independence.

Every Source Fact MUST include an `evidence_lineage` identifier and MAY include one or more parent lineages.

Examples:

- `astronomical_birth_state`
- `western_tropical_projection`
- `vedic_sidereal_projection`
- `human_design_bodygraph`
- `gene_keys_from_human_design`
- `name_date_numerology`
- `bazi_calendar_projection`

### 7.1 Dependency rules

A child interpretation derived from another source MUST NOT count as an independent corroborating source.

Canonical example:

- Human Design gate/line activation
- Gene Keys sphere derived from the same activation

These MAY provide interpretive enrichment, but they MUST share a lineage penalty and MUST NOT independently satisfy a convergence threshold.

Western and Vedic astrology also share the same birth event and astronomical bodies. They remain distinct interpretive systems but SHOULD receive an independence adjustment when the compared claim is substantially driven by the same underlying planetary geometry.

## 8. Weight decomposition

The engine MUST NOT expose a single unexplained confidence weight.

For each System Effect, define the following components in `[0, 1]`:

- `input_integrity`
- `calculation_quality`
- `mapping_confidence`
- `contextual_relevance`
- `temporal_fit`
- `independence_factor`

The default effective weight is:

```text
effective_weight =
    input_integrity
  * calculation_quality
  * mapping_confidence
  * contextual_relevance
  * temporal_fit
  * independence_factor
```

Implementations MAY add versioned factors later, but MUST preserve the components independently in the result object.

### 8.1 Interpretation of components

`input_integrity` measures the quality/completeness of input facts, such as exact versus unknown birth time.

`calculation_quality` reflects verification status of the calculator or provider. Prototype approximations MUST receive lower values than fixture-verified production calculations.

`mapping_confidence` represents the maintainers' confidence in the semantic mapping from source fact to reconciliation dimension. This is methodological confidence, not empirical probability of truth.

`contextual_relevance` measures whether the source fact is relevant to the queried dimension and use case.

`temporal_fit` measures alignment between the effect's temporal scope and the requested evaluation window.

`independence_factor` reduces correlated evidence and derivative double-counting.

## 9. Within-system reduction

Before systems are compared, all eligible Atomic Dimension Effects from the same system, scope, dimension, and evaluation window MUST be reduced into one `SystemEffect`.

The reducer MUST satisfy the following invariant:

> Duplicating an identical source fact or semantic effect MUST NOT materially increase system influence.

Recommended baseline method:

1. Group effects by source system + dimension + scope.
2. De-duplicate identical `source_fact_id` and `claim_id` combinations.
3. Cluster strongly dependent effects that arise from the same symbolic object.
4. Compute a bounded system score using normalized weighted aggregation.
5. Cap total system influence before cross-system reconciliation.

The exact reducer algorithm MUST be separately versioned.

## 10. Cross-system statistics

For independent-or-adjusted System Effects `x_i` with effective weights `w_i`, compute:

```text
mu = sum(w_i * x_i) / sum(w_i)
```

and weighted heterogeneity:

```text
H = sum(w_i * (x_i - mu)^2) / sum(w_i)
```

Where possible, implementations SHOULD also compute:

- number of eligible systems
- number of independent lineages
- positive support mass
- negative support mass
- maximum single-system influence
- leave-one-source-out classification stability

A scalar mean MUST NOT erase strong opposing evidence. Therefore classification depends on both central tendency and heterogeneity.

## 11. Classification vocabulary

The normative v2 classification set is:

### `insufficient`
Not enough eligible evidence to classify.

### `single_source`
One eligible independent source lineage contributes materially. This can be meaningful but is not convergence.

### `convergence`
At least two sufficiently independent source lineages materially support a similar direction and heterogeneity is below the configured threshold.

### `mixed`
Evidence varies but does not form a strong polarity.

### `contextual_tension`
Strong directional difference exists and evidence suggests the claims may apply to different contexts, functions, stages, or time scales.

### `paradox`
Strong independent source lineages support opposing poles within the same scope/context and neither side can be responsibly reduced to a contextual distinction.

### `non_comparable`
The claims should not be placed on the same reconciliation coordinate without distorting their original meaning.

The term `agreement` is deprecated in v2 because it can imply factual verification. UI copy SHOULD use `convergence`.

## 12. Minimum evidence rules

A single source MUST NEVER produce `convergence`.

A derivative system and its parent lineage MUST NEVER, by themselves, satisfy the independent-source requirement for `convergence`.

Empty cells MUST remain empty or `insufficient`; the engine MUST NOT manufacture coverage.

Thresholds MUST be stored in a versioned policy object. No threshold may exist solely as an undocumented literal in UI code.

## 13. Confidence and quality display

The user-facing interface SHOULD NOT present one decimal such as `overall confidence 0.90` unless that number has a documented calibration model.

Instead, Aethos v2 exposes a quality panel with at least:

- Input integrity
- Calculation status
- Semantic mapping confidence
- Independent-source coverage
- Classification stability

Suggested labels:

- Low
- Moderate
- High
- Verified

If numeric values are shown, the UI MUST explain what each number represents.

## 14. Calculation verification states

Source Registry entries MUST use one of the following statuses:

- `prototype`
- `fixture_verified`
- `production_verified`
- `verified_external_provider`
- `withheld`
- `unavailable`

The label `computed` alone is insufficient because a value can be computed correctly, approximately, or incorrectly.

## 15. Narrative layer contract

Narrative generation is downstream of reconciliation.

A narrative model MAY:

- explain source convergence or disagreement
- translate technical results into readable prose
- propose reflective questions
- summarize provenance

A narrative model MUST NOT:

- calculate chart facts
- create missing source facts
- change scores or weights
- change classification
- claim causal proof
- suppress a documented contradiction
- convert symbolic indications into medical, legal, financial, psychiatric, emergency, or deterministic advice

Narrative input SHOULD contain:

- dominant claim
- strongest counterclaim
- classification
- system contributions
- independent-lineage count
- uncertainty notes
- withheld facts
- methodology versions
- reflective experiment/question

## 16. Invariants and adversarial tests

The v2 implementation MUST include automated tests for the following invariants:

1. **Duplicate invariance** — duplicating an identical effect does not materially strengthen convergence.
2. **Single-source rule** — one source cannot classify as convergence.
3. **Derivative lineage rule** — Human Design + Gene Keys derived from the same activation cannot alone classify as convergence.
4. **Opposition rule** — two strong independent opposite effects produce tension/paradox, not neutrality by averaging.
5. **Unknown-time degradation** — missing birth time lowers only calculations that require birth time.
6. **Non-comparability rule** — incompatible claims can be withheld from a shared dimension.
7. **Temporal isolation** — cycle signals do not alter identity classification.
8. **Explicit-time reproducibility** — identical inputs plus identical evaluation time produce identical results.
9. **Leave-one-source-out stability** — classification stability is reported when one source materially changes the result.
10. **No-LMM-math rule** — deterministic classification passes without any narrative-model call.
11. **Threshold versioning** — every classification threshold resolves to a named policy version.
12. **Calculation-status gating** — prototype calculators can be excluded from production reconciliation by policy.

## 17. Initial implementation policy

Until a system passes its domain fixture suite, its production eligibility is restricted.

Recommended v2 rollout:

- Western Astrology: eligible after canonical Swiss Ephemeris fixtures pass.
- Numerology: eligible after name/date normalization fixtures pass.
- Vedic: eligible for production reconciliation only after sidereal placements, nakshatra/pada, and approved dasha fixtures pass.
- BaZi: eligible after year/month/day/hour pillar boundary fixtures pass.
- Human Design: eligible after validated gate-wheel, design-time, center/channel, type, authority, and profile fixtures pass.
- Gene Keys: eligible only after official sphere-coordinate mappings are corrected and its Human Design dependency is represented in lineage metadata.

## 18. Presentation requirements

The existing 4 x 4 reconciliation interface MAY remain the primary user-facing view.

Each cell MUST be inspectable and SHOULD reveal:

- classification
- atomic dimensions summarized
- eligible systems
- independent lineage count
- source effects
- quality components
- strongest support and counter-support
- methodology version
- threshold policy version
- narrative explanation

The system SHOULD distinguish `source coverage` from `convergence` visually.

## 19. Versioning

The following MUST be independently versioned:

- canonical calculation schema
- per-system calculator
- semantic mapping catalogue
- atomic dimension catalogue
- within-system reducer
- lineage/dependence policy
- threshold/classification policy
- narrative prompt/template

Existing stored results MUST retain the versions under which they were produced. Results MUST NOT be silently recomputed and overwritten when methodology changes.

## 20. Governance

Changes to semantic mappings, lineage factors, thresholds, atomic dimensions, or production eligibility SHOULD require:

1. a documented rationale,
2. tests or fixtures,
3. a version increment,
4. review against representative profiles,
5. an entry in the methodology changelog.

## 21. Definition of done for v2 core

The v2 core is ready for product integration when:

- canonical schemas validate,
- at least Western + Numerology can emit Source Facts and Semantic Claims,
- within-system reduction passes duplicate-invariance tests,
- source-dependence metadata is active,
- classification tests pass,
- Identity and Cycle scopes are separated,
- quality components replace a single aggregate confidence number,
- the existing 4 x 4 UI can render the new result object without inventing missing evidence,
- narrative generation consumes but cannot mutate deterministic results.
