'use client';

import React, { useState, useEffect } from 'react';
import { useChat } from '@/context/ChatContext';
import { X, Check, Sparkles } from 'lucide-react';

export default function UpgradeModal() {
  const { isUpgradeOpen, setIsUpgradeOpen } = useChat();
  const [tab, setTab] = useState<'personal' | 'business'>('personal');

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setIsUpgradeOpen(false);
      }
    }
    if (isUpgradeOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isUpgradeOpen, setIsUpgradeOpen]);

  if (!isUpgradeOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-[#212121] dark:bg-[#212121] border border-[#383838] rounded-3xl shadow-2xl p-6 sm:p-8 text-[#ececec] relative">
        {/* Close Button */}
        <button
          onClick={() => setIsUpgradeOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-[#2f2f2f] text-[#8e8e8e] hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">Upgrade your plan</h2>

          {/* Segmented Tab */}
          <div className="inline-flex p-1 rounded-full bg-[#171717] border border-[#333333]">
            <button
              onClick={() => setTab('personal')}
              className={`px-5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                tab === 'personal' ? 'bg-[#2f2f2f] text-white shadow-xs' : 'text-[#8e8e8e] hover:text-white'
              }`}
            >
              Personal
            </button>
            <button
              onClick={() => setTab('business')}
              className={`px-5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                tab === 'business' ? 'bg-[#2f2f2f] text-white shadow-xs' : 'text-[#8e8e8e] hover:text-white'
              }`}
            >
              Business
            </button>
          </div>
        </div>

        {/* Pricing Cards Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: Free Plan */}
          <div className="p-5 rounded-2xl border border-[#383838] bg-[#1a1a1a] flex flex-col justify-between">
            <div>
              <div className="text-sm font-semibold text-white mb-1">Free</div>
              <div className="text-xl font-bold text-white mb-2">
                $0 <span className="text-xs font-normal text-[#8e8e8e]">/ month</span>
              </div>
              <p className="text-xs text-[#8e8e8e] mb-4">
                Assistance with everyday tasks, standard messaging, and temporary chat.
              </p>

              <div className="space-y-2 text-xs text-[#b4b4b4]">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Standard intelligence models</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Limited web browsing & analysis</span>
                </div>
              </div>
            </div>

            <button
              disabled
              className="mt-6 w-full py-2.5 rounded-xl bg-[#2a2a2a] text-[#8e8e8e] text-xs font-semibold cursor-not-allowed border border-[#333333]"
            >
              Your current plan
            </button>
          </div>

          {/* Card 2: Plus / Special Offer Plan */}
          <div className="p-5 rounded-2xl border border-[#2563eb]/60 bg-[#172033]/30 flex flex-col justify-between relative shadow-lg">
            <div className="absolute top-4 right-4">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#2563eb] text-white">
                SPECIAL OFFER
              </span>
            </div>

            <div>
              <div className="flex items-center gap-1.5 text-sm font-semibold text-white mb-1">
                <Sparkles className="w-4 h-4 text-[#60a5fa]" />
                <span>ChatGPT Plus</span>
              </div>
              <div className="text-xl font-bold text-white mb-2">
                $20 <span className="text-xs font-normal text-[#8e8e8e]">/ month</span>
              </div>
              <p className="text-xs text-[#b4b4b4] mb-4">
                Expanded access to frontier intelligence, reasoning, and visual creation.
              </p>

              <div className="space-y-2 text-xs text-[#ececec]">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#60a5fa] shrink-0" />
                  <span>Unlimited access to GPT-4o</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#60a5fa] shrink-0" />
                  <span>Advanced reasoning with o1 & o1-mini</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#60a5fa] shrink-0" />
                  <span>DALL-E 3 image generation</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#60a5fa] shrink-0" />
                  <span>Custom GPT creation & Workspaces</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                alert('Thank you for choosing ChatGPT Plus! (Demo mode)');
                setIsUpgradeOpen(false);
              }}
              className="mt-6 w-full py-2.5 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
            >
              Upgrade to Plus
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
