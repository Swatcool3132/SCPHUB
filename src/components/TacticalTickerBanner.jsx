import React, { useState } from 'react';
import { Shield, Zap, X, Search, Globe, EyeOff } from 'lucide-react';

export const TacticalTickerBanner = ({ onApplyCloak, activeCloak, onOpenProxy }) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="mb-6 relative rounded-xl border border-sky-500/25 bg-gradient-to-r from-sky-950/70 via-slate-900/90 to-indigo-950/70 p-3 sm:px-4 sm:py-3 shadow-lg flex flex-wrap items-center justify-between gap-3 text-xs transition-colors">
      <div className="flex items-center gap-2.5">
        <span className="relative flex h-2.5 w-2.5 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-emerald-400"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
        </span>

        <div className="flex flex-wrap items-center gap-2">
          <span className="font-black uppercase tracking-wider text-[11px] text-sky-300">
            SCPHub System Status:
          </span>
          <span className="text-slate-300 text-[11px] font-medium hidden md:inline">
            100% Unblocked Arcade Online • Sandboxed Iframe Runtime • DuckDuckGo Proxy Integrated
          </span>

          <button
            type="button"
            onClick={onOpenProxy}
            className="text-[10px] font-mono px-2.5 py-1 rounded-md bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 font-bold cursor-pointer transition shadow-sm"
            title="Launch DuckDuckGo Proxy Search"
          >
            <span className="text-xs">🦆</span>
            <span>DuckDuckGo Proxy Search</span>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Quick Cloak Shortcuts */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onApplyCloak('docs')}
            className={`px-2 py-1 rounded text-[10px] font-bold uppercase transition border cursor-pointer ${
              activeCloak === 'docs'
                ? 'bg-blue-600 text-white border-blue-400'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
            title="Disguise tab as Google Docs"
          >
            Docs Cloak
          </button>
          <button
            type="button"
            onClick={() => onApplyCloak('classroom')}
            className={`px-2 py-1 rounded text-[10px] font-bold uppercase transition border cursor-pointer ${
              activeCloak === 'classroom'
                ? 'bg-emerald-600 text-white border-emerald-400'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
            title="Disguise tab as Google Classroom"
          >
            Classroom Cloak
          </button>
        </div>

        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="p-1 rounded text-slate-500 hover:text-slate-300 transition cursor-pointer"
          title="Dismiss status banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
