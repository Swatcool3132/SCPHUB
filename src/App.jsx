import { useState, useEffect, useMemo } from 'react';
import { TabBar } from './components/TabBar';
import { NewTabPage } from './components/NewTabPage';
import { WebTabViewer } from './components/WebTabViewer';
import { Header } from './components/Header';
import { CategoryFilter } from './components/CategoryFilter';
import { GameCard } from './components/GameCard';
import { GamePlayer } from './components/GamePlayer';
import { FeaturedBanner } from './components/FeaturedBanner';
import { TacticalTickerBanner } from './components/TacticalTickerBanner';
import { ScpLogo } from './components/ScpLogo';
import { ProxySearch } from './components/ProxySearch';
import { AiChat } from './components/AiChat';
import { CloudGamingHub } from './components/CloudGamingHub';
import { ScpWikiViewer } from './components/ScpWikiViewer';
import { WeeklyPasswordsModal } from './components/WeeklyPasswordsModal';
import { SiteAccessGate } from './components/SiteAccessGate';
import { getWeekDetails } from './data/weeklyPasswords';
import { AuthModal } from './components/AuthModal';
import { UserProfileModal } from './components/UserProfileModal';
import { INITIAL_GAMES, CLOAK_PROFILES } from './data/games';
import { getActiveSession, logoutAccount, updateUserData, recordUserGamePlayed } from './data/auth';
import {
  Sparkles,
  Clock,
  ShieldCheck,
  Star,
  ExternalLink,
  SlidersHorizontal,
  Zap,
  Terminal,
  Lightbulb,
  CheckCircle2,
  Lock,
  X
} from 'lucide-react';

