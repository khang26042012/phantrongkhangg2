'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useChat, AVAILABLE_MODELS } from '@/context/ChatContext';
import { Plus, Brain, Mic, ArrowUp, AudioWaveform, ChevronDown, Check, Sparkles, Zap, Code2 } from 'lucide-react';
import gsap from 'gsap';

export default function FloatingInputIsland() {
  const { sendMessage, isStreaming, selectedModel, setSelectedModel } = useChat();
  const [input, setInput] = useState('');
  const [thinkActive, setThinkActive] = useState(false);
  const [isDictating, setIsDictating] = useState(false);
  const [isModelMenuOpen, setIsModelMenuOpen] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const sendBtnRef = useRef<HTMLButtonElement>(null);
  const modelMenuRef = useRef<HTMLDivElement>(null);

  // Close model menu on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (modelMenuRef.current && !modelMenuRef.current.contains(e.target as Node)) {
        setIsModelMenuOpen(false);
      }
    }
    if (isModelMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isModelMenuOpen]);

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

    // GSAP micro-interaction bounce on send button
    if (sendBtnRef.current) {
      gsap.fromTo(
        sendBtnRef.current,
        { scale: 0.75 },
        { scale: 1, duration: 0.25, ease: 'back.out(2.5)' }
      );
    }

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
      setTimeout(() => {
        setInput((prev) => (prev ? `${prev} Chào bạn, bạn là model nào?` : 'Chào bạn, bạn là model nào?'));
        setIsDictating(false);
      }, 1200);
    }
  };

  const currentModel = AVAILABLE_MODELS.find((m) => m.id === selectedModel) || AVAILABLE_MODELS[0];

  const getModelIcon = (id: string) => {
    if (id.includes('claude')) return <Code2 className="w-3.5 h-3.5 text-amber-400" />;
    if (id.includes('gpt')) return <Zap className="w-3.5 h-3.5 text-emerald-400" />;
    return <Sparkles className="w-3.5 h-3.5 text-[#10a37f]" />;
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 pb-4 select-none">
      <div className="relative rounded-[28px] bg-[#2f2f2f] border border-[#3e3e3e] shadow-xl p-3 focus-within:border-[#525252] transition-all">
        {/* Deep reasoning indicator */}
        {thinkActive && (
          <div className="mb-2 px-3 py-1 inline-flex items-center gap-1.5 rounded-full bg-[#10a37f]/20 border border-[#10a37f]/30 text-[#10a37f] text-xs font-medium">
            <Brain className="w-3.5 h-3.5" />
            <span>9Router Deep Reasoning Mode Active</span>
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
          className="w-full bg-transparent text-[#ececec] placeholder-[#8e8e8e] resize-none outline-none text-[15px] leading-relaxed px-2 py-1 max-h-[180px] overflow-y-auto no-scrollbar"
        />

        {/* Action Controls Bar */}
        <div className="flex items-center justify-between pt-2 px-1">
          {/* Left: Add files & Model Selector */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              title="Add files and more"
              className="p-1.5 rounded-full hover:bg-[#3d3d3d] text-[#b4b4b4] hover:text-white transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>

            {/* Model Selector Integrated into Input Bar */}
            <div className="relative" ref={modelMenuRef}>
              <button
                type="button"
                onClick={() => setIsModelMenuOpen(!isModelMenuOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#242424] hover:bg-[#383838] border border-[#3e3e3e] text-xs font-medium text-[#ececec] transition-colors cursor-pointer"
              >
                {getModelIcon(currentModel.id)}
                <span className="font-semibold text-[11px] truncate max-w-[130px] sm:max-w-[180px]">
                  {currentModel.name}
                </span>
                <ChevronDown className="w-3 h-3 text-[#8e8e8e]" />
              </button>

              {/* Popover Model Menu */}
              {isModelMenuOpen && (
                <div className="absolute left-0 bottom-full mb-2 w-72 rounded-2xl bg-[#242424] border border-[#444444] shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="text-[10px] font-semibold text-[#8e8e8e] px-2.5 py-1 uppercase tracking-wider">
                    9Router AI Models
                  </div>
                  <div className="space-y-1 max-h-60 overflow-y-auto no-scrollbar">
                    {AVAILABLE_MODELS.map((model) => (
                      <button
                        key={model.id}
                        type="button"
                        onClick={() => {
                          setSelectedModel(model.id);
                          setIsModelMenuOpen(false);
                        }}
                        className={`w-full flex items-start gap-2.5 p-2 rounded-xl text-left transition-colors cursor-pointer ${
                          selectedModel === model.id
                            ? 'bg-[#333333] text-white'
                            : 'hover:bg-[#2c2c2c] text-[#b4b4b4] hover:text-white'
                        }`}
                      >
                        <div className="p-1 rounded-md bg-[#1a1a1a] border border-[#444] mt-0.5">
                          {getModelIcon(model.id)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-xs text-white truncate">{model.name}</span>
                            {model.badge && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-[#10a37f]/20 text-[#10a37f] border border-[#10a37f]/30 font-medium">
                                {model.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-[#8e8e8e] line-clamp-1 mt-0.5">{model.description}</p>
                        </div>
                        {selectedModel === model.id && (
                          <Check className="w-3.5 h-3.5 text-[#10a37f] shrink-0 mt-1" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Think, Dictate, Voice, and Send */}
          <div className="flex items-center gap-1.5">
            {/* Think Button */}
            <button
              type="button"
              onClick={() => setThinkActive(!thinkActive)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                thinkActive
                  ? 'bg-[#10a37f] text-white'
                  : 'bg-[#383838] text-[#b4b4b4] hover:bg-[#444444] hover:text-white'
              }`}
            >
              <Brain className="w-3.5 h-3.5" />
              <span className="text-[11px]">Think</span>
            </button>

            {/* Dictate Button */}
            <button
              type="button"
              onClick={toggleDictation}
              title={isDictating ? 'Listening...' : 'Dictate'}
              className={`p-1.5 rounded-full transition-colors cursor-pointer ${
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
                setInput('Chào bạn, bạn là model nào?');
              }}
              className="p-1.5 rounded-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white shadow-md transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              <AudioWaveform className="w-4 h-4" />
            </button>

            {/* Send Arrow Button */}
            <button
              ref={sendBtnRef}
              type="button"
              onClick={() => handleSubmit()}
              disabled={!input.trim() || isStreaming}
              className={`p-1.5 rounded-full transition-all cursor-pointer ${
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
