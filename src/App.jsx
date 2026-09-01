import { useRef } from 'react';
import { useParticleField } from './hooks/useParticleField.js';
import { useCursorGlow } from './hooks/useCursorGlow.js';
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
 * Composition root. Owns only the page-level canvas/glow refs that
 * `useParticleField`/`useCursorGlow` need (they target DOM nodes outside
 * `<main>`), imports the frozen v1 content from `src/content/`, and
 * renders each section as its own component. `Portrait` and `ContactForm`
 * own their hook wiring (`usePortraitTilt`) and local state internally
 * since nothing outside those components needs it.
 */
export default function App() {
  const canvasRef = useRef(null);
  const pageGlowRef = useRef(null);

  // Ambient particle field, drifting across the whole page
  useParticleField(canvasRef);

  // Cursor-following glow, across the whole page
  useCursorGlow(pageGlowRef);

  return (
    <div className="dz">
      <canvas ref={canvasRef} className="dz-particles" />
      <div className="dz-page-glow" ref={pageGlowRef} />

      <main className="dz-content">
        <Hero />
        <Portrait />
        <Skills daily={skills.daily} studying={skills.studying} />
        <Experience entries={experience} />
        <Projects projects={projects} />
        <Certifications certifications={certifications} />
        <ContactForm />
        <Footer />
      </main>
    </div>
  );
}
