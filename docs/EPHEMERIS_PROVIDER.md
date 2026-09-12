# Ephemeris Provider

Aethos separates calculation from interpretation. LLMs must not calculate planetary positions, houses, aspects, retrogrades, stations, or timing windows.

## Demo provider

`DemoEphemerisProvider` returns deterministic sample positions for local/demo mode. These outputs are marked `isDemo: true` and `calculationMode: "demo"`.

## Future Swiss Ephemeris provider

Swiss Ephemeris or pyswisseph should run server-side behind a private API such as `/api/aethos/ephemeris`. Do not bundle licensed ephemeris assets, service keys, or private credentials into browser code.

## Provider contract

The provider exposes `getPlanetPosition()` and `getPlanetPositions()` and can later be implemented by server or external deterministic APIs.
