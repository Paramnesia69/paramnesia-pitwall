'use client';

/**
 * Client side of Web Push reminders. Local notifications (useReminders) still
 * fire while the tab is open; this additionally queues a server-side push so
 * the reminder arrives with the site closed. Every call fails silently —
 * push is an enhancement, never a blocker.
 */

function urlBase64ToUint8Array(base64: string): Uint8Array {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(b64);
  return Uint8Array.from(raw, (c) => c.charCodeAt(0));
}

async function getOrCreateSubscription(): Promise<PushSubscription | null> {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return null;
  const key = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  if (!key) return null;
  try {
    const reg = await navigator.serviceWorker.ready;
    const existing = await reg.pushManager.getSubscription();
    if (existing) return existing;
    return await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(key) as BufferSource,
    });
  } catch {
    return null;
  }
}

export interface PushReminderInput {
  eventId: string;
  eventName: string;
  sessionName: string;
  sessionStart: string;
  leadMinutes: number;
}

/** Queue a server push for this reminder. No-op when push is unavailable. */
export async function queuePushReminder(r: PushReminderInput): Promise<void> {
  try {
    const sub = await getOrCreateSubscription();
    if (!sub) return;
    const remindAt = new Date(new Date(r.sessionStart).getTime() - r.leadMinutes * 60_000).toISOString();
    await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subscription: sub.toJSON(),
        reminder: {
          eventId: r.eventId,
          eventName: r.eventName,
          sessionName: r.sessionName,
          remindAt,
          leadMinutes: r.leadMinutes,
        },
      }),
    });
  } catch { /* silent — local notification still covers the open-tab case */ }
}

/** Remove the queued server push for this reminder on this device. */
export async function removePushReminder(eventId: string, sessionName: string): Promise<void> {
  try {
    if (!('serviceWorker' in navigator)) return;
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    if (!sub) return;
    await fetch('/api/push/subscribe', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventId, sessionName, endpoint: sub.endpoint }),
    });
  } catch { /* silent */ }
}
