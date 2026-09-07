import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Globe,
  ExternalLink,
  Shield,
  ArrowLeft,
  RotateCw,
  Clock,
  Sparkles,
  X,
  Copy,
  Check,
  EyeOff,
  Image as ImageIcon,
  Newspaper,
  LayoutGrid,
  ChevronRight,
  AlertCircle,
  Zap,
  BookOpen,
  Bot,
  SlidersHorizontal,
  FileText,
  Maximize2,
  Minimize2
} from 'lucide-react';

const ENGINES = [
  {
    id: 'auto',
    name: 'Turbo Auto',
    shortName: 'Auto',
    icon: Zap,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
    desc: 'Hybrid Bing + DuckDuckGo + Wikipedia (Fastest, zero rate limits)'
  },
  {
    id: 'bing',
    name: 'Bing Web',
    shortName: 'Bing',
    icon: Globe,
    color: 'text-sky-400',
    bg: 'bg-sky-500/10 border-sky-500/30 text-sky-300',
    desc: 'Microsoft Bing comprehensive web index'
  },
  {
    id: 'ddg',
    name: 'DuckDuckGo',
    shortName: 'DDG',
    icon: Shield,
    color: 'text-orange-400',
    bg: 'bg-orange-500/10 border-orange-500/30 text-orange-300',
    desc: 'Privacy-focused anonymous search engine'
  },
  {
    id: 'wiki',
    name: 'Wikipedia',
    shortName: 'Wiki',
    icon: BookOpen,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
    desc: 'Deep encyclopedic research & verified facts'
  },
  {
    id: 'ai',
    name: 'AI Summary',
    shortName: 'AI',
    icon: Bot,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10 border-purple-500/30 text-purple-300',
    desc: 'Instant AI overview and knowledge synthesis'
  }
];

const POPULAR_SEARCHES = [
  'Minecraft crafting guide',
  'Geometry Dash unblocked strategies',
  'Slope game high score tips',
  'Snow Rider 3D controls',
  'Chess opening lines',
  'Desmos graphing calculator',
  'HTML5 canvas game mechanics',
  'Python syntax cheat sheet'
];

const TOPIC_CHIPS = [
  { label: 'All Results', filter: '' },
  { label: '🎮 Games', filter: 'unblocked game' },
  { label: '📐 Math & Tools', filter: 'calculator tool' },
  { label: '📚 Science & Wiki', filter: 'wikipedia explanation' },
  { label: '💻 Coding', filter: 'tutorial docs' }
];

