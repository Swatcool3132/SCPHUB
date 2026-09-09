import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Globe,
  Gamepad2,
  ExternalLink,
  Plus,
  Trash2,
  EyeOff,
  Sparkles,
  X,
  Upload,
  RefreshCw,
  Clock,
  Shield,
  Layers,
  Cloud,
  KeyRound,
  BookOpen,
  Lock
} from 'lucide-react';
import { ScpAnimatedBackground } from './ScpAnimatedBackground';

const DEFAULT_SHORTCUTS = [
  { id: 'sc-cloud', title: 'Cloud Gaming (Roblox & Fortnite)', type: 'tab', target: 'cloudgaming', icon: 'cloud', color: 'from-blue-600 via-cyan-600 to-indigo-700' },
  { id: 'sc-scpwiki', title: 'SCP Wiki (wikidot.com)', type: 'tab', target: 'scpwiki', icon: 'book', color: 'from-amber-600 via-orange-600 to-red-700' },
  { id: 'sc-passwords', title: '3 Weekly Passwords', type: 'custom', target: 'passwords', icon: 'key', color: 'from-emerald-600 via-teal-600 to-cyan-700' },
  { id: 'sc-ai', title: 'AI Studio (Gemini & ChatGPT)', type: 'tab', target: 'ai', icon: 'sparkles', color: 'from-purple-600 via-indigo-600 to-sky-600' },
  { id: 'sc-arcade', title: 'Game Arcade', type: 'tab', target: 'arcade', icon: 'gamepad', color: 'from-sky-500 to-indigo-600' },
  { id: 'sc-proxy', title: 'DuckDuckGo Proxy', type: 'tab', target: 'proxy', icon: 'duck', color: 'from-amber-500 to-orange-600' },
  { id: 'sc-mc', title: 'Minecraft', type: 'game', target: 'minecraft', icon: 'M', color: 'from-emerald-500 to-teal-700' },
  { id: 'sc-slope', title: 'Slope 3D', type: 'game', target: 'slope', icon: 'S', color: 'from-emerald-400 to-cyan-600' },
  { id: 'sc-snow', title: 'Snow Rider', type: 'game', target: 'snow-rider-3d', icon: 'R', color: 'from-cyan-500 to-blue-600' },
  { id: 'sc-rb', title: 'Retro Bowl', type: 'game', target: 'retro-bowl', icon: 'B', color: 'from-amber-600 to-red-600' },
  { id: 'sc-chess', title: 'Chess Online', type: 'game', target: 'chess', icon: '♟', color: 'from-purple-500 to-indigo-700' }
];

