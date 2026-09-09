import React, { useRef, useState } from 'react';
import {
  ArrowLeft,
  Maximize2,
  Minimize2,
  RotateCw,
  ExternalLink,
  Star,
  Shield,
  Keyboard,
  Info,
  Layers,
  Copy,
  Check,
  Lightbulb,
  Sparkles,
  Tv,
  Focus,
  Play
} from 'lucide-react';

export const GamePlayer = ({
  game,
  allGames = [],
  onBack,
  onSelectGame,
  isFavorite,
  onToggleFavorite
}) => {
  const containerRef = useRef(null);
  const iframeRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isTheater, setIsTheater] = useState(false);
  const [stageHeight, setStageHeight] = useState('default'); // 'default' (620px), 'tall' (750px), 'cinematic' (850px)
  const [copied, setCopied] = useState(false);
  const [keySeed, setKeySeed] = useState(0);
  const [useProxy, setUseProxy] = useState(false);

  const activeUrl = useProxy
    ? `/api/proxy/page?url=${encodeURIComponent(game.iframeUrl)}`
    : game.iframeUrl;

  const handleReload = () => {
    if (iframeRef.current) {
      setKeySeed((prev) => prev + 1);
    }
  };

  const handleToggleFullscreen = async () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      try {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } catch (err) {
        console.error('Fullscreen request error:', err);
      }
    } else {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const handleOpenNewTab = () => {
    window.open(game.iframeUrl, '_blank');
  };

  const handleAboutBlankCloak = () => {
    const win = window.open('about:blank', '_blank');
    if (!win) {
      alert('Popup was blocked by your browser. Please allow popups to use Stealth Cloak.');
      return;
    }
    const doc = win.document;
    doc.title = 'Google Docs';
    const iframe = doc.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.inset = '0';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.style.margin = '0';
    iframe.style.padding = '0';
    const fullUrl = game.iframeUrl.startsWith('http://') || game.iframeUrl.startsWith('https://')
      ? game.iframeUrl
      : window.location.origin + game.iframeUrl;
    iframe.src = fullUrl;
    iframe.setAttribute('allowfullscreen', 'true');
    iframe.setAttribute('allow', 'autoplay; fullscreen; camera; focus-without-user-activation *; monetization; gamepad; keyboard-map *; xr-spatial-tracking; clipboard-write; clipboard-read; accelerometer; gyroscope; picture-in-picture; payment; microphone');
    iframe.setAttribute('sandbox', 'allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-presentation allow-scripts allow-same-origin allow-downloads');
    doc.body.style.margin = '0';
    doc.body.appendChild(iframe);
  };

  const handleCopyIframeCode = () => {
    const fullUrl = game.iframeUrl.startsWith('http://') || game.iframeUrl.startsWith('https://')
      ? game.iframeUrl
      : `${window.location.origin}${game.iframeUrl}`;
    const code = `<iframe data-testid="test_app_frame" id="test_app_frame" allowfullscreen="" allow="autoplay; fullscreen; camera; focus-without-user-activation *; monetization; gamepad; keyboard-map *; xr-spatial-tracking; clipboard-write" name="appFrame" scrolling="no" sandbox="allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-presentation allow-scripts allow-same-origin allow-downloads" src="${fullUrl}" style="width: 100%; height: 100%; border-width: medium; border-style: none; border-color: currentcolor; border-image: none;"></iframe>`;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const relatedGames = allGames.filter((g) => g.id !== game.id).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 space-y-5">
      {/* Top Action & Navigation Bar */}
      <div className="bg-[#1e293b] border border-slate-800 rounded-xl p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-3.5 py-2 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold uppercase tracking-wider border border-slate-700 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Games Library</span>
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-slate-100 uppercase tracking-tight">{game.title}</h2>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-sky-500 text-white">
                {game.category}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono hidden sm:block">
              SANDBOXED IFRAME • FILTER-SAFE LOCAL HOSTING
            </p>
          </div>
        </div>

        {/* Player Controls Toolbar */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Favorite Toggle */}
          <button
            onClick={() => onToggleFavorite(game.id)}
            className={`h-9 px-3 rounded-md border text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition ${
              isFavorite
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                : 'bg-slate-900 text-slate-300 hover:text-white border-slate-700 hover:bg-slate-800'
            }`}
            title={isFavorite ? 'Remove Favorite' : 'Add to Favorites'}
          >
            <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
            <span className="hidden sm:inline">Favorite</span>
          </button>

          {/* Theater / Focus Mode */}
          <button
            onClick={() => setIsTheater((prev) => !prev)}
            className={`h-9 px-3 rounded-md border text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition ${
              isTheater
                ? 'bg-sky-500/20 text-sky-300 border-sky-500/60'
                : 'bg-slate-900 text-slate-300 hover:text-white border-slate-700 hover:bg-slate-800'
            }`}
            title="Theater / Focus View (Expands playing field)"
          >
            <Tv className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">Theater</span>
          </button>

          {/* Sizing Toggles */}
          <div className="hidden sm:flex items-center bg-slate-900 border border-slate-700 rounded-md p-0.5 text-[10px] font-mono font-bold">
            <button
              onClick={() => setStageHeight('default')}
              className={`px-2 py-1 rounded transition ${stageHeight === 'default' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-white'}`}
              title="Standard height"
            >
              STD
            </button>
            <button
              onClick={() => setStageHeight('tall')}
              className={`px-2 py-1 rounded transition ${stageHeight === 'tall' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-white'}`}
              title="Tall height (740px)"
            >
              TALL
            </button>
            <button
              onClick={() => setStageHeight('cinematic')}
              className={`px-2 py-1 rounded transition ${stageHeight === 'cinematic' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-white'}`}
              title="Cinematic Max height (840px)"
            >
              MAX
            </button>
          </div>

          {/* Reload Iframe */}
          <button
            onClick={handleReload}
            className="h-9 px-3 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition flex items-center gap-1.5 text-xs font-bold uppercase"
            title="Reload Game"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Reload</span>
          </button>

          {/* Fullscreen */}
          <button
            onClick={handleToggleFullscreen}
            className="h-9 px-3 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition flex items-center gap-1.5 text-xs font-bold uppercase"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span className="hidden md:inline">{isFullscreen ? 'Exit' : 'Fullscreen'}</span>
          </button>

          {/* Proxy / Direct Mode Toggle */}
          <button
            onClick={() => setUseProxy((p) => !p)}
            className={`h-9 px-3 rounded-md border text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition cursor-pointer ${
              useProxy
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/60'
                : 'bg-slate-900 text-slate-300 hover:text-white border-slate-700 hover:bg-slate-800'
            }`}
            title={useProxy ? 'Proxy active: strips CSP & filters. Click to switch to Direct mode.' : 'Click to route through Server Proxy (bypasses school firewalls & frame restrictions)'}
          >
            <Shield className={`w-3.5 h-3.5 ${useProxy ? 'text-emerald-400' : 'text-slate-400'}`} />
            <span>{useProxy ? 'Proxied' : 'Proxy Mode'}</span>
          </button>

          {/* Open in New Tab */}
          <button
            onClick={handleOpenNewTab}
            className="h-9 px-3 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition flex items-center gap-1.5 text-xs font-bold uppercase cursor-pointer"
            title="Open Game in New Tab"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">New Tab</span>
          </button>

          {/* About:Blank Stealth Cloak */}
          <button
            onClick={handleAboutBlankCloak}
            className="h-9 px-3 rounded-md bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 border border-indigo-700/60 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition shadow-sm cursor-pointer"
            title="Open in an about:blank stealth window (disguised from browser history)"
          >
            <Shield className="w-3.5 h-3.5 text-indigo-400" />
            <span>About:Blank Popout</span>
          </button>
        </div>
      </div>

      {/* Main Iframe Player Stage */}
      <div
        ref={containerRef}
        className={`relative w-full bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl flex flex-col items-center justify-center transition-all duration-300 ${
          isTheater ? 'ring-2 ring-sky-500/40' : ''
        } ${
          stageHeight === 'cinematic'
            ? 'min-h-[700px] sm:min-h-[840px] h-[840px]'
            : stageHeight === 'tall'
            ? 'min-h-[600px] sm:min-h-[740px] h-[740px]'
            : 'min-h-[520px] sm:min-h-[640px] h-[640px]'
        }`}
      >
        <iframe
          key={`${game.id}-${keySeed}-${useProxy}`}
          ref={iframeRef}
          data-testid="test_app_frame"
          id="test_app_frame"
          name="appFrame"
          scrolling="no"
          src={activeUrl}
          title={game.title}
          className="w-full h-full border-0 outline-none"
          allowFullScreen
          allow="autoplay; fullscreen; camera; focus-without-user-activation *; monetization; gamepad; keyboard-map *; xr-spatial-tracking; clipboard-write; clipboard-read; accelerometer; gyroscope; picture-in-picture; payment; microphone"
          sandbox="allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-presentation allow-scripts allow-same-origin allow-downloads"
        />
      </div>

      {/* Tactical Strategy & Quick-Switch Banner */}
      <div className="bg-gradient-to-r from-sky-950/70 via-slate-900/95 to-indigo-950/70 border border-sky-500/30 rounded-xl p-4 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        {game.tip ? (
          <div className="flex items-start gap-3 text-xs flex-1">
            <div className="p-2 rounded-lg bg-sky-500/10 border border-sky-500/25 text-sky-400 shrink-0 mt-0.5">
              <Lightbulb className="w-4 h-4 text-amber-400" />
            </div>
            <div className="space-y-0.5">
              <div className="font-black text-sky-300 uppercase tracking-wider flex items-center gap-1.5 text-[11px]">
                <span>Tactical Field Guide</span>
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span className="text-[10px] font-mono font-normal text-slate-400">• 60 FPS Stream</span>
              </div>
              <p className="text-slate-200 leading-relaxed font-medium">
                {game.tip}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-xs text-slate-400 font-medium">
            Active title: <strong className="text-white">{game.title}</strong> ({game.category})
          </div>
        )}

        {/* Quick Switch Games Pills */}
        {allGames && allGames.length > 1 && (
          <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hidden sm:inline">
              Switch:
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {allGames
                .filter((g) => g.id !== game.id)
                .map((g) => (
                  <button
                    key={g.id}
                    onClick={() => onSelectGame(g)}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-sky-600/30 text-slate-300 hover:text-white border border-slate-700 hover:border-sky-500/50 text-[11px] font-bold uppercase tracking-wider transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                    title={`Jump to ${g.title}`}
                  >
                    <Play className="w-2.5 h-2.5 fill-current text-sky-400" />
                    <span>{g.title}</span>
                  </button>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Information Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Controls Cheatsheet */}
        <div className="bg-[#1e293b] border border-slate-800 rounded-xl p-5 shadow-md">
          <div className="flex items-center gap-2 mb-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
            <Keyboard className="w-3.5 h-3.5 text-sky-400" />
            <span>Controls & Keybindings</span>
          </div>

          <div className="space-y-2">
            {game.controls && game.controls.length > 0 ? (
              game.controls.map((ctrl, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs"
                >
                  <span className="font-mono font-bold bg-slate-950 text-sky-400 px-2.5 py-1 rounded border border-slate-700">
                    {ctrl.key}
                  </span>
                  <span className="text-slate-300 font-medium">{ctrl.action}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 italic">Mouse, Touch or standard Arrow keys.</p>
            )}
          </div>
        </div>

        {/* Game Details & Description */}
        <div className="bg-[#1e293b] border border-slate-800 rounded-xl p-5 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
              <Info className="w-3.5 h-3.5 text-sky-400" />
              <span>About this Game</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
              {game.description}
            </p>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {game.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] font-mono uppercase text-slate-400 bg-slate-900 border border-slate-800 px-2.5 py-0.5 rounded"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={handleCopyIframeCode}
              className="text-xs text-slate-400 hover:text-sky-400 font-bold uppercase tracking-wider flex items-center gap-1.5 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Iframe HTML Copied!' : 'Copy Embed Code'}</span>
            </button>
            <span className="text-[10px] text-slate-500 font-mono">
              {game.iframeUrl}
            </span>
          </div>
        </div>

        {/* Quick More Games Bar */}
        <div className="bg-[#1e293b] border border-slate-800 rounded-xl p-5 shadow-md">
          <div className="flex items-center gap-2 mb-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
            <Layers className="w-3.5 h-3.5 text-sky-400" />
            <span>More Games to Play</span>
          </div>

          <div className="space-y-2">
            {relatedGames.map((relGame) => (
              <div
                key={relGame.id}
                onClick={() => onSelectGame(relGame)}
                className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-sky-500/50 transition cursor-pointer group"
              >
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div
                    className={`w-7 h-7 rounded bg-gradient-to-br ${relGame.color} flex items-center justify-center text-white text-[10px] font-black shrink-0`}
                  >
                    {relGame.title.charAt(0)}
                  </div>
                  <span className="text-xs font-bold uppercase tracking-tight text-slate-200 group-hover:text-sky-400 truncate">
                    {relGame.title}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-bold uppercase bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  {relGame.category}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
