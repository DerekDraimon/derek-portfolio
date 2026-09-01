import { useEffect, useMemo, useState } from 'react';
import { LanguageContext } from './LanguageContext.js';
import { detectLocale } from './detectLocale.js';
import { translate } from './translate.js';
import es from './es.json';
import en from './en.json';

export const STORAGE_KEY = 'derek-portfolio:locale';

const DICTIONARIES = { es, en };

function readStoredLocale() {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function writeStoredLocale(locale) {
  try {
    window.localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    // localStorage may be unavailable (private mode/quota) — the locale
    // still updates in memory for this session, it just won't persist.
  }
}

/**
 * Provides `{ locale, setLocale, t }` to the tree via `useTranslation()`.
 * Initial locale: stored override wins; otherwise auto-detected from
 * `navigator.language`. `setLocale` updates state and persists the choice
 * so it overrides fresh detection on the next visit. Keeps
 * `document.documentElement.lang` in sync as an SEO/accessibility touch.
 */
export function LanguageProvider({ children }) {
  const [locale, setLocaleState] = useState(() =>
    detectLocale(readStoredLocale(), navigator.language || navigator.languages)
  );

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  function setLocale(nextLocale) {
    setLocaleState(nextLocale);
    writeStoredLocale(nextLocale);
  }

  const t = useMemo(() => {
    const dictionary = DICTIONARIES[locale] ?? DICTIONARIES.es;
    return (key) => translate(dictionary, key);
  }, [locale]);

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
