import { ChatBot } from '@/components/chat/ChatBot';
import { useState } from 'react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSendMessage = (message: string) => {
    // Message handling is now done directly in the ChatBot component
    console.log('Message sent:', message);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Chat with our Assistant</h1>
        <ChatBot
          onSendMessage={handleSendMessage}
          initialMessages={messages}
        />
      </div>
    </div>
  );
} 