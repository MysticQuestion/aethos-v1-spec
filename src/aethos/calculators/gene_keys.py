# gene_keys.py
# ──────────────────────────────────────────────────────────────────────────────
# Gene Keys Integration Module (Aethos V1)
#
# Contract:
#   - Primary: gate (1–64) -> Gene Key (Shadow/Gift/Siddhi)
#   - Secondary: lon -> gate -> Gene Key (ONLY via an HD mandala-aware lon_to_gate)
#
# Why:
#   Gene Keys activations correspond 1:1 with Human Design gates.
#   Therefore: do NOT compute gates from longitude using naive 360/64 bins.
#
# Data:
#   Shadow/Gift/Siddhi strings for all 64 Gene Keys.
#   (If you prefer, move this dict to JSON and load it.)
# ──────────────────────────────────────────────────────────────────────────────

from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Callable, Dict, Mapping, Optional


@dataclass(frozen=True)
class GeneKey:
    gate: int
    shadow: str
    gift: str
    siddhi: str


# Full 64 Gene Keys — Shadow / Gift / Siddhi
# Note: Some words intentionally repeat across bands for specific keys (e.g., 30 Desire→Desire→Rapture).
# If you ever need to audit any entry, cross-check against the official genekeys.com Gene Key pages.
GENE_KEYS: Dict[int, Dict[str, str]] = {
    1:  {"shadow": "Entropy", "gift": "Freshness", "siddhi": "Beauty"},
    2:  {"shadow": "Dislocation", "gift": "Orientation", "siddhi": "Unity"},
    3:  {"shadow": "Chaos", "gift": "Innovation", "siddhi": "Innocence"},
    4:  {"shadow": "Intolerance", "gift": "Understanding", "siddhi": "Forgiveness"},
    5:  {"shadow": "Impatience", "gift": "Patience", "siddhi": "Timelessness"},
    6:  {"shadow": "Conflict", "gift": "Diplomacy", "siddhi": "Peace"},
    7:  {"shadow": "Division", "gift": "Guidance", "siddhi": "Virtue"},
    8:  {"shadow": "Mediocrity", "gift": "Style", "siddhi": "Exquisiteness"},
    9:  {"shadow": "Inertia", "gift": "Determination", "siddhi": "Invincibility"},
    10: {"shadow": "Self-Obsession", "gift": "Naturalness", "siddhi": "Being"},
    11: {"shadow": "Obscurity", "gift": "Idealism", "siddhi": "Light"},
    12: {"shadow": "Vanity", "gift": "Discrimination", "siddhi": "Purity"},
    13: {"shadow": "Discord", "gift": "Discernment", "siddhi": "Empathy"},
    14: {"shadow": "Compromise", "gift": "Competence", "siddhi": "Bounteousness"},
    15: {"shadow": "Dullness", "gift": "Magnetism", "siddhi": "Florescence"},
    16: {"shadow": "Indifference", "gift": "Versatility", "siddhi": "Mastery"},
    17: {"shadow": "Opinion", "gift": "Far-sightedness", "siddhi": "Omniscience"},
    18: {"shadow": "Judgment", "gift": "Integrity", "siddhi": "Perfection"},
    19: {"shadow": "Co-dependence", "gift": "Sensitivity", "siddhi": "Sacrifice"},
    20: {"shadow": "Superficiality", "gift": "Self-Assurance", "siddhi": "Presence"},
    21: {"shadow": "Control", "gift": "Authority", "siddhi": "Valor"},
    22: {"shadow": "Dishonor", "gift": "Graciousness", "siddhi": "Grace"},
    23: {"shadow": "Complexity", "gift": "Simplicity", "siddhi": "Quintessence"},
    24: {"shadow": "Addiction", "gift": "Invention", "siddhi": "Silence"},
    25: {"shadow": "Constriction", "gift": "Acceptance", "siddhi": "Universal Love"},
    26: {"shadow": "Pride", "gift": "Artfulness", "siddhi": "Invisibility"},
    27: {"shadow": "Selfishness", "gift": "Altruism", "siddhi": "Selflessness"},
    28: {"shadow": "Purposelessness", "gift": "Totality", "siddhi": "Immortality"},
    29: {"shadow": "Half-heartedness", "gift": "Commitment", "siddhi": "Devotion"},
    30: {"shadow": "Desire", "gift": "Desire", "siddhi": "Rapture"},
    31: {"shadow": "Arrogance", "gift": "Leadership", "siddhi": "Humility"},
    32: {"shadow": "Failure", "gift": "Preservation", "siddhi": "Veneration"},
    33: {"shadow": "Forgetting", "gift": "Mindfulness", "siddhi": "Revelation"},
    34: {"shadow": "Force", "gift": "Strength", "siddhi": "Majesty"},
    35: {"shadow": "Hunger", "gift": "Adventure", "siddhi": "Boundlessness"},
    36: {"shadow": "Turbulence", "gift": "Humanity", "siddhi": "Compassion"},
    37: {"shadow": "Weakness", "gift": "Equality", "siddhi": "Tenderness"},
    38: {"shadow": "Struggle", "gift": "Perseverance", "siddhi": "Honor"},
    39: {"shadow": "Provocation", "gift": "Dynamism", "siddhi": "Liberation"},
    40: {"shadow": "Exhaustion", "gift": "Resolve", "siddhi": "Divine Will"},
    41: {"shadow": "Fantasy", "gift": "Anticipation", "siddhi": "Emanation"},
    42: {"shadow": "Expectation", "gift": "Detachment", "siddhi": "Celebration"},
    43: {"shadow": "Deafness", "gift": "Insight", "siddhi": "Epiphany"},
    44: {"shadow": "Interference", "gift": "Synergy", "siddhi": "Teamwork"},
    45: {"shadow": "Dominance", "gift": "Synergy", "siddhi": "Communion"},
    46: {"shadow": "Seriousness", "gift": "Delight", "siddhi": "Ecstasy"},
    47: {"shadow": "Oppression", "gift": "Transmutation", "siddhi": "Transfiguration"},
    48: {"shadow": "Inadequacy", "gift": "Resourcefulness", "siddhi": "Wisdom"},
    49: {"shadow": "Reaction", "gift": "Revolution", "siddhi": "Rebirth"},
    50: {"shadow": "Corruption", "gift": "Equilibrium", "siddhi": "Harmony"},
    51: {"shadow": "Agitation", "gift": "Initiative", "siddhi": "Awakening"},
    52: {"shadow": "Stress", "gift": "Restraint", "siddhi": "Stillness"},
    53: {"shadow": "Immaturity", "gift": "Expansion", "siddhi": "Superabundance"},
    54: {"shadow": "Greed", "gift": "Aspiration", "siddhi": "Ascension"},
    55: {"shadow": "Victimization", "gift": "Freedom", "siddhi": "Freedom"},
    56: {"shadow": "Distraction", "gift": "Enrichment", "siddhi": "Intoxication"},
    57: {"shadow": "Unease", "gift": "Intuition", "siddhi": "Clarity"},
    58: {"shadow": "Dissatisfaction", "gift": "Vitality", "siddhi": "Bliss"},
    59: {"shadow": "Dishonesty", "gift": "Intimacy", "siddhi": "Transparency"},
    60: {"shadow": "Limitation", "gift": "Realism", "siddhi": "Justice"},
    61: {"shadow": "Psychosis", "gift": "Inspiration", "siddhi": "Sanctity"},
    62: {"shadow": "Intellect", "gift": "Precision", "siddhi": "Impeccability"},
    63: {"shadow": "Doubt", "gift": "Inquiry", "siddhi": "Truth"},
    64: {"shadow": "Confusion", "gift": "Imagination", "siddhi": "Illumination"},
}


