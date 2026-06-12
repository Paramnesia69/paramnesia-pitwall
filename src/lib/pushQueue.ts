import { getRedisClient } from '@/lib/cache';

/**
 * Server-side push reminder queue (Upstash Redis).
 *
 * - `push:queue`  — sorted set, score = remindAt epoch ms, member = queue id
 * - `push:item:<id>` — JSON blob with the subscription + notification payload
 *
 * The dispatch route pops everything due (score <= now), sends the web push,
 * and deletes both entries. Reminder removal deletes by deterministic id so
 * no scan is needed.
 */

export interface PushSubscriptionJSON {
  endpoint: string;
  keys: { p256dh: string; auth: string };
}

export interface QueuedPush {
  id: string;
  subscription: PushSubscriptionJSON;
  title: string;
  body: string;
  url: string;
  remindAt: number;
}

/** Deterministic id: one queued push per session per device */
export function queueId(eventId: string, sessionName: string, endpoint: string): string {
  // djb2 over the endpoint keeps ids short and avoids storing raw URLs in keys
  let h = 5381;
  for (let i = 0; i < endpoint.length; i++) h = ((h << 5) + h + endpoint.charCodeAt(i)) >>> 0;
  return `${eventId}::${sessionName}::${h.toString(36)}`;
}

export async function enqueuePush(item: QueuedPush): Promise<boolean> {
  const r = getRedisClient();
  if (!r) return false;
  await Promise.all([
    r.zadd('push:queue', { score: item.remindAt, member: item.id }),
    r.set(`push:item:${item.id}`, JSON.stringify(item)),
  ]);
  return true;
}

export async function removePush(id: string): Promise<void> {
  const r = getRedisClient();
  if (!r) return;
  await Promise.all([r.zrem('push:queue', id), r.del(`push:item:${id}`)]);
}

/** Pop all due items (score <= now). Items are removed from the queue immediately. */
export async function popDuePushes(now: number): Promise<QueuedPush[]> {
  const r = getRedisClient();
  if (!r) return [];
  const ids = await r.zrange<string[]>('push:queue', 0, now, { byScore: true });
  if (ids.length === 0) return [];

  const items: QueuedPush[] = [];
  for (const id of ids) {
    const raw = await r.get(`push:item:${id}`);
    if (raw) {
      try {
        items.push(typeof raw === 'string' ? JSON.parse(raw) : (raw as QueuedPush));
      } catch { /* corrupt entry — drop */ }
    }
    await Promise.all([r.zrem('push:queue', id), r.del(`push:item:${id}`)]);
  }
  return items;
}
