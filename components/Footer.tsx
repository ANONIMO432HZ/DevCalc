import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="text-center py-6 px-4">
      <p className="text-sm text-slate-500 dark:text-slate-500">
        Desarrollado por un entusiasta del código para la comunidad de desarrolladores.
      </p>
      <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
        Creado con <span className="text-red-500">❤️</span> y mucho ☕.
      </p>
    </footer>
  );
};

export default Footer;