import React from 'react';
import { ShieldCheck, Check, Printer, Copy, X, FileText, QrCode, Award } from 'lucide-react';
import { AuditResult } from '../types';

interface ComplianceCertificateModalProps {
  audit: AuditResult;
  onClose: () => void;
}

export const ComplianceCertificateModal: React.FC<ComplianceCertificateModalProps> = ({
  audit,
  onClose
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopyHash = () => {
    navigator.clipboard.writeText(audit.signoff?.certificateHash || audit.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-2xl w-full p-8 shadow-2xl space-y-6 text-slate-100 relative print:bg-white print:text-black print:border-black">
        
        {/* Close Button (Hidden on Print) */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors print:hidden"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Certificate Header */}
        <div className="text-center border-b border-slate-800 pb-5 space-y-1">
          <div className="w-12 h-12 mx-auto rounded-xl bg-indigo-950/80 border border-indigo-500/50 flex items-center justify-center text-indigo-400 mb-2 print:border-black print:text-black">
            <Award className="w-6 h-6" />
          </div>
          <div className="text-xs font-mono uppercase tracking-widest text-indigo-400 font-semibold print:text-black">
            InkGuard AI · Official Governance Record
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white print:text-black">
            Certificate of Brand Compliance
          </h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto print:text-neutral-700">
            This certifies that the referenced content has undergone multi-dimensional evidence trail verification and brand guideline alignment.
          </p>
        </div>

        {/* Certificate Details Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs bg-slate-950/70 p-4 rounded-xl border border-slate-800/80 print:bg-neutral-100 print:border-black">
          <div>
            <span className="text-slate-500 block">Certificate ID</span>
            <span className="font-mono font-semibold text-slate-200 print:text-black">
              {audit.signoff?.certificateHash || `INKG-${audit.id.slice(-8).toUpperCase()}`}
            </span>
          </div>

          <div>
            <span className="text-slate-500 block">Channel / Context</span>
            <span className="font-semibold text-slate-200 print:text-black">{audit.channel}</span>
          </div>

          <div>
            <span className="text-slate-500 block">Brand Kit Standard</span>
            <span className="font-semibold text-slate-200 print:text-black">{audit.brandKitName}</span>
          </div>

          <div>
            <span className="text-slate-500 block">Health Score</span>
            <span className="font-mono font-bold text-emerald-400 text-sm print:text-black">
              {audit.healthScore}/100
            </span>
          </div>

          <div>
            <span className="text-slate-500 block">Evidence Findings</span>
            <span className="font-mono text-slate-200 print:text-black">
              {audit.summary.totalFlagged} Checked · {audit.summary.resolvedCount || audit.evidenceItems.filter(i => i.isResolved).length} Governed
            </span>
          </div>

          <div>
            <span className="text-slate-500 block">Verification Engine</span>
            <span className="font-mono text-indigo-400 print:text-black">
              {audit.aiProvider}
            </span>
          </div>
        </div>

        {/* Governed Text Snippet */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold text-slate-300">Audited & Certified Copy</span>
            <span className="font-mono text-[11px] text-slate-500">{audit.currentText.length} characters</span>
          </div>
          <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 leading-relaxed max-h-40 overflow-y-auto whitespace-pre-wrap print:max-h-none print:text-black print:bg-white print:border-black">
            {audit.currentText}
          </div>
        </div>

        {/* Sign-Off Seal & Nandini Goel Signature Block */}
        <div className="p-4 rounded-xl bg-slate-950 border border-indigo-950/60 flex flex-col sm:flex-row items-center justify-between gap-4 print:border-black print:bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="text-xs">
              <div className="font-bold text-white print:text-black">
                {audit.signoff?.signedBy || 'Nandini Goel'}
              </div>
              <div className="text-slate-400 print:text-neutral-700">
                {audit.signoff?.title || 'Brand Guardian & Compliance Lead'}
              </div>
              <div className="text-[11px] text-indigo-400 print:text-black font-medium">
                {audit.signoff?.organization || 'Inkloom AI · ABES Engineering College'}
              </div>
            </div>
          </div>

          <div className="text-right text-xs">
            <div className="text-slate-500">Certified Timestamp</div>
            <div className="font-mono text-slate-300 print:text-black">
              {new Date(audit.signoff?.signedAt || audit.timestamp).toLocaleString()}
            </div>
            <div className="text-[10px] text-emerald-400 font-mono mt-0.5">
              STATUS: AUDIT VERIFIED
            </div>
          </div>
        </div>

        {/* Modal Controls (Hidden in Print) */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-800 print:hidden">
          <button
            type="button"
            onClick={handleCopyHash}
            className="px-3.5 py-2 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg flex items-center gap-1.5 transition-colors font-medium"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Hash Copied' : 'Copy Verification Hash'}
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Certificate
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-lg transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
