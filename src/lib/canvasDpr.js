/**
 * Computes the DPR-scaled backing-store size for a full-viewport canvas.
 *
 * The canvas element's CSS (displayed) size is controlled entirely by
 * `.dz-particles` (`position:fixed; inset:0; width/height:100%`) and is
 * NOT touched here — only the backing-store pixel dimensions (`canvas.width`
 * / `canvas.height`) and the resulting device-pixel ratio are computed, so
 * the canvas renders crisp on retina/high-DPI displays instead of being
 * upscaled and blurry. The ratio is capped at 2 to avoid excessive
 * fill-rate cost on very high-density displays (e.g. DPR 3+ phones).
 *
 * @param {number|null|undefined} devicePixelRatio - `window.devicePixelRatio`
 * @param {number} cssWidth - viewport/CSS width in CSS pixels (e.g. `window.innerWidth`)
 * @param {number} cssHeight - viewport/CSS height in CSS pixels (e.g. `window.innerHeight`)
 * @returns {{dpr: number, width: number, height: number}} the effective ratio
 *   (already capped) and the backing-store pixel dimensions to assign to
 *   `canvas.width`/`canvas.height`
 */
export function getScaledCanvasSize(devicePixelRatio, cssWidth, cssHeight) {
  const dpr = Math.min(devicePixelRatio || 1, 2);
  return {
    dpr,
    width: Math.round(cssWidth * dpr),
    height: Math.round(cssHeight * dpr),
  };
}
