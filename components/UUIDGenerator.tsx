import React, { useState, useCallback, useEffect } from 'react';
import InputGroup from './InputGroup';

type UUIDVersion = 'v1' | 'v4';

// Genera un UUID v4 (aleatorio) usando la API nativa del navegador.
const generateV4 = (): string => {
  return crypto.randomUUID();
};

// Genera un UUID v1 (basado en timestamp).
// Nota: El nodo y la secuencia de reloj son aleatorios para cada UUID,
// como es práctica común en entornos de navegador.
const generateV1 = (): string => {
  const node = crypto.getRandomValues(new Uint8Array(6));
  const clockseq = crypto.getRandomValues(new Uint8Array(2));

  // Establece la variante a RFC 4122 (10xx)
  clockseq[0] = (clockseq[0] & 0x3f) | 0x80;

  // Obtiene el tiempo desde la época UUID (intervalos de 100-nanosegundos)
  const msecs = Date.now() + 12219292800000;
  const timestamp = msecs * 10000;

  const timeLow = timestamp & 0xffffffff;
  const timeMid = (timestamp >> 32) & 0xffff;
  const timeHiAndVersion = ((timestamp >> 48) & 0x0fff) | 0x1000; // Versión 1

  const toHex = (byte: number) => byte.toString(16).padStart(2, '0');
  
  const parts = [
    (timeLow >>> 0).toString(16).padStart(8, '0'),
    timeMid.toString(16).padStart(4, '0'),
    timeHiAndVersion.toString(16).padStart(4, '0'),
    toHex(clockseq[0]) + toHex(clockseq[1]),
    Array.from(node).map(toHex).join(''),
  ];

  return parts.join('-');
};


const UUIDGenerator: React.FC = () => {
  const [uuid, setUuid] = useState('');
  const [version, setVersion] = useState<UUIDVersion>('v4');

  const generateUUID = useCallback(() => {
    if (version === 'v1') {
      setUuid(generateV1());
    } else {
      setUuid(generateV4());
    }
  }, [version]);

  // Genera un UUID al montar el componente y al cambiar de versión
  useEffect(() => {
    generateUUID();
  }, [generateUUID]);

  const handleVersionChange = (newVersion: UUIDVersion) => {
    setVersion(newVersion);
  };
  
  const noOp = () => {};

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
          Versión de UUID
        </label>
        <div className="flex gap-2 bg-slate-200 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-1 max-w-min">
          {(['v4', 'v1'] as UUIDVersion[]).map((v) => (
            <button
              key={v}
              onClick={() => handleVersionChange(v)}
              className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-200 dark:focus:ring-offset-slate-900 focus:ring-lime-500 ${
                version === v
                  ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-sm'
                  : 'bg-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-300/50 dark:hover:bg-slate-700/50'
              }`}
            >
              UUID {v.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <InputGroup
        id="uuid-output"
        label="UUID Generado"
        value={uuid}
        onChange={noOp}
        placeholder="El UUID generado aparecerá aquí"
        readOnly
      />
      
      <div className="text-right">
        <button
          onClick={generateUUID}
          className="bg-lime-500 hover:bg-lime-600 dark:bg-lime-600 dark:hover:bg-lime-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200"
        >
          Generar Nuevo
        </button>
      </div>
    </div>
  );
};

export default UUIDGenerator;