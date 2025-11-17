import React, { useState, useCallback } from 'react';
import InputGroup from './InputGroup';

const UNITS = {
  bytes: { name: 'Bytes', multiplier: 1 },
  kb: { name: 'Kilobytes (KB)', multiplier: 1024 },
  mb: { name: 'Megabytes (MB)', multiplier: 1024 ** 2 },
  gb: { name: 'Gigabytes (GB)', multiplier: 1024 ** 3 },
  tb: { name: 'Terabytes (TB)', multiplier: 1024 ** 4 },
  pb: { name: 'Petabytes (PB)', multiplier: 1024 ** 5 },
};

type Unit = keyof typeof UNITS;

const initialValues = Object.keys(UNITS).reduce((acc, key) => ({ ...acc, [key]: '' }), {} as Record<Unit, string>);

const ByteConverter: React.FC = () => {
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
    
    // Regex para permitir números válidos, incluyendo parciales como "1."
    if (!/^-?\d*\.?\d*$/.test(inputValue)) {
      return; 
    }

    const numericValue = parseFloat(inputValue);

    if (isNaN(numericValue)) {
      // Es una entrada parcial como "." o "-", solo actualiza el campo pero no convierte
      setValues(prev => ({ ...prev, [unit]: inputValue }));
      return;
    }
    
    const bytes = numericValue * UNITS[unit].multiplier;

    const newValues = {} as Record<Unit, string>;
    for (const key in UNITS) {
      const u = key as Unit;
      newValues[u] = formatNumber(bytes / UNITS[u].multiplier);
    }
    
    // Conserva la entrada exacta del usuario en el campo que está editando
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

export default ByteConverter;