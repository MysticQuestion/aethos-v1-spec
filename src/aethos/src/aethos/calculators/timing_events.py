# timing_events.py
from __future__ import annotations

import json
from dataclasses import dataclass
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple, Any

# NOTE: relative import for proper package structure
from .transits_engine import (
    TransitFrame,
    PLANETS,
    ASPECTS,
    ASPECT_SYMBOL,
    normalize_deg,
    whole_sign_house,
    compute_transits_frame,
    compute_daily_frames,
)

# =====================================================
# Orb Policies (Deterministic & Tunable)
# =====================================================

ORBS_DEFAULT: Dict[str, float] = {
    "conj": 3.0,
    "opp": 3.0,
    "square": 3.0,
    "trine": 2.5,
    "sextile": 2.0,
}

ORBS_ANGLES: Dict[str, float] = {
    "conj": 1.5,
    "opp": 1.5,
    "square": 1.5,
    "trine": 1.0,
    "sextile": 1.0,
}

ANGLE_KEYS = ("Asc", "MC", "Desc", "IC")

# =====================================================
# Helper Functions
# =====================================================

def shortest_angle(a: float, b: float) -> float:
    diff = abs(normalize_deg(a) - normalize_deg(b)) % 360.0
    return min(diff, 360.0 - diff)


def ang_diff_signed(a: float, b: float) -> float:
    x = (normalize_deg(a) - normalize_deg(b)) % 360.0
    return x - 360 if x > 180 else x


def aspect_hardness(name: str) -> str:
    return "Hard" if name in ("conj", "square", "opp") else "Soft"


def orb_tier(orb: float, angle_hit: bool) -> str:
    if angle_hit:
        if orb <= 0.25: return "Exact"
        if orb <= 0.75: return "High"
        if orb <= 1.25: return "Medium"
        return "Low"
    else:
        if orb <= 0.5: return "Exact"
        if orb <= 1.0: return "High"
        if orb <= 2.0: return "Medium"
        if orb <= 3.0: return "Low"
        return "Background"

# =====================================================
# Data Structures
# =====================================================

@dataclass(frozen=True)
class AspectHit:
    t_body: str
    n_point: str
    aspect: str
    orb: float
    exact_deg: float
    tier: str
    hardness: str
    angle_hit: bool
    t_house: int
    n_house: int


@dataclass(frozen=True)
class HouseIngress:
    t_body: str
    from_house: int
    to_house: int
    at_local_iso: str
    at_utc_iso: str
    jd_ut: float


@dataclass(frozen=True)
class AngleCrossing:
    t_body: str
    natal_angle: str
    direction: str
    at_local_iso: str
    at_utc_iso: str
    jd_ut: float
    lon_at_cross: float

# =====================================================
# Profile Utilities
# =====================================================

def load_profile(profile_path: str) -> Dict[str, Any]:
    with open(profile_path, "r", encoding="utf-8") as f:
        return json.load(f)


def natal_points_from_profile(profile: Dict[str, Any]) -> Dict[str, float]:
    pts = profile["canonical_chart"]["western_tropical"]["points"]
    return {k: float(v["lon"]) for k, v in pts.items()}


def profile_geo(profile: Dict[str, Any]) -> Tuple[str, float, float]:
    meta = profile["canonical_chart"]["meta"]
    return meta["tz_name"], float(meta["lat"]), float(meta["lon"])

# =====================================================
# Transit → Natal Aspect Detection
# =====================================================

def find_transit_aspects(
    natal_lons: Dict[str, float],
    natal_asc_lon: float,
    transit_frame: TransitFrame,
    max_hits: int = 32,
) -> List[AspectHit]:

    hits: List[AspectHit] = []
    t_lons = {k: float(v["lon"]) for k, v in transit_frame.tropical.items()}
    transit_asc = float(transit_frame.angles["Asc"]["lon"])

    def natal_house(n_lon: float) -> int:
        return whole_sign_house(natal_asc_lon, n_lon)

    for t_body, t_lon in t_lons.items():
        t_house = whole_sign_house(transit_asc, t_lon)

        for n_point, n_lon in natal_lons.items():
            angle_hit = n_point in ANGLE_KEYS
            orb_policy = ORBS_ANGLES if angle_hit else ORBS_DEFAULT

            diff = shortest_angle(t_lon, n_lon)

            for asp, deg in ASPECTS.items():
                orb = abs(diff - deg)
                if orb <= orb_policy.get(asp, 3.0):
                    hits.append(
                        AspectHit(
                            t_body=t_body,
                            n_point=n_point,
                            aspect=asp,
                            orb=round(orb, 4),
                            exact_deg=float(deg),
                            tier=orb_tier(orb, angle_hit),
                            hardness=aspect_hardness(asp),
                            angle_hit=angle_hit,
                            t_house=t_house,
                            n_house=natal_house(n_lon),
                        )
                    )

    hits.sort(key=lambda h: (h.orb, 0 if h.angle_hit else 1))
    return hits[:max_hits]

