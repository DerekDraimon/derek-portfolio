/**
 * Contact form validation, shared between the client (`ContactForm.jsx`)
 * and the server (`api/contact.js` re-validates every field regardless of
 * what the client already checked). Started in slice 2a as a non-empty/
 * trim check only; slice 4 adds the email-format and length-bound rules
 * that were deferred at that point (the server contract needed them
 * settled first).
 *
 * Error codes are dictionary key segments (`contact.errors.<code>`) so
 * both the client UI and any future server error surface can resolve a
 * human-readable message from the same taxonomy without a translation
 * table in between.
 */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LIMITS = {
  name: { max: 100 },
  email: { max: 254 },
  message: { max: 5000 },
};

export function validateContactForm({ name = '', email = '', message = '' } = {}) {
  const errors = {};

  const trimmedName = name.trim();
  if (!trimmedName) {
    errors.name = 'required';
  } else if (trimmedName.length > LIMITS.name.max) {
    errors.name = 'tooLong';
  }

  const trimmedEmail = email.trim();
  if (!trimmedEmail) {
    errors.email = 'required';
  } else if (trimmedEmail.length > LIMITS.email.max) {
    errors.email = 'tooLong';
  } else if (!EMAIL_PATTERN.test(trimmedEmail)) {
    errors.email = 'invalidEmail';
  }

  const trimmedMessage = message.trim();
  if (!trimmedMessage) {
    errors.message = 'required';
  } else if (trimmedMessage.length > LIMITS.message.max) {
    errors.message = 'tooLong';
  }

  return { valid: Object.keys(errors).length === 0, errors };
}
