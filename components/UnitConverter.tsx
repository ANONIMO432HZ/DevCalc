
import React, { useState, useCallback, useEffect } from 'react';
import InputGroup from './InputGroup';
import { useHistory } from '../contexts/HistoryContext';

// Definición de tipos para las unidades
interface UnitDefinition {
  name: string;
  multiplier: number;
}

interface CategoryDefinition {
  name: string;
  baseUnit: string;
  units: Record<string, UnitDefinition>;
}

// Definición de Categorías y Unidades
const CATEGORIES: Record<string, CategoryDefinition> = {
    length: {
        name: 'Longitud',
        baseUnit: 'm',
        units: {
            nm: { name: 'Nanómetros', multiplier: 1e-9 },
            microns: { name: 'Micrómetros', multiplier: 1e-6 },
            mm: { name: 'Milímetros', multiplier: 0.001 },
            cm: { name: 'Centímetros', multiplier: 0.01 },
            m: { name: 'Metros', multiplier: 1 },
            km: { name: 'Kilómetros', multiplier: 1000 },
            in: { name: 'Pulgadas', multiplier: 0.0254 },
            ft: { name: 'Pies', multiplier: 0.3048 },
            yd: { name: 'Yardas', multiplier: 0.9144 },
            mi: { name: 'Millas', multiplier: 1609.344 },
            nmi: { name: 'Millas Náuticas', multiplier: 1852 },
        }
    },
    weight: {
        name: 'Masa / Peso',
        baseUnit: 'g',
        units: {
            mg: { name: 'Miligramos', multiplier: 0.001 },
            g: { name: 'Gramos', multiplier: 1 },
            kg: { name: 'Kilogramos', multiplier: 1000 },
            t: { name: 'Toneladas Métricas', multiplier: 1e6 },
            oz: { name: 'Onzas', multiplier: 28.349523125 },
            lb: { name: 'Libras', multiplier: 453.59237 },
            st: { name: 'Stones', multiplier: 6350.29318 },
        }
    },
    volume: {
        name: 'Volumen',
        baseUnit: 'ml',
        units: {
            ml: { name: 'Mililitros', multiplier: 1 },
            cl: { name: 'Centilitros', multiplier: 10 },
            l: { name: 'Litros', multiplier: 1000 },
            m3: { name: 'Metros Cúbicos', multiplier: 1e6 },
            tsp: { name: 'Cucharaditas (US)', multiplier: 4.92892 },
            tbsp: { name: 'Cucharadas (US)', multiplier: 14.7868 },
            floz: { name: 'Onzas Líquidas (US)', multiplier: 29.5735 },
            cup: { name: 'Tazas (US)', multiplier: 236.588 },
            pt: { name: 'Pintas (US)', multiplier: 473.176 },
            qt: { name: 'Cuartos (US)', multiplier: 946.353 },
            gal: { name: 'Galones (US)', multiplier: 3785.41 },
        }
    },
    area: {
        name: 'Área',
        baseUnit: 'm2',
        units: {
            cm2: { name: 'Centímetros Cuadrados', multiplier: 0.0001 },
            m2: { name: 'Metros Cuadrados', multiplier: 1 },
            ha: { name: 'Hectáreas', multiplier: 10000 },
            km2: { name: 'Kilómetros Cuadrados', multiplier: 1e6 },
            sqin: { name: 'Pulgadas Cuadradas', multiplier: 0.00064516 },
            sqft: { name: 'Pies Cuadrados', multiplier: 0.092903 },
            ac: { name: 'Acres', multiplier: 4046.86 },
            sqmi: { name: 'Millas Cuadradas', multiplier: 2.59e6 },
        }
    },
    speed: {
        name: 'Velocidad',
        baseUnit: 'm/s',
        units: {
            mps: { name: 'Metros por segundo (m/s)', multiplier: 1 },
            kph: { name: 'Kilómetros por hora (km/h)', multiplier: 0.277777778 },
            mph: { name: 'Millas por hora (mph)', multiplier: 0.44704 },
            kn: { name: 'Nudos (kn)', multiplier: 0.514444444 },
            fps: { name: 'Pies por segundo (ft/s)', multiplier: 0.3048 },
            mach: { name: 'Mach (Estándar)', multiplier: 340.29 },
            c: { name: 'Velocidad de la luz', multiplier: 299792458 }
        }
    },
    time: {
        name: 'Tiempo',
        baseUnit: 's',
        units: {
            ns: { name: 'Nanosegundos', multiplier: 1e-9 },
            microns: { name: 'Microsegundos', multiplier: 1e-6 },
            ms: { name: 'Milisegundos', multiplier: 0.001 },
            s: { name: 'Segundos', multiplier: 1 },
            min: { name: 'Minutos', multiplier: 60 },
            h: { name: 'Horas', multiplier: 3600 },
            d: { name: 'Días', multiplier: 86400 },
            wk: { name: 'Semanas', multiplier: 604800 },
            mo: { name: 'Meses (promedio)', multiplier: 2.628e6 }, 
            yr: { name: 'Años (promedio)', multiplier: 3.154e7 }, 
            dec: { name: 'Décadas', multiplier: 3.154e8 },
            cen: { name: 'Siglos', multiplier: 3.154e9 },
        }
    }
};

