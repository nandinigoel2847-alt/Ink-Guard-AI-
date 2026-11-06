import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Trash2, 
  ShieldCheck, 
  Check, 
  FileText, 
  AlertTriangle,
  Building,
  Layers,
  Sparkles
} from 'lucide-react';
import { BrandKit, BrandRule, RuleCategory } from '../types';
import { api } from '../services/api';

interface BrandRulesManagerProps {
  activeBrandKit: BrandKit;
  onBrandKitChange: (kitId: string) => void;
  brandKits: BrandKit[];
  onRefreshGuidelines?: () => void;
}

export const BrandRulesManager: React.FC<BrandRulesManagerProps> = ({
  activeBrandKit,
  onBrandKitChange,
  brandKits,
  onRefreshGuidelines
}) => {
  const [selectedCategory, setSelectedCategory] = useState<RuleCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Form state for adding custom rule
  const [newRule, setNewRule] = useState<Partial<BrandRule>>({
    name: '',
    category: 'factual_claims',
    ruleCode: 'FC-CUST',
    description: '',
    sourceDocument: 'Master Brand Manual 2026',
    sourceSection: 'Policy §2.0',
    approvedCitation: '',
    severity: 'warning',
    humanReviewRequired: 'brand_lead_signoff',
    patternOrKeywords: [''],
    suggestedFixTemplate: ''
  });

  const categories: { key: RuleCategory | 'all'; label: string }[] = [
    { key: 'all', label: 'All Rules' },
    { key: 'factual_claims', label: 'Factual Claims' },
    { key: 'voice_and_tone', label: 'Voice & Tone' },
    { key: 'terminology', label: 'Terminology' },
    { key: 'visual_and_assets', label: 'Visual & Assets' },
    { key: 'accessibility', label: 'Accessibility (WCAG)' },
    { key: 'legal_and_compliance', label: 'Legal & Compliance' }
  ];

  const filteredRules = activeBrandKit.rules.filter(rule => {
    const matchesCat = selectedCategory === 'all' || rule.category === selectedCategory;
    const matchesSearch = 
      rule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.ruleCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.approvedCitation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleCreateRule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRule.name || !newRule.approvedCitation) {
      alert('Please provide rule name and approved evidence citation');
      return;
    }

    try {
      await api.addRule(activeBrandKit.id, newRule);
      setStatusMessage('Rule successfully registered to Evidence Trail registry!');
      setShowAddModal(false);
      onRefreshGuidelines?.();
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to save rule');
    }
  };

  const handleDeleteRule = async (id: string) => {
    if (confirm('Delete this rule from active brand governance registry?')) {
      await api.deleteRule(id, activeBrandKit.id);
      onRefreshGuidelines?.();
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Brand Kit Selector */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-indigo-400 font-medium mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Evidence Authority & Governance Registry</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">Brand Guidelines & Fact Sheets</h2>
            <p className="text-sm text-slate-400 mt-1">
              Every flagged issue in InkGuard AI is grounded in these verified rules and citations.
            </p>
          </div>

          {/* Active Kit Switcher */}
          <div className="flex items-center gap-3">
            <label className="text-xs text-slate-400 font-medium whitespace-nowrap">Active Brand Kit:</label>
            <select
              value={activeBrandKit.id}
              onChange={(e) => onBrandKitChange(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-sm text-slate-100 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
            >
              {brandKits.map(k => (
                <option key={k.id} value={k.id}>
                  {k.name} ({k.industry})
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Brand Rule
            </button>
          </div>
        </div>

        {statusMessage && (
          <div className="mt-4 p-3 bg-emerald-950/60 border border-emerald-800/60 rounded-lg text-xs text-emerald-300 flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}
      </div>

      {/* Fact Sheet Spotlight */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <Building className="w-4 h-4 text-indigo-400" />
            <span>Corporate Fact Verification</span>
          </div>
          <div className="text-xs text-slate-400 space-y-1.5 pt-1">
            <div className="flex justify-between">
              <span className="text-slate-500">Established:</span>
              <span className="font-mono text-slate-200">{activeBrandKit.factSheet.establishedYear}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Headquarters:</span>
              <span className="text-slate-200">{activeBrandKit.factSheet.headquarters}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Contractual SLA:</span>
              <span className="font-mono text-emerald-400">{activeBrandKit.factSheet.slaUptime}</span>
            </div>
          </div>
        </div>

        <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Certified Credentials</span>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {activeBrandKit.factSheet.certifications.map((c, i) => (
              <span key={i} className="text-xs text-slate-300 bg-slate-950 px-2 py-1 rounded border border-slate-800 font-mono">
                {c}
              </span>
            ))}
          </div>
        </div>

        <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <Layers className="w-4 h-4 text-amber-400" />
            <span>Terminology Mappings</span>
          </div>
          <div className="text-xs text-slate-400 space-y-1 pt-1 max-h-24 overflow-y-auto">
            {Object.entries(activeBrandKit.terminologyMap).slice(0, 3).map(([from, to], i) => (
              <div key={i} className="flex items-center justify-between font-mono text-[11px]">
                <span className="text-rose-400 line-through truncate max-w-[120px]">{from}</span>
                <span className="text-slate-600">→</span>
                <span className="text-emerald-400 truncate max-w-[120px]">{to}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Rules Controls: Search & Category Filter */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-lg border border-slate-800 overflow-x-auto text-xs">
          {categories.map(cat => (
            <button
              key={cat.key}
              type="button"
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-colors font-medium ${
                selectedCategory === cat.key
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search rules, codes, citations..."
            className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Rules Table / Cards */}
      <div className="space-y-3">
        {filteredRules.length === 0 ? (
          <div className="p-8 text-center bg-slate-900/30 border border-slate-800 rounded-xl text-slate-400 text-sm">
            No rules match the current filters.
          </div>
        ) : (
          filteredRules.map(rule => (
            <div
              key={rule.id}
              className="p-5 bg-slate-900/50 hover:bg-slate-900/80 border border-slate-800 rounded-xl transition-all space-y-3"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-semibold text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-900/50">
                    {rule.ruleCode}
                  </span>
                  <h4 className="text-sm font-semibold text-white">{rule.name}</h4>
                  <span className="text-xs text-slate-500">·</span>
                  <span className="text-xs text-slate-400 capitalize">{rule.category.replace('_', ' ')}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-xs font-medium ${
                    rule.severity === 'critical' ? 'text-rose-400' :
                    rule.severity === 'warning' ? 'text-amber-400' : 'text-sky-400'
                  }`}>
                    {rule.severity.toUpperCase()}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleDeleteRule(rule.id)}
                    className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                    title="Delete rule"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {rule.description}
              </p>

              {/* Evidence Citation Box */}
              <div className="p-3 bg-slate-950 border border-slate-800/80 rounded-lg text-xs space-y-1">
                <div className="text-[11px] text-slate-400 font-mono">
                  {rule.sourceDocument} · {rule.sourceSection}
                </div>
                <blockquote className="italic text-slate-300 border-l border-indigo-500/50 pl-2.5 py-0.5">
                  {rule.approvedCitation}
                </blockquote>
              </div>

              {/* Keywords and Fix preview */}
              <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-800/60">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">Triggers:</span>
                  <span className="font-mono text-[11px] text-slate-300">
                    {rule.patternOrKeywords?.slice(0, 3).join(', ') || 'Custom Semantic Rule'}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-slate-400">
                  <span className="text-slate-500">Review Gate:</span>
                  <span className="text-indigo-300 font-medium capitalize">
                    {rule.humanReviewRequired.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Rule Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-lg w-full space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-white">Register New Brand Rule</h3>
            <p className="text-xs text-slate-400">
              Add a brand standard, compliance requirement, or forbidden terminology to {activeBrandKit.name}.
            </p>

            <form onSubmit={handleCreateRule} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Rule Name</label>
                <input
                  type="text"
                  required
                  value={newRule.name}
                  onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                  placeholder="e.g. Prohibit Unqualified Zero Downtime Claims"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Category</label>
                  <select
                    value={newRule.category}
                    onChange={(e) => setNewRule({ ...newRule, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-100"
                  >
                    <option value="factual_claims">Factual Claims</option>
                    <option value="voice_and_tone">Voice & Tone</option>
                    <option value="terminology">Terminology</option>
                    <option value="visual_and_assets">Visual & Assets</option>
                    <option value="accessibility">Accessibility</option>
                    <option value="legal_and_compliance">Legal & Compliance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Severity</label>
                  <select
                    value={newRule.severity}
                    onChange={(e) => setNewRule({ ...newRule, severity: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-100"
                  >
                    <option value="critical">Critical (Blocker)</option>
                    <option value="warning">Warning</option>
                    <option value="advisory">Advisory</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Source Document & Section</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={newRule.sourceDocument}
                    onChange={(e) => setNewRule({ ...newRule, sourceDocument: e.target.value })}
                    placeholder="Document Name"
                    className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-100"
                  />
                  <input
                    type="text"
                    value={newRule.sourceSection}
                    onChange={(e) => setNewRule({ ...newRule, sourceSection: e.target.value })}
                    placeholder="Section e.g. §3.2"
                    className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Approved Evidence Citation Quote</label>
                <textarea
                  required
                  rows={2}
                  value={newRule.approvedCitation}
                  onChange={(e) => setNewRule({ ...newRule, approvedCitation: e.target.value })}
                  placeholder="Exact quotation from brand manual or legal policy..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 font-mono text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Keywords / Phrases (comma separated)</label>
                <input
                  type="text"
                  value={newRule.patternOrKeywords?.join(', ')}
                  onChange={(e) => setNewRule({
                    ...newRule,
                    patternOrKeywords: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                  })}
                  placeholder="e.g. 100% bug free, zero downtime, foolproof"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Suggested Replacement Template</label>
                <input
                  type="text"
                  value={newRule.suggestedFixTemplate}
                  onChange={(e) => setNewRule({ ...newRule, suggestedFixTemplate: e.target.value })}
                  placeholder="e.g. 99.9% measured availability per SLA"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-100"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 font-semibold"
                >
                  Save to Registry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
