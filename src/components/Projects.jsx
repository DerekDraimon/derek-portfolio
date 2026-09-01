/**
 * "Los artefactos" section — renders one card per item from content data
 * (see `src/content/projects.js`). Tag chips are omitted entirely when a
 * project's `tags` array is empty.
 * @param {{projects: Array<{title: string, description: string, tags: string[]}>}} props
 */
export default function Projects({ projects }) {
  return (
    <section className="dz-chapter">
      <div className="dz-wrap">
        <div className="dz-chapter-mark">
          <span className="num">IV</span>
          <h2>Los artefactos</h2>
        </div>
        <p className="intro">Proyectos propios, construidos por fuera del trabajo.</p>

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
