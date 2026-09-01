import { useTranslation } from '../i18n/useTranslation.js';

/**
 * "El sello" / "The seal" section — renders one badge per certification
 * from content data. `title`/`subtitle` are resolved by the caller
 * (App.jsx, via `t()` against each content id) and passed in already
 * translated — see `src/content/certifications.js`. `badge` is an
 * untranslated proper-noun/acronym label.
 * @param {{certifications: Array<{badge: string, title: string, subtitle: string}>}} props
 */
export default function Certifications({ certifications }) {
  const { t } = useTranslation();

  return (
    <section className="dz-chapter">
      <div className="dz-wrap">
        <div className="dz-chapter-mark">
          <span className="num">V</span>
          <h2>{t('certifications.heading')}</h2>
        </div>

        {certifications.map((cert) => (
          <div className="dz-seal" key={cert.title}>
            <div className="badge mono">{cert.badge}</div>
            <div className="detail">
              <h3>{cert.title}</h3>
              <p>{cert.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
