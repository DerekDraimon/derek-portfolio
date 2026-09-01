import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Hero from './Hero.jsx';

describe('Hero', () => {
  it('renders the h1 with the name', () => {
    render(<Hero />);
    expect(screen.getByRole('heading', { level: 1, name: 'Derek Zabaleta' })).toBeInTheDocument();
  });

  it('shows a copied confirmation after clicking the mail CTA', async () => {
    const user = userEvent.setup();
    // `userEvent.setup()` installs its own `navigator.clipboard` stub, so the
    // override must be defined after setup, not before.
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
      configurable: true,
    });
    render(<Hero />);
    await user.click(screen.getByRole('link', { name: /Escríbeme/ }));
    expect(await screen.findByText('¡Correo copiado!')).toBeInTheDocument();
  });
});
