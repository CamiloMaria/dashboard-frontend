import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { es } from './es';
import { en } from './en';

// Get preferred language from localStorage or use browser language
const getPreferredLanguage = () => {
  const stored = localStorage.getItem('preferredLanguage');
  if (stored && ['en', 'es'].includes(stored)) {
    return stored;
  }
  const browserLang = navigator.language.split('-')[0];
  return ['en', 'es'].includes(browserLang) ? browserLang : 'en';
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      es: { translation: es },
    },
    lng: getPreferredLanguage(),
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n; 