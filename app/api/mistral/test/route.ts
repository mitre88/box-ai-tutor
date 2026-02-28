import { NextResponse } from 'next/server';

// Hackathon keys are UUIDs: XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
const UUID_RE = /^[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}$/;

export async function POST(req: Request) {
  try {
    const { key } = (await req.json()) as { key?: string };

    if (!key || typeof key !== 'string') {
      return NextResponse.json({ ok: false, error: 'Missing key' }, { status: 400 });
    }

    const trimmed = key.trim();

    // Hackathon UUID key — accept without API validation
    if (UUID_RE.test(trimmed)) {
      return NextResponse.json({ ok: true, format: 'hackathon' });
    }

    // Standard Mistral API key — validate via chat completions
    const r = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${trimmed}`,
      },
      body: JSON.stringify({
        model: 'mistral-small-latest',
        messages: [{ role: 'user', content: 'hi' }],
        max_tokens: 1,
      }),
      cache: 'no-store',
    });

    if (!r.ok) {
      const body = await r.text().catch(() => '');
      return NextResponse.json(
        { ok: false, status: r.status, error: `Mistral key invalid: ${body?.slice(0, 150) || 'Request failed'}` },
        { status: 401 }
      );
    }

    return NextResponse.json({ ok: true, format: 'standard' });
  } catch {
    return NextResponse.json({ ok: false, error: 'Bad request' }, { status: 400 });
  }
}
