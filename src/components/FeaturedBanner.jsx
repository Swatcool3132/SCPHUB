import { useState, useEffect } from 'react';
import {
  Play,
  Star,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Zap,
  Lightbulb,
  Gamepad2,
  Trophy,
  Activity,
  Flame,
  Check,
  Copy,
  Sparkles,
  ShieldCheck,
  Boxes
} from 'lucide-react';

export const FeaturedBanner = ({
  games,
  currentIdx,
  onSelectIdx,
  onPlayGame,
  onPopout
}) => {
  const [copied, setCopied] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  if (!games || games.length === 0) return null;

  const activeIdx = currentIdx % games.length;
  const game = games[activeIdx] || games[0];

  // Auto rotate banner every 8 seconds if not paused/hovered
  useEffect(() => {
    if (isPaused || games.length <= 1) return;
    const interval = setInterval(() => {
      onSelectIdx((prev) => (prev + 1) % games.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [isPaused, games.length, onSelectIdx]);

  const handleCopyLink = (e) => {
    e.stopPropagation();
    const fullUrl = game.iframeUrl.startsWith('http')
      ? game.iframeUrl
      : window.location.origin + game.iframeUrl;
    navigator.clipboard.writeText(fullUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const getGameIcon = (iconName) => {
    switch (iconName) {
      case 'Trophy':
        return <Trophy className="w-4 h-4 text-emerald-400" />;
      case 'Zap':
        return <Zap className="w-4 h-4 text-amber-400" />;
      case 'Flame':
        return <Flame className="w-4 h-4 text-rose-400" />;
      case 'Boxes':
      case 'Box':
        return <Boxes className="w-4 h-4 text-emerald-400" />;
      default:
        return <Gamepad2 className="w-4 h-4 text-sky-400" />;
    }
  };

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="mb-8 relative rounded-2xl overflow-hidden border border-slate-700/80 bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-950 shadow-2xl transition-all duration-300"
    >
      {/* Dynamic Animated Ambient Glow */}
      <div
        className={`absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br ${game.color} opacity-25 blur-3xl pointer-events-none transition-all duration-700`}
      />
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />

      {/* Top Banner Navigation & Quick Switcher Tabs */}
      <div className="relative z-10 px-6 pt-5 pb-2 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 bg-slate-950/40 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
            FEATURED SPOTLIGHT
          </span>
          <span className="hidden sm:inline text-slate-500 text-xs">•</span>
          <span className="hidden sm:inline text-[11px] font-mono text-slate-400 font-semibold">
            SECURE SANDBOX READY
          </span>
        </div>

        {/* Quick Switcher Tabs for all games */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {games.map((g, idx) => {
            const isSelected = idx === activeIdx;
            return (
              <button
                key={g.id}
                onClick={() => onSelectIdx(idx)}
                className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer border ${
                  isSelected
                    ? 'bg-sky-500 text-white border-sky-400 shadow-md shadow-sky-500/20'
                    : 'bg-slate-800/80 hover:bg-slate-750 text-slate-400 hover:text-slate-200 border-slate-700/60'
                }`}
                title={`Switch spotlight to ${g.title}`}
              >
                {getGameIcon(g.icon)}
                <span className="whitespace-nowrap">{g.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Banner Body */}
      <div className="relative z-10 p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="space-y-4 max-w-2xl">
          {/* Metadata Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-slate-800 text-slate-200 border border-slate-700 flex items-center gap-1">
              {getGameIcon(game.icon)}
              {game.category}
            </span>

            {game.badge && (
              <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-gradient-to-r from-sky-500/20 to-indigo-500/20 text-sky-300 border border-sky-500/40">
                {game.badge}
              </span>
            )}

            {game.rating && (
              <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {game.rating.toFixed(1)} / 5.0
              </span>
            )}

            <span className="text-[11px] font-mono font-bold px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              100% UNBLOCKED
            </span>
          </div>

          {/* Game Title */}
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight uppercase drop-shadow-md">
              {game.title}
            </h2>
            {game.highlightPills && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {game.highlightPills.map((pill, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800/90 text-slate-300 border border-slate-700/60"
                  >
                    #{pill}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
            {game.description}
          </p>

          {/* Key Metrics / Stats Row */}
          {game.stats && game.stats.length > 0 && (
            <div className="grid grid-cols-3 gap-2.5 max-w-md pt-1">
              {game.stats.map((st, i) => (
                <div
                  key={i}
                  className="bg-slate-950/60 border border-slate-800 rounded-lg p-2 flex flex-col"
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    {st.label}
                  </span>
                  <span className="text-sm font-black text-slate-100 font-mono">
                    {st.val}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Pro Tip Callout */}
          {game.tip && (
            <div className="flex items-start gap-2.5 py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/25 text-xs text-amber-200/90 max-w-xl">
              <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-300 uppercase tracking-wider font-black text-[11px] block">
                  Pro Pilot Tip:
                </strong>
                <span className="text-slate-300 leading-snug">{game.tip}</span>
              </div>
            </div>
          )}

          {/* Controls Peek Chips */}
          {game.controls && game.controls.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Keybinds:
              </span>
              {game.controls.slice(0, 2).map((ctrl, i) => (
                <span
                  key={i}
                  className="text-[10px] font-mono text-slate-300 bg-slate-800/90 px-2.5 py-1 rounded border border-slate-700/80 shadow-sm"
                >
                  <strong className="text-sky-400">{ctrl.key}</strong> → {ctrl.action}
                </span>
              ))}
            </div>
          )}

          {/* Action Buttons Row */}
          <div className="pt-3 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onPlayGame(game)}
              className="h-12 px-7 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-black uppercase tracking-wider text-xs flex items-center gap-2.5 shadow-lg shadow-sky-500/30 transition active:scale-95 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Launch Game Now</span>
            </button>

            <button
              onClick={(e) => onPopout(game, e)}
              className="h-12 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white font-bold uppercase tracking-wider text-xs flex items-center gap-2 border border-slate-700 transition cursor-pointer"
              title="Open game in separate stealth unblocked window"
            >
              <ExternalLink className="w-4 h-4 text-sky-400" />
              <span>Stealth Popout</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="h-12 px-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700/80 transition flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
              title="Copy direct iframe URL"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-400" />
                  <span className="hidden sm:inline">Copy Link</span>
                </>
              )}
            </button>

            {/* Next / Prev Navigation */}
            {games.length > 1 && (
              <div className="flex items-center gap-1.5 sm:ml-auto">
                <button
                  onClick={() => onSelectIdx((prev) => (prev - 1 + games.length) % games.length)}
                  className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer border border-slate-700 flex items-center justify-center"
                  title="Previous featured game"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onSelectIdx((prev) => (prev + 1) % games.length)}
                  className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer border border-slate-700 flex items-center justify-center"
                  title="Next featured game"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Interactive 3D Showcase Card (Right Column) */}
        <div
          onClick={() => onPlayGame(game)}
          className={`w-full lg:w-72 h-64 rounded-2xl bg-gradient-to-br ${game.color} border-2 border-white/20 p-5 flex flex-col justify-between relative overflow-hidden shadow-2xl cursor-pointer group shrink-0 transition-transform duration-300 hover:scale-[1.02]`}
        >
          {/* Subtle Grid Backdrop Overlay */}
          <div className="absolute inset-0 bg-black/25 group-hover:bg-black/15 transition-colors" />

          {/* Top Stage Header */}
          <div className="relative z-10 flex justify-between items-start">
            <span className="text-white text-[10px] font-mono uppercase tracking-widest bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              60 FPS READY
            </span>
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-white group-hover:text-slate-900 transition-all shadow-lg">
              <Play className="w-5 h-5 fill-current ml-0.5" />
            </div>
          </div>

          {/* Center Graphic Watermark */}
          <div className="relative z-10 flex flex-col items-center justify-center py-2 text-white/30 group-hover:text-white/50 transition-colors">
            {getGameIcon(game.icon)}
            <span className="text-[10px] font-black uppercase tracking-widest mt-1">
              CLICK TO PLAY
            </span>
          </div>

          {/* Bottom Stage Details */}
          <div className="relative z-10 bg-black/40 backdrop-blur-md p-3 rounded-xl border border-white/10">
            <div className="text-white font-black text-lg uppercase drop-shadow leading-tight">
              {game.title}
            </div>
            <div className="flex items-center justify-between mt-1 text-[11px] font-bold text-white/80">
              <span>{game.category}</span>
              <span className="text-sky-300 font-mono">UNBLOCKED</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Progress Bar Indicator */}
      <div className="h-1 bg-slate-950 w-full flex">
        {games.map((_, idx) => (
          <div
            key={idx}
            className={`h-full flex-1 transition-all duration-500 ${
              idx === activeIdx ? 'bg-sky-500' : 'bg-slate-800'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
