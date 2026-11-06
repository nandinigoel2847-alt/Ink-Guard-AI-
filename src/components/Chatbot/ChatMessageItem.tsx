import React, { useState } from 'react';
import { ShieldCheck, User, Copy, Check, BookOpen, ExternalLink } from 'lucide-react';
import { ChatMessage } from '../../types';

interface ChatMessageItemProps {
  message: ChatMessage;
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({ message }) => {
  const [copied, setCopied] = useState(false);
  const isAssistant = message.sender === 'assistant';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Basic formatted markdown-like parser for paragraphs, bold, lists, and blockquotes
  const renderFormattedContent = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      const trimmed = line.trim();

      // Heading 3 or 4
      if (trimmed.startsWith('### ')) {
        return (
          <h4 key={idx} className="font-bold text-white text-xs mt-2.5 mb-1">
            {trimmed.slice(4)}
          </h4>
        );
      }

      // Blockquote
      if (trimmed.startsWith('> ')) {
        return (
          <blockquote key={idx} className="border-l-2 border-indigo-500/60 pl-2.5 my-1.5 text-slate-300 italic text-[11px] bg-slate-950/40 py-1 rounded-r">
            {trimmed.slice(2)}
          </blockquote>
        );
      }

      // Unordered list
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        const itemContent = trimmed.slice(2);
        return (
          <li key={idx} className="ml-4 list-disc text-slate-300 text-xs my-0.5">
            {renderInlineMarkdown(itemContent)}
          </li>
        );
      }

      // Numbered list
      if (/^\d+\.\s/.test(trimmed)) {
        const match = trimmed.match(/^(\d+\.)\s(.*)$/);
        return (
          <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-300 my-0.5 ml-2">
            <span className="font-mono text-indigo-400 font-semibold">{match?.[1]}</span>
            <span>{renderInlineMarkdown(match?.[2] || '')}</span>
          </div>
        );
      }

      // Empty line
      if (!trimmed) {
        return <div key={idx} className="h-1.5" />;
      }

      // Regular paragraph
      return (
        <p key={idx} className="text-xs leading-relaxed text-slate-200 my-1">
          {renderInlineMarkdown(line)}
        </p>
      );
    });
  };

  // Helper for bold and code formatting
  const renderInlineMarkdown = (line: string): React.ReactNode => {
    // Split by bold (**text**)
    const parts = line.split(/(\*\*.*?\*\*|`.*?`)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-semibold text-white">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={i} className="px-1 py-0.5 bg-slate-950 text-indigo-300 font-mono text-[11px] rounded border border-slate-800">
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  return (
    <div className={`flex gap-3 text-left ${isAssistant ? 'items-start' : 'items-start flex-row-reverse'}`}>
      
      {/* Avatar */}
      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
        isAssistant
          ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/40'
          : 'bg-slate-800 text-slate-300 border border-slate-700'
      }`}>
        {isAssistant ? <ShieldCheck className="w-4 h-4" /> : <User className="w-4 h-4" />}
      </div>

      {/* Bubble Container */}
      <div className={`max-w-[85%] space-y-1.5 ${isAssistant ? '' : 'text-right'}`}>
        
        {/* Top Header metadata */}
        <div className={`flex items-center gap-2 text-[10px] text-slate-500 ${isAssistant ? '' : 'justify-end'}`}>
          <span className="font-medium text-slate-400">
            {isAssistant ? 'InkGuard AI Assistant' : 'You'}
          </span>
          <span aria-hidden="true">·</span>
          <span className="font-mono">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        {/* Bubble */}
        <div className={`p-3.5 rounded-xl text-left border relative group transition-all ${
          isAssistant
            ? 'bg-slate-900/90 border-slate-800 text-slate-200'
            : 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-950/40'
        }`}>
          <div>{renderFormattedContent(message.content)}</div>

          {/* Copy Button on Hover */}
          <button
            type="button"
            onClick={handleCopy}
            className="absolute right-2 top-2 p-1 text-slate-400 hover:text-white rounded bg-slate-950/60 hover:bg-slate-800 border border-slate-700/50 opacity-0 group-hover:opacity-100 transition-opacity text-[10px]"
            title="Copy message text"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          </button>
        </div>

        {/* Grounded Evidence Citations (if attached to assistant message) */}
        {isAssistant && message.citations && message.citations.length > 0 && (
          <div className="space-y-1.5 pt-1 pl-1">
            <div className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              <span>Grounded Evidence Citations</span>
            </div>
            {message.citations.map((cite, cIdx) => (
              <div key={cIdx} className="p-2 rounded-lg bg-slate-950 border border-slate-800/80 text-[11px] text-slate-300">
                <div className="font-semibold text-slate-200 flex items-center justify-between">
                  <span>{cite.sourceDocument} · {cite.sourceSection}</span>
                  {cite.ruleCode && (
                    <span className="font-mono text-[10px] text-indigo-400">{cite.ruleCode}</span>
                  )}
                </div>
                <blockquote className="mt-1 italic text-slate-400 border-l border-indigo-500/50 pl-2">
                  &ldquo;{cite.quote}&rdquo;
                </blockquote>
              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
};
