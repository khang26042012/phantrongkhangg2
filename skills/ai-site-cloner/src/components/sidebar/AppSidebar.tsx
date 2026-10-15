'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '@/context/ChatContext';
import ProfileMenu from './ProfileMenu';
import {
  PanelLeftClose,
  Search,
  SquarePen,
  FolderPlus,
  Trash2,
  Gift,
  X,
  MessageSquare,
} from 'lucide-react';
import { TimeGroup } from '@/types/chat';
import gsap from 'gsap';

export default function AppSidebar() {
  const {
    conversations,
    activeConversationId,
    selectConversation,
    deleteConversation,
    createNewChat,
    isSidebarOpen,
    setIsSidebarOpen,
    toggleSidebar,
    userProfile,
    setIsUpgradeOpen,
  } = useChat();

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null);

  // GSAP animation on sidebar open/close
  useEffect(() => {
    if (sidebarRef.current) {
      if (isSidebarOpen) {
        gsap.to(sidebarRef.current, {
          x: 0,
          opacity: 1,
          duration: 0.3,
          ease: 'power3.out',
        });
      } else {
        gsap.to(sidebarRef.current, {
          x: -260,
          opacity: 0.8,
          duration: 0.25,
          ease: 'power3.in',
        });
      }
    }
  }, [isSidebarOpen]);

  const groups: TimeGroup[] = ['Today', 'Yesterday', 'Previous 7 Days'];

  const filteredConversations = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="md:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        ref={sidebarRef}
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-[#171717] border-r border-[#2a2a2a] flex flex-col select-none no-scrollbar ${
          isSidebarOpen ? 'block' : 'hidden md:hidden'
        }`}
      >
        {/* Top Header */}
        <div className="h-14 px-3 flex items-center justify-between">
          <span className="font-semibold text-white tracking-tight text-base pl-1">
            ChatGPT
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsSearchVisible(!isSearchVisible)}
              title="Search chats"
              className="p-1.5 rounded-lg hover:bg-[#252525] text-[#b4b4b4] hover:text-white transition-colors cursor-pointer"
            >
              <Search className="w-4 h-4" />
            </button>
            <button
              onClick={toggleSidebar}
              title="Hide sidebar"
              className="p-1.5 rounded-lg hover:bg-[#252525] text-[#b4b4b4] hover:text-white transition-colors cursor-pointer"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Search Bar if visible */}
        {isSearchVisible && (
          <div className="px-3 pb-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search history..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#212121] text-xs text-white placeholder-[#8e8e8e] px-3 py-1.5 rounded-lg border border-[#383838] focus:border-[#10a37f] outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-2 text-[#8e8e8e] hover:text-white cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Primary New Chat Button */}
        <div className="px-3 pb-2">
          <button
            onClick={() => {
              createNewChat();
              if (window.innerWidth < 768) setIsSidebarOpen(false);
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#212121] hover:bg-[#2a2a2a] text-[#ececec] text-xs font-semibold transition-colors cursor-pointer border border-[#2f2f2f] shadow-xs"
          >
            <SquarePen className="w-4 h-4 text-[#10a37f]" />
            <span>New chat</span>
          </button>
        </div>

        {/* Divider */}
        <div className="h-px bg-[#262626] mx-3 my-1" />

        {/* Clean History List Area without extra tabs */}
        <div className="flex-1 overflow-y-auto px-2 space-y-4 no-scrollbar">
          {/* Projects Section */}
          <div>
            <div className="flex items-center justify-between px-3 py-1 text-[11px] font-semibold text-[#8e8e8e] uppercase tracking-wider">
              <span>Projects</span>
              <button
                title="Add new project"
                className="hover:text-white transition-colors cursor-pointer"
              >
                <FolderPlus className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="px-3 py-1 text-xs text-[#555555]">No projects</div>
          </div>

          {/* Recents Section */}
          <div>
            <div className="px-3 py-1 text-[11px] font-semibold text-[#8e8e8e] uppercase tracking-wider">
              Recents
            </div>

            {filteredConversations.length === 0 ? (
              <div className="px-3 py-2 text-xs text-[#555555]">No chats found</div>
            ) : (
              groups.map((group) => {
                const groupConvs = filteredConversations.filter((c) => c.group === group);
                if (groupConvs.length === 0) return null;

                return (
                  <div key={group} className="mt-2 space-y-0.5">
                    <div className="px-3 py-1 text-[10px] font-medium text-[#777777]">
                      {group}
                    </div>
                    {groupConvs.map((conv) => {
                      const isActive = conv.id === activeConversationId;
                      return (
                        <div
                          key={conv.id}
                          onClick={() => {
                            selectConversation(conv.id);
                            if (window.innerWidth < 768) setIsSidebarOpen(false);
                          }}
                          className={`group relative flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer ${
                            isActive
                              ? 'bg-[#212121] text-white font-medium'
                              : 'text-[#b4b4b4] hover:bg-[#212121] hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate pr-2">
                            <MessageSquare className="w-3.5 h-3.5 shrink-0 opacity-70" />
                            <span className="truncate">{conv.title}</span>
                          </div>

                          {/* Delete button on hover */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteConversation(conv.id);
                            }}
                            title="Delete chat"
                            className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 text-[#8e8e8e] transition-opacity cursor-pointer shrink-0"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Footer Profile Bar */}
        <div className="p-3 border-t border-[#262626] relative">
          <div
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center justify-between p-2 rounded-xl hover:bg-[#212121] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#2a2a2a] border border-[#444] text-[#ececec] flex items-center justify-center font-bold text-xs">
                {userProfile.initials}
              </div>
              <div className="truncate">
                <div className="font-medium text-xs text-white truncate leading-tight">
                  {userProfile.name}
                </div>
                <div className="text-[11px] text-[#8e8e8e]">{userProfile.plan}</div>
              </div>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsUpgradeOpen(true);
              }}
              className="flex items-center gap-1 px-2 py-1 rounded-full bg-white text-black hover:bg-gray-200 text-[11px] font-semibold transition-colors cursor-pointer shadow-xs"
            >
              <Gift className="w-3 h-3" />
              <span>Claim</span>
            </button>
          </div>

          {/* Profile Menu Dropup */}
          <ProfileMenu
            isOpen={isProfileMenuOpen}
            onClose={() => setIsProfileMenuOpen(false)}
          />
        </div>
      </aside>
    </>
  );
}
