import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { LanguageProvider, STORAGE_KEY } from '../i18n/LanguageProvider.jsx';
import { useTranslation } from '../i18n/useTranslation.js';
import LanguageToggle from './LanguageToggle.jsx';

function Sample() {
  const { t } = useTranslation();
  return <p>{t('hero.ctaMail')}</p>;
}

describe('LanguageToggle', () => {
  beforeEach(() => {
    window.localStorage.setItem(STORAGE_KEY, 'es');
  });

  it('renders an accessible button', () => {
    render(
      <LanguageProvider>
        <LanguageToggle />
      </LanguageProvider>
    );
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('clicking the toggle switches the active locale copy elsewhere in the tree', async () => {
    const user = userEvent.setup();
    render(
      <LanguageProvider>
        <LanguageToggle />
        <Sample />
      </LanguageProvider>
    );
    expect(screen.getByText('Escríbeme')).toBeInTheDocument();
    await user.click(screen.getByRole('button'));
    expect(screen.getByText('Email me')).toBeInTheDocument();
  });
});
