/**
 * Content IDs + tag chips for the "Los artefactos" / "The artifacts"
 * section, in display order. Per the i18n design (D7), `title`/`description`
 * are translatable prose and live in `src/i18n/{es,en}.json` under
 * `projects.entries.<id>`, keyed by this `id`. `tags` are technology/chip
 * labels (proper nouns/acronyms) and stay untranslated in both locales —
 * `tags: []` (not omitted) keeps a consistent shape for projects with no
 * chips.
 */
export const projects = [
  { id: 'splitpay', tags: ['React', '.NET 8', 'PostgreSQL', 'Claude API'] },
  { id: 'ren', tags: ['CRM', 'LMS', 'Financiero'] },
  { id: 'interview-practice', tags: [] },
];
