import { useEffect } from 'react';
import { useReducedMotion } from './useReducedMotion.js';

/**
 * Drives the cursor-following page glow. Smoke-tested for wiring (listener
 * added/removed, frame scheduled/cancelled, reduced-motion short-circuit)
 * rather than the exact glow position/animation, per the design's
 * test-architecture notes.
 * @param {import('react').RefObject<HTMLElement>} glowRef
 */
export function useCursorGlow(glowRef) {
  const reduced = useReducedMotion();

  useEffect(() => {
    const glow = glowRef.current;
    if (!glow || reduced) return;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let gx = mx;
    let gy = my;
    let raf;

    function onMove(event) {
      mx = event.clientX;
      my = event.clientY;
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
  }, [glowRef, reduced]);
}
