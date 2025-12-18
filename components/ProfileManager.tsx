import React, { useState } from 'react';
import { PortraitState } from '../types';

export interface SavedProfile {
    id: string;
    name: string;
    createdAt: number;
    state: PortraitState;
}

interface ProfileManagerProps {
    currentState: PortraitState;
    onLoad: (state: PortraitState) => void;
    onClose: () => void;
}

const STORAGE_KEY = 'portrait_prompt_master_profiles';

export const ProfileManager: React.FC<ProfileManagerProps> = ({ currentState, onLoad, onClose }) => {
    // Load initial profiles from local storage
    const [profiles, setProfiles] = useState<SavedProfile[]>(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.error('Failed to load profiles', e);
            return [];
        }
    });

    const [newProfileName, setNewProfileName] = useState('');

    const handleSave = () => {
        if (!newProfileName.trim()) return;

        const newProfile: SavedProfile = {
            id: Date.now().toString(),
            name: newProfileName.trim(),
            createdAt: Date.now(),
            state: currentState
        };

        const newProfiles = [newProfile, ...profiles];
        setProfiles(newProfiles);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newProfiles));
        setNewProfileName('');
    };

    const handleDelete = (id: string) => {
        if (!confirm('確定要刪除這個設定檔嗎？')) return;
        const newProfiles = profiles.filter(p => p.id !== id);
        setProfiles(newProfiles);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newProfiles));
    };

    const handleLoad = (profile: SavedProfile) => {
        if (confirm(`確定要載入 "${profile.name}" 嗎？目前的設定將會被覆蓋。`)) {
            onLoad(profile.state);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl flex flex-col max-h-[80vh]">

                {/* Header */}
                <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900 rounded-t-2xl">
                    <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                        💾 設定檔管理 (Profiles)
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1.5 hover:bg-slate-800 rounded-full text-slate-400 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 18 18" /></svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 overflow-y-auto space-y-6">

                    {/* Save New */}
                    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">
                            儲存當前設定
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newProfileName}
                                onChange={(e) => setNewProfileName(e.target.value)}
                                placeholder="輸入設定檔名稱..."
                                className="flex-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-200 focus:ring-1 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                            />
                            <button
                                onClick={handleSave}
                                disabled={!newProfileName.trim()}
                                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors shadow-lg shadow-purple-900/30"
                            >
                                儲存
                            </button>
                        </div>
                    </div>

                    {/* List */}
                    <div>
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 block flex items-center gap-2">
                            已儲存的設定檔 ({profiles.length})
                        </label>

                        {profiles.length === 0 ? (
                            <div className="text-center py-8 text-slate-600 text-sm italic border border-dashed border-slate-800 rounded-xl">
                                尚無儲存的設定檔
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {profiles.map(p => (
                                    <div key={p.id} className="group flex items-center justify-between p-3 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 rounded-xl transition-all">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-slate-200">{p.name}</span>
                                            <span className="text-[10px] text-slate-500">
                                                {new Date(p.createdAt).toLocaleDateString()} {new Date(p.createdAt).toLocaleTimeString()}
                                            </span>
                                        </div>
                                        <div className="flex gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleLoad(p)}
                                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium rounded-lg"
                                            >
                                                載入
                                            </button>
                                            <button
                                                onClick={() => handleDelete(p.id)}
                                                className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-colors"
                                                title="刪除"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
