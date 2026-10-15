'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useChat, AVAILABLE_MODELS } from '@/context/ChatContext';
import {
  PanelLeft,
  ChevronDown,
  Sparkles,
  Zap,
  Brain,
  Code2,
  Gift,
  Share2,
  SquarePen,
  Check,
} from 'lucide-react';

export default function ChatHeader() {
  const {
    selectedModel,
    setSelectedModel,
    activeTab,
    setActiveTab,
    toggleSidebar,
    createNewChat,
    setIsUpgradeOpen,
  } = useChat();

  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsModelDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentModel = AVAILABLE_MODELS.find((m) => m.id === selectedModel) || AVAILABLE_MODELS[0];

  const getModelIcon = (id: string) => {
    switch (id) {
      case 'gpt-4o':
        return <Sparkles className="w-4 h-4 text-emerald-400" />;
      case 'gpt-4o-mini':
        return <Zap className="w-4 h-4 text-amber-400" />;
      case 'o1':
        return <Brain className="w-4 h-4 text-sky-400" />;
      case 'o1-mini':
        return <Code2 className="w-4 h-4 text-indigo-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <header className="h-14 px-3 flex items-center justify-between border-b border-[#2f2f2f] dark:border-[#2f2f2f] bg-[#212121] dark:bg-[#212121] text-[#ececec] dark:text-[#ececec] select-none sticky top-0 z-20">
      {/* Left: Sidebar Toggle & Model Selector */}
      <div className="flex items-center gap-2">
        <button
          onClick={toggleSidebar}
          title="Toggle sidebar"
          className="p-2 rounded-lg hover:bg-[#2f2f2f] text-[#b4b4b4] hover:text-white transition-colors cursor-pointer"
        >
          <PanelLeft className="w-5 h-5" />
        </button>

        {/* Model Selector Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-[#2f2f2f] text-base font-semibold transition-colors cursor-pointer"
          >
            <span className="text-[#ececec]">{currentModel.name}</span>
            <ChevronDown className="w-4 h-4 text-[#8e8e8e]" />
          </button>

          {isModelDropdownOpen && (
            <div className="absolute left-0 mt-1.5 w-72 rounded-2xl bg-[#2f2f2f] border border-[#424242] shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="text-xs font-semibold text-[#8e8e8e] px-3 py-1.5 uppercase tracking-wider">
                Model Selector
              </div>
              <div className="space-y-1">
                {AVAILABLE_MODELS.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => {
                      setSelectedModel(model.id);
                      setIsModelDropdownOpen(false);
                    }}
                    className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                      selectedModel === model.id
                        ? 'bg-[#3a3a3a] text-white'
                        : 'hover:bg-[#383838] text-[#b4b4b4] hover:text-white'
                    }`}
                  >
                    <div className="p-1 rounded-lg bg-[#212121] border border-[#424242] mt-0.5">
                      {getModelIcon(model.id)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm text-[#ececec]">{model.name}</span>
                        {model.badge && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#10a37f]/20 text-[#10a37f] border border-[#10a37f]/30 font-medium">
                            {model.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#8e8e8e] line-clamp-1 mt-0.5">{model.description}</p>
                    </div>
                    {selectedModel === model.id && (
                      <Check className="w-4 h-4 text-[#10a37f] shrink-0 mt-1" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Center: Segmented Chat / Work Pill */}
      <div className="hidden sm:flex items-center p-1 rounded-full bg-[#2f2f2f] border border-[#3e3e3e] text-xs font-medium">
        <button
          onClick={() => setActiveTab('Chat')}
          className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${
            activeTab === 'Chat'
              ? 'bg-[#424242] text-white shadow-sm font-semibold'
              : 'text-[#8e8e8e] hover:text-white'
          }`}
        >
          Chat
        </button>
        <button
          onClick={() => setIsUpgradeOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[#8e8e8e] hover:text-white transition-all cursor-pointer"
        >
          <span>+ Work</span>
          <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-[#3e3e3e] text-[#b4b4b4]">
            Requires upgrade
          </span>
        </button>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Claim offer button */}
        <button
          onClick={() => setIsUpgradeOpen(true)}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1d4ed8]/20 hover:bg-[#1d4ed8]/30 border border-[#2563eb]/40 text-[#60a5fa] text-xs font-medium transition-all cursor-pointer"
        >
          <Gift className="w-3.5 h-3.5" />
          <span>Claim offer</span>
        </button>

        <button
          title="Share chat"
          className="p-2 rounded-lg hover:bg-[#2f2f2f] text-[#b4b4b4] hover:text-white transition-colors cursor-pointer"
        >
          <Share2 className="w-4 h-4" />
        </button>

        <button
          onClick={createNewChat}
          title="New chat"
          className="p-2 rounded-lg hover:bg-[#2f2f2f] text-[#b4b4b4] hover:text-white transition-colors cursor-pointer"
        >
          <SquarePen className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
