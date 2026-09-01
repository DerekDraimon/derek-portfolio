import { useEffect, useRef, useState } from 'react';
import { Mail, Github, Linkedin } from 'lucide-react';
import portraitSrc from './assets/derek-portrait.jpg';

export default function App() {
  const canvasRef = useRef(null);
  const pageGlowRef = useRef(null);
  const portraitRef = useRef(null);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState(null);
  const [heroCopied, setHeroCopied] = useState(false);

  // Ambient particle field, drifting across the whole page
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf;
    let particles = [];

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const count = 46;
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.4,
      vx: (Math.random() - 0.5) * 0.1,
      vy: (Math.random() - 0.5) * 0.1,
      a: Math.random() * 0.45 + 0.12,
    }));

    function frame() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        if (!reduced) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0) p.x = canvas.width;
          if (p.x > canvas.width) p.x = 0;
          if (p.y < 0) p.y = canvas.height;
          if (p.y > canvas.height) p.y = 0;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(59,255,181,${p.a})`;
        ctx.shadowColor = 'rgba(59,255,181,0.6)';
        ctx.shadowBlur = 6;
        ctx.fill();
      });
      if (!reduced) raf = requestAnimationFrame(frame);
    }
    frame();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  // Cursor-following glow, across the whole page
  useEffect(() => {
    const glow = pageGlowRef.current;
    if (!glow) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let gx = mx;
    let gy = my;
    let raf;

    function onMove(e) {
      mx = e.clientX;
      my = e.clientY;
    }
    window.addEventListener('mousemove', onMove);

    function tick() {
      gx += (mx - gx) * 0.06;
      gy += (my - gy) * 0.06;
      glow.style.transform = `translate(${gx - 180}px, ${gy - 180}px)`;
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  function handlePortraitMove(e) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = portraitRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rotY = (px - 0.5) * 24;
    const rotX = (0.5 - py) * 24;
    el.style.transform = `rotateY(${rotY}deg) rotateX(${rotX}deg) scale(1.04)`;
  }

  function handlePortraitLeave() {
    const el = portraitRef.current;
    if (!el) return;
    el.style.transform = 'rotateY(0deg) rotateX(0deg) scale(1)';
  }

  async function handleHeroMailClick() {
    try {
      await navigator.clipboard.writeText('derekzabaleta10@gmail.com');
      setHeroCopied(true);
      setTimeout(() => setHeroCopied(false), 2200);
    } catch {
      // el navegador puede bloquear el portapapeles sin permiso; el enlace mailto sigue ahí como respaldo
    }
  }

  function handleFormChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function handleFormSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
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
    <div className="dz">
      <canvas ref={canvasRef} className="dz-particles" />
      <div className="dz-page-glow" ref={pageGlowRef} />

      <main className="dz-content">
        <header className="dz-hero">
          <div className="dz-wrap">
            <svg className="dz-sigil" viewBox="0 0 140 140" aria-hidden="true">
              <circle className="draw" cx="70" cy="70" r="58" />
              <path className="draw" d="M 70 12 L 122 100 L 18 100 Z" />
              <text x="70" y="80" textAnchor="middle">DZ</text>
            </svg>

            <h1>Derek Zabaleta</h1>
            <div className="role">Full Stack Developer — .NET &amp; React</div>

            <p className="lede">
              Antes de escribir una línea, trazo el sistema completo en la cabeza: sus capas,
              sus dependencias, el punto exacto donde algo puede romperse. Luego lo construyo —
              con .NET, con React, con la misma disciplina con la que se traza un sello.
            </p>

            <p className="loc">Medellín, Colombia</p>

            <div className="ctas">
              <a className="dz-cta primary" href="mailto:derekzabaleta10@gmail.com" onClick={handleHeroMailClick}>
                <Mail size={16} /> {heroCopied ? '¡Correo copiado!' : 'Escríbeme'}
              </a>
              <a className="dz-cta" href="https://github.com/DerekDraimon" target="_blank" rel="noopener noreferrer">
                <Github size={16} /> GitHub
              </a>
              <a className="dz-cta" href="https://linkedin.com/in/davz-dev" target="_blank" rel="noopener noreferrer">
                <Linkedin size={16} /> LinkedIn
              </a>
            </div>
          </div>
        </header>

        <section className="dz-portrait">
          <div className="dz-wrap">
            <div className="frame-wrap">
              <div
                className="frame"
                ref={portraitRef}
                onMouseMove={handlePortraitMove}
                onMouseLeave={handlePortraitLeave}
              >
                <img src={portraitSrc} alt="Derek en una playa de Brasil, de noche" />
                <div className="tint" />
              </div>
            </div>
            <p className="caption">Fuera del código, la playa — Brasil, de noche.</p>
          </div>
        </section>

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
                {[
                  '.NET', 'C#', 'React', 'TypeScript', 'SQL Server', 'RabbitMQ',
                  'Clean Architecture', 'CQRS + MediatR', 'Microservicios',
                  'GitHub Actions', 'JWT', 'Application Insights', 'Azure SQL', 'Blob Storage',
                ].map((t) => (
                  <span className="dz-chip" key={t}>{t}</span>
                ))}
              </div>
            </div>

            <div className="dz-materia-group estudio">
              <h3>En estudio</h3>
              <div className="dz-chips mono">
                {['Docker', 'Kubernetes', 'Azure DevOps', 'AKS', 'OAuth 2.0 / OIDC', 'Windows Forms'].map((t) => (
                  <span className="dz-chip" key={t}>{t}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="dz-chapter">
          <div className="dz-wrap">
            <div className="dz-chapter-mark">
              <span className="num">III</span>
              <h2>Las crónicas</h2>
            </div>

            <div className="dz-entry">
              <div className="when">Hasta agosto de 2026</div>
              <h3>Desarrollador a cargo — cuenta CAFAM, Q10</h3>
              <p>
                Software educativo, dentro de un equipo de cerca de 32 desarrolladores. Buena
                parte de la responsabilidad de ese proyecto recayó sobre mí. En los últimos
                meses el equipo sumó Node.js, React y TypeScript al stack principal de .NET.
              </p>
            </div>

            <div className="dz-entry">
              <div className="when">2021 — 2023</div>
              <h3>Tecnología en Análisis y Desarrollo de Sistemas, SENA</h3>
              <p>Donde empezó todo lo demás.</p>
            </div>
          </div>
        </section>

        <section className="dz-chapter">
          <div className="dz-wrap">
            <div className="dz-chapter-mark">
              <span className="num">IV</span>
              <h2>Los artefactos</h2>
            </div>
            <p className="intro">Proyectos propios, construidos por fuera del trabajo.</p>

            <div className="dz-artefacto">
              <h3>SplitPay</h3>
              <p>
                App personal para dividir gastos compartidos. Frontend en React + TypeScript +
                Vite + Tailwind, como PWA. Backend en .NET 8 Minimal API con Clean Architecture,
                PostgreSQL y MediatR/CQRS. Usa la API de Claude para leer recibos.
              </p>
              <div className="dz-chips mono">
                <span className="dz-chip">React</span>
                <span className="dz-chip">.NET 8</span>
                <span className="dz-chip">PostgreSQL</span>
                <span className="dz-chip">Claude API</span>
              </div>
            </div>

            <div className="dz-artefacto">
              <h3>Ren</h3>
              <p>Proyecto de ERP colaborativo, con módulos de CRM, LMS y financiero.</p>
              <div className="dz-chips mono">
                <span className="dz-chip">CRM</span>
                <span className="dz-chip">LMS</span>
                <span className="dz-chip">Financiero</span>
              </div>
            </div>

            <div className="dz-artefacto">
              <h3>Práctica para entrevistas</h3>
              <p>
                Página web propia que genera preguntas aleatorias — lógica de programación,
                pseudocódigo, Docker, IA — para preparar procesos de selección.
              </p>
            </div>
          </div>
        </section>

        <section className="dz-chapter">
          <div className="dz-wrap">
            <div className="dz-chapter-mark">
              <span className="num">V</span>
              <h2>El sello</h2>
            </div>

            <div className="dz-seal">
              <div className="badge mono">AWS</div>
              <div className="detail">
                <h3>AWS Technical Essentials</h3>
                <p>Certificación</p>
              </div>
            </div>
          </div>
        </section>

        <section className="dz-chapter">
          <div className="dz-wrap">
            <div className="dz-chapter-mark">
              <span className="num">VI</span>
              <h2>Invócame</h2>
            </div>
            <p className="intro">Si el correo no se abre solo, escribe aquí y preparo el mensaje por ti.</p>

            <form className="dz-form" onSubmit={handleFormSubmit}>
              <div className="dz-field">
                <label htmlFor="dz-name">Nombre</label>
                <input id="dz-name" name="name" type="text" value={form.name} onChange={handleFormChange} />
              </div>
              <div className="dz-field">
                <label htmlFor="dz-email">Correo</label>
                <input id="dz-email" name="email" type="email" value={form.email} onChange={handleFormChange} />
              </div>
              <div className="dz-field">
                <label htmlFor="dz-message">Mensaje</label>
                <textarea id="dz-message" name="message" rows={4} value={form.message} onChange={handleFormChange} />
              </div>

              <div aria-live="polite">
                {status === 'error' && <p className="dz-form-note">Completa los tres campos antes de enviar.</p>}
                {status === 'copied' && <p className="dz-form-note">Mensaje copiado — pégalo en un correo a derekzabaleta10@gmail.com.</p>}
                {status === 'copy-error' && <p className="dz-form-note">No pude copiarlo solo — selecciona el texto y cópialo manual.</p>}
              </div>

              <div className="dz-form-actions">
                <button type="submit" className="dz-cta primary">Enviar</button>
              </div>
              <p className="dz-form-note">
                O escríbeme directo a <a href="mailto:derekzabaleta10@gmail.com">derekzabaleta10@gmail.com</a>.
              </p>
            </form>
          </div>
        </section>

        <footer className="dz-colofon">
          <div className="dz-wrap">
            <p className="close">Si algo de esto resuena, hablemos.</p>
            <div className="links">
              <a href="mailto:derekzabaleta10@gmail.com"><Mail size={14} /> derekzabaleta10@gmail.com</a>
              <a href="https://github.com/DerekDraimon" target="_blank" rel="noopener noreferrer"><Github size={14} /> github.com/DerekDraimon</a>
              <a href="https://linkedin.com/in/davz-dev" target="_blank" rel="noopener noreferrer"><Linkedin size={14} /> linkedin.com/in/davz-dev</a>
            </div>
            <p className="loc">Medellín, Colombia</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
