import React, { useState } from 'react';
import { OptionCategory } from '../types';

interface SelectionCardProps {
  category: OptionCategory;
  selectedValue: string | string[];
  onSelect: (id: string, value: string, isToggle?: boolean) => void;
}

export const SelectionCard: React.FC<SelectionCardProps> = ({ category, selectedValue, onSelect }) => {
  const [isCustomMode, setIsCustomMode] = useState(false);

  // Handler for the Random button
  const handleRandom = () => {
    if (category.options && category.options.length > 0) {
        const randomIndex = Math.floor(Math.random() * category.options.length);
        const randomOption = category.options[randomIndex];
        // Select the specific option directly (no toggle, force set)
        onSelect(category.id as string, randomOption.value, false);
        setIsCustomMode(false);
    }
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Custom input should always overwrite, never toggle
    onSelect(category.id as string, e.target.value, false);
  };

  // Icons
  const DiceIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><path d="M16 8h.01"/><path d="M8 8h.01"/><path d="M8 16h.01"/><path d="M16 16h.01"/><path d="M12 12h.01"/></svg>
  );

  const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
  );

  const ListIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/></svg>
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
          <button
            onClick={() => setIsCustomMode(!isCustomMode)}
            className={`flex items-center gap-1 px-2 py-1.5 text-xs rounded transition-colors ${
              isCustomMode 
              ? 'bg-indigo-600 text-white' 
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
            title={isCustomMode ? "切換回選項列表" : "切換至自訂輸入"}
          >
             {isCustomMode ? <><ListIcon /> 選項</> : <><EditIcon /> 自訂</>}
          </button>
        </div>
      </div>
      
      <div className="flex-1">
        {isCustomMode ? (
           <div className="h-full flex flex-col">
              <textarea
                value={typeof selectedValue === 'string' ? selectedValue : ''}
                onChange={handleCustomChange}
                placeholder={`在此輸入自訂的${category.label}內容...`}
                className="w-full flex-1 p-3 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm resize-none min-h-[100px]"
              />
              <p className="text-xs text-slate-500 mt-2 text-right">支援中英文輸入</p>
           </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {category.options.map((option) => {
              const isSelected = Array.isArray(selectedValue) 
                ? selectedValue.includes(option.value)
                : selectedValue === option.value;

              return (
                <button
                  key={option.value}
                  // Clicking a chip defaults to toggle behavior (isToggle=true or undefined)
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
          </div>
        )}
      </div>
    </div>
  );
};