
import React, { useState, useCallback } from 'react';
import { CalculatorType } from './types';
import Header from './components/Header';
import Tabs from './components/Tabs';
import Welcome from './components/Welcome';
import NumberBaseConverter from './components/NumberBaseConverter';
import BitwiseCalculator from './components/BitwiseCalculator';
import JSONConverter from './components/JSONConverter';
import URLEncoder from './components/URLEncoder';
import HashGenerator from './components/HashGenerator';
import UUIDGenerator from './components/UUIDGenerator';
import UnixTimestampConverter from './components/UnixTimestampConverter';
import UnitConverter from './components/UnitConverter';
import PaletteGenerator from './components/PaletteGenerator';
import Footer from './components/Footer';
import { HistoryProvider } from './contexts/HistoryContext';
import HistoryDrawer from './components/HistoryDrawer';

const App: React.FC = () => {
  const [activeCalculator, setActiveCalculator] = useState<CalculatorType>(CalculatorType.Welcome);

  const TABS = [
    { id: CalculatorType.Welcome, label: 'Inicio' },
    { id: CalculatorType.UnitConverter, label: 'Universal' },
    { id: CalculatorType.NumberBase, label: 'Bases' },
    { id: CalculatorType.BitwiseCalculator, label: 'Bitwise' },
    { id: CalculatorType.JSON, label: 'Datos' },
    { id: CalculatorType.HashGenerator, label: 'Hash' },
    { id: CalculatorType.PaletteGenerator, label: 'Paletas' },
    { id: CalculatorType.UUIDGenerator, label: 'UUID' },
    { id: CalculatorType.UnixTimestamp, label: 'Unix' },
    { id: CalculatorType.URLEncoder, label: 'URL' },
  ];

  const handleTabChange = useCallback((tab: CalculatorType) => {
    setActiveCalculator(tab);
  }, []);

  return (
    <HistoryProvider>
      <div className="flex flex-col min-h-screen font-sans">
        <Header />
        <HistoryDrawer />
        <main className="flex-grow w-full max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl overflow-hidden ring-1 ring-slate-200 dark:ring-slate-700">
            <Tabs tabs={TABS} activeTab={activeCalculator} onTabChange={handleTabChange} />
            <div className="p-6 md:p-8">
              {activeCalculator === CalculatorType.Welcome && <Welcome onNavigate={handleTabChange} />}
              {activeCalculator === CalculatorType.UnitConverter && <UnitConverter />}
              {activeCalculator === CalculatorType.NumberBase && <NumberBaseConverter />}
              {activeCalculator === CalculatorType.BitwiseCalculator && <BitwiseCalculator />}
              {activeCalculator === CalculatorType.JSON && <JSONConverter />}
              {activeCalculator === CalculatorType.HashGenerator && <HashGenerator />}
              {activeCalculator === CalculatorType.PaletteGenerator && <PaletteGenerator />}
              {activeCalculator === CalculatorType.UUIDGenerator && <UUIDGenerator />}
              {activeCalculator === CalculatorType.UnixTimestamp && <UnixTimestampConverter />}
              {activeCalculator === CalculatorType.URLEncoder && <URLEncoder />}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </HistoryProvider>
  );
};

export default App;
