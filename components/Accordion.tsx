import React, { useState } from 'react';

interface AccordionProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export const Accordion: React.FC<AccordionProps> = ({ title, icon, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-slate-900/40 border border-slate-800 rounded-xl overflow-hidden mb-4 transition-all duration-300 hover:border-slate-700">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-slate-900/60 hover:bg-slate-800/80 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          {icon && <span className="text-indigo-400">{icon}</span>}
          <span className="font-semibold text-slate-200 tracking-wide text-sm md:text-base">{title}</span>
        </div>
        <span className={`text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
        </span>
      </button>

      <div
        className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-[9000px] opacity-100' : 'max-h-0 opacity-0'
          }`}
      >
        <div className="p-4 border-t border-slate-800/50 bg-slate-950/20">
          {children}
        </div>
      </div>
    </div>
  );
};