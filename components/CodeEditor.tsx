import React, { useState, useEffect, useRef, useMemo, useLayoutEffect } from 'react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const highlightMermaidSyntax = (code: string) => {
  return code
    // Keywords and diagram types
    .replace(/\b(graph|flowchart|sequenceDiagram|classDiagram|stateDiagram-v2|gantt|pie|erDiagram|journey|requirementDiagram|gitGraph)\b/g, '<span class="text-fuchsia-400 font-bold">$1</span>')
    // Directions (TD, LR, etc.)
    .replace(/\b(TD|LR|RL|TB|BT)\b/g, '<span class="text-fuchsia-400 font-bold">$1</span>')
    // Comments
    .replace(/(%%.*)/g, '<span class="text-slate-500 italic">$1</span>')
    // Arrows and links
    .replace(/(-->|---|-->x|--x>|--o>|-->o|===|---)/g, '<span class="text-accent dark:text-accent-400 font-bold">$1</span>')
    .replace(/(->>|-->>|-x|--x|\)|-\))/g, '<span class="text-accent dark:text-accent-400 font-bold">$1</span>')
    // Node text in quotes or brackets
    .replace(/(".*?")/g, '<span class="text-amber-300">$1</span>')
    .replace(/(\[.*?\])/g, '<span class="text-emerald-300">$1</span>')
    .replace(/(\(.*?\))/g, '<span class="text-emerald-300">$1</span>')
    .replace(/(\{.*?\})/g, '<span class="text-emerald-300">$1</span>')
    // Keywords like 'end', 'click', 'call'
    .replace(/\b(end|click|call|link|style|classDef)\b/g, '<span class="text-sky-400">$1</span>');
};

const CodeEditor: React.FC<CodeEditorProps> = ({ value, onChange, placeholder }) => {
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const highlighterRef = useRef<HTMLPreElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [lineCount, setLineCount] = useState(1);
  const LINE_HEIGHT = 23; // Approx. height for text-sm with leading-relaxed

  useLayoutEffect(() => {
    const codeLines = value.split('\n').length;
    let visibleLines = 15; // Fallback
    if (containerRef.current) {
      const editorHeight = containerRef.current.clientHeight;
      if (editorHeight > 0) {
        visibleLines = Math.floor(editorHeight / LINE_HEIGHT);
      }
    }
    setLineCount(Math.max(codeLines, visibleLines, 1));
  }, [value, LINE_HEIGHT]);

  const lineNumbers = useMemo(() => Array.from({ length: lineCount }, (_, i) => i + 1), [lineCount]);
  const highlightedCode = useMemo(() => highlightMermaidSyntax(value), [value]);

  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    if (lineNumbersRef.current) lineNumbersRef.current.scrollTop = scrollTop;
    if (highlighterRef.current) highlighterRef.current.scrollTop = scrollTop;
  };

  const lineStyles = { height: `${LINE_HEIGHT}px`, lineHeight: `${LINE_HEIGHT}px` };

  return (
    <div ref={containerRef} className="relative w-full h-full flex font-mono text-sm">
      {/* Line Numbers */}
      <div
        ref={lineNumbersRef}
        className="h-full bg-slate-100 dark:bg-[#1e293b] p-4 text-right text-slate-400 dark:text-slate-600 select-none overflow-y-hidden"
      >
        {lineNumbers.map(n => <div key={n} style={lineStyles}>{n}</div>)}
      </div>

      {/* Main editor area */}
      <div className="relative flex-grow">
        {/* Highlighter (behind the textarea) */}
        <pre
          ref={highlighterRef}
          aria-hidden="true"
          className="absolute inset-0 w-full h-full m-0 p-4 overflow-hidden"
          style={{ lineHeight: `${LINE_HEIGHT}px` }}
        >
          <code dangerouslySetInnerHTML={{ __html: highlightedCode + '\n' }} />
        </pre>

        {/* Real Textarea (on top, invisible text) */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="absolute inset-0 w-full h-full p-4 bg-transparent border-none focus:ring-0 resize-none scrollbar-custom 
                     text-transparent caret-slate-300 selection:bg-slate-300/30
                     whitespace-pre overflow-auto"
          style={{ lineHeight: `${LINE_HEIGHT}px` }}
          spellCheck={false}
          onScroll={handleScroll}
        />
      </div>
    </div>
  );
};

export default CodeEditor;