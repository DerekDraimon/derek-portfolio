import { describe, expect, it, vi, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useParticleField } from './useParticleField.js';

function makeCanvasRef() {
  const ctx = {
    clearRect: vi.fn(),
    beginPath: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
    setTransform: vi.fn(),
  };
  const canvas = { getContext: vi.fn(() => ctx), width: 0, height: 0 };
  return { ref: { current: canvas }, ctx, canvas };
}

describe('useParticleField', () => {
  const originalMatchMedia = window.matchMedia;
  const originalDpr = window.devicePixelRatio;
  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    window.devicePixelRatio = originalDpr;
  });

  it('draws 46 particles onto the canvas 2d context on mount', () => {
    const { ref, ctx } = makeCanvasRef();
    renderHook(() => useParticleField(ref));
    expect(ctx.clearRect).toHaveBeenCalled();
    expect(ctx.arc).toHaveBeenCalledTimes(46);
  });

  it('schedules the next animation frame when motion is not reduced', () => {
    const rafSpy = vi.spyOn(window, 'requestAnimationFrame');
    const { ref } = makeCanvasRef();
    renderHook(() => useParticleField(ref));
    expect(rafSpy).toHaveBeenCalled();
    rafSpy.mockRestore();
  });

  it('does not schedule another frame when prefers-reduced-motion is set', () => {
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: true,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
    const rafSpy = vi.spyOn(window, 'requestAnimationFrame');
    const { ref } = makeCanvasRef();
    renderHook(() => useParticleField(ref));
    expect(rafSpy).not.toHaveBeenCalled();
    rafSpy.mockRestore();
  });

  it('removes the resize listener and cancels the frame on unmount', () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener');
    const cancelSpy = vi.spyOn(window, 'cancelAnimationFrame');
    const { ref } = makeCanvasRef();
    const { unmount } = renderHook(() => useParticleField(ref));
    unmount();
    expect(removeSpy).toHaveBeenCalledWith('resize', expect.any(Function));
    expect(cancelSpy).toHaveBeenCalled();
    removeSpy.mockRestore();
    cancelSpy.mockRestore();
  });

  it('does nothing when the canvas ref is not attached', () => {
    const ref = { current: null };
    expect(() => renderHook(() => useParticleField(ref))).not.toThrow();
  });

  it('scales the canvas backing store by devicePixelRatio and sets a matching context transform', () => {
    window.devicePixelRatio = 2;
    const { ref, ctx, canvas } = makeCanvasRef();
    renderHook(() => useParticleField(ref));
    expect(canvas.width).toBe(window.innerWidth * 2);
    expect(canvas.height).toBe(window.innerHeight * 2);
    expect(ctx.setTransform).toHaveBeenCalledWith(2, 0, 0, 2, 0, 0);
  });

  it('spawns particles within CSS-pixel viewport bounds, not the DPR-scaled backing store', () => {
    // Regression guard: using the DPR-scaled canvas.width/height for spawn
    // bounds instead of window.innerWidth/innerHeight clusters every
    // particle into the top-left quadrant on any DPR > 1 display.
    window.devicePixelRatio = 2;
    const { ref, ctx } = makeCanvasRef();
    renderHook(() => useParticleField(ref));
    const xs = ctx.arc.mock.calls.map(([x]) => x);
    const ys = ctx.arc.mock.calls.map(([, y]) => y);
    expect(xs.every((x) => x <= window.innerWidth)).toBe(true);
    expect(ys.every((y) => y <= window.innerHeight)).toBe(true);
  });
});
