'use client';

import React from 'react';
import { ChatProvider, useChat } from '@/context/ChatContext';
import AppSidebar from '@/components/sidebar/AppSidebar';
import ChatHeader from '@/components/chat/ChatHeader';
import EmptyState from '@/components/chat/EmptyState';
import MessageList from '@/components/chat/MessageList';
import FloatingInputIsland from '@/components/input/FloatingInputIsland';
import SettingsModal from '@/components/modals/SettingsModal';
import UpgradeModal from '@/components/modals/UpgradeModal';

function ChatApp() {
  const { activeConversation } = useChat();

  const hasMessages = activeConversation && activeConversation.messages.length > 0;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#212121] dark:bg-[#212121] text-[#ececec]">
      {/* Left Collapsible Sidebar */}
      <AppSidebar />

      {/* Main Chat Viewport */}
      <div className="flex-1 flex flex-col h-full min-w-0 relative">
        <ChatHeader />

        <main className="flex-1 overflow-y-auto flex flex-col relative">
          {hasMessages ? (
            <>
              <div className="flex-1 overflow-y-auto">
                <MessageList messages={activeConversation.messages} />
              </div>
              <div className="shrink-0 bg-gradient-to-t from-[#212121] via-[#212121]/90 to-transparent pt-4">
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
