import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { renderWithLocale } from '../i18n/testUtils.jsx';
import Projects from './Projects.jsx';

const mockProjects = [
  { title: 'Alpha', description: 'First project', tags: ['React'] },
  { title: 'Beta', description: 'Second project', tags: [] },
];

describe('Projects', () => {
  it('renders one h3 heading per project from content data', () => {
    renderWithLocale(<Projects projects={mockProjects} />);
    expect(screen.getByRole('heading', { level: 3, name: 'Alpha' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Beta' })).toBeInTheDocument();
  });

  it('renders tag chips only for projects that have tags', () => {
    renderWithLocale(<Projects projects={mockProjects} />);
    expect(screen.getByText('React')).toBeInTheDocument();
    const betaHeading = screen.getByRole('heading', { level: 3, name: 'Beta' });
    const betaCard = betaHeading.closest('.dz-artefacto');
    expect(betaCard.querySelectorAll('.dz-chip')).toHaveLength(0);
  });
});
