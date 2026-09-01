// NOTE on the `../src/lib/validateContactForm.js` import: Vercel's Node.js
// runtime traces local file imports (via @vercel/nft) when it bundles a
// function, so a plain-JS, dependency-free module living outside `api/`
// is included automatically — no duplication needed. This keeps client
// and server validation as a single source of truth (design's stated
// goal). If a future Vercel build ever fails to trace this import, the
// fallback is to inline a minimal copy of `validateContactForm` here with
// a comment pointing back at this note.
import { validateContactForm } from '../src/lib/validateContactForm.js';
import { getResendClient } from './_lib/resendClient.js';
import { buildOwnerEmail, buildVisitorEmail } from './_lib/emailTemplates.js';
import { getClientIp, isRateLimited } from './_lib/rateLimit.js';

// Anything faster than this is treated as a bot (design D3/D4). The
// client computes and sends the elapsed duration itself rather than a
// timestamp, so clock skew between visitor and server can't produce a
// false accept/reject.
const MIN_ELAPSED_MS = 3000;

/**
 * `POST /api/contact` — see design's "API Contract" section for the full
 * request/response/status matrix. Vercel Node Function (CommonJS/ESM
 * default export), not a Vite-bundled module — `npm run dev` alone does
 * NOT execute this file; use `vercel dev` (see README) for local testing.
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  const body = req.body || {};
  const { name = '', email = '', message = '', locale, website = '', elapsedMs } = body;

  // Spam mitigation (design D3): a silent 200 with the SAME shape a real
  // success would use — a distinguishable error would teach a bot how to
  // pass, and this way there is zero adaptive signal.
  if (website) {
    return res.status(200).json({ ok: true, confirmation: 'skipped' });
  }
  if (typeof elapsedMs !== 'number' || elapsedMs < MIN_ELAPSED_MS) {
    return res.status(200).json({ ok: true, confirmation: 'skipped' });
  }

  const { valid, errors } = validateContactForm({ name, email, message });
  if (!valid) {
    return res.status(400).json({ ok: false, error: 'invalid', fields: errors });
  }

  if (isRateLimited(getClientIp(req))) {
    return res.status(429).json({ ok: false, error: 'rate_limited' });
  }

  const resend = getResendClient();
  if (!resend) {
    console.error('contact_send_failed: RESEND_API_KEY is not configured');
    return res.status(500).json({ ok: false, error: 'send_failed' });
  }

  const trimmedName = name.trim();
  const trimmedEmail = email.trim();
  const trimmedMessage = message.trim();
  const activeLocale = locale === 'en' ? 'en' : 'es';

  // Owner notification is the gate: it is the only send that is awaited
  // and that can fail the response (design D1/D2).
  try {
    const ownerResult = await resend.emails.send(
      buildOwnerEmail({ name: trimmedName, email: trimmedEmail, message: trimmedMessage }),
    );
    if (ownerResult.error) {
      console.error('owner_send_failed', ownerResult.error);
      return res.status(500).json({ ok: false, error: 'send_failed' });
    }
  } catch (err) {
    console.error('owner_send_failed', err);
    return res.status(500).json({ ok: false, error: 'send_failed' });
  }

  // Visitor confirmation: a branch, not an error handler. When the flag
  // is off (the v1 default), this block is never entered — no second
  // Resend call is made at all, and the response reports "skipped".
  let confirmation = 'skipped';
  if (process.env.CONTACT_CONFIRMATION_ENABLED === 'true') {
    try {
      const visitorResult = await resend.emails.send(
        buildVisitorEmail({ name: trimmedName, email: trimmedEmail, locale: activeLocale }),
      );
      if (visitorResult.error) {
        console.error('confirmation_send_failed', visitorResult.error);
        confirmation = 'failed';
      } else {
        confirmation = 'sent';
      }
    } catch (err) {
      console.error('confirmation_send_failed', err);
      confirmation = 'failed';
    }
  }

  return res.status(200).json({ ok: true, confirmation });
}
