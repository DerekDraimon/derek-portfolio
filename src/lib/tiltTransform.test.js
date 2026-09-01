import { describe, expect, it } from 'vitest';
import { computeTilt, tiltTransformString, IDENTITY_TILT } from './tiltTransform.js';

describe('computeTilt', () => {
  it('returns zero rotation and hover scale at the exact center', () => {
    expect(computeTilt(0.5, 0.5)).toEqual({ rotX: 0, rotY: 0, scale: 1.04 });
  });

  it('returns +12deg rotation on both axes at the bottom-right corner', () => {
    expect(computeTilt(1, 0)).toEqual({ rotX: 12, rotY: 12, scale: 1.04 });
  });

  it('returns -12deg rotation on both axes at the top-left corner', () => {
    expect(computeTilt(0, 1)).toEqual({ rotX: -12, rotY: -12, scale: 1.04 });
  });

  it('returns the identity transform when reduced motion is preferred, regardless of position', () => {
    expect(computeTilt(1, 0, { reduced: true })).toEqual({ rotX: 0, rotY: 0, scale: 1 });
    expect(computeTilt(0, 1, { reduced: true })).toEqual({ rotX: 0, rotY: 0, scale: 1 });
  });
});

describe('tiltTransformString', () => {
  it('formats a tilt result into a CSS transform string', () => {
    expect(tiltTransformString({ rotX: 12, rotY: -8, scale: 1.04 })).toBe(
      'rotateY(-8deg) rotateX(12deg) scale(1.04)'
    );
  });

  it('formats the identity constant into the reset transform', () => {
    expect(tiltTransformString(IDENTITY_TILT)).toBe('rotateY(0deg) rotateX(0deg) scale(1)');
  });
});
