import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { key } = (await req.json()) as { key?: string };

    if (!key || typeof key !== 'string') {
      return NextResponse.json({ ok: false, error: 'Missing key' }, { status: 400 });
    }

    const r = await fetch('https://api.elevenlabs.io/v1/models', {
      headers: {
        'xi-api-key': key,
      },
      cache: 'no-store',
    });

    if (!r.ok) {
      const body = await r.text().catch(() => '');
      return NextResponse.json(
        { ok: false, status: r.status, error: `ElevenLabs key invalid: ${body?.slice(0, 150) || 'Request failed'}` },
        { status: 401 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: 'Bad request' }, { status: 400 });
  }
}
