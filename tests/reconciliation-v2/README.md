# Reconciliation Engine v2 — Invariant Test Suite

This directory defines the minimum adversarial behavior required before Reconciliation Engine v2 can be integrated into the Aethos product UI.

These tests are methodology tests, not validations of metaphysical truth. They verify that the engine behaves consistently, transparently, and according to the v2 specification.

## Required harness behavior

A test harness MUST:

1. Load a named policy version.
2. Ingest semantic claims or pre-reduced system effects.
3. Apply within-system reduction.
4. Apply lineage/dependence adjustments.
5. Compute deterministic reconciliation statistics.
6. Return a result conforming to `schemas/canonical/aethos.reconciliation_result.v2.json`.
7. Perform no LLM call.
8. Compare the result to expected invariants.

## Test cases

### R2-001 — Duplicate invariance

**Purpose:** prevent an adapter from gaining influence by emitting the same fact repeatedly.

Input A:

- Western `initiation_tendency = +0.70`, effective pre-reduction support `0.80`
- Numerology `initiation_tendency = +0.65`, effective support `0.75`

Input B:

- same as A
- duplicate the Western claim five times with identical `source_fact_id` and `claim_id`

Expected:

- A and B produce the same reduced Western `SystemEffect` within numeric tolerance.
- A and B produce the same classification.
- independent lineage count is unchanged.

### R2-002 — Single-source cannot converge

Input:

- one production-eligible Western effect: `stability_adaptation = -0.82`

Expected:

- classification = `single_source`
- classification MUST NOT equal `convergence`
- independent lineage count = 1

### R2-003 — Derivative lineage cannot self-corroborate

Input:

- Human Design effect: `decision_latency = +0.78`
  - lineage `human_design_bodygraph`
- Gene Keys effect: `decision_latency = +0.74`
  - lineage `gene_keys_from_human_design`
  - parent lineage `human_design_bodygraph`
  - independence class `derivative`

Expected:

- independent lineage count = 1
- classification MUST NOT equal `convergence`
- Gene Keys may enrich the evidence record but cannot satisfy the independent-source requirement.

### R2-004 — Independent convergence

Input:

- Numerology `initiation_tendency = +0.72`, independent lineage
- BaZi `initiation_tendency = +0.64`, independent lineage
- both eligible under the policy

Expected:

- independent lineage count >= 2
- positive support mass materially exceeds negative support mass
- heterogeneity below the configured convergence threshold
- classification = `convergence`

### R2-005 — Strong opposition must not average into neutrality

Input:

- System A `risk_appetite = +0.90`, weight 0.90
- System B `risk_appetite = -0.90`, weight 0.90
- independent lineages

Expected:

- weighted mean near 0
- heterogeneity high
- classification is `paradox` or `contextual_tension` according to contextual metadata
- classification MUST NOT be `mixed` solely because mean is near 0
- classification MUST NOT be `insufficient`

### R2-006 — Contextual tension

Input:

- Identity effect: system A suggests rapid `initiation_tendency`
- Identity effect: system B suggests extended `decision_latency`
- metadata indicates one claim concerns recognizing an opportunity and the other concerns committing to a decision

Expected:

- if the claims are mapped to different atomic dimensions, both results remain independently valid and no false contradiction is created
- if summarized in the same presentation group, group-level narrative may identify `contextual_tension`
- atomic results MUST remain inspectable

### R2-007 — Non-comparable claims

Input:

- one claim about social attachment behavior
- one claim about abstract reasoning preference
- an intentionally invalid mapping attempts to place both on `boundary_permeability`

Expected:

- invalid mapping is rejected or withheld
- result may be `non_comparable`
- engine does not force both claims onto a shared scalar

### R2-008 — Unknown birth time degrades only affected calculations

Input:

- birth time confidence = unknown
- Western Sun placement valid from date
- Western Ascendant withheld
- Human Design withheld under policy
- Numerology unaffected

Expected:

- unaffected Source Facts retain their calculation quality
- time-dependent Source Facts are withheld or degraded
- result does not globally reduce every source merely because one input field is missing

### R2-009 — Identity and cycle isolation

Input:

- natal Numerology Life Path effect in `identity`
- Personal Year effect in `cycle`

Expected:

- Personal Year does not alter identity SystemEffect
- natal effect does not alter cycle SystemEffect unless the explicit interaction layer is invoked
- separate result IDs and scopes are produced

### R2-010 — Explicit-time reproducibility

Input:

- fixed birth data
- fixed calculation versions
- fixed evaluation time `2026-09-14T18:00:00-07:00`
- fixed evaluation timezone `America/Los_Angeles`

Expected:

- repeated runs produce byte-equivalent deterministic statistics after canonical serialization, excluding `generated_at` if implementation policy permits it to vary
- no runtime clock is consulted for dasha, transit, personal-year, or cycle calculations

### R2-011 — Leave-one-source-out stability

Input:

- three systems narrowly satisfying convergence
- one system contributes disproportionately

Expected:

- leave-one-source-out evaluation is performed
- `classification_flip_count` records how often removal changes classification
- `classification_stability` is reduced when one source determines the result

### R2-012 — Prototype calculation gating

Input:

- Western effect status `production_verified`
- Human Design effect status `prototype`
- production policy excludes prototype effects

Expected:

- Human Design appears in `withheld_sources`
- it contributes zero production reconciliation weight
- source coverage UI may show it as present-but-ineligible, not as independent evidence

### R2-013 — Threshold versioning

Expected:

- every result contains `policy_version`
- every policy threshold is loaded from the named policy object/configuration
- no production classification depends on an undocumented hard-coded UI literal

### R2-014 — No-LLM deterministic core

Expected:

- test harness can execute all reconciliation tests with network/model calls disabled
- deterministic result object is complete before narrative generation

### R2-015 — Gene Keys dependency correctness

Input:

- Gene Keys Activation Sequence derived from Human Design planetary activations

Expected:

- dependency lineage explicitly references the Human Design/planetary activation lineage
- Gene Keys does not increase independent lineage count over its source activation
- official sphere-coordinate mapping fixtures are used before production eligibility

## Property-based tests

The implementation SHOULD also include property-based tests for:

- permutation invariance: ordering source effects does not change results
- score bounds: output scores stay in documented ranges
- weight bounds: effective weights stay in `[0,1]`
- monotonicity under eligible independent support: adding a modest same-direction independent source should not reduce convergence strength absent a policy reason
- lineage discount monotonicity: making two sources more dependent cannot increase independent-source coverage
- determinism: same canonical inputs + versions + evaluation time yield identical deterministic outputs

## Golden profile suite

Before public beta, maintain at least:

- 12 Western reference charts across timezones and hemispheres
- boundary cases for DST and historical timezone transitions
- Vedic nakshatra/pada fixtures and approved dasha fixtures before dasha production eligibility
- BaZi solar-term/month-boundary and Zi-hour fixtures
- Human Design gate-wheel/design-time/type/authority/profile fixtures
- Numerology punctuation/diacritic/master-number fixtures
- Gene Keys Activation Sequence sphere fixtures

Each fixture MUST state its authoritative or reference source, calculation settings, expected output, tolerance where applicable, and the calculator version tested.

## Release gate

Reconciliation Engine v2 is not product-ready until R2-001 through R2-015 pass and the two canonical v2 schemas validate against representative outputs.
