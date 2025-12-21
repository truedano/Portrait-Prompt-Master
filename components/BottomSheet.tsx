import React, { useEffect, useState } from 'react';

interface BottomSheetProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({ isOpen, onClose, title, children }) => {
    const [mounted, setMounted] = useState(false);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setMounted(true);
            // Disable body scroll when open
            document.body.style.overflow = 'hidden';
            setTimeout(() => setVisible(true), 10);
        } else {
            setVisible(false);
            const timer = setTimeout(() => {
                setMounted(false);
                document.body.style.overflow = '';
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!mounted) return null;

    return (
        <div className={`fixed inset-0 z-[100] flex items-end justify-center transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}>
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Sheet Content */}
            <div
                className={`relative w-full max-w-2xl bg-slate-900 border-t border-slate-700/50 rounded-t-3xl shadow-2xl transition-transform duration-300 transform max-h-[85vh] flex flex-col ${visible ? 'translate-y-0' : 'translate-y-full'}`}
            >
                {/* Handle bar */}
                <div className="flex justify-center p-3 cursor-pointer" onClick={onClose}>
                    <div className="w-12 h-1.5 bg-slate-700 rounded-full opacity-50 hover:opacity-100 transition-opacity" />
                </div>

                <div className="px-6 py-2 border-b border-slate-800 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-slate-100">{title}</h3>
                    <button
                        onClick={onClose}
                        className="p-2 -mr-2 text-slate-400 hover:text-white transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="M6 6l12 12" /></svg>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 pb-12 custom-scrollbar">
                    {children}
                </div>
            </div>
        </div>
    );
};
