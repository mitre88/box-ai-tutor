import { NextResponse } from 'next/server';

const TEST_VOICE_ID = '21m00Tcm4TlvDq8ikWAM';

export async function POST(req: Request) {
  try {
    const { key } = (await req.json()) as { key?: string };

    if (!key || typeof key !== 'string') {
      return NextResponse.json({ ok: false, error: 'Missing key' }, { status: 400 });
    }

    // Validate by making a minimal TTS request (the only permission the key needs)
    const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${TEST_VOICE_ID}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': key,
      },
      body: JSON.stringify({
        text: 'ok',
        model_id: 'eleven_monolingual_v1',
        voice_settings: { stability: 0.5, similarity_boost: 0.5 },
      }),
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
