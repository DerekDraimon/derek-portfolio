import { useTranslation } from '../i18n/useTranslation.js';

/**
 * "Los artefactos" / "The artifacts" section — renders one card per item
 * from content data. `title`/`description` are resolved by the caller
 * (App.jsx, via `t()` against each content id) and passed in already
 * translated — see `src/content/projects.js`. `tags` are untranslated
 * technology chip labels. Tag chips are omitted entirely when a
 * project's `tags` array is empty.
 * @param {{projects: Array<{title: string, description: string, tags: string[]}>}} props
 */
export default function Projects({ projects }) {
  const { t } = useTranslation();

  return (
    <section className="dz-chapter">
      <div className="dz-wrap">
        <div className="dz-chapter-mark">
          <span className="num">IV</span>
          <h2>{t('projects.heading')}</h2>
        </div>
        <p className="intro">{t('projects.intro')}</p>

        {projects.map((project) => (
          <div className="dz-artefacto" key={project.title}>
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            {project.tags?.length > 0 && (
              <div className="dz-chips mono">
                {project.tags.map((tag) => (
                  <span className="dz-chip" key={tag}>{tag}</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
