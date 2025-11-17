import React, { useState, useCallback } from 'react';

interface TextareaGroupProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  error?: string | null;
  rows?: number;
  disabled?: boolean;
}

const CopyIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
);

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);

const TextareaGroup: React.FC<TextareaGroupProps> = ({ id, label, value, onChange, placeholder, error, rows = 6, disabled = false }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    if (value) {
      navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [value]);

  const borderColor = error ? 'border-red-500' : 'border-slate-300 dark:border-slate-700 focus:border-lime-500';
  const ringColor = error ? 'focus:ring-red-500' : 'focus:ring-lime-500';

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <label htmlFor={id} className="block text-sm font-medium text-slate-600 dark:text-slate-300">
          {label}
        </label>
      </div>
      <div className="relative">
        <textarea
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows}
          disabled={disabled}
          className={`w-full bg-slate-100 dark:bg-slate-900 border text-slate-900 dark:text-slate-200 rounded-md py-3 px-4 focus:ring-2 transition font-mono text-lg resize-y ${borderColor} ${ringColor} disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:cursor-not-allowed`}
        />
        <button
          onClick={handleCopy}
          disabled={!value}
          className="absolute top-2 right-2 flex items-center p-1 text-slate-500 dark:text-slate-400 hover:text-lime-500 dark:hover:text-lime-400 disabled:text-slate-400 dark:disabled:text-slate-600 disabled:cursor-not-allowed transition-colors"
          aria-label={`Copiar ${label}`}
        >
          {copied ? <CheckIcon className="w-5 h-5 text-green-500 dark:text-green-400" /> : <CopyIcon className="w-5 h-5" />}
        </button>
      </div>
      {error && <p className="mt-2 text-sm text-red-500 dark:text-red-400">{error}</p>}
    </div>
  );
};

export default TextareaGroup;