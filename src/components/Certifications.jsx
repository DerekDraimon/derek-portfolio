/**
 * "El sello" section — renders one badge per certification from content
 * data (see `src/content/certifications.js`).
 * @param {{certifications: Array<{badge: string, title: string, subtitle: string}>}} props
 */
export default function Certifications({ certifications }) {
  return (
    <section className="dz-chapter">
      <div className="dz-wrap">
        <div className="dz-chapter-mark">
          <span className="num">V</span>
          <h2>El sello</h2>
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