type CategoryKey = keyof typeof CATEGORIES;

const UnitConverter: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState<CategoryKey>('length');
    const [values, setValues] = useState<Record<string, string>>({});
    const { addToHistory } = useHistory();

    useEffect(() => {
        setValues({});
    }, [activeCategory]);

    const currentUnits = CATEGORIES[activeCategory].units;

    const formatNumber = (num: number): string => {
        if (num === 0) return '0';
        if (!isFinite(num)) return ''; 
        
        if (Math.abs(num) < 1e-6 || Math.abs(num) > 1e9) {
             return num.toExponential(6).replace(/\.?0+e/, 'e');
        }
        return parseFloat(num.toPrecision(10)).toString();
    };

    const handleValueChange = useCallback((unitKey: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;

        if (inputValue.trim() === '') {
            setValues({});
            return;
        }

        if (!/^-?\d*\.?\d*(e-?\d*)?$/.test(inputValue)) {
            return; 
        }

        const numericValue = parseFloat(inputValue);

        if (isNaN(numericValue)) {
            setValues(prev => ({ ...prev, [unitKey]: inputValue }));
            return;
        }

        const baseValue = numericValue * currentUnits[unitKey].multiplier;
        const newValues: Record<string, string> = {};

        Object.entries(currentUnits).forEach(([key, data]) => {
            const unitDef = data as UnitDefinition;
            if (key === unitKey) {
                newValues[key] = inputValue; 
            } else {
                const convertedValue = baseValue / unitDef.multiplier;
                newValues[key] = formatNumber(convertedValue);
            }
        });

        setValues(newValues);

    }, [currentUnits]);

    const clearAll = () => setValues({});

    const saveToHistory = () => {
        const nonEmptyEntries = Object.entries(values).filter(([_, val]) => val && val.trim() !== '');
        if (nonEmptyEntries.length === 0) return;

        // Usamos el primer valor como "input" representativo y mostramos hasta 3 resultados en "output"
        const firstEntry = nonEmptyEntries[0];
        const inputStr = `${firstEntry[1]} ${currentUnits[firstEntry[0]].name}`;
        
        const outputStr = nonEmptyEntries.slice(1, 4).map(([key, val]) => 
            `${val} ${currentUnits[key].name}`
        ).join(', ') + (nonEmptyEntries.length > 4 ? '...' : '');

        addToHistory({
            tool: 'Conversor Universal',
            details: CATEGORIES[activeCategory].name,
            input: inputStr,
            output: outputStr || 'Ver detalles...'
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap gap-2 bg-slate-100 dark:bg-slate-800/50 p-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
                {(Object.entries(CATEGORIES) as [CategoryKey, CategoryDefinition][]).map(([key, data]) => (
                    <button
                        key={key}
                        onClick={() => setActiveCategory(key)}
                        className={`flex-grow sm:flex-grow-0 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                            activeCategory === key
                                ? 'bg-white dark:bg-slate-700 text-lime-600 dark:text-lime-400 shadow-sm ring-1 ring-black/5 dark:ring-white/10'
                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
                        }`}
                    >
                        {data.name}
                    </button>
                ))}
            </div>

            <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-slate-300 dark:border-slate-700"></div>
                <span className="flex-shrink mx-4 text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-wider">
                    Conversión de {CATEGORIES[activeCategory].name}
                </span>
                <div className="flex-grow border-t border-slate-300 dark:border-slate-700"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-6">
                {Object.entries(currentUnits).map(([key, data]) => (
                    <InputGroup
                        key={key}
                        id={`${activeCategory}-${key}`}
                        label={(data as UnitDefinition).name}
                        value={values[key] || ''}
                        onChange={(e) => handleValueChange(key, e)}
                        placeholder="0"
                    />
                ))}
            </div>

            <div className="mt-8 text-right border-t border-slate-100 dark:border-slate-800 pt-4 flex justify-end gap-3">
                <button
                    onClick={saveToHistory}
                    disabled={Object.keys(values).length === 0}
                    className="bg-lime-500 hover:bg-lime-600 dark:bg-lime-600 dark:hover:bg-lime-700 text-white font-semibold py-2 px-6 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Guardar
                </button>
                <button
                    onClick={clearAll}
                    className="bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold py-2 px-6 rounded-md transition-colors duration-200"
                >
                    Limpiar
                </button>
            </div>
        </div>
    );
};

export default UnitConverter;
