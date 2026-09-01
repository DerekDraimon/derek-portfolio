import portraitSrc from '../assets/derek-portrait.jpg';
import { usePortraitTilt } from '../hooks/usePortraitTilt.js';
import { useTranslation } from '../i18n/useTranslation.js';

/**
 * Portrait frame — owns the tilt-on-hover wiring by calling
 * `usePortraitTilt` directly, since the ref/handlers are only ever
 * consumed by this one DOM element.
 */
export default function Portrait() {
  const { t } = useTranslation();
  const { ref: portraitRef, handleMove, handleLeave } = usePortraitTilt();

  return (
    <section className="dz-portrait">
      <div className="dz-wrap">
        <div className="frame-wrap">
          <div className="frame" ref={portraitRef} onMouseMove={handleMove} onMouseLeave={handleLeave}>
            <img src={portraitSrc} alt={t('portrait.alt')} />
            <div className="tint" />
          </div>
        </div>
        <p className="caption">{t('portrait.caption')}</p>
      </div>
    </section>
  );
}
