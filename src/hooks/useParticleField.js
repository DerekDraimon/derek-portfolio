import { useEffect } from 'react';
import { useReducedMotion } from './useReducedMotion.js';

/**
 * Drives the ambient particle-field canvas animation. Mount/unmount only —
 * exact pixel/animation output is exempt from assertion per the design's
 * test-architecture notes; this is smoke-tested for wiring correctness
 * (draws, schedules frames, cleans up) rather than visual output.
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
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const count = 46;
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.4,
      vx: (Math.random() - 0.5) * 0.1,
      vy: (Math.random() - 0.5) * 0.1,
      a: Math.random() * 0.45 + 0.12,
    }));

    function frame() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        if (!reduced) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0) p.x = canvas.width;
          if (p.x > canvas.width) p.x = 0;
          if (p.y < 0) p.y = canvas.height;
          if (p.y > canvas.height) p.y = 0;
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
