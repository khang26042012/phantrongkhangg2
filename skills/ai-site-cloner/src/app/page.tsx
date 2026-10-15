'use client';

import React from 'react';
import { ChatProvider, useChat } from '@/context/ChatContext';
import AppSidebar from '@/components/sidebar/AppSidebar';
import EmptyState from '@/components/chat/EmptyState';
import MessageList from '@/components/chat/MessageList';
import FloatingInputIsland from '@/components/input/FloatingInputIsland';
import SettingsModal from '@/components/modals/SettingsModal';
import UpgradeModal from '@/components/modals/UpgradeModal';
import { PanelLeft } from 'lucide-react';

function ChatApp() {
  const { activeConversation, isSidebarOpen, toggleSidebar } = useChat();

  const hasMessages = activeConversation && activeConversation.messages.length > 0;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#212121] text-[#ececec] no-scrollbar">
      {/* Left Collapsible Minimal Sidebar */}
      <AppSidebar />

      {/* Main Chat Viewport without any Top Header Bar */}
      <div className="flex-1 flex flex-col h-full min-w-0 relative">
        {/* Floating Sidebar Toggle Button when sidebar is collapsed */}
        {!isSidebarOpen && (
          <div className="absolute top-3.5 left-3.5 z-30">
            <button
              onClick={toggleSidebar}
              title="Open sidebar"
              className="p-2 rounded-xl bg-[#252525]/90 hover:bg-[#333333] text-[#b4b4b4] hover:text-white transition-all border border-[#3e3e3e] shadow-lg backdrop-blur-md cursor-pointer"
            >
              <PanelLeft className="w-4 h-4" />
            </button>
          </div>
        )}

        <main className="flex-1 overflow-y-auto flex flex-col relative no-scrollbar">
          {hasMessages ? (
            <>
              <div className="flex-1 overflow-y-auto no-scrollbar pt-6 pb-2">
                <MessageList messages={activeConversation.messages} />
              </div>
              <div className="shrink-0 bg-gradient-to-t from-[#212121] via-[#212121]/95 to-transparent pt-4">
                <FloatingInputIsland />
              </div>
            </>
          ) : (
            <EmptyState />
          )}
        </main>

        {/* Global Modals */}
        <SettingsModal />
        <UpgradeModal />
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <ChatProvider>
      <ChatApp />
    </ChatProvider>
  );
}
