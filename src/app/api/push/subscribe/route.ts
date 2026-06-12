import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { enqueuePush, removePush, queueId, type PushSubscriptionJSON } from '@/lib/pushQueue';

export const runtime = 'nodejs';

interface SubscribeBody {
  subscription: PushSubscriptionJSON;
  reminder: {
    eventId: string;
    eventName: string;
    sessionName: string;
    remindAt: string;     // ISO
    leadMinutes: number;
  };
}

/** Queue a server-side push for a reminder (fires even with the tab closed). */
export async function POST(req: NextRequest) {
  let body: SubscribeBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
  }

  const { subscription, reminder } = body ?? {};
  if (!subscription?.endpoint || !subscription?.keys?.p256dh || !reminder?.eventId || !reminder?.remindAt) {
    return NextResponse.json({ error: 'missing fields' }, { status: 400 });
  }

  const remindAt = new Date(reminder.remindAt).getTime();
  if (!Number.isFinite(remindAt) || remindAt < Date.now() - 60_000) {
    return NextResponse.json({ error: 'remindAt in the past' }, { status: 400 });
  }

  const id = queueId(reminder.eventId, reminder.sessionName, subscription.endpoint);
  const queued = await enqueuePush({
    id,
    subscription,
    title: reminder.eventName,
    body: `${reminder.sessionName} starts in ${reminder.leadMinutes} min`,
    url: `/?event=${encodeURIComponent(reminder.eventId)}`,
    remindAt,
  });

  // queued=false → no Redis configured; local notifications still work
  return NextResponse.json({ ok: true, queued });
}

/** Remove a queued push when the reminder is deleted. */
export async function DELETE(req: NextRequest) {
  let body: { eventId?: string; sessionName?: string; endpoint?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
  }
  if (!body.eventId || !body.sessionName || !body.endpoint) {
    return NextResponse.json({ error: 'missing fields' }, { status: 400 });
  }
  await removePush(queueId(body.eventId, body.sessionName, body.endpoint));
  return NextResponse.json({ ok: true });
}
