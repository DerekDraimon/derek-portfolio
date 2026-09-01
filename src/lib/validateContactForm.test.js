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

  it('is invalid when the email has no @ symbol', () => {
    const result = validateContactForm({ name: 'Derek', email: 'derek-at-example.com', message: 'Hello there' });
    expect(result).toEqual({ valid: false, errors: { email: 'invalidEmail' } });
  });

  it('is invalid when the email has no domain segment', () => {
    const result = validateContactForm({ name: 'Derek', email: 'derek@example', message: 'Hello there' });
    expect(result).toEqual({ valid: false, errors: { email: 'invalidEmail' } });
  });

  it('is invalid when the email contains whitespace', () => {
    const result = validateContactForm({ name: 'Derek', email: 'derek @example.com', message: 'Hello there' });
    expect(result).toEqual({ valid: false, errors: { email: 'invalidEmail' } });
  });

  it('is invalid when the name exceeds the 100 character limit', () => {
    const result = validateContactForm({
      name: 'a'.repeat(101),
      email: 'derek@example.com',
      message: 'Hello there',
    });
    expect(result).toEqual({ valid: false, errors: { name: 'tooLong' } });
  });

  it('is valid when the name is exactly at the 100 character limit', () => {
    const result = validateContactForm({
      name: 'a'.repeat(100),
      email: 'derek@example.com',
      message: 'Hello there',
    });
    expect(result).toEqual({ valid: true, errors: {} });
  });

  it('is invalid when the email exceeds the 254 character limit', () => {
    const longEmail = `${'a'.repeat(250)}@ex.com`; // 257 chars, still a valid shape
    const result = validateContactForm({ name: 'Derek', email: longEmail, message: 'Hello there' });
    expect(result).toEqual({ valid: false, errors: { email: 'tooLong' } });
  });

  it('is invalid when the message exceeds the 5000 character limit', () => {
    const result = validateContactForm({
      name: 'Derek',
      email: 'derek@example.com',
      message: 'a'.repeat(5001),
    });
    expect(result).toEqual({ valid: false, errors: { message: 'tooLong' } });
  });

  it('is valid when the message is exactly at the 5000 character limit', () => {
    const result = validateContactForm({
      name: 'Derek',
      email: 'derek@example.com',
      message: 'a'.repeat(5000),
    });
    expect(result).toEqual({ valid: true, errors: {} });
  });

  it('collects multiple simultaneous length/format errors', () => {
    const result = validateContactForm({
      name: 'Derek',
      email: 'not-an-email',
      message: 'a'.repeat(5001),
    });
    expect(result).toEqual({ valid: false, errors: { email: 'invalidEmail', message: 'tooLong' } });
  });
});
