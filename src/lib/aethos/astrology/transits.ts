import { calculateAspect, type Aspect } from './aspects';
import type { CelestialPosition, EphemerisProvider } from './ephemeris';
import type { NatalChart } from './natal';

export interface DateRange { startDate: string; endDate: string; }
export interface TransitEvent { id: string; transitBody: string; natalTarget: string; aspect: Aspect; orb: number; exactDate: string; transitPosition: CelestialPosition; natalPosition: CelestialPosition; rationale: string; }

function addDays(date: Date, days: number): Date { const next = new Date(date); next.setDate(next.getDate() + days); return next; }

export async function generateTransitEvents(natalChart: NatalChart, dateRange: DateRange, provider: EphemerisProvider): Promise<TransitEvent[]> {
  const start = new Date(`${dateRange.startDate}T00:00:00Z`);
  const end = new Date(`${dateRange.endDate}T00:00:00Z`);
  const events: TransitEvent[] = [];
  for (let date = start; date <= end; date = addDays(date, 3)) {
    const isoDate = date.toISOString().slice(0, 10);
    const transits = await provider.getPlanetPositions({ isoDate });
    for (const transit of transits) {
      for (const natal of natalChart.positions) {
        const aspect = calculateAspect(transit, natal);
        if (!aspect) continue;
        events.push({ id: `${isoDate}-${transit.body}-${natal.body}-${aspect.type}`, transitBody: transit.body, natalTarget: natal.body, aspect, orb: aspect.orb, exactDate: isoDate, transitPosition: transit, natalPosition: natal, rationale: `${transit.body} ${aspect.type} natal ${natal.body} within ${aspect.orb}° orb.` });
      }
    }
  }
  return events.slice(0, 36);
}
