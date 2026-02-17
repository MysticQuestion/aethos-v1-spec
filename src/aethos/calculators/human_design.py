"""
human_design.py — Aethos V1 (Scaffold)

Purpose:
- Provide deterministic Human Design calculations downstream of the canonical birth input.
- V1 target: compute Personality and Design activations (gate + line at minimum).
- This module intentionally does NOT attempt full bodygraph (centers/channels/type)
  until the gate-wheel mapping is locked and tested with fixtures.

Critical Note:
- Gate mapping is NOT naive longitude binning.
- The HD mandala has a specific gate order around the zodiac (Rave New Year near Aquarius).
- Therefore, lon_to_gate must use a mandala-aware mapping table.

Integration:
- canonical_chart.py provides planetary longitudes.
- profile_builder.py calls compute_human_design_layer(...) and stores results in profile JSON.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Dict, Mapping, Optional, Tuple, Callable


@dataclass(frozen=True)
class Activation:
    gate: int
    line: int


def normalize_deg(lon: float) -> float:
    lon = lon % 360.0
    return lon + 360.0 if lon < 0 else lon


# ---------------------------------------------------------------------------
# Gate Wheel Mapping
# ---------------------------------------------------------------------------
# This is a placeholder. Engineers will replace this with the finalized HD gate wheel
# mapping table (start degrees per gate, in correct mandala order).
#
# Expected final form:
#   GATE_START_DEG[gate] = start_degree (0..360)
# and we find the gate such that start <= lon < next_start (circularly).
#
GATE_START_DEG: Dict[int, float] = {
    # Placeholder — NOT CORRECT.
    # Example only:
    # 41: 300.0,
    # 19: 305.625,
    # ...
}


def lon_to_gate(lon: float) -> int:
    """
    Convert longitude -> gate (1..64) using mandala-aware start-degree table.

    WARNING:
    - This function will raise until GATE_START_DEG is populated with the real mapping.
    - That is intentional: we prefer failing loudly to returning wrong gates.
    """
    if not GATE_START_DEG or len(GATE_START_DEG) < 64:
        raise RuntimeError(
            "Human Design gate wheel mapping table is not initialized. "
            "Populate GATE_START_DEG with correct mandala mapping."
        )

    lon_n = normalize_deg(lon)

    # Sort gates by start degrees
    items = sorted(GATE_START_DEG.items(), key=lambda x: x[1])  # (gate, start)
    starts = [s for _, s in items]
    gates = [g for g, _ in items]

    # Find rightmost start <= lon_n
    idx = 0
    for i, s in enumerate(starts):
        if lon_n >= s:
            idx = i
        else:
            break

    return gates[idx]


def lon_to_gate_line(lon: float, gate_start_deg: float) -> Activation:
    """
    Given a longitude and its gate's start degree, compute the line (1..6).
    Each gate spans 5.625 degrees; each line is 1/6 of that span.
    """
    lon_n = normalize_deg(lon)
    span = 5.625
    line_span = span / 6.0

    # Distance into gate (circular safe)
    d = lon_n - gate_start_deg
    if d < 0:
        d += 360.0

    # Clamp into [0, span)
    d = d % 360.0
    if d >= span:
        d = d % span

    line = 1 + int(d // line_span)
    if line < 1:
        line = 1
    if line > 6:
        line = 6
    return Activation(gate=0, line=line)  # gate will be filled by caller


# ---------------------------------------------------------------------------
# Design Date Solver (88° solar arc)
# ---------------------------------------------------------------------------

def solve_design_jd(
    birth_jd_ut: float,
    sun_lon_at: Callable[[float], float],
    *,
    target_arc_deg: float = 88.0,
    tol_deg: float = 0.01,
    max_days_back: float = 120.0
) -> float:
    """
    Find the design JD such that the Sun has moved backwards by target_arc_deg
    relative to birth sun longitude.

    - sun_lon_at(jd) must return tropical Sun longitude in degrees [0..360).
    - Uses bracket + binary search on JD.

    Returns:
    - design_jd_ut
    """
    sun_birth = normalize_deg(sun_lon_at(birth_jd_ut))

    # Bracket search backwards in time
    step = 1.0  # days
    jd_hi = birth_jd_ut
    jd_lo = birth_jd_ut

    def arc(jd: float) -> float:
        # arc = birth_sun - sun_at(jd) normalized to [0..360)
        return normalize_deg(sun_birth - normalize_deg(sun_lon_at(jd)))

    # Walk back until arc >= target
    days = 0.0
    while days < max_days_back:
        jd_lo = birth_jd_ut - days
        if arc(jd_lo) >= target_arc_deg:
            break
        days += step
    else:
        raise RuntimeError("Could not bracket design date within max_days_back window.")

    # Binary search between jd_lo (arc >= target) and jd_hi (arc < target)
    lo = jd_lo
    hi = jd_hi

    for _ in range(60):
        mid = (lo + hi) / 2.0
        a = arc(mid)
        if abs(a - target_arc_deg) <= tol_deg:
            return mid
        if a >= target_arc_deg:
            lo = mid
        else:
            hi = mid

    return (lo + hi) / 2.0


# ---------------------------------------------------------------------------
# Main Layer Builder
# ---------------------------------------------------------------------------

def compute_human_design_layer(
    *,
    birth_jd_ut: float,
    positions_birth: Mapping[str, float],
    positions_design: Optional[Mapping[str, float]] = None,
    sun_lon_at: Optional[Callable[[float], float]] = None,
    compute_positions_at_jd: Optional[Callable[[float], Mapping[str, float]]] = None,
) -> Dict[str, Any]:
    """
    Compute the Human Design layer.

    Inputs:
    - birth_jd_ut: canonical JD UT
    - positions_birth: dict of point -> longitude (tropical), at birth
      Required keys (V1 minimum): Sun, Earth, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto
    - positions_design: optional precomputed positions at design JD
    - sun_lon_at: function to compute Sun longitude at JD (required if positions_design not passed)
    - compute_positions_at_jd: function to compute full positions at JD (required if positions_design not passed)

    Output:
    - dict ready to insert into profile["human_design"]
    """
    # Determine design JD + positions (if not provided)
    design_jd_ut: Optional[float] = None
    if positions_design is None:
        if sun_lon_at is None or compute_positions_at_jd is None:
            raise ValueError(
                "Either provide positions_design OR provide sun_lon_at + compute_positions_at_jd."
            )
        design_jd_ut = solve_design_jd(birth_jd_ut, sun_lon_at)
        positions_design = compute_positions_at_jd(design_jd_ut)

    # Build activations for personality and design
    personality = _build_activations(positions_birth)
    design = _build_activations(positions_design)

    # Type/profile/authority are intentionally NOT computed in V1 scaffold
    return {
        "engine_version": "0.1.0-scaffold",
        "birth_jd_ut": birth_jd_ut,
        "design_jd_ut": design_jd_ut,
        "personality": {"activations": personality},
        "design": {"activations": design},
        "notes": {
            "status": "scaffold",
            "requires_gate_wheel": True,
            "bodygraph_not_implemented": True
        }
    }


def _build_activations(positions: Mapping[str, float]) -> Dict[str, Dict[str, int]]:
    out: Dict[str, Dict[str, int]] = {}
    for name, lon in positions.items():
        gate = lon_to_gate(lon)  # will raise until mapping table is real
        start = GATE_START_DEG[gate]
        line = lon_to_gate_line(lon, start).line
        out[name] = {"gate": gate, "line": line}
    return out
