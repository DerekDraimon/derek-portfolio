import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { renderWithLocale } from '../i18n/testUtils.jsx';
import Skills from './Skills.jsx';

describe('Skills', () => {
  it('renders one chip per daily-use skill from content data', () => {
    renderWithLocale(<Skills daily={['React', 'C#']} studying={['Docker']} />);
    const dailyGroup = screen.getByText('De uso diario').closest('.dz-materia-group');
    expect(dailyGroup.querySelectorAll('.dz-chip')).toHaveLength(2);
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('C#')).toBeInTheDocument();
  });

  it('renders a different in-study chip count to prove it comes from props, not a hardcoded list', () => {
    renderWithLocale(<Skills daily={['React']} studying={['Docker', 'Kubernetes', 'AKS']} />);
    const studyGroup = screen.getByText('En estudio').closest('.dz-materia-group');
    expect(studyGroup.querySelectorAll('.dz-chip')).toHaveLength(3);
  });

  it('renders the English headings when the locale is English', () => {
    renderWithLocale(<Skills daily={['React']} studying={['Docker']} />, { locale: 'en' });
    expect(screen.getByText('Daily use')).toBeInTheDocument();
    expect(screen.getByText('Currently studying')).toBeInTheDocument();
  });
});
