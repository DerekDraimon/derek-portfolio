import { useTranslation } from '../i18n/useTranslation.js';

/**
 * "Las crónicas" / "The chronicles" section — renders one entry per item
 * from content data. Entry text (`when`/`title`/`description`) is
 * resolved by the caller (App.jsx, via `t()` against each content id) and
 * passed in already translated, so this component stays purely
 * presentational and prop-driven — see `src/content/experience.js`.
 * @param {{entries: Array<{when: string, title: string, description: string}>}} props
 */
export default function Experience({ entries }) {
  const { t } = useTranslation();

  return (
    <section className="dz-chapter">
      <div className="dz-wrap">
        <div className="dz-chapter-mark">
          <span className="num">III</span>
          <h2>{t('experience.heading')}</h2>
        </div>

        {entries.map((entry) => (
          <div className="dz-entry" key={entry.title}>
            <div className="when">{entry.when}</div>
            <h3>{entry.title}</h3>
            <p>{entry.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
