import React, { useState, useEffect, useRef } from 'react';
import Markdown from 'react-markdown';
import {
  Sparkles,
  Bot,
  Send,
  Trash2,
  Copy,
  Check,
  ExternalLink,
  Shield,
  Gamepad2,
  GraduationCap,
  Code2,
  Zap,
  RotateCcw,
  Download,
  Info,
  ChevronDown
} from 'lucide-react';
import { ScpLogo } from './ScpLogo';

const PRESETS = [
  {
    id: 'general',
    title: 'General Assistant',
    desc: 'General knowledge, creative ideas & questions',
    icon: Sparkles,
    color: 'text-sky-400 bg-sky-500/10 border-sky-500/20'
  },
  {
    id: 'gaming',
    title: 'Gaming Coach',
    desc: 'Unblocked tips, speedruns & secret controls',
    icon: Gamepad2,
    color: 'text-amber-400 bg-amber-500/10 border-amber-500/20'
  },
  {
    id: 'homework',
    title: 'Study & Homework',
    desc: 'Math proofs, science formulas & essay help',
    icon: GraduationCap,
    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
  },
  {
    id: 'coding',
    title: 'Code & Dev Mentor',
    desc: 'JavaScript, HTML5 games & debugging',
    icon: Code2,
    color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20'
  },
  {
    id: 'stealth',
    title: 'Stealth & Sandboxing',
    desc: 'Network proxies, tab cloaks & security',
    icon: Shield,
    color: 'text-purple-400 bg-purple-500/10 border-purple-500/20'
  }
];

const STARTER_PROMPTS = {
  general: [
    'Explain quantum computing in simple terms',
    'Write a creative sci-fi story set in an SCP containment facility',
    'What are the 7 wonders of the ancient world?',
    'Summarize the history of the internet'
  ],
  gaming: [
    'What are the best tips to get past Level 10 in Geometry Dash?',
    'How do I make an infinite water source and find diamonds in Minecraft?',
    'Give me speedrun tips and steering tricks for Slope 3D',
    'What is the best offensive playbook in Retro Bowl?'
  ],
  homework: [
    'Explain how photosynthesis works step-by-step',
    'How do I solve quadratic equations using the quadratic formula?',
    'What were the main causes of World War 1?',
    'Write an outline for an essay analyzing Macbeth'
  ],
  coding: [
    'Show me how to build a simple Flappy Bird clone in HTML5 Canvas',
    'What is the difference between let, const, and var in JavaScript?',
    'How does a binary search algorithm work in Python?',
    'How do I center a div both horizontally and vertically with CSS?'
  ],
  stealth: [
    'How does an about:blank stealth tab cloak protect student privacy?',
    'Explain how reverse proxies and HTTPS tunneling work',
    'What are browser sandboxing mechanisms for HTML5 games?',
    'How do school firewalls detect and block domain traffic?'
  ]
};

