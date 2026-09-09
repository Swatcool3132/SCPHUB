import React, { useState, useRef } from 'react';
import {
  Globe,
  Search,
  ExternalLink,
  Shield,
  RotateCw,
  EyeOff,
  BookOpen,
  ArrowRight,
  Sparkles,
  Lock
} from 'lucide-react';
import { ScpLogo } from './ScpLogo';

const FEATURED_SCPS = [
  { id: 'scp-173', name: 'SCP-173', title: 'The Sculpture', class: 'Euclid', url: 'https://scp-wiki.wikidot.com/scp-173' },
  { id: 'scp-096', name: 'SCP-096', title: 'The Shy Guy', class: 'Euclid', url: 'https://scp-wiki.wikidot.com/scp-096' },
  { id: 'scp-049', name: 'SCP-049', title: 'Plague Doctor', class: 'Euclid', url: 'https://scp-wiki.wikidot.com/scp-049' },
  { id: 'scp-682', name: 'SCP-682', title: 'Hard-to-Destroy Reptile', class: 'Keter', url: 'https://scp-wiki.wikidot.com/scp-682' },
  { id: 'scp-999', name: 'SCP-999', title: 'The Tickle Monster', class: 'Safe', url: 'https://scp-wiki.wikidot.com/scp-999' },
  { id: 'scp-3008', name: 'SCP-3008', title: 'A Perfectly Normal, Regular Old IKEA', class: 'Euclid', url: 'https://scp-wiki.wikidot.com/scp-3008' },
  { id: 'scp-087', name: 'SCP-087', title: 'The Stairwell', class: 'Euclid', url: 'https://scp-wiki.wikidot.com/scp-087' },
  { id: 'scp-106', name: 'SCP-106', title: 'The Old Man', class: 'Keter', url: 'https://scp-wiki.wikidot.com/scp-106' },
  { id: 'scp-294', name: 'SCP-294', title: 'The Coffee Machine', class: 'Safe', url: 'https://scp-wiki.wikidot.com/scp-294' },
  { id: 'scp-500', name: 'SCP-500', title: 'Panacea', class: 'Safe', url: 'https://scp-wiki.wikidot.com/scp-500' }
];

