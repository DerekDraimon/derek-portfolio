import { useContext } from 'react';
import { LanguageContext } from './LanguageContext.js';

/**
 * Access the active `{ locale, setLocale, t }` from the nearest
 * `LanguageProvider`. Throws when used outside one, so a missing
 * provider fails loudly during development instead of rendering
 * raw dictionary keys.
 */
export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
}
