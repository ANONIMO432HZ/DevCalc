import React, { useState, useCallback } from 'react';
import InputGroup from './InputGroup';

const UNITS = {
  nanoseconds:  { name: 'Nanosegundos', multiplier: 1 },
  microseconds: { name: 'Microsegundos', multiplier: 1e3 },
  milliseconds: { name: 'Milisegundos', multiplier: 1e6 },
  seconds:      { name: 'Segundos', multiplier: 1e9 },
  minutes:      { name: 'Minutos', multiplier: 6e10 },
  hours:        { name: 'Horas', multiplier: 3.6e12 },
  days:         { name: 'Días', multiplier: 8.64e13 },
  weeks:        { name: 'Semanas', multiplier: 6.048e14 },
  months:       { name: 'Meses (promedio)', multiplier: 2.6298e15 },
  years:        { name: 'Años (promedio)', multiplier: 3.15576e16 },
  decades:      { name: 'Décadas', multiplier: 3.15576e17 },
  centuries:    { name: 'Siglos', multiplier: 3.15576e18 },
};

type Unit = keyof typeof UNITS;

const initialValues = Object.keys(UNITS).reduce((acc, key) => ({ ...acc, [key]: '' }), {} as Record<Unit, string>);

const TimeConverter: React.FC = () => {
  const [values, setValues] = useState(initialValues);

  const formatNumber = (num: number): string => {
    if (num === 0) return '0';
    // Utiliza toPrecision para manejar números grandes y pequeños, luego elimina los ceros finales de la parte decimal
    return parseFloat(num.toPrecision(15)).toString();
  };

  const handleValueChange = useCallback((unit: Unit, e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    if (inputValue.trim() === '') {
      setValues(initialValues);
      return;
    }
    
    if (!/^-?\d*\.?\d*$/.test(inputValue)) {
      return; 
    }

    const numericValue = parseFloat(inputValue);

    if (isNaN(numericValue)) {
      setValues(prev => ({ ...prev, [unit]: inputValue }));
      return;
    }
    
    const nanoseconds = numericValue * UNITS[unit].multiplier;

    const newValues = {} as Record<Unit, string>;
    for (const key in UNITS) {
      const u = key as Unit;
      newValues[u] = formatNumber(nanoseconds / UNITS[u].multiplier);
    }
    
    newValues[unit] = inputValue;

    setValues(newValues);
  }, []);
  
  const clearAll = useCallback(() => {
    setValues(initialValues);
  }, []);

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
        {Object.entries(UNITS).map(([key, { name }]) => (
          <InputGroup
            key={key}
            id={key}
            label={name}
            value={values[key as Unit]}
            onChange={(e) => handleValueChange(key as Unit, e)}
            placeholder="0"
          />
        ))}
      </div>
      <div className="mt-8 text-right">
        <button 
          onClick={clearAll}
          className="bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold py-2 px-4 rounded-md transition-colors duration-200"
        >
          Limpiar
        </button>
      </div>
    </div>
  );
};

export default TimeConverter;