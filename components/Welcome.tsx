import React from 'react';

// Re-using the icon from Header for consistency
const CodeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
);

const Welcome: React.FC = () => {
  return (
    <div className="space-y-8 text-slate-700 dark:text-slate-300">
      <div className="text-center border-b border-slate-200 dark:border-slate-700 pb-8">
        <CodeIcon className="w-16 h-16 text-lime-500 dark:text-lime-400 mx-auto mb-4"/>
        <h2 className="text-4xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">Bienvenido a DevCalc</h2>
        <p className="mt-4 text-lg max-w-2xl mx-auto text-slate-500 dark:text-slate-400">
          Una colección de calculadoras y herramientas para desarrolladores, diseñada para ser rápida, intuitiva y estéticamente agradable.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">¿Cómo empezar?</h3>
          <p>
            Es muy sencillo. Simplemente selecciona la herramienta que necesites de las pestañas en la parte superior. Cada calculadora está diseñada para ser autoexplicativa. Aquí tienes un resumen de lo que puedes hacer:
          </p>
          <ul className="list-disc list-inside mt-4 space-y-2 pl-2">
            <li><strong>Conversor de Bases:</strong> Convierte entre texto, Base64, Hex, y representaciones numéricas/bytes. Incluye un conversor de unidades de almacenamiento.</li>
            <li><strong>Conversor de Tiempo:</strong> Realiza conversiones entre diversas unidades de tiempo, desde nanosegundos hasta siglos.</li>
            <li><strong>Tiempo Unix:</strong> Convierte timestamps de Unix a fechas legibles y viceversa, con soporte para tu zona horaria local.</li>
            <li><strong>Codificador URL:</strong> Codifica y decodifica texto para que sea seguro de usar en URLs.</li>
            <li><strong>Formateador JSON:</strong> Valida, formatea y minifica tus datos JSON con facilidad.</li>
            <li><strong>Generador de Hash:</strong> Calcula hashes (MD5, SHA-1, SHA-256, SHA-512) para texto o archivos.</li>
            <li><strong>Generador UUID:</strong> Crea identificadores únicos universales (UUIDs) en sus versiones v1 y v4.</li>
          </ul>
        </div>
        
        <div>
          <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">Sobre el Creador</h3>
          <p>
            DevCalc fue desarrollado por <a href="https://github.com/ANONIMO432HZ" target="_blank" rel="noopener noreferrer" className="text-lime-500 dark:text-lime-400 hover:underline font-semibold">ANONIMO432HZ</a>. La misión de este proyecto es proporcionar herramientas de alta calidad que agilicen el flujo de trabajo de otros desarrolladores, creyendo en el software libre, accesible y bien diseñado.
          </p>
        </div>
        
        <div>
          <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">Sugerencias y Contribuciones</h3>
          <p>
            ¿Tienes una idea para una nueva herramienta o una sugerencia para mejorar las existentes? ¡Nos encantaría escucharla! Este proyecto está en constante evolución gracias a los comentarios de la comunidad.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
