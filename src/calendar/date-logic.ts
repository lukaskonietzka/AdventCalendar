const ADVENT_START_MONTH = 11;
const ADVENT_END_DAY = 24;

function createLocalDate(year: number, day: number): Date {
  return new Date(year, ADVENT_START_MONTH, day);
}

function getLocalDateKey(date: Date): number {
  return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
}

export function getCurrentCalendarYear(date: Date = new Date()): number {
  return date.getFullYear();
}

export function isDoorAvailable(
  calendarYear: number,
  doorNumber: number,
  date: Date = new Date(),
): boolean {
  const firstAdventDay = createLocalDate(calendarYear, 1);
  const doorDate = createLocalDate(calendarYear, doorNumber);
  const lastAdventDay = createLocalDate(calendarYear, ADVENT_END_DAY);
  const currentDate = getLocalDateKey(date);

  if (doorNumber < 1 || doorNumber > ADVENT_END_DAY) return false;
  return (
    currentDate >= getLocalDateKey(firstAdventDay) &&
    currentDate >= getLocalDateKey(doorDate) &&
    currentDate <= getLocalDateKey(lastAdventDay)
  );
}

export function getDaysUntilNextAdventStart(date: Date = new Date()): number {
  const currentYearStart = createLocalDate(date.getFullYear(), 1);
  const nextStart =
    getLocalDateKey(date) < getLocalDateKey(currentYearStart)
      ? currentYearStart
      : createLocalDate(date.getFullYear() + 1, 1);

  return Math.floor(
    (getLocalDateKey(nextStart) - getLocalDateKey(date)) / 86_400_000,
  );
}

export function isOutsideAdventPeriod(date: Date = new Date()): boolean {
  const start = createLocalDate(date.getFullYear(), 1);
  const end = createLocalDate(date.getFullYear(), ADVENT_END_DAY);
  const currentDate = getLocalDateKey(date);

  return (
    currentDate < getLocalDateKey(start) || currentDate > getLocalDateKey(end)
  );
}
