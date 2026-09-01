import { useTranslation } from '../i18n/useTranslation.js';

/**
 * Always-visible manual locale override. Shows the language it will
 * switch TO (not the current one), so the label doubles as the call to
 * action. Rendered once at the composition root so it stays visible
 * across every section.
 */
export default function LanguageToggle() {
  const { locale, setLocale, t } = useTranslation();
  const nextLocale = locale === 'es' ? 'en' : 'es';
  const label = nextLocale === 'en' ? t('languageToggle.switchToEnglish') : t('languageToggle.switchToSpanish');

  return (
    <button type="button" className="dz-lang-toggle" onClick={() => setLocale(nextLocale)} aria-label={label}>
      {nextLocale.toUpperCase()}
    </button>
  );
}
