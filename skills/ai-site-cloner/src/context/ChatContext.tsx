'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Conversation, Message, ModelOption, ThemeMode } from '@/types/chat';

export const NINEROUTER_API_URL = 'https://9router-production-8466.up.railway.app/v1/chat/completions';
export const NINEROUTER_API_KEY = 'sk-8f7041f3855b1b1a-wmv4fk-2ea26ec8';

export const AVAILABLE_MODELS: ModelOption[] = [
  {
    id: 'ag/gemini-3.8-flash',
    name: 'Gemini 3.8 Flash',
    description: 'Next-gen frontier speed and intelligence via 9Router',
    badge: 'Fast & Smart',
    isDefault: true,
  },
  {
    id: 'ag/gemini-3.8-flash-high',
    name: 'Gemini 3.8 Flash High',
    description: 'High-reasoning profile of Gemini 3.8',
    badge: 'Pro',
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    description: 'OpenAI multi-modal flagship intelligence',
    badge: 'Omni',
  },
  {
    id: 'ag/gemini-3.7-flash-high',
    name: 'Gemini 3.7 Flash',
    description: 'Hybrid reasoning and versatile developer assistant',
    badge: 'Reasoning',
  },
  {
    id: 'ag/gemini-3.6-flash-high',
    name: 'Gemini 3.6 Flash',
    description: 'Proven reliable high-throughput assistant',
    badge: 'Reliable',
  },
  {
    id: 'ag/claude-sonnet-4-6',
    name: 'Claude Sonnet 4.6',
    description: 'Anthropic advanced coding and creative writing',
    badge: 'Coding',
  },
];

const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    title: 'Next.js App Router Architecture',
    group: 'Today',
    updatedAt: new Date().toISOString(),
    messages: [
      {
        id: 'msg-1',
        role: 'user',
        content: 'Explain how Next.js Server Components and Client Components interact.',
        timestamp: '10:30 AM',
      },
      {
        id: 'msg-2',
        role: 'assistant',
        content: `In Next.js App Router, **React Server Components (RSC)** are the default. They execute exclusively on the server and transmit zero runtime JavaScript to the client.

### Key Architectural Concepts:
1. **Server Components:**
   - Query databases and internal APIs directly without network round-trips.
   - Keep secret API keys and heavyweight dependencies off client bundles.
2. **Client Components (\`'use client'\`):**
   - Provide interactive event listeners (\`onClick\`, \`onChange\`), state hooks (\`useState\`, \`useReducer\`), and DOM APIs.

\`\`\`typescript
// Example: Composing Server and Client Components
import InteractiveChart from './InteractiveChart';
import { fetchMetrics } from '@/lib/api';

export default async function DashboardPage() {
  const metrics = await fetchMetrics(); // Executed on server

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold tracking-tight">Performance Overview</h1>
      <InteractiveChart data={metrics} />
    </main>
  );
}
\`\`\`

This pattern ensures fast first-contentful paint while preserving dynamic client capabilities.`,
        timestamp: '10:31 AM',
      },
    ],
  },
  {
    id: 'conv-2',
    title: 'Tailwind CSS v4 Configuration',
    group: 'Yesterday',
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    messages: [
      {
        id: 'msg-3',
        role: 'user',
        content: 'What is new in Tailwind CSS v4 CSS-first configuration?',
        timestamp: 'Yesterday 3:15 PM',
      },
      {
        id: 'msg-4',
        role: 'assistant',
        content: `Tailwind CSS v4 adopts a **pure CSS-first configuration** model.

Rather than managing a JavaScript \`tailwind.config.js\` file, configuration is defined using native CSS \`@theme\` directives:

\`\`\`css
@import "tailwindcss";

@theme {
  --color-primary: #10a37f;
  --font-sans: "Söhne", ui-sans-serif, system-ui;
}
\`\`\`

This delivers up to 10x faster compile times and full interop with native CSS custom properties.`,
        timestamp: 'Yesterday 3:16 PM',
      },
    ],
  },
  {
    id: 'conv-3',
    title: 'Python FastAPI Microservice',
    group: 'Previous 7 Days',
    updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    messages: [
      {
        id: 'msg-5',
        role: 'user',
        content: 'Give me a simple FastAPI async endpoint structure.',
        timestamp: '3 days ago',
      },
      {
        id: 'msg-6',
        role: 'assistant',
        content: `Here is a clean asynchronous FastAPI endpoint with Pydantic v2 data validation:

\`\`\`python
from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel, Field

app = FastAPI(title="AI Inference Service")

class QueryRequest(BaseModel):
    prompt: str = Field(..., min_length=1, max_length=4000)
    temperature: float = Field(default=0.7, ge=0.0, le=2.0)

class QueryResponse(BaseModel):
    status: str
    tokens_processed: int
    content: str

@app.post("/v1/chat", response_model=QueryResponse, status_code=status.HTTP_200_OK)
async def handle_chat_completion(payload: QueryRequest):
    # Simulated async processing
    return QueryResponse(
        status="success",
        tokens_processed=len(payload.prompt.split()),
        content=f"Received: {payload.prompt}"
    )
\`\`\``,
        timestamp: '3 days ago',
      },
    ],
  },
];

