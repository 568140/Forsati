import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Globe } from 'lucide-react';

export const LanguageToggle: React.FC = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 transition-colors"
      title="تغيير اللغة / Change Language"
    >
      <Globe className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
      <span>{language === 'ar' ? 'English' : 'عربي'}</span>
    </button>
  );
};
