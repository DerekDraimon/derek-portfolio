import { useState } from 'react';
import { Mail, Github, Linkedin } from 'lucide-react';

/**
 * Hero header — name, role, lede, and primary CTAs. Owns the
 * clipboard-copy confirmation state locally since no other component
 * needs it.
 */
export default function Hero() {
  const [heroCopied, setHeroCopied] = useState(false);

  async function handleHeroMailClick() {
    try {
      await navigator.clipboard.writeText('derekzabaleta10@gmail.com');
      setHeroCopied(true);
      setTimeout(() => setHeroCopied(false), 2200);
    } catch {
      // el navegador puede bloquear el portapapeles sin permiso; el enlace mailto sigue ahí como respaldo
    }
  }

  return (
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
  );
}
