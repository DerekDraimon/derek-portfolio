import { describe, expect, it } from 'vitest';
import { detectLocale } from './detectLocale.js';

describe('detectLocale', () => {
  it('returns the stored locale when it is a supported value, ignoring navigator language', () => {
    expect(detectLocale('en', 'es-CO')).toBe('en');
  });

  it('detects English from an en-US navigator language when nothing is stored', () => {
    expect(detectLocale(undefined, 'en-US')).toBe('en');
  });

  it('detects Spanish from an es-CO navigator language when nothing is stored', () => {
    expect(detectLocale(undefined, 'es-CO')).toBe('es');
  });

  it('defaults to Spanish for a non-English navigator language like fr-FR', () => {
    expect(detectLocale(undefined, 'fr-FR')).toBe('es');
  });

  it('defaults to Spanish when navigator language is undefined', () => {
    expect(detectLocale(undefined, undefined)).toBe('es');
  });

  it('falls back to navigator-based detection when the stored value is corrupt/unsupported', () => {
    expect(detectLocale('xx-not-a-locale', 'en-US')).toBe('en');
  });

  it('detects English from a navigator.languages array when the first entry is English', () => {
    expect(detectLocale(undefined, ['en-GB', 'fr-FR'])).toBe('en');
  });
});
