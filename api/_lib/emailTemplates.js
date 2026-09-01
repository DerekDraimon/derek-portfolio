/**
 * Plain-text Resend payload builders for `/api/contact`. Kept as pure
 * functions (input in, `CreateEmailOptions`-shaped object out) so they
 * can be unit tested without touching the Resend SDK — `api/contact.js`
 * is the only caller that actually sends them.
 */

const OWNER_EMAIL = () => process.env.CONTACT_TO_EMAIL || 'derekzabaleta10@gmail.com';
const FROM_EMAIL = () => process.env.CONTACT_FROM_EMAIL || 'onboarding@resend.dev';

const VISITOR_COPY = {
  es: {
    subject: 'Recibí tu mensaje',
    body: (name) =>
      `Hola ${name},\n\nGracias por escribirme. Voy a revisar tu mensaje y te respondo lo antes posible.\n\nDerek`,
  },
  en: {
    subject: 'I received your message',
    body: (name) =>
      `Hi ${name},\n\nThanks for reaching out. I'll review your message and reply as soon as possible.\n\nDerek`,
  },
};

/** Removes CR/LF so untrusted input can never inject extra email headers via the subject line. */
function stripCrLf(value) {
  return value.replace(/[\r\n]+/g, ' ');
}

/**
 * The always-sent, full-detail notification to the site owner.
 * `replyTo` is safe to set unconditionally here because this is only
 * called after `validateContactForm` has already confirmed `email` has a
 * valid shape (see `api/contact.js`).
 * @param {{name: string, email: string, message: string}} fields
 */
export function buildOwnerEmail({ name, email, message }) {
  const safeName = stripCrLf(name);
  return {
    from: FROM_EMAIL(),
    to: OWNER_EMAIL(),
    replyTo: email,
    subject: `Portfolio contact from ${safeName}`,
    text: `Name: ${safeName}\nEmail: ${email}\n\n${message}`,
  };
}

/**
 * The best-effort visitor confirmation, gated behind
 * `CONTACT_CONFIRMATION_ENABLED` in `api/contact.js`. Composed in the
 * submission's locale (falls back to Spanish for any value other than
 * `'en'`, matching the site-wide default — design D6).
 * @param {{name: string, email: string, locale?: 'es' | 'en'}} fields
 */
export function buildVisitorEmail({ name, email, locale }) {
  const activeLocale = locale === 'en' ? 'en' : 'es';
  const copy = VISITOR_COPY[activeLocale];
  const safeName = stripCrLf(name);
  return {
    from: FROM_EMAIL(),
    to: email,
    subject: copy.subject,
    text: copy.body(safeName),
  };
}
