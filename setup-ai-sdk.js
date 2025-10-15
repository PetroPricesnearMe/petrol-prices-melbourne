/**
 * Vercel AI SDK One-Step Setup Script
 * This script installs AI SDK dependencies, creates API route, client, page,
 * and configures your environment for use with Anthropic, OpenAI, or Perplexity.
 */

import { execSync } from "child_process";
import fs from "fs";

console.log("?? Starting AI SDK integration...");

// 1. Install SDK and dependencies
console.log("?? Installing dependencies...");
execSync("npm install ai @ai-sdk/react @ai-sdk/anthropic @ai-sdk/openai zod", {
  stdio: "inherit",
});

// 2. Create env file if not exists
if (!fs.existsSync(".env.local")) {
  fs.writeFileSync(
    ".env.local",
    `# Add your model provider key below\n` +
      `# For Anthropic (Claude):\nANTHROPIC_API_KEY=your-claude-api-key\n\n` +
      `# For Perplexity (PPLX):\nPPLX_API_KEY=your-perplexity-api-key\n\n` +
      `# For OpenAI (Optional):\nOPENAI_API_KEY=your-openai-api-key`
  );
  console.log("?? Created .env.local");
}

// 3. Create Next.js API route
fs.mkdirSync("app/api/chat", { recursive: true });
fs.writeFileSync(
  "app/api/chat/route.ts",
  `import { NextResponse } from 'next/server';
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
}`
);
console.log("? Created API route at app/api/chat/route.ts");

// 4. Create chat client component
fs.mkdirSync("app/chat", { recursive: true });
fs.writeFileSync(
  "app/chat/chat-client.tsx",
  `'use client';
import { useChat } from '@ai-sdk/react';

export default function ChatClient() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/chat',
  });

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <div style={{ minHeight: 200 }}>
        {messages.map((m) => (
          <div key={m.id} style={{ marginBottom: 10 }}>
            <b>{m.role}:</b> {m.parts.map((p, i) => <span key={i}>{p.text}</span>)}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Type your message..."
          style={{ width: '100%', padding: '8px' }}
        />
      </form>
    </div>
  );
}`
);
console.log("? Created chat client");

// 5. Create chat page
fs.writeFileSync(
  "app/chat/page.tsx",
  `import ChatClient from './chat-client';

export default function ChatPage() {
  return (
    <main style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>?? AI Chat Assistant</h1>
      <ChatClient />
    </main>
  );
}`
);
console.log("? Created chat page");

// Summary
console.log(`
?? Setup Complete!

?? Steps:
1. Add your preferred API key in '.env.local'
2. Run  ?  npm run dev
3. Visit http://localhost:3000/chat to start chatting.

You can use:
- Anthropic Claude  ANTHROPIC_API_KEY
- Perplexity  PPLX_API_KEY
- OpenAI  OPENAI_API_KEY
`);

