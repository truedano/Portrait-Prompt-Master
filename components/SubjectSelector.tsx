import React from 'react';
import { SubjectType } from '../types';

interface SubjectSelectorProps {
    selected: SubjectType;
    onSelect: (type: SubjectType) => void;
}

export const SubjectSelector: React.FC<SubjectSelectorProps> = ({ selected, onSelect }) => {

    // Icons
    const UserIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
    );

    const PawIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5c.67 0 1.35.09 2 .26 1.78-2 5.03-2.84 6.42-2.26 1.4.58-.42 7-.42 7 .57 1.07 1 2.24 1 3.44C21 17.9 16.97 21 12 21s-9-3.1-9-7.56c0-1.25.5-2.4 1-3.44 0 0-1.89-6.42-.5-7 1.39-.58 4.72.23 6.5 2.23A9.04 9.04 0 0 1 12 5Z" /><path d="M8 14v.5" /><path d="M16 14v.5" /><path d="M11.25 16.25h1.5" /></svg>
    );

    const CarIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" /><circle cx="7" cy="17" r="2" /><path d="M9 17h6" /><circle cx="17" cy="17" r="2" /></svg>
    );

    const MountainIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m8 3 4 8 5-5 5 15H2L8 3z" /></svg>
    );

    const Button = ({ type, label, icon }: { type: SubjectType, label: string, icon: React.ReactNode }) => (
        <button
            onClick={() => onSelect(type)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg transition-all text-sm font-medium border ${selected === type
                ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-lg shadow-indigo-500/10'
                : 'bg-slate-800 border-transparent text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                }`}
        >
            {icon}
            {label}
        </button>
    );

    return (
        <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4 mb-6">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">主體類型 (Subject Type)</h2>
            <div className="flex gap-2">
                <Button type="human" label="人類" icon={<UserIcon />} />
                <Button type="animal" label="動物" icon={<PawIcon />} />
                <Button type="vehicle" label="車輛" icon={<CarIcon />} />
                <Button type="scenery" label="風景" icon={<MountainIcon />} />
                <Button type="infographic" label="圖表" icon={
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18" /><path d="M18 17V9" /><path d="M13 17V5" /><path d="M8 17v-3" /></svg>
                } />
            </div>
        </div>
    );
};
