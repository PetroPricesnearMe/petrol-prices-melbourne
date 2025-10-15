import { NextResponse } from 'next/server';
import { generateText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { openai } from '@ai-sdk/openai';
import { perplexity } from 'ai/providers/pplx'; // optional if Perplexity supported

export async function POST(req: Request) {
  const body = await req.json();
  const { prompt } = body;

  // Choose provider by priority
  const provider = process.env.ANTHROPIC_API_KEY
    ? anthropic('claude-3-sonnet')
    : process.env.PPLX_API_KEY
    ? perplexity('pplx-70b-chat')
    : openai('gpt-4o-mini');

  const { text } = await generateText({
    model: provider,
    prompt,
  });

  return NextResponse.json({ text });
}