import React, { useState, useRef } from 'react';
import {
  Gamepad2,
  Cloud,
  ExternalLink,
  Shield,
  Play,
  RotateCw,
  Maximize2,
  Minimize2,
  Sparkles,
  KeyRound,
  CheckCircle2,
  Info,
  Tv,
  EyeOff,
  Flame,
  Zap,
  Globe
} from 'lucide-react';

const CLOUD_GAMES = [
  {
    id: 'roblox',
    title: 'Roblox',
    badge: 'TOP CLOUD TITLE',
    category: 'Cloud MMO / Sandbox',
    description: 'Explore millions of immersive 3D experiences, obbys, and games with friends across any web browser.',
    thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80',
    providers: [
      {
        name: 'now.gg Cloud (In-Browser)',
        type: 'embed',
        url: 'https://nowgg.nl/play/roblox-corporation/5349/roblox.html',
        directUrl: 'https://now.gg/apps/roblox-corporation/5349/roblox.html',
        recommended: true,
        note: 'Runs mobile Android Roblox directly inside browser frame'
      },
      {
        name: 'Xbox Cloud Gaming (Free)',
        type: 'external',
        url: 'https://www.xbox.com/en-US/play/games/roblox/9NBLGGH4T727',
        directUrl: 'https://www.xbox.com/en-US/play/games/roblox/9NBLGGH4T727',
        note: 'Official Microsoft Xbox Cloud stream with controller support'
      },
      {
        name: 'GeForce NOW Cloud',
        type: 'external',
        url: 'https://play.geforcenow.com/games?game-id=roblox',
        directUrl: 'https://play.geforcenow.com/games?game-id=roblox',
        note: 'NVIDIA RTX cloud rig streaming'
      },
      {
        name: 'Bloxd.io (Instant Voxel Alternative)',
        type: 'embed',
        url: 'https://bloxd.io',
        directUrl: 'https://bloxd.io',
        note: 'Zero-login web multiplayer sandbox (100% unblocked anywhere)'
      }
    ]
  },
  {
    id: 'fortnite',
    title: 'Fortnite',
    badge: '100% FREE CLOUD PLAY',
    category: 'Battle Royale / Cloud',
    description: 'Jump into Battle Royale, Zero Build, LEGO Fortnite, and Rocket Racing without downloading.',
    thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80',
    providers: [
      {
        name: 'Xbox Cloud Gaming (No Subscription Needed)',
        type: 'external',
        url: 'https://www.xbox.com/en-US/play/games/fortnite/BT5P2X999VH2',
        directUrl: 'https://www.xbox.com/en-US/play/games/fortnite/BT5P2X999VH2',
        recommended: true,
        note: 'Free cloud stream on all PC, Chromebook, and mobile browsers'
      },
      {
        name: 'GeForce NOW Fortnite',
        type: 'external',
        url: 'https://play.geforcenow.com/games?game-id=46bfab92-20cb-4c4f-8898-a4220b33b003',
        directUrl: 'https://play.geforcenow.com/games?game-id=46bfab92-20cb-4c4f-8898-a4220b33b003',
        note: 'Free GeForce tier with mouse & keyboard or gamepad'
      },
      {
        name: 'Amazon Luna Fortnite',
        type: 'external',
        url: 'https://luna.amazon.com/game/fortnite/B0BV2997BG',
        directUrl: 'https://luna.amazon.com/game/fortnite/B0BV2997BG',
        note: 'Amazon cloud streaming for Prime & free accounts'
      },
      {
        name: '1v1.LOL (Instant Web Battle Royale)',
        type: 'embed',
        url: 'https://db.duckmath.org/html/1v1lol/index.html',
        directUrl: 'https://1v1.lol',
        note: 'Instant lightweight Fortnite-style building battle royale'
      }
    ]
  },
  {
    id: 'minecraft-cloud',
    title: 'Minecraft (Web & Cloud)',
    badge: 'POPULAR',
    category: 'Sandbox / Survival',
    description: 'Play Minecraft Classic and Eaglercraft Web multiplayer seamlessly in your browser.',
    thumbnail: 'https://images.unsplash.com/photo-1627856013091-fed6e4e30025?auto=format&fit=crop&w=600&q=80',
    providers: [
      {
        name: 'Eaglercraft 1.8.8 Web Engine',
        type: 'embed',
        url: 'https://db.duckmath.org/html/minecraft/index.html',
        directUrl: 'https://db.duckmath.org/html/minecraft/index.html',
        recommended: true,
        note: 'Fully playable Java Minecraft in HTML5 canvas'
      },
      {
        name: 'Paper Minecraft 2D',
        type: 'embed',
        url: 'https://db.duckmath.org/html/paper-minecraft/index.html',
        directUrl: 'https://scratch.mit.edu',
        note: 'Scratch 2D Minecraft sandbox'
      }
    ]
  },
  {
    id: 'brawlhalla',
    title: 'Brawlhalla Cloud',
    badge: 'FAST PACED',
    category: 'Fighting / Platform',
    description: 'Smash-style platform fighting game streamable via GeForce and cloud rigs.',
    thumbnail: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80',
    providers: [
      {
        name: 'GeForce NOW Stream',
        type: 'external',
        url: 'https://play.geforcenow.com/games?game-id=brawlhalla',
        directUrl: 'https://play.geforcenow.com/games?game-id=brawlhalla',
        recommended: true,
        note: '60 FPS low-latency cloud fighting stream'
      }
    ]
  },
  {
    id: 'rocket-league',
    title: 'Rocket League Sideswipe',
    badge: 'COMPETITIVE',
    category: 'Sports / Arcade',
    description: 'High-octane car soccer optimized for quick browser and mobile cloud gaming.',
    thumbnail: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
    providers: [
      {
        name: 'GeForce NOW Rocket League',
        type: 'external',
        url: 'https://play.geforcenow.com/games?game-id=rocket-league',
        directUrl: 'https://play.geforcenow.com/games?game-id=rocket-league',
        recommended: true,
        note: 'Official Rocket League cloud play'
      }
    ]
  }
];

