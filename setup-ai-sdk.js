/* eslint-disable no-console */
/* eslint-disable import/first */

import { execSync } from 'child_process';
import fs from 'fs';

// ----------- MAIN SCRIPT START -----------
console.log('🚀 Starting AI SDK integration...');

// 1. Install Dependencies
try {
  console.log('📦 Installing AI SDK dependencies...');
  execSync(
    'npm install ai @ai-sdk/react @ai-sdk/openai @ai-sdk/anthropic zod',
    {
      stdio: 'inherit',
    }
  );
} catch (e) {
  console.error('⚠️ Error during npm install:', e.message);
}

// 2. Create .env.local if it doesn’t exist
if (!fs.existsSync('.env.local')) {
  fs.writeFileSync(
    '.env.local',
    [
      '# AI SDK Configuration',
      '# Add one or more API keys below (only one is required):',
      'ANTHROPIC_API_KEY=your-claude-api-key',
      'PPLX_API_KEY=your-perplexity-api-key',
      'OPENAI_API_KEY=your-openai-api-key',
      '',
    ].join('\n')
  );
  console.log('🧩 Created .env.local');
}

// 3. Create API route directory & file
fs.mkdirSync('app/api/chat', { recursive: true });

fs.writeFileSync(
  'app/api/chat/route.ts',
  `import { NextResponse } from 'next/server';
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
import { perplexity } from 'ai/providers/pplx';

export async function POST(req: Request) {
  const body = await req.json();
  const { prompt } = body;

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
console.log('✅ Created app/api/chat/route.ts');

// 4. Create React Chat Client
fs.mkdirSync('app/chat', { recursive: true });

fs.writeFileSync(
  'app/chat/chat-client.tsx',
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
console.log('✅ Created app/chat/chat-client.tsx');

// 5. Create Chat Page
fs.writeFileSync(
  'app/chat/page.tsx',
  `import ChatClient from './chat-client';

export default function ChatPage() {
  return (
    <main style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>💬 AI Chat Assistant</h1>
      <ChatClient />
    </main>
  );
}`
);
console.log('✅ Created app/chat/page.tsx');

// Final message
console.log(`
🎉 AI SDK Setup Complete!

Next Steps:
1️⃣ Add your API key(s) in '.env.local'
2️⃣ Run ---> npm run dev
3️⃣ Visit http://localhost:3000/chat to test

You can use:
- Claude (Anthropic): ANTHROPIC_API_KEY
- Perplexity AI: PPLX_API_KEY
- OpenAI: OPENAI_API_KEY
`);
