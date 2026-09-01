import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Skills from './Skills.jsx';

describe('Skills', () => {
  it('renders one chip per daily-use skill from content data', () => {
    render(<Skills daily={['React', 'C#']} studying={['Docker']} />);
    const dailyGroup = screen.getByText('De uso diario').closest('.dz-materia-group');
    expect(dailyGroup.querySelectorAll('.dz-chip')).toHaveLength(2);
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('C#')).toBeInTheDocument();
  });

  it('renders a different in-study chip count to prove it comes from props, not a hardcoded list', () => {
    render(<Skills daily={['React']} studying={['Docker', 'Kubernetes', 'AKS']} />);
    const studyGroup = screen.getByText('En estudio').closest('.dz-materia-group');
    expect(studyGroup.querySelectorAll('.dz-chip')).toHaveLength(3);
  });
});
