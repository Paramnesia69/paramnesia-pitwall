import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import webpush from 'web-push';
import { popDuePushes } from '@/lib/pushQueue';

export const runtime = 'nodejs';

/**
 * Dispatch due push reminders. Called by the GitHub Actions cron every
 * 5 minutes (Vercel Hobby crons only run daily). Exempt from the auth
 * middleware; protected by PUSH_CRON_SECRET instead.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.PUSH_CRON_SECRET;
  if (!secret || req.headers.get('x-cron-secret') !== secret) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  if (!publicKey || !privateKey) {
    return NextResponse.json({ error: 'vapid not configured' }, { status: 500 });
  }
  webpush.setVapidDetails(process.env.VAPID_SUBJECT ?? 'mailto:udiazrad@gmail.com', publicKey, privateKey);

  const due = await popDuePushes(Date.now());
  let sent = 0;
  let dropped = 0;

  for (const item of due) {
    try {
      await webpush.sendNotification(
        { endpoint: item.subscription.endpoint, keys: item.subscription.keys },
        JSON.stringify({ title: item.title, body: item.body, url: item.url }),
        { TTL: 3600 },
      );
      sent++;
    } catch {
      // 404/410 = subscription gone; anything else — drop rather than retry-loop
      dropped++;
    }
  }

  return NextResponse.json({ ok: true, due: due.length, sent, dropped });
}
