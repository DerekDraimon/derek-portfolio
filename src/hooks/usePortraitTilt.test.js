import { describe, expect, it, vi, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePortraitTilt } from './usePortraitTilt.js';

function makeFrameElement() {
  return {
    getBoundingClientRect: () => ({ left: 0, top: 0, width: 200, height: 200 }),
    style: {},
  };
}

describe('usePortraitTilt', () => {
  const original = window.matchMedia;
  afterEach(() => {
    window.matchMedia = original;
  });

  it('sets a rotated transform on the ref element for a corner mousemove offset', () => {
    const { result } = renderHook(() => usePortraitTilt());
    const el = makeFrameElement();
    result.current.ref.current = el;

    act(() => {
      result.current.handleMove({ clientX: 200, clientY: 0 });
    });

    expect(el.style.transform).toBe('rotateY(12deg) rotateX(12deg) scale(1.04)');
  });

  it('resets the transform to identity on mouse leave', () => {
    const { result } = renderHook(() => usePortraitTilt());
    const el = makeFrameElement();
    el.style.transform = 'rotateY(12deg) rotateX(12deg) scale(1.04)';
    result.current.ref.current = el;

    act(() => {
      result.current.handleLeave();
    });

    expect(el.style.transform).toBe('rotateY(0deg) rotateX(0deg) scale(1)');
  });

  it('does not change the transform on mousemove when reduced motion is preferred', () => {
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: true,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
    const { result } = renderHook(() => usePortraitTilt());
    const el = makeFrameElement();
    result.current.ref.current = el;

    act(() => {
      result.current.handleMove({ clientX: 200, clientY: 0 });
    });

    expect(el.style.transform).toBeUndefined();
  });
});
