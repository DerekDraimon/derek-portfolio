/**
 * In-memory, per-IP, best-effort rate limiter for `/api/contact`.
 *
 * KNOWN LIMITATION (per design's Open Questions — durable KV limiting is
 * backlog): this state lives in the function instance's module scope, so
 * it resets on every cold start and is not shared across concurrent
 * instances. It still raises the bar against a naive single-instance
 * abuse loop; it is not a hard guarantee.
 */

const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS_PER_WINDOW = 5;

/** @type {Map<string, number[]>} ip -> timestamps (ms) of recent requests */
let hitsByIp = new Map();

/**
 * Records one request attempt for `ip` and reports whether it exceeds the
 * per-hour budget. Must be called at most once per handled request so the
 * count reflects actual traffic.
 * @param {string} ip
 * @param {number} [now]
 * @returns {boolean} true when this request should be rejected with 429
 */
export function isRateLimited(ip, now = Date.now()) {
  const key = ip || 'unknown';
  const recent = (hitsByIp.get(key) || []).filter((timestamp) => now - timestamp < WINDOW_MS);
  recent.push(now);
  hitsByIp.set(key, recent);
  return recent.length > MAX_REQUESTS_PER_WINDOW;
}

/** Extracts the caller IP from Vercel's forwarded-for header, falling back to the socket. */
export function getClientIp(req) {
  const forwarded = req.headers?.['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim();
  }
  return req.socket?.remoteAddress || 'unknown';
}

/** Test-only: clears all recorded hits so specs don't leak state across cases. */
export function resetRateLimiter() {
  hitsByIp = new Map();
}
