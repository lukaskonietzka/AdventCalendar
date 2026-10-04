import type { CalendarContent } from './types';

const calendarFiles = import.meta.glob('./*.json', {
  eager: true,
  import: 'default',
}) as Record<string, CalendarContent>;

export function getCalendarContent(year: number): CalendarContent | null {
  const calendarFile = `./${year}.json`;
  return calendarFiles[calendarFile] ?? null;
}
