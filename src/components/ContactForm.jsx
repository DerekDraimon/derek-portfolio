import { useState } from 'react';
import { validateContactForm } from '../lib/validateContactForm.js';
import { useTranslation } from '../i18n/useTranslation.js';

/**
 * "Invócame" / "Summon me" contact form — client-side validation via the
 * shared `validateContactForm` lib function. Submit behavior is still the
 * placeholder clipboard-copy from the prototype; real email sending is
 * slice 4's job (`api/contact.js` + `src/lib/submitContact.js`).
 */
export default function ContactForm() {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState(null);

  function handleFormChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function handleFormSubmit(e) {
    e.preventDefault();
    const { valid } = validateContactForm(form);
    if (!valid) {
      setStatus('error');
      return;
    }
    const text = `Para: derekzabaleta10@gmail.com\nDe: ${form.name} (${form.email})\n\n${form.message}`;
    try {
      await navigator.clipboard.writeText(text);
      setStatus('copied');
    } catch {
      setStatus('copy-error');
    }
  }

  return (
    <section className="dz-chapter">
      <div className="dz-wrap">
        <div className="dz-chapter-mark">
          <span className="num">VI</span>
          <h2>{t('contact.heading')}</h2>
        </div>
        <p className="intro">{t('contact.intro')}</p>

        <form className="dz-form" onSubmit={handleFormSubmit}>
          <div className="dz-field">
            <label htmlFor="dz-name">{t('contact.nameLabel')}</label>
            <input id="dz-name" name="name" type="text" value={form.name} onChange={handleFormChange} />
          </div>
          <div className="dz-field">
            <label htmlFor="dz-email">{t('contact.emailLabel')}</label>
            <input id="dz-email" name="email" type="email" value={form.email} onChange={handleFormChange} />
          </div>
          <div className="dz-field">
            <label htmlFor="dz-message">{t('contact.messageLabel')}</label>
            <textarea id="dz-message" name="message" rows={4} value={form.message} onChange={handleFormChange} />
          </div>

          <div aria-live="polite">
            {status === 'error' && <p className="dz-form-note">{t('contact.errorStatus')}</p>}
            {status === 'copied' && <p className="dz-form-note">{t('contact.copiedStatus')}</p>}
            {status === 'copy-error' && <p className="dz-form-note">{t('contact.copyErrorStatus')}</p>}
          </div>

          <div className="dz-form-actions">
            <button type="submit" className="dz-cta primary">{t('contact.submit')}</button>
          </div>
          <p className="dz-form-note">
            {t('contact.directContactPrefix')} <a href="mailto:derekzabaleta10@gmail.com">derekzabaleta10@gmail.com</a>.
          </p>
        </form>
      </div>
    </section>
  );
}
