
import React, { useState, useEffect, useCallback } from 'react';
import InputGroup from './InputGroup';
import { useHistory } from '../contexts/HistoryContext';

type Operation = 'AND' | 'OR' | 'XOR' | 'NOT' | 'NAND' | 'NOR' | 'XNOR' | 'LSHIFT' | 'RSHIFT' | 'ZRSHIFT';

interface BitwiseState {
  a: number;
  b: number;
  result: number;
}

const OPERATIONS: { id: Operation; label: string; symbol: string; desc: string }[] = [
  { id: 'AND', label: 'AND', symbol: '&', desc: '1 si ambos bits son 1' },
  { id: 'OR', label: 'OR', symbol: '|', desc: '1 si al menos un bit es 1' },
  { id: 'XOR', label: 'XOR', symbol: '^', desc: '1 si los bits son diferentes' },
  { id: 'NOT', label: 'NOT', symbol: '~', desc: 'Invierte todos los bits (Unario)' },
  { id: 'NAND', label: 'NAND', symbol: '~&', desc: 'NOT AND: 0 solo si ambos son 1' },
  { id: 'NOR', label: 'NOR', symbol: '~|', desc: 'NOT OR: 1 solo si ambos son 0' },
  { id: 'XNOR', label: 'XNOR', symbol: '~^', desc: '1 si los bits son iguales' },
  { id: 'LSHIFT', label: '<<', symbol: '<<', desc: 'Desplaza bits a la izquierda' },
  { id: 'RSHIFT', label: '>>', symbol: '>>', desc: 'Desplaza bits a la derecha (Signo)' },
  { id: 'ZRSHIFT', label: '>>>', symbol: '>>>', desc: 'Desplaza derecha con ceros' },
];

