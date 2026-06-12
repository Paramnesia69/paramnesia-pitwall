import { describe, it, expect, afterEach, vi } from 'vitest';
import { jolpicaGetAllRaces } from '@/lib/jolpica';

function page(total: number, races: Array<{ round: string; Results: unknown[] }>) {
  return {
    ok: true,
    json: async () => ({ MRData: { total: String(total), RaceTable: { Races: races } } }),
  } as Response;
}

const row = (pos: number) => ({ position: String(pos) });

describe('jolpicaGetAllRaces — Jolpica clamps limit to 100 rows', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('walks pages and merges a race split across a page boundary (Monaco incident)', async () => {
    // Page 1: R1 full (90 rows pretend) + R2 first 10 rows; Page 2: R2 rest + R3
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(page(132, [
        { round: '1', Results: Array.from({ length: 90 }, (_, i) => row(i + 1)) },
        { round: '2', Results: Array.from({ length: 10 }, (_, i) => row(i + 1)) },
      ]))
      .mockResolvedValueOnce(page(132, [
        { round: '2', Results: Array.from({ length: 12 }, (_, i) => row(i + 11)) },
        { round: '3', Results: Array.from({ length: 20 }, (_, i) => row(i + 1)) },
      ]));
    vi.stubGlobal('fetch', fetchMock);

    const races = await jolpicaGetAllRaces<{ round: string; Results: unknown[] }>(
      '/2026/results.json', 'Results',
    );

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[0][0]).toContain('offset=0');
    expect(fetchMock.mock.calls[1][0]).toContain('offset=100');
    expect(races.map((r) => r.round)).toEqual(['1', '2', '3']);
    // The split race is re-assembled in full
    expect(races.find((r) => r.round === '2')!.Results).toHaveLength(22);
  });

  it('stops after one page when total fits', async () => {
    const fetchMock = vi.fn().mockResolvedValue(page(44, [
      { round: '1', Results: Array.from({ length: 22 }, (_, i) => row(i + 1)) },
      { round: '2', Results: Array.from({ length: 22 }, (_, i) => row(i + 1)) },
    ]));
    vi.stubGlobal('fetch', fetchMock);

    const races = await jolpicaGetAllRaces('/2026/results.json', 'Results');
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(races).toHaveLength(2);
  });

  it('returns partial data when a later page fails', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(page(200, [
        { round: '1', Results: Array.from({ length: 100 }, (_, i) => row(i + 1)) },
      ]))
      .mockResolvedValueOnce({ ok: false } as Response);
    vi.stubGlobal('fetch', fetchMock);

    const races = await jolpicaGetAllRaces('/2026/results.json', 'Results');
    expect(races).toHaveLength(1);
  });
});
