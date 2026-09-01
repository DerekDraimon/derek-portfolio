import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { renderWithLocale } from '../i18n/testUtils.jsx';
import Experience from './Experience.jsx';

const mockEntries = [
  { when: '2024', title: 'Role A', description: 'Did A' },
  { when: '2022', title: 'Role B', description: 'Did B' },
];

describe('Experience', () => {
  it('renders one h3 per entry, in the given order, from content data', () => {
    renderWithLocale(<Experience entries={mockEntries} />);
    const headings = screen.getAllByRole('heading', { level: 3 });
    expect(headings.map((h) => h.textContent)).toEqual(['Role A', 'Role B']);
  });
});
