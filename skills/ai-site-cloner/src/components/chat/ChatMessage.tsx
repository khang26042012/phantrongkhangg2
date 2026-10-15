'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Message } from '@/types/chat';
import CodeBlock from './CodeBlock';
import { Copy, Check, ThumbsUp, ThumbsDown, RotateCcw, ChevronDown, ChevronRight } from 'lucide-react';
import gsap from 'gsap';

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState<boolean | null>(null);
  const [showThought, setShowThought] = useState(false);
  const messageRef = useRef<HTMLDivElement>(null);

  // GSAP Message Reveal Animation
  useEffect(() => {
    if (messageRef.current) {
      gsap.fromTo(
        messageRef.current,
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.35, ease: 'power2.out' }
      );
    }
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const renderFormattedContent = (content: string) => {
    const parts = content.split(/(```[\s\S]*?```)/g);

    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const lines = part.slice(3, -3).trim().split('\n');
        const language = lines[0].trim();
        const code = lines.slice(1).join('\n');
        return <CodeBlock key={index} language={language} code={code} />;
      }

      const lines = part.split('\n');
      return (
        <div key={index} className="space-y-2.5">
          {lines.map((line, lIdx) => {
            if (line.startsWith('### ')) {
              return <h3 key={lIdx} className="text-base font-semibold text-[#ececec] mt-3.5 mb-1.5">{line.replace('### ', '')}</h3>;
            }
            if (line.startsWith('## ')) {
              return <h2 key={lIdx} className="text-lg font-bold text-[#ececec] mt-4 mb-2">{line.replace('## ', '')}</h2>;
            }
            if (line.startsWith('# ')) {
              return <h1 key={lIdx} className="text-xl font-bold text-[#ececec] mt-5 mb-2.5">{line.replace('# ', '')}</h1>;
            }
            if (line.startsWith('> ')) {
              return (
                <blockquote key={lIdx} className="border-l-2 border-[#10a37f] pl-3 italic text-[#b4b4b4] my-2">
                  {line.replace('> ', '')}
                </blockquote>
              );
            }
            if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
              const text = line.trim().substring(2);
              return (
                <div key={lIdx} className="flex items-start gap-2 pl-2">
                  <span className="text-[#8e8e8e] mt-1.5 text-xs">•</span>
                  <span>{formatInlineMarkdown(text)}</span>
                </div>
              );
            }
            if (/^\d+\.\s/.test(line.trim())) {
              const match = line.trim().match(/^(\d+\.)\s(.*)/);
              if (match) {
                return (
                  <div key={lIdx} className="flex items-start gap-2 pl-2">
                    <span className="font-semibold text-[#8e8e8e]">{match[1]}</span>
                    <span>{formatInlineMarkdown(match[2])}</span>
                  </div>
                );
              }
            }
            if (!line.trim()) return <div key={lIdx} className="h-1" />;

            return <p key={lIdx} className="leading-7">{formatInlineMarkdown(line)}</p>;
          })}
        </div>
      );
    });
  };

  const formatInlineMarkdown = (text: string) => {
    const codeParts = text.split(/(`[^`]+`)/g);
    return codeParts.map((sub, i) => {
      if (sub.startsWith('`') && sub.endsWith('`')) {
        return (
          <code
            key={i}
            className="px-1.5 py-0.5 rounded bg-[#2f2f2f] text-[#ececec] font-mono text-[13px] border border-[#3e3e3e]"
          >
            {sub.slice(1, -1)}
          </code>
        );
      }
      const boldParts = sub.split(/(\*\*[^*]+\*\*)/g);
      return boldParts.map((bSub, bI) => {
        if (bSub.startsWith('**') && bSub.endsWith('**')) {
          return <strong key={bI} className="font-semibold text-white">{bSub.slice(2, -2)}</strong>;
        }
        return bSub;
      });
    });
  };

  if (message.role === 'user') {
    return (
      <div ref={messageRef} className="flex justify-end mb-6">
        <div className="max-w-[85%] sm:max-w-[70%] bg-[#2f2f2f] text-[#ececec] px-5 py-3.5 rounded-[24px] text-[15px] leading-relaxed shadow-sm">
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>
      </div>
    );
  }

  // Assistant Clean Minimalist Bubble: No avatar, no model name header
  return (
    <div ref={messageRef} className="w-full mb-8 text-[#ececec] text-[15px] group">
      {/* Optional Thought accordion if deep reasoning is active */}
      {message.thought && (
        <div className="mb-3 border border-[#383838] rounded-xl overflow-hidden bg-[#181818] max-w-2xl">
          <button
            onClick={() => setShowThought(!showThought)}
            className="w-full px-3.5 py-2 flex items-center justify-between text-xs font-medium text-[#b4b4b4] hover:bg-[#212121] transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#10a37f] animate-pulse" />
              Reasoning Process
            </span>
            {showThought ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>
          {showThought && (
            <div className="px-3.5 py-2.5 text-xs text-[#8e8e8e] border-t border-[#383838] bg-[#121212] leading-relaxed font-mono">
              {message.thought}
            </div>
          )}
        </div>
      )}

      {/* Direct Content: Minimalist, clean, immediate */}
      <div className="leading-relaxed">
        {renderFormattedContent(message.content)}
        {message.isStreaming && (
          <span className="inline-block w-2 h-4 ml-1.5 bg-[#ececec] rounded-xs animate-pulse align-middle" />
        )}
      </div>

      {/* Action Bar */}
      {!message.isStreaming && message.content && (
        <div className="flex items-center gap-2 mt-2 pt-1 text-[#8e8e8e] opacity-80 group-hover:opacity-100 transition-opacity text-xs">
          <button
            onClick={handleCopy}
            title="Copy message"
            className="p-1.5 rounded-md hover:bg-[#2f2f2f] hover:text-[#ececec] transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setLiked(liked === true ? null : true)}
            title="Good response"
            className={`p-1.5 rounded-md hover:bg-[#2f2f2f] hover:text-[#ececec] transition-colors cursor-pointer ${
              liked === true ? 'text-[#10a37f]' : ''
            }`}
          >
            <ThumbsUp className="w-4 h-4" />
          </button>

          <button
            onClick={() => setLiked(liked === false ? null : false)}
            title="Bad response"
            className={`p-1.5 rounded-md hover:bg-[#2f2f2f] hover:text-[#ececec] transition-colors cursor-pointer ${
              liked === false ? 'text-red-400' : ''
            }`}
          >
            <ThumbsDown className="w-4 h-4" />
          </button>

          <button
            title="Regenerate"
            className="p-1.5 rounded-md hover:bg-[#2f2f2f] hover:text-[#ececec] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
