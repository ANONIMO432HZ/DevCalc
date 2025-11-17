import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const CodeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
);

const SunIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);

const MoonIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
);


const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="relative py-6 text-center">
        <div className="inline-flex items-center gap-3">
            <CodeIcon className="w-10 h-10 text-lime-500 dark:text-lime-400"/>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                Dev<span className="text-lime-500 dark:text-lime-400">Calc</span>
            </h1>
        </div>
      <p className="text-slate-500 dark:text-slate-400 mt-2">Calculadoras de Programación Rápidas y Modernas</p>
       <div className="absolute top-1/2 -translate-y-1/2 right-4 sm:right-6 lg:right-8">
            <button
                onClick={toggleTheme}
                className="p-2 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-50 dark:focus:ring-offset-slate-900 focus:ring-lime-500 transition-all"
                aria-label="Toggle theme"
            >
                {theme === 'light' ? <MoonIcon className="w-6 h-6" /> : <SunIcon className="w-6 h-6" />}
            </button>
        </div>
    </header>
  );
};

export default Header;