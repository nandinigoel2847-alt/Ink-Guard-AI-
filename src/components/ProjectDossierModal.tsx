import React from 'react';
import { 
  X, 
  Award, 
  ShieldCheck, 
  CheckCircle2, 
  Building, 
  GraduationCap, 
  User, 
  Layers, 
  Cpu, 
  ExternalLink,
  Download 
} from 'lucide-react';

interface ProjectDossierModalProps {
  onClose: () => void;
}

export const ProjectDossierModal: React.FC<ProjectDossierModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-3xl w-full p-8 shadow-2xl space-y-6 text-slate-100 relative max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Banner with Generated Studio Image */}
        <div className="relative rounded-xl overflow-hidden border border-slate-800 h-44 bg-slate-950">
          <img
            src="/src/assets/images/brand_guardian_hero_1793969830284.jpg"
            alt="InkGuard AI Studio"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-45"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent flex flex-col justify-end p-6">
            <div className="text-xs font-mono uppercase tracking-widest text-indigo-400 font-semibold mb-1">
              Project Dossier & Innovation Blueprint
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              INKGUARD AI — THE EVIDENCE-FIRST BRAND GUARDIAN
            </h2>
            <p className="text-xs text-slate-300 italic">
              &ldquo;Catch the mistake. Show the evidence. Protect the brand.&rdquo;
            </p>
          </div>
        </div>

        {/* Presenter & Academic Credentials */}
        <div className="p-5 bg-slate-950/80 border border-slate-800 rounded-xl grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="flex items-center gap-3">
            <img
              src="/src/assets/images/nandini_goel_profile_1793969830585.jpg"
              alt="Nandini Goel"
              referrerPolicy="no-referrer"
              className="w-14 h-14 rounded-full object-cover border-2 border-indigo-500/50 shrink-0"
            />
            <div>
              <div className="text-xs text-slate-400">Presenter & Architect</div>
              <div className="font-bold text-white text-sm">Nandini Goel</div>
              <div className="text-[11px] text-indigo-400 font-mono">Participation: Individual</div>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
              <span>Academic Institution</span>
            </div>
            <div className="font-semibold text-white text-xs">
              ABES Engineering College
            </div>
            <div className="text-[11px] text-slate-400">
              Ghaziabad, Uttar Pradesh, India
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Building className="w-3.5 h-3.5 text-emerald-400" />
              <span>Innovating Entity</span>
            </div>
            <div className="font-semibold text-white text-xs">
              Inkloom AI
            </div>
            <div className="text-[11px] text-slate-400">
              Enterprise Governance Platform
            </div>
          </div>
        </div>

        {/* The Core Problem & Philosophy */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span>The Strategic Differentiator: The Evidence Trail</span>
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Organisations publish content through hundreds of employees, agencies, and generative AI models. 
            Traditional spell-checkers and linter tools only suggest arbitrary grammar edits without legal or brand authority. 
            <strong> InkGuard AI changes this equation by mandating verifiable evidence for every single warning.</strong>
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 pt-2">
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs">
              <div className="font-mono text-indigo-400 text-[10px] mb-1">01. WHAT</div>
              <div className="font-semibold text-slate-200">Exact Flagged Text</div>
              <div className="text-[11px] text-slate-400 mt-1">Character offset tracking in source copy.</div>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs">
              <div className="font-mono text-indigo-400 text-[10px] mb-1">02. WHY</div>
              <div className="font-semibold text-slate-200">Violation Reason</div>
              <div className="text-[11px] text-slate-400 mt-1">Clear risk assessment and severity level.</div>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs">
              <div className="font-mono text-indigo-400 text-[10px] mb-1">03. SOURCE</div>
              <div className="font-semibold text-slate-200">Evidence Citation</div>
              <div className="text-[11px] text-slate-400 mt-1">Direct quote from official Brand Guidelines.</div>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs">
              <div className="font-mono text-indigo-400 text-[10px] mb-1">04. CORRECTION</div>
              <div className="font-semibold text-slate-200">1-Click Replacement</div>
              <div className="text-[11px] text-slate-400 mt-1">Context-aware compliant phrasing.</div>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs">
              <div className="font-mono text-indigo-400 text-[10px] mb-1">05. GATE</div>
              <div className="font-semibold text-slate-200">Human Review</div>
              <div className="text-[11px] text-slate-400 mt-1">Legal counsel or brand lead sign-off.</div>
            </div>
          </div>
        </div>

        {/* Technical Architecture */}
        <div className="space-y-3 pt-2 border-t border-slate-800">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-emerald-400" />
            <span>Full-Stack Architecture & Intelligence Stack</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-lg space-y-1.5">
              <div className="font-semibold text-indigo-300">Backend & AI Runtime</div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Powered by Express server running <strong>Google Gemini 3.8 Flash</strong> via the official 
                <code className="text-slate-200 mx-1">@google/genai</code> SDK, with robust server-side telemetry and structured JSON schema evaluation.
              </p>
            </div>

            <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-lg space-y-1.5">
              <div className="font-semibold text-emerald-300">Deterministic Fallback Guardian</div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Zero-failure architecture: If external AI services encounter rate limits or network latency, the local 
                deterministic regex & knowledge base engine enforces all brand rules without interruption.
              </p>
            </div>
          </div>
        </div>

        {/* Footer info & Download Action */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800 text-xs text-slate-400">
          <div>
            Built for <strong>Inkloom AI</strong> by <strong>Nandini Goel</strong> (ABESEC).
          </div>
          <div className="flex items-center gap-2.5">
            <a
              href="/api/download/project"
              download="InkGuard-AI-SourceCode-NandiniGoel-ABES.zip"
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-medium transition-colors flex items-center gap-1.5 border border-slate-700"
            >
              <Download className="w-3.5 h-3.5 text-indigo-400" />
              <span>Download Full Project (.zip)</span>
            </a>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold transition-colors"
            >
              Enter Platform
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
