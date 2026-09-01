import { Mail, Github, Linkedin } from 'lucide-react';

/**
 * Site footer — closing line + contact links. Purely presentational,
 * static content only.
 */
export default function Footer() {
  return (
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
  );
}
