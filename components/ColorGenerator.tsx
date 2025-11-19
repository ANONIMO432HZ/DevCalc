
import React, { useState, useEffect, useCallback } from 'react';
import InputGroup from './InputGroup';

interface ColorData {
  hex: string;
  rgb: string;
  hsl: string;
  r: number;
  g: number;
  b: number;
}

const ColorGenerator: React.FC = () => {
  const [color, setColor] = useState<ColorData | null>(null);

  // Función auxiliar para convertir RGB a HSL
  const rgbToHsl = (r: number, g: number, b: number): string => {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
  };

  const generateRandomColor = useCallback(() => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);

    // Hex
    const toHex = (c: number) => c.toString(16).padStart(2, '0').toUpperCase();
    const hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`;

    // RGB
    const rgb = `rgb(${r}, ${g}, ${b})`;

    // HSL
    const hsl = rgbToHsl(r, g, b);

    setColor({ hex, rgb, hsl, r, g, b });
  }, []);

  // Generar color al montar
  useEffect(() => {
    generateRandomColor();
  }, [generateRandomColor]);

  // Calcular contraste para el texto sobre el color (blanco o negro)
  const getContrastColor = () => {
    if (!color) return 'black';
    // Fórmula de luminosidad relativa
    const yiq = ((color.r * 299) + (color.g * 587) + (color.b * 114)) / 1000;
    return yiq >= 128 ? 'black' : 'white';
  };

  const noOp = () => {};

  if (!color) return null;

  return (
    <div className="space-y-8">
      {/* Muestra visual del color */}
      <div 
        className="w-full h-48 rounded-xl shadow-inner flex items-center justify-center transition-colors duration-500 ease-in-out border border-slate-200 dark:border-slate-700"
        style={{ backgroundColor: color.hex }}
      >
        <span 
          className="text-2xl font-bold font-mono tracking-wider opacity-90"
          style={{ color: getContrastColor() }}
        >
          {color.hex}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <InputGroup 
          id="hex-output" 
          label="HEX" 
          value={color.hex} 
          onChange={noOp} 
          placeholder="" 
          readOnly 
        />
        <InputGroup 
          id="rgb-output" 
          label="RGB" 
          value={color.rgb} 
          onChange={noOp} 
          placeholder="" 
          readOnly 
        />
        <InputGroup 
          id="hsl-output" 
          label="HSL" 
          value={color.hsl} 
          onChange={noOp} 
          placeholder="" 
          readOnly 
        />
      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={generateRandomColor}
          className="w-full sm:w-auto bg-lime-500 hover:bg-lime-600 dark:bg-lime-600 dark:hover:bg-lime-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transform transition hover:-translate-y-0.5 active:translate-y-0 duration-200"
        >
          Generar Nuevo Color
        </button>
      </div>
    </div>
  );
};

export default ColorGenerator;
