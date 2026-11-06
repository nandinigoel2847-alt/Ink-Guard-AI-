import React from 'react';
import { ShieldCheck, Play, Award, FileText, Download } from 'lucide-react';

interface NavbarProps {
  activeTab: 'studio' | 'trail' | 'rules' | 'history';
  setActiveTab: (tab: 'studio' | 'trail' | 'rules' | 'history') => void;
  onOpenDossier: () => void;
  onPrimaryAction: () => void;
  isAuditing?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenDossier,
  onPrimaryAction,
  isAuditing = false
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-6 py-3.5">
        
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <button 
            type="button"
            onClick={() => setActiveTab('studio')}
            className="text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 hover:text-indigo-300 transition-colors"
          >
            InkGuard AI
          </button>
        </div>

        {/* Zone 2: 4–5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-400">
          <button
            type="button"
            onClick={() => setActiveTab('studio')}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 ${
              activeTab === 'studio' 
                ? 'text-white border-b-2 border-indigo-500 font-semibold' 
                : 'hover:text-slate-200'
            }`}
          >
            Audit Studio
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('trail')}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 ${
              activeTab === 'trail' 
                ? 'text-white border-b-2 border-indigo-500 font-semibold' 
                : 'hover:text-slate-200'
            }`}
          >
            Evidence Trail
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('rules')}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 ${
              activeTab === 'rules' 
                ? 'text-white border-b-2 border-indigo-500 font-semibold' 
                : 'hover:text-slate-200'
            }`}
          >
            Brand Rules
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 ${
              activeTab === 'history' 
                ? 'text-white border-b-2 border-indigo-500 font-semibold' 
                : 'hover:text-slate-200'
            }`}
          >
            Audit Registry
          </button>

          <button
            type="button"
            onClick={onOpenDossier}
            className="text-slate-400 hover:text-indigo-400 transition-colors whitespace-nowrap shrink-0 py-1 flex items-center gap-1.5"
          >
            <Award className="w-3.5 h-3.5 text-indigo-400" />
            Project Dossier
          </button>
        </nav>

        {/* Zone 3: 1 primary action + download */}
        <div className="flex items-center gap-2.5 shrink-0">
          <a
            href="/api/download/project"
            download="InkGuard-AI-SourceCode-NandiniGoel-ABES.zip"
            className="px-3 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-sm"
            title="Download Complete Source Code (.zip)"
          >
            <Download className="w-3.5 h-3.5 text-indigo-400" />
            <span>Download ZIP</span>
          </a>

          <button
            type="button"
            onClick={onPrimaryAction}
            disabled={isAuditing}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 disabled:opacity-50 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-sm shadow-indigo-950"
          >
            <Play className={`w-3.5 h-3.5 ${isAuditing ? 'animate-spin' : ''}`} />
            {isAuditing ? 'Analyzing Draft...' : 'Run Live Audit'}
          </button>
        </div>

      </div>
    </header>
  );
};
