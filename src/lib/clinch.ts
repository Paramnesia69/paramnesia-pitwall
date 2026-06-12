import { CALENDAR_2026 } from '@/data/calendar-2026';

/**
 * Championship clinch math — F1 + MotoGP only, where per-round maximums are
 * unambiguous. Pure arithmetic over live standings + remaining calendar
 * rounds; no invented data.
 *
 * 2026 scoring: F1 race win 25 (+8 sprint win on sprint weekends);
 * MotoGP GP win 25 + sprint win 12 every round.
 */

export interface ClinchInfo {
  leader: string;
  rival: string;
  lead: number;
  roundsLeft: number;
  maxRemaining: number;
  /** 'champion' = title already mathematically decided; 'next-round' = leader can seal it at the next event */
  status: 'champion' | 'next-round';
  nextEventName?: string;
}

export function getClinchInfo(
  series: 'f1' | 'motogp',
  standings: { name: string; points: number }[],
): ClinchInfo | null {
  if (standings.length < 2) return null;

  const now = Date.now();
  const remaining = CALENDAR_2026.filter((e) => {
    if (e.series !== series) return false;
    const race = e.sessions.find((s) => s.type === 'race');
    return race ? new Date(race.startTime).getTime() > now : false;
  });

  const perEventMax = (e: (typeof remaining)[number]) =>
    series === 'motogp'
      ? 37
      : 25 + (e.sessions.some((s) => s.type === 'sprint') ? 8 : 0);

  const maxRemaining = remaining.reduce((sum, e) => sum + perEventMax(e), 0);
  const lead = standings[0].points - standings[1].points;

  // Strict > : on equal points tie-breakers (wins) decide, so don't call it
  if (lead > maxRemaining) {
    return {
      leader: standings[0].name,
      rival: standings[1].name,
      lead,
      roundsLeft: remaining.length,
      maxRemaining,
      status: 'champion',
    };
  }

  const next = remaining[0];
  if (next) {
    const maxAfterNext = maxRemaining - perEventMax(next);
    // Best case at the next event: leader takes maximum, rival scores zero
    if (lead + perEventMax(next) > maxAfterNext) {
      return {
        leader: standings[0].name,
        rival: standings[1].name,
        lead,
        roundsLeft: remaining.length,
        maxRemaining,
        status: 'next-round',
        nextEventName: next.name,
      };
    }
  }

  return null;
}
