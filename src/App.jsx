import { useRef } from 'react';
import { useParticleField } from './hooks/useParticleField.js';
import { useCursorGlow } from './hooks/useCursorGlow.js';
import { LanguageProvider } from './i18n/LanguageProvider.jsx';
import { useTranslation } from './i18n/useTranslation.js';
import LanguageToggle from './components/LanguageToggle.jsx';
import Hero from './components/Hero.jsx';
import Portrait from './components/Portrait.jsx';
import Skills from './components/Skills.jsx';
import Experience from './components/Experience.jsx';
import Projects from './components/Projects.jsx';
import Certifications from './components/Certifications.jsx';
import ContactForm from './components/ContactForm.jsx';
import Footer from './components/Footer.jsx';
import { skills } from './content/skills.js';
import { experience } from './content/experience.js';
import { projects } from './content/projects.js';
import { certifications } from './content/certifications.js';

/**
 * Composition root. Wraps the tree in `LanguageProvider` so every section
 * can call `useTranslation()`, then delegates rendering to `AppShell`.
 */
export default function App() {
  return (
    <LanguageProvider>
      <AppShell />
    </LanguageProvider>
  );
}

/**
 * Owns the page-level canvas/glow refs that `useParticleField`/
 * `useCursorGlow` need (they target DOM nodes outside `<main>`), resolves
 * the id-keyed content from `src/content/` into fully-translated entry
 * arrays via `t()` (per the i18n design's content/i18n split — D7), and
 * renders each section as its own component. `Portrait` and `ContactForm`
 * own their hook wiring (`usePortraitTilt`) and local state internally
 * since nothing outside those components needs it.
 */
function AppShell() {
  const { t } = useTranslation();
  const canvasRef = useRef(null);
  const pageGlowRef = useRef(null);

  // Ambient particle field, drifting across the whole page
  useParticleField(canvasRef);

  // Cursor-following glow, across the whole page
  useCursorGlow(pageGlowRef);

  const experienceEntries = experience.map(({ id }) => ({
    when: t(`experience.entries.${id}.when`),
    title: t(`experience.entries.${id}.title`),
    description: t(`experience.entries.${id}.description`),
  }));

  const projectEntries = projects.map(({ id, tags }) => ({
    title: t(`projects.entries.${id}.title`),
    description: t(`projects.entries.${id}.description`),
    tags,
  }));

  const certificationEntries = certifications.map(({ id, badge }) => ({
    badge,
    title: t(`certifications.entries.${id}.title`),
    subtitle: t(`certifications.entries.${id}.subtitle`),
  }));

  return (
    <div className="dz">
      <LanguageToggle />
      <canvas ref={canvasRef} className="dz-particles" />
      <div className="dz-page-glow" ref={pageGlowRef} />

      <main className="dz-content">
        <Hero />
        <Portrait />
        <Skills daily={skills.daily} studying={skills.studying} />
        <Experience entries={experienceEntries} />
        <Projects projects={projectEntries} />
        <Certifications certifications={certificationEntries} />
        <ContactForm />
        <Footer />
      </main>
    </div>
  );
}
