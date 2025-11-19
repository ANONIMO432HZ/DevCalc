import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="text-center py-6 px-4">
      <p className="text-sm text-slate-500 dark:text-slate-500">
        Desarrollado por <a href="https://github.com/ANONIMO432HZ/" target="_blank" rel="noopener noreferrer" className="font-bold hover:text-lime-500 dark:hover:text-lime-400 transition-colors">4N0N1M0</a>
      </p>
      <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
        Creado con <span className="text-red-500">❤️</span> y mucho ☕.
      </p>
    </footer>
  );
};

export default Footer;