const SUPPORTED_LOCALES = ['es', 'en'];
const DEFAULT_LOCALE = 'es';

/**
 * Pure locale-detection function. Prefers an explicitly stored locale
 * (e.g. a prior manual toggle read from localStorage by the caller); when
 * none is stored (or it is not one of the supported locales), falls back
 * to `navigator.language`-style detection: English only when clearly
 * English, Spanish otherwise (the product default).
 *
 * @param {string|null|undefined} stored - previously persisted locale, if any
 * @param {string|string[]|null|undefined} navigatorLanguage - `navigator.language`
 *   or `navigator.languages`
 * @returns {'es'|'en'}
 */
export function detectLocale(stored, navigatorLanguage) {
  if (SUPPORTED_LOCALES.includes(stored)) {
    return stored;
  }
  return detectFromNavigatorLanguage(navigatorLanguage);
}

function detectFromNavigatorLanguage(navigatorLanguage) {
  const candidates = Array.isArray(navigatorLanguage) ? navigatorLanguage : [navigatorLanguage];
  const first = candidates.find((lang) => typeof lang === 'string' && lang.length > 0);

  if (!first) {
    return DEFAULT_LOCALE;
  }

  return first.toLowerCase().startsWith('en') ? 'en' : DEFAULT_LOCALE;
}
