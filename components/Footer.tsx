
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const Footer: React.FC = () => {
  const { t } = useLanguage();
  return (
    <footer className="text-center py-6 px-4">
      <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
        {t('footer.madeWith')} <span className="text-red-500">❤️</span> & ☕.
      </p>
    </footer>
  );
};

export default Footer;