export const NewTabPage = ({
  onNavigateTab,
  onOpenGame,
  onPerformSearch,
  onOpenUrl,
  currentUser,
  onOpenAuth,
  onOpenProfile,
  onOpenPasswords,
  onLockSite
}) => {
  const [query, setQuery] = useState('');
  const [engine, setEngine] = useState('ddg'); // 'ddg' | 'google' | 'games'
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [customBg, setCustomBg] = useState(() => {
    try {
      return localStorage.getItem('ub_custom_bg') || null;
    } catch {
      return null;
    }
  });

  const [shortcuts, setShortcuts] = useState(() => {
    try {
      const saved = localStorage.getItem('ub_shortcuts');
      return saved ? JSON.parse(saved) : DEFAULT_SHORTCUTS;
    } catch {
      return DEFAULT_SHORTCUTS;
    }
  });

  const [showAddShortcut, setShowAddShortcut] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [showBgSettings, setShowBgSettings] = useState(false);

  const inputRef = useRef(null);
  const suggestionTimerRef = useRef(null);
  const fileInputRef = useRef(null);

  // Live Digital Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
      );
      setCurrentDate(
        now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Save shortcuts
  useEffect(() => {
    try {
      localStorage.setItem('ub_shortcuts', JSON.stringify(shortcuts));
    } catch {}
  }, [shortcuts]);

  // Autocomplete fetch from server proxy
  const handleQueryChange = (val) => {
    setQuery(val);
    if (suggestionTimerRef.current) clearTimeout(suggestionTimerRef.current);
    if (!val.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    suggestionTimerRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/ddg/suggest?q=${encodeURIComponent(val.trim())}`);
        if (res.ok) {
          const data = await res.json();
          setSuggestions(Array.isArray(data.suggestions) ? data.suggestions.slice(0, 6) : []);
          setShowSuggestions(true);
        }
      } catch {
        setSuggestions([]);
      }
    }, 180);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    executeSearch(query);
  };

  const executeSearch = (searchTerm) => {
    const term = searchTerm.trim();
    if (!term) return;
    setShowSuggestions(false);

    // Check if entered term looks like a URL
    if (
      term.startsWith('http://') ||
      term.startsWith('https://') ||
      /^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/.*)?$/.test(term)
    ) {
      const fullUrl = term.startsWith('http') ? term : `https://${term}`;
      onOpenUrl(fullUrl);
      return;
    }

    if (engine === 'games') {
      onNavigateTab('arcade', { searchQuery: term });
    } else if (engine === 'ai') {
      onNavigateTab('ai', { prompt: term });
    } else {
      onPerformSearch(term);
    }
  };

  const handleCustomFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      setCustomBg(result);
      try {
        localStorage.setItem('ub_custom_bg', result);
      } catch (err) {
        console.warn('Storage quota exceeded, background kept in memory:', err);
      }
      setShowBgSettings(false);
    };
    reader.readAsDataURL(file);
  };

  const handleResetBg = () => {
    setCustomBg(null);
    try {
      localStorage.removeItem('ub_custom_bg');
    } catch {}
    setShowBgSettings(false);
  };

  const handleAddShortcut = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newUrl.trim()) return;

    let targetUrl = newUrl.trim();
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = 'https://' + targetUrl;
    }

    const item = {
      id: 'sc-' + Date.now(),
      title: newTitle.trim(),
      type: 'url',
      target: targetUrl,
      icon: newTitle.trim().charAt(0).toUpperCase(),
      color: 'from-cyan-600 to-sky-700'
    };

    setShortcuts((prev) => [...prev, item]);
    setNewTitle('');
    setNewUrl('');
    setShowAddShortcut(false);
  };

  const handleDeleteShortcut = (id, e) => {
    e.stopPropagation();
    setShortcuts((prev) => prev.filter((s) => s.id !== id));
  };

  const handleShortcutClick = (s) => {
    if (s.target === 'passwords' && onOpenPasswords) {
      onOpenPasswords();
      return;
    }
    if (s.type === 'tab') {
      onNavigateTab(s.target);
    } else if (s.type === 'game') {
      onOpenGame(s.target);
    } else if (s.type === 'url') {
      onOpenUrl(s.target);
    }
  };

  return (
    <div className="relative flex-1 flex flex-col justify-between items-center min-h-[calc(100vh-5.5rem)] px-4 py-8 select-none overflow-hidden">
      {/* Background Animated SCP Emblem from uploaded GIF */}
      <ScpAnimatedBackground customBgUrl={customBg} />

      {/* Top Telemetry & Clearance Status */}
      <div className="relative z-10 w-full max-w-5xl flex items-center justify-between text-xs text-cyan-400/80 font-mono">
        {currentUser ? (
          <button
            type="button"
            onClick={onOpenProfile}
            className="flex items-center gap-2 bg-black/60 hover:bg-black/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-cyan-500/30 hover:border-cyan-400 shadow-[0_0_15px_rgba(0,229,255,0.15)] transition cursor-pointer"
            title="Click to view your Agent ID card and high scores"
          >
            <span className="text-sm leading-none">{currentUser.avatar?.icon || '🛡️'}</span>
            <span className="hidden sm:inline font-bold text-cyan-400">AGENT:</span>
            <span className="font-bold text-cyan-300">{currentUser.username}</span>
            <span className="text-[10px] text-slate-400">({currentUser.clearance?.badge || 'Level 2'})</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </button>
        ) : (
          <button
            type="button"
            onClick={onOpenAuth}
            className="flex items-center gap-2 bg-black/60 hover:bg-black/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-cyan-500/30 hover:border-cyan-400 shadow-[0_0_15px_rgba(0,229,255,0.15)] transition cursor-pointer text-cyan-300 hover:text-white"
            title="Sign In / Create Account"
          >
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-bold">SIGN IN</span>
          </button>
        )}

        <div className="flex items-center gap-3">
          <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-cyan-500/30 flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-bold text-slate-100">{currentTime || '00:00:00'}</span>
            <span className="text-slate-400 text-[11px] hidden md:inline">({currentDate})</span>
          </div>

          <button
            type="button"
            onClick={() => setShowBgSettings(!showBgSettings)}
            className="p-1.5 bg-black/60 hover:bg-black/90 backdrop-blur-md rounded-lg border border-cyan-500/30 text-cyan-300 hover:text-white transition cursor-pointer"
            title="Configure Background / GIF"
          >
            <Layers className="w-4 h-4" />
          </button>

          {onLockSite && (
            <button
              type="button"
              onClick={onLockSite}
              className="px-2.5 py-1.5 bg-black/60 hover:bg-black/90 backdrop-blur-md rounded-lg border border-amber-500/30 text-amber-300 hover:text-amber-200 transition cursor-pointer flex items-center gap-1.5 text-xs font-bold"
              title="Lock Site with Weekly Password Gate"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">LOCK SITE</span>
            </button>
          )}
        </div>
      </div>

      {/* Background Settings Dropdown / Modal */}
      {showBgSettings && (
        <div className="relative z-30 w-full max-w-md bg-slate-900/95 border border-cyan-500/50 rounded-2xl p-4 shadow-2xl backdrop-blur-md my-2 text-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-bold uppercase tracking-wider text-cyan-300 font-mono">
              New Tab Background
            </span>
            <button
              onClick={() => setShowBgSettings(false)}
              className="text-slate-400 hover:text-white p-1 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-slate-300 text-xs leading-relaxed">
            Active: <span className="font-bold text-cyan-400">{customBg ? 'Custom Background / GIF' : 'Official SCP Foundation Animated Neon GIF (Default)'}</span>
          </p>

          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 py-2 px-3 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload GIF / Image</span>
            </button>

            {customBg && (
              <button
                type="button"
                onClick={handleResetBg}
                className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset to SCP GIF</span>
              </button>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.gif"
            onChange={handleCustomFileUpload}
            className="hidden"
          />
        </div>
      )}

      {/* Center Core: Search Bar & Omnibox */}
      <div className="relative z-10 w-full max-w-2xl flex flex-col items-center gap-6 my-auto">
        {/* Foundation Terminal Title Header */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-wider text-white drop-shadow-[0_0_20px_rgba(0,229,255,0.7)] font-mono">
            SECURE SEARCH <span className="text-cyan-400 font-sans">PORTAL</span>
          </h1>
          <p className="text-xs sm:text-sm text-cyan-400/80 font-mono tracking-widest uppercase">
            ENTER QUERY OR WEB URL TO INITIALIZE PROXY
          </p>
        </div>

        {/* Search Engine Selector + Search Bar */}
        <div className="w-full relative">
          <form onSubmit={handleSearchSubmit} className="relative">
            <div className="w-full bg-slate-950/85 backdrop-blur-xl border border-cyan-500/50 hover:border-cyan-400 focus-within:border-cyan-400 focus-within:ring-4 focus-within:ring-cyan-500/20 rounded-2xl shadow-[0_0_30px_rgba(0,229,255,0.25)] flex items-center p-2 gap-2 transition-all">
              {/* Engine Toggle Pill */}
              <div className="flex items-center gap-1 bg-black/60 border border-slate-800 rounded-xl p-1 shrink-0">
                <button
                  type="button"
                  onClick={() => setEngine('ddg')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                    engine === 'ddg'
                      ? 'bg-amber-500 text-slate-950 font-black shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="DuckDuckGo Proxy Search"
                >
                  <span>🦆</span>
                  <span className="hidden sm:inline">DuckDuckGo</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEngine('games')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                    engine === 'games'
                      ? 'bg-sky-600 text-white font-black shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Search Arcade Games"
                >
                  <Gamepad2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Games</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEngine('ai')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                    engine === 'ai'
                      ? 'bg-gradient-to-r from-purple-600 to-sky-600 text-white font-black shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Ask Gemini or ChatGPT"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-300" />
                  <span className="hidden sm:inline">AI Studio</span>
                </button>
              </div>

              {/* Input */}
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => handleQueryChange(e.target.value)}
                onFocus={() => {
                  if (suggestions.length > 0) setShowSuggestions(true);
                }}
                placeholder={
                  engine === 'games'
                    ? 'Search 40+ unblocked games...'
                    : engine === 'ai'
                    ? 'Ask Gemini or ChatGPT anything...'
                    : 'Search DuckDuckGo or enter URL (e.g. google.com)...'
                }
                className="w-full bg-transparent text-sm sm:text-base text-slate-100 placeholder-slate-500 focus:outline-none px-2 font-medium"
              />

              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    setSuggestions([]);
                    setShowSuggestions(false);
                    inputRef.current?.focus();
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 active:scale-95 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-1.5 transition shadow-[0_0_15px_rgba(0,229,255,0.4)] cursor-pointer shrink-0"
              >
                <Search className="w-4 h-4 text-slate-950" />
                <span className="hidden sm:inline">Execute</span>
              </button>
            </div>
          </form>

          {/* Autocomplete Suggestions Popup */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-slate-950/95 border border-cyan-500/40 rounded-2xl shadow-2xl backdrop-blur-xl z-50 overflow-hidden py-1 divide-y divide-slate-800/60">
              {suggestions.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setQuery(item);
                    executeSearch(item);
                  }}
                  className="w-full text-left px-4 py-2.5 text-xs sm:text-sm text-slate-200 hover:bg-cyan-950/40 hover:text-cyan-300 flex items-center gap-2.5 transition cursor-pointer font-mono"
                >
                  <Search className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="truncate">{item}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quick Access Shortcuts Grid */}
        <div className="w-full space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1 font-mono">
            <span className="flex items-center gap-1 text-cyan-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>QUICK SHORTCUTS</span>
            </span>
            <button
              type="button"
              onClick={() => setShowAddShortcut(!showAddShortcut)}
              className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-bold cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>

          {/* Add Shortcut Form */}
          {showAddShortcut && (
            <form
              onSubmit={handleAddShortcut}
              className="p-3 rounded-xl bg-slate-900/90 border border-cyan-500/30 flex flex-wrap gap-2 items-center text-xs animate-in fade-in"
            >
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Title (e.g. Google Docs)"
                className="flex-1 min-w-[120px] bg-slate-950 border border-slate-700 px-3 py-1.5 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none"
              />
              <input
                type="text"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder="URL (e.g. docs.google.com)"
                className="flex-1 min-w-[160px] bg-slate-950 border border-slate-700 px-3 py-1.5 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-cyan-500 text-slate-950 font-bold rounded-lg hover:bg-cyan-400 cursor-pointer"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setShowAddShortcut(false)}
                className="px-2 py-1.5 text-slate-400 hover:text-white"
              >
                Cancel
              </button>
            </form>
          )}

          {/* Shortcuts Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {shortcuts.map((s) => (
              <div
                key={s.id}
                onClick={() => handleShortcutClick(s)}
                className="group relative p-2.5 rounded-xl bg-slate-950/70 hover:bg-slate-900/90 border border-cyan-500/20 hover:border-cyan-400/80 transition-all flex items-center gap-2.5 cursor-pointer backdrop-blur-md shadow-sm"
              >
                <div
                  className={`w-8 h-8 rounded-lg bg-gradient-to-br ${s.color || 'from-sky-500 to-indigo-600'} flex items-center justify-center font-bold text-white text-xs shadow shrink-0`}
                >
                  {s.icon === 'duck' ? (
                    '🦆'
                  ) : s.icon === 'gamepad' ? (
                    <Gamepad2 className="w-4 h-4" />
                  ) : s.icon === 'sparkles' ? (
                    <Sparkles className="w-4 h-4 text-purple-200" />
                  ) : s.icon === 'cloud' ? (
                    <Cloud className="w-4 h-4 text-sky-200" />
                  ) : s.icon === 'book' ? (
                    <BookOpen className="w-4 h-4 text-amber-200" />
                  ) : s.icon === 'key' ? (
                    <KeyRound className="w-4 h-4 text-emerald-200" />
                  ) : (
                    s.icon
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 truncate">
                    {s.title}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate uppercase font-mono">
                    {s.type}
                  </div>
                </div>

                {/* Delete button if custom */}
                {s.type === 'url' && (
                  <button
                    type="button"
                    onClick={(e) => handleDeleteShortcut(s.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 rounded transition"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Footer Credits */}
      <div className="relative z-10 w-full max-w-5xl flex items-center justify-between text-[11px] text-cyan-400/60 font-mono pt-4 border-t border-cyan-500/20">
        <span>SCPHUB PROTOCOL • ANOMALOUS ARCADE CORE</span>
        <span className="hidden sm:inline">OYL BKQJZWPEKJ ↔ SCP FOUNDATION</span>
        <button
          type="button"
          onClick={() => {
            const win = window.open('about:blank', '_blank');
            if (win) {
              win.document.title = 'Google Docs';
              const ifr = win.document.createElement('iframe');
              ifr.src = window.location.href;
              ifr.style.position = 'fixed';
              ifr.style.inset = '0';
              ifr.style.width = '100vw';
              ifr.style.height = '100vh';
              ifr.style.border = 'none';
              win.document.body.style.margin = '0';
              win.document.body.appendChild(ifr);
            }
          }}
          className="hover:text-cyan-300 flex items-center gap-1 cursor-pointer font-bold"
        >
          <EyeOff className="w-3 h-3" />
          <span>Stealth Tab</span>
        </button>
      </div>
    </div>
  );
};
