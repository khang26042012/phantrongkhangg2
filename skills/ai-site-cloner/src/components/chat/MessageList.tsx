'use client';

import React, { useEffect, useRef } from 'react';
import { Message } from '@/types/chat';
import ChatMessage from './ChatMessage';

interface MessageListProps {
  messages: Message[];
}

export default function MessageList({ messages }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, messages[messages.length - 1]?.content]);

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6">
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}
      <div ref={bottomRef} className="h-4" />
    </div>
  );
}
