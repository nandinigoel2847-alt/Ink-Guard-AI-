import React, { useState } from 'react';
import { Columns, Eye, Copy, Check, ArrowRight } from 'lucide-react';

interface DiffViewerProps {
  originalText: string;
  currentText: string;
  onClose?: () => void;
}

export const DiffViewer: React.FC<DiffViewerProps> = ({
  originalText,
  currentText,
  onClose
}) => {
  const [viewMode, setViewMode] = useState<'split' | 'inline'>('split');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(currentText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simple token-based diff helper
  const renderInlineDiff = () => {
    const origWords = originalText.split(/\s+/);
    const currWords = currentText.split(/\s+/);

    return (
      <div className="p-4 bg-slate-950 font-mono text-sm leading-relaxed rounded-lg border border-slate-800 whitespace-pre-wrap">
        <div className="text-xs text-slate-500 mb-2 font-sans">
          Inline Inspection (Green represents accepted evidence-backed fixes; red strikethrough was flagged and removed):
        </div>
        <div>
          {currWords.map((word, idx) => {
            const isDifferent = !origWords.includes(word);
            return (
              <span
                key={idx}
                className={`inline-block mr-1.5 ${
                  isDifferent
                    ? 'bg-emerald-950/60 text-emerald-300 px-1 py-0.5 rounded border border-emerald-800/40'
                    : 'text-slate-200'
                }`}
              >
                {word}
              </span>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
      {/* Top Controls */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Columns className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-semibold text-white">Evidence-Driven Revision Diff</h3>
          <span className="text-xs text-slate-500">·</span>
          <span className="text-xs text-slate-400 font-mono">
            {originalText.length === currentText.length
              ? 'No textual delta'
              : `${Math.abs(currentText.length - originalText.length)} chars modified`}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center p-0.5 bg-slate-950 rounded-lg border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => setViewMode('split')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                viewMode === 'split' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              Side-by-Side
            </button>
            <button
              type="button"
              onClick={() => setViewMode('inline')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                viewMode === 'inline' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              Inline Highlighting
            </button>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg flex items-center gap-1.5 transition-colors font-medium"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy Revised'}
          </button>
        </div>
      </div>

      {/* Content Rendering */}
      {viewMode === 'split' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
              <span className="font-mono text-rose-400">ORIGINAL DRAFT (UNGOVERNED)</span>
              <span className="text-slate-500">{originalText.split(/\s+/).filter(Boolean).length} words</span>
            </div>
            <div className="p-4 bg-slate-950/70 border border-slate-800/80 rounded-lg text-sm text-slate-300 leading-relaxed font-mono min-h-[160px] whitespace-pre-wrap max-h-[340px] overflow-y-auto">
              {originalText}
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
              <span className="font-mono text-emerald-400">CORRECTED & GOVERNED DRAFT</span>
              <span className="text-slate-500">{currentText.split(/\s+/).filter(Boolean).length} words</span>
            </div>
            <div className="p-4 bg-slate-950/70 border border-indigo-900/30 rounded-lg text-sm text-slate-100 leading-relaxed font-mono min-h-[160px] whitespace-pre-wrap max-h-[340px] overflow-y-auto">
              {currentText}
            </div>
          </div>
        </div>
      ) : (
        renderInlineDiff()
      )}
    </div>
  );
};
