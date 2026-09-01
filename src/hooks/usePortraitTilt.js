import { useCallback, useRef } from 'react';
import { computeTilt, tiltTransformString, IDENTITY_TILT } from '../lib/tiltTransform.js';
import { useReducedMotion } from './useReducedMotion.js';

/**
 * Wires the portrait frame's 3D tilt effect: DOM ref + mousemove/mouseleave
 * handlers, delegating the actual rotation math to the pure `tiltTransform`
 * module so it stays independently testable without refs/DOM.
 * @returns {{ref: import('react').RefObject, handleMove: Function, handleLeave: Function}}
 */
export function usePortraitTilt() {
  const ref = useRef(null);
  const reduced = useReducedMotion();

  const handleMove = useCallback(
    (event) => {
      if (reduced) return;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;
      el.style.transform = tiltTransformString(computeTilt(px, py, { reduced }));
    },
    [reduced]
  );

  const handleLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = tiltTransformString(IDENTITY_TILT);
  }, []);

  return { ref, handleMove, handleLeave };
}
