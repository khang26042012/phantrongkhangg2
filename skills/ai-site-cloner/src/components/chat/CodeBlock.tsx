'use client';

import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface CodeBlockProps {
  language: string;
  code: string;
}

export default function CodeBlock({ language, code }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      setCopied(false);
    }
  };

  return (
    <div className="my-4 rounded-xl overflow-hidden border border-[#383838] dark:border-[#383838] bg-[#0d0d0d] text-sm">
      <div className="flex items-center justify-between px-4 py-2 bg-[#212121] text-xs font-mono text-[#b4b4b4]">
        <span className="lowercase font-semibold">{language || 'text'}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-sans">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span className="font-sans">Copy code</span>
            </>
          )}
        </button>
      </div>
      <div className="p-4 overflow-x-auto text-[#ececec] font-mono leading-relaxed text-[13px]">
        <pre>
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}
