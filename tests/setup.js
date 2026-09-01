import '@testing-library/jest-dom';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// jsdom does not implement matchMedia. Components/hooks that read
// prefers-reduced-motion or hover/pointer capability need a stub.
if (!window.matchMedia) {
  window.matchMedia = vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated API, still called by some libs
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

// jsdom does not implement canvas 2D context. useParticleField/useCursorGlow
// call getContext('2d') on mount, so the mount/unmount smoke tests need a stub.
if (!HTMLCanvasElement.prototype.getContext) {
  HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
    clearRect: vi.fn(),
    fillRect: vi.fn(),
    beginPath: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
    createRadialGradient: vi.fn(() => ({ addColorStop: vi.fn() })),
    setTransform: vi.fn(),
    scale: vi.fn(),
  }));
}

// jsdom does not implement requestAnimationFrame/cancelAnimationFrame.
if (!window.requestAnimationFrame) {
  window.requestAnimationFrame = vi.fn((callback) => setTimeout(callback, 0));
}
if (!window.cancelAnimationFrame) {
  window.cancelAnimationFrame = vi.fn((id) => clearTimeout(id));
}

afterEach(() => {
  cleanup();
  window.localStorage.clear();
});
