import { Mail, Github, Linkedin } from 'lucide-react';
import { useTranslation } from '../i18n/useTranslation.js';

/**
 * Site footer — closing line + contact links. Purely presentational,
 * consumes `t()` for the two locale-dependent strings.
 */
export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="dz-colofon">
      <div className="dz-wrap">
        <p className="close">{t('footer.close')}</p>
        <div className="links">
          <a href="mailto:derekzabaleta10@gmail.com"><Mail size={14} /> derekzabaleta10@gmail.com</a>
          <a href="https://github.com/DerekDraimon" target="_blank" rel="noopener noreferrer"><Github size={14} /> github.com/DerekDraimon</a>
          <a href="https://linkedin.com/in/davz-dev" target="_blank" rel="noopener noreferrer"><Linkedin size={14} /> linkedin.com/in/davz-dev</a>
        </div>
        <p className="loc">{t('common.location')}</p>
      </div>
    </footer>
  );
}
