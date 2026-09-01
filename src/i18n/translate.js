/**
 * Resolves a dot-path key against a (possibly nested) dictionary object.
 * Returns the resolved string when found; when the path does not resolve
 * to a string (missing key, missing intermediate segment, or a non-string
 * leaf value), returns the key itself as a visible fallback.
 *
 * @param {object} dictionary
 * @param {string} key - dot-separated path, e.g. "hero.role"
 * @returns {string}
 */
export function translate(dictionary, key) {
  if (!dictionary || typeof key !== 'string') {
    return key;
  }

  const value = key.split('.').reduce((acc, segment) => {
    if (acc && typeof acc === 'object' && segment in acc) {
      return acc[segment];
    }
    return undefined;
  }, dictionary);

  return typeof value === 'string' ? value : key;
}
