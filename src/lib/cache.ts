/**
 * Cache layer — uses Upstash Redis when configured, falls back to in-memory.
 *
 * Set env vars UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN to enable Redis.
 * Without them everything still works via a simple Map cache.
 */

import { Redis } from '@upstash/redis';

// ── Redis client (lazy singleton) ──────────────────────────
let redis: Redis | null = null;

function getRedis(): Redis | null {
  if (redis) return redis;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) {
    redis = new Redis({ url, token });
    return redis;
  }
  return null;
}

/** Raw Redis client for non-cache uses (push queue). Null when Upstash isn't configured. */
export function getRedisClient(): Redis | null {
  return getRedis();
}

// ── In-memory fallback ─────────────────────────────────────
const memCache = new Map<string, { data: unknown; exp: number }>();

// ── Public API ─────────────────────────────────────────────

/**
 * Get a cached value by key.
 * Returns `null` if not found or expired.
 */
export async function cacheGet<T>(key: string): Promise<T | null> {
  const r = getRedis();
  if (r) {
    try {
      const val = await r.get<T>(key);
      return val;
    } catch {
      // Redis down — fall through to memory
    }
  }

  const entry = memCache.get(key);
  if (entry && Date.now() < entry.exp) return entry.data as T;
  if (entry) memCache.delete(key);
  return null;
}

/**
 * Set a cache value with TTL in seconds.
 * Writes to both Redis (if available) and in-memory.
 */
export async function cacheSet<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
  // Always write to memory (fast reads, survives Redis outage)
  memCache.set(key, { data: value, exp: Date.now() + ttlSeconds * 1000 });

  const r = getRedis();
  if (r) {
    try {
      await r.set(key, value, { ex: ttlSeconds });
    } catch {
      // Redis down — memory cache still works
    }
  }
}

/**
 * Delete a cache entry.
 */
export async function cacheDel(key: string): Promise<void> {
  memCache.delete(key);
  const r = getRedis();
  if (r) {
    try {
      await r.del(key);
    } catch {
      // ignore
    }
  }
}

/**
 * Convenience: get-or-set pattern.
 * If key exists in cache, return it. Otherwise call `fn`, cache the result, and return it.
 */
export async function cached<T>(
  key: string,
  ttlSeconds: number,
  fn: () => Promise<T>,
): Promise<T> {
  const existing = await cacheGet<T>(key);
  if (existing !== null) return existing;

  const fresh = await fn();
  await cacheSet(key, fresh, ttlSeconds);
  return fresh;
}
