import { useEffect, useState } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

/**
 * Tracks the user's `prefers-reduced-motion` preference reactively.
 * Consolidates what were 3 duplicated `window.matchMedia(QUERY).matches`
 * inline reads across the particle field, cursor glow, and portrait tilt effects.
 * @returns {boolean}
 */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(() => window.matchMedia(QUERY).matches);

  useEffect(() => {
    const mql = window.matchMedia(QUERY);

    function handleChange(event) {
      setReduced(event.matches);
    }

    mql.addEventListener('change', handleChange);
    return () => mql.removeEventListener('change', handleChange);
  }, []);

  return reduced;
}
