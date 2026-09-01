import { afterEach, describe, expect, it, vi } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { renderWithLocale } from '../i18n/testUtils.jsx';
import ContactForm from './ContactForm.jsx';
import * as submitContactModule from '../lib/submitContact.js';

const LABELS = {
  es: { name: 'Nombre', email: 'Correo', message: 'Mensaje' },
  en: { name: 'Name', email: 'Email', message: 'Message' },
};

async function fillValidForm(user, locale = 'es') {
  const labels = LABELS[locale];
  await user.type(screen.getByLabelText(labels.name), 'Ada');
  await user.type(screen.getByLabelText(labels.email), 'ada@example.com');
  await user.type(screen.getByLabelText(labels.message), 'Hola Derek, me gustaría hablar contigo.');
}

function getStatusLink(name) {
  const statusRegion = document.querySelector('[aria-live="polite"]');
  return within(statusRegion).getByRole('link', { name });
}

describe('ContactForm', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders labeled name, email, and message inputs', () => {
    renderWithLocale(<ContactForm />);
    expect(screen.getByLabelText('Nombre')).toBeInTheDocument();
    expect(screen.getByLabelText('Correo')).toBeInTheDocument();
    expect(screen.getByLabelText('Mensaje')).toBeInTheDocument();
  });

  it('renders a visually-hidden honeypot field that real users never see or focus', () => {
    renderWithLocale(<ContactForm />);
    const honeypot = document.querySelector('input[name="website"]');
    expect(honeypot).not.toBeNull();
    expect(honeypot).toHaveAttribute('tabindex', '-1');
    expect(honeypot).toHaveAttribute('autocomplete', 'off');
    // Not exposed via an accessible label — screen readers/keyboard users
    // never encounter it, only bots that blindly fill every input.
    expect(screen.queryByLabelText(/website/i)).toBeNull();
  });

  it('blocks submission and shows required-field errors when all fields are empty', async () => {
    const user = userEvent.setup();
    const submitSpy = vi.spyOn(submitContactModule, 'submitContact');
    renderWithLocale(<ContactForm />);
    await user.click(screen.getByRole('button', { name: 'Enviar' }));
    expect(screen.getAllByText('Este campo es obligatorio.')).toHaveLength(3);
    expect(submitSpy).not.toHaveBeenCalled();
  });

  it('marks an invalid field with aria-invalid and links its error via aria-describedby', async () => {
    const user = userEvent.setup();
    renderWithLocale(<ContactForm />);
    await user.click(screen.getByRole('button', { name: 'Enviar' }));
    const nameInput = screen.getByLabelText('Nombre');
    expect(nameInput).toHaveAttribute('aria-invalid', 'true');
    const describedBy = nameInput.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
    expect(document.getElementById(describedBy)).toHaveTextContent('Este campo es obligatorio.');
  });

  it('shows a sending state, then a success message, on a valid submission', async () => {
    const user = userEvent.setup();
    vi.spyOn(submitContactModule, 'submitContact').mockResolvedValue({ ok: true, confirmation: 'skipped' });
    renderWithLocale(<ContactForm />);
    await fillValidForm(user);

    const submitButton = screen.getByRole('button', { name: 'Enviar' });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Mensaje enviado — te responderé pronto.')).toBeInTheDocument();
    });
  });

  it('disables the submit button while the request is pending', async () => {
    const user = userEvent.setup();
    let resolveSubmit;
    vi.spyOn(submitContactModule, 'submitContact').mockImplementation(
      () => new Promise((resolve) => { resolveSubmit = resolve; }),
    );
    renderWithLocale(<ContactForm />);
    await fillValidForm(user);

    const submitButton = screen.getByRole('button', { name: 'Enviar' });
    await user.click(submitButton);

    expect(screen.getByRole('button', { name: 'Enviando…' })).toBeDisabled();
    resolveSubmit({ ok: true, confirmation: 'skipped' });
    await waitFor(() => {
      expect(screen.getByText('Mensaje enviado — te responderé pronto.')).toBeInTheDocument();
    });
  });

  it('shows an error message with a mailto link when the submission fails', async () => {
    const user = userEvent.setup();
    vi.spyOn(submitContactModule, 'submitContact').mockResolvedValue({ ok: false });
    renderWithLocale(<ContactForm />);
    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: 'Enviar' }));

    await waitFor(() => {
      expect(screen.getByText('Algo salió mal al enviar tu mensaje.')).toBeInTheDocument();
    });
    const mailtoLink = getStatusLink(/derekzabaleta10@gmail\.com/);
    expect(mailtoLink).toHaveAttribute('href', 'mailto:derekzabaleta10@gmail.com');
  });

  it('shows an error message with a mailto link when the network request throws', async () => {
    const user = userEvent.setup();
    vi.spyOn(submitContactModule, 'submitContact').mockRejectedValue(new Error('network down'));
    renderWithLocale(<ContactForm />);
    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: 'Enviar' }));

    await waitFor(() => {
      expect(screen.getByText('Algo salió mal al enviar tu mensaje.')).toBeInTheDocument();
    });
    expect(getStatusLink(/derekzabaleta10@gmail\.com/)).toHaveAttribute(
      'href',
      'mailto:derekzabaleta10@gmail.com',
    );
  });

  it('submits with the elapsedMs and locale computed since mount', async () => {
    const user = userEvent.setup();
    const submitSpy = vi
      .spyOn(submitContactModule, 'submitContact')
      .mockResolvedValue({ ok: true, confirmation: 'skipped' });
    renderWithLocale(<ContactForm />, { locale: 'en' });
    await fillValidForm(user, 'en');
    await user.click(screen.getByRole('button', { name: 'Send' }));

    await waitFor(() => expect(submitSpy).toHaveBeenCalledTimes(1));
    const payload = submitSpy.mock.calls[0][0];
    expect(payload).toMatchObject({
      name: 'Ada',
      email: 'ada@example.com',
      message: 'Hola Derek, me gustaría hablar contigo.',
      locale: 'en',
      website: '',
    });
    expect(typeof payload.elapsedMs).toBe('number');
    expect(payload.elapsedMs).toBeGreaterThanOrEqual(0);
  });

  it('renders the English form labels and submit button when the locale is English', () => {
    renderWithLocale(<ContactForm />, { locale: 'en' });
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Message')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Send' })).toBeInTheDocument();
  });
});
