/**
 * Endurance race clock intelligence — day/night cycle, race-phase narrative,
 * and next-milestone countdowns.
 *
 * All values are derived from FACTS: the race start instant, the official race
 * length (see endurance.ts), and the circuit's real sunrise/sunset instants for
 * the race date. Nothing here is invented or estimated track data — it is pure
 * time math layered on astronomical facts.
 */

export interface SunWindow {
  /** Sunset instant during the race (ISO 8601, UTC) */
  sunsetUtc: string;
  /** Sunrise instant during the race (ISO 8601, UTC) */
  sunriseUtc: string;
}

/**
 * Real sunrise/sunset instants for endurance races that run through the night.
 * Keyed by circuit name (Circuit.name as it appears in the calendar).
 *
 * Le Mans 2026 (Circuit de la Sarthe, 47.95°N, CEST/UTC+2):
 *   sunset  2026-06-13 ≈ 21:58 local → 19:58Z
 *   sunrise 2026-06-14 ≈ 06:00 local → 04:00Z
 */
const CIRCUIT_SUN: Record<string, SunWindow> = {
  'Circuit de la Sarthe': {
    sunsetUtc: '2026-06-13T19:58:00Z',
    sunriseUtc: '2026-06-14T04:00:00Z',
  },
};

export function getEnduranceSun(circuitName: string): SunWindow | null {
  return CIRCUIT_SUN[circuitName] ?? null;
}

export type DaylightState = 'day' | 'dusk' | 'night' | 'dawn';

/** Is the circuit in day, dusk, night or dawn at instant `nowMs`? */
export function getDaylightState(nowMs: number, sun: SunWindow): DaylightState {
  const sunset = new Date(sun.sunsetUtc).getTime();
  const sunrise = new Date(sun.sunriseUtc).getTime();
  const DUSK = 30 * 60_000; // 30-min twilight band each side
  if (nowMs >= sunset - DUSK && nowMs < sunset + DUSK) return 'dusk';
  if (nowMs >= sunrise - DUSK && nowMs < sunrise + DUSK) return 'dawn';
  if (nowMs >= sunset && nowMs < sunrise) return 'night';
  return 'day';
}

export type RacePhaseIcon =
  | 'grid' | 'start' | 'day' | 'dusk' | 'night'
  | 'predawn' | 'dawn' | 'morning' | 'final' | 'flag' | 'racing';

export interface RacePhase {
  label: string;
  icon: RacePhaseIcon;
}

/**
 * Narrative phase of the race. Sun-aware when a SunWindow is supplied,
 * otherwise falls back to elapsed-based phases (start / final hour).
 * `icon` is a semantic key → rendered as a premium SVG by RaceIcons.PhaseIcon.
 */
export function getRacePhase(
  nowMs: number,
  startMs: number,
  durationHours: number,
  sun: SunWindow | null,
): RacePhase {
  const totalMs = durationHours * 3600_000;
  const finishMs = startMs + totalMs;
  const elapsed = nowMs - startMs;

  if (elapsed < 0) return { label: 'On the Grid', icon: 'grid' };
  if (nowMs >= finishMs) return { label: 'Chequered Flag', icon: 'flag' };

  // Final-phase labels take priority — the run to the flag matters most.
  if (finishMs - nowMs <= 15 * 60_000) return { label: 'Run to the Flag', icon: 'flag' };
  if (finishMs - nowMs <= 60 * 60_000) return { label: 'Final Hour', icon: 'final' };
  if (elapsed <= 60 * 60_000) return { label: 'Le Départ', icon: 'start' };

  if (sun) {
    const state = getDaylightState(nowMs, sun);
    if (state === 'dusk') return { label: 'Dusk Falls', icon: 'dusk' };
    if (state === 'dawn') return { label: 'Dawn Breaks', icon: 'dawn' };
    if (state === 'night') {
      const sunrise = new Date(sun.sunriseUtc).getTime();
      // Deepest, loneliest hours
      if (nowMs >= sunrise - 3 * 3600_000) return { label: 'Before the Dawn', icon: 'predawn' };
      return { label: 'Into the Night', icon: 'night' };
    }
    // Daytime — distinguish the opening afternoon from the morning run
    if (nowMs < new Date(sun.sunsetUtc).getTime()) return { label: 'Afternoon Run', icon: 'day' };
    return { label: 'Morning Charge', icon: 'morning' };
  }

  return { label: 'Race in Progress', icon: 'racing' };
}

export interface Milestone {
  label: string;
  /** Absolute target instant (ms) */
  targetMs: number;
}

/**
 * The next meaningful upcoming instant: sunset, sunrise, the chequered flag, or
 * the next whole race-hour mark — whichever comes first.
 */
export function getNextMilestone(
  nowMs: number,
  startMs: number,
  durationHours: number,
  sun: SunWindow | null,
): Milestone | null {
  const finishMs = startMs + durationHours * 3600_000;
  const candidates: Milestone[] = [];

  // Next whole race-hour boundary (Hour 1, Hour 2, …)
  const elapsedH = Math.floor((nowMs - startMs) / 3600_000) + 1;
  if (elapsedH >= 1 && elapsedH < durationHours) {
    candidates.push({ label: `Hour ${elapsedH}`, targetMs: startMs + elapsedH * 3600_000 });
  }

  if (sun) {
    candidates.push({ label: 'Sunset', targetMs: new Date(sun.sunsetUtc).getTime() });
    candidates.push({ label: 'Sunrise', targetMs: new Date(sun.sunriseUtc).getTime() });
  }
  candidates.push({ label: 'Chequered Flag', targetMs: finishMs });

  const upcoming = candidates
    .filter((c) => c.targetMs > nowMs)
    .sort((a, b) => a.targetMs - b.targetMs);

  return upcoming[0] ?? null;
}