export const ScpWikiViewer = ({ initialUrl = 'https://scp-wiki.wikidot.com/', onApplyStealth }) => {
  const [currentUrl, setCurrentUrl] = useState(initialUrl);
  const [inputUrl, setInputUrl] = useState(initialUrl);
  const [useProxy, setUseProxy] = useState(true);
  const [keySeed, setKeySeed] = useState(0);
  const [quickSearch, setQuickSearch] = useState('');
  const iframeRef = useRef(null);

  const activeSrc = useProxy
    ? `/api/proxy/page?url=${encodeURIComponent(currentUrl)}`
    : currentUrl;

  const handleNavigate = (e) => {
    if (e) e.preventDefault();
    let url = inputUrl.trim();
    if (!url) return;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      if (/^\d{3,4}$/.test(url)) {
        url = `https://scp-wiki.wikidot.com/scp-${url}`;
      } else if (url.toLowerCase().startsWith('scp-')) {
        url = `https://scp-wiki.wikidot.com/${url.toLowerCase()}`;
      } else {
        url = `https://scp-wiki.wikidot.com/search:site/q/${encodeURIComponent(url)}`;
      }
    }
    setCurrentUrl(url);
    setInputUrl(url);
    setKeySeed((s) => s + 1);
  };

  const handleSelectScp = (scpUrl) => {
    setCurrentUrl(scpUrl);
    setInputUrl(scpUrl);
    setKeySeed((s) => s + 1);
  };

  const handleStealthAboutBlank = () => {
    const win = window.open('about:blank', '_blank');
    if (!win) return;
    const doc = win.document;

    doc.title = 'Classes - Google Classroom';
    const link = doc.createElement('link');
    link.rel = 'icon';
    link.href = 'https://ssl.gstatic.com/classroom/favicon.png';
    doc.head.appendChild(link);

    const iframe = doc.createElement('iframe');
    iframe.style.width = '100vw';
    iframe.style.height = '100vh';
    iframe.style.border = 'none';
    iframe.style.margin = '0';
    iframe.style.padding = '0';

    const fullUrl = useProxy
      ? window.location.origin + `/api/proxy/page?url=${encodeURIComponent(currentUrl)}`
      : currentUrl;
    iframe.src = fullUrl;
    iframe.setAttribute('allowfullscreen', 'true');
    iframe.setAttribute(
      'allow',
      'autoplay; fullscreen; camera; focus-without-user-activation *; monetization; gamepad; keyboard-map *; xr-spatial-tracking; clipboard-write; clipboard-read; accelerometer; gyroscope; picture-in-picture; payment; microphone'
    );
    iframe.setAttribute(
      'sandbox',
      'allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-presentation allow-scripts allow-same-origin allow-downloads'
    );
    doc.body.style.margin = '0';
    doc.body.appendChild(iframe);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 space-y-5">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-950/70 via-slate-900/95 to-amber-950/70 border border-amber-500/30 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
            <ScpLogo className="w-8 h-8" showGlow={false} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight">
                SCP Foundation Wiki Reader
              </h1>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500 text-black font-mono">
                wikidot.com
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium">
              Secure, Contain, Protect. Unblocked live mirror and proxy reader for all official SCP anomaly archives.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleStealthAboutBlank}
            className="px-3 py-1.5 rounded-lg bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 border border-indigo-700/50 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition cursor-pointer"
            title="Open in an about:blank stealth window (disguised as Google Classroom - Home)"
          >
            <Shield className="w-3.5 h-3.5 text-indigo-400" />
            <span>Google Classroom Stealth</span>
          </button>

          <a
            href={currentUrl}
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Direct Tab</span>
          </a>
        </div>
      </div>

      {/* Navigation Omnibar */}
      <div className="bg-[#1e293b] border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <form onSubmit={handleNavigate} className="flex-1 min-w-[280px] flex items-center gap-2">
          <div className="relative flex-1">
            <Globe className="w-4 h-4 text-amber-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="Enter SCP number (e.g. 173, 096, 3008) or full URL..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-black font-black text-xs uppercase tracking-wider rounded-lg transition shadow cursor-pointer"
          >
            Jump
          </button>
        </form>

        {/* Right tools */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setUseProxy((p) => !p)}
            className={`px-3 py-2 rounded-lg border text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition cursor-pointer ${
              useProxy
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/60'
                : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
            }`}
            title="Toggle between Server Unblock Proxy and Direct Wikidot embed"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>{useProxy ? 'Proxy Unblock' : 'Direct Embed'}</span>
          </button>

          <button
            onClick={() => setKeySeed((s) => s + 1)}
            className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition cursor-pointer"
            title="Reload Page"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Access Popular SCP Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs custom-scrollbar">
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 shrink-0">
          Archived Dossiers:
        </span>
        <button
          onClick={() => handleSelectScp('https://scp-wiki.wikidot.com/')}
          className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 shrink-0 font-medium transition cursor-pointer"
        >
          Main Wiki Home
        </button>
        {FEATURED_SCPS.map((scp) => (
          <button
            key={scp.id}
            onClick={() => handleSelectScp(scp.url)}
            className="px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 shrink-0 font-medium transition flex items-center gap-1.5 cursor-pointer"
          >
            <span className="font-bold text-amber-400 font-mono">{scp.name}</span>
            <span className="text-slate-400">({scp.title})</span>
          </button>
        ))}
      </div>

      {/* Main SCP Wiki Iframe Viewport */}
      <div className="relative w-full bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl min-h-[600px] h-[780px]">
        <iframe
          key={`${currentUrl}-${keySeed}-${useProxy}`}
          ref={iframeRef}
          src={activeSrc}
          title="SCP Foundation Wiki"
          className="w-full h-full border-0 outline-none"
          allowFullScreen
          allow="autoplay; fullscreen; camera; focus-without-user-activation *; monetization; gamepad; keyboard-map *; xr-spatial-tracking; clipboard-write; clipboard-read; accelerometer; gyroscope; picture-in-picture; payment; microphone"
          sandbox="allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-presentation allow-scripts allow-same-origin allow-downloads"
        />
      </div>
    </div>
  );
};
