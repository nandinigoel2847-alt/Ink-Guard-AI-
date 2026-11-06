import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Sparkles, 
  Check, 
  RotateCcw, 
  FileText, 
  ShieldCheck, 
  Award, 
  Columns, 
  AlertTriangle, 
  CheckCircle2, 
  Filter, 
  ArrowRight,
  Send,
  Zap
} from 'lucide-react';
import { AuditResult, BrandKit, EvidenceItem, RuleCategory, SeverityLevel } from '../types';
import { EvidenceCard } from './EvidenceCard';
import { DiffViewer } from './DiffViewer';
import { ComplianceCertificateModal } from './ComplianceCertificateModal';
import { SAMPLE_DRAFTS } from '../data/defaultBrandKits';
import { api } from '../services/api';

interface AuditStudioProps {
  activeBrandKit: BrandKit;
  onBrandKitChange: (id: string) => void;
  brandKits: BrandKit[];
  onOpenDossier: () => void;
}

export const AuditStudio: React.FC<AuditStudioProps> = ({
  activeBrandKit,
  onBrandKitChange,
  brandKits,
  onOpenDossier
}) => {
  const [content, setContent] = useState<string>(SAMPLE_DRAFTS[0].text);
  const [channel, setChannel] = useState<string>('Press Release / Wire');
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [filterSeverity, setFilterSeverity] = useState<SeverityLevel | 'all'>('all');
  const [showDiff, setShowDiff] = useState<boolean>(false);
  const [showCertModal, setShowCertModal] = useState<boolean>(false);
  const [statusNotification, setStatusNotification] = useState<string | null>(null);
  const [signoffNotes, setSignoffNotes] = useState<string>('');
  const [isSigningOff, setIsSigningOff] = useState<boolean>(false);

  const editorRef = useRef<HTMLTextAreaElement>(null);
  const evidenceListRef = useRef<HTMLDivElement>(null);

  // Channels
  const channels = [
    'Press Release / Wire',
    'LinkedIn / Social Media',
    'Website Copy & Landing',
    'Technical Whitepaper',
    'Investor & Financial Memo'
  ];

  // Auto-run analysis on first load
  useEffect(() => {
    handleRunAudit(SAMPLE_DRAFTS[0].text);
  }, []);

  const handleRunAudit = async (textToAudit?: string) => {
    const text = textToAudit !== undefined ? textToAudit : content;
    if (!text || text.trim().length === 0) {
      alert('Please enter or paste draft copy to audit.');
      return;
    }

    setIsAuditing(true);
    setStatusNotification(null);

    try {
      const result = await api.analyzeDraft({
        content: text,
        channel,
        brandKitId: activeBrandKit.id,
        strictness: 'high'
      });
      setAuditResult(result);
      if (result.evidenceItems.length > 0) {
        setSelectedItemId(result.evidenceItems[0].id);
      }
    } catch (err: any) {
      console.error('Audit failed:', err);
      setStatusNotification(`Audit error: ${err.message || 'Check connection'}`);
    } finally {
      setIsAuditing(false);
    }
  };

  const handleApplyFix = (item: EvidenceItem) => {
    if (!auditResult) return;

    const currentText = auditResult.currentText;
    const startIndex = currentText.indexOf(item.flaggedText);

    if (startIndex === -1) {
      // Fallback replace all matching substring
      const updatedText = currentText.replaceAll(item.flaggedText, item.suggestedCorrection);
      setContent(updatedText);
      updateResultAfterFix(item.id, updatedText, 'applied');
      return;
    }

    const before = currentText.slice(0, startIndex);
    const after = currentText.slice(startIndex + item.flaggedText.length);
    const updatedText = before + item.suggestedCorrection + after;

    setContent(updatedText);
    updateResultAfterFix(item.id, updatedText, 'applied');

    setStatusNotification(`Applied approved phrasing for '${item.flaggedText}'`);
    setTimeout(() => setStatusNotification(null), 3500);
  };

  const handleDismiss = (item: EvidenceItem, rationale?: string) => {
    if (!auditResult) return;
    updateResultAfterFix(item.id, auditResult.currentText, 'dismissed', rationale);
    setStatusNotification(`Overruled rule ${item.ruleCode} with reviewer rationale`);
    setTimeout(() => setStatusNotification(null), 3500);
  };

  const updateResultAfterFix = (
    itemId: string,
    newText: string,
    status: 'applied' | 'dismissed',
    rationale?: string
  ) => {
    if (!auditResult) return;

    const updatedItems = auditResult.evidenceItems.map(it => {
      if (it.id === itemId) {
        return {
          ...it,
          isResolved: true,
          resolutionStatus: status,
          dismissRationale: rationale
        };
      }
      return it;
    });

    // Recompute score
    const unresolvedCritical = updatedItems.filter(i => !i.isResolved && i.severity === 'critical').length;
    const unresolvedWarning = updatedItems.filter(i => !i.isResolved && i.severity === 'warning').length;
    const deductions = unresolvedCritical * 25 + unresolvedWarning * 12;
    const newScore = Math.max(10, Math.min(100, 100 - deductions));

    const updatedResult: AuditResult = {
      ...auditResult,
      currentText: newText,
      healthScore: newScore,
      evidenceItems: updatedItems,
      summary: {
        ...auditResult.summary,
        resolvedCount: updatedItems.filter(i => i.isResolved).length
      }
    };

    setAuditResult(updatedResult);
  };

  const handleFixAll = async () => {
    if (!auditResult) return;
    const unResolved = auditResult.evidenceItems.filter(i => !i.isResolved && i.suggestedCorrection);
    if (unResolved.length === 0) return;

    try {
      const { correctedText } = await api.fixAllDraft({
        originalText: auditResult.currentText,
        itemsToApply: unResolved,
        brandKitId: activeBrandKit.id
      });

      setContent(correctedText);

      const allResolved = auditResult.evidenceItems.map(it => ({
        ...it,
        isResolved: true,
        resolutionStatus: 'applied' as const
      }));

      setAuditResult({
        ...auditResult,
        currentText: correctedText,
        healthScore: 98,
        evidenceItems: allResolved,
        summary: {
          ...auditResult.summary,
          resolvedCount: allResolved.length
        }
      });

      setStatusNotification(`Batch resolved all ${unResolved.length} evidence findings!`);
      setTimeout(() => setStatusNotification(null), 4000);
    } catch (err: any) {
      alert('Batch fix error: ' + err.message);
    }
  };

  const handleSignoffAndSeal = async () => {
    if (!auditResult) return;
    setIsSigningOff(true);

    try {
      // Save record to backend history
      await api.saveAuditResult(auditResult);

      // Signoff
      const response = await api.signoffAudit(auditResult.id, {
        signedBy: 'Nandini Goel',
        title: 'Brand Guardian & Lead Architect',
        notes: signoffNotes || 'All critical and warning citations resolved. Verified per Inkloom Master Brand Kit standard.',
        status: 'approved'
      });

      if (response && response.record) {
        setAuditResult(response.record);
      }
      setShowCertModal(true);
    } catch (err: any) {
      console.error('Sign-off error:', err);
      // Still allow viewing certificate
      setShowCertModal(true);
    } finally {
      setIsSigningOff(false);
    }
  };

  const loadSample = (sample: typeof SAMPLE_DRAFTS[0]) => {
    setContent(sample.text);
    setChannel(sample.channel);
    handleRunAudit(sample.text);
  };

  // Filter evidence items
  const filteredEvidence = auditResult?.evidenceItems.filter(item => {
    if (filterSeverity === 'all') return true;
    return item.severity === filterSeverity;
  }) || [];

  const resolvedCount = auditResult?.evidenceItems.filter(i => i.isResolved).length || 0;
  const totalCount = auditResult?.evidenceItems.length || 0;

  return (
    <div className="space-y-6">
      {/* Workbench Header Bar */}
      <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-indigo-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Evidence-First Brand Governance Workbench</span>
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">Audit Studio</h1>
            <p className="text-xs text-slate-400">
              Catch mistakes, substantiate warnings with authoritative evidence, and certify brand compliance.
            </p>
          </div>

          {/* Quick Benchmark Presets */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-400 font-medium">Test Presets:</span>
            {SAMPLE_DRAFTS.map(sample => (
              <button
                key={sample.id}
                type="button"
                onClick={() => loadSample(sample)}
                className="px-3 py-1.5 text-xs bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 rounded-lg transition-colors font-medium whitespace-nowrap"
              >
                {sample.title.split(' ')[0]} {sample.title.split(' ')[1]}
              </button>
            ))}
          </div>
        </div>

        {/* Configuration Row: Channel, Brand Kit, Run Button */}
        <div className="pt-3 border-t border-slate-800/80 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-400 font-medium">Channel:</span>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value)}
                className="bg-slate-950 border border-slate-700 text-xs text-slate-100 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500"
              >
                {channels.map(ch => (
                  <option key={ch} value={ch}>{ch}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-400 font-medium">Brand Kit:</span>
              <select
                value={activeBrandKit.id}
                onChange={(e) => onBrandKitChange(e.target.value)}
                className="bg-slate-950 border border-slate-700 text-xs text-slate-100 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500"
              >
                {brandKits.map(k => (
                  <option key={k.id} value={k.id}>{k.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowDiff(!showDiff)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors flex items-center gap-1.5 ${
                showDiff
                  ? 'bg-indigo-950/80 border-indigo-500 text-indigo-300'
                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              {showDiff ? 'Hide Diff' : 'Compare Diff'}
            </button>

            <button
              type="button"
              onClick={() => handleRunAudit()}
              disabled={isAuditing}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 disabled:opacity-50 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Play className={`w-3.5 h-3.5 ${isAuditing ? 'animate-spin' : ''}`} />
              {isAuditing ? 'Auditing Evidence...' : 'Audit Content'}
            </button>
          </div>
        </div>

        {/* Status Notification Toast */}
        {statusNotification && (
          <div className="p-3 bg-emerald-950/60 border border-emerald-800/60 rounded-lg text-xs text-emerald-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{statusNotification}</span>
            </div>
          </div>
        )}
      </div>

      {/* Diff View (if toggled) */}
      {showDiff && auditResult && (
        <DiffViewer
          originalText={auditResult.originalText}
          currentText={auditResult.currentText}
          onClose={() => setShowDiff(false)}
        />
      )}

      {/* Main Studio Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Interactive Copy Editor (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-400" />
                <span className="font-semibold text-white">Draft Copy Workbench</span>
                <span className="text-slate-500">·</span>
                <span className="text-slate-400">{channel}</span>
              </div>

              <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px]">
                <span>{content.split(/\s+/).filter(Boolean).length} words</span>
                <span>·</span>
                <span>{content.length} chars</span>
              </div>
            </div>

            {/* Textarea editor */}
            <div className="relative">
              <textarea
                ref={editorRef}
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                  if (auditResult) {
                    setAuditResult({
                      ...auditResult,
                      currentText: e.target.value
                    });
                  }
                }}
                rows={16}
                placeholder="Paste or write promotional copy, marketing campaigns, press releases, or product documentation here..."
                className="w-full p-4 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 font-mono leading-relaxed focus:outline-none focus:border-indigo-500 selection:bg-indigo-500/30 resize-y"
              />
            </div>

            {/* Editor Quick Action Bar */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setContent('')}
                  className="px-2.5 py-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors text-[11px]"
                >
                  Clear Draft
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (auditResult) {
                      setContent(auditResult.originalText);
                    }
                  }}
                  className="px-2.5 py-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors text-[11px] flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Revert to Original
                </button>
              </div>

              {auditResult && totalCount > 0 && (
                <button
                  type="button"
                  onClick={handleFixAll}
                  disabled={resolvedCount === totalCount}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <Zap className="w-3.5 h-3.5" />
                  Auto-Apply All Verified Fixes ({totalCount - resolvedCount})
                </button>
              )}
            </div>
          </div>

          {/* Quick Highlight Guide */}
          <div className="p-4 bg-slate-900/40 border border-slate-800/60 rounded-xl text-xs space-y-2">
            <div className="font-semibold text-slate-300">Evidence Trail Inspection Philosophy</div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Every warning flagged in the right panel is supported by specific evidence: rule citation, 
              authoritative document source, why the rule exists, and suggested compliant revision. 
              Review the cards or apply corrections with a single click.
            </p>
          </div>
        </div>

        {/* Right Column: Evidence Trail Inspector (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Brand Health & Resolution Status Card */}
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400 uppercase tracking-wider font-mono">Brand Health Score</div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className={`text-3xl font-extrabold font-mono tracking-tight ${
                    (auditResult?.healthScore || 100) >= 90 ? 'text-emerald-400' :
                    (auditResult?.healthScore || 100) >= 70 ? 'text-amber-400' : 'text-rose-400'
                  }`}>
                    {auditResult?.healthScore ?? 100}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">/ 100</span>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs text-slate-400 font-mono">Governance State</div>
                <div className="text-xs font-semibold mt-1">
                  {resolvedCount === totalCount && totalCount > 0 ? (
                    <span className="text-emerald-400 flex items-center justify-end gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Ready for Sign-Off
                    </span>
                  ) : totalCount === 0 ? (
                    <span className="text-emerald-400">Pristine & Compliant</span>
                  ) : (
                    <span className="text-amber-400">{totalCount - resolvedCount} Open Findings</span>
                  )}
                </div>
              </div>
            </div>

            {/* Health Meter Progress Bar */}
            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
              <div
                className={`h-full transition-all duration-500 ${
                  (auditResult?.healthScore || 100) >= 90 ? 'bg-emerald-500' :
                  (auditResult?.healthScore || 100) >= 70 ? 'bg-amber-500' : 'bg-rose-500'
                }`}
                style={{ width: `${auditResult?.healthScore ?? 100}%` }}
              />
            </div>

            {/* Severity Breakdown Bar */}
            {auditResult && totalCount > 0 && (
              <div className="flex items-center justify-between text-xs text-slate-400 pt-1 font-mono text-[11px]">
                <span className="text-rose-400">{auditResult.summary.criticalCount} Critical</span>
                <span className="text-slate-600">·</span>
                <span className="text-amber-400">{auditResult.summary.warningCount} Warnings</span>
                <span className="text-slate-600">·</span>
                <span className="text-sky-400">{auditResult.summary.advisoryCount} Advisory</span>
                <span className="text-slate-600">·</span>
                <span className="text-emerald-400">{resolvedCount} Fixed</span>
              </div>
            )}

            {/* Sign-Off CTA Button */}
            {auditResult && (
              <div className="pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={handleSignoffAndSeal}
                  disabled={isSigningOff}
                  className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-md shadow-indigo-950"
                >
                  <Award className="w-4 h-4 text-indigo-200" />
                  <span>Sign-Off & Issue Compliance Certificate</span>
                </button>
              </div>
            )}
          </div>

          {/* Severity Filter Controls */}
          {auditResult && totalCount > 0 && (
            <div className="flex items-center justify-between gap-2 p-1 bg-slate-900 rounded-lg border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setFilterSeverity('all')}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  filterSeverity === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                All ({totalCount})
              </button>
              <button
                type="button"
                onClick={() => setFilterSeverity('critical')}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  filterSeverity === 'critical' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Critical ({auditResult.summary.criticalCount})
              </button>
              <button
                type="button"
                onClick={() => setFilterSeverity('warning')}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  filterSeverity === 'warning' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Warnings ({auditResult.summary.warningCount})
              </button>
              <button
                type="button"
                onClick={() => setFilterSeverity('advisory')}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  filterSeverity === 'advisory' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Advisory ({auditResult.summary.advisoryCount})
              </button>
            </div>
          )}

          {/* Evidence Cards List */}
          <div ref={evidenceListRef} className="space-y-4 max-h-[640px] overflow-y-auto pr-1">
            {isAuditing ? (
              <div className="p-8 text-center bg-slate-900/40 border border-slate-800 rounded-xl space-y-3">
                <Play className="w-6 h-6 text-indigo-400 animate-spin mx-auto" />
                <div className="text-xs font-medium text-slate-300">Analyzing against Brand Guidelines & Facts...</div>
                <div className="text-[11px] text-slate-500 font-mono">Running Gemini 3.8 Flash + Deterministic Evidence Matching</div>
              </div>
            ) : !auditResult || totalCount === 0 ? (
              <div className="p-8 text-center bg-slate-900/40 border border-slate-800 rounded-xl space-y-2">
                <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="text-sm font-semibold text-white">No Violations Detected</h4>
                <p className="text-xs text-slate-400">
                  This copy satisfies all active brand voice, factual claims, terminology, and compliance guidelines.
                </p>
              </div>
            ) : filteredEvidence.length === 0 ? (
              <div className="p-6 text-center bg-slate-900/40 border border-slate-800 rounded-xl text-xs text-slate-400">
                No evidence items match the selected severity filter.
              </div>
            ) : (
              filteredEvidence.map(item => (
                <EvidenceCard
                  key={item.id}
                  item={item}
                  isSelected={selectedItemId === item.id}
                  onSelect={() => setSelectedItemId(item.id)}
                  onApplyFix={handleApplyFix}
                  onDismiss={handleDismiss}
                />
              ))
            )}
          </div>

        </div>

      </div>

      {/* Compliance Certificate Modal */}
      {showCertModal && auditResult && (
        <ComplianceCertificateModal
          audit={auditResult}
          onClose={() => setShowCertModal(false)}
        />
      )}
    </div>
  );
};
