import { describe, it, expect } from 'vitest';
import { getTeamLogo } from '@/lib/teamLogos';

describe('getTeamLogo — three-tier resolution', () => {
  it('tier 1: F1 context resolves official white WebP', () => {
    const logo = getTeamLogo('Ferrari', true);
    expect(logo).not.toBe(null);
    expect(logo!.white).toBe(true);
    expect(logo!.src).toContain('f1-');
    expect(logo!.src).toContain('.webp');
  });

  it('tier 2: Ducati SVG resolves without inversion to white', () => {
    const logo = getTeamLogo('Ducati Lenovo');
    expect(logo).not.toBe(null);
    expect(logo!.src).toContain('ducati.svg');
    expect(logo!.white).toBe(false);
  });

  it('tier 3: AF Corse maps to the Ferrari brand badge', () => {
    const logo = getTeamLogo('AF Corse');
    expect(logo).not.toBe(null);
    expect(logo!.src).toContain('ferrari');
  });

  it('F1 team outside F1 context falls back to brand PNG, not white WebP', () => {
    const logo = getTeamLogo('Ferrari', false);
    expect(logo).not.toBe(null);
    expect(logo!.white).toBe(false);
  });

  it('unknown team → null', () => {
    expect(getTeamLogo('Completely Unknown Racing Outfit')).toBe(null);
  });
});
