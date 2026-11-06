import React from 'react';
import { Sparkles, HelpCircle, FileEdit, AlertCircle, Award, CheckCircle2 } from 'lucide-react';

interface QuickPromptButtonsProps {
  onSelectPrompt: (promptText: string) => void;
  disabled?: boolean;
}

export const QuickPromptButtons: React.FC<QuickPromptButtonsProps> = ({
  onSelectPrompt,
  disabled = false
}) => {
  const prompts = [
    {
      text: 'Explain InkGuard AI.',
      icon: Sparkles,
      desc: 'Platform purpose & 5-pillar Evidence Trail'
    },
    {
      text: 'Help me understand my brand guidelines.',
      icon: HelpCircle,
      desc: 'Voice, tone, and active brand rules'
    },
    {
      text: 'Improve my marketing content.',
      icon: FileEdit,
      desc: 'Brand-aligned rewriting & clarity'
    },
    {
      text: 'Explain an unsupported claim.',
      icon: AlertCircle,
      desc: 'SLA verification & forbidden superlatives'
    },
    {
      text: 'How can I make my content more professional?',
      icon: Award,
      desc: 'Removing hype buzzwords & clichés'
    },
    {
      text: 'Explain my latest content-review result.',
      icon: CheckCircle2,
      desc: 'Health score & open findings analysis'
    }
  ];

  return (
    <div className="space-y-2 py-2">
      <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold px-1">
        Suggested Inquiries
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {prompts.map((p, idx) => {
          const Icon = p.icon;
          return (
            <button
              key={idx}
              type="button"
              disabled={disabled}
              onClick={() => onSelectPrompt(p.text)}
              className="text-left p-2.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/50 transition-all group disabled:opacity-50"
            >
              <div className="flex items-center gap-2 text-xs font-medium text-slate-200 group-hover:text-indigo-300">
                <Icon className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span className="truncate">{p.text}</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5 truncate pl-5">
                {p.desc}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
