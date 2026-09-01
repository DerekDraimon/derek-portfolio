import { describe, expect, it } from 'vitest';
import es from './es.json';
import en from './en.json';

function flattenKeys(obj, prefix = '') {
  return Object.entries(obj).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      return flattenKeys(value, path);
    }
    return [path];
  });
}

describe('i18n dictionary key parity', () => {
  it('es.json and en.json declare exactly the same set of keys', () => {
    const esKeys = flattenKeys(es).sort();
    const enKeys = flattenKeys(en).sort();
    expect(enKeys).toEqual(esKeys);
  });

  it('both dictionaries define the same known key used across the site', () => {
    expect(flattenKeys(es)).toContain('contact.submit');
    expect(flattenKeys(en)).toContain('contact.submit');
  });
});
