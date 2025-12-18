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

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 hover:border-slate-600 transition-colors duration-300 flex flex-col h-full">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
            {category.label}
          </h3>
          {category.description && (
            <p className="text-xs text-slate-400 mt-1">{category.description}</p>
          )}
        </div>

        <div className="flex gap-1">
          <button
            onClick={handleRandom}
            className="flex items-center gap-1 px-2 py-1.5 text-xs rounded transition-colors bg-slate-700 text-slate-300 hover:bg-indigo-600 hover:text-white"
            title="隨機選擇一個項目"
          >
            <DiceIcon /> 隨機
          </button>
        </div>
      </div>

      <div className="flex-1 space-y-3">
        {/* Custom Input Area */}
        <div className="flex gap-2">
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`新增自訂${category.label}標籤...`}
            className="flex-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
          />
          <button
            onClick={handleAddCustom}
            disabled={!customInput.trim()}
            className="p-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <PlusIcon />
          </button>
        </div>

        {/* Options List */}
        <div className="flex flex-wrap gap-2">
          {/* 1. Render Preset Options */}
          {category.options.map((option) => {
            const isSelected = Array.isArray(selectedValue)
              ? selectedValue.includes(option.value)
              : selectedValue === option.value;

            return (
              <button
                key={option.value}
                onClick={() => onSelect(category.id as string, option.value, true)}
                className={`
                    px-3 py-1.5 text-sm rounded-lg border transition-all duration-200 text-left
                    ${isSelected
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-[0_0_10px_rgba(99,102,241,0.5)]'
                    : 'bg-slate-900/50 border-slate-700 text-slate-300 hover:bg-slate-700 hover:border-slate-500'
                  }
                  `}
              >
                {option.label}
              </button>
            );
          })}

          {/* 2. Render Selected Custom Tags (that are not in options) */}
          {Array.isArray(selectedValue) && selectedValue.map(val => {
            // Check if this value is already rendered as an option
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
          })}

          {/* Empty State */}
          {(!category.options.length && (!Array.isArray(selectedValue) || selectedValue.length === 0)) && (
            <div className="w-full text-center py-4 text-slate-600 text-sm border border-dashed border-slate-800 rounded-lg">
              尚未選擇任何標籤
            </div>
          )}
        </div>
      </div>
    </div>
  );
};