import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App.jsx';

describe('App semantic landmarks', () => {
  it('renders a single main landmark wrapping the content sections', () => {
    render(<App />);
    const mains = screen.getAllByRole('main');
    expect(mains).toHaveLength(1);
  });

  it('renders the hero header with a single h1 and a role subtitle', () => {
    render(<App />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
    const h1s = screen.getAllByRole('heading', { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0]).toHaveTextContent('Derek Zabaleta');
  });

  it('renders chapter section h2 headings in document order', () => {
    render(<App />);
    const h2s = screen.getAllByRole('heading', { level: 2 });
    expect(h2s.map((h) => h.textContent)).toEqual([
      'La materia',
      'Las crónicas',
      'Los artefactos',
      'El sello',
      'Invócame',
    ]);
  });

  it('renders h3 headings nested under their h2 chapters', () => {
    render(<App />);
    const h3s = screen.getAllByRole('heading', { level: 3 });
    expect(h3s.length).toBeGreaterThan(0);
  });

  it('renders the footer landmark with the contact links', () => {
    render(<App />);
    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
    expect(within(footer).getByRole('link', { name: /derekzabaleta10@gmail\.com/i })).toBeInTheDocument();
  });
});
