import React, { useState } from 'react';
import { 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  Check, 
  BookOpen, 
  UserCheck, 
  ShieldAlert, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  ArrowRight,
  X
} from 'lucide-react';
import { EvidenceItem } from '../types';

interface EvidenceCardProps {
  item: EvidenceItem;
  isSelected?: boolean;
  onSelect?: () => void;
  onApplyFix: (item: EvidenceItem) => void;
  onDismiss: (item: EvidenceItem, rationale?: string) => void;
}

export const EvidenceCard: React.FC<EvidenceCardProps> = ({
  item,
  isSelected = false,
  onSelect,
  onApplyFix,
  onDismiss
}) => {
  const [showCitationDetails, setShowCitationDetails] = useState(false);
  const [showDismissInput, setShowDismissInput] = useState(false);
  const [dismissReason, setDismissReason] = useState('');

  // Human Review Label Mapper
  const getReviewBadge = (req: string) => {
    switch (req) {
      case 'legal_counsel_review':
        return { label: 'Legal Counsel Review Required', icon: ShieldAlert, color: 'text-amber-400' };
      case 'brand_lead_signoff':
        return { label: 'Brand Lead Sign-Off Required', icon: UserCheck, color: 'text-indigo-400' };
      case 'subject_matter_expert':
        return { label: 'SME Review Required', icon: UserCheck, color: 'text-sky-400' };
      default:
        return { label: 'Auto-Fixable by Author', icon: Check, color: 'text-emerald-400' };
    }
  };

  const reviewBadge = getReviewBadge(item.humanReviewRequired);
  const ReviewIcon = reviewBadge.icon;

  // Category clean name
  const formatCategory = (cat: string) => {
    return cat.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  return (
    <div
      onClick={onSelect}
      className={`relative p-5 transition-all duration-150 border rounded-xl text-left ${
        isSelected
          ? 'bg-slate-900/90 border-indigo-500/80 shadow-lg shadow-indigo-950/40 ring-1 ring-indigo-500/50'
          : 'bg-slate-900/40 hover:bg-slate-900/70 border-slate-800'
      } ${item.isResolved ? 'opacity-70 border-emerald-900/40 bg-emerald-950/10' : ''}`}
    >
      {/* Header Metadata Row: Unboxed text separated by subtle middots */}
      <div className="flex items-center justify-between gap-3 mb-2.5 text-xs text-slate-400">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`font-medium ${
            item.severity === 'critical' ? 'text-rose-400' :
            item.severity === 'warning' ? 'text-amber-400' : 'text-sky-400'
          }`}>
            {item.severity.toUpperCase()}
          </span>
          <span aria-hidden="true">·</span>
          <span className="text-slate-300">{formatCategory(item.category)}</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono text-slate-400">{item.ruleCode}</span>
        </div>

        {item.isResolved ? (
          <span className="text-xs font-medium text-emerald-400 flex items-center gap-1">
            <Check className="w-3.5 h-3.5" /> Resolved ({item.resolutionStatus})
          </span>
        ) : (
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <ReviewIcon className={`w-3.5 h-3.5 ${reviewBadge.color}`} />
            <span className={reviewBadge.color}>{reviewBadge.label}</span>
          </div>
        )}
      </div>

      {/* 1. What was Flagged */}
      <div className="mb-3">
        <div className="text-xs text-slate-500 uppercase tracking-wider mb-1 font-mono">1. What Was Flagged</div>
        <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 font-mono text-sm text-rose-300 break-words">
          &ldquo;{item.flaggedText}&rdquo;
        </div>
      </div>

      {/* 2. Why it was Flagged */}
      <div className="mb-3">
        <div className="text-xs text-slate-500 uppercase tracking-wider mb-1 font-mono">2. Why It Was Flagged</div>
        <p className="text-sm text-slate-200 leading-relaxed">
          {item.reason}
        </p>
      </div>

      {/* 3. The Evidence Source Citation */}
      <div className="mb-3.5 p-3 rounded-lg bg-slate-950/80 border border-slate-800">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
          <div className="flex items-center gap-1.5 font-medium text-indigo-300">
            <BookOpen className="w-3.5 h-3.5" />
            <span>3. Approved Evidence Source</span>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowCitationDetails(!showCitationDetails);
            }}
            className="hover:text-slate-200 text-slate-400 flex items-center gap-1 text-[11px] transition-colors"
          >
            {showCitationDetails ? 'Less' : 'Details'}
            {showCitationDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>

        <div className="text-xs text-slate-300 font-medium">
          {item.sourceDocument} <span className="text-slate-500">·</span> {item.sourceSection}
        </div>

        <blockquote className="mt-2 text-xs italic text-slate-400 border-l border-indigo-500/40 pl-2.5 py-0.5 leading-relaxed">
          {item.approvedCitation}
        </blockquote>

        {showCitationDetails && (
          <div className="mt-2.5 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 space-y-1">
            <p><strong>Rule Reference:</strong> {item.ruleCode}</p>
            <p><strong>Audit Standard:</strong> ISO 27001 / Brand Authority Matrix</p>
            <p><strong>Traceability Index:</strong> Approved by Central Brand Governance Board</p>
          </div>
        )}
      </div>

      {/* 4. Suggested Correction & Action Controls */}
      {!item.isResolved && (
        <div>
          <div className="text-xs text-slate-500 uppercase tracking-wider mb-1 font-mono">4. Suggested Correction</div>
          <div className="flex items-center gap-2 mb-3 p-2.5 rounded-lg bg-indigo-950/30 border border-indigo-900/50 text-sm text-indigo-200 font-mono">
            <ArrowRight className="w-4 h-4 text-indigo-400 shrink-0" />
            <span className="break-words">{item.suggestedCorrection || '(Manual editorial revision required)'}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800/80">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onApplyFix(item);
                }}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Check className="w-3.5 h-3.5" />
                Apply Correction
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDismissInput(!showDismissInput);
                }}
                className="px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 rounded-lg transition-colors"
              >
                Dismiss / Override
              </button>
            </div>

            <span className="text-[11px] text-slate-500 font-mono">
              Pos: {item.startIndex}–{item.endIndex}
            </span>
          </div>

          {/* Dismiss input */}
          {showDismissInput && (
            <div className="mt-3 p-2.5 bg-slate-950 border border-slate-800 rounded-lg">
              <label className="block text-[11px] text-slate-400 mb-1">
                Provide justification for overruling brand rule (logged to compliance audit trail):
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={dismissReason}
                  onChange={(e) => setDismissReason(e.target.value)}
                  placeholder="e.g. Authorized exception approved by CMO for Q4 campaign..."
                  className="w-full px-2.5 py-1 text-xs bg-slate-900 border border-slate-700 rounded text-slate-100 focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDismiss(item, dismissReason || 'Dismissed by authorized reviewer');
                    setShowDismissInput(false);
                  }}
                  className="px-3 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded font-medium shrink-0"
                >
                  Confirm
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
