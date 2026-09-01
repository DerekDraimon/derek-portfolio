import { createContext } from 'react';

/**
 * Context value shape: `{ locale, setLocale, t }`. No default value —
 * `useTranslation` throws if consumed outside a `LanguageProvider`, since
 * a default would silently render untranslated keys instead of a clear
 * developer error.
 */
export const LanguageContext = createContext(undefined);
