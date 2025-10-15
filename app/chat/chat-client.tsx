'use client';
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
}