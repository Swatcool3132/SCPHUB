import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  EyeOff,
  Star,
  Check,
  ShieldAlert,
  Globe,
  Gamepad2,
  Sparkles,
  FileCode,
  Copy,
  Download,
  ExternalLink,
  X,
  User,
  Lock,
  Cloud,
  BookOpen,
  KeyRound
} from 'lucide-react';
import { CLOAK_PROFILES } from '../data/games';
import { ScpLogo } from './ScpLogo';

export const Header = ({
  searchQuery,
  setSearchQuery,
  showFavoritesOnly,
  setShowFavoritesOnly,
  activeCloak,
  setActiveCloak,
  totalGames,
  currentTab,
  setCurrentTab,
  currentUser,
  onOpenAuth,
  onOpenProfile,
  onSearchSubmit,
  onOpenPasswords,
  onLockSite
}) => {
  const [showCloakMenu, setShowCloakMenu] = useState(false);
  const [showMimoModal, setShowMimoModal] = useState(false);
  const [copiedMimo, setCopiedMimo] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);
  const searchInputRef = useRef(null);

  // Global keyboard shortcut: "/" to focus search, "Escape" for panic cloak
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === 'Escape' && e.shiftKey) {
        // Shift+Escape emergency panic action
        handlePanicTrigger();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelectCloak = (profile) => {
    setActiveCloak(profile.id);
    document.title = profile.tabTitle || profile.title || 'Google Classroom - Home';
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.getElementsByTagName('head')[0].appendChild(link);
    }
    if (profile.id === 'none') {
      link.href = '/vite.svg';
    } else {
      link.href = profile.favicon || profile.iconUrl || 'https://ssl.gstatic.com/classroom/favicon.png';
    }
    setShowCloakMenu(false);
  };

  const handlePanicTrigger = () => {
    // Immediate stealth mode: disguise as Google Classroom - Home
    const classroom =
      CLOAK_PROFILES.find((p) => p.id === 'google-classroom-home') ||
      CLOAK_PROFILES.find((p) => p.id === 'classroom') ||
      CLOAK_PROFILES[1];
    if (classroom) {
      handleSelectCloak(classroom);
    }
    window.open('https://classroom.google.com', '_blank');
  };

  const handleCopyMimo = async () => {
    try {
      const res = await fetch('/mimo.html');
      const html = await res.text();
      await navigator.clipboard.writeText(html);
      setCopiedMimo(true);
      setTimeout(() => setCopiedMimo(false), 3000);
    } catch {
      window.open('/mimo.html', '_blank');
    }
  };

  const handleDownloadMimo = () => {
    const a = document.createElement('a');
    a.href = '/mimo.html';
    a.download = 'index.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopyScript = async () => {
    try {
      const res = await fetch('/script.js');
      const js = await res.text();
      await navigator.clipboard.writeText(js);
      setCopiedScript(true);
      setTimeout(() => setCopiedScript(false), 3000);
    } catch {
      window.open('/script.js', '_blank');
    }
  };

  const handleDownloadScript = () => {
    const a = document.createElement('a');
    a.href = '/script.js';
    a.download = 'script.js';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <header className="h-16 flex-shrink-0 border-b border-slate-800 bg-[#0f172a]/95 backdrop-blur-md flex items-center justify-between px-4 sm:px-8 z-30 sticky top-0 transition-colors">
      {/* Brand & Navigation Tabs */}
      <div className="flex items-center gap-3 sm:gap-6">
        <div
          onClick={() => setCurrentTab('arcade')}
          className="flex items-center gap-3 cursor-pointer select-none"
        >
          {/* SCP Foundation Logo Emblem */}
          <ScpLogo className="w-9 h-9" showGlow />
          <div className="flex flex-col">
            <span className="text-lg sm:text-xl font-black tracking-tighter uppercase text-white leading-none">
              SCP<span className="text-sky-400">HUB</span>
            </span>
            <span className="text-[9px] font-bold tracking-widest text-slate-400 uppercase leading-none mt-0.5">
              SECURE • CONTAIN • PLAY
            </span>
          </div>
        </div>

        {/* View Switcher: Arcade Games vs DuckDuckGo Proxy Search */}
        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setCurrentTab('arcade')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              currentTab === 'arcade'
                ? 'bg-sky-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Arcade</span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentTab('proxy')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              currentTab === 'proxy'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-amber-300 hover:bg-slate-800'
            }`}
            title="Proxy Search powered by DuckDuckGo"
          >
            <span className="text-sm leading-none">🦆</span>
            <span className="hidden sm:inline">Proxy Search</span>
            <span className="sm:hidden">Proxy</span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentTab('cloudgaming')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              currentTab === 'cloudgaming'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-sky-300 hover:bg-slate-800'
            }`}
            title="Cloud Gaming Station (Roblox, Fortnite Xbox Cloud, GeForce)"
          >
            <Cloud className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">Cloud Gaming</span>
            <span className="sm:hidden">Cloud</span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentTab('scpwiki')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              currentTab === 'scpwiki'
                ? 'bg-amber-600 text-black shadow-md font-black'
                : 'text-slate-400 hover:text-amber-300 hover:bg-slate-800'
            }`}
            title="SCP Foundation Wiki Official Unblocked Archives (scp-wiki.wikidot.com)"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">SCP Wiki</span>
            <span className="sm:hidden">Wiki</span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentTab('ai')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              currentTab === 'ai'
                ? 'bg-gradient-to-r from-purple-600 to-sky-600 text-white shadow-md'
                : 'text-slate-400 hover:text-purple-300 hover:bg-slate-800'
            }`}
            title="SCPHub AI Studio (Google Gemini 3.8 Flash & OpenAI ChatGPT-4o)"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline">AI Studio</span>
            <span className="sm:hidden">AI</span>
          </button>

          {onOpenPasswords && (
            <button
              type="button"
              onClick={onOpenPasswords}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30"
              title="View this week's 3 rotating passcodes & clearance codes"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">3 Passwords</span>
            </button>
          )}
        </div>
      </div>

      {/* Search Bar (When in arcade mode, searches games) */}
      {currentTab === 'arcade' ? (
        <div className="flex-1 max-w-xs sm:max-w-md mx-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (onSearchSubmit) onSearchSubmit(searchQuery);
            }}
            className="h-10 bg-slate-900 border border-slate-700/80 rounded-lg flex items-center px-3 gap-2 text-slate-100 focus-within:border-sky-500 focus-within:ring-1 focus-within:ring-sky-500/30 transition-all shadow-inner"
          >
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 4,000+ games, tags... (Press Enter to Play)"
              className="w-full bg-transparent border-none text-slate-100 placeholder-slate-500 text-xs sm:text-sm outline-none"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-slate-400 hover:text-white text-xs font-bold px-1 cursor-pointer"
              >
                ✕
              </button>
            ) : (
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-500 bg-slate-800 rounded border border-slate-700">
                /
              </kbd>
            )}
          </form>
        </div>
      ) : (
        <div className="flex-1 max-w-xs sm:max-w-md mx-4 text-center hidden sm:block">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400/90 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            DuckDuckGo Proxy Search Engine Active
          </span>
        </div>
      )}

      {/* Actions Toolbar */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Favorites filter toggle (Arcade mode) */}
        {currentTab === 'arcade' && (
          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`h-10 px-3.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition border cursor-pointer ${
              showFavoritesOnly
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
            }`}
            title="Filter saved favorites"
          >
            <Star className={`w-3.5 h-3.5 ${showFavoritesOnly ? 'fill-amber-400 text-amber-400' : ''}`} />
            <span className="hidden sm:inline">Favorites</span>
          </button>
        )}

        {/* Tab Cloak Stealth Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowCloakMenu(!showCloakMenu)}
            className={`h-10 px-3.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition border cursor-pointer ${
              activeCloak !== 'none'
                ? 'bg-sky-500/20 text-sky-300 border-sky-500/50 shadow-sm'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
            }`}
            title="Disguise browser tab title & icon (Cloak)"
          >
            <EyeOff className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Tab Cloak</span>
          </button>

          {showCloakMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-[#1e293b] border border-slate-700 rounded-xl shadow-2xl p-2 z-50">
              <div className="text-[10px] font-bold text-slate-400 px-2.5 py-1.5 uppercase tracking-widest border-b border-slate-700/60 mb-1">
                Disguise Tab Profile
              </div>
              <div className="space-y-1">
                {CLOAK_PROFILES.map((profile) => (
                  <button
                    key={profile.id}
                    onClick={() => handleSelectCloak(profile)}
                    className={`w-full flex items-center justify-between text-left px-2.5 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                      activeCloak === profile.id
                        ? 'bg-sky-500 text-white shadow-sm'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <img
                        src={profile.favicon || profile.iconUrl}
                        alt=""
                        className="w-4 h-4 rounded-sm object-contain bg-white/10"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <span className="truncate">{profile.name}</span>
                    </div>
                    {activeCloak === profile.id && <Check className="w-3.5 h-3.5 text-white shrink-0 ml-1" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Mimo.org 1-File HTML Export Button */}
        <button
          onClick={() => setShowMimoModal(true)}
          className="h-10 px-3.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition border cursor-pointer bg-gradient-to-r from-emerald-600/30 to-teal-600/30 hover:from-emerald-600/40 hover:to-teal-600/40 text-emerald-300 border-emerald-500/40 shadow-sm"
          title="Get 1-File HTML for Mimo.org & unblocked school hosting"
        >
          <FileCode className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">Mimo 1-File</span>
        </button>

        {/* Agent Profile / Sign-In Button */}
        {currentUser ? (
          <button
            type="button"
            onClick={onOpenProfile}
            className="h-10 px-2.5 sm:px-3 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition border cursor-pointer bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700 shadow-sm"
            title={`Agent ${currentUser.username} (${currentUser.clearance?.badge}) - Click to view ID card or switch account`}
          >
            <span className="text-base leading-none">{currentUser.avatar?.icon || '🛡️'}</span>
            <div className="flex flex-col text-left leading-tight hidden sm:flex">
              <span className="text-xs font-black text-white truncate max-w-[90px]">
                {currentUser.username}
              </span>
              <span className="text-[9px] font-mono text-sky-400">
                {currentUser.clearance?.badge || 'Agent'}
              </span>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse hidden sm:inline-block" />
          </button>
        ) : (
          <button
            type="button"
            onClick={onOpenAuth}
            className="h-10 px-3 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition border cursor-pointer bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border-sky-500/40 shadow-sm"
            title="Sign in to your account"
          >
            <Lock className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">Sign In</span>
            <span className="sm:hidden">Login</span>
          </button>
        )}

        {onLockSite && (
          <button
            onClick={onLockSite}
            className="h-10 px-2.5 sm:px-3 rounded-lg text-xs font-bold uppercase tracking-wider bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-amber-300 border border-slate-700 flex items-center gap-1.5 transition cursor-pointer"
            title="Lock Site with Weekly Password Gate"
          >
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden xl:inline">Lock Site</span>
          </button>
        )}

        {/* Quick Emergency Panic Button */}
        <button
          onClick={handlePanicTrigger}
          className="h-10 px-3 rounded-lg text-xs font-black uppercase tracking-wider bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1.5 transition cursor-pointer active:scale-95"
          title="Emergency Panic: Instantly cloaks tab and redirects (Shift+Esc)"
        >
          <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
          <span className="hidden lg:inline">Panic</span>
        </button>
      </div>

      {/* Mimo 1-File HTML Modal */}
      {showMimoModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowMimoModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                <FileCode className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white uppercase tracking-tight">
                  Mimo.org 1-File HTML
                </h3>
                <p className="text-xs text-slate-400">
                  Zero-dependency standalone HTML file for pasting directly into Mimo.org
                </p>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 my-4 space-y-2 text-xs text-slate-300">
              <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                <span>✓</span> Works 100% inside Mimo.org
              </div>
              <p>
                Because Securly blocks <code className="text-cyan-400">*.run.app</code>, pasting this <strong>1-file HTML</strong> into Mimo runs directly under <code className="text-emerald-400">mimo.org</code>, keeping it unblocked on school Chromebooks!
              </p>
              <ul className="list-disc list-inside text-slate-400 space-y-1 mt-2">
                <li>Animated typewriter "SECURE • CONTAIN • PROTECT"</li>
                <li>Unblocked game vault + native offline Cyber Snake</li>
                <li>Tab cloaker (Google Docs, Classroom, Drive, Desmos)</li>
                <li>Emergency panic screen (Key: ~ or Esc)</li>
              </ul>
            </div>

            <div className="space-y-3 mt-4">
              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                <div className="text-[11px] font-bold text-sky-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Option 1: Complete script.js (All Games Logic)</span>
                  <span className="text-[10px] text-slate-500 font-normal">For Mimo's script.js tab</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    onClick={handleCopyScript}
                    className="w-full py-2 px-3 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 bg-sky-500 hover:bg-sky-400 text-slate-950 transition cursor-pointer"
                  >
                    {copiedScript ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-slate-950 stroke-[3]" />
                        <span>Copied script.js!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy script.js</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleDownloadScript}
                    className="w-full py-2 px-3 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download script.js</span>
                  </button>
                </div>
              </div>

              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Option 2: Standalone 1-File HTML</span>
                  <span className="text-[10px] text-slate-500 font-normal">All CSS + HTML + JS combined</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    onClick={handleCopyMimo}
                    className="w-full py-2 px-3 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition cursor-pointer"
                  >
                    {copiedMimo ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-slate-950 stroke-[3]" />
                        <span>Copied HTML!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy 1-File HTML</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleDownloadMimo}
                    className="w-full py-2 px-3 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download index.html</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-center gap-4 text-center">
              <a
                href="/script.js"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-400 hover:text-sky-300 hover:underline"
              >
                <span>View /script.js</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <span className="text-slate-600">•</span>
              <a
                href="/mimo.html"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 hover:underline"
              >
                <span>View /mimo.html</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
