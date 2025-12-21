import React, { useState } from 'react';
import { OptionCategory } from '../types';

interface SelectionCardProps {
  category: OptionCategory;
  selectedValue: string | string[];
  onSelect: (id: string, value: string, isToggle?: boolean) => void;
}

export const SelectionCard: React.FC<SelectionCardProps> = ({ category, selectedValue, onSelect }) => {
  const [customInput, setCustomInput] = useState('');

  // Handler for the Random button
  const handleRandom = () => {
    if (category.options && category.options.length > 0) {
      const randomIndex = Math.floor(Math.random() * category.options.length);
      const randomOption = category.options[randomIndex];
      // Select the specific option directly (no toggle, force set)
      onSelect(category.id as string, randomOption.value, false);
    }
  };

  const handleAddCustom = () => {
    if (!customInput.trim()) return;

    const isMulti = Array.isArray(selectedValue);

    if (isMulti) {
      // Append if not exists
      if (!selectedValue.includes(customInput)) {
        onSelect(category.id as string, customInput, true);
      }
    } else {
      // Single select: replace
      onSelect(category.id as string, customInput, false);
    }
    setCustomInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddCustom();
    }
  };

  // Icons
  const DiceIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><path d="M16 8h.01" /><path d="M8 8h.01" /><path d="M8 16h.01" /><path d="M16 16h.01" /><path d="M12 12h.01" /></svg>
  );

  const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="5" y2="19" /><line x1="5" x2="19" y1="12" y2="12" /></svg>
  );

  // Check if any option in this category has an image to decide layout mode
  const hasImages = category.options.some(opt => opt.image);

  return (
    <div className="glass-card rounded-xl p-5 hover:border-slate-600/50 transition-all duration-300 flex flex-col group relative w-full">
      {/* Decorative gradient blob */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all duration-500 pointer-events-none"></div>

      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2 drop-shadow-md">
            {category.label}
          </h3>
          {category.description && (
            <p className="text-xs text-slate-400 mt-1">{category.description}</p>
          )}
        </div>

        <div className="flex gap-1">
          <button
            onClick={handleRandom}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg transition-all bg-slate-700/50 text-slate-300 hover:bg-indigo-500 hover:text-white backdrop-blur-sm border border-slate-600/50 hover:border-indigo-400"
            title="隨機選擇一個項目"
          >
            <DiceIcon /> 隨機
          </button>
        </div>
      </div>

      <div className="flex-1 space-y-4 relative z-10 w-full">
        {/* Options Grid/List */}
        <div className={`
          ${hasImages ? 'grid grid-cols-2 sm:grid-cols-3 gap-3' : 'flex flex-wrap gap-2'}
        `}>
          {/* 1. Render Preset Options */}
          {category.options.map((option) => {
            const isSelected = Array.isArray(selectedValue)
              ? selectedValue.includes(option.value)
              : selectedValue === option.value;

            // VISUAL CARD MODE
            if (option.image) {
              return (
                <button
                  key={option.value}
                  onClick={() => onSelect(category.id as string, option.value, true)}
                  className={`
                    relative group/card rounded-xl overflow-hidden border transition-all duration-300 text-left aspect-[4/3]
                    ${isSelected
                      ? 'border-indigo-500 ring-2 ring-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.4)]'
                      : 'border-slate-700/50 hover:border-indigo-400/50 hover:shadow-lg'
                    }
                  `}
                >
                  <img
                    src={option.image}
                    alt={option.label}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
                  />
                  <div className={`absolute inset-0 transition-colors duration-300 ${isSelected ? 'bg-indigo-900/40' : 'bg-slate-900/60 group-hover/card:bg-slate-900/40'}`}></div>

                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-slate-950/90 to-transparent">
                    <span className={`text-xs font-medium block truncate ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                      {option.label}
                    </span>
                  </div>

                  {isSelected && (
                    <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-indigo-400 shadow-[0_0_5px_rgba(129,140,248,1)]"></div>
                  )}
                </button>
              )
            }

            // TEXT BUTTON MODE
            return (
              <button
                key={option.value}
                onClick={() => onSelect(category.id as string, option.value, true)}
                className={`
                    px-3 py-1.5 text-sm rounded-lg border transition-all duration-200 text-left relative overflow-hidden
                    ${isSelected
                    ? 'bg-indigo-600/90 border-indigo-500 text-white shadow-[0_0_12px_rgba(99,102,241,0.5)]'
                    : 'bg-slate-800/40 border-slate-700/50 text-slate-300 hover:bg-slate-700/60 hover:border-slate-500/50 hover:text-white backdrop-blur-sm'
                  }
                  `}
              >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity pointer-events-none"></div>
                {option.label}
              </button>
            );
          })}

          {/* 2. Render Selected Custom Tags (that are not in options) */}
          {Array.isArray(selectedValue) ? (
            selectedValue.map(val => {
              if (category.options.some(opt => opt.value === val)) return null;
              return (
                <button
                  key={val}
                  onClick={() => onSelect(category.id as string, val, true)}
                  className="px-3 py-1.5 text-sm rounded-lg border border-indigo-500 bg-indigo-600 text-white shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                >
                  {val}
                </button>
              );
            })
          ) : (
            // Single select custom value
            selectedValue && !category.options.some(opt => opt.value === selectedValue) && (
              <button
                key={selectedValue}
                onClick={() => onSelect(category.id as string, selectedValue, true)}
                className="px-3 py-1.5 text-sm rounded-lg border border-indigo-500 bg-indigo-600 text-white shadow-[0_0_10px_rgba(99,102,241,0.5)]"
              >
                {selectedValue}
              </button>
            )
          )}
        </div>

        {/* Custom Input Area */}
        <form
          className="relative group/input pt-2"
          onSubmit={(e) => { e.preventDefault(); handleAddCustom(); }}
        >
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            // onKeyDown={handleKeyDown} // Form submit handles Enter
            placeholder={`新增自訂${category.label}標籤...`}
            className="w-full pl-3 pr-10 py-2.5 rounded-lg bg-slate-950/50 border border-slate-700/50 text-slate-200 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600 shadow-inner"
          />
          <button
            type="submit"
            disabled={!customInput.trim()}
            className="absolute right-1 top-[calc(50%+4px)] -translate-y-1/2 p-1.5 rounded-md bg-indigo-600/80 text-white hover:bg-indigo-500 disabled:opacity-0 disabled:cursor-not-allowed transition-all duration-300 opacity-100 shadow-lg"
          >
            <PlusIcon />
          </button>
        </form>

        {/* Empty State */}
        {(!category.options.length && (!Array.isArray(selectedValue) || selectedValue.length === 0)) && (
          <div className="w-full text-center py-4 text-slate-600 text-sm border border-dashed border-slate-800 rounded-lg">
            尚未選擇任何標籤
          </div>
        )}

      </div>
    </div>
  );
};