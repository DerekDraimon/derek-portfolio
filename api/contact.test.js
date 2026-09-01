import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Mocked before importing the handler so `api/_lib/resendClient.js` picks
// up the mock constructor instead of hitting the real Resend SDK/network.
const sendMock = vi.fn();
vi.mock('resend', () => {
  class MockResend {
    constructor() {
      this.emails = { send: sendMock };
    }
  }
  return { Resend: MockResend };
});

const { default: handler } = await import('./contact.js');
const { resetRateLimiter } = await import('./_lib/rateLimit.js');

function createReqRes({ method = 'POST', body = {}, ip = '203.0.113.5' } = {}) {
  const req = { method, body, headers: { 'x-forwarded-for': ip } };
  const res = {
    statusCode: undefined,
    body: undefined,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };
  return { req, res };
}

const validPayload = () => ({
  name: 'Derek Visitor',
  email: 'visitor@example.com',
  message: 'Hello, I would like to get in touch about a project.',
  locale: 'en',
  website: '',
  elapsedMs: 5000,
});

describe('POST /api/contact', () => {
  beforeEach(() => {
    sendMock.mockReset();
    sendMock.mockResolvedValue({ data: { id: 'email_1' }, error: null });
    resetRateLimiter();
    vi.stubEnv('RESEND_API_KEY', 're_test_key');
    vi.stubEnv('CONTACT_TO_EMAIL', 'derekzabaleta10@gmail.com');
    vi.stubEnv('CONTACT_FROM_EMAIL', 'onboarding@resend.dev');
    delete process.env.CONTACT_CONFIRMATION_ENABLED;
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    delete process.env.CONTACT_CONFIRMATION_ENABLED;
  });

  it('rejects non-POST methods with 405', async () => {
    const { req, res } = createReqRes({ method: 'GET' });
    await handler(req, res);
    expect(res.statusCode).toBe(405);
    expect(res.body).toEqual({ ok: false, error: 'method_not_allowed' });
    expect(sendMock).not.toHaveBeenCalled();
  });

  it('returns 400 with field errors for malformed input, and sends no email', async () => {
    const { req, res } = createReqRes({ body: { ...validPayload(), email: '' } });
    await handler(req, res);
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ ok: false, error: 'invalid', fields: { email: 'required' } });
    expect(sendMock).not.toHaveBeenCalled();
  });

  describe('spam mitigation', () => {
    it('silently accepts a honeypot-filled submission without sending email', async () => {
      const { req, res } = createReqRes({ body: { ...validPayload(), website: 'http://spam.example' } });
      await handler(req, res);
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ ok: true, confirmation: 'skipped' });
      expect(sendMock).not.toHaveBeenCalled();
    });

    it('silently accepts a too-fast submission without sending email', async () => {
      const { req, res } = createReqRes({ body: { ...validPayload(), elapsedMs: 500 } });
      await handler(req, res);
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ ok: true, confirmation: 'skipped' });
      expect(sendMock).not.toHaveBeenCalled();
    });

    it('does not distinguish a spam rejection from a slow-enough success in status code', async () => {
      const { req, res } = createReqRes({ body: { ...validPayload(), website: 'trap' } });
      await handler(req, res);
      // Same 200 shape as a real success — no signal a bot could use to adapt.
      expect(res.statusCode).toBe(200);
      expect(res.body.ok).toBe(true);
    });
  });

  describe('confirmation flag OFF (default/unset)', () => {
    it('sends only the owner email and reports confirmation:"skipped" when the flag is unset', async () => {
      const { req, res } = createReqRes({ body: validPayload() });
      await handler(req, res);
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ ok: true, confirmation: 'skipped' });
      expect(sendMock).toHaveBeenCalledTimes(1);
      expect(sendMock.mock.calls[0][0].to).toBe('derekzabaleta10@gmail.com');
    });

    it.each(['false', '0', 'yes', 'TRUE'])(
      'treats CONTACT_CONFIRMATION_ENABLED=%s as OFF (only the exact string "true" enables it)',
      async (flagValue) => {
        process.env.CONTACT_CONFIRMATION_ENABLED = flagValue;
        const { req, res } = createReqRes({ body: validPayload() });
        await handler(req, res);
        expect(res.body).toEqual({ ok: true, confirmation: 'skipped' });
        expect(sendMock).toHaveBeenCalledTimes(1);
      },
    );
  });

  describe('confirmation flag ON', () => {
    beforeEach(() => {
      process.env.CONTACT_CONFIRMATION_ENABLED = 'true';
    });

    it('sends both emails and reports confirmation:"sent" when the visitor send succeeds', async () => {
      const { req, res } = createReqRes({ body: validPayload() });
      await handler(req, res);
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ ok: true, confirmation: 'sent' });
      expect(sendMock).toHaveBeenCalledTimes(2);
      expect(sendMock.mock.calls[0][0].to).toBe('derekzabaleta10@gmail.com');
      expect(sendMock.mock.calls[1][0].to).toBe('visitor@example.com');
    });

    it('reports confirmation:"failed" (owner still delivered) when the visitor send is rejected', async () => {
      sendMock
        .mockResolvedValueOnce({ data: { id: 'owner_1' }, error: null })
        .mockResolvedValueOnce({ data: null, error: { message: 'domain not verified' } });
      const { req, res } = createReqRes({ body: validPayload() });
      await handler(req, res);
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ ok: true, confirmation: 'failed' });
      expect(sendMock).toHaveBeenCalledTimes(2);
    });

    it('reports confirmation:"failed" when the visitor send throws', async () => {
      sendMock
        .mockResolvedValueOnce({ data: { id: 'owner_1' }, error: null })
        .mockRejectedValueOnce(new Error('network blip'));
      const { req, res } = createReqRes({ body: validPayload() });
      await handler(req, res);
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ ok: true, confirmation: 'failed' });
    });

    it('selects the Spanish visitor template for locale "es" and English for "en"', async () => {
      const { req, res } = createReqRes({ body: { ...validPayload(), locale: 'es' } });
      await handler(req, res);
      const visitorCallArgs = sendMock.mock.calls[1][0];
      expect(visitorCallArgs.text).toMatch(/Gracias/i);

      sendMock.mockClear();
      const { req: reqEn, res: resEn } = createReqRes({ body: { ...validPayload(), locale: 'en' } });
      await handler(reqEn, resEn);
      const visitorCallArgsEn = sendMock.mock.calls[1][0];
      expect(visitorCallArgsEn.text).toMatch(/Thanks/i);
    });
  });

  describe('owner send failure (the gate)', () => {
    it('returns 500 send_failed and never attempts the visitor confirmation, even when the flag is ON', async () => {
      process.env.CONTACT_CONFIRMATION_ENABLED = 'true';
      sendMock.mockResolvedValueOnce({ data: null, error: { message: 'quota exceeded' } });
      const { req, res } = createReqRes({ body: validPayload() });
      await handler(req, res);
      expect(res.statusCode).toBe(500);
      expect(res.body).toEqual({ ok: false, error: 'send_failed' });
      expect(sendMock).toHaveBeenCalledTimes(1);
    });

    it('returns 500 send_failed when the owner send throws', async () => {
      sendMock.mockRejectedValueOnce(new Error('boom'));
      const { req, res } = createReqRes({ body: validPayload() });
      await handler(req, res);
      expect(res.statusCode).toBe(500);
      expect(res.body).toEqual({ ok: false, error: 'send_failed' });
    });

    it('returns 500 send_failed when RESEND_API_KEY is missing, without calling Resend', async () => {
      vi.unstubAllEnvs();
      vi.stubEnv('CONTACT_TO_EMAIL', 'derekzabaleta10@gmail.com');
      vi.stubEnv('CONTACT_FROM_EMAIL', 'onboarding@resend.dev');
      const { req, res } = createReqRes({ body: validPayload() });
      await handler(req, res);
      expect(res.statusCode).toBe(500);
      expect(res.body).toEqual({ ok: false, error: 'send_failed' });
      expect(sendMock).not.toHaveBeenCalled();
    });
  });

  it('strips CR/LF from the name before it reaches the owner email subject', async () => {
    const { req, res } = createReqRes({
      body: { ...validPayload(), name: "Derek\r\nBcc: evil@example.com" },
    });
    await handler(req, res);
    const ownerSubject = sendMock.mock.calls[0][0].subject;
    expect(ownerSubject).not.toMatch(/[\r\n]/);
    expect(ownerSubject).toContain('Bcc: evil@example.com'); // stripped, not deleted — just neutralized
  });

  it('rejects a 6th submission from the same IP within the rate-limit window with 429', async () => {
    for (let i = 0; i < 5; i += 1) {
      const { req, res } = createReqRes({ body: validPayload(), ip: '198.51.100.9' });
      await handler(req, res);
      expect(res.statusCode).toBe(200);
    }
    const { req, res } = createReqRes({ body: validPayload(), ip: '198.51.100.9' });
    await handler(req, res);
    expect(res.statusCode).toBe(429);
    expect(res.body).toEqual({ ok: false, error: 'rate_limited' });
  });
});
