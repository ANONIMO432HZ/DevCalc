

import React from 'react';
import { CalculatorType } from '../types';

interface WelcomeProps {
  onNavigate: (tab: CalculatorType) => void;
}

// Iconos SVG inline para las tarjetas
const Icons = {
  Json: (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  ),
  Scale: (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
    </svg>
  ),
  Binary: (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  ),
  Hash: (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.2-2.848.578-4.156" />
    </svg>
  ),
  Palette: (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
    </svg>
  ),
  Fingerprint: (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.2-2.848.578-4.156" />
    </svg>
  ),
  Clock: (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Link: (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
  ),
  Chip: (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
    </svg>
  ),
  Heart: (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  )
};


const FeatureCard: React.FC<{
  title: string;
  description: string;
  icon: React.ElementType;
  tags: string[];
  onClick: () => void;
  colorClass: string;
}> = ({ title, description, icon: Icon, tags, onClick, colorClass }) => (
  <button
    onClick={onClick}
    className="group relative flex flex-col text-left bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 hover:shadow-xl hover:border-lime-500 dark:hover:border-lime-500 transition-all duration-300 hover:-translate-y-1"
  >
    <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${colorClass}`}>
        <Icon className="w-16 h-16" />
    </div>
    <div className={`p-2 rounded-lg w-fit mb-4 ${colorClass} bg-opacity-10 dark:bg-opacity-20 text-slate-700 dark:text-slate-200`}>
      <Icon className="w-6 h-6" />
    </div>
    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors">
      {title}
    </h3>
    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
      {description}
    </p>
    <div className="mt-4 flex flex-wrap gap-2">
        {tags.map(tag => (
            <span key={tag} className="text-[10px] font-mono uppercase tracking-wider bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full">
                {tag}
            </span>
        ))}
    </div>
  </button>
);

const Welcome: React.FC<WelcomeProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-10">
      
      {/* Hero Section */}
      <div className="text-center py-8 sm:py-12 relative overflow-hidden rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-lime-400 via-emerald-500 to-teal-500"></div>
        <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-800 dark:text-white tracking-tight mb-4">
          Tu Suite de <span className="text-lime-500 dark:text-lime-400">Herramientas</span>
        </h2>
        <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto px-4">
          Conversión, diseño, criptografía y manipulación de datos. Todo en una sola aplicación rápida, moderna y offline.
        </p>
      </div>

      {/* Grid de Herramientas */}
      <div>
        <div className="flex items-center gap-4 mb-6">
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">Herramientas Disponibles</h3>
            <div className="h-px flex-grow bg-slate-200 dark:bg-slate-700"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard 
                title="Conversor Universal"
                description="Transforma unidades de longitud, peso, volumen, área, velocidad y tiempo de forma reactiva."
                icon={Icons.Scale}
                tags={['Metros', 'Kilos', 'Mach', 'Años']}
                onClick={() => onNavigate(CalculatorType.UnitConverter)}
                colorClass="text-blue-500 bg-blue-500"
            />
            
            <FeatureCard 
                title="Conversor de Datos"
                description="Importa, valida, formatea y convierte entre archivos JSON, YAML y TOML."
                icon={Icons.Json}
                tags={['JSON', 'YAML', 'TOML', 'Format']}
                onClick={() => onNavigate(CalculatorType.JSON)}
                colorClass="text-yellow-500 bg-yellow-500"
            />

            <FeatureCard 
                title="Conversor de Bases"
                description="Traduce entre texto, binario, hexadecimal, decimal y Base64. Analiza bytes."
                icon={Icons.Binary}
                tags={['Binario', 'Hex', 'Base64', 'ASCII']}
                onClick={() => onNavigate(CalculatorType.NumberBase)}
                colorClass="text-purple-500 bg-purple-500"
            />

            <FeatureCard 
                title="Lógica Bitwise"
                description="Visualiza operaciones AND, OR, XOR, NOT y desplazamientos bit a bit en tiempo real."
                icon={Icons.Chip}
                tags={['AND', 'OR', 'XOR', 'SHIFT']}
                onClick={() => onNavigate(CalculatorType.BitwiseCalculator)}
                colorClass="text-cyan-500 bg-cyan-500"
            />

            <FeatureCard 
                title="Generador de Hash"
                description="Calcula huellas digitales criptográficas (MD5, SHA-256) para texto o archivos."
                icon={Icons.Hash}
                tags={['MD5', 'SHA-256', 'Archivos']}
                onClick={() => onNavigate(CalculatorType.HashGenerator)}
                colorClass="text-red-500 bg-red-500"
            />

            <FeatureCard 
                title="Paletas y Colores"
                description="Crea paletas armoniosas, gradientes CSS y explora la psicología del color."
                icon={Icons.Palette}
                tags={['RGB', 'HSL', 'Gradientes', 'CSS']}
                onClick={() => onNavigate(CalculatorType.PaletteGenerator)}
                colorClass="text-pink-500 bg-pink-500"
            />

            <FeatureCard 
                title="Generador UUID"
                description="Crea identificadores únicos universales versión 1 (tiempo) y versión 4 (aleatorio)."
                icon={Icons.Fingerprint}
                tags={['v4 Random', 'v1 Time', 'Unique']}
                onClick={() => onNavigate(CalculatorType.UUIDGenerator)}
                colorClass="text-indigo-500 bg-indigo-500"
            />

            <FeatureCard 
                title="Tiempo Unix"
                description="Visualiza el timestamp actual, viaja en el tiempo y convierte fechas locales/GMT."
                icon={Icons.Clock}
                tags={['Timestamp', 'Epoch', 'Date']}
                onClick={() => onNavigate(CalculatorType.UnixTimestamp)}
                colorClass="text-teal-500 bg-teal-500"
            />

            <FeatureCard 
                title="URL Encoder"
                description="Codifica y decodifica cadenas de texto para su uso seguro en direcciones URL."
                icon={Icons.Link}
                tags={['Encode', 'Decode', 'URI']}
                onClick={() => onNavigate(CalculatorType.URLEncoder)}
                colorClass="text-orange-500 bg-orange-500"
            />

            <FeatureCard 
                title="Apoyar al Dev"
                description="¿Te resulta útil DevSuite? Considera hacer una donación o dar una estrella para mantener el código vivo."
                icon={Icons.Heart}
                tags={['Sponsor', 'Coffee', 'GitHub']}
                onClick={() => window.open('https://github.com/ANONIMO432HZ/', '_blank')}
                colorClass="text-rose-500 bg-rose-500"
            />
        </div>
      </div>

      {/* Footer Info */}
      <div className="bg-slate-100 dark:bg-slate-800/30 rounded-xl p-6 border border-slate-200 dark:border-slate-700 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
            <p className="text-slate-600 dark:text-slate-300 font-medium">Proyecto Open Source</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Creado para la comunidad de desarrolladores.</p>
        </div>
        <a 
            href="https://github.com/ANONIMO432HZ/DevSuite" 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-5 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-200 text-sm font-semibold hover:border-lime-500 hover:text-lime-600 dark:hover:text-lime-400 transition-colors"
        >
            Ver en GitHub
        </a>
      </div>
    </div>
  );
};

export default Welcome;
