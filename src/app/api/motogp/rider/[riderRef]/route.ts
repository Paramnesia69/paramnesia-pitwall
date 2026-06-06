import { NextRequest, NextResponse } from 'next/server';
import { MOTOGP_RIDER_DATA } from '@/lib/motogpRiders';
import type { MotoGPRiderProfile } from '@/types';

export const runtime = 'nodejs';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ riderRef: string }> }) {
  const { riderRef } = await params;
  if (!riderRef) return NextResponse.json({ error: 'missing riderRef' }, { status: 400 });

  const data = MOTOGP_RIDER_DATA[riderRef];
  if (!data) return NextResponse.json({ error: 'rider not found' }, { status: 404 });

  const profile: MotoGPRiderProfile = {
    ref: riderRef,
    givenName: data.givenName,
    familyName: data.familyName,
    nationality: data.nationality,
    dateOfBirth: data.dateOfBirth,
    permanentNumber: data.number,
    raceWins: data.wins,
    championships: data.championships,
    seasons: data.seasons,
    headshotUrl: null,
    season2026: null,
  };

  return NextResponse.json(profile, {
    headers: { 'Cache-Control': 'no-store' },
  });
}
