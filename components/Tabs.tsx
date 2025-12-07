
import React from 'react';
import { CalculatorType } from '../types';

interface Tab {
  id: CalculatorType;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: CalculatorType;
  onTabChange: (tab: CalculatorType) => void;
}

const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="px-2 sm:px-4 pt-4">
      <div className="bg-slate-100 dark:bg-slate-800/50 p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center overflow-x-auto scrollbar-custom">
        <div className="flex flex-nowrap gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-shrink-0 px-4 py-2 sm:px-5 text-sm sm:text-base font-bold rounded-md transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-accent/50 focus:ring-offset-2 dark:focus:ring-offset-slate-800 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-slate-700 text-accent shadow-sm ring-1 ring-black/5 dark:ring-white/10'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tabs;
