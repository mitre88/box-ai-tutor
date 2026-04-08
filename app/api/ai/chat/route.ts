import { NextResponse } from 'next/server';
import type { AiProvider } from '../../../lib/storage';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

async function callOpenAICompat(
  endpoint: string,
  key: string,
  model: string,
  messages: ChatMessage[],
  extraHeaders: Record<string, string> = {}
): Promise<string> {
  const r = await fetch(`${endpoint}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`,
      ...extraHeaders,
    },
    body: JSON.stringify({ model, messages, temperature: 0.7, max_tokens: 120 }),
    cache: 'no-store',
  });

  if (!r.ok) {
    const body = await r.text().catch(() => '');
    throw new Error(`AI request failed (${r.status}): ${body?.slice(0, 100)}`);
  }

  const data = await r.json();
  return data?.choices?.[0]?.message?.content?.trim() || '';
}

async function callAnthropic(key: string, messages: ChatMessage[]): Promise<string> {
  // Separate system message from conversation
  const systemMsg = messages.find(m => m.role === 'system');
  const convoMsgs = messages.filter(m => m.role !== 'system');

  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5',
      max_tokens: 120,
      ...(systemMsg ? { system: systemMsg.content } : {}),
      messages: convoMsgs.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })),
    }),
    cache: 'no-store',
  });

  if (!r.ok) {
    const body = await r.text().catch(() => '');
    throw new Error(`Anthropic request failed (${r.status}): ${body?.slice(0, 100)}`);
  }

  const data = await r.json();
  return data?.content?.[0]?.text?.trim() || '';
}

async function callGemini(key: string, messages: ChatMessage[]): Promise<string> {
  const systemMsg = messages.find(m => m.role === 'system');
  const convoMsgs = messages.filter(m => m.role !== 'system');

  const contents = convoMsgs.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  const body: Record<string, unknown> = { contents };
  if (systemMsg) {
    body.systemInstruction = { parts: [{ text: systemMsg.content }] };
  }
  body.generationConfig = { maxOutputTokens: 120, temperature: 0.7 };

  const r = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${key}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      cache: 'no-store',
    }
  );

  if (!r.ok) {
    const text = await r.text().catch(() => '');
    throw new Error(`Gemini request failed (${r.status}): ${text?.slice(0, 100)}`);
  }

  const data = await r.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
}

export async function POST(req: Request) {
  try {
    const { key, provider, messages } = (await req.json()) as {
      key?: string;
      provider?: AiProvider;
      messages?: ChatMessage[];
    };

    if (!key || !provider || !messages?.length) {
      return NextResponse.json({ ok: false, error: 'Missing key, provider, or messages' }, { status: 400 });
    }

    let reply = '';

    switch (provider) {
      case 'openai':
        reply = await callOpenAICompat('https://api.openai.com/v1', key, 'gpt-4o-mini', messages);
        break;
      case 'mistral':
        reply = await callOpenAICompat('https://api.mistral.ai/v1', key, 'mistral-small-latest', messages);
        break;
      case 'groq':
        reply = await callOpenAICompat('https://api.groq.com/openai/v1', key, 'llama-3.3-70b-versatile', messages);
        break;
      case 'openrouter':
        reply = await callOpenAICompat('https://openrouter.ai/api/v1', key, 'openai/gpt-4o-mini', messages, {
          'HTTP-Referer': 'https://box-ai-tutor.vercel.app',
          'X-Title': 'Box AI Tutor',
        });
        break;
      case 'anthropic':
        reply = await callAnthropic(key, messages);
        break;
      case 'gemini':
        reply = await callGemini(key, messages);
        break;
      default:
        return NextResponse.json({ ok: false, error: 'Unknown provider' }, { status: 400 });
    }

    return NextResponse.json({ ok: true, reply });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'AI request failed' }, { status: 500 });
  }
}
