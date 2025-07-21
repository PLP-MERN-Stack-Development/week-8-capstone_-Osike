import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation('navigation');

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'sw' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-800 hover:bg-blue-50 transition-colors duration-200"
      title={t('language')}
    >
      <Globe className="h-4 w-4" />
      <span className="hidden sm:inline">
        {i18n.language === 'en' ? t('kiswahili') : t('english')}
      </span>
      <span className="sm:hidden">
        {i18n.language === 'en' ? 'SW' : 'EN'}
      </span>
    </button>
  );
};

export default LanguageSwitcher;