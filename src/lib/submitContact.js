/**
 * POSTs the contact form payload to `/api/contact` and normalizes the
 * result to a plain `{ok, confirmation?}` shape so `ContactForm.jsx`
 * never has to branch on HTTP status codes or distinguish a non-2xx
 * response from a network-level failure — the spec's Failure Fallback UX
 * treats both identically (error message + mailto link).
 * @param {{name:string, email:string, message:string, locale?:string, website?:string, elapsedMs:number}} payload
 * @returns {Promise<{ok:true, confirmation:'sent'|'failed'|'skipped'} | {ok:false}>}
 */
export async function submitContact(payload) {
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      return { ok: false };
    }
    const data = await response.json();
    if (!data || data.ok !== true) {
      return { ok: false };
    }
    return { ok: true, confirmation: data.confirmation };
  } catch {
    return { ok: false };
  }
}