export const CloudGamingHub = ({ onOpenPasswords, onApplyStealth }) => {
  const [selectedGame, setSelectedGame] = useState(CLOUD_GAMES[0]);
  const [selectedProvider, setSelectedProvider] = useState(CLOUD_GAMES[0].providers[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [useProxy, setUseProxy] = useState(false);
  const [keySeed, setKeySeed] = useState(0);
  const iframeRef = useRef(null);

  const handleSelectGame = (game) => {
    setSelectedGame(game);
    const rec = game.providers.find((p) => p.recommended) || game.providers[0];
    setSelectedProvider(rec);
    setIsPlaying(false);
  };

  const handleLaunchGame = (provider = selectedProvider) => {
    setSelectedProvider(provider);
    if (provider.type === 'external') {
      window.open(provider.directUrl, '_blank');
    } else {
      setIsPlaying(true);
      window.scrollTo({ top: 400, behavior: 'smooth' });
    }
  };

  const handleStealthAboutBlank = (provider = selectedProvider) => {
    const win = window.open('about:blank', '_blank');
    if (!win) return;
    const doc = win.document;

    // Disguise window title and icon as Google Classroom Home
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

    const targetUrl = provider.url || provider.directUrl;
    iframe.src = targetUrl;
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

  const currentStreamUrl = useProxy
    ? `/api/proxy/page?url=${encodeURIComponent(selectedProvider.url)}`
    : selectedProvider.url;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 space-y-6">
      {/* Top Banner & Quick Controls */}
      <div className="bg-gradient-to-r from-blue-950/80 via-slate-900/95 to-indigo-950/80 border border-sky-500/30 rounded-2xl p-5 sm:p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-500/40 shadow-inner">
            <Cloud className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                Cloud Gaming Station
              </h1>
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono">
                Roblox & Fortnite Active
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 font-medium mt-0.5">
              Stream Roblox and Fortnite directly in your browser with no downloads, zero hardware limits, and stealth support.
            </p>
          </div>
        </div>

        {/* Action Pills */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={onOpenPasswords}
            className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/50 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition cursor-pointer shadow-sm"
          >
            <KeyRound className="w-4 h-4 text-amber-400" />
            <span>3 Weekly Passwords</span>
          </button>

          <button
            onClick={() => onApplyStealth && onApplyStealth('google-classroom-home')}
            className="px-3.5 py-2 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/50 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition cursor-pointer shadow-sm"
            title="Immediately cloak tab as Google Classroom - Home"
          >
            <EyeOff className="w-4 h-4 text-indigo-400" />
            <span>Google Classroom Stealth</span>
          </button>
        </div>
      </div>

      {/* Open Access Banner */}
      <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-3 flex items-center gap-2.5 text-xs text-emerald-200">
        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>
          <strong>No Password Needed For Games:</strong> Once on the site, all Roblox, Fortnite, and 4,000+ arcade games are 100% open with zero in-game passwords or paywalls.
        </span>
      </div>

      {/* Featured Primary Selector: Roblox & Fortnite Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {CLOUD_GAMES.map((game) => {
          const isSelected = selectedGame.id === game.id;
          return (
            <button
              key={game.id}
              onClick={() => handleSelectGame(game)}
              className={`p-3.5 rounded-xl border text-left transition relative overflow-hidden flex flex-col justify-between cursor-pointer ${
                isSelected
                  ? 'bg-slate-800/90 border-sky-500 ring-2 ring-sky-500/30 shadow-lg'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                    {game.badge}
                  </span>
                  <Cloud className={`w-4 h-4 ${isSelected ? 'text-sky-400' : 'text-slate-500'}`} />
                </div>
                <h3 className="text-base font-black text-white">{game.title}</h3>
                <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">
                  {game.description}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>{game.providers.length} Cloud Streams</span>
                <span className={isSelected ? 'text-sky-400 font-bold' : ''}>
                  {isSelected ? 'SELECTED' : 'VIEW'}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Selected Game Hub Details */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-black text-white uppercase tracking-tight">
                {selectedGame.title}
              </h2>
              <span className="text-xs font-bold uppercase px-2.5 py-0.5 rounded bg-sky-600 text-white">
                {selectedGame.category}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              {selectedGame.description}
            </p>
          </div>

          {/* Quick Provider Launch Bar */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleStealthAboutBlank(selectedProvider)}
              className="px-3 py-2 rounded-xl bg-indigo-950/80 hover:bg-indigo-900 text-indigo-200 border border-indigo-700/60 text-xs font-bold uppercase flex items-center gap-1.5 transition cursor-pointer shadow-sm"
              title="Launches stream in a stealth about:blank window disguised as Google Classroom - Home"
            >
              <Shield className="w-3.5 h-3.5 text-indigo-400" />
              <span>Stealth Popout (Google Classroom)</span>
            </button>
          </div>
        </div>

        {/* Streaming Providers Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Available Cloud Stream Engines & Mirrors
            </h4>
            <span className="text-[11px] text-sky-400 font-mono">Select a provider to start</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {selectedGame.providers.map((prov, idx) => {
              const isChosen = selectedProvider.name === prov.name;
              return (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border transition flex flex-col justify-between gap-3 ${
                    isChosen
                      ? 'bg-slate-800/80 border-sky-500/80 ring-1 ring-sky-500/40'
                      : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white flex items-center gap-2">
                        {prov.name}
                        {prov.recommended && (
                          <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                            Recommended
                          </span>
                        )}
                      </span>
                      <span className="text-[10px] font-mono uppercase text-slate-400">
                        {prov.type === 'embed' ? 'In-Browser Embed' : 'Direct Cloud Stream'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{prov.note}</p>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                    <button
                      onClick={() => handleLaunchGame(prov)}
                      className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer ${
                        isChosen
                          ? 'bg-sky-600 hover:bg-sky-500 text-white shadow'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                      }`}
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>{prov.type === 'embed' ? 'Play in App' : 'Launch Stream'}</span>
                    </button>

                    <button
                      onClick={() => handleStealthAboutBlank(prov)}
                      className="p-2 rounded-lg bg-indigo-950/70 hover:bg-indigo-900 text-indigo-300 border border-indigo-700/50 text-xs transition cursor-pointer"
                      title="Launch in Google Classroom Stealth Popout"
                    >
                      <Shield className="w-3.5 h-3.5 text-indigo-400" />
                    </button>

                    <a
                      href={prov.directUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs transition"
                      title="Open direct original provider tab"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Embedded Player Screen if isPlaying */}
        {isPlaying && selectedProvider.type === 'embed' && (
          <div className="space-y-3 pt-4 border-t border-slate-800 animate-in fade-in duration-300">
            {/* Player Toolbar */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-200">
                  Streaming: <strong className="text-sky-400">{selectedGame.title}</strong> ({selectedProvider.name})
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setUseProxy((p) => !p)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition cursor-pointer ${
                    useProxy
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/60'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                  title="Route stream through server proxy to bypass school firewall"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>{useProxy ? 'Proxy Active' : 'Proxy Mode'}</span>
                </button>

                <button
                  onClick={() => setKeySeed((s) => s + 1)}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition cursor-pointer"
                  title="Reload Stream"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => handleStealthAboutBlank(selectedProvider)}
                  className="px-3 py-1.5 rounded-lg bg-indigo-950 hover:bg-indigo-900 text-indigo-300 border border-indigo-700/60 text-xs font-bold uppercase transition cursor-pointer"
                  title="Cloak into Google Classroom About:Blank Window"
                >
                  Stealth Window
                </button>

                <button
                  onClick={() => setIsPlaying(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 text-xs font-bold uppercase transition cursor-pointer"
                >
                  Close Player
                </button>
              </div>
            </div>

            {/* Stage */}
            <div className="relative w-full bg-black border border-slate-800 rounded-2xl overflow-hidden shadow-2xl min-h-[640px] h-[720px]">
              <iframe
                key={`${selectedGame.id}-${selectedProvider.name}-${keySeed}-${useProxy}`}
                ref={iframeRef}
                src={currentStreamUrl}
                title={selectedGame.title}
                className="w-full h-full border-0 outline-none"
                allowFullScreen
                allow="autoplay; fullscreen; camera; focus-without-user-activation *; monetization; gamepad; keyboard-map *; xr-spatial-tracking; clipboard-write; clipboard-read; accelerometer; gyroscope; picture-in-picture; payment; microphone"
                sandbox="allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-presentation allow-scripts allow-same-origin allow-downloads"
              />
            </div>
          </div>
        )}

        {/* Tactical Tips for Roblox & Fortnite */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-start gap-3 text-xs text-slate-300">
          <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-white block uppercase tracking-wider text-[11px]">
              Cloud Gaming Optimization Tips
            </span>
            <p>
              • <strong>Roblox:</strong> For the best performance, click <em>now.gg Cloud</em> or <em>Xbox Cloud Gaming</em>. If blocked on a school Wi-Fi network, switch on <strong>Proxy Mode</strong> or click <strong>Stealth Popout</strong> to disguise the stream as <strong>Google.classroom-Home</strong>.
            </p>
            <p>
              • <strong>Fortnite:</strong> Xbox Cloud Gaming provides 100% free streaming with no Game Pass or subscription needed. Connect a Bluetooth/USB controller or use touch/keyboard controls.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
