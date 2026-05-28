import { NextResponse } from 'next/server';
import type { SessionResults, ResultEntry } from '@/types';

export const revalidate = 300;
export const runtime = 'nodejs';

const JOLPICA = 'https://api.jolpi.ca/ergast/f1';

// Jolpica uses legal given names; map to racing names
const DRIVER_DISPLAY: Record<string, string> = {
  'Andrea Kimi Antonelli': 'Kimi Antonelli',
};

function driverName(givenName: string, familyName: string): string {
  const full = `${givenName} ${familyName}`;
  return DRIVER_DISPLAY[full] ?? full;
}

async function jolpicaGet<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${JOLPICA}${path}`, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

// ─── Jolpica types ─────────────────────────────────────────────────────────────

interface JolpicaDriver {
  givenName: string;
  familyName: string;
}

interface JolpicaConstructor {
  name: string;
}

interface JolpicaTime {
  time: string;
}

interface JolpicaRaceEntry {
  position: string;
  Driver: JolpicaDriver;
  Constructor: JolpicaConstructor;
  Time?: JolpicaTime;
  status?: string;
  FastestLap?: { rank: string; Time: { time: string }; lap: string };
}

interface JolpicaQualifyingEntry {
  position: string;
  Driver: JolpicaDriver;
  Constructor: JolpicaConstructor;
  Q1?: string;
  Q2?: string;
  Q3?: string;
}

interface JolpicaRace {
  round: string;
  raceName: string;
  date: string;
  Circuit: { circuitName: string; Location: { country: string; locality: string } };
  Results?: JolpicaRaceEntry[];
  QualifyingResults?: JolpicaQualifyingEntry[];
  SprintResults?: JolpicaRaceEntry[];
}

interface JolpicaTable {
  Races?: JolpicaRace[];
}

interface JolpicaResponse {
  MRData: {
    RaceTable?: JolpicaTable;
    total?: string;
  };
}

// ─── Normalizers ────────────────────────────────────────────────────────────────

function normalizeRace(entries: JolpicaRaceEntry[]): {
  results: ResultEntry[];
  fastestLap?: string;
  fastestLapTime?: string;
} {
  let fastestLap: string | undefined;
  let fastestLapTime: string | undefined;

  const results: ResultEntry[] = entries.map((e) => {
    const name = driverName(e.Driver.givenName, e.Driver.familyName);
    if (e.FastestLap?.rank === '1') {
      fastestLap = name;
      fastestLapTime = e.FastestLap.Time?.time;
    }
    const pos = parseInt(e.position, 10);
    return {
      pos,
      driver: name,
      team: e.Constructor.name,
      time: e.Time?.time,
      gap: pos === 1 ? undefined : e.Time?.time,
      dnf: e.status !== 'Finished' && !e.Time,
    };
  });

  // Recalculate gap: first entry has no gap, rest use time as gap
  if (results.length > 0) {
    results[0].gap = undefined;
  }

  return { results, fastestLap, fastestLapTime };
}

function normalizeQualifying(entries: JolpicaQualifyingEntry[]): ResultEntry[] {
  return entries.map((e) => {
    const pos = parseInt(e.position, 10);
    return {
      pos,
      driver: driverName(e.Driver.givenName, e.Driver.familyName),
      team: e.Constructor.name,
      time: e.Q3 ?? e.Q2 ?? e.Q1, // best time
      q1Time: e.Q1,
      q2Time: e.Q2,
      q3Time: e.Q3,
      eliminatedInQ: !e.Q3 ? (!e.Q2 ? (1 as const) : (2 as const)) : undefined,
    };
  });
}

// ─── Route handler ───────────────────────────────────────────────────────────────

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ round: string }> },
) {
  const { round } = await params;
  const year = 2026;

  // Fetch race, qualifying, sprint in parallel
  const [raceData, qualData, sprintData] = await Promise.all([
    jolpicaGet<JolpicaResponse>(`/${year}/${round}/results.json?limit=25`),
    jolpicaGet<JolpicaResponse>(`/${year}/${round}/qualifying.json?limit=25`),
    jolpicaGet<JolpicaResponse>(`/${year}/${round}/sprint.json?limit=25`),
  ]);

  const sessions: SessionResults[] = [];

  // Qualifying
  const qualRace = qualData?.MRData?.RaceTable?.Races?.[0];
  if (qualRace?.QualifyingResults?.length) {
    sessions.push({
      type: 'qualifying',
      entries: normalizeQualifying(qualRace.QualifyingResults),
    });
  }

  // Sprint (if exists)
  const sprintRace = sprintData?.MRData?.RaceTable?.Races?.[0];
  if (sprintRace?.SprintResults?.length) {
    const { results, fastestLap, fastestLapTime } = normalizeRace(sprintRace.SprintResults);
    sessions.push({
      type: 'sprint',
      entries: results,
      fastestLap,
      fastestLapTime,
    });
  }

  // Race
  const raceRace = raceData?.MRData?.RaceTable?.Races?.[0];
  if (raceRace?.Results?.length) {
    const { results, fastestLap, fastestLapTime } = normalizeRace(raceRace.Results);
    sessions.push({
      type: 'race',
      entries: results,
      fastestLap,
      fastestLapTime,
    });
  }

  // Metadata
  const meta = raceRace ?? qualRace ?? sprintRace;

  return NextResponse.json({
    round,
    raceName: meta?.raceName,
    circuit: meta?.Circuit?.circuitName,
    country: meta?.Circuit?.Location?.country,
    date: meta?.date,
    sessions,
  });
}
