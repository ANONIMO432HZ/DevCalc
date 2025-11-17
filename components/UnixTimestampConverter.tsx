import React, { useState, useEffect, useCallback } from 'react';
import InputGroup from './InputGroup';

const getRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffSeconds = (date.getTime() - now.getTime()) / 1000;
  const formatter = new Intl.RelativeTimeFormat('es', { numeric: 'auto' });

  if (Math.abs(diffSeconds) < 60) {
    return formatter.format(Math.round(diffSeconds), 'second');
  }
  const diffMinutes = diffSeconds / 60;
  if (Math.abs(diffMinutes) < 60) {
    return formatter.format(Math.round(diffMinutes), 'minute');
  }
  const diffHours = diffMinutes / 60;
  if (Math.abs(diffHours) < 24) {
    return formatter.format(Math.round(diffHours), 'hour');
  }
  const diffDays = diffHours / 24;
  return formatter.format(Math.round(diffDays), 'day');
};

const UnixTimestampConverter: React.FC = () => {
  const [currentTimestamp, setCurrentTimestamp] = useState(Math.floor(Date.now() / 1000));
  const [inputTimestamp, setInputTimestamp] = useState('');
  const [gmtDate, setGmtDate] = useState('');
  const [localDate, setLocalDate] = useState('');
  const [relativeDate, setRelativeDate] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTimestamp(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const convertTimestamp = useCallback((timestamp: string) => {
    if (timestamp.trim() === '') {
      setGmtDate('');
      setLocalDate('');
      setRelativeDate('');
      setError(null);
      return;
    }

    if (!/^\d+$/.test(timestamp)) {
      setError('Por favor, introduce solo números.');
      return;
    }

    const tsNumber = Number(timestamp);
    // Check for timestamps that are too large for JS Date
    if (tsNumber * 1000 > 8.64e15) {
        setError('El timestamp es demasiado grande y está fuera del rango de fechas soportado.');
        return;
    }
    const date = new Date(tsNumber * 1000);

    if (isNaN(date.getTime())) {
      setError('Timestamp inválido o fuera de rango.');
      return;
    }

    setGmtDate(date.toUTCString());
    setLocalDate(date.toLocaleString());
    setRelativeDate(getRelativeTime(date));
    setError(null);
  }, []);

  const handleTimestampChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputTimestamp(value);
    convertTimestamp(value);
  }, [convertTimestamp]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value;
    if (dateValue) {
        const date = new Date(dateValue);
        if (isNaN(date.getTime())) {
            setError("La fecha y hora seleccionadas no son válidas.");
            setInputTimestamp('');
            setGmtDate('');
            setLocalDate('');
            setRelativeDate('');
            return;
        }
        const timestamp = Math.floor(date.getTime() / 1000).toString();
        setInputTimestamp(timestamp);
        convertTimestamp(timestamp);
    }
  };


  const setTimeToNow = useCallback(() => {
    const nowTimestamp = Math.floor(Date.now() / 1000).toString();
    setInputTimestamp(nowTimestamp);
    convertTimestamp(nowTimestamp);
  }, [convertTimestamp]);

  const clearAll = useCallback(() => {
    setInputTimestamp('');
    setGmtDate('');
    setLocalDate('');
    setRelativeDate('');
    setError(null);
  }, []);
  
  const noOp = () => {};

  return (
    <div className="space-y-6">
      <div className="p-4 bg-slate-100 dark:bg-slate-900 rounded-lg text-center">
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Timestamp Unix Actual (Segundos)</p>
        <p className="text-3xl font-mono text-lime-500 dark:text-lime-400 tracking-wider">{currentTimestamp}</p>
      </div>

      <div className="space-y-4">
        <InputGroup
          id="timestamp-input"
          label="Timestamp (Segundos)"
          value={inputTimestamp}
          onChange={handleTimestampChange}
          placeholder="Ej: 1672531200"
          error={error}
        />
        <div>
          <label htmlFor="date-picker" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
              O selecciona una fecha
          </label>
          <input
              type="datetime-local"
              id="date-picker"
              onChange={handleDateChange}
              style={{ colorScheme: 'dark' }}
              className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-200 rounded-md py-3 px-4 focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition font-mono text-lg"
          />
        </div>
      </div>

      <hr className="border-slate-300 dark:border-slate-700" />
      
      <div className="space-y-4">
        <InputGroup id="gmt-output" label="Fecha (GMT)" value={gmtDate} onChange={noOp} placeholder="La fecha en GMT aparecerá aquí" readOnly />
        <InputGroup id="local-output" label="Tu Hora Local" value={localDate} onChange={noOp} placeholder="Tu fecha local aparecerá aquí" readOnly />
        <InputGroup id="relative-output" label="Fecha Relativa" value={relativeDate} onChange={noOp} placeholder="El tiempo relativo aparecerá aquí" readOnly />
      </div>

      <div className="flex flex-wrap gap-4 justify-end pt-2">
        <button
          onClick={setTimeToNow}
          className="bg-lime-500 hover:bg-lime-600 dark:bg-lime-600 dark:hover:bg-lime-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200"
        >
          Ir a Ahora
        </button>
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

export default UnixTimestampConverter;
