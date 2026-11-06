import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Search, 
  BookOpen, 
  Check, 
  ArrowRight, 
  UserCheck, 
  ShieldAlert, 
  Sparkles,
  Layers,
  FileCheck,
  Send
} from 'lucide-react';
import { BrandKit, EvidenceItem, RuleCategory } from '../types';
import { evaluateBrandRules } from '../lib/ruleEngine';
import { EvidenceCard } from './EvidenceCard';

interface EvidenceTrailViewProps {
  activeBrandKit: BrandKit;
  onApplyFixToStudio?: (text: string) => void;
  onOpenDossier: () => void;
}

export const EvidenceTrailView: React.FC<EvidenceTrailViewProps> = ({
  activeBrandKit,
  onOpenDossier
}) => {
  const [testPhrase, setTestPhrase] = useState(
    'Our magic ai guarantees 100% uptime with zero downtime forever and is 100% bug-free for all enterprises.'
  );
  const [testResults, setTestResults] = useState<EvidenceItem[]>(() => 
    evaluateBrandRules(
      'Our magic ai guarantees 100% uptime with zero downtime forever and is 100% bug-free for all enterprises.',
      activeBrandKit
    )
  );

  const handleTestEvaluation = () => {
    const results = evaluateBrandRules(testPhrase, activeBrandKit);
    setTestResults(results);
  };

  return (
    <div className="space-y-6">
      {/* Evidence Trail Architecture Banner */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-indigo-400 font-medium mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Core Architectural Differentiator</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">The 5-Pillar Evidence Trail</h2>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Unlike generic spell-checkers or black-box AI tools, InkGuard AI substantiates every single warning 
              with traceable corporate governance citations, transparent rationale, and human-in-the-loop review gates.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenDossier}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap self-start md:self-auto"
          >
            View Architecture Blueprint
          </button>
        </div>

        {/* 5 Pillars Visual Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-4 border-t border-slate-800/80">
          <div className="p-4 bg-slate-950 border border-slate-800/90 rounded-lg space-y-1">
            <span className="font-mono text-xs font-semibold text-rose-400">Pillar 1</span>
            <div className="font-bold text-white text-xs">What Was Flagged</div>
            <p className="text-[11px] text-slate-400 leading-normal">
              Exact source string identified with character offset coordinates in the draft.
            </p>
          </div>

          <div className="p-4 bg-slate-950 border border-slate-800/90 rounded-lg space-y-1">
            <span className="font-mono text-xs font-semibold text-amber-400">Pillar 2</span>
            <div className="font-bold text-white text-xs">Why It Was Flagged</div>
            <p className="text-[11px] text-slate-400 leading-normal">
              Precise explanation of the brand risk, misleading claim, or tone divergence.
            </p>
          </div>

          <div className="p-4 bg-slate-950 border border-slate-800/90 rounded-lg space-y-1">
            <span className="font-mono text-xs font-semibold text-indigo-400">Pillar 3</span>
            <div className="font-bold text-white text-xs">Evidence Citation</div>
            <p className="text-[11px] text-slate-400 leading-normal">
              Direct authoritative quotation from official brand manual, SLA, or policy.
            </p>
          </div>

          <div className="p-4 bg-slate-950 border border-slate-800/90 rounded-lg space-y-1">
            <span className="font-mono text-xs font-semibold text-emerald-400">Pillar 4</span>
            <div className="font-bold text-white text-xs">Suggested Correction</div>
            <p className="text-[11px] text-slate-400 leading-normal">
              Pre-approved compliant wording with 1-click replacement capability.
            </p>
          </div>

          <div className="p-4 bg-slate-950 border border-slate-800/90 rounded-lg space-y-1">
            <span className="font-mono text-xs font-semibold text-sky-400">Pillar 5</span>
            <div className="font-bold text-white text-xs">Human Review Gate</div>
            <p className="text-[11px] text-slate-400 leading-normal">
              Determines if author can auto-resolve or if Brand Lead / Legal sign-off is mandatory.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Evidence Trail Tester Sandbox */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Interactive Evidence Trail Sandbox</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Active Kit: <strong className="text-slate-200">{activeBrandKit.name}</strong>
          </span>
        </div>

        <p className="text-xs text-slate-400">
          Enter any marketing tagline, product claim, or promotional headline below to instantly inspect how the Evidence Trail substantiates issues:
        </p>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={testPhrase}
            onChange={(e) => setTestPhrase(e.target.value)}
            placeholder="Type any promotional claim e.g. '100% uptime with zero downtime'..."
            className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
          />
          <button
            type="button"
            onClick={handleTestEvaluation}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 shrink-0 shadow-sm"
          >
            <Send className="w-3.5 h-3.5" />
            Inspect Evidence Trail
          </button>
        </div>

        {/* Results */}
        <div className="pt-2">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
            <span>Evidence Findings Generated: <strong className="text-slate-100">{testResults.length}</strong></span>
            {testResults.length > 0 && (
              <span className="text-indigo-400 font-mono">All 5 Pillars Active</span>
            )}
          </div>

          {testResults.length === 0 ? (
            <div className="p-8 text-center bg-slate-950/50 border border-slate-800/80 rounded-xl text-xs text-slate-400">
              No brand or factual violations detected for this phrase.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {testResults.map(item => (
                <EvidenceCard
                  key={item.id}
                  item={item}
                  onApplyFix={(it) => {
                    const updated = testPhrase.replace(it.flaggedText, it.suggestedCorrection);
                    setTestPhrase(updated);
                    setTestResults(evaluateBrandRules(updated, activeBrandKit));
                  }}
                  onDismiss={(it) => {
                    setTestResults(testResults.filter(i => i.id !== it.id));
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
