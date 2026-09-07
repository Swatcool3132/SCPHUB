import React, { useState, useEffect, useRef } from 'react';
import { Search, EyeOff, Star, Check, ShieldAlert, Globe, Gamepad2, Sparkles } from 'lucide-react';
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
  setCurrentTab
}) => {
  const [showCloakMenu, setShowCloakMenu] = useState(false);
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
    document.title = profile.title;
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.getElementsByTagName('head')[0].appendChild(link);
    }
    if (profile.id === 'none') {
      link.href = '/scp-logo.svg';
    } else {
      link.href = profile.iconUrl;
    }
    setShowCloakMenu(false);
  };

  const handlePanicTrigger = () => {
    // Immediate stealth mode: disguise as Google Classroom & blur window
    const classroom = CLOAK_PROFILES.find((p) => p.id === 'classroom') || CLOAK_PROFILES[1];
    if (classroom) {
      handleSelectCloak(classroom);
    }
    window.open('https://classroom.google.com', '_blank');
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
        </div>
      </div>

      {/* Search Bar (When in arcade mode, searches games) */}
      {currentTab === 'arcade' ? (
        <div className="flex-1 max-w-xs sm:max-w-md mx-4">
          <div className="h-10 bg-slate-900 border border-slate-700/80 rounded-lg flex items-center px-3 gap-2 text-slate-100 focus-within:border-sky-500 focus-within:ring-1 focus-within:ring-sky-500/30 transition-all shadow-inner">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search games, tags, sports... (Press '/')"
              className="w-full bg-transparent border-none text-slate-100 placeholder-slate-500 text-xs sm:text-sm outline-none"
            />
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery('')}
                className="text-slate-400 hover:text-white text-xs font-bold px-1"
              >
                ✕
              </button>
            ) : (
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-500 bg-slate-800 rounded border border-slate-700">
                /
              </kbd>
            )}
          </div>
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
                    className={`w-full flex items-center justify-between text-left px-2.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition cursor-pointer ${
                      activeCloak === profile.id
                        ? 'bg-sky-500 text-white shadow-sm'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span className="truncate">{profile.name}</span>
                    {activeCloak === profile.id && <Check className="w-3.5 h-3.5 text-white" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

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
    </header>
  );
};
