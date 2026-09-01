import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import ContactForm from './ContactForm.jsx';

// `userEvent.setup()` installs its own `navigator.clipboard` stub, which
// would clobber a clipboard mock defined beforehand — so each test defines
// its clipboard override AFTER calling `userEvent.setup()`.
function stubClipboard() {
  Object.defineProperty(navigator, 'clipboard', {
    value: { writeText: vi.fn().mockResolvedValue(undefined) },
    configurable: true,
  });
}

describe('ContactForm', () => {
  it('renders labeled name, email, and message inputs', () => {
    render(<ContactForm />);
    expect(screen.getByLabelText('Nombre')).toBeInTheDocument();
    expect(screen.getByLabelText('Correo')).toBeInTheDocument();
    expect(screen.getByLabelText('Mensaje')).toBeInTheDocument();
  });

  it('shows a validation error message when submitted with all fields empty', async () => {
    const user = userEvent.setup();
    stubClipboard();
    render(<ContactForm />);
    await user.click(screen.getByRole('button', { name: 'Enviar' }));
    expect(screen.getByText('Completa los tres campos antes de enviar.')).toBeInTheDocument();
  });

  it('shows a copied status message after a valid submission', async () => {
    const user = userEvent.setup();
    stubClipboard();
    render(<ContactForm />);
    await user.type(screen.getByLabelText('Nombre'), 'Ada');
    await user.type(screen.getByLabelText('Correo'), 'ada@example.com');
    await user.type(screen.getByLabelText('Mensaje'), 'Hola Derek');
    await user.click(screen.getByRole('button', { name: 'Enviar' }));

    await waitFor(() => {
      expect(screen.getByText(/Mensaje copiado/)).toBeInTheDocument();
    });
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      expect.stringContaining('Ada (ada@example.com)')
    );
  });
});
