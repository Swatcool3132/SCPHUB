import React, { useState, useRef, useEffect } from 'react';
import {
  Plus,
  X,
  RotateCw,
  ArrowLeft,
  ArrowRight,
  Home,
  Shield,
  EyeOff,
  Maximize2,
  Minimize2,
  Globe,
  Gamepad2,
  Search,
  Lock,
  ExternalLink,
  Sparkles,
  Bot,
  Cloud,
  BookOpen
} from 'lucide-react';
import { CLOAK_PROFILES } from '../data/games';
import { ScpLogo } from './ScpLogo';

export const TabBar = ({
  tabs,
  activeTabId,
  onSelectTab,
  onCloseTab,
  onNewTab,
  onReloadTab,
  onGoHome,
  onNavigateUrl,
  activeCloak,
  setActiveCloak,
  onLockSite
}) => {
  const [omniboxValue, setOmniboxValue] = useState('');
  const [isEditingOmnibox, setIsEditingOmnibox] = useState(false);
  const [showCloakMenu, setShowCloakMenu] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const omniboxInputRef = useRef(null);

  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];

  // Sync omnibox display value with active tab
  useEffect(() => {
    if (activeTab && !isEditingOmnibox) {
      if (activeTab.type === 'newtab') {
        setOmniboxValue('scphub://newtab');
      } else if (activeTab.type === 'arcade') {
        setOmniboxValue('scphub://arcade');
      } else if (activeTab.type === 'proxy') {
        setOmniboxValue(
          activeTab.query ? `scphub://proxy?q=${encodeURIComponent(activeTab.query)}` : 'scphub://proxy'
        );
      } else if (activeTab.type === 'ai') {
        setOmniboxValue('scphub://ai');
      } else if (activeTab.type === 'cloudgaming') {
        setOmniboxValue('scphub://cloudgaming');
      } else if (activeTab.type === 'scpwiki') {
        setOmniboxValue('https://scp-wiki.wikidot.com/');
      } else if (activeTab.type === 'game') {
        setOmniboxValue(`game://${activeTab.game?.slug || activeTab.game?.id || 'play'}`);
      } else if (activeTab.type === 'web') {
        setOmniboxValue(activeTab.url || 'https://');
      }
    }
  }, [activeTab, isEditingOmnibox]);

  const handleOmniboxSubmit = (e) => {
    e.preventDefault();
    const val = omniboxValue.trim();
    if (!val) return;
    setIsEditingOmnibox(false);
    onNavigateUrl(val);
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleSelectCloak = (profile) => {
    setActiveCloak(profile.id);
    document.title = profile.tabTitle || profile.title || 'Google Classroom - Home';
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.getElementsByTagName('head')[0].appendChild(link);
    }
    link.href = profile.id === 'none' ? '/vite.svg' : (profile.favicon || profile.iconUrl || 'https://ssl.gstatic.com/classroom/favicon.png');
    setShowCloakMenu(false);
  };

  const renderTabFavicon = (tab) => {
    if (tab.type === 'newtab') {
      return <ScpLogo className="w-4 h-4 shrink-0" showGlow={false} />;
    }
    if (tab.type === 'arcade') {
      return <Gamepad2 className="w-4 h-4 text-sky-400 shrink-0" />;
    }
    if (tab.type === 'cloudgaming') {
      return <Cloud className="w-4 h-4 text-sky-400 shrink-0" />;
    }
    if (tab.type === 'scpwiki') {
      return <BookOpen className="w-4 h-4 text-amber-400 shrink-0" />;
    }
    if (tab.type === 'proxy') {
      return <span className="text-xs leading-none shrink-0">🦆</span>;
    }
    if (tab.type === 'ai') {
      return <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />;
    }
    if (tab.type === 'game') {
      if (tab.game?.thumbnail) {
        return (
          <img
            src={tab.game.thumbnail}
            alt=""
            className="w-4 h-4 rounded-sm object-cover shrink-0"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        );
      }
      return <Gamepad2 className="w-4 h-4 text-amber-400 shrink-0" />;
    }
    return <Globe className="w-4 h-4 text-slate-400 shrink-0" />;
  };

  return (
    <div className="w-full bg-[#080c14] border-b border-slate-800 text-slate-200 select-none sticky top-0 z-40">
      {/* 1. TOP BROWSER TAB STRIP */}
      <div className="flex items-center px-2 pt-1.5 gap-1 overflow-x-auto no-scrollbar border-b border-slate-800/60 bg-[#060910]">
        {/* Brand Badge */}
        <div
          onClick={onGoHome}
          className="flex items-center gap-1.5 px-2.5 py-1 mr-1 rounded-md text-xs font-black tracking-tight text-white cursor-pointer hover:bg-slate-800/80 transition shrink-0"
          title="SCPHub Anomalous Browser"
        >
          <ScpLogo className="w-4 h-4" showGlow />
          <span className="font-mono text-cyan-400 hidden md:inline">SCP</span>
          <span className="text-white hidden md:inline">HUB</span>
        </div>

        {/* Tab Items */}
        <div className="flex items-center gap-1 flex-1 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTabId;
            return (
              <div
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-t-xl text-xs font-semibold cursor-pointer transition-all max-w-[200px] min-w-[110px] sm:min-w-[140px] shrink-0 ${
                  isActive
                    ? 'bg-[#0f172a] text-cyan-300 shadow-[0_-2px_10px_rgba(0,0,0,0.5)] border-t-2 border-t-cyan-400 border-x border-slate-800/80'
                    : 'bg-slate-900/50 text-slate-400 hover:text-slate-200 hover:bg-slate-850 border-t-2 border-t-transparent border-x border-transparent'
                }`}
              >
                {/* Favicon */}
                {renderTabFavicon(tab)}

                {/* Title */}
                <span className="truncate flex-1 font-medium">{tab.title}</span>

                {/* Close Tab Button (Always active or on hover) */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCloseTab(tab.id);
                  }}
                  className={`p-0.5 rounded-full hover:bg-slate-700/80 hover:text-rose-400 transition cursor-pointer ${
                    isActive ? 'opacity-80 group-hover:opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}
                  title="Close tab"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            );
          })}

          {/* Plus / Add Tab Button */}
          <button
            type="button"
            onClick={onNewTab}
            className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/10 transition cursor-pointer shrink-0 ml-0.5"
            title="Open New Tab (with SCP GIF background)"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Right Corner: Stealth Cloak & Fullscreen */}
        <div className="flex items-center gap-1 shrink-0 pb-1">
          {/* Cloak Menu Trigger */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowCloakMenu(!showCloakMenu)}
              className="flex items-center gap-1 px-2 py-1 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold transition cursor-pointer"
              title="Stealth Cloaking Profiles"
            >
              <EyeOff className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden sm:inline">Stealth</span>
            </button>

            {showCloakMenu && (
              <div className="absolute right-0 top-full mt-1.5 w-60 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in space-y-1 text-xs">
                <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  Tab Cloak Profiles
                </div>
                {CLOAK_PROFILES.map((profile) => (
                  <button
                    key={profile.id}
                    type="button"
                    onClick={() => handleSelectCloak(profile)}
                    className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition cursor-pointer ${
                      activeCloak === profile.id
                        ? 'bg-sky-600 text-white font-bold'
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
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Fullscreen Button */}
          <button
            type="button"
            onClick={handleToggleFullscreen}
            className="p-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700 text-xs transition cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>

          {/* Quick Lock Site Button */}
          {onLockSite && (
            <button
              type="button"
              onClick={onLockSite}
              className="p-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-amber-400/90 hover:text-amber-300 border border-slate-700 text-xs transition cursor-pointer"
              title="Lock Site with Password Gate"
            >
              <Lock className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 2. NAVIGATION BAR & OMNIBOX */}
      <div className="flex items-center px-3 py-1.5 gap-2 bg-[#0f172a]">
        {/* Nav Controls: Home, Reload */}
        <div className="flex items-center gap-1 text-slate-400">
          <button
            type="button"
            onClick={onGoHome}
            className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-cyan-300 transition cursor-pointer"
            title="Go to New Tab"
          >
            <Home className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={onReloadTab}
            className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition cursor-pointer"
            title="Reload current tab"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Omnibox / URL Search Bar */}
        <form onSubmit={handleOmniboxSubmit} className="flex-1 max-w-4xl mx-auto">
          <div className="flex items-center bg-slate-950/80 border border-slate-700/80 hover:border-cyan-500/50 focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-500/20 rounded-xl px-3 py-1 gap-2 transition-all shadow-inner">
            <Lock className="w-3 h-3 text-emerald-400 shrink-0" />
            <input
              ref={omniboxInputRef}
              type="text"
              value={omniboxValue}
              onChange={(e) => setOmniboxValue(e.target.value)}
              onFocus={() => setIsEditingOmnibox(true)}
              onBlur={() => setTimeout(() => setIsEditingOmnibox(false), 200)}
              placeholder="Search DuckDuckGo or enter web URL..."
              className="w-full bg-transparent text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none font-mono"
            />
            {omniboxValue && isEditingOmnibox && (
              <button
                type="button"
                onClick={() => {
                  setOmniboxValue('');
                  omniboxInputRef.current?.focus();
                }}
                className="p-0.5 rounded text-slate-500 hover:text-slate-300"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </form>

        {/* Quick Tab Type Switchers */}
        <div className="hidden lg:flex items-center gap-1 text-xs">
          <button
            type="button"
            onClick={() => onNavigateUrl('scphub://arcade')}
            className={`px-2.5 py-1 rounded-md font-bold transition cursor-pointer flex items-center gap-1 ${
              activeTab.type === 'arcade'
                ? 'bg-sky-600 text-white'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>Arcade</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateUrl('scphub://proxy')}
            className={`px-2.5 py-1 rounded-md font-bold transition cursor-pointer flex items-center gap-1 ${
              activeTab.type === 'proxy'
                ? 'bg-amber-500 text-slate-950 font-black'
                : 'text-slate-400 hover:text-amber-300 hover:bg-slate-800'
            }`}
          >
            <span>🦆</span>
            <span>DuckDuckGo</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateUrl('scphub://ai')}
            className={`px-2.5 py-1 rounded-md font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab.type === 'ai'
                ? 'bg-gradient-to-r from-purple-600 to-sky-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-purple-300 hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>AI Studio</span>
          </button>
        </div>
      </div>
    </div>
  );
};
