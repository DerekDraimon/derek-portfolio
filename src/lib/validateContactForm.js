/**
 * Non-empty/trim validation for the contact form, extracted from
 * `App.jsx`'s `handleFormSubmit`. Scoped to exactly the current App.jsx
 * behavior (all three fields required, whitespace-only rejected) — see
 * apply-progress deviations for why email-format/length rules from the
 * original task scenarios are deferred to slice 4's server contract.
 * @param {{name?: string, email?: string, message?: string}} fields
 * @returns {{valid: boolean, errors: Record<string, 'required'>}}
 */
export function validateContactForm({ name = '', email = '', message = '' } = {}) {
  const errors = {};
  if (!name.trim()) errors.name = 'required';
  if (!email.trim()) errors.email = 'required';
  if (!message.trim()) errors.message = 'required';
  return { valid: Object.keys(errors).length === 0, errors };
}
