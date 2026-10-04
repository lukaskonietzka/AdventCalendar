import { describe, expect, it } from 'vitest';
import {
  getEmptyProgress,
  loadYearProgress,
  saveYearProgress,
} from '../src/progress/progress-storage';

function createStorage(): Storage {
  const values = new Map<string, string>();

  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
    clear: () => values.clear(),
    key: (index) => [...values.keys()][index] ?? null,
    get length() {
      return values.size;
    },
  };
}

describe('progress storage', () => {
  it('stores progress separately for each calendar year', () => {
    const storage = createStorage();

    saveYearProgress(
      2026,
      { openedDoors: [1], completedActivities: ['2026-1-0'] },
      storage,
    );
    saveYearProgress(
      2027,
      { openedDoors: [2], completedActivities: ['2027-2-0'] },
      storage,
    );

    expect(loadYearProgress(2026, storage)).toEqual({
      openedDoors: [1],
      completedActivities: ['2026-1-0'],
    });
    expect(loadYearProgress(2027, storage)).toEqual({
      openedDoors: [2],
      completedActivities: ['2027-2-0'],
    });
  });

  it('returns empty progress for malformed storage data', () => {
    const storage = createStorage();
    storage.setItem('advent-calendar-progress', '{invalid');

    expect(loadYearProgress(2026, storage)).toEqual(getEmptyProgress());
  });
});
