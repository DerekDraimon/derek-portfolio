import { Resend } from 'resend';

/**
 * Builds a Resend client from `RESEND_API_KEY`. Returns `null` when the
 * key is missing so `api/contact.js` can fail fast with a clean
 * `send_failed` response instead of letting the SDK throw on a bad key.
 * Constructed fresh per call (no module-level caching) — Resend's client
 * is cheap to create and this keeps `vi.mock('resend')` deterministic
 * across test cases without needing a cache-reset hook.
 * @returns {import('resend').Resend | null}
 */
export function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}
