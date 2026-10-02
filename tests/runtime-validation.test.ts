import { describe, expect, it } from 'vitest';
import { isValidCalendarDoor } from '../src/content/runtime-validation';
import type { CalendarDoor } from '../src/content/types';

describe('isValidCalendarDoor', () => {
  it('accepts a door with a valid activity', () => {
    const door: CalendarDoor = {
      number: 1,
      activities: [{ type: 'text', text: 'Welcome.' }],
    };

    expect(isValidCalendarDoor(door)).toBe(true);
  });

  it('rejects a door with an invalid activity payload', () => {
    const door = {
      number: 1,
      activities: [{ type: 'unknown' }],
    } as unknown as CalendarDoor;

    expect(isValidCalendarDoor(door)).toBe(false);
  });

  it('rejects a door without activities', () => {
    const door = {
      number: 1,
      activities: [],
    } satisfies CalendarDoor;

    expect(isValidCalendarDoor(door)).toBe(false);
  });
});
