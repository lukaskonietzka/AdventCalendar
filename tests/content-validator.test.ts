import { describe, expect, it } from 'vitest';
import { validateCalendarContent } from '../scripts/content-validator.mjs';

const validActivity = { type: 'text', text: 'A valid activity.' };
const validContent = {
  year: 2026,
  doors: Array.from({ length: 24 }, (_, index) => ({
    number: index + 1,
    activities: [validActivity],
  })),
};

describe('validateCalendarContent', () => {
  it('accepts 24 uniquely numbered doors and supported activity types', () => {
    expect(validateCalendarContent(validContent, 'calendar.json')).toEqual([]);
  });

  it('rejects duplicate and out-of-range door numbers', () => {
    const content = structuredClone(validContent);
    content.doors[1].number = content.doors[0].number;
    content.doors[2].number = 25;

    expect(validateCalendarContent(content, 'calendar.json')).toEqual([
      'calendar.json: doors[1].number duplicates door 1.',
      'calendar.json: doors[2].number must be an integer from 1 to 24.',
    ]);
  });

  it('rejects unknown types and missing required fields', () => {
    const content = structuredClone(validContent);
    content.doors[0].activities = [{ type: 'video' }];
    content.doors[1].activities = [{ type: 'image', src: '/missing.png' }];

    expect(validateCalendarContent(content, 'calendar.json')).toEqual([
      'calendar.json: doors[0].activities[0].type must be one of text, image, riddle, or checklist.',
      'calendar.json: doors[1].activities[0].alt is required.',
    ]);
  });

  it('does not require image files to exist', () => {
    const content = structuredClone(validContent);
    content.doors[0].activities = [
      { type: 'image', src: '/not-yet-created.png', alt: 'A placeholder' },
    ];

    expect(validateCalendarContent(content, 'calendar.json')).toEqual([]);
  });
});