def gate_to_gene_key(gate: int) -> GeneKey:
    """Convert a gate number (1–64) into a GeneKey dataclass."""
    if gate not in GENE_KEYS:
        raise ValueError(f"Gate must be 1..64; got {gate}")
    d = GENE_KEYS[gate]
    return GeneKey(gate=gate, shadow=d["shadow"], gift=d["gift"], siddhi=d["siddhi"])


def lon_to_gene_key(lon: float, lon_to_gate: Callable[[float], int]) -> GeneKey:
    """
    Convert longitude -> gate -> Gene Key.

    IMPORTANT:
      lon_to_gate MUST be mandala-aware (HD/Gene Keys wheel mapping),
      not naive degree-binning from 0 Aries.

    Example:
      from aethos.calculators.human_design import lon_to_gate as hd_lon_to_gate
      gk = lon_to_gene_key(points["Sun"]["lon"], hd_lon_to_gate)
    """
    gate = lon_to_gate(lon)
    return gate_to_gene_key(gate)


def add_gene_keys_to_points_inplace(
    points: Dict[str, Dict[str, Any]],
    *,
    lon_to_gate: Optional[Callable[[float], int]] = None,
    gate_field: str = "gate",
    lon_field: str = "lon",
    out_field: str = "gene_keys",
) -> None:
    """
    Mutate your points dict in-place:
      - If lon_to_gate provided and lon exists: compute gate -> gene key.
      - Else if gate_field exists: use it.
      - Stores result under `out_field` for each point.

    Intended for:
      chart["western_tropical"]["points"]
      chart["human_design"]["personality"]["activations"] (if you store gates there)
    """
    for name, data in points.items():
        gate: Optional[int] = None

        if gate_field in data and isinstance(data[gate_field], int):
            gate = data[gate_field]
        elif lon_to_gate is not None and lon_field in data and isinstance(data[lon_field], (int, float)):
            gate = lon_to_gate(float(data[lon_field]))

        if gate is None:
            continue

        gk = gate_to_gene_key(gate)
        data[out_field] = {"gate": gk.gate, "shadow": gk.shadow, "gift": gk.gift, "siddhi": gk.siddhi}


