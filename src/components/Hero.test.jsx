import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { renderWithLocale } from '../i18n/testUtils.jsx';
import Hero from './Hero.jsx';

describe('Hero', () => {
  it('renders the h1 with the name', () => {
    renderWithLocale(<Hero />);
    expect(screen.getByRole('heading', { level: 1, name: 'Derek Zabaleta' })).toBeInTheDocument();
  });

  it('the mail CTA links to the contact section instead of copying the email', () => {
    renderWithLocale(<Hero />);
    expect(screen.getByRole('link', { name: /Escríbeme/ })).toHaveAttribute('href', '#contact');
  });

  it('renders the English CTA copy when the locale is English', () => {
    renderWithLocale(<Hero />, { locale: 'en' });
    expect(screen.getByRole('link', { name: /Email me/ })).toBeInTheDocument();
  });
});
