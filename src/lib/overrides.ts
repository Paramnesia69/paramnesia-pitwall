import type { NormalizedRaceEvent, ManualOverride } from '@/types';
import rawOverrides from '@/data/overrides.json';

type OverridesMap = Record<string, ManualOverride>;

// Strip meta keys ($schema, _README) and cast
const overrides: OverridesMap = Object.fromEntries(
  Object.entries(rawOverrides).filter(([k]) => !k.startsWith('$') && !k.startsWith('_')),
) as OverridesMap;

/**
 * Apply manual overrides to a single event.
 * Merges stream links (override replaces default), patches fields, etc.
 */
export function applyOverrides(event: NormalizedRaceEvent): NormalizedRaceEvent {
  const patch = overrides[event.id];
  if (!patch) return event;

  const patched = { ...event, overrides: patch };

  // Stream links: override replaces default
  if (patch.streamLinks && patch.streamLinks.length > 0) {
    patched.streamLinks = patch.streamLinks;
  }

  // Image URL
  if (patch.imageUrl) {
    patched.imageUrl = patch.imageUrl;
  }

  // Force event state
  if (patch.state) {
    patched.state = patch.state;
  }

  // Override start time
  if (patch.startTime) {
    patched.startDate = patch.startTime;
  }

  // Session overrides
  if (patch.sessionOverrides) {
    patched.sessions = event.sessions.map((session) => {
      const sPatch = patch.sessionOverrides?.[session.name];
      if (!sPatch) return session;
      return {
        ...session,
        ...(sPatch.startTime && { startTime: sPatch.startTime }),
        ...(sPatch.endTime && { endTime: sPatch.endTime }),
        ...(sPatch.state && { state: sPatch.state }),
      };
    });
  }

  return patched;
}

/**
 * Get the override data for a specific event (if any).
 */
export function getOverride(eventId: string): ManualOverride | undefined {
  return overrides[eventId];
}

/**
 * Check if any event is force-featured via overrides.
 */
export function getForcedFeaturedId(): string | undefined {
  const entry = Object.entries(overrides).find(([, v]) => v.featured);
  return entry?.[0];
}
