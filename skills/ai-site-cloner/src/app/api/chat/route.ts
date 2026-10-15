import { NextRequest } from 'next/server';

export const runtime = 'nodejs';

const NINEROUTER_API_URL = 'https://9router-production-8466.up.railway.app/v1/chat/completions';
const NINEROUTER_API_KEY = 'sk-8f7041f3855b1b1a-wmv4fk-2ea26ec8';

export async function POST(req: NextRequest) {
  try {
    const { model, messages } = await req.json();

    const upstreamResponse = await fetch(NINEROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NINEROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model || 'ag/gemini-3.8-flash',
        messages,
        stream: true,
      }),
    });

    if (!upstreamResponse.ok) {
      const errorText = await upstreamResponse.text();
      return new Response(
        JSON.stringify({ error: `9Router error: ${errorText || upstreamResponse.statusText}` }),
        {
          status: upstreamResponse.status,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Return the SSE stream directly to the browser
    return new Response(upstreamResponse.body, {
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
      },
    });
  } catch (err: unknown) {
    const message = (err as Error)?.message || 'Internal proxy error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
