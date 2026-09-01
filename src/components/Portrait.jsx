import portraitSrc from '../assets/derek-portrait.jpg';
import { usePortraitTilt } from '../hooks/usePortraitTilt.js';

/**
 * Portrait frame — owns the tilt-on-hover wiring by calling
 * `usePortraitTilt` directly, since the ref/handlers are only ever
 * consumed by this one DOM element.
 */
export default function Portrait() {
  const { ref: portraitRef, handleMove, handleLeave } = usePortraitTilt();

  return (
    <section className="dz-portrait">
      <div className="dz-wrap">
        <div className="frame-wrap">
          <div className="frame" ref={portraitRef} onMouseMove={handleMove} onMouseLeave={handleLeave}>
            <img src={portraitSrc} alt="Derek en una playa de Brasil, de noche" />
            <div className="tint" />
          </div>
        </div>
        <p className="caption">Fuera del código, la playa — Brasil, de noche.</p>
      </div>
    </section>
  );
}
