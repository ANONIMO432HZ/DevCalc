import React, { useState, useCallback } from 'react';
import TextareaGroup from './TextareaGroup';

/**
 * Traduce mensajes de error de JSON comunes del inglés al español.
 * @param message El mensaje de error en inglés.
 * @returns El mensaje traducido o el original si no hay traducción.
 */
const translateJsonErrorMessage = (message: string): string => {
    const cleaned = message.replace(/ in JSON$/, '');
    if (cleaned.startsWith('Unexpected token')) {
        const token = cleaned.split(' ')[2];
        if (token && token.length === 1) {
             return `Carácter inesperado '${token}'.`;
        }
        return `Símbolo inesperado. El JSON podría tener un formato incorrecto.`;
    }
    if (cleaned.startsWith('Unexpected end of JSON input')) {
      return 'Final inesperado de la entrada. El JSON podría estar incompleto o mal formado.';
    }
    if (cleaned.startsWith('Invalid string')) {
        return 'Se encontró una cadena de texto inválida (p. ej., una barra invertida sin escapar).';
    }
    return message; // Devuelve el mensaje original si no hay una traducción específica
};


/**
 * Analiza un error de JSON y devuelve un mensaje descriptivo.
 * Si es un SyntaxError con una posición, calcula la línea y la columna.
 * @param error El error capturado.
 * @param jsonString El string JSON que causó el error.
 * @returns Un mensaje de error formateado.
 */
const getJsonError = (error: unknown, jsonString: string): string => {
  if (error instanceof SyntaxError) {
    const message = error.message;
    // Los mensajes estándar son como "Unexpected token T in JSON at position 1"
    const match = /at position (\d+)/.exec(message);

    if (match && match[1]) {
      const position = parseInt(match[1], 10);
      let line = 1;
      let column = 1;
      // Calcula la línea y la columna basándose en la posición del error
      for (let i = 0; i < position; i++) {
        if (jsonString[i] === '\n') {
          line++;
          column = 1;
        } else {
          column++;
        }
      }
      const cleanMessage = message.replace(/ at position \d+$/, '');
      const translatedMessage = translateJsonErrorMessage(cleanMessage);
      return `Error en línea ${line}, columna ${column}: ${translatedMessage}`;
    }
    return `JSON inválido: ${translateJsonErrorMessage(message)}`;
  }
  if (error instanceof Error) {
    return `Error: ${error.message}`;
  }
  return 'Error desconocido al procesar el JSON.';
};

const JSONConverter: React.FC = () => {
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonInput(e.target.value);
    setError(null);
  }, []);

  const handleFormat = useCallback(() => {
    const trimmedInput = jsonInput.trim();
    if (!trimmedInput) return;
    try {
      const parsed = JSON.parse(trimmedInput);
      setJsonInput(JSON.stringify(parsed, null, 2));
      setError(null);
    } catch (e) {
      setError(getJsonError(e, trimmedInput));
    }
  }, [jsonInput]);

  const handleMinify = useCallback(() => {
    const trimmedInput = jsonInput.trim();
    if (!trimmedInput) return;
    try {
      const parsed = JSON.parse(trimmedInput);
      setJsonInput(JSON.stringify(parsed));
      setError(null);
    } catch (e) {
      setError(getJsonError(e, trimmedInput));
    }
  }, [jsonInput]);

  const clearAll = useCallback(() => {
    setJsonInput('');
    setError(null);
  }, []);

  return (
    <div className="space-y-6">
      <TextareaGroup
        id="json"
        label="JSON"
        value={jsonInput}
        onChange={handleInputChange}
        placeholder='Pega tu JSON aquí... ej: {"clave": "valor"}'
        error={error}
        rows={18}
      />
      <div className="flex flex-wrap gap-4 justify-end">
        <button
          onClick={handleFormat}
          disabled={!jsonInput.trim()}
          className="bg-lime-500 hover:bg-lime-600 dark:bg-lime-600 dark:hover:bg-lime-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed"
        >
          Formatear
        </button>
        <button
          onClick={handleMinify}
          disabled={!jsonInput.trim()}
          className="bg-indigo-500 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed"
        >
          Minificar
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

export default JSONConverter;
