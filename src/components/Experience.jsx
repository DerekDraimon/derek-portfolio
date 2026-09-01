/**
 * "Las crónicas" section — renders one entry per item from content data
 * (see `src/content/experience.js`).
 * @param {{entries: Array<{when: string, title: string, description: string}>}} props
 */
export default function Experience({ entries }) {
  return (
    <section className="dz-chapter">
      <div className="dz-wrap">
        <div className="dz-chapter-mark">
          <span className="num">III</span>
          <h2>Las crónicas</h2>
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
