import { describe, expect, it } from 'vitest';
import { getScaledCanvasSize } from './canvasDpr.js';

describe('getScaledCanvasSize', () => {
  it('scales the backing-store size 1:1 when devicePixelRatio is 1', () => {
    const result = getScaledCanvasSize(1, 1024, 768);
    expect(result).toEqual({ dpr: 1, width: 1024, height: 768 });
  });

  it('scales the backing-store size by devicePixelRatio when it is 2', () => {
    const result = getScaledCanvasSize(2, 1024, 768);
    expect(result).toEqual({ dpr: 2, width: 2048, height: 1536 });
  });

  it('caps the effective ratio at 2 for very high-density displays', () => {
    const result = getScaledCanvasSize(3.5, 1000, 500);
    expect(result).toEqual({ dpr: 2, width: 2000, height: 1000 });
  });

  it('falls back to 1 when devicePixelRatio is falsy (0, undefined, null)', () => {
    expect(getScaledCanvasSize(0, 800, 600)).toEqual({ dpr: 1, width: 800, height: 600 });
    expect(getScaledCanvasSize(undefined, 800, 600)).toEqual({ dpr: 1, width: 800, height: 600 });
    expect(getScaledCanvasSize(null, 800, 600)).toEqual({ dpr: 1, width: 800, height: 600 });
  });

  it('rounds fractional pixel dimensions to whole numbers', () => {
    const result = getScaledCanvasSize(1.5, 375, 667);
    expect(Number.isInteger(result.width)).toBe(true);
    expect(Number.isInteger(result.height)).toBe(true);
  });
});
