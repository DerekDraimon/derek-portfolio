import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { renderWithLocale } from '../i18n/testUtils.jsx';
import Portrait from './Portrait.jsx';

describe('Portrait', () => {
  it('renders the portrait image with its alt text', () => {
    renderWithLocale(<Portrait />);
    expect(screen.getByAltText('Derek en una playa de Brasil, de noche')).toBeInTheDocument();
  });
});
