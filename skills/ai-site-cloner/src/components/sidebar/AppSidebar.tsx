'use client';

import React, { useState } from 'react';
import { useChat } from '@/context/ChatContext';
import ProfileMenu from './ProfileMenu';
import {
  PanelLeftClose,
  Search,
  SquarePen,
  Image,
  Clock,
  BookOpen,
  Puzzle,
  Heart,
  Terminal,
  Compass,
  FolderPlus,
  Trash2,
  Gift,
  X,
  MessageSquare,
} from 'lucide-react';
import { TimeGroup } from '@/types/chat';

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

  // Group conversations
  const groups: TimeGroup[] = ['Today', 'Yesterday', 'Previous 7 Days'];

  const filteredConversations = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const navTools = [
    { name: 'Images', icon: <Image className="w-4 h-4" /> },
    { name: 'Tasks', icon: <Clock className="w-4 h-4" /> },
    { name: 'Library', icon: <BookOpen className="w-4 h-4" /> },
    { name: 'Plugins', icon: <Puzzle className="w-4 h-4" /> },
    { name: 'Health', icon: <Heart className="w-4 h-4" /> },
    { name: 'Codex', icon: <Terminal className="w-4 h-4" /> },
    { name: 'Explore', icon: <Compass className="w-4 h-4" /> },
  ];

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
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-[#171717] dark:bg-[#171717] border-r border-[#2a2a2a] flex flex-col transition-all duration-200 select-none ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:-ml-64'
        }`}
      >
        {/* Top Header */}
        <div className="h-14 px-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white tracking-tight text-base pl-1">
              ChatGPT
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsSearchVisible(!isSearchVisible)}
              title="Search chats"
              className="p-2 rounded-lg hover:bg-[#252525] text-[#b4b4b4] hover:text-white transition-colors cursor-pointer"
            >
              <Search className="w-4 h-4" />
            </button>
            <button
              onClick={toggleSidebar}
              title="Hide sidebar"
              className="p-2 rounded-lg hover:bg-[#252525] text-[#b4b4b4] hover:text-white transition-colors cursor-pointer"
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
                  className="absolute right-2 top-2 text-[#8e8e8e] hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Navigation & Tools List */}
        <div className="px-2 space-y-0.5">
          {/* New Chat Primary Button */}
          <button
            onClick={() => {
              createNewChat();
              if (window.innerWidth < 768) setIsSidebarOpen(false);
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#212121] hover:bg-[#2a2a2a] text-[#ececec] text-xs font-medium transition-colors cursor-pointer border border-[#2f2f2f] mb-2"
          >
            <SquarePen className="w-4 h-4 text-[#10a37f]" />
            <span>New chat</span>
          </button>

          {/* Quick tool items */}
          <div className="space-y-0.5 max-h-36 overflow-y-auto pr-1">
            {navTools.map((tool) => (
              <button
                key={tool.name}
                className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-[#212121] text-[#b4b4b4] hover:text-white text-xs font-medium transition-colors cursor-pointer"
              >
                {tool.icon}
                <span>{tool.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-[#262626] mx-3 my-2" />

        {/* History List Area */}
        <div className="flex-1 overflow-y-auto px-2 space-y-4">
          {/* Projects Header */}
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
            <div className="px-3 py-1 text-xs text-[#666666]">No projects</div>
          </div>

          {/* Recents Header & Groups */}
          <div>
            <div className="px-3 py-1 text-[11px] font-semibold text-[#8e8e8e] uppercase tracking-wider">
              Recents
            </div>

            {filteredConversations.length === 0 ? (
              <div className="px-3 py-2 text-xs text-[#666666]">No chats found</div>
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
