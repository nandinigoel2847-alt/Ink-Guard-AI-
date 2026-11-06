import React, { useState } from 'react';
import { 
  History, 
  ShieldCheck, 
  Award, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  Search,
  Filter,
  Download
} from 'lucide-react';
import { AuditResult } from '../types';
import { ComplianceCertificateModal } from './ComplianceCertificateModal';

interface AuditHistoryProps {
  history: AuditResult[];
  onSelectAuditForReview?: (audit: AuditResult) => void;
  onRefreshHistory?: () => void;
}

export const AuditHistory: React.FC<AuditHistoryProps> = ({
  history,
  onSelectAuditForReview,
  onRefreshHistory
}) => {
  const [selectedAuditForCert, setSelectedAuditForCert] = useState<AuditResult | null>(null);
  const [filterChannel, setFilterChannel] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const channels = ['all', ...Array.from(new Set(history.map(h => h.channel)))];

  const filteredHistory = history.filter(item => {
    const matchesChannel = filterChannel === 'all' || item.channel === filterChannel;
    const matchesSearch = 
      item.originalText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.currentText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.brandKitName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.signoff?.certificateHash && item.signoff.certificateHash.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesChannel && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-indigo-400 font-medium mb-1">
              <History className="w-4 h-4" />
              <span>Immutable Governance Registry</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">Audit History & Compliance Registry</h2>
            <p className="text-sm text-slate-400 mt-1">
              Record of audited collaterals, evidence trail resolutions, and digital brand sign-offs.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono">
              Total Audits Logged: <strong className="text-slate-100">{history.length}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500" />
          <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-lg border border-slate-800 text-xs">
            {channels.map(ch => (
              <button
                key={ch}
                type="button"
                onClick={() => setFilterChannel(ch)}
                className={`px-3 py-1.5 rounded-md font-medium capitalize transition-colors ${
                  filterChannel === ch ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {ch === 'all' ? 'All Channels' : ch}
              </button>
            ))}
          </div>
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search copy, brand kits, hashes..."
            className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* History Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-medium font-mono">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Channel / Brand Kit</th>
                <th className="py-3 px-4">Content Preview</th>
                <th className="py-3 px-4">Health Score</th>
                <th className="py-3 px-4">Evidence Findings</th>
                <th className="py-3 px-4">Sign-Off Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No audit records found matching query.
                  </td>
                </tr>
              ) : (
                filteredHistory.map(audit => (
                  <tr key={audit.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-slate-400 whitespace-nowrap">
                      {new Date(audit.timestamp).toLocaleDateString()}<br/>
                      <span className="text-[10px] text-slate-500">{new Date(audit.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-semibold text-slate-200">{audit.channel}</div>
                      <div className="text-[11px] text-slate-400">{audit.brandKitName}</div>
                    </td>

                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="text-slate-300 truncate font-mono text-[11px]">
                        {audit.currentText || audit.originalText}
                      </p>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`font-mono font-bold text-sm ${
                        audit.healthScore >= 90 ? 'text-emerald-400' :
                        audit.healthScore >= 70 ? 'text-amber-400' : 'text-rose-400'
                      }`}>
                        {audit.healthScore}/100
                      </span>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap font-mono text-[11px]">
                      <span className="text-rose-400">{audit.summary.criticalCount} crit</span> · {' '}
                      <span className="text-amber-400">{audit.summary.warningCount} warn</span> · {' '}
                      <span className="text-emerald-400">{audit.summary.resolvedCount || 0} fixed</span>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {audit.signoff ? (
                        <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approved ({audit.signoff.signedBy})</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                          <span>Pending Sign-Off</span>
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={`/api/download/report/${audit.id}`}
                          download={`InkGuard-Report-${audit.id}.md`}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                          title="Download Markdown Report"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </a>
                        <button
                          type="button"
                          onClick={() => setSelectedAuditForCert(audit)}
                          className="px-2.5 py-1.5 bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-300 rounded-lg transition-colors font-medium flex items-center gap-1.5"
                        >
                          <Award className="w-3.5 h-3.5" />
                          <span>Certificate</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Compliance Certificate Modal */}
      {selectedAuditForCert && (
        <ComplianceCertificateModal
          audit={selectedAuditForCert}
          onClose={() => setSelectedAuditForCert(null)}
        />
      )}
    </div>
  );
};
