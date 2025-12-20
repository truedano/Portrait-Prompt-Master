import React, { useState } from 'react';
import { HistoryItem } from '../hooks/useHistory';
import { PortraitState } from '../types';

interface HistoryPanelProps {
    history: HistoryItem[];
    favorites: HistoryItem[];
    onLoad: (state: PortraitState) => void;
    onToggleFavorite: (item: HistoryItem) => void;
    onClearHistory: () => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
    history,
    favorites,
    onLoad,
    onToggleFavorite,
    onClearHistory
}) => {
    const [activeTab, setActiveTab] = useState<'history' | 'favorites'>('history');

    const StarIcon = ({ filled }: { filled: boolean }) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={filled ? "text-yellow-400" : "text-slate-400 hover:text-yellow-400"}>
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
    );

    const TimeIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
    );

    const TrashIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
    );

    const getSummary = (state: any) => {
        // 1. New Multi-Subject State
        if (state.subjects && Array.isArray(state.subjects)) {
            const subjects = state.subjects.map((s: any) => {
                const parts = [];
                if (s.subjectType === 'human') {
                    const gender = s.gender === 'female' ? '女' : (s.gender === 'male' ? '男' : '');
                    parts.push(gender);
                    if (s.nationality) parts.push(s.nationality);
                    if (s.role) parts.push(s.role);
                } else if (s.subjectType === 'animal') {
                    if (s.animalFur) parts.push(s.animalFur);
                    if (s.animalSpecies) parts.push(s.animalSpecies);
                } else if (s.subjectType === 'vehicle') {
                    if (s.vehicleColor) parts.push(s.vehicleColor);
                    if (s.vehicleType) parts.push(s.vehicleType);
                } else if (s.subjectType === 'scenery') {
                    if (state.global?.environment) return state.global.environment;
                    return '風景';
                }
                return parts.join(' ') || '未定義主體';
            });
            return subjects.join(' + ');
        }

        // 2. Legacy Flat State
        if (state.subjectType === 'animal') {
            return [state.animalFur, state.animalSpecies, state.artStyle?.[0]].filter(Boolean).join(', ');
        } else if (state.subjectType === 'vehicle') {
            return [state.vehicleColor, state.vehicleType, state.artStyle?.[0]].filter(Boolean).join(', ');
        } else if (state.subjectType === 'scenery') {
            return [state.environment, state.artStyle?.[0]].filter(Boolean).join(', ');
        } else {
            // Default Human
            return [
                state.nationality,
                state.gender === 'female' ? '女性' : (state.gender === 'male' ? '男性' : ''),
                state.role,
                state.artStyle?.[0]
            ].filter(Boolean).join(', ');
        }
    };

    const getTaskMode = (state: any) => {
        if (state.global?.taskMode) return state.global.taskMode;
        return state.taskMode || 'generation';
    };

    const renderList = (items: HistoryItem[], emptyMsg: string) => {
        if (items.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center py-10 text-slate-500">
                    <p className="text-sm">{emptyMsg}</p>
                </div>
            );
        }

        return (
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {items.map(item => {
                    const summary = getSummary(item.state) || '未命名設定';
                    const taskMode = getTaskMode(item.state);

                    return (
                        <div key={item.id} className="glass-card hover:bg-slate-800/60 p-3 rounded-lg flex items-center justify-between group transition-all">
                            <div className="flex-1 cursor-pointer" onClick={() => onLoad(item.state)}>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded border ${taskMode === 'video_generation' ? 'bg-cyan-900/40 border-cyan-700 text-cyan-300' : 'bg-indigo-900/40 border-indigo-700 text-indigo-300'}`}>
                                        {taskMode === 'video_generation' ? 'Video' : 'Image'}
                                    </span>
                                    <span className="text-xs text-slate-500">{new Date(item.timestamp).toLocaleTimeString()}</span>
                                </div>
                                <p className="text-sm text-slate-200 font-medium truncate w-[200px]">{summary}</p>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={(e) => { e.stopPropagation(); onToggleFavorite(item); }}
                                    className="p-2 hover:bg-slate-700/50 rounded-full transition-colors"
                                >
                                    <StarIcon filled={item.isFavorite} />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="glass-panel rounded-xl overflow-hidden flex flex-col h-full border border-slate-700/50">
            <div className="flex border-b border-slate-700/50">
                <button
                    onClick={() => setActiveTab('history')}
                    className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${activeTab === 'history' ? 'bg-slate-800/50 text-indigo-400 border-b-2 border-indigo-500' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'}`}
                >
                    <TimeIcon /> 最近紀錄 ({history.length})
                </button>
                <button
                    onClick={() => setActiveTab('favorites')}
                    className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${activeTab === 'favorites' ? 'bg-slate-800/50 text-yellow-400 border-b-2 border-yellow-500' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'}`}
                >
                    <StarIcon filled={true} /> 我的最愛 ({favorites.length})
                </button>
            </div>

            <div className="p-4 flex-1 bg-slate-900/20">
                {activeTab === 'history' && (
                    <>
                        <div className="flex justify-end mb-2">
                            {history.length > 0 && (
                                <button onClick={onClearHistory} className="text-[10px] text-red-400 hover:text-red-300 flex items-center gap-1 px-2 py-1 rounded bg-red-900/20 hover:bg-red-900/40 transition-colors">
                                    <TrashIcon /> 清除紀錄
                                </button>
                            )}
                        </div>
                        {renderList(history, "尚無歷史紀錄")}
                    </>
                )}
                {activeTab === 'favorites' && renderList(favorites, "尚無收藏項目")}
            </div>
        </div>
    );
};
