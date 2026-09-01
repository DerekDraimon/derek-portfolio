import { describe, expect, it, vi, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useReducedMotion } from './useReducedMotion.js';

function mockMatchMedia(matches) {
  const listeners = new Set();
  return {
    matches,
    media: '(prefers-reduced-motion: reduce)',
    addEventListener: (event, handler) => listeners.add(handler),
    removeEventListener: (event, handler) => listeners.delete(handler),
    dispatchEvent: (e) => listeners.forEach((handler) => handler(e)),
  };
}

describe('useReducedMotion', () => {
  const original = window.matchMedia;
  afterEach(() => {
    window.matchMedia = original;
  });

  it('returns true when the user prefers reduced motion', () => {
    window.matchMedia = vi.fn(() => mockMatchMedia(true));
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(true);
  });

  it('returns false when the user does not prefer reduced motion', () => {
    window.matchMedia = vi.fn(() => mockMatchMedia(false));
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);
  });

  it('updates when the media query change event fires', () => {
    const mql = mockMatchMedia(false);
    window.matchMedia = vi.fn(() => mql);
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);

    act(() => {
      mql.matches = true;
      mql.dispatchEvent({ matches: true });
    });

    expect(result.current).toBe(true);
  });
});
