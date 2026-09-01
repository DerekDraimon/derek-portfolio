const DEFAULT_MAX_ROTATE = 24;
const DEFAULT_HOVER_SCALE = 1.04;

export const IDENTITY_TILT = { rotX: 0, rotY: 0, scale: 1 };

/**
 * Pure 3D-tilt math for the portrait hover effect.
 * @param {number} px - pointer x offset within the element, 0..1
 * @param {number} py - pointer y offset within the element, 0..1
 * @param {{reduced?: boolean, maxRotate?: number, hoverScale?: number}} [options]
 * @returns {{rotX: number, rotY: number, scale: number}}
 */
export function computeTilt(px, py, options = {}) {
  const { reduced = false, maxRotate = DEFAULT_MAX_ROTATE, hoverScale = DEFAULT_HOVER_SCALE } = options;

  if (reduced) {
    return { ...IDENTITY_TILT };
  }

  const rotY = (px - 0.5) * maxRotate;
  const rotX = (0.5 - py) * maxRotate;
  return { rotX, rotY, scale: hoverScale };
}

/** Formats a tilt result into the CSS `transform` string used by the portrait frame. */
export function tiltTransformString({ rotX, rotY, scale }) {
  return `rotateY(${rotY}deg) rotateX(${rotX}deg) scale(${scale})`;
}