def compute_gene_keys_layer(
    points: Mapping[str, Mapping[str, Any]],
    *,
    lon_to_gate: Optional[Callable[[float], int]] = None,
    gate_field: str = "gate",
    lon_field: str = "lon",
) -> Dict[str, Dict[str, str]]:
    """
    Functional style: returns a new dict keyed by point name -> gene keys fields.

    You can feed either:
      - points with explicit `gate`, OR
      - points with `lon` plus an injected lon_to_gate mapper.
    """
    out: Dict[str, Dict[str, str]] = {}

    for name, data in points.items():
        gate: Optional[int] = None

        if gate_field in data and isinstance(data[gate_field], int):
            gate = int(data[gate_field])
        elif lon_to_gate is not None and lon_field in data and isinstance(data[lon_field], (int, float)):
            gate = lon_to_gate(float(data[lon_field]))

        if gate is None:
            continue

        gk = gate_to_gene_key(gate)
        out[name] = {"gate": str(gk.gate), "shadow": gk.shadow, "gift": gk.gift, "siddhi": gk.siddhi}

    return out


# ──────────────────────────────────────────────────────────────────────────────
# Integration snippets (copy into profile_builder.py)
# ──────────────────────────────────────────────────────────────────────────────
#
# 1) If your Human Design layer already computes gates for each planet:
#
#   profile["gene_keys"] = {
#       "personality": compute_gene_keys_layer(profile["human_design"]["personality"]["activations"]),
#       "design": compute_gene_keys_layer(profile["human_design"]["design"]["activations"]),
#   }
#
# 2) If you only have tropical longitudes and an HD mandala-aware lon_to_gate:
#
#   from aethos.calculators.human_design import lon_to_gate as hd_lon_to_gate
#   profile["gene_keys"] = compute_gene_keys_layer(chart["western_tropical"]["points"], lon_to_gate=hd_lon_to_gate)
#
# 3) Summary spine:
#
#   sun = profile["gene_keys"]["personality"]["Sun"]
#   profile["summary"]["gene_keys_sun"] = f"{sun['shadow']} → {sun['gift']} → {sun['siddhi']}"
#
# ──────────────────────────────────────────────────────────────────────────────
