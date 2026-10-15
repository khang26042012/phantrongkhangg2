'use client';

import React, { useState, useEffect } from 'react';
import { useChat } from '@/context/ChatContext';
import {
  X,
  ArrowLeft,
  Settings,
  Volume2,
  Database,
  Shield,
  Palette,
  Check,
} from 'lucide-react';
import { ThemeMode } from '@/types/chat';

export default function SettingsModal() {
  const { isSettingsOpen, setIsSettingsOpen, theme, setTheme } = useChat();
  const [activeTab, setActiveTab] = useState<'general' | 'speech' | 'data'>('general');
  const [language, setLanguage] = useState('Auto detect');
  const [voice, setVoice] = useState('Alloy');
  const [historyTraining, setHistoryTraining] = useState(true);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setIsSettingsOpen(false);
      }
    }
    if (isSettingsOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSettingsOpen, setIsSettingsOpen]);

  if (!isSettingsOpen) return null;

  const voices = ['Alloy', 'Echo', 'Fable', 'Onyx', 'Nova', 'Shimmer'];
  const languages = ['Auto detect', 'English', 'Tiếng Việt', 'Español', 'Français', 'Deutsch', '日本語'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-2xl h-[560px] bg-[#212121] dark:bg-[#212121] border border-[#383838] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-[#ececec]">
        {/* Header Bar */}
        <div className="h-14 px-5 flex items-center justify-between border-b border-[#333333]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSettingsOpen(false)}
              className="p-1.5 rounded-lg hover:bg-[#2f2f2f] text-[#8e8e8e] hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <span className="font-semibold text-base text-white">Settings</span>
          </div>

          <button
            onClick={() => setIsSettingsOpen(false)}
            className="p-1.5 rounded-lg hover:bg-[#2f2f2f] text-[#8e8e8e] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Left Tab Nav & Right Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Tabs Sidebar */}
          <div className="w-48 border-r border-[#333333] p-3 space-y-1 bg-[#1a1a1a]">
            <button
              onClick={() => setActiveTab('general')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'general'
                  ? 'bg-[#2f2f2f] text-white font-semibold'
                  : 'text-[#8e8e8e] hover:text-white hover:bg-[#252525]'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>General</span>
            </button>

            <button
              onClick={() => setActiveTab('speech')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'speech'
                  ? 'bg-[#2f2f2f] text-white font-semibold'
                  : 'text-[#8e8e8e] hover:text-white hover:bg-[#252525]'
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span>Speech</span>
            </button>

            <button
              onClick={() => setActiveTab('data')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'data'
                  ? 'bg-[#2f2f2f] text-white font-semibold'
                  : 'text-[#8e8e8e] hover:text-white hover:bg-[#252525]'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>Data controls</span>
            </button>
          </div>

          {/* Tab Content Panel */}
          <div className="flex-1 p-6 overflow-y-auto">
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-white mb-1">Theme</h3>
                  <p className="text-xs text-[#8e8e8e] mb-3">Choose how ChatGPT looks on your device.</p>
                  <div className="grid grid-cols-3 gap-3">
                    {(['dark', 'light', 'system'] as ThemeMode[]).map((mode) => (
                      <button
                        key={mode}
                        onClick={() => setTheme(mode)}
                        className={`p-3 rounded-xl border text-center text-xs font-medium capitalize transition-all cursor-pointer ${
                          theme === mode
                            ? 'border-[#10a37f] bg-[#10a37f]/10 text-white'
                            : 'border-[#383838] hover:border-[#525252] text-[#8e8e8e]'
                        }`}
                      >
                        <Palette className="w-4 h-4 mx-auto mb-1.5 opacity-70" />
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#333333]">
                  <h3 className="text-sm font-semibold text-white mb-1">Language</h3>
                  <p className="text-xs text-[#8e8e8e] mb-3">Language for the application user interface.</p>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full bg-[#171717] border border-[#383838] rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#10a37f] cursor-pointer"
                  >
                    {languages.map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {activeTab === 'speech' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-white mb-1">Voice</h3>
                  <p className="text-xs text-[#8e8e8e] mb-3">Select a voice for audio and speech output.</p>
                  <div className="grid grid-cols-2 gap-3">
                    {voices.map((v) => (
                      <button
                        key={v}
                        onClick={() => setVoice(v)}
                        className={`p-3 rounded-xl border flex items-center justify-between text-xs font-medium transition-all cursor-pointer ${
                          voice === v
                            ? 'border-[#10a37f] bg-[#10a37f]/10 text-white'
                            : 'border-[#383838] hover:border-[#525252] text-[#8e8e8e]'
                        }`}
                      >
                        <span>{v}</span>
                        {voice === v && <Check className="w-4 h-4 text-[#10a37f]" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'data' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-white">Chat history & training</h3>
                    <p className="text-xs text-[#8e8e8e] max-w-sm mt-0.5">
                      Save new chats to your account and permit model improvement.
                    </p>
                  </div>
                  <button
                    onClick={() => setHistoryTraining(!historyTraining)}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                      historyTraining ? 'bg-[#10a37f]' : 'bg-[#424242]'
                    }`}
                  >
                    <span
                      className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                        historyTraining ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="pt-4 border-t border-[#333333] flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-white">Export data</h3>
                    <p className="text-xs text-[#8e8e8e]">Download a complete archive of your chat history.</p>
                  </div>
                  <button className="px-3 py-1.5 rounded-xl border border-[#383838] hover:bg-[#2f2f2f] text-xs font-medium transition-colors cursor-pointer">
                    Export
                  </button>
                </div>

                <div className="pt-4 border-t border-[#333333] flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-red-400">Delete account</h3>
                    <p className="text-xs text-[#8e8e8e]">Permanently delete your account and all data.</p>
                  </div>
                  <button className="px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-400 text-xs font-medium transition-colors cursor-pointer">
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
