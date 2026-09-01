/**
 * Content IDs + badge label for the "El sello" / "The seal" section, in
 * display order. Per the i18n design (D7), `title`/`subtitle` are
 * translatable prose and live in `src/i18n/{es,en}.json` under
 * `certifications.entries.<id>`, keyed by this `id`. `badge` is a short
 * proper-noun/acronym label and stays untranslated in both locales.
 */
export const certifications = [{ id: 'aws-technical-essentials', badge: 'AWS' }];
