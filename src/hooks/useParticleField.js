import { useEffect } from 'react';
import { useReducedMotion } from './useReducedMotion.js';
import { getScaledCanvasSize } from '../lib/canvasDpr.js';

/**
 * Drives the ambient particle-field canvas animation. Mount/unmount only —
 * exact pixel/animation output is exempt from assertion per the design's
 * test-architecture notes; this is smoke-tested for wiring correctness
 * (draws, schedules frames, cleans up) rather than visual output.
 *
 * The canvas backing store is scaled by `devicePixelRatio` (capped at 2,
 * via `getScaledCanvasSize`) so the particle field renders crisp on
 * retina/high-DPI displays instead of soft/blurry. `ctx.setTransform` then
 * maps drawing coordinates back to CSS-pixel space, so every subsequent
 * `clearRect`/`arc` call and every particle's spawn/wrap bound below stays
 * in CSS pixels (`window.innerWidth`/`innerHeight`) rather than the
 * DPR-scaled backing-store pixels (`canvas.width`/`height`) — using the
 * scaled values there would cluster all particles into the top-left
 * quadrant of the viewport on any DPR > 1 display.
 * @param {import('react').RefObject<HTMLCanvasElement>} canvasRef
 */
export function useParticleField(canvasRef) {
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;
    let particles = [];

    function resize() {
      const { dpr, width, height } = getScaledCanvasSize(
        window.devicePixelRatio,
        window.innerWidth,
        window.innerHeight,
      );
      canvas.width = width;
      canvas.height = height;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    const count = 46;
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.5 + 0.4,
      vx: (Math.random() - 0.5) * 0.1,
      vy: (Math.random() - 0.5) * 0.1,
      a: Math.random() * 0.45 + 0.12,
    }));

    function frame() {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      particles.forEach((p) => {
        if (!reduced) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0) p.x = window.innerWidth;
          if (p.x > window.innerWidth) p.x = 0;
          if (p.y < 0) p.y = window.innerHeight;
          if (p.y > window.innerHeight) p.y = 0;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(59,255,181,${p.a})`;
        ctx.shadowColor = 'rgba(59,255,181,0.6)';
        ctx.shadowBlur = 6;
        ctx.fill();
      });
      if (!reduced) raf = requestAnimationFrame(frame);
    }
    frame();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [canvasRef, reduced]);
}
