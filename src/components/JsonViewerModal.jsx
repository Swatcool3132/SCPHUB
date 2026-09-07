import React, { useState } from 'react';
import { X, Code, Copy, Check, Download, FileJson } from 'lucide-react';

export const JsonViewerModal = ({
  isOpen,
  onClose,
  games = []
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const jsonString = JSON.stringify(games, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'games.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-[#1e293b] border border-slate-800 rounded-xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-sky-500/20 text-sky-400 flex items-center justify-center">
              <FileJson className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-slate-100 font-mono uppercase">games.json</h3>
                <span className="text-[10px] bg-sky-500 text-white px-2 py-0.5 rounded font-black uppercase tracking-wider">
                  {games.length} Entries
                </span>
              </div>
              <p className="text-xs text-slate-400">
                JSON schema mapping game metadata and iframe paths
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold uppercase tracking-wider border border-slate-700 flex items-center gap-1.5 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy JSON'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="px-3 py-1.5 rounded-md bg-sky-500 hover:bg-sky-400 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* JSON Code Viewer */}
        <div className="p-4 flex-1 overflow-auto bg-slate-950 font-mono text-xs text-slate-300 scrollbar-thin border-b border-slate-800">
          <pre className="text-sky-300/90 whitespace-pre-wrap leading-relaxed">
            {jsonString}
          </pre>
        </div>

        {/* Footer info banner */}
        <div className="p-3 bg-slate-900 text-xs text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4 text-sky-400" />
            <span>
              Each game maps an <code className="text-sky-300 bg-slate-800 px-1 py-0.5 rounded font-mono">iframeUrl</code> to a standalone HTML, CSS & JS game canvas!
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
