import { NextResponse } from 'next/server';
import type { AiProvider } from '../../../lib/storage';

const UUID_RE = /^[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}$/;

async function testOpenAICompat(endpoint: string, key: string, model: string) {
  const r = await fetch(`${endpoint}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`,
      ...(endpoint.includes('openrouter') ? { 'HTTP-Referer': 'https://box-ai-tutor.vercel.app' } : {}),
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: 'hi' }],
      max_tokens: 1,
    }),
    cache: 'no-store',
  });

  if (!r.ok) {
    const body = await r.text().catch(() => '');
    throw new Error(`Key invalid (${r.status}): ${body?.slice(0, 120) || 'Request failed'}`);
  }
  return { ok: true, format: 'standard' };
}

async function testAnthropic(key: string) {
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5',
      max_tokens: 1,
      messages: [{ role: 'user', content: 'hi' }],
    }),
    cache: 'no-store',
  });

  if (!r.ok) {
    const body = await r.text().catch(() => '');
    throw new Error(`Anthropic key invalid (${r.status}): ${body?.slice(0, 120) || 'Request failed'}`);
  }
  return { ok: true, format: 'standard' };
}

async function testGemini(key: string) {
  const r = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${key}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: 'hi' }] }] }),
      cache: 'no-store',
    }
  );

  if (!r.ok) {
    const body = await r.text().catch(() => '');
    throw new Error(`Gemini key invalid (${r.status}): ${body?.slice(0, 120) || 'Request failed'}`);
  }
  return { ok: true, format: 'standard' };
}

export async function POST(req: Request) {
  try {
    const { key, provider } = (await req.json()) as { key?: string; provider?: AiProvider };

    if (!key || typeof key !== 'string') {
      return NextResponse.json({ ok: false, error: 'Missing key' }, { status: 400 });
    }
    if (!provider) {
      return NextResponse.json({ ok: false, error: 'Missing provider' }, { status: 400 });
    }

    const trimmed = key.trim();

    // Mistral hackathon UUID key — accept without API validation
    if (provider === 'mistral' && UUID_RE.test(trimmed)) {
      return NextResponse.json({ ok: true, format: 'hackathon' });
    }

    let result;
    switch (provider) {
      case 'openai':
        result = await testOpenAICompat('https://api.openai.com/v1', trimmed, 'gpt-4o-mini');
        break;
      case 'mistral':
        result = await testOpenAICompat('https://api.mistral.ai/v1', trimmed, 'mistral-small-latest');
        break;
      case 'groq':
        result = await testOpenAICompat('https://api.groq.com/openai/v1', trimmed, 'llama-3.1-8b-instant');
        break;
      case 'openrouter':
        result = await testOpenAICompat('https://openrouter.ai/api/v1', trimmed, 'openai/gpt-4o-mini');
        break;
      case 'anthropic':
        result = await testAnthropic(trimmed);
        break;
      case 'gemini':
        result = await testGemini(trimmed);
        break;
      default:
        return NextResponse.json({ ok: false, error: 'Unknown provider' }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'Bad request' }, { status: 401 });
  }
}
