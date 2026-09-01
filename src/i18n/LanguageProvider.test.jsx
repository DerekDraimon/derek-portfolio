import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { LanguageProvider, STORAGE_KEY } from './LanguageProvider.jsx';
import { useTranslation } from './useTranslation.js';

function setNavigatorLanguage(language) {
  Object.defineProperty(window.navigator, 'language', { value: language, configurable: true });
}

function Probe() {
  const { locale, setLocale, t } = useTranslation();
  return (
    <div>
      <span data-testid="locale">{locale}</span>
      <span data-testid="translated">{t('hero.ctaMail')}</span>
      <button onClick={() => setLocale('en')}>go-en</button>
    </div>
  );
}

describe('LanguageProvider', () => {
  beforeEach(() => {
    setNavigatorLanguage('es-CO');
  });

  it('detects the locale from navigator.language when nothing is stored', () => {
    setNavigatorLanguage('en-US');
    render(
      <LanguageProvider>
        <Probe />
      </LanguageProvider>
    );
    expect(screen.getByTestId('locale')).toHaveTextContent('en');
    expect(screen.getByTestId('translated')).toHaveTextContent('Email me');
  });

  it('setLocale updates the active locale and persists it to localStorage', async () => {
    const user = userEvent.setup();
    render(
      <LanguageProvider>
        <Probe />
      </LanguageProvider>
    );
    expect(screen.getByTestId('locale')).toHaveTextContent('es');
    await user.click(screen.getByRole('button', { name: 'go-en' }));
    expect(screen.getByTestId('locale')).toHaveTextContent('en');
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe('en');
  });

  it('a previously persisted locale overrides fresh navigator detection on next mount', () => {
    window.localStorage.setItem(STORAGE_KEY, 'en');
    setNavigatorLanguage('es-CO'); // conflicting navigator language — stored value must win
    render(
      <LanguageProvider>
        <Probe />
      </LanguageProvider>
    );
    expect(screen.getByTestId('locale')).toHaveTextContent('en');
  });

  it('sets document.documentElement.lang to the active locale and updates it on toggle', async () => {
    const user = userEvent.setup();
    render(
      <LanguageProvider>
        <Probe />
      </LanguageProvider>
    );
    expect(document.documentElement.lang).toBe('es');
    await user.click(screen.getByRole('button', { name: 'go-en' }));
    expect(document.documentElement.lang).toBe('en');
  });

  it('does not throw when localStorage.setItem is unavailable (e.g. private mode/quota)', async () => {
    const user = userEvent.setup();
    const setItemSpy = vi.spyOn(window.localStorage.__proto__, 'setItem').mockImplementation(() => {
      throw new Error('quota exceeded');
    });
    render(
      <LanguageProvider>
        <Probe />
      </LanguageProvider>
    );
    await user.click(screen.getByRole('button', { name: 'go-en' }));
    // locale still updates in memory even though persistence failed
    expect(screen.getByTestId('locale')).toHaveTextContent('en');
    setItemSpy.mockRestore();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });
});

describe('useTranslation', () => {
  it('throws when used outside a LanguageProvider', () => {
    // suppress React's expected error-boundary console noise for this negative test
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Probe />)).toThrow('useTranslation must be used within a LanguageProvider');
    consoleErrorSpy.mockRestore();
  });
});
