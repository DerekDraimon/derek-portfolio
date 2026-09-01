import { beforeEach, describe, expect, it } from 'vitest';
import { getClientIp, isRateLimited, resetRateLimiter } from './rateLimit.js';

describe('isRateLimited', () => {
  beforeEach(() => {
    resetRateLimiter();
  });

  it('allows the first 5 requests from the same IP within the window', () => {
    const now = 1_000_000;
    const results = Array.from({ length: 5 }, () => isRateLimited('1.2.3.4', now));
    expect(results).toEqual([false, false, false, false, false]);
  });

  it('rejects the 6th request from the same IP within the window', () => {
    const now = 1_000_000;
    for (let i = 0; i < 5; i += 1) isRateLimited('1.2.3.4', now);
    expect(isRateLimited('1.2.3.4', now)).toBe(true);
  });

  it('tracks separate IPs independently', () => {
    const now = 1_000_000;
    for (let i = 0; i < 5; i += 1) isRateLimited('1.2.3.4', now);
    expect(isRateLimited('5.6.7.8', now)).toBe(false);
  });

  it('allows a request again once the 1-hour window has passed', () => {
    const start = 1_000_000;
    for (let i = 0; i < 5; i += 1) isRateLimited('1.2.3.4', start);
    expect(isRateLimited('1.2.3.4', start)).toBe(true);
    const oneHourAndOneMsLater = start + 60 * 60 * 1000 + 1;
    expect(isRateLimited('1.2.3.4', oneHourAndOneMsLater)).toBe(false);
  });
});

describe('getClientIp', () => {
  it('reads the first address from x-forwarded-for', () => {
    const req = { headers: { 'x-forwarded-for': '203.0.113.5, 10.0.0.1' } };
    expect(getClientIp(req)).toBe('203.0.113.5');
  });

  it('falls back to the socket remote address when no header is present', () => {
    const req = { headers: {}, socket: { remoteAddress: '198.51.100.9' } };
    expect(getClientIp(req)).toBe('198.51.100.9');
  });

  it('falls back to "unknown" when neither is available', () => {
    const req = { headers: {} };
    expect(getClientIp(req)).toBe('unknown');
  });
});
