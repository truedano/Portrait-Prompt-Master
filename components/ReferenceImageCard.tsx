
import React, { useState, useEffect } from 'react';
import { ReferenceImage, EditingIntent } from '../types';

interface ReferenceImageCardProps {
  image: ReferenceImage;
  onUpdate: (id: string, updates: Partial<ReferenceImage>) => void;
  onRemove: (id: string) => void;
}

export const ReferenceImageCard: React.FC<ReferenceImageCardProps> = ({ image, onUpdate, onRemove }) => {
  const [hasError, setHasError] = useState(false);
  
  // Reset error state when URL changes
  useEffect(() => {
    setHasError(false);
  }, [image.url]);

  const handleIntentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdate(image.id, { 
        intent: e.target.value as EditingIntent 
    });
  };

  const LinkIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
  );

  const ImageIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
  );

  const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
  );

  return (
    <div className="bg-slate-800/80 border border-slate-700 rounded-lg p-3 flex gap-3 shadow-sm">
        
        {/* Preview Thumbnail */}
        <div className="w-16 h-16 shrink-0 bg-slate-700 rounded overflow-hidden flex items-center justify-center relative border border-slate-600">
            {image.url && !hasError ? (
                <img 
                    src={image.url} 
                    alt="ref" 
                    className="w-full h-full object-cover"
                    onError={() => setHasError(true)}
                />
            ) : (
                <div className="text-slate-500">
                   <ImageIcon />
                </div>
            )}
        </div>

        <div className="flex-1 space-y-2 min-w-0">
            {/* Top Row: Intent Select & Remove */}
            <div className="flex justify-between items-center gap-2">
                <select 
                    value={image.intent}
                    onChange={handleIntentChange}
                    className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded px-2 py-1.5 focus:border-indigo-500 outline-none flex-1 truncate"
                >
                    <option value="general">一般參考 (General)</option>
                    <option value="keep_subject">保持主角 (Keep Subject)</option>
                    <option value="keep_composition">保持構圖 (Keep Composition)</option>
                    <option value="high_denoising">大幅重繪 (High Denoising)</option>
                </select>
                <button 
                    onClick={() => onRemove(image.id)}
                    className="text-slate-500 hover:text-red-400 p-1 rounded transition-colors"
                >
                    <TrashIcon />
                </button>
            </div>

            {/* URL Input */}
            <div className="relative">
                <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500">
                    <LinkIcon />
                </div>
                <input 
                    type="text" 
                    value={image.url}
                    onChange={(e) => onUpdate(image.id, { url: e.target.value })}
                    placeholder="圖片網址 (Image URL)"
                    className="w-full bg-slate-900 border border-slate-700 rounded pl-8 pr-2 py-1.5 text-xs text-slate-300 placeholder:text-slate-600 focus:border-indigo-500 outline-none"
                />
            </div>
        </div>
    </div>
  );
};
