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
    <div className="flex border-b border-slate-200 dark:border-slate-700 px-2 sm:px-4 overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex-shrink-0 px-4 py-3 sm:px-6 text-sm sm:text-base font-medium transition-colors duration-200 focus:outline-none ${
            activeTab === tab.id
              ? 'border-b-2 border-lime-500 dark:border-lime-400 text-lime-500 dark:text-lime-400'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default Tabs;