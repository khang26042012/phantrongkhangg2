'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '@/context/ChatContext';
import { Plus, Brain, Mic, ArrowUp, AudioWaveform } from 'lucide-react';

export default function FloatingInputIsland() {
  const { sendMessage, isStreaming } = useChat();
  const [input, setInput] = useState('');
  const [thinkActive, setThinkActive] = useState(false);
  const [isDictating, setIsDictating] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 180)}px`;
    }
  }, [input]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isStreaming) return;
    sendMessage(input, thinkActive);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const toggleDictation = () => {
    setIsDictating(!isDictating);
    if (!isDictating) {
      // Simulate voice input
      setTimeout(() => {
        setInput((prev) => (prev ? `${prev} Can you write a Python script for web crawling?` : 'Can you write a Python script for web crawling?'));
        setIsDictating(false);
      }, 1500);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 pb-4">
      <div className="relative rounded-[28px] bg-[#2f2f2f] dark:bg-[#2f2f2f] border border-[#3e3e3e] dark:border-[#3e3e3e] shadow-xl p-3 focus-within:border-[#525252] transition-all">
        {/* Think mode badge if active */}
        {thinkActive && (
          <div className="mb-2 px-3 py-1 inline-flex items-center gap-1.5 rounded-full bg-[#10a37f]/20 border border-[#10a37f]/30 text-[#10a37f] text-xs font-medium">
            <Brain className="w-3.5 h-3.5" />
            <span>Deep Reasoning Mode Enabled (o1 Style)</span>
          </div>
        )}

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask ChatGPT"
          rows={1}
          className="w-full bg-transparent text-[#ececec] dark:text-[#ececec] placeholder-[#8e8e8e] resize-none outline-none text-[15px] leading-relaxed px-2 py-1 max-h-[180px] overflow-y-auto"
        />

        {/* Action Controls Bar */}
        <div className="flex items-center justify-between pt-2 px-1">
          {/* Left: Add files */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              title="Add files and more"
              className="p-2 rounded-full hover:bg-[#3d3d3d] text-[#b4b4b4] hover:text-white transition-colors cursor-pointer"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {/* Right: Function Tools & Send */}
          <div className="flex items-center gap-2">
            {/* Think Button */}
            <button
              type="button"
              onClick={() => setThinkActive(!thinkActive)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                thinkActive
                  ? 'bg-[#10a37f] text-white'
                  : 'bg-[#383838] text-[#b4b4b4] hover:bg-[#444444] hover:text-white'
              }`}
            >
              <Brain className="w-3.5 h-3.5" />
              <span>Think</span>
            </button>

            {/* Dictate Button */}
            <button
              type="button"
              onClick={toggleDictation}
              title={isDictating ? 'Listening...' : 'Dictate'}
              className={`p-2 rounded-full transition-colors cursor-pointer ${
                isDictating
                  ? 'bg-red-500/20 text-red-400 animate-pulse'
                  : 'hover:bg-[#3d3d3d] text-[#b4b4b4] hover:text-white'
              }`}
            >
              <Mic className="w-4 h-4" />
            </button>

            {/* Start Voice Circular Button */}
            <button
              type="button"
              title="Start Voice"
              onClick={() => {
                setInput('Hello ChatGPT, I am testing voice interaction.');
              }}
              className="p-2 rounded-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white shadow-md transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              <AudioWaveform className="w-4 h-4" />
            </button>

            {/* Send Arrow Button */}
            <button
              type="button"
              onClick={() => handleSubmit()}
              disabled={!input.trim() || isStreaming}
              className={`p-2 rounded-full transition-all cursor-pointer ${
                input.trim() && !isStreaming
                  ? 'bg-white text-black hover:opacity-90 shadow-md'
                  : 'bg-[#3d3d3d] text-[#676767] cursor-not-allowed'
              }`}
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Footer Disclaimer */}
      <p className="text-center text-[11px] text-[#8e8e8e] mt-2 select-none">
        ChatGPT can make mistakes. Check important info.
      </p>
    </div>
  );
}
