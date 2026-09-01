/**
 * "La materia" section — renders the daily-use and in-study chip lists
 * from content data passed by the caller (see `src/content/skills.js`).
 * @param {{daily: string[], studying: string[]}} props
 */
export default function Skills({ daily, studying }) {
  return (
    <section className="dz-chapter">
      <div className="dz-wrap">
        <div className="dz-chapter-mark">
          <span className="num">II</span>
          <h2>La materia</h2>
        </div>
        <p className="intro">
          Lo que uso todos los días, y lo que apenas estoy empezando a estudiar. Prefiero
          mostrar la línea entre las dos cosas antes que borrarla.
        </p>

        <div className="dz-materia-group">
          <h3>De uso diario</h3>
          <div className="dz-chips mono">
            {daily.map((t) => (
              <span className="dz-chip" key={t}>{t}</span>
            ))}
          </div>
        </div>

        <div className="dz-materia-group estudio">
          <h3>En estudio</h3>
          <div className="dz-chips mono">
            {studying.map((t) => (
              <span className="dz-chip" key={t}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
