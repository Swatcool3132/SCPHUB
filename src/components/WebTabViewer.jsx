import React, { useState } from 'react';
import {
  Globe,
  ExternalLink,
  RotateCw,
  EyeOff,
  ShieldCheck,
  AlertCircle,
  Copy,
  Check
} from 'lucide-react';

export const WebTabViewer = ({ url, onReload }) => {
  const [copied, setCopied] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [key, setKey] = useState(0);

  const proxyUrl = `/api/proxy/page?url=${encodeURIComponent(url)}`;

  const handleCopy = () => {
    navigator.clipboard?.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleOpenDirect = () => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleStealthPopout = () => {
    const win = window.open('about:blank', '_blank');
    if (!win) return;
    win.document.title = 'Google Docs';
    const iframe = win.document.createElement('iframe');
    iframe.src = proxyUrl;
    iframe.style.width = '100vw';
    iframe.style.height = '100vh';
    iframe.style.border = 'none';
    win.document.body.style.margin = '0';
    win.document.body.appendChild(iframe);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-950 text-slate-100 overflow-hidden min-h-[calc(100vh-5.5rem)]">
      {/* Proxy Web Bar */}
      <div className="h-11 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between gap-3 text-xs shrink-0">
        <div className="flex items-center gap-2 overflow-hidden flex-1 max-w-2xl">
          <Globe className="w-4 h-4 text-cyan-400 shrink-0" />
          <span className="font-mono text-slate-300 truncate">{url}</span>
          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded font-mono shrink-0">
            PROXIED
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setKey((k) => k + 1)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            title="Reload frame"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            title="Copy URL"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <button
            type="button"
            onClick={handleOpenDirect}
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition cursor-pointer"
            title="Open directly in new browser tab"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Direct Tab</span>
          </button>

          <button
            type="button"
            onClick={handleStealthPopout}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs transition cursor-pointer shadow"
            title="Open stealth disguised as Google Docs"
          >
            <EyeOff className="w-3.5 h-3.5" />
            <span>Stealth Popout</span>
          </button>
        </div>
      </div>

      {/* Frame Container */}
      <div className="flex-1 relative bg-white">
        <iframe
          key={key}
          src={proxyUrl}
          title={url}
          className="w-full h-full border-none"
          sandbox="allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-presentation allow-scripts allow-same-origin"
          allow="autoplay; fullscreen; camera; focus-without-user-activation *; gamepad; keyboard-map *; clipboard-write"
          onError={() => setLoadError(true)}
        />
      </div>
    </div>
  );
};
