"""
canonical_chart.py — Aethos V1 (Scaffold)

Purpose:
- Convert canonical birth input (local datetime + tz + location) into:
  - utc datetime
  - jd_ut
- Compute a minimal deterministic set of planetary longitudes + angles using Swiss Ephemeris.

This is a scaffold: the interface is stable; engineers implement internals.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Dict, Optional, Mapping
from datetime import datetime, timezone


@dataclass(frozen=True)
class BirthInput:
    local_datetime: str      # "YYYY-MM-DDTHH:MM:SS"
    timezone: str            # IANA tz, e.g., "America/Detroit"
    lat: float
    lon: float
    place_label: Optional[str] = None
    birth_time_confidence: str = "exact"  # exact|approx|unknown


def build_canonical_birth_profile(birth: BirthInput) -> Dict[str, Any]:
    """
    Convert local datetime + timezone into UTC datetime and JD UT.
    Engineers implement timezone resolution (pytz/zoneinfo) and JD conversion.

    Output contract is stable for downstream layers.
    """
    # NOTE: placeholder only (not real conversion).
    # Replace with proper tz conversion + JD UT calculation.
    utc_dt = datetime.now(timezone.utc)

    return {
        "local_datetime": birth.local_datetime,
        "timezone": birth.timezone,
        "utc_datetime": utc_dt.isoformat().replace("+00:00", "Z"),
        "jd_ut": None,  # float
        "location": {
            "lat": birth.lat,
            "lon": birth.lon,
            "place_label": birth.place_label,
            "place_source": "user_input",
        },
        "birth_time_confidence": birth.birth_time_confidence,
    }


def compute_western_tropical_points(
    *,
    jd_ut: float,
    lat: float,
    lon: float,
    house_system: str = "whole_sign",
) -> Dict[str, Any]:
    """
    Compute core western tropical chart facts:
    - points (planet longitudes)
    - angles (Asc/MC)
    - optional houses (Whole Sign metadata)

    Engineers implement via Swiss Ephemeris (pyswisseph).
    """
    # placeholder shape
    points = {
        "Sun": {"lon": None},
        "Moon": {"lon": None},
        "Mercury": {"lon": None},
        "Venus": {"lon": None},
        "Mars": {"lon": None},
        "Jupiter": {"lon": None},
        "Saturn": {"lon": None},
        "Uranus": {"lon": None},
        "Neptune": {"lon": None},
        "Pluto": {"lon": None},
    }
    angles = {"Asc": {"lon": None}, "MC": {"lon": None}, "Desc": {"lon": None}, "IC": {"lon": None}}

    return {
        "engine_version": "0.1.0-scaffold",
        "settings": {"zodiac": "tropical", "house_system": house_system},
        "angles": angles,
        "points": points,
    }


def compute_canonical_chart(birth: BirthInput) -> Dict[str, Any]:
    """
    High-level canonical chart builder for profile_builder.py

    Returns:
      {
        "birth_profile": {...},
        "western_tropical": {...}
      }
    """
    birth_profile = build_canonical_birth_profile(birth)

    # Engineers will fill jd_ut conversion above
    jd_ut = birth_profile["jd_ut"]
    chart = {
        "birth_profile": birth_profile,
        "western_tropical": compute_western_tropical_points(
            jd_ut=jd_ut if isinstance(jd_ut, float) else 0.0,
            lat=birth.lat,
            lon=birth.lon,
            house_system="whole_sign",
        ),
    }
    return chart
