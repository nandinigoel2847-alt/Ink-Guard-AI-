import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { AuditStudio } from './components/AuditStudio';
import { EvidenceTrailView } from './components/EvidenceTrailView';
import { BrandRulesManager } from './components/BrandRulesManager';
import { AuditHistory } from './components/AuditHistory';
import { ProjectDossierModal } from './components/ProjectDossierModal';
import { DEFAULT_BRAND_KITS } from './data/defaultBrandKits';
import { AuditResult, BrandKit } from './types';
import { api } from './services/api';
import { ShieldCheck, Award, GraduationCap, Building } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'studio' | 'trail' | 'rules' | 'history'>('studio');
  const [brandKits, setBrandKits] = useState<BrandKit[]>(DEFAULT_BRAND_KITS);
  const [activeKitId, setActiveKitId] = useState<string>('inkloom-master');
  const [history, setHistory] = useState<AuditResult[]>([]);
  const [showDossier, setShowDossier] = useState<boolean>(false);
  const [isAuditing, setIsAuditing] = useState<boolean>(false);

  // Fetch initial data from backend
  useEffect(() => {
    async function loadData() {
      try {
        const kitsRes = await api.getBrandKits();
        if (kitsRes && kitsRes.kits) {
          setBrandKits(kitsRes.kits);
          if (kitsRes.activeKitId) {
            setActiveKitId(kitsRes.activeKitId);
          }
        }

        const histRes = await api.getHistory();
        if (histRes) {
          setHistory(histRes);
        }
      } catch (e) {
        console.warn('Backend loading note (using local cache):', e);
      }
    }
    loadData();
  }, []);

  const activeBrandKit = brandKits.find(k => k.id === activeKitId) || brandKits[0];

  const handleBrandKitChange = async (newId: string) => {
    setActiveKitId(newId);
    try {
      await api.setActiveBrandKit(newId);
    } catch (e) {
      console.warn('Kit sync error:', e);
    }
  };

  const handleRefreshGuidelines = async () => {
    try {
      const kitsRes = await api.getBrandKits();
      if (kitsRes && kitsRes.kits) {
        setBrandKits(kitsRes.kits);
      }
    } catch (e) {
      console.warn('Guidelines refresh error:', e);
    }
  };

  const handleRefreshHistory = async () => {
    try {
      const hist = await api.getHistory();
      if (hist) setHistory(hist);
    } catch (e) {
      console.warn('History refresh error:', e);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* Top Bar Navigation (Strict 3-zone contract) */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenDossier={() => setShowDossier(true)}
        onPrimaryAction={() => {
          setActiveTab('studio');
          // Dispatches custom event so studio runs audit
          const runBtn = document.querySelector('button:has(svg.lucide-play)') as HTMLButtonElement | null;
          if (runBtn) runBtn.click();
        }}
        isAuditing={isAuditing}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeTab === 'studio' && (
          <AuditStudio
            activeBrandKit={activeBrandKit}
            onBrandKitChange={handleBrandKitChange}
            brandKits={brandKits}
            onOpenDossier={() => setShowDossier(true)}
          />
        )}

        {activeTab === 'trail' && (
          <EvidenceTrailView
            activeBrandKit={activeBrandKit}
            onOpenDossier={() => setShowDossier(true)}
          />
        )}

        {activeTab === 'rules' && (
          <BrandRulesManager
            activeBrandKit={activeBrandKit}
            onBrandKitChange={handleBrandKitChange}
            brandKits={brandKits}
            onRefreshGuidelines={handleRefreshGuidelines}
          />
        )}

        {activeTab === 'history' && (
          <AuditHistory
            history={history}
            onRefreshHistory={handleRefreshHistory}
          />
        )}
      </main>

      {/* Enterprise SaaS Footer (Refined & Human-Crafted, Anti-Slop) */}
      <footer className="border-t border-slate-800/80 bg-slate-950/60 py-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap text-center md:text-left">
            <span className="font-semibold text-slate-200">InkGuard AI</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>The Evidence-First Brand Guardian</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-slate-400 italic">&ldquo;Catch the mistake. Show the evidence. Protect the brand.&rdquo;</span>
          </div>

          <div className="flex items-center gap-3 text-slate-400 text-[11px] flex-wrap justify-center">
            <span className="text-indigo-400 font-medium">Inkloom AI</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>Presenter: <strong className="text-slate-200">Nandini Goel</strong> (Individual)</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>ABES Engineering College</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <button
              type="button"
              onClick={() => setShowDossier(true)}
              className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium underline underline-offset-4"
            >
              Project Dossier
            </button>
          </div>
        </div>
      </footer>

      {/* Project Dossier Modal */}
      {showDossier && (
        <ProjectDossierModal onClose={() => setShowDossier(false)} />
      )}
    </div>
  );
}