# =====================================================
# Angle Crossing Solver (Bisection)
# =====================================================

def _transit_lon_at(
    dt_local: datetime,
    tz_name: str,
    lat: float,
    lon: float,
    body: str,
) -> Tuple[float, float, float, str, str]:

    frame = compute_transits_frame(
        dt_local=dt_local,
        tz_name=tz_name,
        lat=lat,
        lon=lon,
        include_sidereal=False,
        angles_house_system=b"P",
    )

    return (
        float(frame.jd_ut),
        float(frame.tropical[body]["lon"]),
        float(frame.tropical[body]["speed"]),
        frame.dt_utc_iso,
        frame.dt_local_iso,
    )


def solve_angle_crossing(
    body: str,
    natal_angle_name: str,
    natal_angle_lon: float,
    tz_name: str,
    lat: float,
    lon: float,
    t0_local: datetime,
    t1_local: datetime,
    max_iter: int = 40,
    tol_deg: float = 1e-4,
) -> Optional[AngleCrossing]:

    jd0, lon0, spd0, utc0, loc0 = _transit_lon_at(t0_local, tz_name, lat, lon, body)
    jd1, lon1, spd1, utc1, loc1 = _transit_lon_at(t1_local, tz_name, lat, lon, body)

    f0 = ang_diff_signed(lon0, natal_angle_lon)
    f1 = ang_diff_signed(lon1, natal_angle_lon)

    if f0 * f1 > 0:
        return None

    a, b = t0_local, t1_local
    fa = f0
    best = None

    for _ in range(max_iter):
        mid = a + (b - a) / 2
        jd, mlon, mspd, utc_iso, loc_iso = _transit_lon_at(mid, tz_name, lat, lon, body)
        fm = ang_diff_signed(mlon, natal_angle_lon)
        best = (jd, mlon, mspd, utc_iso, loc_iso)

        if abs(fm) <= tol_deg:
            return AngleCrossing(
                t_body=body,
                natal_angle=natal_angle_name,
                direction="retrograde" if mspd < 0 else "forward",
                at_local_iso=loc_iso,
                at_utc_iso=utc_iso,
                jd_ut=jd,
                lon_at_cross=round(mlon, 6),
            )

        if fa * fm <= 0:
            b = mid
        else:
            a = mid
            fa = fm

    if best:
        jd, mlon, mspd, utc_iso, loc_iso = best
        return AngleCrossing(
            t_body=body,
            natal_angle=natal_angle_name,
            direction="retrograde" if mspd < 0 else "forward",
            at_local_iso=loc_iso,
            at_utc_iso=utc_iso,
            jd_ut=jd,
            lon_at_cross=round(mlon, 6),
        )

    return None

# =====================================================
# Master Builder
# =====================================================

def build_daily_timing_events(
    profile_path: str,
    day_local: datetime,
    aspects_at_time_local: Optional[datetime] = None,
    angle_step_minutes: int = 30,
    ingress_step_minutes: int = 30,
    max_aspects: int = 32,
) -> Dict[str, Any]:

    profile = load_profile(profile_path)
    tz_name, lat, lon = profile_geo(profile)

    natal_lons = natal_points_from_profile(profile)
    natal_angles = {k: natal_lons[k] for k in ANGLE_KEYS}
    natal_asc_lon = natal_angles["Asc"]

    if aspects_at_time_local is None:
        aspects_at_time_local = day_local.replace(hour=9, minute=0, second=0)

    frame = compute_transits_frame(
        dt_local=aspects_at_time_local,
        tz_name=tz_name,
        lat=lat,
        lon=lon,
        include_sidereal=False,
        angles_house_system=b"P",
    )

    aspects = find_transit_aspects(
        natal_lons=natal_lons,
        natal_asc_lon=natal_asc_lon,
        transit_frame=frame,
        max_hits=max_aspects,
    )

    return {
        "profile_id": profile.get("profile_id"),
        "date_local": day_local.date().isoformat(),
        "aspects": [a.__dict__ for a in aspects],
        "meta": {
            "orb_policy": {
                "default": ORBS_DEFAULT,
                "angles": ORBS_ANGLES,
            },
            "no_guessing_policy": True,
        },
    }


if __name__ == "__main__":
    bundle = build_daily_timing_events(
        profile_path="profile.json",
        day_local=datetime(2026, 2, 14),
    )
    print(json.dumps(bundle, indent=2))