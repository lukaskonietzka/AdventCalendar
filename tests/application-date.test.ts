import { afterEach, describe, expect, it, vi } from 'vitest';
import { getApplicationDate } from '../src/calendar/application-date';

describe('getApplicationDate', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('uses the configured date when preview mode is enabled', () => {
    vi.stubEnv('VITE_PREVIEW_MODE', 'true');
    vi.stubEnv('VITE_PREVIEW_DATE', '2026-12-05');

    const applicationDate = getApplicationDate();

    expect(applicationDate.getFullYear()).toBe(2026);
    expect(applicationDate.getMonth()).toBe(11);
    expect(applicationDate.getDate()).toBe(5);
  });

  it('uses the real date when preview mode is disabled', () => {
    vi.stubEnv('VITE_PREVIEW_MODE', 'false');
    const before = new Date();

    const applicationDate = getApplicationDate();
    const after = new Date();

    expect(applicationDate.getTime()).toBeGreaterThanOrEqual(before.getTime());
    expect(applicationDate.getTime()).toBeLessThanOrEqual(after.getTime());
  });
});
