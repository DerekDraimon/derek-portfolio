import { render } from '@testing-library/react';
import { LanguageProvider, STORAGE_KEY } from './LanguageProvider.jsx';

/**
 * Test helper: renders `ui` inside a `LanguageProvider` with a deterministic
 * starting locale (persisted to localStorage before render, so it wins over
 * whatever `navigator.language` the test environment happens to report).
 * Used by every component test that consumes `useTranslation()`.
 */
export function renderWithLocale(ui, { locale = 'es' } = {}) {
  window.localStorage.setItem(STORAGE_KEY, locale);
  return render(<LanguageProvider>{ui}</LanguageProvider>);
}
