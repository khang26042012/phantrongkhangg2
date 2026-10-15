'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Conversation, Message, ModelOption, ThemeMode } from '@/types/chat';

export const AVAILABLE_MODELS: ModelOption[] = [
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    description: 'Our most intelligent and versatile model for text and vision',
    badge: 'Popular',
    isDefault: true,
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o mini',
    description: 'Faster and lightweight model for everyday tasks',
    badge: 'Fast',
  },
  {
    id: 'o1',
    name: 'o1',
    description: 'Uses advanced reasoning for complex mathematics and code',
    badge: 'Reasoning',
  },
  {
    id: 'o1-mini',
    name: 'o1-mini',
    description: 'Fast reasoning model tailored for coding and STEM',
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
        content: 'Explain how Next.js 15 Server Components and Client Components interact.',
        timestamp: '10:30 AM',
      },
      {
        id: 'msg-2',
        role: 'assistant',
        content: `In Next.js App Router, **React Server Components (RSC)** are the default. They render exclusively on the server and send zero JavaScript to the browser.

### Key Principles:
1. **Server Components:**
   - Fetch data directly on the server without API waterfalls.
   - Keep secrets, database keys, and large dependencies off the client bundle.
2. **Client Components (\`'use client'\`):**
   - Provide client-side interactivity like \`useState\`, \`useEffect\`, event handlers, and browser APIs.

\`\`\`typescript
// Example: Server Component passing data to Client Component
import ClientChart from './ClientChart';
import { db } from '@/lib/db';

export default async function DashboardPage() {
  const analyticsData = await db.analytics.findMany();
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Metrics Overview</h1>
      <ClientChart initialData={analyticsData} />
    </div>
  );
}
\`\`\`
Both paradigms work harmoniously to keep client bundles ultra-slim while delivering lightning-fast interactive experiences.`,
        timestamp: '10:31 AM',
        model: 'GPT-4o',
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
        content: `Tailwind CSS v4 introduces a **CSS-first configuration** paradigm!

Instead of a standalone \`tailwind.config.js\` file, configuration lives directly in your stylesheet using \`@theme\` directives:

\`\`\`css
@import "tailwindcss";

@theme {
  --color-brand-primary: #10a37f;
  --font-display: "Söhne", sans-serif;
}
\`\`\`

This delivers up to 10x faster builds and seamless CSS variable mapping.`,
        timestamp: 'Yesterday 3:16 PM',
        model: 'GPT-4o',
      },
    ],
  },
  {
    id: 'conv-3',
    title: 'Python Fast API Microservice',
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
        content: `Here is a production-ready asynchronous FastAPI endpoint with Pydantic validation:

\`\`\`python
from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel, Field

app = FastAPI(title="AI Service API")

class QueryRequest(BaseModel):
    prompt: str = Field(..., min_length=1, max_length=4000)
    temperature: float = Field(default=0.7, ge=0.0, le=2.0)

class QueryResponse(BaseModel):
    status: str
    tokens_used: int
    result: str

@app.post("/v1/chat", response_model=QueryResponse, status_code=status.HTTP_200_OK)
async def process_chat(payload: QueryRequest):
    # Asynchronous logic processing
    return QueryResponse(
        status="success",
        tokens_used=128,
        result=f"Processed prompt: {payload.prompt[:30]}..."
    )
\`\`\``,
        timestamp: '3 days ago',
        model: 'GPT-4o',
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
  activeTab: 'Chat' | 'Work';
  setActiveTab: (tab: 'Chat' | 'Work') => void;
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
  const [selectedModel, setSelectedModel] = useState<string>('gpt-4o');
  const [activeTab, setActiveTab] = useState<'Chat' | 'Work'>('Chat');
  const [theme, setThemeState] = useState<ThemeMode>('dark');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isUpgradeOpen, setIsUpgradeOpen] = useState<boolean>(false);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);

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
    // Default to dark mode for authentic ChatGPT feel
    document.documentElement.classList.add('dark');
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const activeConversation = conversations.find((c) => c.id === activeConversationId) || null;

  const createNewChat = () => {
    setActiveConversationId(null);
  };

  const selectConversation = (id: string) => {
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

  const generateAIResponse = (userPrompt: string, thinkActive: boolean) => {
    const promptLower = userPrompt.toLowerCase();
    let thought = thinkActive
      ? 'Analyzing problem domain, evaluating optimal patterns, reviewing edge cases...'
      : undefined;

    if (promptLower.includes('code') || promptLower.includes('python') || promptLower.includes('function')) {
      return {
        thought,
        content: `Here is the clean implementation tailored for your request:

\`\`\`python
def process_data(items: list[dict], threshold: float = 0.5) -> list[dict]:
    """Filter and normalize incoming payload records."""
    normalized = []
    for item in items:
        score = item.get("score", 0.0)
        if score >= threshold:
            normalized.append({
                "id": item["id"],
                "score": round(score, 4),
                "verified": True
            })
    return normalized

# Example usage
data = [{"id": 1, "score": 0.82}, {"id": 2, "score": 0.35}]
print(process_data(data))
\`\`\`

Let me know if you would like me to add tests or error handling!`,
      };
    }

    if (promptLower.includes('image') || promptLower.includes('sticker') || promptLower.includes('dall-e')) {
      return {
        thought,
        content: `I've prepared a prompt for image generation:

> *"A futuristic minimalist workspace overlooking a neon-lit cyberpunk metropolis at dusk, cinematic volumetric lighting, 8k resolution, hyper-detailed render."*

Would you like me to adjust the visual style or lighting palette?`,
      };
    }

    return {
      thought,
      content: `I understand! Based on your question: **"${userPrompt}"**:

Here are the key takeaways:
1. **Core Concept:** Efficient structuring and clear separation of concerns provide high maintainability.
2. **Next Steps:** You can refine this by specifying custom constraints, adding edge-case handling, or integrating external APIs.

Feel free to ask follow-up questions or request code samples!`,
    };
  };

  const sendMessage = async (content: string, thinkActive = false) => {
    if (!content.trim() || isStreaming) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: content.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    let targetConvId = activeConversationId;
    let updatedConversations = [...conversations];

    if (!targetConvId) {
      // Create new conversation
      const newTitle = content.trim().length > 30 ? `${content.trim().slice(0, 30)}...` : content.trim();
      targetConvId = `conv-${Date.now()}`;
      const newConv: Conversation = {
        id: targetConvId,
        title: newTitle,
        group: 'Today',
        updatedAt: new Date().toISOString(),
        messages: [userMessage],
      };
      updatedConversations = [newConv, ...updatedConversations];
      setConversations(updatedConversations);
      setActiveConversationId(targetConvId);
    } else {
      updatedConversations = updatedConversations.map((c) =>
        c.id === targetConvId
          ? {
              ...c,
              messages: [...c.messages, userMessage],
              updatedAt: new Date().toISOString(),
            }
          : c
      );
      setConversations(updatedConversations);
    }

    // AI Response Streaming
    setIsStreaming(true);
    const aiResponseData = generateAIResponse(content, thinkActive);
    const fullText = aiResponseData.content;
    const aiMessageId = `ai-${Date.now()}`;

    const initialAiMessage: Message = {
      id: aiMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isStreaming: true,
      thought: aiResponseData.thought,
      model: AVAILABLE_MODELS.find((m) => m.id === selectedModel)?.name || 'GPT-4o',
    };

    // Add empty placeholder for streaming
    setConversations((prev) =>
      prev.map((c) =>
        c.id === targetConvId
          ? { ...c, messages: [...c.messages, initialAiMessage] }
          : c
      )
    );

    // Stream text in chunks
    let currentIdx = 0;
    const chunkSize = 3;
    const interval = setInterval(() => {
      currentIdx += chunkSize;
      const currentChunk = fullText.slice(0, currentIdx);

      setConversations((prev) =>
        prev.map((c) =>
          c.id === targetConvId
            ? {
                ...c,
                messages: c.messages.map((m) =>
                  m.id === aiMessageId
                    ? {
                        ...m,
                        content: currentChunk,
                        isStreaming: currentIdx < fullText.length,
                      }
                    : m
                ),
              }
            : c
        )
      );

      if (currentIdx >= fullText.length) {
        clearInterval(interval);
        setIsStreaming(false);
      }
    }, 20);
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
        activeTab,
        setActiveTab,
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