const BitwiseCalculator: React.FC = () => {
  const [inputA, setInputA] = useState<string>('0');
  const [inputB, setInputB] = useState<string>('0');
  const [selectedOp, setSelectedOp] = useState<Operation>('AND');
  const [calc, setCalc] = useState<BitwiseState>({ a: 0, b: 0, result: 0 });
  const { addToHistory } = useHistory();

  // Parsea entradas (soporta decimal, hex 0x, bin 0b)
  const parseValue = (val: string): number => {
    val = val.trim();
    if (!val) return 0;
    try {
      let num = Number(val);
      // Forzar tratamiento de 32 bits
      return num | 0; 
    } catch {
      return 0;
    }
  };

  const calculate = useCallback(() => {
    const valA = parseValue(inputA);
    const valB = parseValue(inputB);
    let res = 0;

    switch (selectedOp) {
      case 'AND': res = valA & valB; break;
      case 'OR': res = valA | valB; break;
      case 'XOR': res = valA ^ valB; break;
      case 'NOT': res = ~valA; break;
      case 'NAND': res = ~(valA & valB); break;
      case 'NOR': res = ~(valA | valB); break;
      case 'XNOR': res = ~(valA ^ valB); break;
      case 'LSHIFT': res = valA << valB; break;
      case 'RSHIFT': res = valA >> valB; break;
      case 'ZRSHIFT': res = valA >>> valB; break;
    }

    setCalc({ a: valA, b: valB, result: res });
  }, [inputA, inputB, selectedOp]);

  useEffect(() => {
    calculate();
  }, [calculate]);

  const toHexString = (num: number): string => {
    return '0x' + (num >>> 0).toString(16).toUpperCase().padStart(8, '0');
  };

  const isUnary = selectedOp === 'NOT';

  const renderBitRow = (label: string, num: number, highlightOne = false, colorClass = "text-slate-400") => {
    const binStr = (num >>> 0).toString(2).padStart(32, '0');
    const nibbles = binStr.match(/.{1,4}/g) || [];

    return (
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 py-1 font-mono text-sm sm:text-base">
            <span className="w-16 font-bold text-slate-500 dark:text-slate-400 text-right shrink-0">{label}</span>
            <div className="flex flex-wrap gap-x-2 sm:gap-x-3">
                {nibbles.map((nibble, i) => (
                    <div key={i} className="flex tracking-widest">
                        {nibble.split('').map((bit, j) => (
                            <span 
                                key={j} 
                                className={`${bit === '1' ? (highlightOne ? 'text-lime-600 dark:text-lime-400 font-bold' : 'text-slate-800 dark:text-slate-200') : 'text-slate-300 dark:text-slate-600'}`}
                            >
                                {bit}
                            </span>
                        ))}
                    </div>
                ))}
            </div>
            <span className={`ml-auto font-bold ${colorClass} hidden sm:block`}>
                 {num} <span className="text-xs font-normal opacity-70">(Dec)</span>
            </span>
        </div>
    );
  };

  const saveToHistory = () => {
      const opSymbol = OPERATIONS.find(o => o.id === selectedOp)?.symbol || selectedOp;
      const expression = isUnary ? `${opSymbol} ${calc.a}` : `${calc.a} ${opSymbol} ${calc.b}`;
      
      addToHistory({
          tool: 'Lógica Bitwise',
          details: `Operación: ${selectedOp}`,
          input: expression,
          output: `${calc.result} (Dec) | ${toHexString(calc.result)} (Hex)`
      });
  };

  return (
    <div className="space-y-8">
      
      {/* Panel de Control */}
      <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
        
        {/* Inputs */}
        <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-full md:w-1/3 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Operando A</label>
                    <input 
                        type="text" 
                        value={inputA}
                        onChange={(e) => setInputA(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md py-2 px-3 font-mono text-lg focus:ring-2 focus:ring-lime-500"
                        placeholder="Ej: 42, 0xFA, 0b101"
                    />
                    <div className="text-xs text-slate-400 mt-1 text-right font-mono">= {parseValue(inputA)}</div>
                </div>

                <div className={`transition-opacity duration-200 ${isUnary ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Operando B</label>
                    <input 
                        type="text" 
                        value={inputB}
                        onChange={(e) => setInputB(e.target.value)}
                        disabled={isUnary}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md py-2 px-3 font-mono text-lg focus:ring-2 focus:ring-lime-500 disabled:bg-slate-100 dark:disabled:bg-slate-800"
                         placeholder={selectedOp.includes('SHIFT') ? "Bits a desplazar" : "Ej: 15"}
                    />
                    <div className="text-xs text-slate-400 mt-1 text-right font-mono">= {parseValue(inputB)}</div>
                </div>
            </div>

            {/* Selector de Operación */}
            <div className="w-full md:w-2/3">
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-3">Operación</label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {OPERATIONS.map((op) => (
                        <button
                            key={op.id}
                            onClick={() => setSelectedOp(op.id)}
                            className={`group relative flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${
                                selectedOp === op.id
                                ? 'bg-lime-500 border-lime-500 text-white shadow-md'
                                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-lime-400 dark:hover:border-lime-500'
                            }`}
                        >
                            <span className="text-lg font-bold font-mono">{op.symbol}</span>
                            <span className="text-xs font-medium uppercase mt-1">{op.label}</span>

                            {/* Tooltip */}
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none w-32 text-center z-10">
                                {op.desc}
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-800"></div>
                            </div>
                        </button>
                    ))}
                </div>
                <div className="mt-4 flex justify-between items-center">
                    <p className="text-sm text-slate-500 dark:text-slate-400 italic bg-blue-50 dark:bg-slate-800/50 p-2 rounded border border-blue-100 dark:border-slate-700 flex-grow mr-4">
                        ℹ️ {OPERATIONS.find(op => op.id === selectedOp)?.desc}
                    </p>
                    <button onClick={saveToHistory} className="bg-lime-500 hover:bg-lime-600 text-white font-semibold py-2 px-4 rounded-md transition-colors">
                        Guardar
                    </button>
                </div>
            </div>
        </div>
      </div>

      {/* Visualizador de Bits */}
      <div className="bg-slate-900 text-slate-200 rounded-xl p-6 font-mono shadow-2xl overflow-x-auto border border-slate-700">
         <div className="min-w-[600px]">
            {/* Header con posiciones de bit (31 ... 0) */}
            <div className="flex ml-[4.5rem] gap-x-3 mb-2 text-[10px] text-slate-500">
                <span className="flex-1 text-left">31</span>
                <span className="flex-1 text-center">24</span>
                <span className="flex-1 text-center">16</span>
                <span className="flex-1 text-center">8</span>
                <span className="flex-1 text-right">0</span>
            </div>

            {renderBitRow("A", calc.a)}
            
            {!isUnary && (
                <div className="relative py-1">
                     <div className="absolute left-4 top-1/2 -translate-y-1/2 text-lime-500 font-bold text-xl">{OPERATIONS.find(o => o.id === selectedOp)?.symbol}</div>
                     {renderBitRow("B", calc.b)}
                </div>
            )}
            
            <div className="my-3 border-t border-slate-700 relative"></div>
            
            {renderBitRow("RES", calc.result, true, "text-lime-400")}
         </div>
      </div>

      {/* Resultados Finales */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <InputGroup id="res-dec" label="Decimal (con signo)" value={calc.result.toString()} onChange={() => {}} placeholder="" readOnly />
        <InputGroup id="res-hex" label="Hexadecimal" value={toHexString(calc.result)} onChange={() => {}} placeholder="" readOnly />
        <InputGroup id="res-bin" label="Binario (Raw)" value={(calc.result >>> 0).toString(2)} onChange={() => {}} placeholder="" readOnly />
      </div>

    </div>
  );
};

export default BitwiseCalculator;
