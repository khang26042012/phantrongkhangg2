'use client';

import React, { useRef, useEffect } from 'react';
import { useChat } from '@/context/ChatContext';
import {
  Sparkles,
  Sliders,
  User,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
} from 'lucide-react';

interface ProfileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileMenu({ isOpen, onClose }: ProfileMenuProps) {
  const { userProfile, setIsSettingsOpen, setIsUpgradeOpen } = useChat();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="absolute bottom-16 left-3 w-64 rounded-2xl bg-[#212121] dark:bg-[#212121] border border-[#3e3e3e] shadow-2xl p-1.5 z-50 text-[#ececec] text-sm animate-in fade-in zoom-in-95 duration-100"
    >
      {/* Account Info Bar */}
      <div className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#2f2f2f] transition-colors cursor-pointer border-b border-[#333333] mb-1">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#171717] border border-[#444] text-[#ececec] flex items-center justify-center font-bold text-xs">
            {userProfile.initials}
          </div>
          <div>
            <div className="font-semibold text-xs text-white leading-tight">{userProfile.name}</div>
            <div className="text-[11px] text-[#8e8e8e]">{userProfile.plan}</div>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-[#8e8e8e]" />
      </div>

      {/* Menu Actions */}
      <div className="space-y-0.5">
        <button
          onClick={() => {
            onClose();
            setIsUpgradeOpen(true);
          }}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left hover:bg-[#2f2f2f] text-xs font-medium transition-colors cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-[#60a5fa]" />
          <span>Claim offer</span>
        </button>

        <button
          onClick={onClose}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left hover:bg-[#2f2f2f] text-xs font-medium text-[#b4b4b4] hover:text-white transition-colors cursor-pointer"
        >
          <Sliders className="w-4 h-4" />
          <span>Personalization</span>
        </button>

        <button
          onClick={onClose}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left hover:bg-[#2f2f2f] text-xs font-medium text-[#b4b4b4] hover:text-white transition-colors cursor-pointer"
        >
          <User className="w-4 h-4" />
          <span>Profile</span>
        </button>

        <button
          onClick={() => {
            onClose();
            setIsSettingsOpen(true);
          }}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left hover:bg-[#2f2f2f] text-xs font-medium text-[#b4b4b4] hover:text-white transition-colors cursor-pointer"
        >
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </button>

        <div className="h-px bg-[#333333] my-1" />

        <button
          onClick={onClose}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-[#2f2f2f] text-xs font-medium text-[#b4b4b4] hover:text-white transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <HelpCircle className="w-4 h-4" />
            <span>Help</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-[#8e8e8e]" />
        </button>

        <button
          onClick={onClose}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left hover:bg-[#2f2f2f] text-xs font-medium text-red-400 hover:text-red-300 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Log out</span>
        </button>
      </div>
    </div>
  );
}
