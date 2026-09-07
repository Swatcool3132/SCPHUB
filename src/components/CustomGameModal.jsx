import React, { useState } from 'react';
import { X, PlusCircle, AlertCircle, Link } from 'lucide-react';

export const CustomGameModal = ({
  isOpen,
  onClose,
  onAddGame
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Arcade');
  const [rawUrlOrEmbed, setRawUrlOrEmbed] = useState('');
  const [description, setDescription] = useState('');
  const [controlsKey, setControlsKey] = useState('Arrow Keys');
  const [controlsAction, setControlsAction] = useState('Movement');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Please provide a game title.');
      return;
    }

    let finalUrl = rawUrlOrEmbed.trim();

    // If user pasted an iframe tag like <iframe src="...">
    if (finalUrl.includes('<iframe') && finalUrl.includes('src=')) {
      const match = finalUrl.match(/src=["']([^"']+)["']/);
      if (match && match[1]) {
        finalUrl = match[1];
      }
    }

    if (!finalUrl) {
      setError('Please provide a valid iframe URL or embed code.');
      return;
    }

    const newGame = {
      id: `custom-${Date.now()}`,
      title: title.trim(),
      category: category,
      description: description.trim() || 'Custom user embedded iframe web game.',
      iframeUrl: finalUrl,
      tags: ['Custom', category],
      color: 'from-purple-600 to-indigo-800',
      badge: 'Custom',
      rating: 5.0,
      isCustom: true,
      controls: [
        {
          key: controlsKey.trim() || 'Controls',
          action: controlsAction.trim() || 'Play'
        }
      ]
    };

    onAddGame(newGame);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-[#1e293b] border border-slate-800 rounded-xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-sky-500/20 text-sky-400 flex items-center justify-center">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-100 uppercase tracking-tight">Add Custom Iframe Game</h3>
              <p className="text-xs text-slate-400">Embed any web game URL or HTML5 iframe</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded bg-red-500/15 border border-red-500/30 text-red-300 text-xs font-bold uppercase tracking-wide">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Game Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Geometry Dash Web"
              className="w-full bg-slate-900 border border-slate-700 focus:border-sky-500 text-slate-100 rounded-md px-3.5 py-2 text-sm outline-none transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 focus:border-sky-500 text-slate-100 rounded-md px-3.5 py-2 text-sm outline-none transition uppercase font-bold text-xs"
              >
                <option value="Arcade">Arcade</option>
                <option value="Action">Action</option>
                <option value="Puzzle">Puzzle</option>
                <option value="Retro">Retro</option>
                <option value="Custom">Custom</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Control Key
              </label>
              <input
                type="text"
                value={controlsKey}
                onChange={(e) => setControlsKey(e.target.value)}
                placeholder="e.g., Spacebar / Arrow Keys"
                className="w-full bg-slate-900 border border-slate-700 focus:border-sky-500 text-slate-100 rounded-md px-3.5 py-2 text-sm outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Link className="w-3.5 h-3.5 text-sky-400" />
              <span>Iframe URL or Embed Code *</span>
            </label>
            <textarea
              required
              rows={2}
              value={rawUrlOrEmbed}
              onChange={(e) => setRawUrlOrEmbed(e.target.value)}
              placeholder='https://example.com/game or <iframe src="..."></iframe>'
              className="w-full bg-slate-900 border border-slate-700 focus:border-sky-500 text-slate-100 rounded-md px-3.5 py-2 text-sm outline-none transition resize-none font-mono text-xs"
            />
            <p className="text-[11px] text-slate-500 mt-1 font-mono">
              Supports relative paths (e.g., /games/snake.html) or public HTTPS game URLs.
            </p>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Short Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the gameplay and objectives..."
              className="w-full bg-slate-900 border border-slate-700 focus:border-sky-500 text-slate-100 rounded-md px-3.5 py-2 text-sm outline-none transition resize-none"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-md text-xs font-black uppercase tracking-wider bg-sky-500 hover:bg-sky-400 text-white shadow-sm transition active:scale-95"
            >
              Add to Library
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
