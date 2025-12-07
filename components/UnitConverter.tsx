
import React, { useState, useCallback, useEffect } from 'react';
import InputGroup from './InputGroup';
import { useHistory } from '../contexts/HistoryContext';
import { useUnsavedChanges } from '../hooks/useUnsavedChanges';
import { useLanguage } from '../contexts/LanguageContext';
import BMICalculator from './BMICalculator';

// Definición de tipos para las unidades
interface UnitDefinition {
  name: string; // Ahora contiene la clave de traducción
  multiplier: number;
}

interface CategoryDefinition {
  labelKey: string;
  baseUnit: string;
  units: Record<string, UnitDefinition>;
}

// Definición de Categorías y Unidades
const CATEGORIES: Record<string, CategoryDefinition> = {
    length: {
        labelKey: 'unit.category.length',
        baseUnit: 'm',
        units: {
            nm: { name: 'unit.length.nm', multiplier: 1e-9 }, 
            microns: { name: 'unit.length.microns', multiplier: 1e-6 },
            mm: { name: 'unit.length.mm', multiplier: 0.001 },
            cm: { name: 'unit.length.cm', multiplier: 0.01 },
            m: { name: 'unit.length.m', multiplier: 1 },
            km: { name: 'unit.length.km', multiplier: 1000 },
            in: { name: 'unit.length.in', multiplier: 0.0254 },
            ft: { name: 'unit.length.ft', multiplier: 0.3048 },
            yd: { name: 'unit.length.yd', multiplier: 0.9144 },
            mi: { name: 'unit.length.mi', multiplier: 1609.344 },
            nmi: { name: 'unit.length.nmi', multiplier: 1852 },
            px: { name: 'unit.length.px', multiplier: 0.0254 / 96 }, // 1 inch = 96px
        }
    },
    weight: {
        labelKey: 'unit.category.weight',
        baseUnit: 'g',
        units: {
            mg: { name: 'unit.weight.mg', multiplier: 0.001 },
            g: { name: 'unit.weight.g', multiplier: 1 },
            kg: { name: 'unit.weight.kg', multiplier: 1000 },
            t: { name: 'unit.weight.t', multiplier: 1e6 },
            oz: { name: 'unit.weight.oz', multiplier: 28.349523125 },
            lb: { name: 'unit.weight.lb', multiplier: 453.59237 },
            st: { name: 'unit.weight.st', multiplier: 6350.29318 },
        }
    },
    volume: {
        labelKey: 'unit.category.volume',
        baseUnit: 'ml',
        units: {
            ml: { name: 'unit.vol.ml', multiplier: 1 },
            cl: { name: 'unit.vol.cl', multiplier: 10 },
            l: { name: 'unit.vol.l', multiplier: 1000 },
            m3: { name: 'unit.vol.m3', multiplier: 1e6 },
            tsp: { name: 'unit.vol.tsp', multiplier: 4.92892 },
            tbsp: { name: 'unit.vol.tbsp', multiplier: 14.7868 },
            floz: { name: 'unit.vol.floz', multiplier: 29.5735 },
            cup: { name: 'unit.vol.cup', multiplier: 236.588 },
            pt: { name: 'unit.vol.pt', multiplier: 473.176 },
            qt: { name: 'unit.vol.qt', multiplier: 946.353 },
            gal: { name: 'unit.vol.gal', multiplier: 3785.41 },
        }
    },
    area: {
        labelKey: 'unit.category.area',
        baseUnit: 'm2',
        units: {
            cm2: { name: 'unit.area.cm2', multiplier: 0.0001 },
            m2: { name: 'unit.area.m2', multiplier: 1 },
            ha: { name: 'unit.area.ha', multiplier: 10000 },
            km2: { name: 'unit.area.km2', multiplier: 1e6 },
            sqin: { name: 'unit.area.sqin', multiplier: 0.00064516 },
            sqft: { name: 'unit.area.sqft', multiplier: 0.092903 },
            ac: { name: 'unit.area.ac', multiplier: 4046.86 },
            sqmi: { name: 'unit.area.sqmi', multiplier: 2.59e6 },
        }
    },
    speed: {
        labelKey: 'unit.category.speed',
        baseUnit: 'm/s',
        units: {
            mps: { name: 'unit.speed.mps', multiplier: 1 },
            kph: { name: 'unit.speed.kph', multiplier: 0.277777778 },
            mph: { name: 'unit.speed.mph', multiplier: 0.44704 },
            kn: { name: 'unit.speed.kn', multiplier: 0.514444444 },
            fps: { name: 'unit.speed.fps', multiplier: 0.3048 },
            mach: { name: 'unit.speed.mach', multiplier: 340.29 },
            c: { name: 'unit.speed.c', multiplier: 299792458 }
        }
    },
    time: {
        labelKey: 'unit.category.time',
        baseUnit: 's',
        units: {
            ns: { name: 'unit.time.ns', multiplier: 1e-9 },
            microns: { name: 'unit.time.us', multiplier: 1e-6 },
            ms: { name: 'unit.time.ms', multiplier: 0.001 },
            s: { name: 'unit.time.s', multiplier: 1 },
            min: { name: 'unit.time.min', multiplier: 60 },
            h: { name: 'unit.time.h', multiplier: 3600 },
            d: { name: 'unit.time.d', multiplier: 86400 },
            wk: { name: 'unit.time.wk', multiplier: 604800 },
            mo: { name: 'unit.time.mo', multiplier: 2.628e6 }, 
            yr: { name: 'unit.time.yr', multiplier: 3.154e7 }, 
            dec: { name: 'unit.time.dec', multiplier: 3.154e8 },
            cen: { name: 'unit.time.cen', multiplier: 3.154e9 },
        }
    },
    digital: {
        labelKey: 'unit.category.digital',
        baseUnit: 'B',
        units: {
            bit: { name: 'unit.dig.bit', multiplier: 0.125 },
            byte: { name: 'unit.dig.byte', multiplier: 1 },
            kb: { name: 'unit.dig.kb', multiplier: 1024 },
            mb: { name: 'unit.dig.mb', multiplier: 1024 ** 2 },
            gb: { name: 'unit.dig.gb', multiplier: 1024 ** 3 },
            tb: { name: 'unit.dig.tb', multiplier: 1024 ** 4 },
            pb: { name: 'unit.dig.pb', multiplier: 1024 ** 5 },
            eb: { name: 'unit.dig.eb', multiplier: 1024 ** 6 },
        }
    }
};

