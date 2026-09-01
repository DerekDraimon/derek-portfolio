import { describe, expect, it } from 'vitest';
import { translate } from './translate.js';

describe('translate', () => {
  it('resolves a top-level key', () => {
    expect(translate({ hello: 'Hola' }, 'hello')).toBe('Hola');
  });

  it('resolves a nested dot-path key', () => {
    expect(translate({ hero: { role: 'Full Stack Developer' } }, 'hero.role')).toBe(
      'Full Stack Developer'
    );
  });

  it('resolves a deeply nested dot-path key', () => {
    expect(translate({ a: { b: { c: 'deep value' } } }, 'a.b.c')).toBe('deep value');
  });

  it('returns the key itself when the key does not exist in the dictionary', () => {
    expect(translate({ hero: { role: 'x' } }, 'hero.missing')).toBe('hero.missing');
  });

  it('returns the key itself when an intermediate path segment does not exist', () => {
    expect(translate({ hero: { role: 'x' } }, 'nope.deeper.path')).toBe('nope.deeper.path');
  });

  it('returns the key itself when the resolved value is not a string', () => {
    expect(translate({ hero: { count: 42 } }, 'hero.count')).toBe('hero.count');
  });
});
