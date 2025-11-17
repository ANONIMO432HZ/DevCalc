import React, { useState, useCallback } from 'react';
import { CalculatorType } from './types';
import Header from './components/Header';
import Tabs from './components/Tabs';
import Welcome from './components/Welcome';
import NumberBaseConverter from './components/NumberBaseConverter';
import JSONConverter from './components/JSONConverter';
import URLEncoder from './components/URLEncoder';
import HashGenerator from './components/HashGenerator';
import UUIDGenerator from './components/UUIDGenerator';
import UnixTimestampConverter from './components/UnixTimestampConverter';
import TimeConverter from './components/TimeConverter';
import Footer from './components/Footer';

const App: React.FC = () => {
  const [activeCalculator, setActiveCalculator] = useState<CalculatorType>(CalculatorType.Welcome);

  const TABS = [
    { id: CalculatorType.Welcome, label: 'Bienvenida' },
    { id: CalculatorType.NumberBase, label: 'Conversor de Bases' },
    { id: CalculatorType.TimeConverter, label: 'Conversor de Tiempo' },
    { id: CalculatorType.UnixTimestamp, label: 'Tiempo Unix' },
    { id: CalculatorType.URLEncoder, label: 'Codificador URL' },
    { id: CalculatorType.JSON, label: 'Formateador JSON' },
    { id: CalculatorType.HashGenerator, label: 'Generador de Hash' },
    { id: CalculatorType.UUIDGenerator, label: 'Generador UUID' },
  ];

  const handleTabChange = useCallback((tab: CalculatorType) => {
    setActiveCalculator(tab);
  }, []);

  return (
    <div className="flex flex-col min-h-screen font-sans">
      <Header />
      <main className="flex-grow w-full max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl overflow-hidden ring-1 ring-slate-200 dark:ring-slate-700">
          <Tabs tabs={TABS} activeTab={activeCalculator} onTabChange={handleTabChange} />
          <div className="p-6 md:p-8">
            {activeCalculator === CalculatorType.Welcome && <Welcome />}
            {activeCalculator === CalculatorType.NumberBase && <NumberBaseConverter />}
            {activeCalculator === CalculatorType.TimeConverter && <TimeConverter />}
            {activeCalculator === CalculatorType.UnixTimestamp && <UnixTimestampConverter />}
            {activeCalculator === CalculatorType.JSON && <JSONConverter />}
            {activeCalculator === CalculatorType.URLEncoder && <URLEncoder />}
            {activeCalculator === CalculatorType.HashGenerator && <HashGenerator />}
            {activeCalculator === CalculatorType.UUIDGenerator && <UUIDGenerator />}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;