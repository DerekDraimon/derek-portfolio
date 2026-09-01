import { afterEach, describe, expect, it, vi } from 'vitest';
import { submitContact } from './submitContact.js';

describe('submitContact', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns ok:true with the confirmation status on a successful response', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ ok: true, confirmation: 'skipped' }),
      }),
    );
    const result = await submitContact({ name: 'Ada', email: 'ada@example.com', message: 'Hi', elapsedMs: 5000 });
    expect(result).toEqual({ ok: true, confirmation: 'skipped' });
  });

  it('returns ok:false on a non-2xx response', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({ ok: false, error: 'invalid' }),
      }),
    );
    const result = await submitContact({ name: '', email: '', message: '', elapsedMs: 5000 });
    expect(result).toEqual({ ok: false });
  });

  it('returns ok:false when the network request throws', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network down')));
    const result = await submitContact({ name: 'Ada', email: 'ada@example.com', message: 'Hi', elapsedMs: 5000 });
    expect(result).toEqual({ ok: false });
  });

  it('returns ok:false when the response body is not valid JSON', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.reject(new Error('unexpected end of JSON input')),
      }),
    );
    const result = await submitContact({ name: 'Ada', email: 'ada@example.com', message: 'Hi', elapsedMs: 5000 });
    expect(result).toEqual({ ok: false });
  });

  it('POSTs JSON to /api/contact with the exact given payload', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ ok: true, confirmation: 'sent' }),
    });
    vi.stubGlobal('fetch', fetchMock);
    const payload = {
      name: 'Ada',
      email: 'ada@example.com',
      message: 'Hi',
      locale: 'en',
      website: '',
      elapsedMs: 4200,
    };
    await submitContact(payload);
    expect(fetchMock).toHaveBeenCalledWith('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  });
});
