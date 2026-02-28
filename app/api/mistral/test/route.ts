import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { key } = (await req.json()) as { key?: string };

    if (!key || typeof key !== 'string') {
      return NextResponse.json({ ok: false, error: 'Missing key' }, { status: 400 });
    }

    // Validate by making a minimal chat completion request.
    // Using /v1/chat/completions because some hackathon keys
    // do not have access to /v1/models.
    const r = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
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

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: 'Bad request' }, { status: 400 });
  }
}
