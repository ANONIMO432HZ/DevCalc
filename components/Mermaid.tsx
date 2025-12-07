
import React, { useEffect, useState, useRef, useImperativeHandle, forwardRef } from 'react';
import mermaid from 'mermaid';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

export interface MermaidHandle {
  getSvg: () => string | null;
}

interface MermaidProps {
  chart: string;
  onFix?: (code: string, error: string) => void;
  showTools?: boolean;
}

const ChevronDownIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
);

const EditExternalIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
    </svg>
);

const DownloadIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);

const Mermaid = forwardRef<MermaidHandle, MermaidProps>(({ chart, onFix, showTools = false }, ref) => {
  const { themeMode } = useTheme();
  const { t } = useLanguage();
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isRendering, setIsRendering] = useState(false);
  const [showErrorDetails, setShowErrorDetails] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const uniqueIdRef = useRef(`mermaid-${Math.random().toString(36).substring(2, 9)}`);

  // Lógica compartida para obtener el SVG limpio
  const getSvgContent = () => {
        const originalSvg = containerRef.current?.querySelector('.mermaid-wrapper svg') as SVGSVGElement;
        
        if (!originalSvg) {
            return null;
        }

        const clonedSvg = originalSvg.cloneNode(true) as SVGSVGElement;
        const box = originalSvg.getBoundingClientRect();
        const width = box.width || 800;
        const height = box.height || 600;

        clonedSvg.setAttribute('width', `${width}`);
        clonedSvg.setAttribute('height', `${height}`);
        // Asegurar viewBox si no existe
        if(!clonedSvg.getAttribute('viewBox')) {
            clonedSvg.setAttribute('viewBox', `0 0 ${width} ${height}`);
        }
        clonedSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        
        // Estilos inline para asegurar visibilidad fuera de la app (fondo sólido)
        clonedSvg.style.backgroundColor = themeMode === 'dark' ? '#0f172a' : '#ffffff';
        clonedSvg.style.fontFamily = 'sans-serif';

        return new XMLSerializer().serializeToString(clonedSvg);
  };

  useImperativeHandle(ref, () => ({
    getSvg: getSvgContent
  }));

  const handleDownloadInternal = () => {
      const svgData = getSvgContent();
      if (!svgData) return;
      
      const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `diagram-${Date.now()}.svg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
  };

  const handleOpenExternal = () => {
      const state = {
          code: chart,
          mermaid: { theme: themeMode === 'dark' ? 'dark' : 'default' },
          autoSync: true,
          rough: false
      };
      const json = JSON.stringify(state);
      const b64 = btoa(unescape(encodeURIComponent(json)));
      window.open(`https://mermaid.live/edit#base64:${b64}`, '_blank');
  };

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      suppressErrorRendering: true,
      theme: themeMode === 'dark' ? 'dark' : 'base',
      securityLevel: 'strict',
      flowchart: { htmlLabels: false },
      fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      themeVariables: themeMode === 'dark' ? {
        primaryColor: '#6366f1',
        primaryTextColor: '#f1f5f9',
        primaryBorderColor: '#818cf8',
        lineColor: '#94a3b8',
        secondaryColor: '#1e293b',
        tertiaryColor: '#0f172a',
      } : {
        primaryColor: '#6366f1',
        primaryTextColor: '#1e293b',
        primaryBorderColor: '#4338ca',
        lineColor: '#64748b',
        secondaryColor: '#f1f5f9',
        tertiaryColor: '#ffffff',
      }
    });

    let isMounted = true;
    const currentId = uniqueIdRef.current;

    const renderChart = async () => {
      if (!chart) return;
      
      const cleanChart = chart
        .replace(/(\w+)\s*\{\s*"((?:[^"\\]|\\.)*)"\s*\}/g, '$1{$2}')
        .replace(/(\w+)\s*\{\s*[“"]((?:[^”"\\]|\\.)*)[”"]\s*\}/g, '$1{$2}');

      if (isMounted) {
        setError(null);
        setIsRendering(true);
      }

      try {
        await mermaid.parse(cleanChart);
        // Reset DOM if needed for re-renders with same ID (mermaid quirk)
        const existingElement = document.getElementById(currentId);
        if (existingElement) existingElement.remove();

        const { svg: svgContent } = await mermaid.render(currentId, cleanChart);
        
        if (isMounted) {
          setSvg(svgContent);
          setIsRendering(false);
        }
      } catch (err) {
        console.error('Mermaid rendering failed:', err);
        if (isMounted) {
          let msg = 'Error desconocido en el diagrama';
          if (err instanceof Error) {
             msg = err.message;
             if (msg.includes('Parse error')) msg = 'Error de Sintaxis (Parse Error). Posiblemente caracteres inválidos en el diagrama.';
          } else if (typeof err === 'string') {
             msg = err;
          }
          
          setError(msg);
          setIsRendering(false);
        }
      }
    };

    const timeoutId = setTimeout(() => { renderChart(); }, 200);
    return () => { isMounted = false; clearTimeout(timeoutId); };
  }, [chart, themeMode]);

  if (error) {
    return (
      <div className="my-6 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/10 overflow-hidden shadow-sm animate-fadeIn transition-all">
        <div className="p-4 relative group">
            <pre className="font-mono text-xs sm:text-sm text-red-800 dark:text-red-200 whitespace-pre-wrap break-words leading-relaxed select-all">
                {chart}
            </pre>
        </div>
        <div className="border-t border-red-200 dark:border-red-900/30">
            <button 
                onClick={() => setShowErrorDetails(!showErrorDetails)}
                className="w-full flex items-center justify-between px-4 py-2 text-xs text-red-600 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors focus:outline-none"
            >
                <span>{showErrorDetails ? 'Ocultar detalles técnicos' : 'Ver por qué falló el renderizado gráfico'}</span>
                <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${showErrorDetails ? 'rotate-180' : ''}`} />
            </button>
            {showErrorDetails && (
                <div className="px-4 py-3 bg-red-100 dark:bg-red-900/20 border-t border-red-200 dark:border-red-900/30">
                    <p className="text-[10px] font-mono text-red-700 dark:text-red-300 break-words">
                        {error}
                    </p>
                </div>
            )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative group my-6 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm" ref={containerRef}>
        
        {/* Static Toolbar for Chat Mode */}
        {showTools && !isRendering && (
            <div className="flex items-center justify-end gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                <span className="mr-auto text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mermaid Diagram</span>
                <button 
                    onClick={handleOpenExternal}
                    className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"
                    title={t('diagram.btn.external')}
                >
                    <EditExternalIcon className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Editor</span>
                </button>
                <div className="w-px h-4 bg-slate-300 dark:bg-slate-600"></div>
                <button 
                    onClick={handleDownloadInternal}
                    className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"
                    title={t('diagram.export.btn')}
                >
                    <DownloadIcon className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">SVG</span>
                </button>
            </div>
        )}

        <div 
            className={`mermaid-wrapper flex justify-center p-6 overflow-x-auto transition-opacity duration-300 ${isRendering ? 'opacity-50' : 'opacity-100'}`}
        >
            {isRendering && !svg && (
                <div className="absolute inset-0 flex items-center justify-center z-10 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                </div>
            )}
            <div 
                dangerouslySetInnerHTML={{ __html: svg }} 
                className="flex justify-center"
            />
        </div>
    </div>
  );
});

export default Mermaid;
