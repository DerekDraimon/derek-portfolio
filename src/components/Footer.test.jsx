import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { renderWithLocale } from '../i18n/testUtils.jsx';
import Footer from './Footer.jsx';

describe('Footer', () => {
  it('renders the contentinfo landmark with the contact email link', () => {
    renderWithLocale(<Footer />);
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /derekzabaleta10@gmail\.com/i })).toBeInTheDocument();
  });
});
