import { NextResponse } from 'next/server';
import { convertToModelMessages, streamText, UIMessage } from 'ai';
import { google } from '@ai-sdk/google';

import { API_ACTIONS } from '@/lib/config';

const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash-exp';

export const maxDuration = 10;

export async function POST(req: Request) {
  if (!API_ACTIONS.isAi) {
    return NextResponse.json({ error: 'AI is disabled' }, { status: 403 });
  }

  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: google(model),
    messages: convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
