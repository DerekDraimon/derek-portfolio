import { describe, expect, it } from 'vitest';
import { validateContactForm } from './validateContactForm.js';

describe('validateContactForm', () => {
  it('is invalid when the name field is whitespace-only', () => {
    const result = validateContactForm({ name: '   ', email: 'a@b.com', message: 'hello' });
    expect(result).toEqual({ valid: false, errors: { name: 'required' } });
  });

  it('is invalid when the email field is empty', () => {
    const result = validateContactForm({ name: 'Derek', email: '', message: 'hello' });
    expect(result).toEqual({ valid: false, errors: { email: 'required' } });
  });

  it('collects one error per blank field when every field is whitespace-only', () => {
    const result = validateContactForm({ name: ' ', email: '\t', message: '' });
    expect(result).toEqual({
      valid: false,
      errors: { name: 'required', email: 'required', message: 'required' },
    });
  });

  it('is valid when every field has non-whitespace content', () => {
    const result = validateContactForm({ name: 'Derek', email: 'derek@example.com', message: 'Hola!' });
    expect(result).toEqual({ valid: true, errors: {} });
  });
});