export type CategoryKey = keyof typeof CATEGORIES | 'bmi';

interface UnitConverterProps {
    initialCategory?: CategoryKey;
}

const UnitConverter: React.FC<UnitConverterProps> = ({ initialCategory = 'length' }) => {
    const [activeCategory, setActiveCategory] = useState<CategoryKey>(initialCategory);
    const [values, setValues] = useState<Record<string, string>>({});
    const { addToHistory } = useHistory();
    const { t } = useLanguage();

    // Actualizar categoría si la prop cambia (navegación desde el menú)
    useEffect(() => {
        if (initialCategory) {
            setActiveCategory(initialCategory);
        }
    }, [initialCategory]);

    // Protección contra pérdida de datos: Activa si hay algún valor ingresado (solo para conversor estándar)
    useUnsavedChanges(activeCategory !== 'bmi' && Object.keys(values).length > 0);

    // Resetear valores al cambiar de categoría
    useEffect(() => {
        setValues({});
    }, [activeCategory]);

    // Helpers para el conversor estándar
    const currentUnits = activeCategory !== 'bmi' ? CATEGORIES[activeCategory].units : {};

    const formatNumber = (num: number): string => {
        if (num === 0) return '0';
        if (!isFinite(num)) return ''; 
        
        if (Math.abs(num) < 1e-6 || Math.abs(num) > 1e9) {
             return num.toExponential(6).replace(/\.?0+e/, 'e');
        }
        return parseFloat(num.toPrecision(10)).toString();
    };

    const handleValueChange = useCallback((unitKey: string, e: React.ChangeEvent<HTMLInputElement>) => {
        if (activeCategory === 'bmi') return;
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

        const units = CATEGORIES[activeCategory as keyof typeof CATEGORIES].units;
        const baseValue = numericValue * units[unitKey].multiplier;
        const newValues: Record<string, string> = {};

        Object.entries(units).forEach(([key, data]) => {
            const unitDef = data as UnitDefinition;
            if (key === unitKey) {
                newValues[key] = inputValue; 
            } else {
                const convertedValue = baseValue / unitDef.multiplier;
                newValues[key] = formatNumber(convertedValue);
            }
        });

        setValues(newValues);

    }, [activeCategory]);

    const clearAll = () => setValues({});

    const saveToHistory = () => {
        if (activeCategory === 'bmi') return; // BMI tiene su propio historial
        const nonEmptyEntries = Object.entries(values).filter(([_, val]) => val && (val as string).trim() !== '');
        if (nonEmptyEntries.length === 0) return;

        const units = CATEGORIES[activeCategory as keyof typeof CATEGORIES].units;
        const firstEntry = nonEmptyEntries[0];
        // Usar t() para traducir el nombre de la unidad al guardar en historial
        const inputStr = `${firstEntry[1]} ${t(units[firstEntry[0]].name)}`;
        
        const outputStr = nonEmptyEntries.slice(1, 4).map(([key, val]) => 
            `${val} ${t(units[key].name)}`
        ).join(', ') + (nonEmptyEntries.length > 4 ? '...' : '');

        addToHistory({
            tool: t('menu.unitConverter'),
            details: t(CATEGORIES[activeCategory as keyof typeof CATEGORIES].labelKey),
            input: inputStr,
            output: outputStr || '...'
        });
    };

    return (
        <div className="space-y-6">
            {/* Category Selector */}
            <div className="flex flex-wrap gap-2 bg-slate-100 dark:bg-slate-800/50 p-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
                {(Object.entries(CATEGORIES) as [CategoryKey, CategoryDefinition][]).map(([key, data]) => (
                    <button
                        key={key}
                        onClick={() => setActiveCategory(key)}
                        className={`flex-grow sm:flex-grow-0 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                            activeCategory === key
                                ? 'bg-white dark:bg-slate-700 text-accent shadow-sm ring-1 ring-black/5 dark:ring-white/10'
                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
                        }`}
                    >
                        {t(data.labelKey)}
                    </button>
                ))}
                
                {/* Botón especial para BMI */}
                <button
                    onClick={() => setActiveCategory('bmi')}
                    className={`flex-grow sm:flex-grow-0 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                        activeCategory === 'bmi'
                            ? 'bg-white dark:bg-slate-700 text-accent shadow-sm ring-1 ring-black/5 dark:ring-white/10'
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
                    }`}
                >
                    {t('unit.category.bmi')}
                </button>
            </div>

            {/* Content Area */}
            {activeCategory === 'bmi' ? (
                <div className="pt-2 animate-fadeIn">
                     <BMICalculator />
                </div>
            ) : (
                <div className="animate-fadeIn">
                    <div className="relative flex items-center py-2">
                        <div className="flex-grow border-t border-slate-300 dark:border-slate-700"></div>
                        <span className="flex-shrink mx-4 text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-wider">
                            {t('unit.section.conversion')} {t(CATEGORIES[activeCategory as keyof typeof CATEGORIES].labelKey)}
                        </span>
                        <div className="flex-grow border-t border-slate-300 dark:border-slate-700"></div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-6 mt-6">
                        {Object.entries(currentUnits).map(([key, data]) => (
                            <InputGroup
                                key={key}
                                id={`${activeCategory}-${key}`}
                                label={t((data as UnitDefinition).name)}
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
                            className="bg-accent hover:opacity-90 text-white font-semibold py-2 px-6 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {t('action.save')}
                        </button>
                        <button
                            onClick={clearAll}
                            className="bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold py-2 px-6 rounded-md transition-colors duration-200"
                        >
                            {t('action.clear')}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UnitConverter;
