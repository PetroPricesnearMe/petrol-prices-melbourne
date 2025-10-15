import ChatClient from './chat-client';

export default function ChatPage() {
  return (
    <main style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>?? AI Chat Assistant</h1>
      <ChatClient />
    </main>
  );
}