export default function App() {
  const [games, setGames] = useState(INITIAL_GAMES);
  const [activeGame, setActiveGame] = useState(null);
  const [currentTab, setCurrentTab] = useState('arcade'); // legacy fallback
  const [tabs, setTabs] = useState(() => [
    { id: 'tab-newtab-1', type: 'newtab', title: 'New Tab', key: 1 },
    { id: 'tab-arcade', type: 'arcade', title: 'Arcade', key: 2 },
    { id: 'tab-proxy', type: 'proxy', title: 'DuckDuckGo Proxy', query: '', key: 3 },
    { id: 'tab-ai', type: 'ai', title: 'AI Studio (Gemini & ChatGPT)', prompt: '', key: 4 }
  ]);
  const [activeTabId, setActiveTabId] = useState('tab-newtab-1');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('default'); // 'default' | 'rating' | 'title'
  const [featuredIdx, setFeaturedIdx] = useState(0);
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('ub_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [recents, setRecents] = useState(() => {
    try {
      const saved = localStorage.getItem('ub_recents');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [activeCloak, setActiveCloak] = useState('none');
  const [toastNotice, setToastNotice] = useState(null);
  const [visibleCount, setVisibleCount] = useState(48);

  // Persistent Client-Side Auth State (Auto-sign in)
  const [currentUser, setCurrentUser] = useState(() => getActiveSession());
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPasswordsModal, setShowPasswordsModal] = useState(false);

  // Weekly rotating site gatekeeper (No password needed for games, password needed to get on the site)
  const [isSiteUnlocked, setIsSiteUnlocked] = useState(() => {
    try {
      const raw = localStorage.getItem('scphub_site_unlocked');
      if (!raw) return false;
      const parsed = JSON.parse(raw);
      const { weekNo, year } = getWeekDetails();
      return parsed.unlocked === true && parsed.weekNo === weekNo && parsed.year === year;
    } catch {
      return false;
    }
  });

  const handleLockSite = () => {
    localStorage.removeItem('scphub_site_unlocked');
    setIsSiteUnlocked(false);
  };

  // When user is active or switches, sync user favorites
  useEffect(() => {
    if (currentUser?.favorites && currentUser.favorites.length > 0) {
      setFavorites(currentUser.favorites);
    }
  }, [currentUser?.username]);

  // Load from /games.json and merge custom local storage games
  useEffect(() => {
    fetch('/games.json')
      .then((res) => {
        if (!res.ok) throw new Error('Could not fetch games.json');
        return res.json();
      })
      .then((loadedGames) => {
        try {
          const customGamesRaw = localStorage.getItem('ub_custom_games');
          const customGames = customGamesRaw ? JSON.parse(customGamesRaw) : [];
          setGames([...loadedGames, ...customGames]);
        } catch {
          setGames(loadedGames);
        }
      })
      .catch((err) => {
        console.warn('Falling back to bundled INITIAL_GAMES:', err);
        try {
          const customGamesRaw = localStorage.getItem('ub_custom_games');
          const customGames = customGamesRaw ? JSON.parse(customGamesRaw) : [];
          setGames([...INITIAL_GAMES, ...customGames]);
        } catch {
          setGames(INITIAL_GAMES);
        }
      });
  }, []);

  // Save favorites to localStorage and sync to currentUser profile if signed in
  useEffect(() => {
    localStorage.setItem('ub_favorites', JSON.stringify(favorites));
    if (currentUser?.username) {
      updateUserData(currentUser.username, (u) => ({
        ...u,
        favorites
      }));
    }
  }, [favorites, currentUser?.username]);

  // Save recents to localStorage
  useEffect(() => {
    localStorage.setItem('ub_recents', JSON.stringify(recents));
  }, [recents]);

  const handleToggleFavorite = (gameId) => {
    setFavorites((prev) =>
      prev.includes(gameId) ? prev.filter((id) => id !== gameId) : [...prev, gameId]
    );
  };

  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    if (user.favorites && user.favorites.length > 0) {
      setFavorites(user.favorites);
    }
    setToastNotice({
      type: 'success',
      message: `Signed in as Agent ${user.username} (${user.clearance?.badge}). Same-device auto-login active!`
    });
  };

  const handleSignOut = () => {
    logoutAccount();
    setCurrentUser(null);
    setShowProfileModal(false);
    setToastNotice({
      type: 'info',
      message: 'Signed out. Your profile remains saved for future logins.'
    });
  };

  const handleSwitchAccount = () => {
    setShowProfileModal(false);
    setShowAuthModal(true);
  };

  // Auto-dismiss toast notice
  useEffect(() => {
    if (!toastNotice) return;
    const timer = setTimeout(() => {
      setToastNotice(null);
    }, 4500);
    return () => clearTimeout(timer);
  }, [toastNotice]);

  const handleNewTab = () => {
    const newId = 'tab-newtab-' + Date.now();
    setTabs((prev) => [
      ...prev,
      { id: newId, type: 'newtab', title: 'New Tab', key: Date.now() }
    ]);
    setActiveTabId(newId);
  };

  const handleCloseTab = (idToClose) => {
    setTabs((prev) => {
      if (prev.length <= 1) {
        const resetId = 'tab-newtab-' + Date.now();
        setActiveTabId(resetId);
        return [{ id: resetId, type: 'newtab', title: 'New Tab', key: Date.now() }];
      }
      const idx = prev.findIndex((t) => t.id === idToClose);
      const updated = prev.filter((t) => t.id !== idToClose);
      if (activeTabId === idToClose) {
        const nextActive = updated[Math.max(0, idx - 1)] || updated[0];
        setActiveTabId(nextActive.id);
      }
      return updated;
    });
  };

  const handleReloadTab = () => {
    setTabs((prev) =>
      prev.map((t) => (t.id === activeTabId ? { ...t, key: Date.now() } : t))
    );
  };

  const handleGoHome = () => {
    const newTab = tabs.find((t) => t.type === 'newtab');
    if (newTab) {
      setActiveTabId(newTab.id);
    } else {
      handleNewTab();
    }
  };

  const handlePerformSearch = (query) => {
    const existingProxy = tabs.find((t) => t.type === 'proxy');
    if (existingProxy) {
      setTabs((prev) =>
        prev.map((t) =>
          t.id === existingProxy.id
            ? { ...t, title: `Search: ${query.slice(0, 16)}`, query, key: Date.now() }
            : t
        )
      );
      setActiveTabId(existingProxy.id);
    } else {
      const newTabId = 'tab-proxy-' + Date.now();
      setTabs((prev) => [
        ...prev,
        {
          id: newTabId,
          type: 'proxy',
          title: `Search: ${query.slice(0, 16)}`,
          query,
          key: Date.now()
        }
      ]);
      setActiveTabId(newTabId);
    }
  };

  const handleOpenAi = (prompt = '') => {
    const existingAi = tabs.find((t) => t.type === 'ai');
    if (existingAi) {
      setTabs((prev) =>
        prev.map((t) =>
          t.id === existingAi.id
            ? { ...t, prompt: prompt || t.prompt, key: Date.now() }
            : t
        )
      );
      setActiveTabId(existingAi.id);
    } else {
      const newTabId = 'tab-ai-' + Date.now();
      setTabs((prev) => [
        ...prev,
        {
          id: newTabId,
          type: 'ai',
          title: 'AI Studio (Gemini & ChatGPT)',
          prompt,
          key: Date.now()
        }
      ]);
      setActiveTabId(newTabId);
    }
  };

  const handleOpenCloudGaming = () => {
    const existing = tabs.find((t) => t.type === 'cloudgaming');
    if (existing) {
      setActiveTabId(existing.id);
    } else {
      const newTabId = 'tab-cloudgaming-' + Date.now();
      setTabs((prev) => [
        ...prev,
        { id: newTabId, type: 'cloudgaming', title: 'Cloud Gaming (Roblox & Fortnite)', key: Date.now() }
      ]);
      setActiveTabId(newTabId);
    }
  };

  const handleOpenScpWiki = (url = 'https://scp-wiki.wikidot.com/') => {
    const existing = tabs.find((t) => t.type === 'scpwiki');
    if (existing) {
      setActiveTabId(existing.id);
    } else {
      const newTabId = 'tab-scpwiki-' + Date.now();
      setTabs((prev) => [
        ...prev,
        { id: newTabId, type: 'scpwiki', title: 'SCP Foundation Wiki', url, key: Date.now() }
      ]);
      setActiveTabId(newTabId);
    }
  };

  const handleOpenUrl = (url) => {
    if (url.includes('scp-wiki.wikidot.com')) {
      handleOpenScpWiki(url);
      return;
    }
    let title = 'Web Page';
    try {
      title = new URL(url).hostname;
    } catch {}
    const newTabId = 'tab-web-' + Date.now();
    setTabs((prev) => [
      ...prev,
      { id: newTabId, type: 'web', title, url, key: Date.now() }
    ]);
    setActiveTabId(newTabId);
  };

  const handleNavigateUrl = (val) => {
    const trimmed = val.trim();
    if (trimmed === 'scphub://newtab') {
      handleGoHome();
    } else if (trimmed === 'scphub://arcade') {
      const arcade = tabs.find((t) => t.type === 'arcade');
      if (arcade) setActiveTabId(arcade.id);
      else {
        const id = 'tab-arcade-' + Date.now();
        setTabs((prev) => [...prev, { id, type: 'arcade', title: 'Arcade', key: Date.now() }]);
        setActiveTabId(id);
      }
    } else if (trimmed === 'scphub://cloudgaming' || trimmed.toLowerCase() === 'cloudgaming' || trimmed.toLowerCase() === 'cloud') {
      handleOpenCloudGaming();
    } else if (
      trimmed === 'https://scp-wiki.wikidot.com/' ||
      trimmed === 'https://scp-wiki.wikidot.com' ||
      trimmed === 'scp-wiki.wikidot.com' ||
      trimmed === 'scphub://scpwiki' ||
      trimmed.toLowerCase() === 'scpwiki' ||
      trimmed.includes('scp-wiki.wikidot.com')
    ) {
      const targetUrl = trimmed.startsWith('http') ? trimmed : `https://${trimmed}`;
      handleOpenScpWiki(targetUrl);
    } else if (trimmed === 'scphub://proxy' || trimmed.startsWith('scphub://proxy')) {
      const urlParams = new URLSearchParams(trimmed.split('?')[1] || '');
      const q = urlParams.get('q') || '';
      handlePerformSearch(q);
    } else if (trimmed === 'scphub://ai' || trimmed.startsWith('scphub://ai') || trimmed.toLowerCase() === 'ai') {
      const urlParams = new URLSearchParams(trimmed.split('?')[1] || '');
      const p = urlParams.get('q') || urlParams.get('prompt') || '';
      handleOpenAi(p);
    } else if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      handleOpenUrl(trimmed);
    } else {
      handlePerformSearch(trimmed);
    }
  };

  const handlePlayGame = (game, openInNewTab = false) => {
    setRecents((prev) => {
      const filtered = prev.filter((id) => id !== game.id);
      return [game.id, ...filtered].slice(0, 10);
    });

    if (currentUser?.username) {
      recordUserGamePlayed(currentUser.username, game);
    }

    if (openInNewTab) {
      const newTabId = 'tab-game-' + game.id + '-' + Date.now();
      setTabs((prev) => [
        ...prev,
        { id: newTabId, type: 'game', title: game.title, game, key: Date.now() }
      ]);
      setActiveTabId(newTabId);
    } else {
      setActiveGame(game);
      const arcadeTab = tabs.find((t) => t.type === 'arcade');
      if (arcadeTab) {
        setActiveTabId(arcadeTab.id);
      } else {
        const newTabId = 'tab-arcade-' + Date.now();
        setTabs((prev) => [...prev, { id: newTabId, type: 'arcade', title: 'Arcade', key: Date.now() }]);
        setActiveTabId(newTabId);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePopout = (game) => {
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
    const fullUrl =
      game.iframeUrl.startsWith('http://') || game.iframeUrl.startsWith('https://')
        ? game.iframeUrl
        : window.location.origin + game.iframeUrl;
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

  const handleDeleteCustomGame = (gameId, e) => {
    e.stopPropagation();
    if (window.confirm('Delete this custom game from your browser library?')) {
      try {
        const customGamesRaw = localStorage.getItem('ub_custom_games');
        const customGames = customGamesRaw ? JSON.parse(customGamesRaw) : [];
        const updated = customGames.filter((g) => g.id !== gameId);
        localStorage.setItem('ub_custom_games', JSON.stringify(updated));
        setGames((prev) => prev.filter((g) => g.id !== gameId));
      } catch (err) {
        console.error('Failed to remove custom game:', err);
      }
    }
  };

  // Derive categories and counts
  const categories = useMemo(() => {
    const set = new Set(games.map((g) => g.category));
    return ['All', ...Array.from(set).sort()];
  }, [games]);

  const categoryCounts = useMemo(() => {
    const counts = { All: games.length };
    games.forEach((g) => {
      counts[g.category] = (counts[g.category] || 0) + 1;
    });
    return counts;
  }, [games]);

  // Filter and sort games
  const filteredGames = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    let result = games.filter((game) => {
      if (!game) return false;
      const title = (game.title || '').toLowerCase();
      const desc = (game.description || game.desc || '').toLowerCase();
      const cat = (game.category || '').toLowerCase();
      const tags = Array.isArray(game.tags) ? game.tags : [];

      const matchesSearch = !q ||
        title.includes(q) ||
        desc.includes(q) ||
        cat.includes(q) ||
        tags.some((t) => typeof t === 'string' && t.toLowerCase().includes(q));

      const matchesCategory =
        selectedCategory === 'All' || cat === selectedCategory.toLowerCase();
      const matchesFavorites = !showFavoritesOnly || favorites.includes(game.id);

      return matchesSearch && matchesCategory && matchesFavorites;
    });

    if (sortBy === 'rating') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === 'title') {
      result.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    }

    return result;
  }, [games, searchQuery, selectedCategory, showFavoritesOnly, favorites, sortBy]);

  // Reset pagination on filter or search change
  useEffect(() => {
    setVisibleCount(48);
  }, [searchQuery, selectedCategory, showFavoritesOnly, sortBy]);

  // Paginated slice for smooth rendering of 1,000+ games
  const displayedGames = useMemo(() => {
    return filteredGames.slice(0, visibleCount);
  }, [filteredGames, visibleCount]);

  // Derive recent games
  const recentGames = useMemo(() => {
    return recents
      .map((id) => games.find((g) => g.id === id))
      .filter(Boolean);
  }, [recents, games]);

  const handleApplyCloak = (profileId) => {
    const profile =
      typeof profileId === 'object' && profileId !== null
        ? profileId
        : CLOAK_PROFILES.find((p) => p.id === profileId);
    if (!profile) return;
    setActiveCloak(profile.id);
    document.title = profile.tabTitle || profile.title || 'Google Classroom - Home';
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.getElementsByTagName('head')[0].appendChild(link);
    }
    link.href = profile.id === 'none' ? '/vite.svg' : (profile.favicon || profile.iconUrl || 'https://ssl.gstatic.com/classroom/favicon.png');
  };

  // Gatekeeper: Password required to get on the site (no game)
  if (!isSiteUnlocked) {
    return (
      <SiteAccessGate
        onUnlock={() => setIsSiteUnlocked(true)}
        onApplyCloak={handleApplyCloak}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col selection:bg-sky-500/30 selection:text-white relative">
      {/* Real-time HUD Toast Notification */}
      {toastNotice && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 max-w-sm sm:max-w-md animate-in slide-in-from-top-4 fade-in duration-200">
          <div
            className={`p-3.5 rounded-xl border shadow-2xl backdrop-blur-md flex items-start gap-3 ${
              toastNotice.type === 'success'
                ? 'bg-emerald-950/90 border-emerald-500/60 text-emerald-200'
                : 'bg-slate-900/95 border-sky-500/70 text-sky-200'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex-1 text-xs">
              <span className="font-bold block uppercase tracking-wider text-[10px] opacity-80">
                Notice
              </span>
              <span className="leading-snug">{toastNotice.text}</span>
            </div>
            <button
              onClick={() => setToastNotice(null)}
              className="text-slate-400 hover:text-white p-0.5 rounded cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Universal Top Browser Tab Bar */}
      <TabBar
        tabs={tabs}
        activeTabId={activeTabId}
        onSelectTab={setActiveTabId}
        onCloseTab={handleCloseTab}
        onNewTab={handleNewTab}
        onReloadTab={handleReloadTab}
        onGoHome={handleGoHome}
        onNavigateUrl={handleNavigateUrl}
        activeCloak={activeCloak}
        setActiveCloak={handleApplyCloak}
        onLockSite={handleLockSite}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {(() => {
          const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];

          if (activeTab.type === 'newtab') {
            return (
              <NewTabPage
                key={activeTab.key || activeTab.id}
                onNavigateTab={(target, opts) => {
                  if (target === 'cloudgaming') {
                    handleOpenCloudGaming();
                  } else if (target === 'scpwiki') {
                    handleOpenScpWiki();
                  } else if (target === 'arcade') {
                    if (opts?.searchQuery) {
                      setSearchQuery(opts.searchQuery);
                      setSelectedCategory('All');
                      setShowFavoritesOnly(false);
                    }
                    const arcade = tabs.find((t) => t.type === 'arcade');
                    if (arcade) setActiveTabId(arcade.id);
                    else {
                      const id = 'tab-arcade-' + Date.now();
                      setTabs((prev) => [...prev, { id, type: 'arcade', title: 'Arcade', key: Date.now() }]);
                      setActiveTabId(id);
                    }
                  } else if (target === 'proxy') {
                    const proxy = tabs.find((t) => t.type === 'proxy');
                    if (proxy) setActiveTabId(proxy.id);
                    else {
                      const id = 'tab-proxy-' + Date.now();
                      setTabs((prev) => [...prev, { id, type: 'proxy', title: 'DuckDuckGo Proxy', key: Date.now() }]);
                      setActiveTabId(id);
                    }
                  } else if (target === 'ai') {
                    handleOpenAi(opts?.prompt || '');
                  }
                }}
                onOpenGame={(gameSlugOrId) => {
                  const found = games.find((g) => g.slug === gameSlugOrId || g.id === gameSlugOrId);
                  if (found) {
                    handlePlayGame(found, true);
                  }
                }}
                onPerformSearch={handlePerformSearch}
                onOpenUrl={handleOpenUrl}
                currentUser={currentUser}
                onOpenAuth={() => setShowAuthModal(true)}
                onOpenProfile={() => setShowProfileModal(true)}
                onOpenPasswords={() => setShowPasswordsModal(true)}
                onLockSite={handleLockSite}
              />
            );
          }

          if (activeTab.type === 'cloudgaming') {
            return (
              <CloudGamingHub
                key={activeTab.key || activeTab.id}
                onOpenPasswords={() => setShowPasswordsModal(true)}
                onApplyStealth={handleApplyCloak}
              />
            );
          }

          if (activeTab.type === 'scpwiki') {
            return (
              <ScpWikiViewer
                key={activeTab.key || activeTab.id}
                initialUrl={activeTab.url || 'https://scp-wiki.wikidot.com/'}
                onApplyStealth={handleApplyCloak}
              />
            );
          }

          if (activeTab.type === 'proxy') {
            return (
              <ProxySearch
                key={activeTab.key || activeTab.id}
                initialQuery={activeTab.query || ''}
                onOpenAi={handleOpenAi}
                games={games}
                onPlayGame={(game, inNewTab) => handlePlayGame(game, inNewTab)}
                onBackToArcade={() => {
                  const arcade = tabs.find((t) => t.type === 'arcade');
                  if (arcade) setActiveTabId(arcade.id);
                }}
              />
            );
          }

          if (activeTab.type === 'ai') {
            return (
              <AiChat
                key={activeTab.key || activeTab.id}
                initialPrompt={activeTab.prompt || ''}
                onBackToArcade={() => {
                  const arcade = tabs.find((t) => t.type === 'arcade');
                  if (arcade) setActiveTabId(arcade.id);
                }}
              />
            );
          }

          if (activeTab.type === 'game') {
            return (
              <div className="flex-1 bg-slate-950/60 pb-12">
                <GamePlayer
                  game={activeTab.game}
                  allGames={games}
                  onBack={() => handleCloseTab(activeTab.id)}
                  onSelectGame={(g) => handlePlayGame(g, false)}
                  isFavorite={favorites.includes(activeTab.game?.id)}
                  onToggleFavorite={handleToggleFavorite}
                />
              </div>
            );
          }

          if (activeTab.type === 'web') {
            return (
              <WebTabViewer
                key={activeTab.key || activeTab.id}
                url={activeTab.url}
                onReload={handleReloadTab}
              />
            );
          }

          // Default: Arcade Mode
          return (
            <div className="flex-1 flex flex-col">
              <Header
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                showFavoritesOnly={showFavoritesOnly}
                setShowFavoritesOnly={setShowFavoritesOnly}
                activeCloak={activeCloak}
                setActiveCloak={setActiveCloak}
                totalGames={games.length}
                currentTab="arcade"
                currentUser={currentUser}
                onOpenAuth={() => setShowAuthModal(true)}
                onOpenProfile={() => setShowProfileModal(true)}
                onLockSite={handleLockSite}
                onSearchSubmit={(term) => {
                  const q = term?.trim();
                  if (!q) return;
                  // If matching game in current view, play it
                  if (filteredGames.length > 0) {
                    handlePlayGame(filteredGames[0], false);
                    return;
                  }
                  // If matching game exists across all categories, reset filter & play
                  const anywhere = games.find((g) =>
                    (g.title || '').toLowerCase().includes(q.toLowerCase())
                  );
                  if (anywhere) {
                    setSelectedCategory('All');
                    setShowFavoritesOnly(false);
                    handlePlayGame(anywhere, false);
                    return;
                  }
                  // Otherwise send to proxy search
                  handlePerformSearch(q);
                }}
                setCurrentTab={(t) => {
                  if (t === 'cloudgaming') {
                    handleOpenCloudGaming();
                  } else if (t === 'scpwiki') {
                    handleOpenScpWiki();
                  } else if (t === 'proxy') {
                    const proxy = tabs.find((x) => x.type === 'proxy');
                    if (proxy) setActiveTabId(proxy.id);
                    else {
                      const id = 'tab-proxy-' + Date.now();
                      setTabs((prev) => [...prev, { id, type: 'proxy', title: 'DuckDuckGo Proxy', key: Date.now() }]);
                      setActiveTabId(id);
                    }
                  } else if (t === 'ai') {
                    handleOpenAi();
                  }
                }}
                onOpenPasswords={() => setShowPasswordsModal(true)}
              />
              {activeGame ? (
                <div className="flex-1 bg-slate-950/60 pb-12">
                  <GamePlayer
                    game={activeGame}
                    allGames={games}
                    onBack={() => setActiveGame(null)}
                    onSelectGame={handlePlayGame}
                    isFavorite={favorites.includes(activeGame.id)}
                    onToggleFavorite={handleToggleFavorite}
                  />
                </div>
              ) : (
                /* Library / Catalogue View */
                <div className="flex-1 flex flex-col lg:flex-row">
            {/* Left Sidebar */}
            <aside className="w-72 border-r border-slate-800/80 p-5 flex flex-col gap-6 bg-[#090d16] shrink-0 hidden lg:flex">
              {/* Containment Security Telemetry */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-3 shadow-sm">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Archive Status
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                    ONLINE
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="bg-slate-950/70 border border-slate-800/80 p-2.5 rounded-lg">
                    <div className="text-xl font-black text-white font-mono">{games.length}+</div>
                    <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">HTML5 Games</div>
                  </div>
                  <div className="bg-slate-950/70 border border-slate-800/80 p-2.5 rounded-lg">
                    <div className="text-xl font-black text-sky-400 font-mono">14ms</div>
                    <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Sandbox Ping</div>
                  </div>
                </div>
                <div className="pt-1 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>DuckDuckGo Proxy: Active</span>
                  <button
                    onClick={() => setCurrentTab('proxy')}
                    className="text-amber-400 hover:underline font-bold cursor-pointer"
                  >
                    Open Proxy →
                  </button>
                </div>
              </div>

              {/* Recent Activity */}
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-sky-400" />
                    Recent Activity
                  </span>
                  {recentGames.length > 0 && (
                    <span className="text-[10px] text-slate-400 font-bold uppercase font-mono">
                      {recentGames.length}
                    </span>
                  )}
                </div>
                <div className="space-y-2">
                  {(recentGames.length > 0 ? recentGames.slice(0, 4) : games.slice(0, 4)).length > 0 ? (
                    (recentGames.length > 0 ? recentGames.slice(0, 4) : games.slice(0, 4)).map((rg) => (
                      <div
                        key={rg.id}
                        onClick={() => handlePlayGame(rg)}
                        className="flex items-center justify-between gap-2 cursor-pointer group p-2 rounded-lg bg-slate-900/40 hover:bg-slate-900 border border-slate-800/50 hover:border-slate-700 transition-all"
                      >
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          <div
                            className={`w-8 h-8 rounded-lg bg-gradient-to-br ${rg.color} border border-white/10 flex items-center justify-center font-black text-white text-xs shadow-sm shrink-0`}
                          >
                            {rg.title.charAt(0)}
                          </div>
                          <div className="overflow-hidden">
                            <div className="text-xs font-bold text-white group-hover:text-sky-400 transition-colors truncate">
                              {rg.title}
                            </div>
                            <div className="text-[10px] text-slate-400 font-medium">
                              {rg.category}
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-sky-400 uppercase tracking-tight px-1.5 py-0.5 rounded bg-sky-500/10 opacity-0 group-hover:opacity-100 transition-opacity">
                          Play
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-slate-500 italic p-2 bg-slate-900/30 rounded-lg">
                      No game history yet. Select any title to play.
                    </div>
                  )}
                </div>
              </div>

              {/* DuckDuckGo Proxy Quick Widget */}
              <div className="bg-gradient-to-br from-amber-950/30 to-slate-900 border border-amber-500/20 rounded-xl p-4 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                  <span className="text-base leading-none">🦆</span>
                  <span>DuckDuckGo Proxy Search</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Search the web privately with zero trackers, cookies, or history logs.
                </p>
                <button
                  type="button"
                  onClick={() => setCurrentTab('proxy')}
                  className="w-full py-2 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow transition cursor-pointer"
                >
                  <span>Launch Proxy Search</span>
                </button>
              </div>

              {/* Quick Shortcut Guide */}
              <div className="p-3.5 bg-slate-900/40 border border-slate-800/60 rounded-xl text-xs space-y-2">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Terminal className="w-3 h-3 text-sky-400" />
                  Tactical Shortcuts
                </div>
                <div className="space-y-1 text-[11px] text-slate-400">
                  <div className="flex justify-between items-center">
                    <span>Quick Search:</span>
                    <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 font-mono text-[10px]">
                      /
                    </kbd>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Emergency Panic:</span>
                    <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 font-mono text-[10px]">
                      Shift+Esc
                    </kbd>
                  </div>
                </div>
              </div>
            </aside>

            {/* Right Main Column */}
            <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
              {/* Tactical Status & Cloak Ticker Banner */}
              <TacticalTickerBanner
                onApplyCloak={handleApplyCloak}
                activeCloak={activeCloak}
                onOpenProxy={() => setCurrentTab('proxy')}
              />

              {/* Featured Spotlight Banner (When games exist and not filtering by search) */}
              {games.length > 0 && !searchQuery && (
                <FeaturedBanner
                  games={games}
                  currentIdx={featuredIdx}
                  onSelectIdx={setFeaturedIdx}
                  onPlayGame={handlePlayGame}
                  onPopout={handlePopout}
                />
              )}

              {/* Title & Filter Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-800/80">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase flex items-center gap-2.5 flex-wrap">
                    <span>CONTAINMENT</span>
                    <span className="text-sky-400">ARCHIVE</span>
                    <span className="text-xs font-mono font-bold bg-sky-500/15 border border-sky-500/40 text-sky-300 px-2.5 py-1 rounded-full">
                      {games.length}+ HTML5 GAMES
                    </span>
                  </h1>
                  <p className="text-slate-400 text-xs font-medium">
                    Verified 4,000+ browser titles • High-performance sandboxed execution • Securly unblocked
                  </p>
                </div>

                {/* Sort selector */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-slate-400 text-[11px] font-bold uppercase hidden sm:inline">
                      Sort:
                    </span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-transparent text-slate-200 text-xs font-bold uppercase outline-none cursor-pointer"
                    >
                      <option value="default" className="bg-slate-900 text-slate-200">
                        Default
                      </option>
                      <option value="rating" className="bg-slate-900 text-slate-200">
                        Top Rated
                      </option>
                      <option value="title" className="bg-slate-900 text-slate-200">
                        Alphabetical
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <CategoryFilter
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                  categoryCounts={categoryCounts}
                />
              </div>

              {/* Games Grid */}
              {games.length === 0 ? (
                <div className="text-center py-20 px-6 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-4 max-w-lg mx-auto my-12">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-800/90 border border-slate-700/60 flex items-center justify-center shadow-inner">
                    <ScpLogo className="w-9 h-9" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black uppercase text-slate-100 tracking-tight">
                      Containment Archive Empty
                    </h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1.5 leading-relaxed">
                      All games have been removed from the archive.
                    </p>
                  </div>
                </div>
              ) : filteredGames.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
                    {displayedGames.map((game) => (
                      <GameCard
                        key={game.id}
                        game={game}
                        onPlay={handlePlayGame}
                        isFavorite={favorites.includes(game.id)}
                        onToggleFavorite={handleToggleFavorite}
                        onDeleteCustomGame={handleDeleteCustomGame}
                      />
                    ))}
                  </div>

                  {/* Progressive Load More Controller */}
                  {filteredGames.length > visibleCount && (
                    <div className="mt-8 flex flex-col items-center justify-center gap-3 p-5 bg-slate-900/80 border border-slate-800 rounded-2xl">
                      <div className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
                        <span>Showing</span>
                        <span className="font-bold text-sky-400 font-mono text-sm">
                          {Math.min(visibleCount, filteredGames.length)}
                        </span>
                        <span>of</span>
                        <span className="font-bold text-white font-mono text-sm">
                          {filteredGames.length}
                        </span>
                        <span>unblocked HTML5 games</span>
                      </div>
                      <div className="w-full max-w-xs bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-sky-500 to-indigo-500 h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.min(
                              100,
                              (visibleCount / filteredGames.length) * 100
                            )}%`
                          }}
                        />
                      </div>
                      <div className="flex items-center gap-3 mt-1 flex-wrap justify-center">
                        <button
                          onClick={() =>
                            setVisibleCount((prev) =>
                              Math.min(prev + 48, filteredGames.length)
                            )
                          }
                          className="px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-lg hover:shadow-sky-500/25 cursor-pointer flex items-center gap-2"
                        >
                          <span>Load More (+48 Games)</span>
                        </button>
                        <button
                          onClick={() => setVisibleCount(filteredGames.length)}
                          className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs uppercase tracking-wider transition-all border border-slate-700 hover:border-slate-600 cursor-pointer"
                        >
                          <span>Show All ({filteredGames.length} Games)</span>
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                /* Empty state when filtering */
                <div className="text-center py-16 px-4 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-4 max-w-lg mx-auto my-8 shadow-xl">
                  <div className="w-12 h-12 mx-auto rounded-xl bg-slate-800 flex items-center justify-center text-slate-400">
                    <Sparkles className="w-6 h-6 text-sky-400" />
                  </div>
                  <h3 className="text-base font-black uppercase text-slate-200">
                    No games matched "{searchQuery || selectedCategory}"
                  </h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Try searching across all 4,000+ games, or search the stealth web proxy engine.
                  </p>
                  <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5">
                    {(selectedCategory !== 'All' || showFavoritesOnly) && (
                      <button
                        onClick={() => {
                          setSelectedCategory('All');
                          setShowFavoritesOnly(false);
                        }}
                        className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition cursor-pointer"
                      >
                        Search All Categories
                      </button>
                    )}
                    {searchQuery && (
                      <button
                        onClick={() => handlePerformSearch(searchQuery)}
                        className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shadow"
                      >
                        <span>Search Web Proxy for "{searchQuery}"</span>
                        <span>➔</span>
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('All');
                        setShowFavoritesOnly(false);
                      }}
                      className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition cursor-pointer"
                    >
                      Reset Filters
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  })()}
</main>

      {/* Bottom Footer */}
      <footer className="h-12 flex-shrink-0 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between px-6 sm:px-8 text-[11px] font-medium text-slate-400 tracking-wider uppercase select-none">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-slate-300 font-black">SCPHUB</span>
            <span>•</span>
            <span>UNBLOCKED GAMES</span>
          </div>
          <span className="hidden md:inline text-slate-600">•</span>
          <button
            onClick={handleNewTab}
            className="hover:text-cyan-300 transition cursor-pointer flex items-center gap-1"
          >
            <span>+ NEW TAB</span>
          </button>
          <span className="hidden md:inline text-slate-600">•</span>
          <button
            onClick={() => {
              const arcade = tabs.find((t) => t.type === 'arcade');
              if (arcade) setActiveTabId(arcade.id);
              else {
                const id = 'tab-arcade-' + Date.now();
                setTabs((prev) => [...prev, { id, type: 'arcade', title: 'Arcade', key: Date.now() }]);
                setActiveTabId(id);
              }
            }}
            className="hover:text-slate-300 transition cursor-pointer"
          >
            ARCADE
          </button>
          <span className="hidden md:inline text-slate-600">•</span>
          <button
            onClick={handleOpenCloudGaming}
            className="hover:text-sky-300 transition cursor-pointer flex items-center gap-1"
          >
            <span>CLOUD GAMING (ROBLOX & FORTNITE)</span>
          </button>
          <span className="hidden md:inline text-slate-600">•</span>
          <button
            onClick={() => handleOpenScpWiki()}
            className="hover:text-amber-300 transition cursor-pointer flex items-center gap-1"
          >
            <span>SCP WIKI (wikidot.com)</span>
          </button>
          <span className="hidden md:inline text-slate-600">•</span>
          <button
            onClick={() => setShowPasswordsModal(true)}
            className="hover:text-emerald-300 transition cursor-pointer flex items-center gap-1"
          >
            <span>3 WEEKLY PASSWORDS</span>
          </button>
          <span className="hidden md:inline text-slate-600">•</span>
          <button
            onClick={() => {
              const proxy = tabs.find((t) => t.type === 'proxy');
              if (proxy) setActiveTabId(proxy.id);
              else {
                const id = 'tab-proxy-' + Date.now();
                setTabs((prev) => [...prev, { id, type: 'proxy', title: 'DuckDuckGo Proxy', key: Date.now() }]);
                setActiveTabId(id);
              }
            }}
            className="hover:text-amber-300 transition cursor-pointer flex items-center gap-1"
          >
            <span>DUCKDUCKGO PROXY SEARCH</span>
          </button>
          <span className="hidden md:inline text-slate-600">•</span>
          <button
            onClick={handleLockSite}
            className="hover:text-amber-300 transition cursor-pointer flex items-center gap-1 text-amber-400 font-bold"
            title="Lock the site with weekly rotating password gate"
          >
            <Lock className="w-3 h-3" />
            <span>LOCK SITE</span>
          </button>
        </div>
        <div className="flex items-center gap-2 font-mono text-[10px]">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="hidden sm:inline text-slate-400">STATUS: NOMINAL (NODE-A)</span>
          <span className="sm:hidden text-emerald-400">SECURE</span>
        </div>
      </footer>

      {/* Weekly Rotating Security Passwords Modal */}
      <WeeklyPasswordsModal
        isOpen={showPasswordsModal}
        onClose={() => setShowPasswordsModal(false)}
      />

      {/* Persistent Client-Side Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Agent User Profile & Credentials Modal */}
      <UserProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        currentUser={currentUser}
        onSignOut={handleSignOut}
        onSwitchAccount={handleSwitchAccount}
        onUserUpdated={(updatedUser) => setCurrentUser(updatedUser)}
      />
    </div>
  );
}