export const ProxySearch = ({ onBackToArcade, initialQuery = '', onOpenAi }) => {
  const [query, setQuery] = useState(initialQuery || 'minecraft');
  const [activeTab, setActiveTab] = useState('web'); // 'web' | 'images' | 'news' | 'embedded'
  const [selectedEngine, setSelectedEngine] = useState('auto');
  const [embeddedEngine, setEmbeddedEngine] = useState('ddg'); // 'ddg' | 'bing' | 'wiki'
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('ub_proxy_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Search Results States
  const [webResults, setWebResults] = useState([]);
  const [imageResults, setImageResults] = useState([]);
  const [newsResults, setNewsResults] = useState([]);
  const [knowledgeCard, setKnowledgeCard] = useState(null);
  const [aiSummary, setAiSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchError, setSearchError] = useState(null);

  // In-app Proxy Preview Modal State
  const [previewUrl, setPreviewUrl] = useState(null);
  const [readerMode, setReaderMode] = useState(false);
  const [isModalMaximized, setIsModalMaximized] = useState(false);
  const [copied, setCopied] = useState(false);
  const [browserKey, setBrowserKey] = useState(0);

  const inputRef = useRef(null);
  const suggestionTimeoutRef = useRef(null);

  // Initial load: search for initialQuery or default popular term
  useEffect(() => {
    const term = initialQuery?.trim() || 'minecraft';
    setQuery(term);
    handleExecuteSearch(term, 'web', selectedEngine);
  }, [initialQuery]);

  // Save history
  const saveToHistory = (term) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    setHistory((prev) => {
      const filtered = prev.filter((item) => item.toLowerCase() !== trimmed.toLowerCase());
      const next = [trimmed, ...filtered].slice(0, 10);
      try {
        localStorage.setItem('ub_proxy_history', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('ub_proxy_history');
    } catch {}
  };

  // Autocomplete suggestions handler
  const handleQueryChange = (val) => {
    setQuery(val);
    if (suggestionTimeoutRef.current) {
      clearTimeout(suggestionTimeoutRef.current);
    }
    if (!val.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    suggestionTimeoutRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search/suggest?q=${encodeURIComponent(val.trim())}`);
        if (res.ok) {
          const data = await res.json();
          setSuggestions(Array.isArray(data.suggestions) ? data.suggestions.slice(0, 7) : []);
          setShowSuggestions(true);
        }
      } catch {
        setSuggestions([]);
      }
    }, 150);
  };

  // Execute search across current or requested tab and engine
  const handleExecuteSearch = async (
    searchTerm = query,
    targetTab = activeTab,
    engine = selectedEngine
  ) => {
    const q = searchTerm.trim();
    if (!q) return;

    setQuery(q);
    setShowSuggestions(false);
    saveToHistory(q);
    setIsLoading(true);
    setSearchError(null);
    setHasSearched(true);
    setActiveTab(targetTab);

    // If query is a direct full web URL and in web mode, open directly in proxy preview
    if ((q.startsWith('http://') || q.startsWith('https://')) && targetTab === 'web') {
      setIsLoading(false);
      setPreviewUrl(q);
      setReaderMode(false);
      return;
    }

    try {
      if (targetTab === 'web') {
        const res = await fetch(
          `/api/search/web?q=${encodeURIComponent(q)}&engine=${encodeURIComponent(engine)}`
        );
        if (!res.ok) throw new Error('Search engine responded with an error');
        const data = await res.json();
        setWebResults(data.results || []);
        setKnowledgeCard(data.knowledgeCard || null);
        setAiSummary(data.aiSummary || null);
      } else if (targetTab === 'images') {
        const res = await fetch(`/api/search/images?q=${encodeURIComponent(q)}`);
        if (!res.ok) throw new Error('Image search failed');
        const data = await res.json();
        setImageResults(data.results || []);
      } else if (targetTab === 'news') {
        const res = await fetch(`/api/search/news?q=${encodeURIComponent(q)}`);
        if (!res.ok) throw new Error('News search failed');
        const data = await res.json();
        setNewsResults(data.results || []);
      }
    } catch (err) {
      console.error('Search error:', err);
      setSearchError('Could not retrieve results from this engine. Try switching to Turbo Auto or Bing.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleExecuteSearch(query, activeTab, selectedEngine);
  };

  const handleTabSwitch = (newTab) => {
    setActiveTab(newTab);
    if (query.trim()) {
      handleExecuteSearch(query, newTab, selectedEngine);
    }
  };

  const handleEngineChange = (newEngine) => {
    setSelectedEngine(newEngine);
    if (query.trim()) {
      handleExecuteSearch(query, activeTab, newEngine);
    }
  };

  // Launch stealth cloaked about:blank tab
  const launchCloakedTab = (targetUrl) => {
    try {
      const win = window.open('about:blank', '_blank');
      if (!win) {
        window.open(targetUrl, '_blank');
        return;
      }
      win.document.title = 'Google Docs';
      const link = win.document.createElement('link');
      link.rel = 'icon';
      link.href = 'https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico';
      win.document.head.appendChild(link);

      const iframe = win.document.createElement('iframe');
      iframe.src = targetUrl;
      iframe.style.position = 'fixed';
      iframe.style.top = '0';
      iframe.style.left = '0';
      iframe.style.width = '100vw';
      iframe.style.height = '100vh';
      iframe.style.border = 'none';
      iframe.style.margin = '0';
      iframe.style.padding = '0';
      iframe.allow =
        'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen';
      win.document.body.style.margin = '0';
      win.document.body.appendChild(iframe);
    } catch {
      window.open(targetUrl, '_blank');
    }
  };

  const copyUrl = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openPreview = (url, isReader = false) => {
    setPreviewUrl(url);
    setReaderMode(isReader);
    setBrowserKey((k) => k + 1);
  };

  // Embedded Engine URL generator
  const getEmbeddedEngineUrl = () => {
    const q = encodeURIComponent(query || '');
    if (embeddedEngine === 'bing') {
      return `/api/proxy/page?url=${encodeURIComponent(`https://www.bing.com/search?q=${q}`)}`;
    }
    if (embeddedEngine === 'wiki') {
      return `/api/proxy/page?url=${encodeURIComponent(`https://en.m.wikipedia.org/wiki/Special:Search?search=${q}`)}`;
    }
    return `/api/ddg/html?q=${q}`;
  };

  return (
    <div className="flex-1 flex flex-col bg-[#0b0f19] text-slate-100 min-h-[calc(100vh-4rem)]">
      {/* Top Search Control Header */}
      <div className="border-b border-slate-800 bg-[#0f172a]/95 backdrop-blur-md p-4 sm:px-8 sticky top-16 z-20 shadow-md">
        <div className="max-w-5xl mx-auto flex flex-col gap-3">
          {/* Top Bar: Return to Arcade + Engine Indicator + Quick Actions */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onBackToArcade}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 transition cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Arcade</span>
              </button>

              <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/25 rounded-lg text-xs font-bold text-amber-300">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Ultra Proxy Search &bull; Multi-Engine</span>
                <span className="sm:hidden">Multi-Engine</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  launchCloakedTab(
                    `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query || '')}`
                  )
                }
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow transition cursor-pointer"
                title="Launch in a disguised Google Docs about:blank tab"
              >
                <EyeOff className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Stealth Window</span>
              </button>
            </div>
          </div>

          {/* Search Input Bar with Instant Autocomplete */}
          <div className="relative">
            <form onSubmit={handleFormSubmit} className="flex items-center gap-2">
              <div className="flex-1 flex items-center bg-slate-900 border border-slate-700 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/25 rounded-xl px-3.5 py-2.5 shadow-inner gap-3 transition-all">
                <Search className="w-4 h-4 text-amber-400 shrink-0 select-none" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => handleQueryChange(e.target.value)}
                  onFocus={() => {
                    if (suggestions.length > 0) setShowSuggestions(true);
                  }}
                  placeholder="Search unblocked web, games, guides, or paste any URL..."
                  className="w-full bg-transparent text-sm sm:text-base text-slate-100 placeholder-slate-500 focus:outline-none"
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
                    className="p-1 rounded text-slate-400 hover:text-slate-200 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 transition active:scale-95 cursor-pointer shrink-0"
              >
                {isLoading ? (
                  <RotateCw className="w-4 h-4 animate-spin text-slate-950" />
                ) : (
                  <Search className="w-4 h-4 text-slate-950" />
                )}
                <span className="hidden sm:inline">Search</span>
              </button>
            </form>

            {/* Live Autocomplete Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden py-1">
                {suggestions.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setQuery(item);
                      handleExecuteSearch(item, activeTab, selectedEngine);
                    }}
                    className="w-full text-left px-4 py-2 text-xs sm:text-sm text-slate-200 hover:bg-slate-800 flex items-center gap-2.5 transition cursor-pointer"
                  >
                    <Search className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="truncate">{item}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Engine Selector & Category Tabs */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 pt-1">
            {/* Search Engine Selector Switcher */}
            <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1 flex items-center gap-1">
                <SlidersHorizontal className="w-3 h-3" />
                <span>Engine:</span>
              </span>
              {ENGINES.map((eng) => {
                const Icon = eng.icon;
                const isSelected = selectedEngine === eng.id;
                return (
                  <button
                    key={eng.id}
                    type="button"
                    onClick={() => handleEngineChange(eng.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer border ${
                      isSelected
                        ? `${eng.bg} shadow-md`
                        : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                    title={eng.desc}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{eng.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Category Tabs: Web | Images | News | Embedded */}
            <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-lg border border-slate-800 shrink-0">
              <button
                type="button"
                onClick={() => handleTabSwitch('web')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition cursor-pointer ${
                  activeTab === 'web'
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Web</span>
              </button>

              <button
                type="button"
                onClick={() => handleTabSwitch('images')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition cursor-pointer ${
                  activeTab === 'images'
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Images</span>
              </button>

              <button
                type="button"
                onClick={() => handleTabSwitch('news')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition cursor-pointer ${
                  activeTab === 'news'
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Newspaper className="w-3.5 h-3.5" />
                <span>News</span>
              </button>

              <button
                type="button"
                onClick={() => handleTabSwitch('embedded')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition cursor-pointer ${
                  activeTab === 'embedded'
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
                title="Embed direct unblocked search engine in iframe"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Sandbox View</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Results View */}
      <div className="flex-1 max-w-5xl w-full mx-auto p-4 sm:px-8 sm:py-6 flex flex-col gap-5">
        {/* Popular searches & recent history chips */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-semibold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Popular:</span>
          </span>
          {POPULAR_SEARCHES.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => handleExecuteSearch(item, activeTab, selectedEngine)}
              className="bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white px-2.5 py-1 rounded-lg border border-slate-800 hover:border-slate-700 transition cursor-pointer"
            >
              {item}
            </button>
          ))}
        </div>

        {history.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Recent:</span>
            </span>
            {history.slice(0, 6).map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => handleExecuteSearch(term, activeTab, selectedEngine)}
                className="bg-slate-900/60 hover:bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-800 transition cursor-pointer"
              >
                {term}
              </button>
            ))}
            <button
              type="button"
              onClick={clearHistory}
              className="text-[11px] text-slate-500 hover:text-rose-400 underline ml-2 cursor-pointer"
            >
              Clear
            </button>
          </div>
        )}

        {/* Rich Knowledge Card / Instant Overview */}
        {knowledgeCard && activeTab === 'web' && (
          <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-950/30 via-slate-900 to-slate-900 p-5 shadow-xl flex flex-col sm:flex-row gap-5 items-start">
            {knowledgeCard.thumbnail && (
              <img
                src={knowledgeCard.thumbnail}
                alt={knowledgeCard.title}
                className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-xl border border-amber-500/20 shrink-0 bg-slate-950 shadow-md"
              />
            )}
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                  Verified Knowledge Card
                </span>
                {knowledgeCard.description && (
                  <span className="text-xs text-slate-400 italic">
                    {knowledgeCard.description}
                  </span>
                )}
              </div>
              <h2 className="text-xl font-black text-white tracking-tight">
                {knowledgeCard.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {knowledgeCard.extract}
              </p>
              <div className="flex flex-wrap items-center gap-2.5 pt-1.5">
                {knowledgeCard.url && (
                  <button
                    type="button"
                    onClick={() => openPreview(knowledgeCard.url, true)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow transition cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Clean Article Reader</span>
                  </button>
                )}
                {knowledgeCard.url && (
                  <button
                    type="button"
                    onClick={() => openPreview(knowledgeCard.url, false)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition cursor-pointer"
                  >
                    <Globe className="w-3.5 h-3.5 text-sky-400" />
                    <span>Proxy Preview</span>
                  </button>
                )}
                {knowledgeCard.url && (
                  <button
                    type="button"
                    onClick={() => launchCloakedTab(knowledgeCard.url)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition cursor-pointer"
                  >
                    <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                    <span>Stealth Popout</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* AI Smart Summary Card if in AI engine mode */}
        {selectedEngine === 'ai' && aiSummary && !knowledgeCard && activeTab === 'web' && (
          <div className="rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-950/30 via-slate-900 to-slate-900 p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
                  AI Smart Overview
                </span>
                <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded border border-purple-500/30 font-mono">
                  Gemini &amp; ChatGPT
                </span>
              </div>
              {onOpenAi && (
                <button
                  type="button"
                  onClick={() => onOpenAi(query)}
                  className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-sky-600 hover:from-purple-500 hover:to-sky-500 text-white font-bold text-xs flex items-center gap-1.5 shadow cursor-pointer transition"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-200" />
                  <span>Ask in AI Studio</span>
                </button>
              )}
            </div>
            <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-line">
              {aiSummary}
            </p>
          </div>
        )}

        {/* Loading Spinner */}
        {isLoading && (
          <div className="py-20 text-center space-y-3">
            <RotateCw className="w-9 h-9 mx-auto text-amber-400 animate-spin" />
            <p className="text-sm text-slate-300 font-bold">
              Searching via {ENGINES.find((e) => e.id === selectedEngine)?.name || 'Multi-Engine'}...
            </p>
            <p className="text-xs text-slate-500">Bypassing school filters &bull; Encrypted proxy active</p>
          </div>
        )}

        {/* Error Notice */}
        {searchError && !isLoading && (
          <div className="p-4 rounded-xl border border-rose-500/40 bg-rose-950/30 flex items-center gap-3 text-xs text-rose-200">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <div className="flex-1">
              <span>{searchError}</span>
            </div>
            <button
              onClick={() => handleExecuteSearch(query, activeTab, 'auto')}
              className="px-3 py-1 bg-amber-500 text-slate-950 rounded font-bold hover:bg-amber-400 cursor-pointer"
            >
              Try Turbo Auto Engine
            </button>
          </div>
        )}

        {/* TAB 1: ALL WEB RESULTS */}
        {!isLoading && activeTab === 'web' && (
          <div className="space-y-4">
            {webResults.length > 0 ? (
              <div className="space-y-3">
                <div className="text-xs text-slate-400 flex items-center justify-between pb-1 border-b border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <span>
                      Found <strong className="text-white">{webResults.length}</strong> results for &ldquo;{query}&rdquo;
                    </span>
                    <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-amber-400 font-mono">
                      Engine: {ENGINES.find((e) => e.id === selectedEngine)?.name || selectedEngine}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 hidden sm:inline">
                    🛡️ UNBLOCKED PROXY SECURE
                  </span>
                </div>

                {webResults.map((result, idx) => (
                  <div
                    key={idx}
                    className="p-4 sm:p-5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all space-y-2.5 group"
                  >
                    {/* Domain & Favicon */}
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <img
                        src={result.favicon}
                        alt=""
                        className="w-4 h-4 rounded-sm object-contain bg-slate-800"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <span className="font-mono text-amber-400/90 text-[11px] truncate">
                        {result.domain}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-base sm:text-lg font-bold text-sky-400 group-hover:text-sky-300 transition-colors">
                      <button
                        type="button"
                        onClick={() => openPreview(result.url, false)}
                        className="hover:underline text-left cursor-pointer"
                      >
                        {result.title}
                      </button>
                    </h3>

                    {/* Snippet */}
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {result.snippet}
                    </p>

                    {/* Action Bar */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => openPreview(result.url, false)}
                        className="px-2.5 py-1 rounded-md bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                        title="Preview inside app with unblocking proxy"
                      >
                        <Globe className="w-3 h-3" />
                        <span>Proxy Preview</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => openPreview(result.url, true)}
                        className="px-2.5 py-1 rounded-md bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                        title="Read clean article without ads, scripts, or school filters"
                      >
                        <BookOpen className="w-3 h-3" />
                        <span>Clean Reader</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => launchCloakedTab(result.url)}
                        className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                        title="Open in disguised about:blank window"
                      >
                        <EyeOff className="w-3 h-3" />
                        <span>Stealth Tab</span>
                      </button>

                      <a
                        href={result.url}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                      >
                        <span>Direct Link</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : hasSearched ? (
              <div className="text-center py-16 px-4 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-3">
                <Search className="w-8 h-8 mx-auto text-slate-500" />
                <h3 className="text-base font-bold text-slate-200">No search results found</h3>
                <p className="text-xs text-slate-400">
                  Try adjusting your search terms or switch to another engine like Turbo Auto or Bing.
                </p>
                <div className="flex justify-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => handleEngineChange('auto')}
                    className="px-4 py-2 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs cursor-pointer"
                  >
                    Switch to Turbo Auto Engine
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTabSwitch('embedded')}
                    className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer"
                  >
                    Open Sandbox View
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* TAB 2: IMAGES RESULTS */}
        {!isLoading && activeTab === 'images' && (
          <div>
            {imageResults.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {imageResults.map((img, idx) => (
                  <div
                    key={idx}
                    className="group rounded-xl border border-slate-800 bg-slate-900 overflow-hidden flex flex-col hover:border-slate-700 transition shadow-sm"
                  >
                    <div className="relative aspect-video sm:aspect-square bg-slate-950 overflow-hidden">
                      <img
                        src={img.thumbnail || img.image}
                        alt={img.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.src =
                            'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="%23334155"><rect width="100" height="100"/></svg>';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2 flex items-end justify-between">
                        <a
                          href={img.image}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2 py-1 bg-amber-500 text-slate-950 rounded text-[10px] font-bold shadow hover:bg-amber-400"
                        >
                          Full Res
                        </a>
                        <button
                          type="button"
                          onClick={() => launchCloakedTab(img.url || img.image)}
                          className="p-1 bg-slate-900/90 text-white rounded text-[10px] hover:bg-slate-800"
                          title="Stealth open"
                        >
                          <EyeOff className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <div className="p-2.5 flex-1 flex flex-col justify-between">
                      <div className="text-xs font-semibold text-slate-200 line-clamp-2 leading-tight">
                        {img.title}
                      </div>
                      <div className="text-[10px] text-amber-400/80 font-mono truncate mt-1">
                        {img.source || 'Web Image'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : hasSearched ? (
              <div className="text-center py-16 px-4 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-2">
                <ImageIcon className="w-8 h-8 mx-auto text-slate-500" />
                <h3 className="text-base font-bold text-slate-200">No image results found</h3>
                <p className="text-xs text-slate-400">Try searching for a broader term.</p>
              </div>
            ) : null}
          </div>
        )}

        {/* TAB 3: NEWS RESULTS */}
        {!isLoading && activeTab === 'news' && (
          <div className="space-y-3">
            {newsResults.length > 0 ? (
              newsResults.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition flex flex-col sm:flex-row gap-4 items-start"
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt=""
                      className="w-full sm:w-28 h-24 object-cover rounded-lg border border-slate-800 shrink-0 bg-slate-950"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  )}
                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <span className="font-bold text-amber-400">{item.source}</span>
                      {item.date && (
                        <>
                          <span>•</span>
                          <span>{item.date}</span>
                        </>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-white hover:text-sky-300">
                      <button
                        type="button"
                        onClick={() => openPreview(item.url, false)}
                        className="text-left cursor-pointer hover:underline"
                      >
                        {item.title}
                      </button>
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">{item.excerpt}</p>
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => openPreview(item.url, true)}
                        className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <BookOpen className="w-3 h-3" />
                        <span>Clean Reader</span>
                      </button>
                      <span className="text-slate-600">•</span>
                      <button
                        type="button"
                        onClick={() => openPreview(item.url, false)}
                        className="text-xs font-bold text-sky-400 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>Proxy View</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                      <span className="text-slate-600">•</span>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-bold text-slate-400 hover:text-slate-200 flex items-center gap-1"
                      >
                        <span>Original</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              ))
            ) : hasSearched ? (
              <div className="text-center py-16 px-4 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-2">
                <Newspaper className="w-8 h-8 mx-auto text-slate-500" />
                <h3 className="text-base font-bold text-slate-200">No news articles found</h3>
                <p className="text-xs text-slate-400">Try searching for a trending topic.</p>
              </div>
            ) : null}
          </div>
        )}

        {/* TAB 4: EMBEDDED UNBLOCKED ENGINE VIEW */}
        {activeTab === 'embedded' && (
          <div className="rounded-2xl border border-slate-800 bg-slate-950 flex flex-col shadow-2xl overflow-hidden min-h-[620px]">
            <div className="bg-slate-900 border-b border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 pr-2 border-r border-slate-800">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
                  <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
                </div>

                <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setEmbeddedEngine('ddg')}
                    className={`px-2 py-0.5 rounded text-[11px] font-bold transition cursor-pointer ${
                      embeddedEngine === 'ddg'
                        ? 'bg-amber-500 text-slate-950'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    DuckDuckGo
                  </button>
                  <button
                    type="button"
                    onClick={() => setEmbeddedEngine('bing')}
                    className={`px-2 py-0.5 rounded text-[11px] font-bold transition cursor-pointer ${
                      embeddedEngine === 'bing'
                        ? 'bg-sky-500 text-slate-950'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Bing
                  </button>
                  <button
                    type="button"
                    onClick={() => setEmbeddedEngine('wiki')}
                    className={`px-2 py-0.5 rounded text-[11px] font-bold transition cursor-pointer ${
                      embeddedEngine === 'wiki'
                        ? 'bg-emerald-500 text-slate-950'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Wikipedia
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setBrowserKey((k) => k + 1)}
                  className="p-1 rounded text-slate-400 hover:text-white transition"
                  title="Reload engine"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex-1 max-w-md bg-slate-950 border border-slate-800 rounded-lg px-3 py-1 flex items-center gap-2 text-xs font-mono text-slate-300 truncate">
                <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">{getEmbeddedEngineUrl()}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => launchCloakedTab(getEmbeddedEngineUrl())}
                  className="px-2.5 py-1 rounded bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1"
                >
                  <EyeOff className="w-3 h-3" />
                  <span className="hidden sm:inline">Stealth Window</span>
                </button>
              </div>
            </div>

            <iframe
              key={browserKey + embeddedEngine}
              src={getEmbeddedEngineUrl()}
              title="Unblocked Engine Sandbox"
              className="w-full flex-1 min-h-[600px] border-0 bg-[#0b0f19]"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
            />
          </div>
        )}
      </div>

      {/* Embedded In-App Proxy Browser Preview Modal */}
      {previewUrl && (
        <div
          className={`fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex flex-col ${
            isModalMaximized ? 'p-0' : 'p-2 sm:p-5'
          } animate-in fade-in duration-200`}
        >
          <div
            className={`w-full mx-auto flex-1 bg-slate-900 border border-slate-700 ${
              isModalMaximized ? 'rounded-none max-w-full' : 'rounded-2xl max-w-6xl shadow-2xl'
            } flex flex-col overflow-hidden`}
          >
            {/* Modal Browser Bar */}
            <div className="bg-slate-950 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setBrowserKey((k) => k + 1)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                  title="Reload page"
                >
                  <RotateCw className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1 text-xs font-mono text-slate-300 max-w-md truncate">
                  <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate">{previewUrl}</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {/* Clean Reader Toggle */}
                <button
                  type="button"
                  onClick={() => {
                    setReaderMode(!readerMode);
                    setBrowserKey((k) => k + 1);
                  }}
                  className={`px-2.5 py-1 rounded text-xs font-bold transition flex items-center gap-1 cursor-pointer border ${
                    readerMode
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                  }`}
                  title="Toggle distraction-free reader mode"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">
                    {readerMode ? 'Reader: ON' : 'Reader Mode'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => copyUrl(previewUrl)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition text-xs flex items-center gap-1"
                  title="Copy URL"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>

                <button
                  type="button"
                  onClick={() => launchCloakedTab(previewUrl)}
                  className="px-2.5 py-1 rounded bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                  title="Open stealth tab disguised as Google Docs"
                >
                  <EyeOff className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Stealth Tab</span>
                </button>

                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1"
                >
                  <span>Open Direct</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  type="button"
                  onClick={() => setIsModalMaximized(!isModalMaximized)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                  title={isModalMaximized ? 'Restore size' : 'Maximize'}
                >
                  {isModalMaximized ? (
                    <Minimize2 className="w-4 h-4" />
                  ) : (
                    <Maximize2 className="w-4 h-4" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setPreviewUrl(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition cursor-pointer"
                  title="Close viewer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Embedded Proxied View */}
            <div className="flex-1 relative bg-slate-950">
              <iframe
                key={browserKey}
                src={
                  readerMode
                    ? `/api/proxy/reader?url=${encodeURIComponent(previewUrl)}`
                    : `/api/proxy/page?url=${encodeURIComponent(previewUrl)}`
                }
                title="Proxy Web Preview"
                className="w-full h-full border-0"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
