import { describe, expect, it, vi, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCursorGlow } from './useCursorGlow.js';

function makeGlowRef() {
  return { current: { style: {} } };
}

describe('useCursorGlow', () => {
  const originalMatchMedia = window.matchMedia;
  const originalRaf = window.requestAnimationFrame;
  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    window.requestAnimationFrame = originalRaf;
  });

  it('schedules an animation frame and adds a mousemove listener on mount', () => {
    const rafSpy = vi.spyOn(window, 'requestAnimationFrame');
    const addSpy = vi.spyOn(window, 'addEventListener');
    const ref = makeGlowRef();
    renderHook(() => useCursorGlow(ref));
    expect(rafSpy).toHaveBeenCalled();
    expect(addSpy).toHaveBeenCalledWith('mousemove', expect.any(Function));
    rafSpy.mockRestore();
    addSpy.mockRestore();
  });

  it('writes a translate() transform onto the glow element when the scheduled frame runs', () => {
    let capturedTick;
    window.requestAnimationFrame = vi.fn((cb) => {
      capturedTick = cb;
      return 1;
    });
    const ref = makeGlowRef();
    renderHook(() => useCursorGlow(ref));
    expect(capturedTick).toBeInstanceOf(Function);

    act(() => {
      capturedTick();
    });

    expect(ref.current.style.transform).toMatch(/^translate\(-?\d+(\.\d+)?px, -?\d+(\.\d+)?px\)$/);
  });

  it('does not schedule a frame when prefers-reduced-motion is set', () => {
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: true,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
    const rafSpy = vi.spyOn(window, 'requestAnimationFrame');
    const ref = makeGlowRef();
    renderHook(() => useCursorGlow(ref));
    expect(rafSpy).not.toHaveBeenCalled();
    expect(ref.current.style.transform).toBeUndefined();
    rafSpy.mockRestore();
  });

  it('removes the mousemove listener and cancels the frame on unmount', () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener');
    const cancelSpy = vi.spyOn(window, 'cancelAnimationFrame');
    const ref = makeGlowRef();
    const { unmount } = renderHook(() => useCursorGlow(ref));
    unmount();
    expect(removeSpy).toHaveBeenCalledWith('mousemove', expect.any(Function));
    expect(cancelSpy).toHaveBeenCalled();
    removeSpy.mockRestore();
    cancelSpy.mockRestore();
  });
});