export const AiChat = ({ initialPrompt = '', onBackToArcade }) => {
  const [model, setModel] = useState('gemini'); // 'gemini' | 'chatgpt'
  const [preset, setPreset] = useState('general');
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem('scphub_ai_chat_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return [];
  });
  const [inputPrompt, setInputPrompt] = useState(initialPrompt);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [modelStatus, setModelStatus] = useState(null);
  const [showPresetMenu, setShowPresetMenu] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Fetch AI capabilities from server
  useEffect(() => {
    fetch('/api/ai/status')
      .then((res) => res.json())
      .then((data) => setModelStatus(data))
      .catch(() => {});
  }, []);

  // Save history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('scphub_ai_chat_history', JSON.stringify(messages));
    } catch {}
  }, [messages]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Handle initial prompt if passed
  useEffect(() => {
    if (initialPrompt && messages.length === 0) {
      handleSendMessage(initialPrompt);
    }
  }, []);

  const handleSendMessage = async (textToSend) => {
    const query = (textToSend || inputPrompt).trim();
    if (!query || isLoading) return;

    setInputPrompt('');
    const newMessages = [...messages, { role: 'user', content: query, timestamp: Date.now() }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          preset,
          messages: newMessages.map((m) => ({ role: m.role, content: m.content }))
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.text || 'I apologize, but no response was returned.',
          model: data.model || model,
          engine: data.engine || (model === 'chatgpt' ? 'ChatGPT (GPT-4o)' : 'Gemini 3.8 Flash'),
          provider: data.provider || 'AI Studio',
          timestamp: Date.now()
        }
      ]);
    } catch (err) {
      console.error('AI chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `⚠️ **Connection Error**: Unable to complete the request with ${model === 'chatgpt' ? 'ChatGPT' : 'Gemini'}. Please verify your connection or try again in a moment.\n\n*Details: ${err.message}*`,
          model,
          engine: 'Error',
          timestamp: Date.now()
        }
      ]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    if (window.confirm('Clear your conversation history?')) {
      setMessages([]);
      localStorage.removeItem('scphub_ai_chat_history');
    }
  };

  const handleCopyMessage = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleExportChat = () => {
    if (messages.length === 0) return;
    const transcript = messages
      .map(
        (m) =>
          `[${m.role.toUpperCase()} - ${new Date(m.timestamp).toLocaleTimeString()}]\n${m.content}\n`
      )
      .join('\n---\n\n');

    const blob = new Blob([transcript], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scphub-ai-chat-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleStealthCloak = () => {
    const win = window.open('about:blank', '_blank');
    if (!win) return;
    const doc = win.document;
    doc.title = 'Google Docs - Document';
    const link = doc.createElement('link');
    link.rel = 'icon';
    link.href = 'https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico';
    doc.head.appendChild(link);

    const iframe = doc.createElement('iframe');
    iframe.src = window.location.href;
    iframe.style.width = '100vw';
    iframe.style.height = '100vh';
    iframe.style.border = 'none';
    iframe.style.margin = '0';
    iframe.style.padding = '0';
    iframe.style.display = 'block';
    doc.body.style.margin = '0';
    doc.body.style.overflow = 'hidden';
    doc.body.appendChild(iframe);
  };

  const currentPresetObj = PRESETS.find((p) => p.id === preset) || PRESETS[0];
  const PresetIcon = currentPresetObj.icon;

  return (
    <div className="flex-1 flex flex-col bg-[#090d16] text-slate-100 overflow-hidden min-h-[calc(100vh-4rem)]">
      {/* 1. TOP HEADER & MODEL SWITCHER */}
      <div className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 shrink-0 z-20">
        {/* Left: Model Selector Switcher */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 shadow-inner">
            {/* Gemini Button */}
            <button
              type="button"
              onClick={() => setModel('gemini')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                model === 'gemini'
                  ? 'bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow-md shadow-sky-600/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
              title="Google DeepMind's flagship Gemini 3.8 Flash model"
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-300 animate-pulse" />
              <span>Gemini 3.8 Flash</span>
              <span className="hidden sm:inline text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-sky-400/20 text-sky-200 font-mono">
                Google
              </span>
            </button>

            {/* ChatGPT Button */}
            <button
              type="button"
              onClick={() => setModel('chatgpt')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                model === 'chatgpt'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
              title="OpenAI's state-of-the-art ChatGPT-4o model"
            >
              <Bot className="w-3.5 h-3.5 text-emerald-300" />
              <span>ChatGPT-4o</span>
              <span className="hidden sm:inline text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-400/20 text-emerald-200 font-mono">
                OpenAI
              </span>
            </button>
          </div>

          {/* Persona Selector Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowPresetMenu(!showPresetMenu)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border cursor-pointer transition ${currentPresetObj.color}`}
            >
              <PresetIcon className="w-3.5 h-3.5" />
              <span className="font-semibold">{currentPresetObj.title}</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            {showPresetMenu && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95">
                <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400 px-2 py-1">
                  Select AI Specialization
                </div>
                {PRESETS.map((p) => {
                  const Icon = p.icon;
                  const isSelected = p.id === preset;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setPreset(p.id);
                        setShowPresetMenu(false);
                      }}
                      className={`w-full flex items-start gap-2.5 p-2 rounded-lg text-left text-xs transition cursor-pointer ${
                        isSelected
                          ? 'bg-sky-600/20 border border-sky-500/40 text-white'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0 mt-0.5 text-sky-400" />
                      <div>
                        <div className="font-bold text-slate-100">{p.title}</div>
                        <div className="text-[11px] text-slate-400 leading-tight">{p.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Controls: Actions */}
        <div className="flex items-center gap-2">
          {/* Cloak Window Button */}
          <button
            type="button"
            onClick={handleStealthCloak}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition border border-slate-700 cursor-pointer"
            title="Open AI Chat in a cloaked about:blank tab disguised as Google Docs"
          >
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">Stealth Tab</span>
          </button>

          {/* Export Chat */}
          {messages.length > 0 && (
            <button
              type="button"
              onClick={handleExportChat}
              className="p-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              title="Export Conversation as Markdown"
            >
              <Download className="w-4 h-4" />
            </button>
          )}

          {/* Clear Chat */}
          {messages.length > 0 && (
            <button
              type="button"
              onClick={handleClearChat}
              className="p-1.5 rounded-lg text-xs text-slate-400 hover:text-red-400 hover:bg-slate-800 transition cursor-pointer"
              title="Clear Chat History"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 2. CHAT MESSAGES SCROLL AREA */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 max-w-4xl w-full mx-auto">
        {messages.length === 0 ? (
          /* EMPTY STATE / WELCOME DASHBOARD */
          <div className="flex flex-col items-center justify-center py-10 sm:py-16 text-center">
            <div className="relative mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500 via-indigo-600 to-purple-700 flex items-center justify-center shadow-xl shadow-indigo-600/20 border border-white/10">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 p-1 bg-slate-900 rounded-full border border-slate-700">
                <ScpLogo className="w-4 h-4" showGlow={false} />
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-2">
              SCPHub AI Studio
            </h1>
            <p className="text-sm text-slate-400 max-w-md mb-8 leading-relaxed">
              Experience the dual power of{' '}
              <span className="text-sky-400 font-semibold">Google Gemini 3.8 Flash</span> and{' '}
              <span className="text-emerald-400 font-semibold">OpenAI ChatGPT-4o</span> directly inside
              your unblocked workspace.
            </p>

            {/* Model Highlight Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg mb-8">
              <div
                onClick={() => setModel('gemini')}
                className={`p-3.5 rounded-xl border transition cursor-pointer text-left ${
                  model === 'gemini'
                    ? 'bg-sky-950/40 border-sky-500/50 ring-1 ring-sky-500/30'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-sky-400" />
                  <span className="font-bold text-sm text-white">Google Gemini</span>
                </div>
                <div className="text-xs text-slate-400">
                  Multimodal reasoning, fast code analysis & real-time search synthesis.
                </div>
              </div>

              <div
                onClick={() => setModel('chatgpt')}
                className={`p-3.5 rounded-xl border transition cursor-pointer text-left ${
                  model === 'chatgpt'
                    ? 'bg-emerald-950/40 border-emerald-500/50 ring-1 ring-emerald-500/30'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Bot className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-sm text-white">OpenAI ChatGPT</span>
                </div>
                <div className="text-xs text-slate-400">
                  Articulate conversation, deep problem-solving & nuanced writing.
                </div>
              </div>
            </div>

            {/* Suggested Starter Prompts */}
            <div className="w-full max-w-2xl">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 text-left">
                Recommended Prompts ({currentPresetObj.title})
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(STARTER_PROMPTS[preset] || STARTER_PROMPTS.general).map((promptText, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendMessage(promptText)}
                    className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 hover:border-sky-500/50 hover:bg-slate-850 text-left text-xs text-slate-300 hover:text-white transition flex items-center justify-between group cursor-pointer"
                  >
                    <span className="line-clamp-2">{promptText}</span>
                    <Send className="w-3.5 h-3.5 text-slate-500 group-hover:text-sky-400 transition shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* MESSAGE THREAD */
          messages.map((msg, index) => {
            const isUser = msg.role === 'user';
            const isGpt = msg.model === 'chatgpt';

            return (
              <div
                key={index}
                className={`flex gap-3 sm:gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {/* Assistant Avatar */}
                {!isUser && (
                  <div
                    className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-white border shadow-md mt-1 ${
                      isGpt
                        ? 'bg-emerald-600 border-emerald-400/40 shadow-emerald-900/20'
                        : 'bg-sky-600 border-sky-400/40 shadow-sky-900/20'
                    }`}
                  >
                    {isGpt ? (
                      <Bot className="w-4 h-4 text-emerald-200" />
                    ) : (
                      <Sparkles className="w-4 h-4 text-sky-200" />
                    )}
                  </div>
                )}

                {/* Message Bubble */}
                <div
                  className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 text-sm leading-relaxed relative group ${
                    isUser
                      ? 'bg-sky-600 text-white rounded-tr-sm shadow-lg shadow-sky-600/10'
                      : 'bg-slate-900 border border-slate-800/90 text-slate-200 rounded-tl-sm shadow-md'
                  }`}
                >
                  {/* Assistant Header Info */}
                  {!isUser && (
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80 text-[11px] text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`font-semibold ${
                            isGpt ? 'text-emerald-400' : 'text-sky-400'
                          }`}
                        >
                          {msg.engine || (isGpt ? 'ChatGPT-4o' : 'Gemini 3.8 Flash')}
                        </span>
                        {msg.provider && (
                          <span className="opacity-60">• {msg.provider}</span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopyMessage(msg.content, index)}
                        className="opacity-60 hover:opacity-100 transition p-1 hover:bg-slate-800 rounded text-slate-300 cursor-pointer"
                        title="Copy text"
                      >
                        {copiedIndex === index ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  )}

                  {/* Body Content */}
                  {isUser ? (
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  ) : (
                    <div className="prose prose-invert prose-sm max-w-none text-slate-200 space-y-2">
                      <Markdown
                        components={{
                          code({ node, inline, className, children, ...props }) {
                            const match = /language-(\w+)/.exec(className || '');
                            return !inline ? (
                              <div className="my-3 rounded-lg overflow-hidden border border-slate-700 bg-slate-950">
                                <div className="bg-slate-900 px-3 py-1.5 text-[11px] font-mono text-slate-400 border-b border-slate-800 flex justify-between items-center">
                                  <span>{match ? match[1] : 'code'}</span>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      navigator.clipboard.writeText(String(children).replace(/\n$/, ''))
                                    }
                                    className="hover:text-white flex items-center gap-1 cursor-pointer"
                                  >
                                    <Copy className="w-3 h-3" />
                                    <span>Copy</span>
                                  </button>
                                </div>
                                <pre className="p-3 text-xs overflow-x-auto text-sky-300 font-mono">
                                  <code className={className} {...props}>
                                    {children}
                                  </code>
                                </pre>
                              </div>
                            ) : (
                              <code
                                className="bg-slate-800 text-sky-300 px-1.5 py-0.5 rounded text-xs font-mono"
                                {...props}
                              >
                                {children}
                              </code>
                            );
                          },
                          ul({ children }) {
                            return <ul className="list-disc pl-5 space-y-1 my-2">{children}</ul>;
                          },
                          ol({ children }) {
                            return <ol className="list-decimal pl-5 space-y-1 my-2">{children}</ol>;
                          },
                          h1({ children }) {
                            return <h1 className="text-lg font-bold text-white mt-4 mb-2">{children}</h1>;
                          },
                          h2({ children }) {
                            return <h2 className="text-base font-bold text-white mt-3 mb-1.5">{children}</h2>;
                          },
                          h3({ children }) {
                            return <h3 className="text-sm font-bold text-white mt-2 mb-1">{children}</h3>;
                          },
                          blockquote({ children }) {
                            return (
                              <blockquote className="border-l-2 border-sky-500 pl-3 py-1 text-slate-400 italic my-2">
                                {children}
                              </blockquote>
                            );
                          }
                        }}
                      >
                        {msg.content}
                      </Markdown>
                    </div>
                  )}

                  {/* Timestamp */}
                  <div
                    className={`text-[10px] mt-1.5 text-right ${
                      isUser ? 'text-sky-200/70' : 'text-slate-500'
                    }`}
                  >
                    {new Date(msg.timestamp || Date.now()).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>

                {/* User Avatar */}
                {isUser && (
                  <div className="w-8 h-8 rounded-xl shrink-0 bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 mt-1">
                    <span className="text-xs font-bold font-mono">YOU</span>
                  </div>
                )}
              </div>
            );
          })
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex gap-3 items-center justify-start">
            <div
              className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-white border shadow-md ${
                model === 'chatgpt'
                  ? 'bg-emerald-600 border-emerald-400/40'
                  : 'bg-sky-600 border-sky-400/40'
              }`}
            >
              {model === 'chatgpt' ? (
                <Bot className="w-4 h-4 text-emerald-200 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 text-sky-200 animate-pulse" />
              )}
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2 text-xs text-slate-400 shadow-md">
              <span className="font-semibold text-slate-300">
                {model === 'chatgpt' ? 'ChatGPT' : 'Gemini'} is thinking
              </span>
              <div className="flex gap-1 items-center">
                <span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-bounce"></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 3. INPUT COMPOSER DOCK */}
      <div className="bg-slate-900/95 backdrop-blur-md border-t border-slate-800 px-4 sm:px-6 py-3 shrink-0">
        <div className="max-w-4xl mx-auto flex flex-col gap-2">
          {/* Quick Preset Selector Chips when conversation is ongoing */}
          {messages.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-xs">
              <span className="text-[11px] text-slate-500 uppercase tracking-wider shrink-0 font-bold">
                Quick Prompts:
              </span>
              {(STARTER_PROMPTS[preset] || STARTER_PROMPTS.general).slice(0, 3).map((p, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSendMessage(p)}
                  className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700/60 whitespace-nowrap transition cursor-pointer text-[11px]"
                >
                  {p}
                </button>
              ))}
            </div>
          )}

          {/* Main Input Field */}
          <div className="flex items-end gap-2 bg-slate-950 border border-slate-800 focus-within:border-sky-500 rounded-2xl p-1.5 transition shadow-inner">
            <textarea
              ref={inputRef}
              rows={1}
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Ask ${model === 'chatgpt' ? 'ChatGPT (GPT-4o)' : 'Gemini 3.8 Flash'} anything...`}
              className="flex-1 bg-transparent px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none resize-none max-h-32 min-h-[38px]"
            />

            <button
              type="button"
              disabled={!inputPrompt.trim() || isLoading}
              onClick={() => handleSendMessage()}
              className={`p-2.5 rounded-xl transition cursor-pointer flex items-center justify-center shrink-0 ${
                inputPrompt.trim() && !isLoading
                  ? model === 'chatgpt'
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20'
                    : 'bg-sky-600 hover:bg-sky-500 text-white shadow-md shadow-sky-600/20'
                  : 'bg-slate-850 text-slate-600 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          {/* Subtext info */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Active: {model === 'chatgpt' ? 'OpenAI ChatGPT-4o' : 'Google Gemini 3.8 Flash'}
              </span>
              <span>•</span>
              <span>Enter to send, Shift+Enter for new line</span>
            </div>
            <button
              type="button"
              onClick={onBackToArcade}
              className="hover:text-slate-300 transition cursor-pointer"
            >
              Return to Arcade
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
