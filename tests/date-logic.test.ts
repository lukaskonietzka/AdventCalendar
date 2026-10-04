import { describe, expect, it } from 'vitest';
import {
  getCurrentCalendarYear,
  getDaysUntilNextAdventStart,
  isCurrentAdventDay,
  isDoorAvailable,
  isOutsideAdventPeriod,
} from '../src/calendar/date-logic';

describe('Advent date logic', () => {
  it('uses the local calendar year', () => {
    expect(getCurrentCalendarYear(new Date(2026, 5, 10))).toBe(2026);
  });

  it('locks future doors and unlocks doors reached by the local date', () => {
    const date = new Date(2026, 11, 5);

    expect(isDoorAvailable(2026, 6, date)).toBe(false);
    expect(isDoorAvailable(2026, 5, date)).toBe(true);
  });

  it('keeps doors unavailable outside the Advent period', () => {
    expect(isDoorAvailable(2026, 1, new Date(2026, 10, 30))).toBe(false);
    expect(isDoorAvailable(2026, 24, new Date(2026, 11, 25))).toBe(false);
  });

  it('counts whole days until the next December 1', () => {
    expect(getDaysUntilNextAdventStart(new Date(2026, 10, 30, 23, 59))).toBe(1);
    expect(getDaysUntilNextAdventStart(new Date(2026, 11, 25))).toBe(341);
  });

  it('identifies dates outside Advent', () => {
    expect(isOutsideAdventPeriod(new Date(2026, 10, 30))).toBe(true);
    expect(isOutsideAdventPeriod(new Date(2026, 11, 24))).toBe(false);
  });

  it('identifies the current Advent door', () => {
    const date = new Date(2026, 11, 5);

    expect(isCurrentAdventDay(2026, 5, date)).toBe(true);
    expect(isCurrentAdventDay(2026, 4, date)).toBe(false);
    expect(isCurrentAdventDay(2027, 5, date)).toBe(false);
  });
});
