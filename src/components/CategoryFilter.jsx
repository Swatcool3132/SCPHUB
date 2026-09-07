import React from 'react';
import { Gamepad2, Puzzle, Zap, Sparkles, FolderHeart, Trophy, Flame, Boxes } from 'lucide-react';

export const CategoryFilter = ({
  categories,
  selectedCategory,
  onSelectCategory,
  categoryCounts = {}
}) => {
  const getIcon = (cat) => {
    switch (cat.toLowerCase()) {
      case 'all': return <Sparkles className="w-3.5 h-3.5 text-amber-400" />;
      case 'action': return <Zap className="w-3.5 h-3.5 text-yellow-400" />;
      case 'driving': return <Flame className="w-3.5 h-3.5 text-orange-400" />;
      case 'racing': return <Trophy className="w-3.5 h-3.5 text-amber-400" />;
      case 'sports': return <Trophy className="w-3.5 h-3.5 text-emerald-400" />;
      case 'arcade': return <Gamepad2 className="w-3.5 h-3.5 text-cyan-400" />;
      case 'sandbox': return <Boxes className="w-3.5 h-3.5 text-emerald-400" />;
      case 'puzzle': return <Puzzle className="w-3.5 h-3.5 text-purple-400" />;
      case 'custom': return <Flame className="w-3.5 h-3.5 text-rose-400" />;
      default: return <FolderHeart className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
      {categories.map((cat) => {
        const isSelected = selectedCategory === cat;
        const count = categoryCounts[cat] || 0;

        return (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat)}
            className={`h-9 px-3.5 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap flex items-center gap-2 transition-all cursor-pointer select-none border ${
              isSelected
                ? 'bg-sky-500 text-white border-sky-400 shadow-md shadow-sky-500/20 font-black'
                : 'bg-slate-900/90 hover:bg-slate-800 text-slate-400 hover:text-white border-slate-800'
            }`}
          >
            {getIcon(cat)}
            <span>{cat}</span>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                isSelected
                  ? 'bg-black/25 text-white'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
};