interface ChatContextType {
  conversations: Conversation[];
  activeConversationId: string | null;
  activeConversation: Conversation | null;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  isUpgradeOpen: boolean;
  setIsUpgradeOpen: (open: boolean) => void;
  isStreaming: boolean;
  createNewChat: () => void;
  selectConversation: (id: string) => void;
  deleteConversation: (id: string) => void;
  renameConversation: (id: string, newTitle: string) => void;
  sendMessage: (content: string, thinkActive?: boolean) => Promise<void>;
  userProfile: {
    name: string;
    email: string;
    plan: string;
    initials: string;
  };
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string>('ag/gemini-3.8-flash');
  const [theme, setThemeState] = useState<ThemeMode>('dark');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isUpgradeOpen, setIsUpgradeOpen] = useState<boolean>(false);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Apply theme class to HTML element
  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    const root = document.documentElement;
    if (newTheme === 'dark') {
      root.classList.add('dark');
    } else if (newTheme === 'light') {
      root.classList.remove('dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  };

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const activeConversation = conversations.find((c) => c.id === activeConversationId) || null;

  const createNewChat = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsStreaming(false);
    setActiveConversationId(null);
  };

  const selectConversation = (id: string) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsStreaming(false);
    setActiveConversationId(id);
  };

  const deleteConversation = (id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (activeConversationId === id) {
      setActiveConversationId(null);
    }
  };

  const renameConversation = (id: string, newTitle: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, title: newTitle } : c))
    );
  };

  // Real AI Streaming via 9Router
  const sendMessage = async (content: string, thinkActive = false) => {
    if (!content.trim() || isStreaming) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: content.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    let targetConvId = activeConversationId;
    let currentMessages: Message[] = [];

    if (!targetConvId) {
      const newTitle = content.trim().length > 32 ? `${content.trim().slice(0, 32)}...` : content.trim();
      targetConvId = `conv-${Date.now()}`;
      const newConv: Conversation = {
        id: targetConvId,
        title: newTitle,
        group: 'Today',
        updatedAt: new Date().toISOString(),
        messages: [userMessage],
      };
      setConversations((prev) => [newConv, ...prev]);
      setActiveConversationId(targetConvId);
      currentMessages = [userMessage];
    } else {
      const conv = conversations.find((c) => c.id === targetConvId);
      currentMessages = conv ? [...conv.messages, userMessage] : [userMessage];
      setConversations((prev) =>
        prev.map((c) =>
          c.id === targetConvId
            ? {
                ...c,
                messages: [...c.messages, userMessage],
                updatedAt: new Date().toISOString(),
              }
            : c
        )
      );
    }

    // Set up placeholder for streaming response
    const aiMessageId = `ai-${Date.now()}`;
    const initialAiMessage: Message = {
      id: aiMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isStreaming: true,
      thought: thinkActive ? 'Connecting to 9Router deep reasoning cluster...' : undefined,
    };

    setConversations((prev) =>
      prev.map((c) =>
        c.id === targetConvId
          ? { ...c, messages: [...c.messages, initialAiMessage] }
          : c
      )
    );

    setIsStreaming(true);
    abortControllerRef.current = new AbortController();

    // Prepare API history for 9Router
    const apiMessages = currentMessages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: apiMessages,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`9Router Error (${response.status}): ${errorText || response.statusText}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder('utf-8');
      let accumulatedContent = '';

      if (reader) {
        let buffer = '';

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith(':')) continue;
            if (trimmed === 'data: [DONE]') {
              break;
            }
            if (trimmed.startsWith('data: ')) {
              const dataStr = trimmed.slice(6);
              try {
                const parsed = JSON.parse(dataStr);
                const token = parsed.choices?.[0]?.delta?.content || '';
                if (token) {
                  accumulatedContent += token;

                  setConversations((prev) =>
                    prev.map((c) =>
                      c.id === targetConvId
                        ? {
                            ...c,
                            messages: c.messages.map((m) =>
                              m.id === aiMessageId
                                ? { ...m, content: accumulatedContent, isStreaming: true }
                                : m
                            ),
                          }
                        : c
                    )
                  );
                }
              } catch {
                // Ignore incomplete JSON chunks in SSE stream
              }
            }
          }
        }
      }

      // Mark streaming complete
      setConversations((prev) =>
        prev.map((c) =>
          c.id === targetConvId
            ? {
                ...c,
                messages: c.messages.map((m) =>
                  m.id === aiMessageId
                    ? { ...m, isStreaming: false }
                    : m
                ),
              }
            : c
        )
      );
    } catch (err: unknown) {
      if ((err as Error)?.name === 'AbortError') {
        console.log('Stream aborted');
        return;
      }
      console.error('9Router Streaming Error:', err);
      const errorMessage = (err as Error)?.message || 'An unexpected error occurred';
      setConversations((prev) =>
        prev.map((c) =>
          c.id === targetConvId
            ? {
                ...c,
                messages: c.messages.map((m) =>
                  m.id === aiMessageId
                    ? {
                        ...m,
                        content: `⚠️ **9Router Connection Error**: ${errorMessage}\n\nPlease verify that the selected model is supported and your network is accessible.`,
                        isStreaming: false,
                      }
                    : m
                ),
              }
            : c
        )
      );
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  };

  const userProfile = {
    name: 'phabtronfkhang',
    email: 'khang26042012@gmail.com',
    plan: 'Free',
    initials: 'PH',
  };

  return (
    <ChatContext.Provider
      value={{
        conversations,
        activeConversationId,
        activeConversation,
        selectedModel,
        setSelectedModel,
        theme,
        setTheme,
        isSidebarOpen,
        setIsSidebarOpen,
        toggleSidebar,
        isSettingsOpen,
        setIsSettingsOpen,
        isUpgradeOpen,
        setIsUpgradeOpen,
        isStreaming,
        createNewChat,
        selectConversation,
        deleteConversation,
        renameConversation,
        sendMessage,
        userProfile,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
