import { useEffect, useRef, useState } from 'react';
import { validateContactForm } from '../lib/validateContactForm.js';
import { submitContact } from '../lib/submitContact.js';
import { useTranslation } from '../i18n/useTranslation.js';

const INITIAL_FORM = { name: '', email: '', message: '', website: '' };

/**
 * Renders a field's validation error, if any. Declared at module scope
 * (not inside `ContactForm`) so it stays a stable component reference
 * across renders instead of being recreated on every keystroke.
 */
function FieldError({ id, code, t }) {
  if (!code) return null;
  return (
    <p id={id} className="dz-field-error">
      {t(`contact.errors.${code}`)}
    </p>
  );
}

/**
 * "Invócame" / "Summon me" contact form. Client-side validation reuses
 * the same `validateContactForm` the server re-runs; submission posts to
 * `/api/contact` via `submitContact.js`. Two anti-bot signals travel with
 * every submission (design D3/D4): a honeypot field (`website`, always
 * empty for a real visitor) and `elapsedMs`, the time since this
 * component mounted, computed client-side to stay immune to clock skew.
 */
export default function ContactForm() {
  const { t, locale } = useTranslation();
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  // Captured in an effect (not inline during render) so the render body
  // stays pure — `Date.now()` is only ever called as a side effect.
  const mountedAtRef = useRef(0);
  useEffect(() => {
    mountedAtRef.current = Date.now();
  }, []);

  const isSending = status === 'sending';

  function handleFormChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function handleFormSubmit(e) {
    e.preventDefault();
    if (isSending) return;

    const { valid, errors: fieldErrors } = validateContactForm(form);
    if (!valid) {
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setStatus('sending');

    const elapsedMs = Date.now() - mountedAtRef.current;
    try {
      const result = await submitContact({
        name: form.name.trim(),
        email: form.email.trim(),
        message: form.message.trim(),
        locale,
        website: form.website,
        elapsedMs,
      });
      setStatus(result.ok ? 'success' : 'error');
    } catch {
      // `submitContact` already catches its own network/parse failures and
      // resolves `{ok:false}` — this guards against a future change (or a
      // test double) that rejects instead, so the UI never gets stuck on
      // "Sending…" or crashes the component tree.
      setStatus('error');
    }
  }

  function fieldProps(name) {
    const hasError = Boolean(errors[name]);
    return {
      name,
      value: form[name],
      onChange: handleFormChange,
      'aria-invalid': hasError,
      'aria-describedby': hasError ? `dz-${name}-error` : undefined,
    };
  }

  return (
    <section id="contact" className="dz-chapter">
      <div className="dz-wrap">
        <div className="dz-chapter-mark">
          <span className="num">VI</span>
          <h2>{t('contact.heading')}</h2>
        </div>
        <p className="intro">{t('contact.intro')}</p>

        <form className="dz-form" onSubmit={handleFormSubmit} noValidate>
          {/* Honeypot: invisible to real visitors (no label, off the
              tab order, unstyled for screen readers to skip), but a
              naive bot that blindly fills every input will trip it. */}
          <div className="dz-honeypot" aria-hidden="true">
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={form.website}
              onChange={handleFormChange}
            />
          </div>

          <div className="dz-field">
            <label htmlFor="dz-name">{t('contact.nameLabel')}</label>
            <input id="dz-name" type="text" required {...fieldProps('name')} />
            <FieldError id="dz-name-error" code={errors.name} t={t} />
          </div>
          <div className="dz-field">
            <label htmlFor="dz-email">{t('contact.emailLabel')}</label>
            <input id="dz-email" type="email" required {...fieldProps('email')} />
            <FieldError id="dz-email-error" code={errors.email} t={t} />
          </div>
          <div className="dz-field">
            <label htmlFor="dz-message">{t('contact.messageLabel')}</label>
            <textarea id="dz-message" rows={4} required {...fieldProps('message')} />
            <FieldError id="dz-message-error" code={errors.message} t={t} />
          </div>

          <div aria-live="polite">
            {status === 'sending' && <p className="dz-form-note">{t('contact.status.sending')}</p>}
            {status === 'success' && <p className="dz-form-note">{t('contact.status.success')}</p>}
            {status === 'error' && (
              <p className="dz-form-note">
                {t('contact.status.error')}{' '}
                <a href="mailto:derekzabaleta10@gmail.com">derekzabaleta10@gmail.com</a>
              </p>
            )}
          </div>

          <div className="dz-form-actions">
            <button type="submit" className="dz-cta primary" disabled={isSending}>
              {isSending ? t('contact.sendingLabel') : t('contact.submit')}
            </button>
          </div>
          <p className="dz-form-note">
            {t('contact.directContactPrefix')} <a href="mailto:derekzabaleta10@gmail.com">derekzabaleta10@gmail.com</a>.
          </p>
        </form>
      </div>
    </section>
  );
}
