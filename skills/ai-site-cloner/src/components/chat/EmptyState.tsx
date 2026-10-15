'use client';

import React, { useState } from 'react';
import { useChat } from '@/context/ChatContext';
import FloatingInputIsland from '@/components/input/FloatingInputIsland';
import { Image, PenLine, Globe, X } from 'lucide-react';

export default function EmptyState() {
  const { sendMessage } = useChat();

  const [suggestions, setSuggestions] = useState([
    {
      id: 'image',
      icon: <Image className="w-4 h-4 text-[#b4b4b4]" />,
      text: 'Create an image or sticker',
      prompt: 'Create a vibrant 3D cartoon sticker of a friendly robot coder',
    },
    {
      id: 'write',
      icon: <PenLine className="w-4 h-4 text-[#b4b4b4]" />,
      text: 'Write or edit',
      prompt: 'Write a persuasive product announcement email for an AI coding tool',
    },
    {
      id: 'search',
      icon: <Globe className="w-4 h-4 text-[#b4b4b4]" />,
      text: 'Search the web',
      prompt: 'Search the web for the latest updates on Next.js 15 and React 19',
    },
  ]);

  const dismissSuggestion = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSuggestions((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center px-4 w-full max-w-3xl mx-auto">
      {/* Hero Greeting */}
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-semibold text-[#ececec] dark:text-[#ececec] tracking-tight">
          Ready when you are.
        </h1>
      </div>

      {/* Center Input Box */}
      <div className="w-full mb-6">
        <FloatingInputIsland />
      </div>

      {/* Quick Action Suggestions */}
      {suggestions.length > 0 && (
        <div className="w-full flex flex-col sm:flex-row flex-wrap items-center justify-center gap-2.5">
          {suggestions.map((item) => (
            <div
              key={item.id}
              onClick={() => sendMessage(item.prompt)}
              className="group flex items-center justify-between gap-3 px-3.5 py-2 rounded-full border border-[#383838] bg-[#212121] hover:bg-[#2a2a2a] text-xs font-medium text-[#ececec] cursor-pointer transition-all hover:scale-[1.01]"
            >
              <div className="flex items-center gap-2">
                {item.icon}
                <span>{item.text}</span>
              </div>
              <button
                type="button"
                onClick={(e) => dismissSuggestion(item.id, e)}
                title="Dismiss suggestion"
                className="opacity-0 group-hover:opacity-100 hover:text-white text-[#8e8e8e] transition-opacity p-0.5 rounded-full"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
