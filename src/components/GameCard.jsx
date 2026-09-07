import React from 'react';
import { Star, Play, Sparkles, Trash2, ExternalLink, Keyboard, Lightbulb } from 'lucide-react';

export const GameCard = ({
  game,
  onPlay,
  isFavorite,
  onToggleFavorite,
  onDeleteCustomGame
}) => {
  const handlePopout = (e) => {
    e.stopPropagation();
    const win = window.open('about:blank', '_blank');
    if (!win) return;
    const doc = win.document;
    doc.title = game.title;
    const iframe = doc.createElement('iframe');
    iframe.style.width = '100vw';
    iframe.style.height = '100vh';
    iframe.style.border = 'none';
    iframe.style.margin = '0';
    iframe.style.padding = '0';
    const fullUrl = game.iframeUrl.startsWith('http://') || game.iframeUrl.startsWith('https://')
      ? game.iframeUrl
      : window.location.origin + game.iframeUrl;
    iframe.src = fullUrl;
    iframe.setAttribute('allowfullscreen', 'true');
    iframe.setAttribute('allow', 'autoplay; fullscreen; camera; focus-without-user-activation *; monetization; gamepad; keyboard-map *; xr-spatial-tracking; clipboard-write');
    iframe.setAttribute('sandbox', 'allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-presentation allow-scripts allow-same-origin allow-downloads');
    doc.body.style.margin = '0';
    doc.body.appendChild(iframe);
  };

  return (
    <div
      onClick={() => onPlay(game)}
      className="group relative bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 hover:border-sky-500/80 rounded-2xl p-4.5 transition-all duration-200 flex flex-col justify-between cursor-pointer overflow-hidden shadow-lg hover:shadow-sky-500/10 hover:-translate-y-0.5"
    >
      <div>
        {/* Top bar: Category, Badge & Favorite */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-900/90 text-slate-300 border border-slate-700/60">
              {game.category}
            </span>

            {game.badge && (
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow-sm flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" />
                {game.badge}
              </span>
            )}
            {game.isCustom && (
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-500 text-white">
                Custom
              </span>
            )}
          </div>

          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            {/* Popout stealth button */}
            <button
              onClick={handlePopout}
              className="p-1.5 rounded-md text-slate-400 hover:text-sky-300 hover:bg-slate-700/70 transition"
              title="Stealth Popout in blank tab"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            {game.isCustom && onDeleteCustomGame && (
              <button
                onClick={() => onDeleteCustomGame(game.id)}
                className="p-1.5 rounded-md text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition"
                title="Remove Custom Game"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={() => onToggleFavorite(game.id)}
              className={`p-1.5 rounded-md transition ${
                isFavorite
                  ? 'text-amber-400 bg-amber-500/20'
                  : 'text-slate-400 hover:text-amber-300 hover:bg-slate-700'
              }`}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Star className={`w-3.5 h-3.5 ${isFavorite ? 'fill-amber-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Thumbnail banner */}
        <div
          className={`h-40 rounded-xl bg-gradient-to-br ${game.color} p-4 flex flex-col justify-between relative overflow-hidden mb-3.5 border border-white/10 shadow-inner group-hover:scale-[1.01] transition-transform`}
        >
          {game.thumbnailUrl ? (
            <img
              src={game.thumbnailUrl}
              alt={game.title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-80"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : null}

          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-black/30" />

          {/* Geometric Grid Pattern */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(to right, rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.2) 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }}
          />

          <div className="relative z-10 flex justify-between items-start">
            <span className="text-white font-black text-xl sm:text-2xl tracking-tighter uppercase drop-shadow-md line-clamp-2">
              {game.title}
            </span>
            {game.rating && (
              <div className="flex items-center gap-1 bg-slate-950/90 backdrop-blur-sm px-2 py-0.5 rounded-md text-[11px] font-black text-amber-300 border border-slate-700/60 shadow-sm shrink-0 ml-2">
                <Star className="w-3 h-3 fill-amber-300" />
                <span>{game.rating.toFixed(1)}</span>
              </div>
            )}
          </div>

          <div className="relative z-10 flex items-center justify-between">
            <div className="text-white/90 text-[10px] font-mono uppercase tracking-wider flex items-center gap-1 bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded border border-white/10">
              <span>UNBLOCKED • HTML5</span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-sky-500 transition-all shadow-md">
              <Play className="w-4 h-4 fill-current ml-0.5" />
            </div>
          </div>
        </div>

        {/* Title & Description */}
        <h3 className="text-lg font-black text-slate-100 uppercase tracking-tight group-hover:text-sky-400 transition-colors line-clamp-1 mb-1">
          {game.title}
        </h3>
        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
          {game.description}
        </p>

        {/* Controls peek */}
        {game.controls && game.controls.length > 0 && (
          <div className="mb-2.5 py-1.5 px-2 bg-slate-900/60 border border-slate-800 rounded-lg flex items-center gap-1.5 text-[10px] text-slate-400">
            <Keyboard className="w-3 h-3 text-sky-400 shrink-0" />
            <span className="truncate font-mono">
              <strong className="text-slate-300">{game.controls[0].key}</strong>: {game.controls[0].action}
            </span>
          </div>
        )}

        {/* Pro tip snippet */}
        {game.tip && (
          <div className="mb-3 py-1 px-2 rounded-md bg-amber-500/10 border border-amber-500/20 flex items-center gap-1.5 text-[10px] text-amber-300/90">
            <Lightbulb className="w-3 h-3 text-amber-400 shrink-0" />
            <span className="truncate font-medium">{game.tip}</span>
          </div>
        )}
      </div>

      {/* Footer tags & controls shortcut */}
      <div className="pt-2.5 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5 overflow-hidden">
          {game.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-slate-400 bg-slate-900/90 px-2 py-0.5 rounded text-[10px] font-mono uppercase">
              #{tag}
            </span>
          ))}
        </div>
        <div className="text-sky-400 font-black uppercase tracking-wider text-xs group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
          PLAY <Play className="w-3 h-3 fill-current" />
        </div>
      </div>
    </div>
  );
};
