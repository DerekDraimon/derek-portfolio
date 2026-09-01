import { useTranslation } from '../i18n/useTranslation.js';

/**
 * "La materia" / "The craft" section — renders the daily-use and
 * in-study chip lists from content data passed by the caller (see
 * `src/content/skills.js`). Chip labels are technology names (proper
 * nouns/acronyms) and are intentionally not translated.
 * @param {{daily: string[], studying: string[]}} props
 */
export default function Skills({ daily, studying }) {
  const { t } = useTranslation();

  return (
    <section className="dz-chapter">
      <div className="dz-wrap">
        <div className="dz-chapter-mark">
          <span className="num">II</span>
          <h2>{t('skills.heading')}</h2>
        </div>
        <p className="intro">{t('skills.intro')}</p>

        <div className="dz-materia-group">
          <h3>{t('skills.dailyHeading')}</h3>
          <div className="dz-chips mono">
            {daily.map((chip) => (
              <span className="dz-chip" key={chip}>{chip}</span>
            ))}
          </div>
        </div>

        <div className="dz-materia-group estudio">
          <h3>{t('skills.studyingHeading')}</h3>
          <div className="dz-chips mono">
            {studying.map((chip) => (
              <span className="dz-chip" key={chip}>{chip}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
