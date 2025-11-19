
import React, { useState, useCallback } from 'react';
import InputGroup from './InputGroup';
import TextareaGroup from './TextareaGroup';
import { useHistory } from '../contexts/HistoryContext';

// Tipos y constantes para el conversor de bytes
const BYTE_UNITS = {
  bits: { name: 'Bits', multiplier: 0.125 },
  bytes: { name: 'Bytes', multiplier: 1 },
  kb: { name: 'Kilobytes (KB)', multiplier: 1024 },
  mb: { name: 'Megabytes (MB)', multiplier: 1024 ** 2 },
  gb: { name: 'Gigabytes (GB)', multiplier: 1024 ** 3 },
  tb: { name: 'Terabytes (TB)', multiplier: 1024 ** 4 },
  pb: { name: 'Petabytes (PB)', multiplier: 1024 ** 5 },
  eb: { name: 'Exabytes (EB)', multiplier: 1024 ** 6 },
};

type ByteUnit = keyof typeof BYTE_UNITS;
const initialByteValues = Object.keys(BYTE_UNITS).reduce((acc, key) => ({ ...acc, [key]: '' }), {} as Record<ByteUnit, string>);


const NumberBaseConverter: React.FC = () => {
  const [text, setText] = useState('');
  const [base64Text, setBase64Text] = useState('');
  const [hexBytes, setHexBytes] = useState('');
  
  const [textError, setTextError] = useState<{ field: 'base64' | 'hex' | null; message: string | null }>({ field: null, message: null });
  const [numericError, setNumericError] = useState<{ field: 'decimal' | 'binary' | 'hex' | null; message: string | null }>({ field: null, message: null });
  
  const [decimal, setDecimal] = useState('');
  const [binary, setBinary] = useState('');
  const [hex, setHex] = useState('');
  const [ascii, setAscii] = useState('');

  const [byteValues, setByteValues] = useState(initialByteValues);
  const { addToHistory } = useHistory();

  const isTextMode = !!text || !!base64Text || !!hexBytes;
  
  const updateAllFromBytes = useCallback((bytes: Uint8Array | null, sourceField: 'text' | 'base64' | 'hex') => {
    setTextError({ field: null, message: null });
    if (!bytes || bytes.length === 0) {
      if (sourceField !== 'text') setText('');
      if (sourceField !== 'base64') setBase64Text('');
      if (sourceField !== 'hex') setHexBytes('');
      setDecimal('');
      setBinary('');
      setHex('');
      setAscii('');
      return;
    }

    // Actualizar campos de texto
    if (sourceField !== 'text') {
      try {
        const decodedString = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
        setText(decodedString);
      } catch (e) {
        setText('Error: Bytes no válidos para UTF-8');
      }
    }
    if (sourceField !== 'base64') {
      const base64String = btoa(String.fromCharCode(...bytes));
      setBase64Text(base64String);
    }
    if (sourceField !== 'hex') {
      const hexString = Array.from(bytes).map(b => b.toString(16).padStart(2, '0').toUpperCase()).join(' ');
      setHexBytes(hexString);
    }

    // Actualizar representaciones de bytes
    setDecimal(Array.from(bytes).map(b => b.toString(10)).join(' '));
    setBinary(Array.from(bytes).map(b => b.toString(2).padStart(8, '0')).join(' '));
    setHex(Array.from(bytes).map(b => b.toString(16).toUpperCase().padStart(2, '0')).join(' '));
    setAscii(Array.from(bytes).map(b => (b >= 32 && b < 127) ? String.fromCharCode(b) : '.').join(' '));
  }, []);

  const clearAllText = () => {
    setText('');
    setBase64Text('');
    setHexBytes('');
    setTextError({ field: null, message: null });
    updateAllFromBytes(null, 'text');
  };

  const clearAll = useCallback(() => {
    clearAllText();
    setDecimal('');
    setBinary('');
    setHex('');
    setAscii('');
    setNumericError({ field: null, message: null });
    setByteValues(initialByteValues);
  }, [updateAllFromBytes]);
  
  const handleTextChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setText(value);
    const bytes = value ? new TextEncoder().encode(value) : null;
    updateAllFromBytes(bytes, 'text');
  }, [updateAllFromBytes]);

  const handleBase64Change = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value.trim();
    setBase64Text(e.target.value);
    if (!value) {
      clearAllText();
      return;
    }
    try {
      // Basic validation before atob
      if (!/^[A-Za-z0-9+/]*=?=?$/.test(value) || value.length % 4 !== 0) {
        throw new Error("Invalid Base64 characters or padding");
      }
      const binaryString = atob(value);
      const bytes = new Uint8Array(binaryString.length).map((_, i) => binaryString.charCodeAt(i));
      updateAllFromBytes(bytes, 'base64');
    } catch (err) {
      setTextError({ field: 'base64', message: 'Cadena Base64 inválida. Compruebe los caracteres y el relleno.' });
    }
  }, [updateAllFromBytes]);

  const handleHexBytesChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value.replace(/\s+/g, '');
    setHexBytes(e.target.value);
    if (!value) {
      clearAllText();
      return;
    }
    if (value.length % 2 !== 0 || !/^[0-9a-fA-F]*$/.test(value)) {
      setTextError({ field: 'hex', message: 'Cadena Hex inválida. Debe tener una longitud par y contener solo 0-9, A-F.' });
      return;
    }
    try {
      const bytes = new Uint8Array(value.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
      updateAllFromBytes(bytes, 'hex');
    } catch (err) {
      setTextError({ field: 'hex', message: 'Error al procesar la cadena hexadecimal.' });
    }
  }, [updateAllFromBytes]);
  
  const handleNumericWrapper = (handler: (value: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isTextMode) clearAllText();
    setNumericError({ field: null, message: null });
    handler(e.target.value);
  };

  const handleDecimalChange = useCallback((value: string) => {
    const trimmedValue = value.trim();
    setDecimal(value);
    setAscii('');
    if (trimmedValue === '') {
      setBinary(''); setHex(''); return;
    }
    if (!/^\d+$/.test(trimmedValue)) {
      setNumericError({ field: 'decimal', message: 'Solo se admiten números (0-9).' });
      setBinary(''); setHex('');
      return;
    }
    try { const num = BigInt(trimmedValue); setBinary(num.toString(2)); setHex(num.toString(16).toUpperCase()); } catch (e) {
      setNumericError({ field: 'decimal', message: 'El número es demasiado grande.' });
    }
  }, []);

  const handleBinaryChange = useCallback((value: string) => {
    const trimmedValue = value.trim();
    setBinary(value);
    setAscii('');
    if (trimmedValue === '') {
      setDecimal(''); setHex(''); return;
    }
    if (!/^[01]+$/.test(trimmedValue)) {
      setNumericError({ field: 'binary', message: 'Solo se admiten números binarios (0-1).' });
      setDecimal(''); setHex('');
      return;
    }
    try { const num = BigInt(`0b${trimmedValue}`); setDecimal(num.toString(10)); setHex(num.toString(16).toUpperCase()); } catch (e) {
      setNumericError({ field: 'binary', message: 'El número es demasiado grande.' });
    }
  }, []);

  const handleHexChange = useCallback((value: string) => {
    const trimmedValue = value.trim();
    setHex(value);
    setAscii('');
    if (trimmedValue === '') {
      setDecimal(''); setBinary(''); return;
    }
    if (!/^[0-9a-fA-F]+$/.test(trimmedValue)) {
      setNumericError({ field: 'hex', message: 'Solo se admiten caracteres hexadecimales (0-9, A-F).' });
      setDecimal(''); setBinary('');
      return;
    }
    try { const num = BigInt(`0x${trimmedValue}`); setDecimal(num.toString(10)); setBinary(num.toString(2)); } catch (e) {
      setNumericError({ field: 'hex', message: 'El número es demasiado grande.' });
    }
  }, []);

  const formatNumber = (num: number): string => {
    if (num === 0) return '0';
    return parseFloat(num.toPrecision(15)).toString();
  };

  const handleByteValueChange = useCallback((unit: ByteUnit, e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (inputValue.trim() === '') { setByteValues(initialByteValues); return; }
    if (!/^-?\d*\.?\d*$/.test(inputValue)) return;
    const numericValue = parseFloat(inputValue);
    if (isNaN(numericValue)) { setByteValues(prev => ({ ...prev, [unit]: inputValue })); return; }
    const bytes = numericValue * BYTE_UNITS[unit].multiplier;
    const newValues = {} as Record<ByteUnit, string>;
    for (const key in BYTE_UNITS) {
      const u = key as ByteUnit;
      newValues[u] = formatNumber(bytes / BYTE_UNITS[u].multiplier);
    }
    newValues[unit] = inputValue;
    setByteValues(newValues);
  }, []);

  const saveToHistory = () => {
    if (isTextMode) {
        addToHistory({
            tool: 'Conversor de Bases (Texto)',
            details: 'Conversión de Texto/Bytes',
            input: text || base64Text.substring(0, 20) + '...',
            output: `Hex: ${hexBytes.substring(0, 20)}... | B64: ${base64Text.substring(0, 20)}...`
        });
    } else if (decimal || binary || hex) {
         addToHistory({
            tool: 'Conversor de Bases (Num)',
            details: 'Conversión Numérica',
            input: decimal ? `Dec: ${decimal}` : (binary ? `Bin: ${binary}` : `Hex: ${hex}`),
            output: `Dec: ${decimal} | Hex: ${hex} | Bin: ${binary}`
        });
    } else {
        // Check byte units
        const filled = Object.entries(byteValues).find(([_, v]) => v !== '');
        if (filled) {
             addToHistory({
                tool: 'Conversor de Bytes',
                details: `Unidad base: ${BYTE_UNITS[filled[0] as ByteUnit].name}`,
                input: `${filled[1]} ${filled[0]}`,
                output: `Bytes: ${byteValues.bytes} | MB: ${byteValues.mb} | GB: ${byteValues.gb}`
            });
        }
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TextareaGroup id="text-input" label="Texto (UTF-8)" value={text} onChange={handleTextChange} placeholder="Escribe texto..." rows={6}/>
        <TextareaGroup id="base64" label="Base64" value={base64Text} onChange={handleBase64Change} placeholder="Pega Base64..." error={textError.field === 'base64' ? textError.message : null} rows={6}/>
        <TextareaGroup id="ascii" label="ASCII (Caracteres)" value={ascii} onChange={() => {}} placeholder={isTextMode ? "Representación de bytes" : "N/A"} disabled={true} rows={6}/>
        <TextareaGroup id="hex-bytes" label="Hexadecimal (Bytes)" value={hexBytes} onChange={handleHexBytesChange} placeholder="Pega bytes en Hex (ej: 48 6F 6C 61)..." error={textError.field === 'hex' ? textError.message : null} rows={6}/>
      </div>
      
      <div className="relative flex items-center py-2">
        <div className="flex-grow border-t border-slate-300 dark:border-slate-700"></div>
        <span className="flex-shrink mx-4 text-slate-400 dark:text-slate-500 text-sm tracking-wider">REPRESENTACIÓN EN BYTES / CONVERSIÓN NUMÉRICA</span>
        <div className="flex-grow border-t border-slate-300 dark:border-slate-700"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <InputGroup id="decimal" label="Decimal" value={decimal} onChange={handleNumericWrapper(handleDecimalChange)} placeholder={isTextMode ? "Representación de bytes" : "Ej: 10"} readOnly={isTextMode} error={numericError.field === 'decimal' ? numericError.message : null} />
        <InputGroup id="binary" label="Binario" value={binary} onChange={handleNumericWrapper(handleBinaryChange)} placeholder={isTextMode ? "Representación de bytes" : "Ej: 1010"} readOnly={isTextMode} error={numericError.field === 'binary' ? numericError.message : null} />
        <InputGroup id="hex" label="Hexadecimal" value={hex} onChange={handleNumericWrapper(handleHexChange)} placeholder={isTextMode ? "Representación de bytes" : "Ej: A"} readOnly={isTextMode} error={numericError.field === 'hex' ? numericError.message : null} />
      </div>

      <div className="relative flex items-center py-2">
        <div className="flex-grow border-t border-slate-300 dark:border-slate-700"></div>
        <span className="flex-shrink mx-4 text-slate-400 dark:text-slate-500 text-sm tracking-wider">CONVERSOR DE UNIDADES</span>
        <div className="flex-grow border-t border-slate-300 dark:border-slate-700"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
        {Object.entries(BYTE_UNITS).map(([key, { name }]) => (
          <InputGroup key={key} id={`byte-${key}`} label={name} value={byteValues[key as ByteUnit]} onChange={(e) => handleByteValueChange(key as ByteUnit, e)} placeholder="0"/>
        ))}
      </div>

      <div className="text-right pt-2 flex justify-end gap-3">
        <button onClick={saveToHistory} className="bg-lime-500 hover:bg-lime-600 dark:bg-lime-600 dark:hover:bg-lime-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200">
          Guardar
        </button>
        <button onClick={clearAll} className="bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold py-2 px-4 rounded-md transition-colors duration-200">
          Limpiar Todo
        </button>
      </div>
    </div>
  );
};

export default NumberBaseConverter;
